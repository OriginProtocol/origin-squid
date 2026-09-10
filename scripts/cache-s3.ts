/**
 * Back up the local portal/rpc caches to the object store and restore them back.
 *
 * The caches (`.portal-cache`, `.rpc-cache`) are per-processor SQLite files
 * named `<processor>.sqlite`. They only accelerate the historic-load phase
 * and are append-only, so the bucket is a durable backup / share point — and
 * the source a processor's own `CACHE_SEED` step pulls from on a cold start.
 *
 * Bucket, region, endpoint and credentials come from `src/utils/object-store`,
 * so this writes to exactly the bucket the seed reads (`BUCKET_NAME`,
 * `BUCKET_REGION`, `BUCKET_ENDPOINT`).
 *
 * Layout:
 *   .portal-cache/<processor>.sqlite  <->  <bucket>/cache/portal/<processor>.sqlite
 *   .rpc-cache/<processor>.sqlite     <->  <bucket>/cache/rpc/<processor>.sqlite
 *
 * Usage:
 *   ts-node scripts/cache-s3.ts backup  [processor] [--cache portal|rpc|all] [--profile <aws>] [-y] [--dry-run]
 *   ts-node scripts/cache-s3.ts restore [processor] [--cache portal|rpc|all] [--profile <aws>] [-y] [--force] [--dry-run]
 *   ts-node scripts/cache-s3.ts list    [processor] [--cache portal|rpc|all] [--profile <aws>]
 *
 *   processor   e.g. oeth-processor. Omit to operate on every cache found
 *               (locally for backup, in the bucket for restore).
 *   --cache     which cache(s) to act on (default: all).
 *   --profile   AWS shared-config profile to authenticate with; overrides the
 *               default credential choice (`AWS_ACCESS_KEY_ID` if set, else
 *               `AWS_PROFILE`, else the `origin` profile).
 *   -y/--yes    skip the overwrite confirmation (restore) and the
 *               running-processor warning (backup).
 *   --force     restore: overwrite local even when it looks newer than the bucket.
 *   --dry-run   print what would happen, transfer nothing.
 *
 * Restore NEVER overwrites a local cache without confirmation — the local
 * copy is almost always more up to date than the bucket. In a non-interactive
 * shell it skips existing files unless -y/--force is passed.
 */
import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { createInterface } from 'readline'

import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import {
  CacheLocation,
  bucketName,
  cacheLocations,
  createObjectStoreClient,
  downloadToFile,
} from '../src/utils/object-store'

const CACHES = Object.fromEntries(cacheLocations().map((cache) => [cache.name, cache])) as Record<
  'portal' | 'rpc',
  CacheLocation
>

interface Args {
  command: 'backup' | 'restore' | 'list'
  processor?: string
  caches: CacheLocation[]
  awsProfile?: string
  assumeYes: boolean
  force: boolean
  dryRun: boolean
}

function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const command = argv[0] as Args['command']
  if (!['backup', 'restore', 'list'].includes(command)) {
    console.error(
      'Usage: cache-s3.ts <backup|restore|list> [processor] [--cache portal|rpc|all] [--profile <aws>] [-y] [--force] [--dry-run]',
    )
    process.exit(1)
  }

  let processor: string | undefined
  let cacheSel = 'all'
  let awsProfile: string | undefined
  let assumeYes = false
  let force = false
  let dryRun = false

  for (let i = 1; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--cache' && argv[i + 1]) {
      cacheSel = argv[++i]
    } else if (a === '--profile' && argv[i + 1]) {
      awsProfile = argv[++i]
    } else if (a === '-y' || a === '--yes') {
      assumeYes = true
    } else if (a === '--force') {
      force = true
    } else if (a === '--dry-run') {
      dryRun = true
    } else if (a === '--') {
      // pnpm/npm forward a bare `--` separator; ignore it.
      continue
    } else if (!a.startsWith('-')) {
      processor = a
    } else {
      console.error(`Unknown argument: ${a}`)
      process.exit(1)
    }
  }

  if (cacheSel !== 'portal' && cacheSel !== 'rpc' && cacheSel !== 'all') {
    console.error(`--cache must be portal, rpc, or all (got ${cacheSel})`)
    process.exit(1)
  }
  const caches = cacheSel === 'all' ? [CACHES.portal, CACHES.rpc] : [CACHES[cacheSel as 'portal' | 'rpc']]

  return { command, processor, caches, awsProfile, assumeYes, force, dryRun }
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let v = n / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(1)} ${units[i]}`
}

function fmtDate(d?: Date): string {
  return d ? d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : '—'
}

function cacheKey(cache: CacheLocation, processor: string): string {
  return `${cache.prefix}${processor}.sqlite`
}

function objectUrl(key: string): string {
  return `s3://${bucketName}/${key}`
}

interface RemoteInfo {
  size: number
  lastModified?: Date
}

function isNotFound(err: unknown): boolean {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } }
  return e?.$metadata?.httpStatusCode === 404 || e?.name === 'NotFound' || e?.name === 'NoSuchKey'
}

async function headRemote(client: S3Client, key: string): Promise<RemoteInfo | null> {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }))
    return { size: head.ContentLength ?? 0, lastModified: head.LastModified }
  } catch (err) {
    if (isNotFound(err)) return null
    throw new Error(`head-object failed for ${key}: ${(err as Error).message}`)
  }
}

async function listRemoteProcessors(client: S3Client, cache: CacheLocation): Promise<string[]> {
  const out: string[] = []
  let continuationToken: string | undefined
  do {
    const page = await client.send(
      new ListObjectsV2Command({ Bucket: bucketName, Prefix: cache.prefix, ContinuationToken: continuationToken }),
    )
    for (const object of page.Contents ?? []) {
      const base = object.Key?.slice(cache.prefix.length)
      if (base && base.endsWith('.sqlite')) out.push(base.replace(/\.sqlite$/, ''))
    }
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (continuationToken)
  return out
}

function listLocalProcessors(cache: CacheLocation): string[] {
  if (!fs.existsSync(cache.dir)) return []
  return fs
    .readdirSync(cache.dir)
    .filter((f) => f.endsWith('.sqlite'))
    .map((f) => f.replace(/\.sqlite$/, ''))
}

async function promptYesNo(message: string): Promise<boolean> {
  if (!process.stdin.isTTY) return false
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    const answer: string = await new Promise((resolve) => rl.question(message, resolve))
    const a = answer.trim().toLowerCase()
    return a === 'y' || a === 'yes'
  } finally {
    rl.close()
  }
}

/**
 * Upload the `.sqlite` alone — the `-wal`/`-shm` sidecars are worthless away
 * from the machine that wrote them, and `checkpointWal` has already folded the
 * WAL's contents into the file. `ContentLength` is required for a stream body.
 */
async function uploadFile(client: S3Client, localPath: string, key: string): Promise<void> {
  const size = fs.statSync(localPath).size
  console.log(`  uploading ${fmtBytes(size)} to ${objectUrl(key)}`)
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fs.createReadStream(localPath),
      ContentLength: size,
    }),
  )
}

/**
 * Collapse the WAL into the main .sqlite so a single-file upload is
 * consistent. Returns false (and warns) if a -wal remains non-empty after
 * the checkpoint, which means a processor is probably still writing.
 */
function checkpointWal(filePath: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require('better-sqlite3')
  const db = new Database(filePath)
  try {
    db.pragma('wal_checkpoint(TRUNCATE)')
  } finally {
    db.close()
  }
  const wal = `${filePath}-wal`
  if (fs.existsSync(wal) && fs.statSync(wal).size > 0) return false
  return true
}

async function resolveProcessors(client: S3Client, args: Args, cache: CacheLocation): Promise<string[]> {
  if (args.processor) return [args.processor]
  return args.command === 'backup' ? listLocalProcessors(cache) : await listRemoteProcessors(client, cache)
}

async function runBackup(client: S3Client, args: Args) {
  for (const cache of args.caches) {
    const processors = await resolveProcessors(client, args, cache)
    if (processors.length === 0) {
      console.log(`[${cache.name}] no local caches found in ${cache.dir}`)
      continue
    }
    for (const processor of processors) {
      const localPath = path.join(cache.dir, `${processor}.sqlite`)
      if (!fs.existsSync(localPath)) {
        console.warn(`[${cache.name}] ${processor}: local file missing (${localPath}); skipping`)
        continue
      }

      console.log(`\n[${cache.name}] ${processor}`)
      console.log(`  local:  ${localPath} (${fmtBytes(fs.statSync(localPath).size)})`)
      const remote = await headRemote(client, cacheKey(cache, processor))
      console.log(`  remote: ${remote ? `${fmtBytes(remote.size)} @ ${fmtDate(remote.lastModified)}` : '(none)'}`)

      if (args.dryRun) {
        console.log('  dry-run: would checkpoint WAL and upload')
        continue
      }

      const clean = checkpointWal(localPath)
      if (!clean) {
        console.warn('  WARNING: WAL still has unflushed data after checkpoint — a processor may be running.')
        console.warn('  The upload could miss recent writes. Stop the processor for a clean backup.')
        if (!args.assumeYes && !(await promptYesNo('  Upload anyway? [y/N]: '))) {
          console.log('  skipped')
          continue
        }
      }
      await uploadFile(client, localPath, cacheKey(cache, processor))
      console.log('  uploaded')
    }
  }
}

async function runRestore(client: S3Client, args: Args) {
  for (const cache of args.caches) {
    const processors = await resolveProcessors(client, args, cache)
    if (processors.length === 0) {
      console.log(`[${cache.name}] nothing to restore`)
      continue
    }
    for (const processor of processors) {
      const localPath = path.join(cache.dir, `${processor}.sqlite`)
      const key = cacheKey(cache, processor)
      const remote = await headRemote(client, key)
      if (!remote) {
        console.warn(`[${cache.name}] ${processor}: not found at ${objectUrl(key)}; skipping`)
        continue
      }

      console.log(`\n[${cache.name}] ${processor}`)
      console.log(`  remote: ${fmtBytes(remote.size)} @ ${fmtDate(remote.lastModified)}`)

      const localExists = fs.existsSync(localPath)
      if (localExists) {
        const stat = fs.statSync(localPath)
        const localNewer = stat.mtime > (remote.lastModified ?? new Date(0))
        console.log(`  local:  ${localPath} (${fmtBytes(stat.size)} @ ${fmtDate(stat.mtime)})`)
        console.log(`  ${localNewer ? 'Local looks NEWER than the bucket.' : 'The bucket looks newer than local.'}`)

        // Local is the source of truth — never clobber it silently.
        if (!args.force && !args.assumeYes) {
          if (!process.stdin.isTTY) {
            console.warn(
              '  non-interactive shell: refusing to overwrite local. Pass -y or --force to override. Skipping.',
            )
            continue
          }
          const ok = await promptYesNo(`  Overwrite local cache with the stored copy? [y/N]: `)
          if (!ok) {
            console.log('  kept local')
            continue
          }
        }
      }

      if (args.dryRun) {
        console.log(`  dry-run: would download into ${localPath}`)
        continue
      }

      console.log(`  downloading ${objectUrl(key)}`)
      await downloadToFile(client, key, localPath)
      console.log('  restored')
    }
  }
}

async function runList(client: S3Client, args: Args) {
  for (const cache of args.caches) {
    console.log(`\n[${cache.name}] ${objectUrl(cache.prefix)}`)
    const remoteProcs = args.processor ? [args.processor] : await listRemoteProcessors(client, cache)
    const localProcs = new Set(listLocalProcessors(cache))
    const all = new Set([...remoteProcs, ...localProcs])
    if (all.size === 0) {
      console.log('  (empty)')
      continue
    }
    for (const processor of [...all].sort()) {
      const remote = await headRemote(client, cacheKey(cache, processor))
      const localPath = path.join(cache.dir, `${processor}.sqlite`)
      const local = fs.existsSync(localPath) ? fs.statSync(localPath) : null
      console.log(
        `  ${processor.padEnd(20)} ` +
          `s3: ${(remote ? `${fmtBytes(remote.size)} @ ${fmtDate(remote.lastModified)}` : '—').padEnd(34)} ` +
          `local: ${local ? `${fmtBytes(local.size)} @ ${fmtDate(local.mtime)}` : '—'}`,
      )
    }
  }
}

async function main() {
  const args = parseArgs()
  const client = createObjectStoreClient({ profile: args.awsProfile })
  try {
    if (args.command === 'backup') await runBackup(client, args)
    else if (args.command === 'restore') await runRestore(client, args)
    else await runList(client, args)
  } finally {
    client.destroy()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
