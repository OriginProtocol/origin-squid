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
    @Arg('chainId', () => String, { nullable: false }) chainId: number,
    @Arg('address', () => String, { nullable: false }) address: string,
    @Arg('from', () => String, { nullable: false }) from: string,
    @Arg('to', () => String, { nullable: true }) to: string | null,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ERC20StateByDay[]> {
    const manager = await this.tx()
    const results = await manager.query(
      `
        WITH RECURSIVE date_series AS (
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
          SELECT DISTINCT ON (DATE_TRUNC('day', timestamp))
            DATE_TRUNC('day', timestamp) AS day,
            chain_id,
            address,
            total_supply,
            holder_count
          FROM
            erc20_state
          WHERE
            address = $1
            AND chain_id = $4
            AND timestamp >= $2
            AND ($3::timestamp IS NULL OR timestamp <= $3)
          ORDER BY
            DATE_TRUNC('day', timestamp), timestamp DESC
        ),
        data_with_gaps AS (
          SELECT
            ds.day,
            ldd.chain_id,
            ldd.address,
            ldd.total_supply,
            ldd.holder_count
          FROM 
            date_series ds
          LEFT JOIN 
            latest_daily_data ldd ON ds.day = ldd.day
        ),
        filled_data AS (
          SELECT
            day,
            chain_id,
            address,
            total_supply,
            holder_count,
            COALESCE(total_supply, LAG(total_supply) OVER (PARTITION BY address ORDER BY day)) AS filled_total_supply,
            COALESCE(holder_count, LAG(holder_count) OVER (PARTITION BY address ORDER BY day)) AS filled_holder_count
          FROM
            data_with_gaps
        )
        SELECT
          chain_id,
          address,
          day,
          filled_total_supply AS total_supply,
          filled_holder_count AS holder_count
        FROM
          filled_data
        ORDER BY
          day;

    `,
      [address, from, to, chainId],
    )

    return results.map(
      (row: any) =>
        new ERC20StateByDay({
          chainId: row.chain_id,
          address: row.address,
          day: row.day,
          totalSupply: BigInt(row.total_supply),
          holderCount: row.holder_count,
        }),
    )
  }
}
