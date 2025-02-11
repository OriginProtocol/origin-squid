import * as curvePoolBoosterAbi from '@abi/otoken-curve-pool-booster'
import { PoolBoosterCampaign, PoolBoosterFeeCollected } from '@model'
import { Context, blockFrequencyUpdater, defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const createCurvePoolBoosterProcessor = (params: { otokenAddress: string; from: number }) => {
  const frequencyUpdate = blockFrequencyUpdater({ from: params.from })

  const bribeCreatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.FeeCollected.topic],
    range: { from: params.from },
  })
  const campaignCreatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.CampaignCreated.topic],
    range: { from: params.from },
  })
  const campaignIdUpdatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.CampaignIdUpdated.topic],
    range: { from: params.from },
  })
  const campaignClosedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.CampaignClosed.topic],
    range: { from: params.from },
  })

  return defineProcessor({
    name: `curve-pool-booster`,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(bribeCreatedFilter.value)
    },
    process: async (ctx: Context) => {
      const campaigns = new Map<string, PoolBoosterCampaign>()
      const feesCollected = new Map<string, PoolBoosterFeeCollected>()

      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (campaignCreatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.CampaignCreated.decode(log)
            const id = `${ctx.chain.id}-${log.address}`
            const campaign = new PoolBoosterCampaign({
              id,
              chainId: ctx.chain.id,
              address: log.address,
              gauge: data.gauge,
              rewardToken: data.rewardToken,
              maxRewardPerVote: data.maxRewardPerVote,
              totalRewardAmount: data.totalRewardAmount,
            })
            campaigns.set(id, campaign)
          }
          if (campaignIdUpdatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.CampaignIdUpdated.decode(log)
            const id = `${ctx.chain.id}-${log.address}`
            let campaign = campaigns.get(id) || (await ctx.store.get(PoolBoosterCampaign, id))
            if (campaign) {
              campaign.campaignId = data.newId
            }
          }
          if (campaignClosedFilter.matches(log)) {
            const id = `${ctx.chain.id}-${log.address}`
            let campaign = campaigns.get(id) || (await ctx.store.get(PoolBoosterCampaign, id))
            if (campaign) {
              campaign.closed = true
            }
          }
          if (bribeCreatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.FeeCollected.decode(log)
            const feeCollected = new PoolBoosterFeeCollected({
              id: `${ctx.chain.id}-${log.id}`,
              chainId: ctx.chain.id,
              address: log.address,
              feeCollector: data.feeCollector,
              feeAmount: data.feeAmount,
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
              txHash: log.transactionHash,
            })
            feesCollected.set(feeCollected.id, feeCollected)
          }
        }
      }
      await ctx.store.insert([...campaigns.values()])
      await ctx.store.insert([...feesCollected.values()])
    },
  })
}
