import { spawn } from 'child_process'
import 'dotenv/config'
import { Pool } from 'pg'

import { GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'

interface DumpInfo {
  processorName: string
  blockHeight: number
  size: number
  key: string
}

export class DBDumpManager {
  private pool: Pool
  private s3Client: S3Client
  private readonly BUCKET_NAME: string

  constructor() {
    // Validate required environment variables
    const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASS']

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    })

    this.s3Client = new S3Client({
      region: 'us-east-1',
      ...(process.env.AWS_ACCESS_KEY_ID
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
          }
        : { profile: 'origin' }),
    })

    this.BUCKET_NAME = 'origin-squid'
  }

  async listAvailableDumps(): Promise<DumpInfo[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.BUCKET_NAME,
      Prefix: 'dumps/',
    })

    try {
      const response = await this.s3Client.send(command)
      const dumps: DumpInfo[] = []

      for (const object of response.Contents || []) {
        if (!object.Key) continue

        // Parse dump info from filename (format: dumps/dump_processor-name_block-height.dump)
        const match = object.Key.match(/dumps\/dump_([^_]+)_(\d+)\.dump/)
        if (match) {
          dumps.push({
            processorName: match[1],
            blockHeight: parseInt(match[2]),
            size: object.Size || 0,
            key: object.Key,
          })
        }
      }

      return dumps
    } catch (error) {
      throw error
    }
  }

  async hasRestoredDump(processorName: string): Promise<boolean> {
    const result = await this.pool.query('SELECT data FROM "util_cache" WHERE id = $1', [
      `dump_restored_${processorName}`,
    ])
    return result.rows.length > 0
  }

  async getRestoredBlockHeight(processorName: string): Promise<number | null> {
    const result = await this.pool.query('SELECT data FROM "util_cache" WHERE id = $1', [
      `dump_restored_${processorName}`,
    ])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0].data.blockHeight
  }

  async markDumpAsRestored(processorName: string, blockHeight: number): Promise<void> {
    await this.pool.query(
      'INSERT INTO "util_cache" (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
      [
        `dump_restored_${processorName}`,
        {
          restored: true,
          timestamp: new Date().toISOString(),
          blockHeight,
        },
      ],
    )
  }

  async restoreDump(dumpInfo: DumpInfo): Promise<void> {
    // Download the dump file from S3
    const command = new GetObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: dumpInfo.key,
    })

    console.log(`Downloading database dump: ${JSON.stringify(dumpInfo)}`)

    const response: GetObjectCommandOutput = await this.s3Client.send(command)
    if (!response.Body) {
      throw new Error('No body in S3 response')
    }

    // Create a temporary file to store the dump
    const tempFile = `/tmp/${dumpInfo.key.split('/').pop()}`
    const fs = require('fs')

    // Create a write stream and pipe the S3 response body directly to it
    const writeStream = fs.createWriteStream(tempFile)
    await new Promise((resolve, reject) => {
      const stream = response.Body as any
      stream.pipe(writeStream).on('error', reject).on('finish', resolve)
    })

    // Construct the pg_restore command
    const restoreCommand = `pg_restore -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} --data-only --no-owner --no-privileges -n public ${tempFile}`

    console.log(`Starting database restore: ${JSON.stringify(dumpInfo)}`)

    // Use spawn with promise handling
    const [cmd, ...args] = restoreCommand.split(' ')
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        PGPASSWORD: process.env.DB_PASS,
      },
    })

    await new Promise<void>((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`pg_restore failed with exit code ${code}`))
        }
      })
      child.on('error', reject)
    })

    // Clean up the temporary file
    require('fs').unlinkSync(tempFile)

    // Mark as restored with block height
    await this.markDumpAsRestored(dumpInfo.processorName, dumpInfo.blockHeight)
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}
