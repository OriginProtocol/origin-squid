import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const PROCESSORS = [
  'mainnet',
  'oeth',
  'ogv',
  'ousd',
  'arbitrum',
  'base',
  'oethb',
  'sonic',
  'os',
  'hyperevm',
] as const

export type ProcessorName = (typeof PROCESSORS)[number]

/** A processor whose latest indexed block is younger than this is considered caught up. */
export const AT_HEAD_MS = 5 * 60 * 1000

export interface ProcessingStatus {
  id: string
  blockNumber: number
  timestamp: string
  startTimestamp: string
  headTimestamp: string | null
}

export class CleanError extends Error {}

export interface RailwayDeployment {
  id: string
  status: string
  createdAt: string
  deploymentStopped?: boolean
  instances?: { id: string; status: string }[] | null
}

export interface RailwayServiceInstance {
  serviceName: string
  latestDeployment?: RailwayDeployment | null
  activeDeployments?: RailwayDeployment[] | null
  domains?: { serviceDomains?: { domain: string }[]; customDomains?: { domain: string }[] } | null
}

export interface RailwayEnvironment {
  name: string
  serviceInstances?: { edges: { node: RailwayServiceInstance }[] } | null
}

export interface RailwayProject {
  name: string
  environments: { edges: { node: RailwayEnvironment }[] }
}

export async function railwayProject(): Promise<RailwayProject> {
  let stdout: string
  try {
    ;({ stdout } = await execAsync('railway status --json', { maxBuffer: 32 * 1024 * 1024 }))
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr?.trim()
    if ((err as { code?: string }).code === 'ENOENT') {
      throw new CleanError('railway CLI not found — install it with `brew install railway`')
    }
    throw new CleanError(`railway status failed: ${stderr || (err as Error).message}`)
  }
  try {
    return JSON.parse(stdout) as RailwayProject
  } catch {
    throw new CleanError(`could not parse \`railway status --json\` output:\n${stdout.trim()}`)
  }
}

/** `v164` and `railway-v164` both name the `railway-v164` environment. */
export function resolveEnvironment(project: RailwayProject, requested: string): RailwayEnvironment {
  const environments = project.environments.edges.map((e) => e.node)
  const match =
    environments.find((e) => e.name === requested) ?? environments.find((e) => e.name === `railway-${requested}`)
  if (!match) {
    throw new CleanError(
      `no environment named "${requested}" in project ${project.name}\n` +
        `available: ${environments.map((e) => e.name).join(', ')}`,
    )
  }
  return match
}

export function apiGraphqlUrl(services: RailwayServiceInstance[]): string | null {
  const api = services.find((s) => s.serviceName === 'api')
  const domain = api?.domains?.customDomains?.[0]?.domain ?? api?.domains?.serviceDomains?.[0]?.domain
  return domain ? `https://${domain}/graphql` : null
}

export function graphqlUrl(target: string): string {
  return /^https?:\/\//.test(target) ? target : `https://origin.squids.live/origin-squid@${target}/api/graphql`
}

/**
 * Same as `graphqlUrl`, plus `railway-v164` — the api service of that Railway environment.
 * Only the `railway-` prefix goes to Railway; `164` and `v164` are SQD Cloud slot tags.
 */
export async function resolveGraphqlUrl(target: string): Promise<string> {
  if (!/^railway-/.test(target)) return graphqlUrl(target)
  const environment = resolveEnvironment(await railwayProject(), target)
  const url = apiGraphqlUrl((environment.serviceInstances?.edges ?? []).map((e) => e.node))
  if (!url) throw new CleanError(`environment ${environment.name} has no api domain`)
  return url
}

export async function fetchStatuses(url: string): Promise<Map<string, ProcessingStatus>> {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{ processingStatuses(limit: 100) { id blockNumber timestamp startTimestamp headTimestamp } }`,
    }),
  })
  if (!resp.ok) throw new Error(`GraphQL ${resp.status}: ${await resp.text()}`)
  const json = (await resp.json()) as { data?: { processingStatuses: ProcessingStatus[] }; errors?: unknown[] }
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  return new Map(json.data!.processingStatuses.map((s) => [s.id, s]))
}

export interface LogProgress {
  current: number
  total: number
  pct: number
  rate: string
  eta: string
}

// Parses lines like:
//   27700701 / 45578674, rate: 990 blocks/sec, mapping: 1652 blocks/sec, 5 items/sec, eta: 5h 2m
const PROGRESS_RE = /(\d+)\s*\/\s*(\d+),\s*rate:\s*(\d+).*?eta:\s*(.+?)\s*$/

/** Latest `<indexed> / <chain head>` progress line a processor logged, or null if none is reachable. */
export async function fetchLogProgress(
  serviceName: string,
  options: { environment?: string; lines?: number } = {},
): Promise<LogProgress | null> {
  const { environment, lines = 200 } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  try {
    const args = ['logs', '--service', serviceName, '--lines', String(lines), '--json']
    if (environment) args.push('--environment', environment)
    const { stdout } = await execAsync(`railway ${args.join(' ')} 2>/dev/null`, {
      maxBuffer: 50 * 1024 * 1024,
      signal: controller.signal,
    })
    for (const raw of stdout.trim().split('\n').reverse()) {
      let msg = ''
      try {
        msg = (JSON.parse(raw) as { message?: string }).message ?? ''
      } catch {
        msg = raw
      }
      const m = msg.match(PROGRESS_RE)
      if (m) {
        const [, current, total, rate, eta] = m
        const cur = Number(current)
        const tot = Number(total)
        return { current: cur, total: tot, pct: tot > 0 ? (cur / tot) * 100 : 0, rate: `${rate} blk/s`, eta }
      }
    }
  } catch {
    // timeout, CLI missing, or service not found — fall through
  } finally {
    clearTimeout(timer)
  }
  return null
}

export function formatDuration(ms: number): string {
  if (ms < 0) return '0s'
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${m % 60}m`
  const d = Math.floor(h / 24)
  return `${d}d ${h % 24}h`
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}

export function pad(s: string, len: number) {
  return s.length >= len ? s : s + ' '.repeat(len - s.length)
}

export function padStart(s: string, len: number) {
  return s.length >= len ? s : ' '.repeat(len - s.length) + s
}
