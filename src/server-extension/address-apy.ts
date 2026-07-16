import { Arg, Field, Float, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'

const E18 = 'power(10::numeric, 18)'
const E36 = 'power(10::numeric, 36)'

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
    const chainFilter = '($2::int IS NULL OR chain_id = $2)'
    const sql = `
      WITH native AS (
        -- per-product native all-time daily rate, over the days the position was held
        SELECT chain_id, product, sum_yield / sum_denom AS d_native
        FROM (
          SELECT chain_id, arm AS product,
                 sum("yield"::numeric) AS sum_yield, sum(value::numeric) AS sum_denom
          FROM arm_address_yield
          WHERE address = $1 AND value > 0 AND ${chainFilter}
          GROUP BY chain_id, arm
          UNION ALL
          SELECT chain_id, otoken,
                 sum("yield"::numeric), sum(balance::numeric)
          FROM o_token_address_yield
          WHERE address = $1 AND balance > 0 AND ${chainFilter}
          GROUP BY chain_id, otoken
        ) s
        WHERE sum_denom > 0
      ),
      weight AS (
        -- current USD value per product: the latest daily row valued at that day's USD rate.
        -- A fully-exited position's latest value is ~0, so it contributes ~0 weight.
        SELECT chain_id, product, usd_value
        FROM (
          SELECT DISTINCT ON (ay.chain_id, ay.arm)
                 ay.chain_id, ay.arm AS product,
                 (ay.value::numeric * ads.rate_usd / ${E18})::float8 AS usd_value
          FROM arm_address_yield ay
          JOIN arm_daily_stat ads
            ON ads.chain_id = ay.chain_id AND ads.address = ay.arm AND ads.date = ay.date
          WHERE ay.address = $1 AND ${chainFilter}
          ORDER BY ay.chain_id, ay.arm, ay.date DESC
          UNION ALL
          SELECT DISTINCT ON (oy.chain_id, oy.otoken)
                 oy.chain_id, oy.otoken,
                 (oy.balance::numeric * ods.rate_usd::numeric / ${E36})::float8
          FROM o_token_address_yield oy
          JOIN o_token_daily_stat ods
            ON ods.chain_id = oy.chain_id AND ods.otoken = oy.otoken AND ods.date = oy.date
          WHERE oy.address = $1 AND ${chainFilter}
          ORDER BY oy.chain_id, oy.otoken, oy.date DESC
        ) w
      )
      SELECT
        coalesce(
          sum(weight.usd_value * (power(1 + native.d_native::float8, 365) - 1))
            / NULLIF(sum(weight.usd_value), 0), 0)        AS apy,
        coalesce(
          sum(weight.usd_value * (native.d_native::float8 * 365))
            / NULLIF(sum(weight.usd_value), 0), 0)        AS apr,
        count(*) FILTER (WHERE weight.usd_value > 0)      AS product_count,
        coalesce(sum(weight.usd_value) FILTER (WHERE weight.usd_value > 0), 0) AS total_usd_value
      FROM native
      JOIN weight ON weight.chain_id = native.chain_id AND weight.product = native.product
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
    table: 'arm_address_yield' | 'o_token_address_yield',
    filterColumn: 'arm' | 'otoken',
    denomColumn: 'value' | 'balance',
    chainId: number,
    filterValue: string,
    address: string,
  ): Promise<AddressApyResult> {
    const manager = await this.tx()
    const sql = `
      WITH agg AS (
        SELECT
          count(*)                     AS held_days,
          sum("yield"::numeric)        AS sum_yield,
          sum(${denomColumn}::numeric) AS sum_denom
        FROM ${table}
        WHERE chain_id = $1 AND ${filterColumn} = lower($2) AND address = lower($3)
          AND ${denomColumn} > 0
      )
      SELECT
        held_days,
        CASE WHEN sum_denom IS NULL OR sum_denom = 0 THEN 0
             ELSE (sum_yield / sum_denom)::float8 * 365 END                  AS apr,
        CASE WHEN sum_denom IS NULL OR sum_denom = 0 THEN 0
             ELSE power(1 + (sum_yield / sum_denom)::float8, 365) - 1 END    AS apy
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
