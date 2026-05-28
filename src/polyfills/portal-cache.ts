/**
 * In-process Portal cache for the Subsquid processor. Off by default;
 * opt-in via `PORTAL_CACHE=true`.
 *
 * Monkey-patches `PortalClient.prototype.getStream` to replay cached
 * finalized chunks from SQLite first, then fall through to the live
 * portal stream. Live batches' finalized portion is compressed and
 * stored keyed by (query_hash, block_from, block_to).
 *
 * Algorithm is a direct port of `@subsquid/pipes`' `portalSqliteCache`
 * (MIT). Two adaptations for portal-client@0.3.2 which our processor
 * uses:
 *   - read `batch.finalizedHead?.number` instead of `batch.head.finalized?.number`
 *   - track `requestedFromBlock` locally (0.3.2 doesn't emit it in meta)
 *
 * Storage is namespaced per processor `stateSchema` so concurrent
 * processors don't share or contend on cache files. Wire from
 * `initProcessorFromDump` with the processor's stateSchema.
 *
 * Env knobs:
 *   PORTAL_CACHE                truthy to enable (default off)
 *   PORTAL_CACHE_DIR            default `.portal-cache`
 *   PORTAL_CACHE_LOG_INTERVAL   seconds; 0 disables (default 30)
 */
import { PortalClient, PortalStreamData } from '@subsquid/portal-client'
import { createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { promisify } from 'node:util'
import zlib from 'node:zlib'

import { bigintJsonParse, bigintJsonStringify } from '../utils/bigintJson'

// zstd is faster + smaller than gzip; available in Node 22+. Fall back
// to gzip so this works on older Node too. Compression target is the
// finalized batch payload, which can be tens of MB per chunk uncompressed.
const compressAsync = promisify('zstdCompress' in zlib ? (zlib as any).zstdCompress : zlib.gzip)
const decompressAsync = promisify('zstdDecompress' in zlib ? (zlib as any).zstdDecompress : zlib.gunzip)

interface BlockLike {
  header: { number: number; hash: string }
}

/**
 * Stable hash that excludes cursor fields so the same query can be
 * resumed from any block range and still hit the same cache namespace.
 * Mirrors pipes' `hashQuery` — strip {fromBlock, toBlock, parentBlockHash},
 * sha256 the rest.
 */
function hashQuery(query: Record<string, unknown>): string {
  const { fromBlock: _f, toBlock: _t, parentBlockHash: _p, ...unique } = query
  return createHash('sha256').update(JSON.stringify(unique)).digest('hex')
}

function lastOf<T>(arr: T[]): T {
  return arr[arr.length - 1]
}

interface PortalCacheDb {
  selectChunk(blockFrom: number, queryHash: string): { block_to: number; value: Buffer } | undefined
  insertChunk(blockFrom: number, blockTo: number, queryHash: string, value: Buffer): void
}

interface CacheCounters {
  hit_chunks: number      // chunks served from disk (replay phase)
  hit_blocks: number      // total blocks across hit chunks
  saved_chunks: number    // new chunks written to disk (live phase)
  saved_blocks: number    // finalized blocks across saved chunks
  saved_bytes: number     // compressed bytes written
  live_batches: number    // live batches yielded without producing a save
  live_blocks: number     // blocks across live-only batches
}

class PortalCacheStats {
  private counters: CacheCounters = newCounters()
  private since = Date.now()

  bump<K extends keyof CacheCounters>(field: K, delta = 1): void {
    this.counters[field] += delta
  }

  drain(): { interval_ms: number; counters: CacheCounters } {
    const now = Date.now()
    const interval_ms = now - this.since
    this.since = now
    const counters = this.counters
    this.counters = newCounters()
    return { interval_ms, counters }
  }
}

function newCounters(): CacheCounters {
  return {
    hit_chunks: 0,
    hit_blocks: 0,
    saved_chunks: 0,
    saved_blocks: 0,
    saved_bytes: 0,
    live_batches: 0,
    live_blocks: 0,
  }
}

function startStatsLogger(namespace: string, stats: PortalCacheStats, intervalSec: number): void {
  if (intervalSec <= 0) return
  setInterval(() => {
    const { interval_ms, counters } = stats.drain()
    const total = counters.hit_chunks + counters.saved_chunks + counters.live_batches
    if (total === 0) return
    const hitBlocks = counters.hit_blocks
    const liveBlocks = counters.saved_blocks + counters.live_blocks
    const totalBlocks = hitBlocks + liveBlocks
    const hitPct = totalBlocks > 0 ? ((hitBlocks / totalBlocks) * 100).toFixed(1) : '—'
    const savedKb = (counters.saved_bytes / 1024).toFixed(1)
    console.log(
      `[portal-cache ${namespace}] last ${(interval_ms / 1000).toFixed(1)}s: ` +
        `hit=${counters.hit_chunks} chunks/${counters.hit_blocks} blocks, ` +
        `saved=${counters.saved_chunks} chunks/${counters.saved_blocks} blocks/${savedKb}KB, ` +
        `live=${counters.live_batches} batches/${counters.live_blocks} blocks, ` +
        `hit_rate=${hitPct}%`,
    )
  }, intervalSec * 1000).unref()
}

function openCacheDb(path: string): PortalCacheDb {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require('better-sqlite3')
  const db = new Database(path)
  db.exec(`
    CREATE TABLE IF NOT EXISTS portal_cache (
      query_hash TEXT NOT NULL,
      block_from INTEGER NOT NULL,
      block_to INTEGER NOT NULL,
      value BLOB NOT NULL,
      PRIMARY KEY (block_from, block_to, query_hash)
    )
  `)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  const selectStmt = db.prepare(
    'SELECT block_to, value FROM portal_cache WHERE block_from = ? AND query_hash = ?',
  )
  const insertStmt = db.prepare(
    'INSERT OR IGNORE INTO portal_cache (block_from, block_to, query_hash, value) VALUES (?, ?, ?, ?)',
  )
  return {
    selectChunk(blockFrom, queryHash) {
      return selectStmt.get(blockFrom, queryHash) as { block_to: number; value: Buffer } | undefined
    },
    insertChunk(blockFrom, blockTo, queryHash, value) {
      insertStmt.run(blockFrom, blockTo, queryHash, value)
    },
  }
}

/**
 * Yield cached chunks until the cache no longer has a contiguous chunk
 * starting at `cursor.number`, then switch to the live portal stream.
 * Finalized portions of live batches are persisted before yielding.
 * Mirrors pipes' `PortalCacheNodeJs.getStream`.
 */
// Generic stream signature we operate against; intentionally looser
// than PortalClient.prototype.getStream so we don't pin to the exact
// block type emitted by the evm-processor branch.
type AnyGetStream = (
  this: PortalClient,
  query: any,
  options?: any,
) => AsyncIterable<PortalStreamData<BlockLike>>

async function* cachedStream(
  client: PortalClient,
  innerGetStream: AnyGetStream,
  query: any,
  options: any,
  db: PortalCacheDb,
  stats: PortalCacheStats,
  log: (msg: string) => void,
): AsyncGenerator<PortalStreamData<BlockLike>, void, unknown> {
  const queryHash = hashQuery(query)
  let cursor: { number: number; hash: string | undefined } = {
    number: query.fromBlock ?? 0,
    hash: query.parentBlockHash,
  }
  let chunksReplayed = 0

  // 1. Replay contiguous chunks from cache.
  while (true) {
    const row = db.selectChunk(cursor.number, queryHash)
    if (!row) break
    const buf = (await decompressAsync(row.value)) as Buffer
    const decoded = bigintJsonParse(buf.toString('utf8')) as PortalStreamData<BlockLike>
    stats.bump('hit_chunks')
    stats.bump('hit_blocks', decoded.blocks.length)
    yield decoded
    chunksReplayed++
    if (!decoded.blocks.length) break
    const lastBlock = lastOf(decoded.blocks)
    cursor = { number: row.block_to + 1, hash: lastBlock.header.hash }
  }
  if (chunksReplayed > 0) log(`replayed ${chunksReplayed} chunk(s) from cache; resuming live at block ${cursor.number}`)

  if (query.toBlock !== undefined && cursor.number > query.toBlock) return

  // 2. Live tail. Save finalized portion of every batch.
  //
  // `requestedFromBlock` mirrors portal-client's internal per-HTTP-request
  // cursor (which 0.3.2 doesn't expose in batch.meta). It must advance for
  // EVERY batch — even ones without a `finalizedHead` — because the next
  // HTTP request the portal makes uses (last block we received + 1). If we
  // only advance on save, we'd later save a chunk whose claimed range
  // [requestedFromBlock, last] is wider than its actual content, silently
  // hiding the un-saved blocks from future replays.
  let requestedFromBlock = cursor.number
  const liveQuery = { ...query, fromBlock: cursor.number, parentBlockHash: cursor.hash }
  const liveStream = innerGetStream.call(client, liveQuery, options)
  for await (const batch of liveStream) {
    const chunkStart = requestedFromBlock
    if (batch.blocks.length > 0) {
      requestedFromBlock = lastOf(batch.blocks).header.number + 1
    }
    const finalizedHead = batch.finalizedHead?.number
    let saved = false
    if (finalizedHead !== undefined) {
      const finalizedBlocks = batch.blocks.filter((b: BlockLike) => b.header.number <= finalizedHead)
      if (finalizedBlocks.length > 0) {
        const last = lastOf(finalizedBlocks).header.number
        const payload = (await compressAsync(
          bigintJsonStringify({ ...batch, blocks: finalizedBlocks }),
        )) as Buffer
        db.insertChunk(chunkStart, last, queryHash, payload)
        stats.bump('saved_chunks')
        stats.bump('saved_blocks', finalizedBlocks.length)
        stats.bump('saved_bytes', payload.length)
        saved = true
      }
    }
    if (!saved) {
      stats.bump('live_batches')
      stats.bump('live_blocks', batch.blocks.length)
    }
    yield batch
  }
}

let initialized = false

/**
 * Install the cache wrapper on `PortalClient.prototype.getStream`.
 * Idempotent: first call wins; subsequent calls with a different
 * stateSchema are ignored with a warning so the file path stays stable
 * for the life of the process.
 */
export function setupPortalCache(stateSchema: string): void {
  if (!process.env.PORTAL_CACHE || process.env.PORTAL_CACHE === 'false' || process.env.PORTAL_CACHE === '0') {
    return
  }
  if (initialized) {
    console.warn(`[portal-cache] already initialized; ignoring setupPortalCache(${stateSchema})`)
    return
  }
  initialized = true

  const cacheDir = process.env.PORTAL_CACHE_DIR ?? '.portal-cache'
  const logIntervalSec = Number(process.env.PORTAL_CACHE_LOG_INTERVAL ?? '30')
  mkdirSync(cacheDir, { recursive: true })
  const dbPath = `${cacheDir}/${stateSchema}.sqlite`
  const db = openCacheDb(dbPath)
  const stats = new PortalCacheStats()
  startStatsLogger(stateSchema, stats, logIntervalSec)
  const compressor = 'zstdCompress' in zlib ? 'zstd' : 'gzip'
  console.log(`[portal-cache ${stateSchema}] enabled at ${dbPath} (compression=${compressor})`)
  const log = (msg: string) => console.log(`[portal-cache ${stateSchema}] ${msg}`)

  // evm-processor consumes `getFinalizedStream`; we wrap `getStream` too
  // since both go through identical streaming code paths (different portal
  // endpoint, same response shape).
  const innerGetStream = PortalClient.prototype.getStream as unknown as AnyGetStream
  const innerGetFinalizedStream = PortalClient.prototype.getFinalizedStream as unknown as AnyGetStream
  PortalClient.prototype.getStream = function (this: PortalClient, query: any, options?: any): any {
    return cachedStream(this, innerGetStream, query, options, db, stats, log)
  }
  PortalClient.prototype.getFinalizedStream = function (this: PortalClient, query: any, options?: any): any {
    return cachedStream(this, innerGetFinalizedStream, query, options, db, stats, log)
  }
}
