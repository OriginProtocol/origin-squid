import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'

import { calculateRecipientsPoints } from '../lrt/calculation'
import { LRTPointRecipient } from '../model'

@ObjectType()
export class LRTPointRecipientStats {
  @Field(() => BigInt, { nullable: false })
  points!: bigint

  @Field(() => BigInt, { nullable: false })
  elPoints!: bigint

  constructor(props: Partial<LRTPointRecipientStats>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class LRTResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => LRTPointRecipientStats)
  async lrtPointRecipientStats(
    @Arg('address') address: string,
  ): Promise<{ points: bigint; elPoints: bigint }> {
    const manager = await this.tx()
    const recipients = await manager.getRepository(LRTPointRecipient).find({
      where: { id: address.toLowerCase() },
      relations: {
        balanceData: true,
      },
    })
    if (recipients.length === 0) {
      return { points: 0n, elPoints: 0n }
    }
    return {
      points: calculateRecipientsPoints(Date.now(), recipients),
      elPoints: recipients[0].elPoints,
    }
  }
}
