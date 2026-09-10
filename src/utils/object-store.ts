/**
 * The S3-compatible bucket holding database dumps (`dumps/`) and cache
 * backups (`cache/rpc/`, `cache/portal/`).
 *
 * Env knobs:
 *   BUCKET_NAME       default `origin-squid`
 *   BUCKET_REGION     default `us-east-1`
 *   BUCKET_ENDPOINT   non-AWS S3 endpoint, e.g. a Railway bucket (default: AWS)
 *
 * Credentials come from `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` when set,
 * otherwise from `AWS_PROFILE`, otherwise the `origin` profile. Callers treat
 * an absent key id as "bucket unreachable" and skip.
 */
import { createWriteStream, mkdirSync, renameSync, rmSync } from 'node:fs'
import { dirname } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const bucketName = process.env.BUCKET_NAME ?? 'origin-squid'

export interface CacheLocation {
  name: 'rpc' | 'portal'
  dir: string
  prefix: string
  /** Env flag that turns the cache itself on; nothing else is worth seeding. */
  enabledBy: 'RPC_CACHE' | 'PORTAL_CACHE'
}

export const cacheLocations = (): CacheLocation[] => [
  { name: 'rpc', dir: process.env.RPC_CACHE_DIR ?? '.rpc-cache', prefix: 'cache/rpc/', enabledBy: 'RPC_CACHE' },
  {
    name: 'portal',
    dir: process.env.PORTAL_CACHE_DIR ?? '.portal-cache',
    prefix: 'cache/portal/',
    enabledBy: 'PORTAL_CACHE',
  },
]

export function createObjectStoreClient(options: { profile?: string } = {}): S3Client {
  return new S3Client({
    region: process.env.BUCKET_REGION ?? 'us-east-1',
    // Virtual-host addressing is the SDK default and what the Railway bucket's
    // credentials declare, so `forcePathStyle` stays unset. Default checksums
    // put uploads in `aws-chunked` framing with a trailing checksum header,
    // which non-AWS implementations don't all decode; ask for them only where
    // an operation requires them.
    ...(process.env.BUCKET_ENDPOINT
      ? {
          endpoint: process.env.BUCKET_ENDPOINT,
          requestChecksumCalculation: 'WHEN_REQUIRED' as const,
          responseChecksumValidation: 'WHEN_REQUIRED' as const,
        }
      : {}),
    ...(!options.profile && process.env.AWS_ACCESS_KEY_ID
      ? {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        }
      : { profile: options.profile ?? process.env.AWS_PROFILE ?? 'origin' }),
  })
}

/**
 * Stream an object to `destination` through a `.part` file, so an interrupted
 * transfer never leaves a half-written database in place. Drops WAL/SHM
 * sidecars left by a previous local copy — they would shadow the new file.
 */
export async function downloadToFile(client: S3Client, key: string, destination: string): Promise<void> {
  const partial = `${destination}.part`
  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }))
    if (!response.Body) throw new Error('no body in response')
    mkdirSync(dirname(destination), { recursive: true })
    await pipeline(response.Body as Readable, createWriteStream(partial))
    renameSync(partial, destination)
    for (const suffix of ['-wal', '-shm']) rmSync(`${destination}${suffix}`, { force: true })
  } catch (err) {
    rmSync(partial, { force: true })
    throw err
  }
}
