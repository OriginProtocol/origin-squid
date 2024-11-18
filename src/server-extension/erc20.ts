import { GraphQLResolveInfo } from 'graphql'
import { Arg, Field, Info, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'

@ObjectType()
export class ERC20StateByDay {
  @Field(() => String, { nullable: false })
  chainId!: number
  @Field(() => String, { nullable: false })
  address!: string
  @Field(() => Date, { nullable: false })
  day!: Date
  @Field(() => BigInt, { nullable: false })
  totalSupply!: bigint
  @Field(() => Int, { nullable: false })
  holderCount!: number

  constructor(props: Partial<ERC20StateByDay>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class ERC20Resolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ERC20StateByDay])
  async erc20StateByDay(
    @Arg('chainId', () => Number, { nullable: false }) chainId: number,
    @Arg('address', () => String, { nullable: false }) address: string,
    @Arg('from', () => String, { nullable: false }) from: string,
    @Arg('to', () => String, { nullable: true }) to: string | null,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ERC20StateByDay[]> {
    const manager = await this.tx()
    const results = await manager.query(
      `
WITH RECURSIVE date_series AS (
    -- Generate a series of dates from the starting date to today
    SELECT
        DATE_TRUNC('day', $2::timestamp) AS day
    UNION
    SELECT
        day + INTERVAL '1 day'
    FROM
        date_series
    WHERE
        day + INTERVAL '1 day' <= COALESCE($3::timestamp, NOW())
),
latest_daily_data AS (
    -- Get the latest data for each day
    SELECT DISTINCT ON (DATE_TRUNC('day', timestamp))
        DATE_TRUNC('day', timestamp) AS day,
        chain_id,
        address,
        total_supply,
        holder_count,
        timestamp
    FROM
        erc20_state
    WHERE
        address = $1
        AND chain_id = $4
        AND timestamp >= $2::timestamp
        AND timestamp <= COALESCE($3::timestamp, NOW())
    ORDER BY
        DATE_TRUNC('day', timestamp), timestamp DESC
)
SELECT
    ds.day,
    coalesce(ldd.chain_id, $4) as chain_id,
    coalesce(ldd.address, $1) as address,
    coalesce(ldd.total_supply, 0) as total_supply,
    coalesce(ldd.holder_count, 0) as holder_count
FROM
    ldd.holder_count
FROM
    date_series ds
LEFT JOIN LATERAL (
    -- Find the most recent row from latest_daily_data for each day
    SELECT
        chain_id,
        address,
        total_supply,
        holder_count
    FROM
        latest_daily_data
    WHERE
        latest_daily_data.timestamp <= ds.day + INTERVAL '1 day' - INTERVAL '1 second'
    ORDER BY
        timestamp DESC
    LIMIT 1
) ldd ON true
ORDER BY
    ds.day;
    `,
      [address, from, to, chainId],
    )

    return results.map(
      (row: any) =>
        new ERC20StateByDay({
          chainId: row.chain_id,
          address: row.address,
          day: row.day,
          totalSupply: BigInt(row.total_supply ?? 0n),
          holderCount: row.holder_count,
        }),
    )
  }
}
