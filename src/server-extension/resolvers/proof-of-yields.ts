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
export class ProofOfYieldResult {
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

  constructor(props: Partial<ProofOfYieldResult>) {
    Object.assign(this, props)
  }
}

export enum OrderBy {
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  timestamp_ASC = 'timestamp_ASC',
  timestamp_DESC = 'timestamp_DESC',
}

registerEnumType(OrderBy, { name: 'OrderBy' })

@Resolver()
export class ProofOfYieldResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ProofOfYieldResult])
  async proofOfYields(
    @Arg('limit', { nullable: true, defaultValue: 20 }) limit: number,
    @Arg('offset', { nullable: true, defaultValue: 0 }) offset: number,
    @Arg('orderBy', (type) => OrderBy, {
      nullable: true,
      defaultValue: OrderBy.timestamp_DESC,
    })
    orderBy: OrderBy,
  ): Promise<ProofOfYieldResult[]> {
    const manager = await this.tx()

    let orderClause = ''
    switch (orderBy) {
      case 'id_ASC':
        orderClause = 'o.date ASC'
        break
      case 'id_DESC':
        orderClause = 'o.date DESC'
        break
      case 'timestamp_ASC':
        orderClause = 'o.date ASC'
        break
      case 'timestamp_DESC':
        orderClause = 'o.date DESC'
        break
      default:
        throw new Error('Invalid orderBy value')
    }

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
    ORDER BY ${orderClause}
    LIMIT $1 OFFSET $2;`

    const result = await manager.getRepository(OETH).query(sql, [limit, offset])
    return result
  }
}
