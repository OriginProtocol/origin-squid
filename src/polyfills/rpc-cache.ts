/**
 * In-process RPC cache for the Subsquid processor. Off by default;
 * opt-in via `RPC_CACHE=true`.
 *
 * Wraps RpcClient.prototype.call / batchCall to short-circuit immutable
 * lookups (eth_call, eth_getCode, ...) against an on-disk SQLite store
 * fronted by an in-memory LRU. Storage is namespaced per processor
 * `stateSchema` so concurrent processors don't share or contend on
 * cache files. Wire from `initProcessorFromDump` with the processor's
 * stateSchema.
 *
 * Reorg safety: methods that take a block reference are only cached
 * once `head - block >= RPC_CACHE_MIN_DEPTH` (default 64).
 *
 * Env knobs:
 *   RPC_CACHE                  truthy to enable (default off)
 *   RPC_CACHE_DIR              default `.rpc-cache`
 *   RPC_CACHE_MIN_DEPTH        default 64
 *   RPC_CACHE_MEM_ENTRIES      default 10_000
 *   RPC_CACHE_LOG_INTERVAL     seconds; 0 disables (default 30)
 */
import { CallOptions, RpcClient } from '@subsquid/rpc-client'
import { RpcCall } from '@subsquid/rpc-client/src/interfaces'
import { createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'

/** Methods whose result is immutable per chain — cache unconditionally. */
const CACHE_FOREVER = new Set([
  'eth_chainId',
  'eth_getBlockByHash',
  'eth_getTransactionByHash',
  'eth_getTransactionReceipt',
])

/**
 * Methods that take a block reference at a known param index. Result is
 * immutable at that block; gated on `(head - block) >= minDepth` for
 * reorg safety.
 */
const BLOCK_PARAM_INDEX: Record<string, number> = {
  eth_call: 1,
  eth_getCode: 1,
  eth_getBalance: 1,
  eth_getStorageAt: 2,
  eth_getBlockByNumber: 0,
}

function canonicalParams(params: unknown): string {
  return JSON.stringify(params ?? [])
}

function cacheKey(method: string, params: unknown): string {
  const h = createHash('sha256')
  h.update(method)
  h.update('\x00')
  h.update(canonicalParams(params))
  return h.digest('hex')
}

class Lru<K, V> {
  private map = new Map<K, V>()
  constructor(private readonly max: number) {}

  get(k: K): V | undefined {
    const v = this.map.get(k)
    if (v === undefined) return undefined
    this.map.delete(k)
    this.map.set(k, v)
    return v
  }
  set(k: K, v: V): void {
    if (this.map.has(k)) this.map.delete(k)
    this.map.set(k, v)
    if (this.map.size > this.max) {
      const oldest = this.map.keys().next().value as K | undefined
      if (oldest !== undefined) this.map.delete(oldest)
    }
  }
}

interface SqliteStore {
  get(key: string): unknown | undefined
  set(key: string, method: string, value: unknown): void
}

function openSqlite(path: string): SqliteStore {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require('better-sqlite3')
  const db = new Database(path)
  db.exec(`
    CREATE TABLE IF NOT EXISTS rpc_cache (
      key TEXT PRIMARY KEY,
      method TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  const getStmt = db.prepare('SELECT response FROM rpc_cache WHERE key = ?')
  const setStmt = db.prepare(
    'INSERT OR REPLACE INTO rpc_cache (key, method, response, created_at) VALUES (?, ?, ?, ?)',
  )
  return {
    get(key: string): unknown | undefined {
      const row = getStmt.get(key) as { response: string } | undefined
      if (!row) return undefined
      return JSON.parse(row.response)
    },
    set(key: string, method: string, value: unknown): void {
      setStmt.run(key, method, JSON.stringify(value), Date.now())
    },
  }
}

/**
 * Tracks the chain head with a short TTL. Returns null if the most recent
 * probe failed — callers treat that as "head unknown" and skip caching so
 * a rate-limited RPC doesn't cascade failures into every request.
 */
class HeadTracker {
  private cached: { value: bigint | null; fetchedAt: number } | null = null
  constructor(
    private readonly fetchHead: () => Promise<bigint>,
    private readonly ttlMs: number,
  ) {}

  async get(): Promise<bigint | null> {
    if (this.cached && Date.now() - this.cached.fetchedAt < this.ttlMs) {
      return this.cached.value
    }
    try {
      const value = await this.fetchHead()
      this.cached = { value, fetchedAt: Date.now() }
      return value
    } catch {
      this.cached = { value: null, fetchedAt: Date.now() }
      return null
    }
  }
}

type StatKind = 'mem' | 'disk' | 'miss' | 'uncacheable'
type MethodStats = { mem: number; disk: number; miss: number; uncacheable: number }

class CacheStats {
  private byMethod = new Map<string, MethodStats>()
  private since = Date.now()

  bump(method: string, kind: StatKind): void {
    let s = this.byMethod.get(method)
    if (!s) {
      s = { mem: 0, disk: 0, miss: 0, uncacheable: 0 }
      this.byMethod.set(method, s)
    }
    s[kind]++
  }

  drain(): { interval_ms: number; methods: Array<{ method: string } & MethodStats> } {
    const now = Date.now()
    const interval_ms = now - this.since
    this.since = now
    const methods = [...this.byMethod.entries()]
      .map(([method, s]) => ({ method, ...s }))
      .sort((a, b) => b.mem + b.disk + b.miss + b.uncacheable - (a.mem + a.disk + a.miss + a.uncacheable))
    this.byMethod.clear()
    return { interval_ms, methods }
  }
}

function startStatsLogger(namespace: string, stats: CacheStats, intervalSec: number): void {
  if (intervalSec <= 0) return
  setInterval(() => {
    const { interval_ms, methods } = stats.drain()
    if (methods.length === 0) return
    const lines = methods.map((m) => {
      const total = m.mem + m.disk + m.miss + m.uncacheable
      const cacheable = m.mem + m.disk + m.miss
      const hits = m.mem + m.disk
      const hitPct = cacheable > 0 ? ((hits / cacheable) * 100).toFixed(1) : '—'
      return `  ${m.method.padEnd(28)} total=${String(total).padStart(5)} mem=${String(m.mem).padStart(5)} disk=${String(m.disk).padStart(5)} miss=${String(m.miss).padStart(5)} uncacheable=${String(m.uncacheable).padStart(5)} hit=${hitPct}%`
    })
    console.log(`[rpc-cache ${namespace}] last ${(interval_ms / 1000).toFixed(1)}s:\n${lines.join('\n')}`)
  }, intervalSec * 1000).unref()
}

// One HeadTracker per RpcClient instance so each upstream connection
// owns its own head probe and we never recurse through our own wrapper.
const headTrackers = new WeakMap<RpcClient, HeadTracker>()

let initialized = false

/**
 * Install the cache wrapper on `RpcClient.prototype.call` /
 * `batchCall`. Idempotent — first call wins; subsequent calls with a
 * different stateSchema are ignored with a warning so the file path
 * stays stable for the life of the process.
 */
export function setupRpcCache(stateSchema: string): void {
  if (!process.env.RPC_CACHE || process.env.RPC_CACHE === 'false' || process.env.RPC_CACHE === '0') {
    return
  }
  if (initialized) {
    console.warn(`[rpc-cache] already initialized; ignoring setupRpcCache(${stateSchema})`)
    return
  }
  initialized = true

  const cacheDir = process.env.RPC_CACHE_DIR ?? '.rpc-cache'
  const minDepth = BigInt(process.env.RPC_CACHE_MIN_DEPTH ?? '64')
  const memEntries = Number(process.env.RPC_CACHE_MEM_ENTRIES ?? '10000')
  const logIntervalSec = Number(process.env.RPC_CACHE_LOG_INTERVAL ?? '30')

  mkdirSync(cacheDir, { recursive: true })
  const dbPath = `${cacheDir}/${stateSchema}.sqlite`
  const store = openSqlite(dbPath)
  const lru = new Lru<string, unknown>(memEntries)
  const stats = new CacheStats()
  startStatsLogger(stateSchema, stats, logIntervalSec)
  console.log(`[rpc-cache ${stateSchema}] enabled at ${dbPath} (minDepth=${minDepth}, mem=${memEntries})`)

  const inner = RpcClient.prototype.call
  const innerBatch = RpcClient.prototype.batchCall

  const getHead = async (client: RpcClient): Promise<bigint | null> => {
    let tracker = headTrackers.get(client)
    if (!tracker) {
      tracker = new HeadTracker(async () => {
        const hex = (await inner.call(client, 'eth_blockNumber', [])) as string
        return BigInt(hex)
      }, 5_000)
      headTrackers.set(client, tracker)
    }
    return tracker.get()
  }

  // Decide if a single (method, params) should hit the cache. Returns the
  // key when cacheable, or null when not. The block-depth check is async.
  const tryCacheKey = async (
    client: RpcClient,
    method: string,
    params: unknown,
  ): Promise<string | null> => {
    if (CACHE_FOREVER.has(method)) return cacheKey(method, params)
    const idx = BLOCK_PARAM_INDEX[method]
    if (idx === undefined) return null
    const paramsArr = (params ?? []) as unknown[]
    const blockParam = paramsArr[idx]
    if (typeof blockParam !== 'string' || !blockParam.startsWith('0x')) return null
    const requested = BigInt(blockParam)
    const head = await getHead(client)
    if (head === null) return null
    if (head < requested || head - requested < minDepth) return null
    return cacheKey(method, params)
  }

  const lookup = (key: string, method: string): unknown | undefined => {
    const memHit = lru.get(key)
    if (memHit !== undefined) {
      stats.bump(method, 'mem')
      return memHit
    }
    const diskHit = store.get(key)
    if (diskHit !== undefined) {
      stats.bump(method, 'disk')
      lru.set(key, diskHit)
      return diskHit
    }
    return undefined
  }

  const record = (key: string, method: string, value: unknown): void => {
    if (value === null || value === undefined) return
    store.set(key, method, value)
    lru.set(key, value)
  }

  RpcClient.prototype.call = async function <T = any>(
    method: string,
    params?: any[],
    options?: CallOptions<T>,
  ): Promise<T> {
    const key = await tryCacheKey(this, method, params)
    if (key === null) {
      stats.bump(method, 'uncacheable')
      return inner.call(this, method, params, options) as Promise<T>
    }
    const hit = lookup(key, method)
    if (hit !== undefined) return hit as T
    stats.bump(method, 'miss')
    const result = (await inner.call(this, method, params, options)) as T
    record(key, method, result)
    return result
  }

  RpcClient.prototype.batchCall = async function <T = any>(
    batch: RpcCall[],
    options?: CallOptions<T>,
  ): Promise<T[]> {
    // Resolve cache keys + lookups for every call up front. Anything that
    // missed gets forwarded as a smaller batch; results are spliced back
    // into the original positions before returning.
    const slots: Array<{ kind: 'hit'; value: T } | { kind: 'miss'; key: string; method: string } | { kind: 'pass'; method: string }> =
      new Array(batch.length)
    for (let i = 0; i < batch.length; i++) {
      const { method, params } = batch[i]
      const key = await tryCacheKey(this, method, params)
      if (key === null) {
        stats.bump(method, 'uncacheable')
        slots[i] = { kind: 'pass', method }
        continue
      }
      const hit = lookup(key, method)
      if (hit !== undefined) {
        slots[i] = { kind: 'hit', value: hit as T }
      } else {
        stats.bump(method, 'miss')
        slots[i] = { kind: 'miss', key, method }
      }
    }
    const passthroughIndices: number[] = []
    const passthroughBatch: RpcCall[] = []
    for (let i = 0; i < batch.length; i++) {
      if (slots[i].kind !== 'hit') {
        passthroughIndices.push(i)
        passthroughBatch.push(batch[i])
      }
    }
    let fetched: T[] = []
    if (passthroughBatch.length > 0) {
      fetched = (await innerBatch.call(this, passthroughBatch, options)) as T[]
    }
    const out: T[] = new Array(batch.length)
    for (let i = 0; i < batch.length; i++) {
      const slot = slots[i]
      if (slot.kind === 'hit') {
        out[i] = slot.value
      } else {
        const fetchedIdx = passthroughIndices.indexOf(i)
        const value = fetched[fetchedIdx]
        out[i] = value
        if (slot.kind === 'miss') record(slot.key, slot.method, value)
      }
    }
    return out
  }
}
