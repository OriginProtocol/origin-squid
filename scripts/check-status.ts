import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const PROCESSORS = [
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

const TARGET = process.argv[2]
if (!TARGET) {
  console.error('usage: pnpm run check-status <graphql-url-or-version>')
  console.error('       pnpm run check-status https://api-production-d3fd.up.railway.app/graphql')
  console.error('       pnpm run check-status 999')
  process.exit(2)
}

const GRAPHQL_URL = /^https?:\/\//.test(TARGET)
  ? TARGET
  : `https://origin.squids.live/origin-squid@${TARGET}/api/graphql`

interface ProcessingStatus {
  id: string
  blockNumber: number
  timestamp: string
  startTimestamp: string
  headTimestamp: string | null
}

async function fetchStatuses(): Promise<Map<string, ProcessingStatus>> {
  const resp = await fetch(GRAPHQL_URL, {
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

interface LogProgress {
  current: number
  total: number
  pct: number
  rate: string
  eta: string
}

// Parses lines like:
//   27700701 / 45578674, rate: 990 blocks/sec, mapping: 1652 blocks/sec, 5 items/sec, eta: 5h 2m
const PROGRESS_RE = /(\d+)\s*\/\s*(\d+),\s*rate:\s*(\d+).*?eta:\s*(.+?)\s*$/

async function fetchLogProgress(serviceName: string): Promise<LogProgress | null> {
  // Some services (mainnet, base) emit thousands of log lines per second; the
  // CLI's initial buffer dump can take 10-15 s. Cap the wait so one slow
  // service doesn't starve others.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)
  try {
    const { stdout } = await execAsync(
      `railway logs --service ${serviceName} --json 2>/dev/null | tail -500`,
      { maxBuffer: 50 * 1024 * 1024, signal: controller.signal },
    )
    const lines = stdout.trim().split('\n').reverse()
    for (const raw of lines) {
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
        return {
          current: cur,
          total: tot,
          pct: tot > 0 ? (cur / tot) * 100 : 0,
          rate: `${rate} blk/s`,
          eta,
        }
      }
    }
  } catch {
    // timeout, CLI missing, or service not found — fall through
  } finally {
    clearTimeout(timer)
  }
  return null
}

function formatDuration(ms: number): string {
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

function pad(s: string, len: number) {
  return s.length >= len ? s : s + ' '.repeat(len - s.length)
}

async function main() {
  console.log(`Querying: ${GRAPHQL_URL}`)
  console.log()

  const statuses = await fetchStatuses()
  const now = Date.now()

  // Fetch log progress for everyone in parallel — we'll only use it for catching-up rows.
  const progressPromises = new Map(
    PROCESSORS.map((p) => [p, fetchLogProgress(`${p}-processor`)] as const),
  )

  const rows: Array<{ name: string; status: string; block: string; behind: string; pct: string; rate: string; eta: string }> = []

  for (const id of PROCESSORS) {
    const s = statuses.get(id)
    if (!s) {
      rows.push({ name: id, status: 'no data', block: '-', behind: '-', pct: '-', rate: '-', eta: '-' })
      continue
    }
    const blockTime = Date.parse(s.timestamp)
    const behindMs = now - blockTime
    const isAtHead = s.headTimestamp != null && behindMs < 5 * 60 * 1000

    let rate = '-'
    let eta = '-'
    let pct = '-'
    if (!isAtHead) {
      const prog = await progressPromises.get(id)!
      if (prog) {
        rate = prog.rate
        eta = prog.eta
        pct = `${prog.pct.toFixed(1)}%`
      }
    }

    rows.push({
      name: id,
      status: isAtHead ? 'AT HEAD' : s.headTimestamp ? 'lagging' : 'catching up',
      block: String(s.blockNumber),
      behind: formatDuration(behindMs),
      pct,
      rate,
      eta,
    })
  }

  // Pretty-print
  const headers = { name: 'Processor', status: 'Status', block: 'Block', behind: 'Behind', pct: '% done', rate: 'Rate', eta: 'ETA' }
  const widths = {
    name: Math.max(headers.name.length, ...rows.map((r) => r.name.length)),
    status: Math.max(headers.status.length, ...rows.map((r) => r.status.length)),
    block: Math.max(headers.block.length, ...rows.map((r) => r.block.length)),
    behind: Math.max(headers.behind.length, ...rows.map((r) => r.behind.length)),
    pct: Math.max(headers.pct.length, ...rows.map((r) => r.pct.length)),
    rate: Math.max(headers.rate.length, ...rows.map((r) => r.rate.length)),
    eta: Math.max(headers.eta.length, ...rows.map((r) => r.eta.length)),
  }
  const line = (r: typeof headers) =>
    `${pad(r.name, widths.name)}  ${pad(r.status, widths.status)}  ${pad(r.block, widths.block)}  ${pad(r.behind, widths.behind)}  ${pad(r.pct, widths.pct)}  ${pad(r.rate, widths.rate)}  ${pad(r.eta, widths.eta)}`

  console.log(line(headers))
  console.log(line({ name: '─'.repeat(widths.name), status: '─'.repeat(widths.status), block: '─'.repeat(widths.block), behind: '─'.repeat(widths.behind), pct: '─'.repeat(widths.pct), rate: '─'.repeat(widths.rate), eta: '─'.repeat(widths.eta) }))
  for (const r of rows) console.log(line(r))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
