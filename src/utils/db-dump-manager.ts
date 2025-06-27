import 'dotenv/config'
import { createReadStream, createWriteStream, unlinkSync } from 'fs'
import { Pool, PoolClient } from 'pg'
import { from as copyFrom } from 'pg-copy-streams'
import { Readable, Transform } from 'stream'
import { pipeline } from 'stream/promises'
import { createGunzip } from 'zlib'

import { GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'

interface DumpInfo {
  processorName: string
  blockHeight: number
  size: number
  key: string
}

interface RestoreLock {
  processorName: string
  timestamp: string
  processId: string
}

export class DBDumpManager {
  private pool: Pool
  private s3Client: S3Client
  private readonly BUCKET_NAME: string
  private readonly LOCK_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
  private readonly LOCK_KEY = 'db_restore_lock'

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

  async markDumpAsRestored({
    client,
    processorName,
    blockHeight,
  }: {
    client?: PoolClient
    processorName: string
    blockHeight: number
  }): Promise<void> {
    await (client || this.pool).query(
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

  async updateProcessingStatus(client: PoolClient, processorName: string, startTime: Date): Promise<void> {
    await client.query('UPDATE "processing_status" SET "start_timestamp" = $2 WHERE id = $1', [
      processorName.split('-')[0],
      startTime.toISOString(),
    ])
  }

  async acquireRestoreLock(processorName: string): Promise<boolean> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      // Check if there's an existing lock
      const existingLock = await client.query('SELECT data FROM "util_cache" WHERE id = $1', [this.LOCK_KEY])

      if (existingLock.rows.length > 0) {
        const lockData: RestoreLock = existingLock.rows[0].data
        const lockTimestamp = new Date(lockData.timestamp)
        const now = new Date()

        // Check if the lock has expired
        if (now.getTime() - lockTimestamp.getTime() > this.LOCK_TIMEOUT_MS) {
          console.log(`Removing expired restore lock for processor: ${lockData.processorName}`)
          await client.query('DELETE FROM "util_cache" WHERE id = $1', [this.LOCK_KEY])
        } else {
          // Lock is still valid
          await client.query('ROLLBACK')
          console.log(`Restore operation already in progress for processor: ${lockData.processorName}`)
          return false
        }
      }

      // Acquire the lock
      const lockData: RestoreLock = {
        processorName,
        timestamp: new Date().toISOString(),
        processId: process.pid.toString(),
      }

      await client.query('INSERT INTO "util_cache" (id, data) VALUES ($1, $2)', [this.LOCK_KEY, lockData])

      await client.query('COMMIT')
      console.log(`Acquired restore lock for processor: ${processorName}`)
      return true
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error acquiring restore lock:', error)
      return false
    } finally {
      client.release()
    }
  }

  async releaseRestoreLock(processorName: string): Promise<void> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      // Check if we own the lock
      const existingLock = await client.query('SELECT data FROM "util_cache" WHERE id = $1', [this.LOCK_KEY])

      if (existingLock.rows.length > 0) {
        const lockData: RestoreLock = existingLock.rows[0].data

        if (lockData.processorName === processorName && lockData.processId === process.pid.toString()) {
          await client.query('DELETE FROM "util_cache" WHERE id = $1', [this.LOCK_KEY])
          console.log(`Released restore lock for processor: ${processorName}`)
        } else {
          console.warn(`Cannot release lock: owned by ${lockData.processorName} (PID: ${lockData.processId})`)
        }
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error releasing restore lock:', error)
    } finally {
      client.release()
    }
  }

  async waitForRestoreLock(processorName: string, maxWaitMs: number = 60 * 60 * 1000): Promise<boolean> {
    const startTime = Date.now()
    const checkInterval = 30000 // Check every 30 seconds

    while (Date.now() - startTime < maxWaitMs) {
      if (await this.acquireRestoreLock(processorName)) {
        return true
      }

      console.log(
        `Waiting for restore lock to be available... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`,
      )
      await new Promise((resolve) => setTimeout(resolve, checkInterval))
    }

    console.error(`Timeout waiting for restore lock after ${maxWaitMs / 1000} seconds`)
    return false
  }

  async restoreDump(dumpInfo: DumpInfo): Promise<void> {
    // Acquire restore lock to ensure serial execution
    const lockAcquired = await this.acquireRestoreLock(dumpInfo.processorName)
    if (!lockAcquired && !(await this.waitForRestoreLock(dumpInfo.processorName))) {
      throw new Error(`Cannot start restore: another restore operation is already in progress`)
    }

    try {
      // Log the time at which we started the restore process
      const restoreStartTime = new Date()

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
      const client: PoolClient = await this.pool.connect()

      // Start a transaction to ensure data consistency during restore
      await client.query('BEGIN')

      try {
        // Write the compressed file
        const writeStream = createWriteStream(tempFile)
        await new Promise((resolve, reject) => {
          const stream = response.Body as any
          // const stream = createReadStream('dumps/dump_oethb-processor_30148800.sql.gz')
          stream.pipe(writeStream).on('error', reject).on('finish', resolve)
        })

        // Create a transform stream to execute COPY commands with staging tables
        let copyCommand: string | null = null
        let tableName: string | null = null
        let copyCommandData: string[] = []
        let partial: string | null = null
        let entityCount = 0

        let entitiesToIgnore = ['util_cache']

        const processLines = new Transform({
          objectMode: true,
          transform: function (
            this: DBDumpManager,
            chunk: Uint8Array,
            encoding: string,
            callback: (error?: Error | null) => void,
          ) {
            try {
              // Convert chunk to string for processing
              const chunkStr = Buffer.from(chunk).toString('utf8')

              // If we have a partial line from the previous chunk, prepend it
              const fullChunk = partial ? partial + chunkStr : chunkStr
              const lines = fullChunk.split('\n')

              // Keep the last line as partial if it doesn't end with a newline
              partial = chunkStr.endsWith('\n') ? null : lines.pop() || null

              let action = async () => {
                for (const line of lines) {
                  const shouldIgnore = entitiesToIgnore.some((entity) => line.includes(entity))
                  if (line.startsWith('COPY ') && !shouldIgnore) {
                    // Extract table name from COPY command
                    const match = line.match(/COPY (?:"?(?:\w+\.)?(\w+)"?)/)
                    if (match) {
                      tableName = match[1] // Just the table name, ignoring schema
                      const stagingTableName = `restore_${tableName}`

                      // Create staging table
                      await client.query(`CREATE TEMP TABLE ${stagingTableName} (LIKE ${tableName} INCLUDING ALL)`)

                      // Modify COPY command to use staging table
                      copyCommand = line.replace(tableName, stagingTableName).replace('public.', '')
                      copyCommandData = []
                      entityCount = 0
                    }
                  } else if (line === '\\.') {
                    if (copyCommandData.length > 0 && tableName) {
                      const stagingTableName = `restore_${tableName}`

                      // Copy data to staging table
                      const stream = client.query(copyFrom(copyCommand!))
                      const readable = Readable.from(copyCommandData)
                      await pipeline(readable, stream)
                      stream.end()
                      entityCount += copyCommandData.length

                      // Transfer data from staging to target table with conflict resolution
                      const insertResult = await client.query(`
                        INSERT INTO ${tableName}
                        SELECT * FROM ${stagingTableName}
                        ON CONFLICT (id) DO NOTHING
                      `)

                      console.log(`${copyCommand} (${entityCount} entities, ${insertResult.rowCount} inserted)`)

                      // Clean up staging table
                      await client.query(`DROP TABLE ${stagingTableName}`)
                    }

                    copyCommand = null
                    tableName = null
                    copyCommandData = []
                  } else if (copyCommand && line.length > 0) {
                    copyCommandData.push(line + '\n')
                  }
                }

                // Handle large batches by periodically flushing to staging table
                if (copyCommandData.length > 10000) {
                  const stream = client.query(copyFrom(copyCommand!))
                  const readable = Readable.from(copyCommandData)
                  await pipeline(readable, stream)
                  stream.end()
                  entityCount += copyCommandData.length
                  copyCommandData = []
                }
              }

              action()
                .then(() => callback())
                .catch(callback)
            } catch (error) {
              console.error('Error processing chunk:', error)
              callback(error as Error)
            }
          }.bind(this),
        })

        // Stream the file through decompression and SQL execution
        console.log('Starting database data restore...')
        await pipeline(createReadStream(tempFile), createGunzip(), processLines)

        // Clean up the temporary file
        unlinkSync(tempFile)

        // Mark as restored with block height
        await this.markDumpAsRestored({
          client,
          processorName: dumpInfo.processorName,
          blockHeight: dumpInfo.blockHeight,
        })

        // Update the processing status table with the start time
        await this.updateProcessingStatus(client, dumpInfo.processorName, restoreStartTime)

        await client.query('COMMIT')

        console.log('Database dump restored successfully')
        console.log(`Inserted ${entityCount} entities`)
      } catch (error) {
        await client.query('ROLLBACK')
        // Clean up the temporary file in case of error
        try {
          unlinkSync(tempFile)
        } catch (e) {
          // Ignore cleanup errors
        }
        console.error('Error restoring database dump:', error)
        throw error
      } finally {
        client.release()
      }
    } finally {
      // Always release the lock, even if an error occurred
      await this.releaseRestoreLock(dumpInfo.processorName)
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}
