import { spawn } from 'child_process'
import dotenv from 'dotenv'
import 'dotenv/config'
import * as fs from 'fs'
import { createServer } from 'net'
import * as path from 'path'
import { Pool } from 'pg'
import { setTimeout as delay } from 'timers/promises'
import { createPublicClient, http } from 'viem'

type ProcessorName =
  | 'mainnet-processor'
  | 'oeth-processor'
  | 'ogv-processor'
  | 'ousd-processor'
  | 'arbitrum-processor'
  | 'base-processor'
  | 'oethb-processor'
  | 'sonic-processor'
  | 'os-processor'

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: tsx create-db-dump.ts <processor-name> [--profile <aws-profile>] [--continue]')
    process.exit(1)
  }

  const processorName = args[0] as ProcessorName
  let awsProfile: string | undefined
  let continueRun = false

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--profile' && args[i + 1]) {
      awsProfile = args[i + 1]
      i++
      continue
    }
    if (arg === '--continue') {
      continueRun = true
    }
  }

  return { processorName, awsProfile, continueRun }
}

function getProcessorAlias(processorName: ProcessorName): string {
  // Maps `oeth-processor` -> `oeth`, etc. Used to pick the main entry file.
  return processorName.replace(/-processor$/, '')
}

function getRpcEndpointEnvName(processorName: ProcessorName): string {
  switch (processorName) {
    case 'base-processor':
    case 'oethb-processor':
      return process.env['RPC_BASE_ENV']!
    case 'arbitrum-processor':
      return process.env['RPC_ARBITRUM_ENV']!
    case 'sonic-processor':
    case 'os-processor':
      return process.env['RPC_SONIC_ENV']!
    // mainnet family
    case 'mainnet-processor':
    case 'oeth-processor':
    case 'ogv-processor':
    case 'ousd-processor':
    default:
      return process.env['RPC_ENV']!
  }
}

async function getLatestBlockNumber(rpcUrl: string): Promise<number> {
  const client = createPublicClient({ transport: http(rpcUrl) })
  const n = await client.getBlockNumber()
  return Number(n)
}

function computePrevious100kBoundary(height: number): number {
  if (height <= 0) return 0
  return height - (height % 100000) - 100000
}

async function findFreePort(preferredStart = 24000, preferredEnd = 65000): Promise<number> {
  async function getDockerPublishedPorts(): Promise<Set<number>> {
    try {
      const { stdout } = await runCmd(`docker ps --format "{{.Ports}}"`, { capture: true })
      const busy = new Set<number>()
      stdout
        .split('\n')
        .map((l: string) => l.trim())
        .filter(Boolean)
        .forEach((line: string) => {
          // Examples: "0.0.0.0:23798->5432/tcp, :::23798->5432/tcp"
          const matches = [...line.matchAll(/:(\d+)->/g)]
          for (const m of matches) {
            const p = parseInt(m[1], 10)
            if (!isNaN(p)) busy.add(p)
          }
        })
      return busy
    } catch {
      return new Set<number>()
    }
  }

  async function tryPort(port: number): Promise<boolean> {
    // Attempt to bind on all interfaces to catch conflicts with docker published ports
    return await new Promise<boolean>((resolve) => {
      const srv = createServer()
      let resolved = false
      const finalize = (ok: boolean) => {
        if (resolved) return
        resolved = true
        try {
          srv.close()
        } catch {}
        resolve(ok)
      }
      srv.once('error', () => finalize(false))
      srv.listen({ port, host: '0.0.0.0', exclusive: true }, () => finalize(true))
    })
  }

  const dockerBusy = await getDockerPublishedPorts()
  for (let port = preferredStart; port <= preferredEnd; port++) {
    if (dockerBusy.has(port)) continue
    const ok = await tryPort(port)
    if (ok) return port
  }
  throw new Error('No free port found')
}

async function getExistingDbPort(composeProject: string): Promise<number | null> {
  try {
    const { stdout } = await runCmd(`docker ps --filter "name=^\/${composeProject}-db-1$" --format "{{.Ports}}"`, {
      capture: true,
    })
    const ports = stdout.trim()
    if (!ports) return null
    // Prefer explicit 5432 mapping if present
    const mSpecific = ports.match(/:(\d+)->5432\/tcp/)
    if (mSpecific) return parseInt(mSpecific[1], 10)
    const mAny = ports.match(/:(\d+)->/)
    if (mAny) return parseInt(mAny[1], 10)
    return null
  } catch {
    return null
  }
}

async function waitForDbReady({
  host,
  port,
  name,
  user,
  pass,
}: {
  host: string
  port: number
  name: string
  user: string
  pass: string
}) {
  const timeoutMs = 60_000
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const pool = new Pool({ host, port, database: name, user, password: pass })
    try {
      await pool.query('SELECT 1')
      await pool.end()
      return
    } catch {
      await pool.end().catch(() => {})
      await delay(1000)
    }
  }
  throw new Error('Database not ready in time')
}

type RunCmdOptions = { env?: NodeJS.ProcessEnv; capture?: boolean }

async function runCmd(cmd: string, opts: RunCmdOptions = {}) {
  const { env, capture = false } = opts
  return await new Promise<{ stdout: string }>((resolve, reject) => {
    const child = spawn(cmd, {
      env,
      shell: true,
      stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    })

    let stdout = ''
    if (capture && child.stdout) {
      child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString()
      })
    }

    child.on('error', (err) => reject(err))
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout })
      else reject(new Error(`Command failed (exit ${code}): ${cmd}`))
    })
  })
}

async function runWithRetries(cmd: string, opts: RunCmdOptions & { retries?: number; delayMs?: number } = {}) {
  const { retries = 5, delayMs = 5000, ...rest } = opts
  let attempt = 0
  while (true) {
    attempt++
    try {
      return await runCmd(cmd, rest)
    } catch (err) {
      if (attempt >= retries) throw err
      console.warn(`Command failed (attempt ${attempt}/${retries}): ${cmd}. Retrying in ${delayMs}ms...`)
      await delay(delayMs)
    }
  }
}

async function main() {
  // Load dev.env if present (in addition to standard .env via dotenv/config)
  const devEnvPath = path.join(process.cwd(), 'dev.env')
  if (fs.existsSync(devEnvPath)) {
    dotenv.config({ path: devEnvPath, override: false })
  }

  const { processorName, awsProfile, continueRun } = parseArgs()
  const alias = getProcessorAlias(processorName)

  // Determine RPC URL for the chain
  const rpcEnv = getRpcEndpointEnvName(processorName)
  const rpcUrl = process.env[rpcEnv]
  if (!rpcUrl) {
    console.error(`Missing RPC endpoint env var ${rpcEnv}. Please set it in your environment or dev.env`)
    process.exit(1)
  }

  // Compute target block (nearest 100k boundary)
  const latest = await getLatestBlockNumber(rpcUrl)
  const blockTo = computePrevious100kBoundary(latest)
  if (blockTo === 0) {
    console.error('Computed target block is 0; aborting')
    process.exit(1)
  }
  console.log(`Latest block: ${latest}. Processing up to: ${blockTo}`)

  // Prepare isolated DB
  const DB_HOST = 'localhost'
  const DB_USER = process.env.DB_USER || 'postgres'
  const DB_PASS = process.env.DB_PASS || 'postgres'
  const DB_NAME = process.env.DB_NAME || 'squid'
  const composeProject = `squid_${alias}`
  let DB_PORT = 0
  let startedCompose = false
  if (continueRun) {
    const existingPort = await getExistingDbPort(composeProject)
    if (existingPort) {
      DB_PORT = existingPort
      console.log(`Reusing existing dockerized Postgres at port ${DB_PORT} (project ${composeProject})...`)
    } else {
      console.log(`No existing Postgres found.`)
      process.exit(1)
    }
  } else {
    DB_PORT = await findFreePort(23000, 65000)
  }

  const baseEnv: NodeJS.ProcessEnv = {
    ...process.env,
    DB_HOST,
    DB_PORT: String(DB_PORT),
    DB_USER,
    DB_PASS,
    DB_NAME,
  }

  // Start isolated Postgres
  if (!continueRun || startedCompose) {
    if (!startedCompose) {
      console.log(`Starting dockerized Postgres at port ${DB_PORT} (project ${composeProject})...`)
      await runCmd(`docker-compose -p ${composeProject} down --volumes`, { env: { ...baseEnv } })
      await runCmd(`docker-compose -p ${composeProject} up -d`, { env: { ...baseEnv } })
      startedCompose = true
    }
  }

  try {
    // Wait for DB to be ready
    await waitForDbReady({ host: DB_HOST, port: DB_PORT, name: DB_NAME, user: DB_USER, pass: DB_PASS })
    console.log('Database is ready')

    console.log(`Running processor '${processorName}' up to block ${blockTo}...`)
    const procEnv: NodeJS.ProcessEnv = {
      ...baseEnv,
      BLOCK_TO: String(blockTo),
    }
    if (!continueRun) {
      await runCmd('pnpm run migration:apply', { env: procEnv })
    }
    await runWithRetries(`pnpm run process:${alias}`, { env: procEnv, retries: 5, delayMs: 30000 })

    // Dump DB using existing script to get the AWS command
    console.log('Creating DB dump...')
    const { stdout } = await runCmd(`pnpm dlx tsx scripts/dump-db.ts ${processorName}`, {
      env: baseEnv,
      capture: true,
    })

    // Find the aws command line in the output
    const lines = stdout.split('\n')
    const awsLine = lines.find((l: string) => l.trim().startsWith('aws s3 cp '))
    if (!awsLine) {
      console.error('Could not find AWS upload command in dump script output')
      process.exit(1)
    }

    const awsCmd = awsProfile ? `${awsLine.trim()} --profile ${awsProfile}` : awsLine.trim()
    console.log(`Uploading dump to S3: ${awsCmd}`)
    await runCmd(`${awsCmd}`)

    console.log('Done.')
  } finally {
    if (startedCompose) {
      console.log('Shutting down docker compose project...')
      try {
        await runCmd(`docker-compose -p ${composeProject} down --volumes`, { env: baseEnv })
      } catch (e) {
        console.warn('Failed to stop docker-compose project:', e)
      }
    } else {
      console.log('Leaving existing docker compose project running.')
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
