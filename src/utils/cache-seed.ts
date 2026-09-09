/**
 * Cold-start seed for the RPC and Portal caches: downloads the per-processor
 * SQLite file a previous run backed up to the object store, so a fresh
 * container replays it instead of re-fetching every historic chunk.
 * `scripts/cache-s3.ts` writes the same layout in the other direction.
 *
 * Off by default; opt-in via `CACHE_SEED=true`. Best-effort throughout: a
 * missing object, a failed transfer or a bad credential leaves the processor
 * with a cold cache rather than failing the boot.
 *
 * Only seeds a cache whose local file is absent — the local copy is always at
 * least as fresh as the backup.
 */
import { createWriteStream, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { CacheLocation, bucketName, cacheLocations, createObjectStoreClient } from './object-store'

async function seedCache(client: S3Client, cache: CacheLocation, stateSchema: string): Promise<void> {
  const destination = join(cache.dir, `${stateSchema}.sqlite`)
  if (existsSync(destination)) return

  const key = `${cache.prefix}${stateSchema}.sqlite`
  const partial = `${destination}.part`
  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }))
    if (!response.Body) throw new Error('no body in response')
    mkdirSync(cache.dir, { recursive: true })
    await pipeline(response.Body as Readable, createWriteStream(partial))
    renameSync(partial, destination)
    // Leftover journal files from a previous local copy would shadow the
    // freshly downloaded database.
    for (const suffix of ['-wal', '-shm']) rmSync(`${destination}${suffix}`, { force: true })
    console.log(`[cache-seed ${stateSchema}] seeded ${cache.name} cache from s3://${bucketName}/${key}`)
  } catch (err) {
    rmSync(partial, { force: true })
    console.warn(
      `[cache-seed ${stateSchema}] no ${cache.name} seed from s3://${bucketName}/${key}: ${(err as Error).message}`,
    )
  }
}

export async function seedCaches(stateSchema: string): Promise<void> {
  if (!process.env.CACHE_SEED || process.env.CACHE_SEED === 'false' || process.env.CACHE_SEED === '0') {
    return
  }
  const client = createObjectStoreClient()
  try {
    for (const cache of cacheLocations()) {
      await seedCache(client, cache, stateSchema)
    }
  } catch (err) {
    console.warn(`[cache-seed ${stateSchema}] seeding failed: ${(err as Error).message}`)
  } finally {
    client.destroy()
  }
}
