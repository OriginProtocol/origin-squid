/**
 * Back up the local portal/rpc caches to S3 and restore them back.
 *
 * The caches (`.portal-cache`, `.rpc-cache`) are per-processor SQLite files
 * named `<processor>.sqlite`. They only accelerate the historic-load phase
 * and are append-only, so S3 is just a durable backup / share point for the
 * dev box that generates DB dumps — NOT a deployment dependency.
 *
 * Everything goes through the `aws` CLI (metadata via `s3api` with JSON
 * output, transfers via `s3 cp`). That's deliberate: the CLI resolves
 * whatever credential mechanism is active in your shell — including custom
 * `aws login` setups the JS SDK can't understand — so if `aws s3 ls` works
 * in your console, this tool works too. No `--profile` needed unless you
 * want to override the ambient config.
 *
 * Layout:
 *   .portal-cache/<processor>.sqlite  <->  s3://origin-squid/cache/portal/<processor>.sqlite
 *   .rpc-cache/<processor>.sqlite     <->  s3://origin-squid/cache/rpc/<processor>.sqlite
 *
 * Usage:
 *   tsx scripts/cache-s3.ts backup  [processor] [--cache portal|rpc|all] [--profile <aws>] [-y] [--dry-run]
 *   tsx scripts/cache-s3.ts restore [processor] [--cache portal|rpc|all] [--profile <aws>] [-y] [--force] [--dry-run]
 *   tsx scripts/cache-s3.ts list    [processor] [--cache portal|rpc|all] [--profile <aws>]
 *
 *   processor   e.g. oeth-processor. Omit to operate on every cache found
 *               (locally for backup, in S3 for restore).
 *   --cache     which cache(s) to act on (default: all).
 *   --profile   AWS CLI profile to pass through (default: ambient config).
 *   -y/--yes    skip the overwrite confirmation (restore) and the
 *               running-processor warning (backup).
 *   --force     restore: overwrite local even when it looks newer than S3.
 *   --dry-run   print what would happen, transfer nothing.
 *
 * Restore NEVER overwrites a local cache without confirmation — the local
 * copy is almost always more up to date than S3. In a non-interactive shell
 * it skips existing files unless -y/--force is passed.
 */
import { spawn } from 'child_process'
import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { createInterface } from 'readline'

const BUCKET = 'origin-squid'

interface CacheKind {
  name: 'portal' | 'rpc'
  dir: string
  prefix: string // s3 prefix, e.g. cache/portal/
}

const CACHES: Record<'portal' | 'rpc', CacheKind> = {
  portal: { name: 'portal', dir: process.env.PORTAL_CACHE_DIR ?? '.portal-cache', prefix: 'cache/portal/' },
  rpc: { name: 'rpc', dir: process.env.RPC_CACHE_DIR ?? '.rpc-cache', prefix: 'cache/rpc/' },
}

interface Args {
  command: 'backup' | 'restore' | 'list'
  processor?: string
  caches: CacheKind[]
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

/** Prepend the `aws` argv with `--profile` when one was requested. */
function withProfile(args: string[], awsProfile?: string): string[] {
  return awsProfile ? [...args, '--profile', awsProfile] : args
}

interface AwsResult {
  code: number
  stdout: string
  stderr: string
}

/** Run the `aws` CLI, capturing stdout/stderr (or streaming when `inherit`). */
function runAws(args: string[], opts: { inherit?: boolean } = {}): Promise<AwsResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('aws', args, {
      stdio: opts.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    if (!opts.inherit) {
      child.stdout!.on('data', (d: Buffer) => (stdout += d.toString()))
      child.stderr!.on('data', (d: Buffer) => (stderr += d.toString()))
    }
    child.on('error', (err: any) => {
      if (err?.code === 'ENOENT') {
        reject(new Error('The AWS CLI (`aws`) is required but was not found on PATH.'))
      } else {
        reject(err)
      }
    })
    child.on('close', (code) => resolve({ code: code ?? 0, stdout, stderr }))
  })
}

interface RemoteInfo {
  size: number
  lastModified?: Date
}

async function headRemote(key: string, awsProfile?: string): Promise<RemoteInfo | null> {
  const { code, stdout, stderr } = await runAws(
    withProfile(['s3api', 'head-object', '--bucket', BUCKET, '--key', key, '--output', 'json'], awsProfile),
  )
  if (code !== 0) {
    if (/\b404\b|Not Found|NoSuchKey/i.test(stderr)) return null
    throw new Error(`aws s3api head-object failed for ${key}: ${stderr.trim()}`)
  }
  const j = JSON.parse(stdout)
  return { size: j.ContentLength ?? 0, lastModified: j.LastModified ? new Date(j.LastModified) : undefined }
}

async function listRemoteProcessors(cache: CacheKind, awsProfile?: string): Promise<string[]> {
  const { code, stdout, stderr } = await runAws(
    withProfile(['s3api', 'list-objects-v2', '--bucket', BUCKET, '--prefix', cache.prefix, '--output', 'json'], awsProfile),
  )
  if (code !== 0) {
    throw new Error(`aws s3api list-objects-v2 failed: ${stderr.trim()}`)
  }
  // An empty prefix yields empty stdout with exit 0.
  const j = stdout.trim() ? JSON.parse(stdout) : {}
  const out: string[] = []
  for (const obj of j.Contents ?? []) {
    const base = (obj.Key as string)?.slice(cache.prefix.length)
    if (base && base.endsWith('.sqlite')) out.push(base.replace(/\.sqlite$/, ''))
  }
  return out
}

function listLocalProcessors(cache: CacheKind): string[] {
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

async function awsCp(src: string, dst: string, awsProfile?: string): Promise<void> {
  const args = withProfile(['s3', 'cp', src, dst], awsProfile)
  console.log(`  aws ${args.join(' ')}`)
  const { code } = await runAws(args, { inherit: true })
  if (code !== 0) throw new Error(`aws s3 cp failed (exit ${code})`)
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

function s3Url(cache: CacheKind, processor: string): string {
  return `s3://${BUCKET}/${cache.prefix}${processor}.sqlite`
}

async function resolveProcessors(args: Args, cache: CacheKind): Promise<string[]> {
  if (args.processor) return [args.processor]
  return args.command === 'backup' ? listLocalProcessors(cache) : await listRemoteProcessors(cache, args.awsProfile)
}

async function runBackup(args: Args) {
  for (const cache of args.caches) {
    const processors = await resolveProcessors(args, cache)
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
      const remote = await headRemote(`${cache.prefix}${processor}.sqlite`, args.awsProfile)
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
      await awsCp(localPath, s3Url(cache, processor), args.awsProfile)
      console.log('  uploaded')
    }
  }
}

async function runRestore(args: Args) {
  for (const cache of args.caches) {
    const processors = await resolveProcessors(args, cache)
    if (processors.length === 0) {
      console.log(`[${cache.name}] nothing to restore`)
      continue
    }
    for (const processor of processors) {
      const localPath = path.join(cache.dir, `${processor}.sqlite`)
      const remote = await headRemote(`${cache.prefix}${processor}.sqlite`, args.awsProfile)
      if (!remote) {
        console.warn(`[${cache.name}] ${processor}: not found in S3; skipping`)
        continue
      }

      console.log(`\n[${cache.name}] ${processor}`)
      console.log(`  remote: ${fmtBytes(remote.size)} @ ${fmtDate(remote.lastModified)}`)

      const localExists = fs.existsSync(localPath)
      if (localExists) {
        const stat = fs.statSync(localPath)
        const localNewer = stat.mtime > (remote.lastModified ?? new Date(0))
        console.log(`  local:  ${localPath} (${fmtBytes(stat.size)} @ ${fmtDate(stat.mtime)})`)
        console.log(`  ${localNewer ? 'Local looks NEWER than S3.' : 'S3 looks newer than local.'}`)

        // Local is the source of truth — never clobber it silently.
        if (!args.force && !args.assumeYes) {
          if (!process.stdin.isTTY) {
            console.warn('  non-interactive shell: refusing to overwrite local. Pass -y or --force to override. Skipping.')
            continue
          }
          const ok = await promptYesNo(`  Overwrite local cache with the S3 copy? [y/N]: `)
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

      fs.mkdirSync(cache.dir, { recursive: true })
      await awsCp(s3Url(cache, processor), localPath, args.awsProfile)
      // Drop any stale WAL/SHM so the freshly downloaded db isn't shadowed
      // by leftover journal files from the previous local copy.
      for (const sfx of ['-wal', '-shm']) {
        const p = `${localPath}${sfx}`
        if (fs.existsSync(p)) fs.rmSync(p)
      }
      console.log('  restored')
    }
  }
}

async function runList(args: Args) {
  for (const cache of args.caches) {
    console.log(`\n[${cache.name}] s3://${BUCKET}/${cache.prefix}`)
    const remoteProcs = args.processor ? [args.processor] : await listRemoteProcessors(cache, args.awsProfile)
    const localProcs = new Set(listLocalProcessors(cache))
    const all = new Set([...remoteProcs, ...localProcs])
    if (all.size === 0) {
      console.log('  (empty)')
      continue
    }
    for (const processor of [...all].sort()) {
      const remote = await headRemote(`${cache.prefix}${processor}.sqlite`, args.awsProfile)
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
  if (args.command === 'backup') await runBackup(args)
  else if (args.command === 'restore') await runRestore(args)
  else await runList(args)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
