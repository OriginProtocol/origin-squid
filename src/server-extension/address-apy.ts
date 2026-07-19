import { Arg, Field, Float, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'

const E18 = 'power(10::numeric, 18)'
const E36 = 'power(10::numeric, 36)'

/**
 * Cap on a single day's fractional return, used to discard corrupt per-day yield rows.
 *
 * Exit-day / cost-basis-reset checkpoints in the per-address yield series can book a
 * `yield` that is large relative to the (collapsed, near-zero) denominator that produced
 * it, giving per-day returns from ~0.4%/day up to 1e9+/day. Money-weighting does NOT
 * dilute these — Σyield stays large while Σdenom collapses — so the aggregate daily rate
 * `d` inflates: severe spikes push d past ~6, where power(1 + d, 365) overflows float8
 * (error 22003) and 500s the whole query; milder ones (~0.4–1%/day) yield absurd-but-
 * finite rates (150%–6000% APY).
 *
 * Empirically, legitimate per-day |yield|/denom tops out around 7e-4/day (0.07%) across
 * every product (ARM/OToken/wOToken/xOGN, p99 ≤ 3e-4), and the artifact band starts near
 * 2e-3/day (0.2%) with an empty gap between. 0.2%/day (a ~73% simple-APR-equivalent
 * single day — far above anything these products actually pay) sits in that gap: it drops
 * every artifact while leaving real days untouched, so healthy APY/APR is unchanged. The
 * filter is symmetric (|yield|) so negative artifacts are caught too, and it bounds
 * |d| ≤ MAX_DAILY_RATE, keeping the annualization finite.
 */
const MAX_DAILY_RATE = 0.002
/** `WHERE`-clause fragment dropping corrupt (large-|yield|-vs-dust-denom) days. */
const dailyRateFilter = (yieldCol: string, denomCol: string) =>
  `abs(${yieldCol}::numeric) <= ${denomCol}::numeric * ${MAX_DAILY_RATE}`

/**
 * Minimum current USD value for a position to count as "held" in the portfolio blend.
 *
 * The portfolio APY is meant to describe the holder's *current* positions. A withdrawal
 * leaves behind share/rounding dust (a few wei), and because a weighted average of a
 * single position equals that position's rate regardless of how small its absolute weight
 * is, a holder whose only remaining position is dust would otherwise be assigned that
 * (now meaningless) position's APY. Excluding positions below one cent drops fully-exited
 * holdings entirely — a dust-only holder correctly reports productCount 0 / apy 0 — and
 * matches the frontend already hiding dust from the Yield Positions list. Any genuine
 * position is worth far more than a cent, so real holdings are never excluded.
 */
const DUST_USD = 0.01

/**
 * Per-address realized yield rate for a holder of an ARM vault or an OToken.
 *
 * Both rates are money-weighted: we sum the holder's actual daily yield and
 * divide by the sum of their daily position value (value-days), so each day is
 * weighted by the capital actually deployed. This is naturally robust to dust
 * (a position withdrawn down to a few wei contributes ~0 to both sums) — unlike
 * averaging a per-day `yield / value` ratio, which explodes on tiny denominators.
 *
 *   d   = Σ(yield) / Σ(value)      -- mean daily fractional return
 *   apr = d * 365                  -- simple annualization
 *   apy = (1 + d) ^ 365 - 1        -- compound (ARM/OToken yield auto-compounds on-chain)
 *
 * Both are returned as fractions (0.031 == 3.1%).
 */
@ObjectType()
export class AddressApyResult {
  @Field(() => Float, { description: 'Simple annualized realized rate (APR), as a fraction.' })
  apr!: number

  @Field(() => Float, { description: 'Compound annualized realized rate (APY), as a fraction.' })
  apy!: number

  @Field(() => Int, { description: 'Number of days the address held a non-zero position (the sample size).' })
  heldDays!: number

  constructor(props: Partial<AddressApyResult>) {
    Object.assign(this, props)
  }
}

/**
 * Blended realized yield rate across every Origin position an address currently holds
 * (ARM vaults + OTokens, all chains). Each product contributes its own native
 * (denomination-local) APY; the products are combined as a weighted average using each
 * position's *current* USD value as the weight:
 *
 *   portfolioApy = Σ(currentUsdValue_p × apy_p) / Σ currentUsdValue_p
 *
 * Native yield stays native — USD is only the common ruler used to weigh positions
 * against each other — so market price direction never inflates or deflates the rate;
 * it only shifts how positions are weighted right now. A position that has been fully
 * exited has a current value of ~0 and therefore drops out.
 */
@ObjectType()
export class PortfolioApyResult {
  @Field(() => Float, { description: "USD-value-weighted blend of each position's simple APR, as a fraction." })
  apr!: number

  @Field(() => Float, { description: "USD-value-weighted blend of each position's compound APY, as a fraction." })
  apy!: number

  @Field(() => Int, { description: 'Number of currently-held products contributing to the blend.' })
  productCount!: number

  @Field(() => Float, { description: 'Total current USD value of the positions included in the blend.' })
  totalUsdValue!: number

  constructor(props: Partial<PortfolioApyResult>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class AddressApyResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  /**
   * Realized APR/APY for an address's position in an ARM vault.
   *
   * @param chainId  Chain ID (e.g. 1 for Ethereum, 146 for Sonic)
   * @param arm      ARM vault address (checksummed or lowercase)
   * @param address  Holder address (checksummed or lowercase)
   *
   * @example
   * { armAddressApy(chainId: 1, arm: "0x85B7...", address: "0x2199...") { apr apy heldDays } }
   */
  @Query(() => AddressApyResult)
  async armAddressApy(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('arm', () => String) arm: string,
    @Arg('address', () => String) address: string,
  ): Promise<AddressApyResult> {
    return this.computeApy('arm_address_yield', 'arm', 'value', chainId, arm, address)
  }

  /**
   * Realized APR/APY for an address's position in an OToken (OUSD, OETH, OS, superOETH, …).
   * The denominator is `balance` (OTokens are rebasing, so balance tracks position value).
   * Opted-out (non-rebasing) accounts earn no yield and therefore return 0.
   *
   * @param chainId  Chain ID (e.g. 1 for Ethereum, 8453 for Base, 146 for Sonic)
   * @param otoken   OToken address (checksummed or lowercase)
   * @param address  Holder address (checksummed or lowercase)
   *
   * @example
   * { oTokenAddressApy(chainId: 1, otoken: "0x856c...", address: "0xa4c6...") { apr apy heldDays } }
   */
  @Query(() => AddressApyResult)
  async oTokenAddressApy(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('otoken', () => String) otoken: string,
    @Arg('address', () => String) address: string,
  ): Promise<AddressApyResult> {
    return this.computeApy('o_token_address_yield', 'otoken', 'balance', chainId, otoken, address)
  }

  /**
   * Realized APR/APY for an address's position in a wrapped OToken (wOETH, wOUSD, wsuperOETHb, wOS).
   * The denominator is `value` (balance × assetsPerShare, in underlying OToken units) since a wrapped
   * OToken is non-rebasing — its share balance is constant and yield accrues via the share price.
   *
   * @param chainId  Chain ID (e.g. 1 for Ethereum, 8453 for Base, 146 for Sonic)
   * @param wotoken  Wrapped OToken address (checksummed or lowercase)
   * @param address  Holder address (checksummed or lowercase)
   *
   * @example
   * { wOTokenAddressApy(chainId: 1, wotoken: "0xdcee...", address: "0xa4c6...") { apr apy heldDays } }
   */
  @Query(() => AddressApyResult)
  async wOTokenAddressApy(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('wotoken', () => String) wotoken: string,
    @Arg('address', () => String) address: string,
  ): Promise<AddressApyResult> {
    return this.computeApy('wo_token_address_yield', 'wotoken', 'value', chainId, wotoken, address)
  }

  /**
   * Realized APR/APY for an address's xOGN staking position. Rewards accrue in OGN; the denominator
   * is `staked_balance` (the OGN principal). Note the holder is the `account` column here (the
   * `address` column is the staking contract).
   *
   * @param chainId  Chain ID (1 for Ethereum — xOGN is mainnet-only)
   * @param staking  xOGN staking contract address (checksummed or lowercase)
   * @param account  Staker address (checksummed or lowercase)
   *
   * @example
   * { esAddressApy(chainId: 1, staking: "0x6389...", account: "0x6330...") { apr apy heldDays } }
   */
  @Query(() => AddressApyResult)
  async esAddressApy(
    @Arg('chainId', () => Int) chainId: number,
    @Arg('staking', () => String) staking: string,
    @Arg('account', () => String) account: string,
  ): Promise<AddressApyResult> {
    return this.computeApy('es_address_yield', 'address', 'staked_balance', chainId, staking, account, 'account')
  }

  /**
   * Blended realized APR/APY across every Origin position (ARM + OToken) an address
   * currently holds. Each position's native APY is weighted by its current USD value.
   *
   * @param address  Holder address (checksummed or lowercase)
   * @param chainId  Optional chain filter; omit to blend across all chains.
   *
   * @example
   * { addressApy(address: "0x2199...") { apr apy productCount totalUsdValue } }
   */
  @Query(() => PortfolioApyResult)
  async addressApy(
    @Arg('address', () => String) address: string,
    @Arg('chainId', () => Int, { nullable: true }) chainId?: number | null,
  ): Promise<PortfolioApyResult> {
    const manager = await this.tx()
    // Qualify chain_id per context: the weight CTE joins two tables that both
    // have chain_id, so a bare reference would be ambiguous.
    const chainFilter = (col: string) => `($2::int IS NULL OR ${col} = $2)`
    const sql = `
      WITH native AS (
        -- per-product native all-time daily rate, over the days the position was held.
        -- d_native is clamped to ±MAX_DAILY_RATE as a defensive backstop; the per-day
        -- filter (${MAX_DAILY_RATE}/day) below already bounds it there by dropping corrupt
        -- exit-day rows, so the clamp only bites if a future change removes the filter.
        SELECT chain_id, product,
               least(greatest((sum_yield / sum_denom)::float8, -${MAX_DAILY_RATE}), ${MAX_DAILY_RATE}) AS d_native
        FROM (
          SELECT chain_id, arm AS product,
                 sum("yield"::numeric) AS sum_yield, sum(value::numeric) AS sum_denom
          FROM arm_address_yield
          WHERE address = $1 AND value > 0 AND ${chainFilter('chain_id')}
            AND ${dailyRateFilter('"yield"', 'value')}
          GROUP BY chain_id, arm
          UNION ALL
          SELECT chain_id, otoken,
                 sum("yield"::numeric), sum(balance::numeric)
          FROM o_token_address_yield
          WHERE address = $1 AND balance > 0 AND ${chainFilter('chain_id')}
            AND ${dailyRateFilter('"yield"', 'balance')}
          GROUP BY chain_id, otoken
          UNION ALL
          SELECT chain_id, wotoken,
                 sum("yield"::numeric), sum(value::numeric)
          FROM wo_token_address_yield
          WHERE address = $1 AND value > 0 AND ${chainFilter('chain_id')}
            AND ${dailyRateFilter('"yield"', 'value')}
          GROUP BY chain_id, wotoken
          UNION ALL
          -- xOGN staking: holder is the account column, product is the staking-contract address; the
          -- denominator is the OGN principal (staked_balance), matching the OGN-denominated yield.
          SELECT chain_id, address AS product,
                 sum("yield"::numeric), sum(staked_balance::numeric)
          FROM es_address_yield
          WHERE account = $1 AND staked_balance > 0 AND ${chainFilter('chain_id')}
            AND ${dailyRateFilter('"yield"', 'staked_balance')}
          GROUP BY chain_id, address
        ) s
        WHERE sum_denom > 0
      ),
      weight AS (
        -- current USD value per product: the latest daily row valued at that day's USD rate.
        -- A fully-exited position's latest value is ~0, so it contributes ~0 weight.
        SELECT chain_id, product, usd_value
        FROM (
          (
            SELECT DISTINCT ON (ay.chain_id, ay.arm)
                   ay.chain_id, ay.arm AS product,
                   (ay.value::numeric * ads.rate_usd / ${E18})::float8 AS usd_value
            FROM arm_address_yield ay
            JOIN arm_daily_stat ads
              ON ads.chain_id = ay.chain_id AND ads.address = ay.arm AND ads.date = ay.date
            WHERE ay.address = $1 AND ${chainFilter('ay.chain_id')}
            ORDER BY ay.chain_id, ay.arm, ay.date DESC
          )
          UNION ALL
          (
            SELECT DISTINCT ON (oy.chain_id, oy.otoken)
                   oy.chain_id, oy.otoken,
                   (oy.balance::numeric * ods.rate_usd::numeric / ${E36})::float8
            FROM o_token_address_yield oy
            JOIN o_token_daily_stat ods
              ON ods.chain_id = oy.chain_id AND ods.otoken = oy.otoken AND ods.date = oy.date
            WHERE oy.address = $1 AND ${chainFilter('oy.chain_id')}
            ORDER BY oy.chain_id, oy.otoken, oy.date DESC
          )
          UNION ALL
          (
            -- Wrapped-OToken value is already denominated in the underlying OToken (balance × aps),
            -- so it is priced with that OToken's own daily USD rate — same scaling as the OToken branch.
            SELECT DISTINCT ON (wy.chain_id, wy.wotoken)
                   wy.chain_id, wy.wotoken AS product,
                   (wy.value::numeric * ods.rate_usd::numeric / ${E36})::float8
            FROM wo_token_address_yield wy
            JOIN o_token_daily_stat ods
              ON ods.chain_id = wy.chain_id AND ods.otoken = wy.otoken AND ods.date = wy.date
            WHERE wy.address = $1 AND ${chainFilter('wy.chain_id')}
            ORDER BY wy.chain_id, wy.wotoken, wy.date DESC
          )
          UNION ALL
          (
            -- xOGN staking value = OGN principal × current OGN/USD price. OGN is mainnet-only and its
            -- daily stat has no date column, so the latest price is used as the "current value" ruler.
            SELECT DISTINCT ON (ey.chain_id, ey.address)
                   ey.chain_id, ey.address AS product,
                   (ey.staked_balance::numeric / ${E18})::float8
                     * (SELECT price_usd FROM ogn_daily_stat ORDER BY timestamp DESC LIMIT 1)
            FROM es_address_yield ey
            WHERE ey.account = $1 AND ${chainFilter('ey.chain_id')}
            ORDER BY ey.chain_id, ey.address, ey.date DESC
          )
        ) w
      ),
      blend AS (
        -- One row: the USD-weighted daily rate across the holder's current positions.
        -- The dust floor (>= ${DUST_USD}) drops fully-exited positions so their leftover
        -- wei can't define the blend; a holder with no position above the floor yields no
        -- row here, and the final SELECT then returns 0 / 0.
        SELECT
          sum(weight.usd_value * native.d_native) AS sum_wd,
          sum(weight.usd_value)                   AS sum_w,
          count(*)                                AS product_count,
          sum(weight.usd_value)                   AS total_usd_value
        FROM native
        JOIN weight ON weight.chain_id = native.chain_id AND weight.product = native.product
        WHERE weight.usd_value >= ${DUST_USD}
      )
      SELECT
        -- Blend the native daily rates by current USD weight, THEN annualize once. This
        -- compounds the *blended* daily rate rather than averaging each product's already-
        -- compounded APY (which overstates the blend when the per-product rates diverge).
        -- d is bounded to ±MAX_DAILY_RATE upstream, so power(1 + d, 365) cannot overflow.
        CASE WHEN sum_w IS NULL OR sum_w = 0 THEN 0
             ELSE power(1 + (sum_wd / sum_w), 365) - 1 END  AS apy,
        CASE WHEN sum_w IS NULL OR sum_w = 0 THEN 0
             ELSE (sum_wd / sum_w) * 365 END                AS apr,
        coalesce(product_count, 0)                          AS product_count,
        coalesce(total_usd_value, 0)                        AS total_usd_value
      FROM blend
    `
    const rows: Array<{
      apr: number | null
      apy: number | null
      product_count: string | number | null
      total_usd_value: number | null
    }> = await manager.query(sql, [address.toLowerCase(), chainId ?? null])
    const row = rows?.[0]
    return new PortfolioApyResult({
      apr: row?.apr != null ? Number(row.apr) : 0,
      apy: row?.apy != null ? Number(row.apy) : 0,
      productCount: row?.product_count != null ? Number(row.product_count) : 0,
      totalUsdValue: row?.total_usd_value != null ? Number(row.total_usd_value) : 0,
    })
  }

  /**
   * Money-weighted realized rate over a holder's full daily history.
   *
   * `table`, `filterColumn` and `denomColumn` are internal constants (never user
   * input), so interpolating them is safe; all caller-supplied values are bound
   * as query parameters.
   */
  private async computeApy(
    table: 'arm_address_yield' | 'o_token_address_yield' | 'wo_token_address_yield' | 'es_address_yield',
    filterColumn: 'arm' | 'otoken' | 'wotoken' | 'address',
    denomColumn: 'value' | 'balance' | 'staked_balance',
    chainId: number,
    filterValue: string,
    address: string,
    // Which column holds the account. Most tables put it in `address`; es_address_yield uses `account`
    // (its `address` column is the staking contract). Internal constant, never user input.
    holderColumn: 'address' | 'account' = 'address',
  ): Promise<AddressApyResult> {
    const manager = await this.tx()
    const sql = `
      WITH agg AS (
        SELECT
          count(*)                     AS held_days,
          sum("yield"::numeric)        AS sum_yield,
          sum(${denomColumn}::numeric) AS sum_denom
        FROM ${table}
        WHERE chain_id = $1 AND ${filterColumn} = lower($2) AND ${holderColumn} = lower($3)
          AND ${denomColumn} > 0
          AND ${dailyRateFilter('"yield"', denomColumn)}
      )
      SELECT
        held_days,
        -- The daily-rate filter bounds |d| ≤ MAX_DAILY_RATE; LEAST/GREATEST is a
        -- defensive backstop so power(1 + d, 365) can never overflow float8.
        CASE WHEN sum_denom IS NULL OR sum_denom = 0 THEN 0
             ELSE least(greatest((sum_yield / sum_denom)::float8, -${MAX_DAILY_RATE}), ${MAX_DAILY_RATE}) * 365 END
                                                                             AS apr,
        CASE WHEN sum_denom IS NULL OR sum_denom = 0 THEN 0
             ELSE power(1 + least(greatest((sum_yield / sum_denom)::float8, -${MAX_DAILY_RATE}), ${MAX_DAILY_RATE}), 365) - 1 END
                                                                             AS apy
      FROM agg
    `
    const rows: Array<{ held_days: string | number | null; apr: number | null; apy: number | null }> =
      await manager.query(sql, [chainId, filterValue.toLowerCase(), address.toLowerCase()])
    const row = rows?.[0]
    return new AddressApyResult({
      apr: row?.apr != null ? Number(row.apr) : 0,
      apy: row?.apy != null ? Number(row.apy) : 0,
      heldDays: row?.held_days != null ? Number(row.held_days) : 0,
    })
  }
}
