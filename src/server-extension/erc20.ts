import dayjs from 'dayjs'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Field, Info, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { Between, EntityManager } from 'typeorm'

import { ERC20StateByDay as ERC20StateByDayEntity } from '@model'

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
    const repository = manager.getRepository(ERC20StateByDayEntity)

    const states = await repository.find({
      where: {
        chainId,
        address,
        date: to ? Between(from, to) : Between(from, dayjs().endOf('day').toISOString()),
      },
      order: {
        date: 'ASC',
      },
    })

    return states.map(
      (state) =>
        new ERC20StateByDay({
          chainId: state.chainId,
          address: state.address,
          day: new Date(state.date),
          totalSupply: state.totalSupply,
          holderCount: state.holderCount,
        }),
    )
  }
}
