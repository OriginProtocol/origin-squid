import { GraphQLResolveInfo } from 'graphql'
import { compact } from 'lodash'
import { Arg, Field, Info, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager, LessThanOrEqual } from 'typeorm'

import { StrategyBalance } from '@model'

import { oethStrategies } from '../oeth/processors/strategies'

/**
 * This is used by the OETH analytics Balance Sheet (marketing site)
 */

@ObjectType()
export class Strategy {
  @Field(() => String, { nullable: false })
  name!: string
  @Field(() => String, { nullable: false })
  contractName!: string
  @Field(() => String, { nullable: false })
  address!: string
  @Field(() => String, { nullable: false })
  oTokenAddress!: string
  @Field(() => String, { nullable: false })
  kind!: string
  @Field(() => [Balance], { nullable: false })
  balances!: Balance[]

  constructor(props: Partial<Strategy>) {
    Object.assign(this, props)
  }
}

@ObjectType()
export class Balance {
  @Field(() => String, { nullable: false })
  asset!: string
  @Field(() => Date, { nullable: false })
  timestamp!: Date
  @Field(() => Int, { nullable: false })
  blockNumber!: number
  @Field(() => BigInt, { nullable: false })
  balance!: bigint

  constructor(props: Partial<Balance>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class StrategyResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [Strategy])
  async strategies(
    @Arg('timestamp', () => String, { nullable: true }) timestamp: string | null,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Strategy[]> {
    const manager = await this.tx()
    return Promise.all(
      oethStrategies.map(async (s) => {
        return {
          name: s.name,
          contractName: s.contractName,
          address: s.address,
          oTokenAddress: s.oTokenAddress,
          kind: s.kind,
          balances: compact(
            await Promise.all(
              s.assets.map((asset) =>
                manager.getRepository(StrategyBalance).findOne({
                  order: { timestamp: 'desc' },
                  where: {
                    strategy: s.address,
                    asset: asset.address,
                    timestamp: LessThanOrEqual(timestamp ? new Date(timestamp) : new Date()),
                  },
                }),
              ),
            ),
          ).map((b) => ({
            asset: b.asset,
            timestamp: b.timestamp,
            blockNumber: b.blockNumber,
            balance: b.balance,
          })),
        }
      }),
    )
  }
}
