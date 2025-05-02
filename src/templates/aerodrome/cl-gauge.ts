import * as aerodromeCLGaugeAbi from '@abi/aerodrome-cl-gauge'
import * as models from '@model'
import { Processor, logFilter } from '@originprotocol/squid-utils'
import { PoolDefinition } from '@utils/addresses-base'

export const aerodromeCLGauge = (params: NonNullable<PoolDefinition['gauge']>): Processor => {
  const notifyRewardFilter = logFilter({
    address: [params.address],
    topic0: [aerodromeCLGaugeAbi.events.NotifyReward.topic],
    range: { from: params.from },
  })

  return {
    from: params.from,
    name: `Aerodrome Gauge ${params.address}`,
    setup: (processor) => {
      processor.addLog(notifyRewardFilter.value)
    },
    process: async (ctx) => {
      const entities: models.AeroCLGaugeNotifyReward[] = []

      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (!notifyRewardFilter.matches(log)) continue

          const data = aerodromeCLGaugeAbi.events.NotifyReward.decode(log)
          entities.push(
            new models.AeroCLGaugeNotifyReward({
              id: `${ctx.chain.id}-${log.id}`,
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

      await ctx.store.insert(entities)
    },
  }
}
