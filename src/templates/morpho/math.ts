/**
 * Pure APY math for Morpho Blue / MetaMorpho vaults.
 * No external dependencies — fully unit-testable.
 *
 * Ported from morpho-apy-plan.md §3.1 and §3.4.
 */

const TARGET_UTIL = 0.9
const STEEPNESS = 4
const WAD = 1e18
const SECONDS_PER_YEAR = 365 * 24 * 3600 // 365-day year, no leap year — matches Morpho convention

/**
 * Adaptive Curve IRM: deviation from target utilisation.
 * Returns a signed multiplier applied to rateAtTarget.
 */
function _curve(util: number): number {
  const err = (util - TARGET_UTIL) / TARGET_UTIL
  if (err < 0) {
    return STEEPNESS * err // below target: linear decrease
  }
  return (STEEPNESS * (util - TARGET_UTIL)) / (1 - TARGET_UTIL) // above target: steeper increase
}

/**
 * Compute supply and borrow APY for a single Morpho Blue market.
 *
 * @param depositAmt - Extra supply to simulate (0 for current rate). In token units (float).
 * @param totalSupply - Current total supply assets. In token units (float).
 * @param totalBorrows - Current total borrow assets. In token units (float).
 * @param fee - Protocol fee, WAD-scaled (raw bigint converted to number before passing).
 * @param rateAtTarget - Per-second borrow rate at 90% utilisation, WAD-scaled (raw int256 as number).
 */
export function estimateMarketApy(
  depositAmt: number,
  totalSupply: number,
  totalBorrows: number,
  fee: number,
  rateAtTarget: number,
): { supplyApy: number; borrowApy: number } {
  const supply = totalSupply + depositAmt
  if (supply <= 0 || rateAtTarget <= 0) {
    return { supplyApy: 0, borrowApy: 0 }
  }

  const util = Math.min(totalBorrows / supply, 0.9999) // clamp to avoid division by zero
  const ratePerSec = rateAtTarget / WAD
  const borrowRate = ratePerSec * Math.exp(_curve(util))
  const borrowApy = Math.exp(borrowRate * SECONDS_PER_YEAR) - 1 // continuous compounding
  const supplyApy = borrowApy * util * (1 - fee / WAD) // supply earns util% minus protocol fee

  return { supplyApy, borrowApy }
}

export interface MarketForApy {
  marketId: string
  totalSupplyAssets: bigint
  totalBorrowAssets: bigint
  fee: bigint
  vaultSupplyAssets: bigint
  rateAtTarget: bigint
  decimals: number
  inSupplyQueue: boolean
  cap: bigint
}

/**
 * Compute the position-weighted vault APY across all markets.
 *
 * @param markets - All markets (both supply + withdraw queues).
 * @param depositSim - Optional map of { marketId → extra bigint supply } for deposit simulation.
 *
 * @throws Error if all markets have zero vault supply weight — indicates misconfiguration.
 *         Returns 0 (not throws) if markets array is empty.
 */
export function weightedVaultApy(markets: MarketForApy[], depositSim: Record<string, bigint> = {}): number {
  if (markets.length === 0) return 0

  let weightedSum = 0
  let totalWeight = 0

  const suspiciousMarkets = markets.filter((m) => m.rateAtTarget === 0n && m.totalBorrowAssets > 0n)
  if (suspiciousMarkets.length > 0) {
    console.warn(
      `[morpho-apy] ${suspiciousMarkets.length} market(s) have rateAtTarget=0 but non-zero borrows — ` +
        `IRM may not implement rateAtTarget(). APY may be underestimated.`,
    )
  }

  for (const m of markets) {
    const scale = Math.pow(10, m.decimals)

    // Apply deposit simulation: increase totalSupplyAssets for target markets
    const simSupply = depositSim[m.marketId] ? m.totalSupplyAssets + depositSim[m.marketId] : m.totalSupplyAssets

    // Convert BigInt → float via string to avoid Number.MAX_SAFE_INTEGER overflow
    const supply = Number(simSupply.toString()) / scale
    const borrows = Number(m.totalBorrowAssets.toString()) / scale
    const fee = Number(m.fee.toString()) // stays WAD-scaled; /WAD done inside estimateMarketApy
    const rate = Number(m.rateAtTarget.toString()) // stays WAD-scaled

    const { supplyApy } = estimateMarketApy(0, supply, borrows, fee, rate)
    const weight = Number(m.vaultSupplyAssets.toString()) / scale

    if (weight <= 0) continue

    weightedSum += supplyApy * weight
    totalWeight += weight
  }

  if (totalWeight <= 0) {
    throw new Error(
      `[morpho-apy] Vault has zero supply position across all ${markets.length} market(s). ` +
        `Check vault address or wait for funds to be deployed.`,
    )
  }

  return weightedSum / totalWeight
}

/**
 * Simulate how a deposit flows through the supply queue and build a depositSim map.
 *
 * Deposits fill each supply-queue market up to its cap, then spill to the next.
 * Returns a Record<marketId, bigint> representing extra supply per market.
 */
export function simulateDeposit(markets: MarketForApy[], depositAmount: bigint): Record<string, bigint> {
  const sim: Record<string, bigint> = {}
  let remaining = depositAmount

  for (const m of markets) {
    if (!m.inSupplyQueue) continue
    if (remaining === 0n) break

    // How much more can this market absorb (vault cap - current vault supply)?
    const available = m.cap > m.vaultSupplyAssets ? m.cap - m.vaultSupplyAssets : 0n
    if (available === 0n) continue

    const fill = remaining < available ? remaining : available
    sim[m.marketId] = fill
    remaining -= fill
  }

  return sim
}
