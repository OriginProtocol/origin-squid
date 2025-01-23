import * as iat from '@abi/initializable-abstract-strategy'
import { OTokenRewardTokenCollected } from '@model'
import { Context } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const createStrategyRewardSetup = ({ address, from }: { address: string; from: number }) => {
  return (processor: EvmBatchProcessor) => {
    processor.addLog({
      address: [address],
      topic0: [iat.events.RewardTokenCollected.topic],
      transaction: false,
      range: { from },
    })
  }
}

export const createStrategyRewardProcessor = (params: { oTokenAddress: string; address: string; from: number }) => {
  return async (ctx: Context) => {
    const events: OTokenRewardTokenCollected[] = []
    if (
      !ctx.blocksWithContent.length ||
      ctx.blocksWithContent[ctx.blocksWithContent.length - 1].header.height < params.from
    ) {
      return
    }
    for (const block of ctx.blocksWithContent) {
      if (block.header.height < params.from) continue
      for (const log of block.logs) {
        if (log.address === params.address && log.topics[0] === iat.events.RewardTokenCollected.topic) {
          const data = iat.events.RewardTokenCollected.decode(log)
          const event = new OTokenRewardTokenCollected({
            id: log.id,
            chainId: ctx.chain.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            otoken: params.oTokenAddress,
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
