import { exec } from 'child_process'
import 'dotenv/config'
import { Pool } from 'pg'
import { promisify } from 'util'

import { GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'

const execAsync = promisify(exec)

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

        // Parse dump info from filename (format: dumps/dump_processor-name_block-height.sql.gz)
        const match = object.Key.match(/dumps\/dump_([^_]+)_(\d+)\.sql.gz/)
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

    try {
      // Check if the file is compressed (gzip)
      const isCompressed = await this.isGzipped(tempFile)
      let sqlFile = tempFile

      if (isCompressed) {
        console.log('Decompressing dump file...')
        sqlFile = tempFile.replace('.sql.gz', '.sql')
        await execAsync(`gunzip -c ${tempFile} > ${sqlFile}`)
      }

      // Execute the SQL file
      console.log('Executing SQL file...')
      const restoreCommand = `PGPASSWORD=${process.env.DB_PASS} psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f ${sqlFile}`

      console.log('Starting database data restore...')
      const { stdout, stderr } = await execAsync(restoreCommand)

      if (stderr) {
        console.error('Warning:', stderr)
      }

      // Clean up the temporary files
      fs.unlinkSync(tempFile)
      if (isCompressed) {
        fs.unlinkSync(sqlFile)
      }

      // Mark as restored with block height
      await this.markDumpAsRestored(dumpInfo.processorName, dumpInfo.blockHeight)
    } catch (error) {
      // Clean up the temporary file in case of error
      fs.unlinkSync(tempFile)
      throw error
    }
  }

  private async isGzipped(filePath: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`file ${filePath}`)
      return stdout.includes('gzip compressed data')
    } catch (error) {
      console.error('Error checking file type:', error)
      return false
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}
