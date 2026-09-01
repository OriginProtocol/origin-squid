import { existsSync, readFileSync } from 'fs'

import { UtilCache } from '@model'
import { Block, Context } from '@originprotocol/squid-utils'

let time = 0
let count = 0

const localStoragePath = './data'

/**
 * Width of the validity window for a single verification. On a cache miss
 * for block N, we query `eth_getCode(addr, N)` AND `eth_getCode(addr, target)`
 * where `target` is the next multiple of WINDOW above N. If both classify
 * the same way, the address's status was stable across [N, target] and we
 * cache the answer for that entire range — so the next ~WINDOW blocks of
 * sequential processing all hit the cache.
 *
 * Both calls are cacheable by `rpc-cache.ts` (they take a `0x…` block
 * number, not `'latest'`), and snapping `target` to a WINDOW boundary
 * makes the same target reused by every N in [target-WINDOW, target] —
 * so per-address we cache one `eth_getCode(addr, target)` entry per
 * WINDOW-wide bucket.
 *
 * Chain-aware widths target a ~14-day time horizon per verification so
 * faster chains (Base ~2 s/block, Sonic ~1 s/block, Arbitrum ~0.25 s/block)
 * get proportionally wider windows.
 *
 * Trade-off (accepted): a status transition that happens *after* the
 * verification target (e.g. CREATE2 deployment to a previously-empty
 * address at a block above `target`) won't be caught until the next
 * verification window. Rare in practice; `resetContractCache` is the
 * escape valve.
 */
const VERIFICATION_WINDOWS: Record<number, number> = {
  1: 100_000,        // Ethereum mainnet (~14 days @ 12s)
  42161: 5_000_000,  // Arbitrum (~14 days @ 0.25s)
  8453: 600_000,     // Base (~14 days @ 2s)
  146: 1_200_000,    // Sonic (~14 days @ 1s)
}
const DEFAULT_VERIFICATION_WINDOW = 100_000
const verificationWindow = (chainId: number): number =>
  VERIFICATION_WINDOWS[chainId] ?? DEFAULT_VERIFICATION_WINDOW

type Entry = { value: boolean; validFrom: number; validUntil: number }

let cache: Map<string, Entry>

export const resetContractCache = async (ctx: Context) => {
  cache = new Map()
  await saveIsContractCache(ctx, true)
}

const isEip7702 = (code: string): boolean =>
  code.length === 23 * 2 + 2 && code.startsWith('0xef0100')

const classify = (code: string, eip7702Check: boolean): boolean => {
  if (code === '0x') return false
  if (eip7702Check && isEip7702(code)) return false
  return true
}

const blockHex = (h: number) => `0x${h.toString(16)}`

const nextWindowBoundary = (block: number, window: number): number =>
  Math.ceil((block + 1) / window) * window

const isHexCode = (x: unknown): x is string =>
  typeof x === 'string' && x.startsWith('0x')

/**
 * Build the cache entry for a freshly-fetched code result.
 *
 * Deployed contract code is monotonic for our purposes: since EIP-6780
 * (Cancun) `SELFDESTRUCT` only deletes an account created in the same
 * transaction, so an address that held code at block N still holds it at every
 * later block, and nothing downstream depends on detecting a contract
 * reverting to an EOA. Those entries never expire, which is what lets a
 * restart resume warm for the addresses that actually get touched — pools,
 * vaults and strategies are 7% of addresses but ~43% of lookups.
 *
 * Deliberately *not* applied to EIP-7702 delegations: they have code
 * (`0xef0100…`) but are revocable, and the cache is keyed on address alone, so
 * a delegation classified `true` by an `eip7702Check: false` caller must stay
 * windowed or a later `eip7702Check: true` caller is served a permanent wrong
 * answer. Absence of code stays windowed too — an EOA can still become a
 * contract.
 */
const PERMANENT = Number.MAX_SAFE_INTEGER

const entryFor = (
  atBlock: string,
  atTarget: string | null,
  eip7702Check: boolean,
  N: number,
  target: number | null,
): Entry => {
  const value = classify(atBlock, eip7702Check)
  if (value && !isEip7702(atBlock)) return { value, validFrom: N, validUntil: PERMANENT }
  const validUntil = atTarget !== null && classify(atTarget, eip7702Check) === value ? target! : N
  return { value, validFrom: N, validUntil }
}

const mergeEntry = (existing: Entry | undefined, fresh: Entry): Entry => {
  if (!existing || existing.value !== fresh.value) return fresh
  return {
    value: fresh.value,
    validFrom: Math.min(existing.validFrom, fresh.validFrom),
    validUntil: Math.max(existing.validUntil, fresh.validUntil),
  }
}

/**
 * Fetch `eth_getCode` for each account at block `N` and, when `target` is
 * non-null, also at `target`. If the dual batch fails or returns malformed
 * results, falls back to a single-block batch. Returns `atTarget = null`
 * when the target read was skipped or invalid.
 */
async function fetchCodes(
  ctx: Context,
  accounts: string[],
  N: number,
  target: number | null,
): Promise<Array<{ atBlock: string; atTarget: string | null }>> {
  if (target !== null) {
    const dual = accounts.flatMap((acc) => [
      { method: 'eth_getCode', params: [acc, blockHex(N)] },
      { method: 'eth_getCode', params: [acc, blockHex(target)] },
    ])
    try {
      const r = (await ctx._chain.client.batchCall(dual)) as unknown[]
      const valid = accounts.every((_, i) => isHexCode(r[i * 2]) && isHexCode(r[i * 2 + 1]))
      if (valid) {
        return accounts.map((_, i) => ({
          atBlock: r[i * 2] as string,
          atTarget: r[i * 2 + 1] as string,
        }))
      }
    } catch {
      // fall through to single-block batch
    }
  }
  const single = accounts.map((acc) => ({
    method: 'eth_getCode',
    params: [acc, blockHex(N)],
  }))
  const r = (await ctx._chain.client.batchCall(single)) as unknown[]
  return accounts.map((acc, i) => {
    const code = r[i]
    if (!isHexCode(code)) throw new Error(`eth_getCode returned non-hex for ${acc} @ ${N}`)
    return { atBlock: code, atTarget: null }
  })
}

export const isContract = async (
  ctx: Context,
  block: Block,
  account: string,
  eip7702Check: boolean = false,
): Promise<boolean> => {
  if (account === '0x0000000000000000000000000000000000000000') return false
  const N = block.header.height
  const cached = cache.get(account)
  if (cached && cached.validFrom <= N && N <= cached.validUntil) {
    return cached.value
  }
  const start = Date.now()
  // Skip the forward verification when this batch contains the chain head —
  // `target` would be past head, RPC would error or return garbage.
  const target = ctx.isHead ? null : nextWindowBoundary(N, verificationWindow(ctx.chain.id))

  const [{ atBlock, atTarget }] = await fetchCodes(ctx, [account], N, target)
  const entry = entryFor(atBlock, atTarget, eip7702Check, N, target)
  const valAtBlock = entry.value
  cache.set(account, mergeEntry(cached, entry))

  time += Date.now() - start
  count++
  if (process.env.DEBUG_PERF === 'true') {
    ctx.log.info(`isContract ${count} ${time / count}`)
  }
  return valAtBlock
}

/**
 * Batch check if multiple accounts are contracts.
 */
export const areContracts = async (
  ctx: Context,
  block: Block,
  accounts: string[],
  eip7702Check: boolean = false,
): Promise<Map<string, boolean>> => {
  if (!accounts.length) return new Map()

  const N = block.header.height
  const result = new Map<string, boolean>()
  const accountsToCheck: string[] = []

  for (const account of accounts) {
    if (account === '0x0000000000000000000000000000000000000000') {
      result.set(account, false)
      continue
    }
    const cached = cache.get(account)
    if (cached && cached.validFrom <= N && N <= cached.validUntil) {
      result.set(account, cached.value)
      continue
    }
    accountsToCheck.push(account)
  }

  if (!accountsToCheck.length) return result

  const start = Date.now()
  const target = ctx.isHead ? null : nextWindowBoundary(N, verificationWindow(ctx.chain.id))
  const fetched = await fetchCodes(ctx, accountsToCheck, N, target)

  for (let i = 0; i < accountsToCheck.length; i++) {
    const account = accountsToCheck[i]
    const { atBlock, atTarget } = fetched[i]
    const entry = entryFor(atBlock, atTarget, eip7702Check, N, target)
    const cached = cache.get(account)
    cache.set(account, mergeEntry(cached, entry))
    result.set(account, entry.value)
  }

  time += Date.now() - start
  count++
  if (process.env.DEBUG_PERF === 'true') {
    ctx.log.info(
      `areContracts batch of ${accountsToCheck.length}: ${Date.now() - start}ms, avg total: ${time / count}ms`,
    )
  }

  return result
}

const isEntry = (v: unknown): v is Entry =>
  typeof v === 'object' &&
  v !== null &&
  typeof (v as Entry).value === 'boolean' &&
  typeof (v as Entry).validFrom === 'number' &&
  typeof (v as Entry).validUntil === 'number'

export const loadIsContractCache = async (ctx: Context) => {
  if (cache) return
  const id = `${ctx.chain.id}-isContract`
  const fromJson = (data: Record<string, unknown>): Map<string, Entry> => {
    const m = new Map<string, Entry>()
    for (const [k, v] of Object.entries(data)) {
      if (isEntry(v)) m.set(k, { value: v.value, validFrom: v.validFrom, validUntil: v.validUntil })
    }
    return m
  }
  const entity = await ctx.store.get(UtilCache, id)
  if (entity) {
    cache = fromJson(entity.data as Record<string, unknown>)
    ctx.log.info('Loaded isContract cache from database: ' + cache.size + ' entries')
  } else if (existsSync(`${localStoragePath}/${id}.json`)) {
    try {
      const fileData = JSON.parse(readFileSync(`${localStoragePath}/${id}.json`, 'utf8'))
      cache = fromJson(fileData)
      ctx.log.info('Loaded isContract cache from file: ' + cache.size + ' entries')
    } catch (e) {
      console.error('Error loading isContract cache from file:', e)
      cache = new Map()
    }
  } else {
    cache = new Map()
  }
  // Whatever we just loaded is already durable; only growth beyond it counts.
  lastSavedSize = cache.size
}

const SAVE_INTERVAL_MS = 5 * 60 * 1000
// Save regardless of the interval once this many new addresses have been
// learned. See below for why the interval alone is not enough.
const SAVE_GROWTH_THRESHOLD = 250

let lastSave = 0
let lastSavedSize = 0

/**
 * Persist the cache into `util_cache`.
 *
 * The write goes through `ctx.store`, so it commits with the batch and is
 * discarded with it. `lastSave` is advanced when `store.save()` resolves,
 * which is *not* the same as the batch committing — so a batch that later
 * rolls back leaves `lastSave` advanced while nothing was persisted, and the
 * time-based throttle then suppresses the next several saves. On a processor
 * whose batches are failing that turns one lost batch into minutes of lost
 * learning, precisely when re-learning is most expensive.
 *
 * Growth is the durable signal: after a rollback the retry re-walks the same
 * range and repopulates `cache`, so `cache.size` climbs back past
 * `lastSavedSize` and forces a save that the clock alone would have skipped.
 */
export const saveIsContractCache = async (ctx: Context, force: boolean = false) => {
  if (!cache) return
  const grown = cache.size - lastSavedSize >= SAVE_GROWTH_THRESHOLD
  if (!force && !grown && Date.now() - lastSave < SAVE_INTERVAL_MS) return
  const id = `${ctx.chain.id}-isContract`
  await ctx.store.save(
    new UtilCache({
      id,
      data: Object.fromEntries(cache),
    }),
  )
  lastSave = Date.now()
  lastSavedSize = cache.size
}
