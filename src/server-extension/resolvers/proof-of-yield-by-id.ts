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
  fees!: bigint

  @Field(() => BigInt, { nullable: false })
  totalSupply!: bigint

  @Field(() => BigInt, { nullable: false })
  rebasingSupply!: bigint

  @Field(() => BigInt, { nullable: false })
  nonRebasingSupply!: bigint

  @Field(() => BigInt, { nullable: false })
  amoSupply!: bigint

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

    const sql = `SELECT
        $1 as timestamp,
        oeth_data.rebasing_supply AS "rebasingSupply",
        oeth_data.total_supply AS "totalSupply",
        oeth_data.non_rebasing_supply AS "nonRebasingSupply",
        apy_data.apy7_day_avg as apy,
        curve_data.oeth_owned AS "amoSupply",
        rebase_data.total_yield as yield,
        rebase_data.total_fees as fees
    FROM
        (SELECT 1) AS dummy -- A dummy table to ensure we always get a row
    LEFT JOIN LATERAL (
        SELECT oeth.rebasing_supply, oeth.total_supply, oeth.non_rebasing_supply
        FROM oeth
        WHERE DATE(oeth.timestamp) <= $1
        ORDER BY oeth.timestamp DESC
        LIMIT 1
    ) AS oeth_data ON TRUE
    LEFT JOIN LATERAL (
        SELECT apy.apy7_day_avg
        FROM apy
        WHERE DATE(apy.timestamp) <= $1
        ORDER BY apy.timestamp DESC
        LIMIT 1
    ) AS apy_data ON TRUE
    LEFT JOIN LATERAL (
        SELECT c.oeth_owned
        FROM curve_lp c
        WHERE DATE(c.timestamp) <= $1
        ORDER BY c.timestamp DESC
        LIMIT 1
    ) AS curve_data ON TRUE
    LEFT JOIN (
        SELECT
            DATE(timestamp) AS date,
            SUM(yield - fee) AS total_yield,
            SUM(fee) AS total_fees
        FROM rebase
        GROUP BY DATE(timestamp)
    ) AS rebase_data ON rebase_data.date = $1;`

    const result = await manager.getRepository(OETH).query(sql, [id])
    return result?.[0]
  }
}
