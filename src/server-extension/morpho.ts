import { GraphQLResolveInfo } from 'graphql'
import { Arg, Field, Float, Info, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager, MoreThanOrEqual } from 'typeorm'
import { createPublicClient, fallback, http } from 'viem'
import { base, hyperEvm, mainnet } from 'viem/chains'

import { MorphoVaultApy } from '@model'
import { chainConfigs } from '@originprotocol/squid-utils'
import { computeDepositImpact } from '@templates/morpho/deposit-impact'

import './fetch-polyfill'

/** Parse a time-window string like "6h", "12h", "24h", "7d" into milliseconds. */
function parseWindowMs(window: string): number | null {
  const match = window.match(/^(\d+)(h|d)$/)
  if (!match) return null
  const n = parseInt(match[1], 10)
  const unit = match[2]
  return unit === 'h' ? n * 3600 * 1000 : n * 86400 * 1000
}

const clients = {
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: fallback((chainConfigs[mainnet.id]?.endpoints ?? []).map((url) => http(url))),
  }),
  [base.id]: createPublicClient({
    chain: base,
    transport: fallback((chainConfigs[base.id]?.endpoints ?? []).map((url) => http(url))),
  }),
  [hyperEvm.id]: createPublicClient({
    chain: {
      ...hyperEvm,
      contracts: { multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' as const } },
    },
    transport: http(process.env.RPC_HYPEREVM_ENDPOINT ?? 'https://rpc.hyperliquid.xyz/evm'),
  }),
}

/** Build a viem PublicClient for a given chainId. */
function getViemClient(chainId: number) {
  if (chainId === mainnet.id) {
    return clients[mainnet.id]
  }
  if (chainId === base.id) {
    return clients[base.id]
  }
  if (chainId === hyperEvm.id) {
    return clients[hyperEvm.id]
  }
  throw new Error(`Unsupported chainId: ${chainId}. Supported: ${mainnet.id}, ${base.id}, ${hyperEvm.id}`)
}

// ─── Response types ──────────────────────────────────────────────────────────

@ObjectType()
export class MorphoVaultApyAverageResult {
  @Field(() => Float)
  averageApy!: number

  @Field(() => Float)
  timeWindowHours!: number

  constructor(props: Partial<MorphoVaultApyAverageResult>) {
    Object.assign(this, props)
  }
}

@ObjectType()
export class MorphoDepositImpactResult {
  @Field(() => Float)
  currentApy!: number

  @Field(() => Float)
  newApy!: number

  @Field(() => Int)
  impactBps!: number

  constructor(props: Partial<MorphoDepositImpactResult>) {
    Object.assign(this, props)
  }
}

// ─── Resolver ────────────────────────────────────────────────────────────────

@Resolver()
export class MorphoVaultApyResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  /**
   * Returns the latest indexed APY for a MetaMorpho vault.
   *
   * @param chainId  Chain ID: 1 (Ethereum), 8453 (Base), 999 (HyperEVM)
   * @param vaultAddress  MetaMorpho V1.1 vault address (checksummed or lowercase)
   *
   * @example
   * { morphoVaultApy(chainId: 1, vaultAddress: "0x5B8b...") }
   */
  @Query(() => Float)
  async morphoVaultApy(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('vaultAddress', () => String) vaultAddress: string,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<number> {
    const manager = await this.tx()
    const row = await manager.getRepository(MorphoVaultApy).findOne({
      where: { chainId, vaultAddress: vaultAddress.toLowerCase() },
      order: { timestamp: 'DESC' },
    })
    return row?.apy ?? 0
  }

  /**
   * Returns the average APY for a MetaMorpho vault over a time window.
   *
   * @param chainId  Chain ID: 1 (Ethereum), 8453 (Base), 999 (HyperEVM)
   * @param vaultAddress  MetaMorpho V1.1 vault address (checksummed or lowercase)
   * @param timeWindow  Time window for averaging: "6h", "12h", "24h", "7d"
   *
   * @example
   * { morphoVaultApyAverage(chainId: 1, vaultAddress: "0x5B8b...", timeWindow: "6h") { averageApy timeWindowHours snapshotCount } }
   */
  @Query(() => MorphoVaultApyAverageResult)
  async morphoVaultApyAverage(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('vaultAddress', () => String) vaultAddress: string,
    @Arg('timeWindow', () => String) timeWindow: string,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<MorphoVaultApyAverageResult> {
    const windowMs = parseWindowMs(timeWindow)
    if (windowMs === null) {
      throw new Error(`Invalid timeWindow format: "${timeWindow}". Expected format: "6h", "12h", "24h", "7d"`)
    }

    const manager = await this.tx()
    const cutoff = new Date(Date.now() - windowMs)
    const snapshots = await manager.getRepository(MorphoVaultApy).find({
      where: { chainId, vaultAddress: vaultAddress.toLowerCase(), timestamp: MoreThanOrEqual(cutoff) },
      order: { timestamp: 'ASC' },
    })

    const timeWindowHours = windowMs / 3600000
    const averageApy = snapshots.length > 0 ? snapshots.reduce((sum, s) => sum + s.apy, 0) / snapshots.length : 0

    return new MorphoVaultApyAverageResult({ averageApy, timeWindowHours })
  }

  /**
   * Simulates the APY impact of depositing into a MetaMorpho vault.
   * Makes live on-chain RPC calls — response time ~1-2s.
   *
   * @param chainId  Chain ID: 1 (Ethereum), 8453 (Base), 999 (HyperEVM)
   * @param vaultAddress  MetaMorpho V1.1 vault address
   * @param depositAmount  Deposit amount as a decimal string in loan token units (e.g. "1000000" for 1 USDC)
   *
   * @example
   * { morphoDepositImpact(chainId: 1, vaultAddress: "0x5B8b...", depositAmount: "1000000000000000000000") { currentApy newApy impactBps } }
   */
  @Query(() => MorphoDepositImpactResult)
  async morphoDepositImpact(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('vaultAddress', () => String) vaultAddress: string,
    @Arg('depositAmount', () => String) depositAmount: string,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<MorphoDepositImpactResult> {
    let amount: bigint
    try {
      amount = BigInt(depositAmount)
    } catch {
      throw new Error(`Invalid depositAmount: "${depositAmount}". Must be a valid integer string.`)
    }
    if (amount <= 0n) {
      throw new Error(`depositAmount must be positive, got ${depositAmount}`)
    }
    const client = getViemClient(chainId)
    const result = await computeDepositImpact(client as any, chainId, vaultAddress, amount)
    return new MorphoDepositImpactResult(result)
  }
}
