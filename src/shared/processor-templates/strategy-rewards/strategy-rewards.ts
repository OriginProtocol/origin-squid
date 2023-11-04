import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as iat from '../../../abi/initializable-abstract-strategy'
import { OETHRewardTokenCollected } from '../../../model'
import { Context } from '../../../processor'
import { EntityClassT } from '../../../utils/type'

export const createStrategyRewardSetup = ({
  address,
  from,
}: {
  address: string
  from: number
}) => {
  return (processor: EvmBatchProcessor) => {
    processor.addLog({
      address: [address],
      topic0: [iat.events.RewardTokenCollected.topic],
      transaction: false,
      range: { from },
    })
  }
}

export const createStrategyRewardProcessor = (params: {
  address: string
  from: number
  OTokenRewardTokenCollected: EntityClassT<OETHRewardTokenCollected>
}) => {
  return async (ctx: Context) => {
    const events: OETHRewardTokenCollected[] = []
    if (ctx.blocks[ctx.blocks.length - 1].header.height < params.from) return
    for (const block of ctx.blocks) {
      if (block.header.height < params.from) continue
      for (const log of block.logs) {
        if (
          log.address === params.address &&
          log.topics[0] === iat.events.RewardTokenCollected.topic
        ) {
          const data = iat.events.RewardTokenCollected.decode(log)
          const event = new params.OTokenRewardTokenCollected({
            id: log.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            strategy: params.address,
            recipient: data.recipient.toLowerCase(),
            rewardToken: data.rewardToken.toLowerCase(),
            amount: data.amount,
          })
          events.push(event)
        }
      }
    }
    await ctx.store.upsert(events)
  }
}
