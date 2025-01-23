import * as bridgedWOETHStrategyABI from '@abi/strategy-bridged-woeth'
import { EventWOETHPriceUpdated } from '@model'
import { Context, logFilter } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { baseAddresses } from '@utils/addresses-base'

const filter = logFilter({
  address: [baseAddresses.superOETHb.strategies.bridgedWOETH],
  topic0: [bridgedWOETHStrategyABI.events.WOETHPriceUpdated.topic],
})
export const bridgedWoethStrategy = {
  name: 'bridged-woeth-strategy',
  from: 18689567,
  setup: (processor: EvmBatchProcessor) => {
    processor.addLog(filter.value)
  },
  process: async (ctx: Context) => {
    const result: EventWOETHPriceUpdated[] = []
    for (const block of ctx.blocksWithContent) {
      if (block.header.height < bridgedWoethStrategy.from) continue
      for (const log of block.logs) {
        if (filter.matches(log)) {
          const data = bridgedWOETHStrategyABI.events.WOETHPriceUpdated.decode(log)
          result.push(
            new EventWOETHPriceUpdated({
              id: `${ctx.chain.id}-${log.id}`,
              chainId: ctx.chain.id,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              address: log.address,
              oldValue: data.oldValue,
              newValue: data.newValue,
            }),
          )
        }
      }
    }
    await ctx.store.insert(result)
  },
}
