import * as curvePoolBoosterAbi from '@abi/otoken-curve-pool-booster'
import { PoolBoosterCampaign, PoolBoosterFeeCollected, PoolBoosterTokensRescued } from '@model'
import { Context, blockFrequencyUpdater, defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const createCurvePoolBoosterProcessor = (params: { from: number }) => {
  const frequencyUpdate = blockFrequencyUpdater({ from: params.from })

  const feeCollectedFilter = logFilter({
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
  const tokensRescuedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.TokensRescued.topic],
    range: { from: params.from },
  })
  const rewardPerVoteUpdatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.RewardPerVoteUpdated.topic],
    range: { from: params.from },
  })
  const totalRewardAmountUpdatedFilter = logFilter({
    topic0: [curvePoolBoosterAbi.events.TotalRewardAmountUpdated.topic],
    range: { from: params.from },
  })

  return defineProcessor({
    name: `curve-pool-booster`,
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(campaignCreatedFilter.value)
      processor.addLog(campaignIdUpdatedFilter.value)
      processor.addLog(campaignClosedFilter.value)
      processor.addLog(feeCollectedFilter.value)
      processor.addLog(tokensRescuedFilter.value)
      processor.addLog(rewardPerVoteUpdatedFilter.value)
      processor.addLog(totalRewardAmountUpdatedFilter.value)
    },
    process: async (ctx: Context) => {
      const campaigns = new Map<string, PoolBoosterCampaign>()
      const feesCollected = new Map<string, PoolBoosterFeeCollected>()
      const tokensRescued = new Map<string, PoolBoosterTokensRescued>()

      const getCampaign = async (address: string): Promise<PoolBoosterCampaign | undefined> => {
        const id = `${ctx.chain.id}-${address}`
        let campaign = campaigns.get(id) || (await ctx.store.get(PoolBoosterCampaign, id))
        if (campaign) {
          campaigns.set(id, campaign)
        }
        return campaign
      }

      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          // TODO: Validate campaign feeCollector is in our whitelist.
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
              closed: false,
            })
            campaigns.set(id, campaign)
          } else if (campaignIdUpdatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.CampaignIdUpdated.decode(log)
            const campaign = await getCampaign(log.address)
            if (campaign) {
              campaign.campaignId = data.newId
            }
          } else if (campaignClosedFilter.matches(log)) {
            const campaign = await getCampaign(log.address)
            if (campaign) {
              campaign.closed = true
            }
          } else if (rewardPerVoteUpdatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.RewardPerVoteUpdated.decode(log)
            const campaign = await getCampaign(log.address)
            if (campaign) {
              campaign.maxRewardPerVote = data.newMaxRewardPerVote
            }
          } else if (totalRewardAmountUpdatedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.TotalRewardAmountUpdated.decode(log)
            const campaign = await getCampaign(log.address)
            if (campaign) {
              campaign.totalRewardAmount += data.extraTotalRewardAmount
            }
          } else if (feeCollectedFilter.matches(log)) {
            const campaign = await getCampaign(log.address)
            if (campaign) {
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
          } else if (tokensRescuedFilter.matches(log)) {
            const data = curvePoolBoosterAbi.events.TokensRescued.decode(log)
            const tokensRescuedEvent = new PoolBoosterTokensRescued({
              id: `${ctx.chain.id}-${log.id}`,
              chainId: ctx.chain.id,
              address: log.address,
              token: data.token,
              amount: data.amount,
              receiver: data.receiver,
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
              txHash: log.transactionHash,
            })
            tokensRescued.set(tokensRescuedEvent.id, tokensRescuedEvent)
          }
        }
      }
      await ctx.store.upsert([...campaigns.values()])
      await ctx.store.insert([...feesCollected.values()])
      await ctx.store.insert([...tokensRescued.values()])
    },
  })
}
