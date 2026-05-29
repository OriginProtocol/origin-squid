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
  const valAtBlock = classify(atBlock, eip7702Check)
  const validUntil = atTarget !== null && classify(atTarget, eip7702Check) === valAtBlock ? target! : N
  cache.set(account, mergeEntry(cached, { value: valAtBlock, validFrom: N, validUntil }))

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
    const valAtBlock = classify(atBlock, eip7702Check)
    const validUntil = atTarget !== null && classify(atTarget, eip7702Check) === valAtBlock ? target! : N
    const cached = cache.get(account)
    cache.set(account, mergeEntry(cached, { value: valAtBlock, validFrom: N, validUntil }))
    result.set(account, valAtBlock)
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
}

let lastSave = 0
export const saveIsContractCache = async (ctx: Context, force: boolean = false) => {
  if (!cache) return
  if (Date.now() - lastSave < 5 * 60 * 1000 && !force) return
  const id = `${ctx.chain.id}-isContract`
  await ctx.store.save(
    new UtilCache({
      id,
      data: Object.fromEntries(cache),
    }),
  )
  lastSave = Date.now()
}
