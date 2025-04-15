import { GraphQLResolveInfo } from 'graphql'
import { compact } from 'lodash'
import { ousdStrategies } from 'ousd/processors/strategies'
import { Arg, Field, Info, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager, LessThanOrEqual } from 'typeorm'

import { StrategyBalance } from '@model'
import { IStrategyData } from '@templates/strategy'
import { addresses } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'

import { strategies } from '../base/strategies'
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
  @Field(() => String, { nullable: false })
  symbol!: string
  @Field(() => Int, { nullable: false })
  blockNumber!: number
  @Field(() => BigInt, { nullable: false })
  balance!: bigint
  @Field(() => BigInt, { nullable: false })
  balanceETH!: bigint

  constructor(props: Partial<Balance>) {
    Object.assign(this, props)
  }
}

const otokens: Record<string, readonly IStrategyData[]> = {
  [addresses.oeth.address]: oethStrategies,
  [addresses.ousd.address]: ousdStrategies,
  [baseAddresses.superOETHb.address]: strategies,
}

@Resolver()
export class StrategyResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [Strategy])
  async strategies(
    @Arg('timestamp', () => String, { nullable: true }) timestamp: string | null,
    @Arg('chainId', () => Number, { nullable: true }) chainId: number | null,
    @Arg('otoken', () => String, { nullable: true }) otoken: string | null,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<Strategy[]> {
    const manager = await this.tx()

    let strategies = otoken ? otokens[otoken] : Object.values(otokens).flat()
    if (chainId) {
      strategies = strategies.filter((s) => s.chainId === chainId)
    }

    return Promise.all(
      strategies.map(async (s) => {
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
            symbol: b.symbol,
            timestamp: b.timestamp,
            blockNumber: b.blockNumber,
            balance: b.balance,
            balanceETH: b.balanceETH,
          })),
        }
      }),
    )
  }
}
