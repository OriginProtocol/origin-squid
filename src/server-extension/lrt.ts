import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'

import { calculatePoints } from '../lrt/calculation'
import { LRTBalanceData } from '../model'

@Resolver()
export class LRTResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => BigInt)
  async lrtDepositorPoints(@Arg('address') address: string): Promise<bigint> {
    const manager = await this.tx()
    const balanceData = await manager.getRepository(LRTBalanceData).find({
      where: { recipient: { id: address.toLowerCase() } },
      relations: { recipient: true, conditions: true },
    })

    return calculatePoints(Date.now(), balanceData)
  }
}
