import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'

import { calculatePoints } from '../lrt'
import { LRTPointData, LRTPointDataAggregate } from '../model'

@Resolver()
export class LRTResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => BigInt)
  async lrtDepositorPoints(@Arg('address') address: string): Promise<bigint> {
    const manager = await this.tx()
    const results = await manager
      .getRepository(LRTPointData)
      .find({ where: { recipient: { id: address.toLowerCase() } } })
    console.log(address.toLowerCase())
    console.log(results)
    if (!results.length) return 0n
    return results.reduce((sum, data) => {
      return (
        sum +
        data.staticPoints +
        calculatePoints(
          data.startDate.getTime(),
          (data.endDate ?? new Date()).getTime(),
          data.balance,
        )
      )
    }, 0n)
  }

  @Query(() => BigInt)
  async lrtPointsAggregate(): Promise<bigint> {
    const manager = await this.tx()
    const results = await manager.getRepository(LRTPointDataAggregate).find()
    if (!results.length) return 0n
    return results.reduce((sum, data) => {
      return (
        sum +
        calculatePoints(
          data.startDate.getTime(),
          (data.endDate ?? new Date()).getTime(),
          data.balance,
        )
      )
    }, 0n)
  }
}
