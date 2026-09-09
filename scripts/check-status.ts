import {
  AT_HEAD_MS,
  PROCESSORS,
  fetchLogProgress,
  fetchStatuses,
  formatDuration,
  graphqlUrl,
  pad,
} from './squid-status'

const TARGET = process.argv[2]
if (!TARGET) {
  console.error('usage: pnpm run check-status <graphql-url-or-version>')
  console.error('       pnpm run check-status https://api-production-d3fd.up.railway.app/graphql')
  console.error('       pnpm run check-status 999')
  process.exit(2)
}

const GRAPHQL_URL = graphqlUrl(TARGET)

async function main() {
  console.log(`Querying: ${GRAPHQL_URL}`)
  console.log()

  const statuses = await fetchStatuses(GRAPHQL_URL)
  const now = Date.now()

  // Fetch log progress for everyone in parallel — we'll only use it for catching-up rows.
  const progressPromises = new Map(PROCESSORS.map((p) => [p, fetchLogProgress(`${p}-processor`)] as const))

  const rows: Array<{ name: string; status: string; block: string; behind: string; pct: string; rate: string; eta: string }> = []

  for (const id of PROCESSORS) {
    const s = statuses.get(id)
    if (!s) {
      rows.push({ name: id, status: 'no data', block: '-', behind: '-', pct: '-', rate: '-', eta: '-' })
      continue
    }
    const blockTime = Date.parse(s.timestamp)
    const behindMs = now - blockTime
    const isAtHead = s.headTimestamp != null && behindMs < AT_HEAD_MS

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
