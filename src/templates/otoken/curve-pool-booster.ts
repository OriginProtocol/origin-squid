import * as curvePoolBoosterAbi from '@abi/otoken-curve-pool-booster'
import { Block, Context, blockFrequencyUpdater, defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const createCurvePoolBoosterProcessor = (params: { address: string; otokenAddress: string; from: number }) => {
  const frequencyUpdate = blockFrequencyUpdater({ from: params.from })
  const bribeCreatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.FeeCollected.topic],
    range: { from: params.from },
  })
  const campaignCreatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.CampaignCreated.topic],
    range: { from: params.from },
  })
  const campaignClosedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.CampaignClosed.topic],
    range: { from: params.from },
  })
  const campaignIdUpdatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.CampaignIdUpdated.topic],
    range: { from: params.from },
  })
  return defineProcessor({
    name: `curve-pool-booster-${params.address}`,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(bribeCreatedFilter.value)
    },
    process: async (ctx: Context) => {
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (campaignCreatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.CampaignCreated.decode(log)
            console.log(data)
          }
          if (campaignClosedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.CampaignClosed.decode(log)
            console.log(data)
          }
          if (campaignIdUpdatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.CampaignIdUpdated.decode(log)
            console.log(data)
          }
          if (bribeCreatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.FeeCollected.decode(log)
            console.log(data)
          }
        }
      }
      await frequencyUpdate(ctx, async (ctx: Context, block: Block) => {
        const curvePoolBooster = new curvePoolBoosterAbi.Contract(ctx, block.header, params.address)
        const feeCollector = await curvePoolBooster.feeCollector()
        console.log(feeCollector)
      })
    },
  })
}
