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
 * otherwise the local `origin` profile. Callers treat an absent key id as
 * "bucket unreachable" and skip.
 */
import { S3Client } from '@aws-sdk/client-s3'

export const bucketName = process.env.BUCKET_NAME ?? 'origin-squid'

export interface CacheLocation {
  name: 'rpc' | 'portal'
  dir: string
  prefix: string
}

export const cacheLocations = (): CacheLocation[] => [
  { name: 'rpc', dir: process.env.RPC_CACHE_DIR ?? '.rpc-cache', prefix: 'cache/rpc/' },
  { name: 'portal', dir: process.env.PORTAL_CACHE_DIR ?? '.portal-cache', prefix: 'cache/portal/' },
]

export function createObjectStoreClient(): S3Client {
  return new S3Client({
    region: process.env.BUCKET_REGION ?? 'us-east-1',
    // Virtual-host addressing is the SDK default and what the Railway bucket's
    // credentials declare, so `forcePathStyle` stays unset.
    ...(process.env.BUCKET_ENDPOINT ? { endpoint: process.env.BUCKET_ENDPOINT } : {}),
    ...(process.env.AWS_ACCESS_KEY_ID
      ? {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        }
      : { profile: 'origin' }),
  })
}
