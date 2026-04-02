/**
 * Market data fetching for Morpho Blue / MetaMorpho vaults.
 *
 * Two fetch implementations:
 * - `fetchVaultMarkets` — uses Subsquid multicall (for processors)
 * - `fetchVaultMarketsViem` — uses viem readContract (for GraphQL server resolvers)
 *
 * Convenience wrappers that also compute the weighted APY:
 * - `fetchVaultApy` — Subsquid version, returns null if vault has no markets
 * - `fetchVaultApyViem` — viem version, returns { apy, markets } or null
 */

import * as erc20 from '@abi/erc20'
import { ABI_JSON as ERC20_ABI_JSON } from '@abi/erc20.abi'
import * as irmAbi from '@abi/irm-adaptive-curve'
import { ABI_JSON as IRM_ABI_JSON } from '@abi/irm-adaptive-curve.abi'
import * as metaMorphoAbi from '@abi/meta-morpho'
import { ABI_JSON as META_MORPHO_ABI_JSON } from '@abi/meta-morpho.abi'
import * as morphoAbi from '@abi/morpho'
import { ABI_JSON as MORPHO_ABI_JSON } from '@abi/morpho.abi'
import { Block, Context, multicall, range } from '@originprotocol/squid-utils'
import type { PublicClient } from 'viem'
import { getAddress } from 'viem'

import { ADDRESS_ZERO } from '@utils/addresses'
import type { MarketForApy } from './math'
import { weightedVaultApy } from './math'

// ─── Subsquid-based fetch (for processors) ───────────────────────────────────

/**
 * Fetch all market data for a MetaMorpho vault using Subsquid multicall.
 * Unions both supply and withdraw queues and marks each with `inSupplyQueue`.
 *
 * Returns an empty array if both queues are empty (vault not yet deployed).
 */
export async function fetchVaultMarkets(
  ctx: Context,
  block: Block['header'],
  vaultAddress: string,
  morphoAddress: string,
): Promise<MarketForApy[]> {
  const vault = new metaMorphoAbi.Contract(ctx, block, vaultAddress)

  // 1. Queue lengths
  const [supplyLen, withdrawLen] = await Promise.all([
    vault.supplyQueueLength().then(Number),
    vault.withdrawQueueLength().then(Number),
  ])

  if (supplyLen === 0 && withdrawLen === 0) return []

  // 2. Market IDs from both queues (via multicall, parallel)
  const [supplyIds, withdrawIds] = await Promise.all([
    supplyLen > 0
      ? multicall(ctx, block, metaMorphoAbi.functions.supplyQueue, vaultAddress, range(supplyLen).map((i) => ({ _0: i })))
      : ([] as string[]),
    withdrawLen > 0
      ? multicall(ctx, block, metaMorphoAbi.functions.withdrawQueue, vaultAddress, range(withdrawLen).map((i) => ({ _0: i })))
      : ([] as string[]),
  ])

  // 3. Union: supply queue first, then withdraw-only markets
  const supplySet = new Set(supplyIds)
  const allIds = [...new Set([...supplyIds, ...withdrawIds])]

  if (allIds.length === 0) return []

  // 4. Fetch market state, vault position, market params, vault config (parallel multicalls)
  const [marketStates, positions, marketParams, configs] = await Promise.all([
    multicall(ctx, block, morphoAbi.functions.market, morphoAddress, allIds.map((id) => ({ _0: id }))),
    multicall(ctx, block, morphoAbi.functions.position, morphoAddress, allIds.map((id) => ({ _0: id, _1: vaultAddress }))),
    multicall(ctx, block, morphoAbi.functions.idToMarketParams, morphoAddress, allIds.map((id) => ({ _0: id }))),
    multicall(ctx, block, metaMorphoAbi.functions.config, vaultAddress, allIds.map((id) => ({ _0: id }))),
  ])

  // 5. Per-market: IRM rateAtTarget + loanToken decimals (parallel)
  const [ratesAtTarget, decimals] = await Promise.all([
    Promise.all(
      marketParams.map(async (params, i) => {
        const irmAddress = params.irm
        if (!irmAddress || irmAddress === ADDRESS_ZERO) return 0n
        try {
          const irm = new irmAbi.Contract(ctx, block, irmAddress)
          const rate = await irm.rateAtTarget(allIds[i])
          return rate < 0n ? 0n : rate // treat negative rateAtTarget as 0
        } catch {
          return 0n
        }
      }),
    ),
    Promise.all(
      marketParams.map(async (params) => {
        try {
          const token = new erc20.Contract(ctx, block, params.loanToken)
          return await token.decimals()
        } catch {
          return 18 // default if decimals() is unavailable
        }
      }),
    ),
  ])

  // 6. Assemble MarketForApy objects
  return allIds.map((marketId, i) => {
    const state = marketStates[i]
    const pos = positions[i]
    const cfg = configs[i]

    // Derive vault supply assets from shares: shares * totalSupply / totalShares
    let vaultSupplyAssets = 0n
    if (pos.supplyShares > 0n && state.totalSupplyShares > 0n) {
      vaultSupplyAssets = (pos.supplyShares * state.totalSupplyAssets) / state.totalSupplyShares
    }

    return {
      marketId,
      totalSupplyAssets: state.totalSupplyAssets,
      totalBorrowAssets: state.totalBorrowAssets,
      fee: state.fee,
      vaultSupplyAssets,
      rateAtTarget: ratesAtTarget[i],
      cap: cfg.cap,
      decimals: decimals[i],
      inSupplyQueue: supplySet.has(marketId),
    } satisfies MarketForApy
  })
}

// ─── Viem-based fetch (for GraphQL server / live RPC calls) ──────────────────

/**
 * Fetch all market data for a MetaMorpho vault using viem.
 * Used in GraphQL server resolvers where no Subsquid context is available.
 */
export async function fetchVaultMarketsViem(
  client: PublicClient,
  vaultAddress: string,
  morphoAddress: string,
): Promise<MarketForApy[]> {
  const vault = getAddress(vaultAddress)
  const morpho = getAddress(morphoAddress)

  // 1. Queue lengths
  const [supplyLen, withdrawLen] = await client.multicall({
    contracts: [
      { address: vault, abi: META_MORPHO_ABI_JSON, functionName: 'supplyQueueLength' },
      { address: vault, abi: META_MORPHO_ABI_JSON, functionName: 'withdrawQueueLength' },
    ],
    allowFailure: false,
  })

  const supplyLenN = Number(supplyLen as bigint)
  const withdrawLenN = Number(withdrawLen as bigint)
  if (supplyLenN === 0 && withdrawLenN === 0) return []

  // 2. Market IDs from both queues
  const queueCalls = [
    ...Array.from({ length: supplyLenN }, (_, i) => ({ address: vault, abi: META_MORPHO_ABI_JSON, functionName: 'supplyQueue' as const, args: [BigInt(i)] })),
    ...Array.from({ length: withdrawLenN }, (_, i) => ({ address: vault, abi: META_MORPHO_ABI_JSON, functionName: 'withdrawQueue' as const, args: [BigInt(i)] })),
  ]

  const queueResults = await client.multicall({ contracts: queueCalls, allowFailure: false })
  const supplyIds = queueResults.slice(0, supplyLenN) as `0x${string}`[]
  const withdrawIds = queueResults.slice(supplyLenN) as `0x${string}`[]

  // 3. Union market IDs
  const supplySet = new Set(supplyIds)
  const allIds = [...new Set([...supplyIds, ...withdrawIds])]

  if (allIds.length === 0) return []

  // 4. Fetch market state, position, params, config
  const perMarketCalls = allIds.flatMap((id) => [
    { address: morpho, abi: MORPHO_ABI_JSON, functionName: 'market' as const, args: [id] },
    { address: morpho, abi: MORPHO_ABI_JSON, functionName: 'position' as const, args: [id, vault] },
    { address: morpho, abi: MORPHO_ABI_JSON, functionName: 'idToMarketParams' as const, args: [id] },
    { address: vault, abi: META_MORPHO_ABI_JSON, functionName: 'config' as const, args: [id] },
  ])

  const perMarketResults = await client.multicall({ contracts: perMarketCalls, allowFailure: false })

  // Parse per-market results (4 calls per market)
  const parsed = allIds.map((_, i) => {
    const base = i * 4
    const state = perMarketResults[base] as unknown as { totalSupplyAssets: bigint; totalSupplyShares: bigint; totalBorrowAssets: bigint; fee: bigint }
    const pos = perMarketResults[base + 1] as unknown as { supplyShares: bigint }
    const params = perMarketResults[base + 2] as unknown as { loanToken: `0x${string}`; irm: `0x${string}` }
    const cfg = perMarketResults[base + 3] as unknown as { cap: bigint }
    return { state, pos, params, cfg }
  })

  // 5. Per-market IRM + decimals (single multicall batch)
  const irmAndDecimalCalls = parsed.flatMap(({ params }, i) => {
    const hasIrm = params.irm && params.irm.toLowerCase() !== ADDRESS_ZERO
    return [
      hasIrm
        ? { address: getAddress(params.irm), abi: IRM_ABI_JSON, functionName: 'rateAtTarget' as const, args: [allIds[i]] }
        : null,
      { address: getAddress(params.loanToken), abi: ERC20_ABI_JSON, functionName: 'decimals' as const },
    ]
  })
  const irmAndDecimalResults = await client.multicall({
    contracts: irmAndDecimalCalls.filter((c): c is NonNullable<typeof c> => c !== null).map((c) => ({ ...c, allowFailure: true })) as any,
    allowFailure: true,
  })

  // Map results back, accounting for skipped IRM calls
  let resultIdx = 0
  const ratesAtTarget: bigint[] = []
  const decimals: number[] = []
  for (const { params } of parsed) {
    const hasIrm = params.irm && params.irm.toLowerCase() !== ADDRESS_ZERO
    if (hasIrm) {
      const r = irmAndDecimalResults[resultIdx++]
      const rate = r.status === 'success' ? (r.result as bigint) : 0n
      ratesAtTarget.push(rate < 0n ? 0n : rate)
    } else {
      ratesAtTarget.push(0n)
    }
    const d = irmAndDecimalResults[resultIdx++]
    decimals.push(d.status === 'success' ? Number(d.result) : 18)
  }

  // 6. Assemble
  return allIds.map((marketId, i) => {
    const { state, pos, cfg } = parsed[i]
    let vaultSupplyAssets = 0n
    if (pos.supplyShares > 0n && state.totalSupplyShares > 0n) {
      vaultSupplyAssets = (pos.supplyShares * state.totalSupplyAssets) / state.totalSupplyShares
    }

    return {
      marketId,
      totalSupplyAssets: state.totalSupplyAssets,
      totalBorrowAssets: state.totalBorrowAssets,
      fee: state.fee,
      vaultSupplyAssets,
      rateAtTarget: ratesAtTarget[i],
      cap: cfg.cap,
      decimals: decimals[i],
      inSupplyQueue: supplySet.has(marketId as `0x${string}`),
    } satisfies MarketForApy
  })
}

// ─── Convenience wrappers: fetch + APY in one call ───────────────────────────

/**
 * Fetch vault markets and compute the weighted APY in one call (Subsquid version).
 * Returns null if the vault has no markets yet (not yet deployed).
 */
export async function fetchVaultApy(
  ctx: Context,
  block: Block['header'],
  vaultAddress: string,
  morphoAddress: string,
): Promise<number | null> {
  const markets = await fetchVaultMarkets(ctx, block, vaultAddress, morphoAddress)
  if (markets.length === 0) return null
  return weightedVaultApy(markets)
}

/**
 * Fetch vault markets and compute the weighted APY in one call (viem version).
 * Returns null if the vault has no markets yet (not yet deployed).
 * Returns both `apy` and `markets` so callers can reuse markets for simulation
 * without a second RPC round-trip.
 */
export async function fetchVaultApyViem(
  client: PublicClient,
  vaultAddress: string,
  morphoAddress: string,
): Promise<{ apy: number; markets: MarketForApy[] } | null> {
  const markets = await fetchVaultMarketsViem(client, vaultAddress, morphoAddress)
  if (markets.length === 0) return null
  return { apy: weightedVaultApy(markets), markets }
}
