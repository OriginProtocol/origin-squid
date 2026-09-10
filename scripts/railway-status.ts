import { exec } from 'child_process'
import { promisify } from 'util'

import {
  AT_HEAD_MS,
  CleanError,
  PROCESSORS,
  ProcessingStatus,
  RailwayServiceInstance,
  apiGraphqlUrl,
  fetchLogProgress,
  fetchStatuses,
  formatCount,
  formatDuration,
  pad,
  padStart,
  railwayProject,
  resolveEnvironment,
} from './squid-status'

const execAsync = promisify(exec)

const FAILURE_STATUSES = new Set(['FAILED', 'CRASHED'])
const IDLE_STATUSES = new Set(['REMOVED', 'REMOVING', 'SKIPPED'])

const ESC = String.fromCharCode(27)
const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const color = (code: string) => (s: string) => (useColor ? `${ESC}[${code}m${s}${ESC}[0m` : s)
const green = color('32')
const red = color('31')
const yellow = color('33')
const dim = color('2')
const bold = color('1')

async function currentBranch(): Promise<string> {
  try {
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD')
    return stdout.trim()
  } catch {
    throw new CleanError('no environment given and the current git branch could not be read')
  }
}

interface DeployState {
  label: string
  failed: boolean
  hibernated: boolean
}

function deployState(service: RailwayServiceInstance): DeployState {
  const latest = service.latestDeployment
  if (!latest) return { label: 'hibernated', failed: false, hibernated: true }
  if (FAILURE_STATUSES.has(latest.status)) return { label: latest.status, failed: true, hibernated: false }

  const active = service.activeDeployments ?? []
  if (active.length === 0 || latest.deploymentStopped || IDLE_STATUSES.has(latest.status)) {
    return { label: 'hibernated', failed: false, hibernated: true }
  }

  const unhealthy = (latest.instances ?? []).find((i) => i.status !== 'RUNNING')
  return {
    label: unhealthy ? `${latest.status} (${unhealthy.status.toLowerCase()})` : latest.status,
    failed: false,
    hibernated: false,
  }
}

interface IndexingCells {
  block: string
  head: string
  behind: string
  lag: string
  atHead: boolean
  syncing: boolean
}

const NO_INDEXING: IndexingCells = { block: '-', head: '-', behind: '-', lag: '-', atHead: false, syncing: false }

interface Row extends IndexingCells {
  service: string
  state: DeployState
}

function indexingCells(status: ProcessingStatus | undefined, logHead: number | undefined, now: number): IndexingCells {
  if (!status) return NO_INDEXING
  const lagMs = now - Date.parse(status.timestamp)
  const atHead = status.headTimestamp != null && lagMs < AT_HEAD_MS
  // The logged head is a few seconds older than the block the api reports, so a caught-up
  // processor can read as ahead of its own chain.
  const head = logHead ? Math.max(logHead, status.blockNumber) : undefined
  return {
    block: formatCount(status.blockNumber),
    head: head ? formatCount(head) : '-',
    behind: head ? formatCount(head - status.blockNumber) : '-',
    lag: atHead ? 'at head' : formatDuration(lagMs),
    atHead,
    syncing: !atHead,
  }
}

function processorName(serviceName: string): string | null {
  const name = serviceName.replace(/-processor$/, '')
  return name !== serviceName && PROCESSORS.includes(name as never) ? name : null
}

function orderServices(services: RailwayServiceInstance[]): RailwayServiceInstance[] {
  const rank = ({ serviceName }: RailwayServiceInstance) => {
    const processor = processorName(serviceName)
    if (processor) return PROCESSORS.indexOf(processor as never)
    return serviceName === 'api' ? PROCESSORS.length : PROCESSORS.length + 1
  }
  return [...services].sort((a, b) => rank(a) - rank(b) || a.serviceName.localeCompare(b.serviceName))
}

function statusColor(state: DeployState): (s: string) => string {
  if (state.failed) return red
  if (state.hibernated) return dim
  if (state.label === 'SUCCESS') return green
  return yellow
}

function render(rows: Row[]) {
  const headers = { service: 'SERVICE', state: 'STATUS', block: 'BLOCK', head: 'HEAD', behind: 'BEHIND', lag: 'LAG' }
  const width = (key: keyof typeof headers, value: (r: Row) => string) =>
    Math.max(headers[key].length, ...rows.map((r) => value(r).length))
  const w = {
    service: width('service', (r) => r.service),
    state: width('state', (r) => r.state.label),
    block: width('block', (r) => r.block),
    head: width('head', (r) => r.head),
    behind: width('behind', (r) => r.behind),
    lag: width('lag', (r) => r.lag),
  }

  console.log(
    bold(
      [
        pad(headers.service, w.service),
        pad(headers.state, w.state),
        padStart(headers.block, w.block),
        padStart(headers.head, w.head),
        padStart(headers.behind, w.behind),
        pad(headers.lag, w.lag),
      ].join('  '),
    ),
  )
  console.log(dim([w.service, w.state, w.block, w.head, w.behind, w.lag].map((n) => '─'.repeat(n)).join('  ')))

  for (const r of rows) {
    const lagColor = r.atHead ? green : r.syncing ? yellow : dim
    console.log(
      [
        pad(r.service, w.service),
        statusColor(r.state)(pad(r.state.label, w.state)),
        padStart(r.block, w.block),
        padStart(r.head, w.head),
        padStart(r.behind, w.behind),
        lagColor(pad(r.lag, w.lag)),
      ].join('  '),
    )
  }
}

async function main() {
  const requested = process.argv[2] ?? (await currentBranch())
  const project = await railwayProject()
  const environment = resolveEnvironment(project, requested)
  const services = orderServices((environment.serviceInstances?.edges ?? []).map((e) => e.node))

  if (services.length === 0) throw new CleanError(`environment ${environment.name} has no services`)

  const url = apiGraphqlUrl(services)
  let statuses = new Map<string, ProcessingStatus>()
  let indexingError: string | null = url ? null : 'the api service has no public domain'
  if (url) {
    try {
      statuses = await fetchStatuses(url)
    } catch (err) {
      indexingError = (err as Error).message
    }
  }

  // The chain head is only reported in each processor's own progress logs, not in ProcessingStatus.
  const heads = new Map(
    await Promise.all(
      services
        .filter((s) => statuses.size > 0 && processorName(s.serviceName) && !deployState(s).hibernated)
        .map(
          async (s) =>
            [s.serviceName, (await fetchLogProgress(s.serviceName, { environment: environment.name }))?.total] as const,
        ),
    ),
  )

  const now = Date.now()
  const rows: Row[] = services.map((service) => {
    const processor = processorName(service.serviceName)
    return {
      service: service.serviceName,
      state: deployState(service),
      ...(processor ? indexingCells(statuses.get(processor), heads.get(service.serviceName), now) : NO_INDEXING),
    }
  })

  console.log(`${bold(project.name)} · ${bold(environment.name)}${url ? ` · ${dim(url)}` : ''}`)
  console.log()
  render(rows)

  if (indexingError) {
    console.log()
    console.log(yellow(`indexing columns unavailable: ${indexingError}`))
  }

  const failed = rows.filter((r) => r.state.failed)
  if (failed.length) {
    console.log()
    console.log(red(`not deployed: ${failed.map((r) => r.service).join(', ')}`))
    process.exitCode = 1
  }
}

main().catch((err) => {
  if (err instanceof CleanError) {
    console.error(red(err.message))
    process.exit(2)
  }
  console.error(err)
  process.exit(1)
})
