import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'

import { calculateRecipientsPoints } from '../lrt/calculation'
import { LRTPointRecipient } from '../model'

@Resolver()
export class LRTResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => BigInt)
  async lrtDepositorPoints(@Arg('address') address: string): Promise<bigint> {
    const manager = await this.tx()
    const recipients = await manager.getRepository(LRTPointRecipient).find({
      where: { id: address.toLowerCase() },
      relations: {
        balanceData: true,
      },
    })
    return calculateRecipientsPoints(Date.now(), recipients)
  }
}
