import {
  Arg,
  Field,
  ObjectType,
  Query,
  Resolver,
  registerEnumType,
} from 'type-graphql'
import type { EntityManager } from 'typeorm'

import { OETH } from '../../model'

// Define custom GraphQL ObjectType of the query result
@ObjectType()
export class ProofOfYieldByIdResult {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => Date, { nullable: false })
  timestamp!: Date

  @Field(() => Number, { nullable: false })
  apy!: number

  @Field(() => BigInt, { nullable: false })
  yield!: bigint

  @Field(() => BigInt, { nullable: false })
  rebasingSupply!: bigint

  constructor(props: Partial<ProofOfYieldByIdResult>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class ProofOfYieldByIdResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => ProofOfYieldByIdResult, { nullable: true })
  async proofOfYieldById(
    @Arg('id') id: string,
  ): Promise<ProofOfYieldByIdResult | null> {
    if (!id) {
      return null
    }

    const manager = await this.tx()

    const sql = `WITH
    oeth_aggregated AS (
        SELECT
            DATE(timestamp) AS date,
            MAX(rebasing_supply) AS max_rebasing_supply
        FROM
            oeth
        GROUP BY
            DATE(timestamp)
    ),

    apy_aggregated AS (
        SELECT
            DATE(timestamp) AS date,
            MAX(apy7_day_avg) AS max_apy7_day_avg
        FROM
            apy
        GROUP BY
            DATE(timestamp)
    ),

    rebase_aggregated AS (
        SELECT
            DATE(timestamp) AS date,
            SUM(yield - fee) AS total_yield
        FROM
            rebase
        GROUP BY
            DATE(timestamp)
    )

    SELECT
        TO_CHAR(o.date, 'YYYY-MM-DD') as id,
        o.date as timestamp,
        a.max_apy7_day_avg as apy,
        o.max_rebasing_supply as "rebasingSupply",
        r.total_yield as yield
    FROM
        oeth_aggregated o
    JOIN
        apy_aggregated a ON o.date = a.date
    LEFT JOIN
        rebase_aggregated r ON o.date = r.date
    WHERE o.date = $1;`

    const result = await manager.getRepository(OETH).query(sql, [id])
    return result?.[0]
  }
}
