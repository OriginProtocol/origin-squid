import { GraphQLResolveInfo } from 'graphql'
import { Arg, Field, Info, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager, FindOptionsOrder } from 'typeorm'

import {
  ProtocolDailyRevenue,
  ProtocolDailyTokenSupply,
  ProtocolDailyTvl,
} from '@model'

@ObjectType()
export class DailyProtocolProductSplitR {
  @Field(() => String, { nullable: false })
  date!: string

  @Field(() => String, { nullable: false })
  productId!: string

  @Field(() => Date, { nullable: false })
  timestamp!: Date

  @Field(() => BigInt, { nullable: false })
  totalEth!: bigint

  @Field(() => BigInt, { nullable: false })
  totalUsd!: bigint

  constructor(props: Partial<DailyProtocolProductSplitR>) {
    Object.assign(this, props)
  }
}

@ObjectType()
export class DailyProtocolRevenueR {
  @Field(() => String, { nullable: false })
  date!: string

  @Field(() => Date, { nullable: false })
  timestamp!: Date

  @Field(() => BigInt, { nullable: false })
  totalEth!: bigint

  @Field(() => BigInt, { nullable: false })
  totalUsd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg7Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg14Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg30Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg7Usd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg14Usd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg30Usd!: bigint

  @Field(() => [DailyProtocolProductSplitR], { nullable: false })
  split!: DailyProtocolProductSplitR[]

  constructor(props: Partial<DailyProtocolRevenueR>) {
    Object.assign(this, props)
  }
}

@ObjectType()
export class DailyProtocolTvlR {
  @Field(() => String, { nullable: false })
  date!: string

  @Field(() => Date, { nullable: false })
  timestamp!: Date

  @Field(() => BigInt, { nullable: false })
  totalEth!: bigint

  @Field(() => BigInt, { nullable: false })
  totalUsd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg7Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg14Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg30Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg7Usd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg14Usd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg30Usd!: bigint

  @Field(() => [DailyProtocolProductSplitR], { nullable: false })
  split!: DailyProtocolProductSplitR[]

  constructor(props: Partial<DailyProtocolTvlR>) {
    Object.assign(this, props)
  }
}

@ObjectType()
export class DailyProtocolTokenSupplyR {
  @Field(() => String, { nullable: false })
  date!: string

  @Field(() => Date, { nullable: false })
  timestamp!: Date

  @Field(() => BigInt, { nullable: false })
  totalEth!: bigint

  @Field(() => BigInt, { nullable: false })
  totalUsd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg7Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg14Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg30Eth!: bigint

  @Field(() => BigInt, { nullable: false })
  avg7Usd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg14Usd!: bigint

  @Field(() => BigInt, { nullable: false })
  avg30Usd!: bigint

  @Field(() => [DailyProtocolProductSplitR], { nullable: false })
  split!: DailyProtocolProductSplitR[]

  constructor(props: Partial<DailyProtocolTokenSupplyR>) {
    Object.assign(this, props)
  }
}

type SortDirection = 'ASC' | 'DESC'

const toBigIntValue = (value: bigint | string | number | null | undefined): bigint => {
  if (typeof value === 'bigint') return value
  if (typeof value === 'string') return BigInt(value)
  if (typeof value === 'number') return BigInt(Math.trunc(value))
  return 0n
}

const parseSort = <T extends object>(
  orderBy: string | null | undefined,
  defaultField: keyof T,
  allowedFields: (keyof T)[],
): FindOptionsOrder<T> => {
  const [fieldRaw, directionRaw] = (orderBy ?? `${String(defaultField)}_ASC`).split('_')
  const field = fieldRaw as keyof T
  const direction = (directionRaw ?? 'ASC').toUpperCase() as SortDirection
  const isDirectionValid = direction === 'ASC' || direction === 'DESC'
  const sortField = allowedFields.includes(field) ? field : defaultField
  return { [sortField]: isDirectionValid ? direction : 'ASC' } as FindOptionsOrder<T>
}

@Resolver()
export class ProtocolResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [DailyProtocolRevenueR])
  async dailyProtocolRevenue(
    @Arg('offset', () => Int, { nullable: true }) offset: number | null,
    @Arg('limit', () => Int, { nullable: true }) limit: number | null,
    @Arg('orderBy', () => String, { nullable: true }) orderBy: string | null,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<DailyProtocolRevenueR[]> {
    const manager = await this.tx()
    const rows = await manager.getRepository(ProtocolDailyRevenue).find({
      order: parseSort<ProtocolDailyRevenue>(orderBy, 'date', ['date', 'timestamp', 'id']),
      skip: offset ?? undefined,
      take: limit ?? undefined,
    })

    return rows.map(
      (row) =>
        new DailyProtocolRevenueR({
          date: row.date,
          timestamp: row.timestamp,
          totalEth: row.totalEth,
          totalUsd: row.totalUsd,
          avg7Eth: row.avg7Eth,
          avg14Eth: row.avg14Eth,
          avg30Eth: row.avg30Eth,
          avg7Usd: row.avg7Usd,
          avg14Usd: row.avg14Usd,
          avg30Usd: row.avg30Usd,
          split: ((row.split as any[]) ?? []).map(
            (entry) =>
              new DailyProtocolProductSplitR({
                date: row.date,
                timestamp: row.timestamp,
                productId: entry.productId,
                totalEth: toBigIntValue(entry.totalEth),
                totalUsd: toBigIntValue(entry.totalUsd),
              }),
          ),
        }),
    )
  }

  @Query(() => [DailyProtocolTvlR])
  async dailyProtocolTvl(
    @Arg('offset', () => Int, { nullable: true }) offset: number | null,
    @Arg('limit', () => Int, { nullable: true }) limit: number | null,
    @Arg('orderBy', () => String, { nullable: true }) orderBy: string | null,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<DailyProtocolTvlR[]> {
    const manager = await this.tx()
    const rows = await manager.getRepository(ProtocolDailyTvl).find({
      order: parseSort<ProtocolDailyTvl>(orderBy, 'date', ['date', 'timestamp', 'id']),
      skip: offset ?? undefined,
      take: limit ?? undefined,
    })

    return rows.map(
      (row) =>
        new DailyProtocolTvlR({
          date: row.date,
          timestamp: row.timestamp,
          totalEth: row.totalEth,
          totalUsd: row.totalUsd,
          avg7Eth: row.avg7Eth,
          avg14Eth: row.avg14Eth,
          avg30Eth: row.avg30Eth,
          avg7Usd: row.avg7Usd,
          avg14Usd: row.avg14Usd,
          avg30Usd: row.avg30Usd,
          split: ((row.split as any[]) ?? []).map(
            (entry) =>
              new DailyProtocolProductSplitR({
                date: row.date,
                timestamp: row.timestamp,
                productId: entry.productId,
                totalEth: toBigIntValue(entry.totalEth),
                totalUsd: toBigIntValue(entry.totalUsd),
              }),
          ),
        }),
    )
  }

  @Query(() => [DailyProtocolTokenSupplyR])
  async dailyProtocolTokenSupply(
    @Arg('offset', () => Int, { nullable: true }) offset: number | null,
    @Arg('limit', () => Int, { nullable: true }) limit: number | null,
    @Arg('orderBy', () => String, { nullable: true }) orderBy: string | null,
    @Info() _info: GraphQLResolveInfo,
  ): Promise<DailyProtocolTokenSupplyR[]> {
    const manager = await this.tx()
    const rows = await manager.getRepository(ProtocolDailyTokenSupply).find({
      order: parseSort<ProtocolDailyTokenSupply>(orderBy, 'date', ['date', 'timestamp', 'id']),
      skip: offset ?? undefined,
      take: limit ?? undefined,
    })

    return rows.map(
      (row) =>
        new DailyProtocolTokenSupplyR({
          date: row.date,
          timestamp: row.timestamp,
          totalEth: row.totalEth,
          totalUsd: row.totalUsd,
          avg7Eth: row.avg7Eth,
          avg14Eth: row.avg14Eth,
          avg30Eth: row.avg30Eth,
          avg7Usd: row.avg7Usd,
          avg14Usd: row.avg14Usd,
          avg30Usd: row.avg30Usd,
          split: ((row.split as any[]) ?? []).map(
            (entry) =>
              new DailyProtocolProductSplitR({
                date: row.date,
                timestamp: row.timestamp,
                productId: entry.productId,
                totalEth: toBigIntValue(entry.totalEth),
                totalUsd: toBigIntValue(entry.totalUsd),
              }),
          ),
        }),
    )
  }

}
