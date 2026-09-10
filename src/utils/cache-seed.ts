/**
 * Cold-start seed for the RPC and Portal caches: downloads the per-processor
 * SQLite file a previous run backed up to the object store, so a fresh
 * container replays it instead of re-fetching every historic chunk.
 * `scripts/cache-s3.ts` writes the same layout in the other direction.
 *
 * Off by default; opt-in via `CACHE_SEED=true`, and only for caches that are
 * themselves on (`RPC_CACHE`, `PORTAL_CACHE`). Best-effort throughout: a
 * missing object, a failed transfer or a bad credential leaves the processor
 * with a cold cache rather than failing the boot.
 *
 * Only seeds a cache whose local file is absent — the local copy is always at
 * least as fresh as the backup.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { S3Client } from '@aws-sdk/client-s3'

import { envEnabled } from './env'
import { CacheLocation, bucketName, cacheLocations, createObjectStoreClient, downloadToFile } from './object-store'

async function seedCache(client: S3Client, cache: CacheLocation, stateSchema: string): Promise<void> {
  const destination = join(cache.dir, `${stateSchema}.sqlite`)
  if (existsSync(destination)) {
    console.log(`[cache-seed ${stateSchema}] ${cache.name} cache already present at ${destination}`)
    return
  }

  const key = `${cache.prefix}${stateSchema}.sqlite`
  try {
    await downloadToFile(client, key, destination)
    console.log(`[cache-seed ${stateSchema}] seeded ${cache.name} cache from s3://${bucketName}/${key}`)
  } catch (err) {
    console.warn(
      `[cache-seed ${stateSchema}] no ${cache.name} seed from s3://${bucketName}/${key}: ${(err as Error).message}`,
    )
  }
}

export async function seedCaches(stateSchema: string): Promise<void> {
  if (!envEnabled('CACHE_SEED')) {
    console.log(`[cache-seed ${stateSchema}] disabled (CACHE_SEED is not set)`)
    return
  }

  const caches = cacheLocations().filter((cache) => envEnabled(cache.enabledBy))
  if (caches.length === 0) {
    console.log(`[cache-seed ${stateSchema}] no cache enabled (RPC_CACHE, PORTAL_CACHE both off)`)
    return
  }

  const client = createObjectStoreClient()
  try {
    for (const cache of caches) {
      await seedCache(client, cache, stateSchema)
    }
  } catch (err) {
    console.warn(`[cache-seed ${stateSchema}] seeding failed: ${(err as Error).message}`)
  } finally {
    client.destroy()
  }
}
