import * as aerodromeGaugeAbi from '@abi/aerodrome-gauge'
import { AeroGaugeNotifyReward } from '@model'
import { Processor, logFilter } from '@originprotocol/squid-utils'
import { PoolDefinition } from '@utils/addresses-base'

export const aerodromeGauge = (gauge: NonNullable<PoolDefinition['gauge']>): Processor => {
  const notifyRewardFilter = logFilter({
    address: [gauge.address],
    topic0: [aerodromeGaugeAbi.events.NotifyReward.topic],
    range: { from: gauge.from },
  })

  return {
    from: gauge.from,
    name: `Aerodrome Gauge ${gauge.address}`,
    setup: (processor) => {
      processor.addLog(notifyRewardFilter.value)
    },
    process: async (ctx) => {
      const entities: AeroGaugeNotifyReward[] = []
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (!notifyRewardFilter.matches(log)) continue
          const data = aerodromeGaugeAbi.events.NotifyReward.decode(log)
          entities.push(
            new AeroGaugeNotifyReward({
              id: `${ctx.chain.id}:${log.id}`,
              chainId: ctx.chain.id,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              address: log.address,
              from: data.from.toLowerCase(),
              amount: data.amount,
            }),
          )
        }
      }
      if (entities.length > 0) {
        await ctx.store.insert(entities)
      }
    },
  }
}
