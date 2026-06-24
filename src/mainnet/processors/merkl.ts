import * as abi from '@abi/merkl-distribution-creator'
import { MerklCampaign } from '@model'
import { Block, Context, EvmBatchProcessor, Log, logFilter } from '@originprotocol/squid-utils'

type CampaignStruct = ReturnType<typeof abi.events.NewCampaign.decode>['campaign']

/**
 * Index Merkl reward campaigns that target our ARM LP tokens.
 *
 * Listens to the single DistributionCreator contract for `NewCampaign` and
 * `CampaignOverride` events. The DistributionCreator emits these for every
 * Merkl campaign on the chain, so we filter down to campaigns whose
 * `campaignData` references one of our ARM addresses. The matched campaign is
 * upserted into `MerklCampaign` (override carries the full struct, so it's a
 * clean upsert of the mutable fields).
 */
export const createMerklProcessor = ({
  from,
  distributionCreator,
  arms,
}: {
  from: number
  distributionCreator: string
  arms: Record<string, { address: string }>
}) => {
  const address = distributionCreator.toLowerCase()
  // Lowercased, 0x-stripped ARM addresses to scan for inside campaignData.
  const armNeedles = Object.values(arms).map((arm) => arm.address.toLowerCase().replace(/^0x/, ''))

  const newCampaignFilter = logFilter({
    address: [address],
    topic0: [abi.events.NewCampaign.topic],
    range: { from },
  })
  const overrideFilter = logFilter({
    address: [address],
    topic0: [abi.events.CampaignOverride.topic],
    range: { from },
  })

  /** Returns the matched ARM address (0x-prefixed) referenced in campaignData, or undefined. */
  const matchArm = (campaignData: string): string | undefined => {
    const haystack = campaignData.toLowerCase()
    const needle = armNeedles.find((arm) => haystack.includes(arm))
    return needle ? `0x${needle}` : undefined
  }

  const upsertFromStruct = async (
    ctx: Context,
    block: Block,
    log: Log,
    campaign: CampaignStruct,
    campaigns: Map<string, MerklCampaign>,
  ) => {
    const armAddress = matchArm(campaign.campaignData)
    if (!armAddress) return

    const id = `${ctx.chain.id}:${campaign.campaignId}`
    const timestamp = new Date(block.header.timestamp)
    const existing = campaigns.get(id) ?? (await ctx.store.get(MerklCampaign, id))

    const entity =
      existing ??
      new MerklCampaign({
        id,
        chainId: ctx.chain.id,
        campaignId: campaign.campaignId,
        creator: campaign.creator.toLowerCase(),
        rewardToken: campaign.rewardToken.toLowerCase(),
        amount: campaign.amount,
        createdBlockNumber: block.header.height,
        createdTimestamp: timestamp,
        createdTxHash: log.transactionHash,
      })

    // Mutable fields (overrideCampaign can change start/duration/campaignData).
    entity.armAddress = armAddress
    entity.campaignType = campaign.campaignType
    entity.startTimestamp = new Date(campaign.startTimestamp * 1000)
    entity.endTimestamp = new Date((campaign.startTimestamp + campaign.duration) * 1000)
    entity.duration = campaign.duration
    entity.campaignData = campaign.campaignData
    entity.lastUpdatedBlockNumber = block.header.height
    entity.lastUpdatedTimestamp = timestamp

    campaigns.set(id, entity)
  }

  const setup = (processor: EvmBatchProcessor) => {
    processor.addLog(newCampaignFilter.value)
    processor.addLog(overrideFilter.value)
  }

  const process = async (ctx: Context) => {
    const campaigns = new Map<string, MerklCampaign>()
    for (const block of ctx.blocksWithContent) {
      for (const log of block.logs) {
        if (newCampaignFilter.matches(log)) {
          const { campaign } = abi.events.NewCampaign.decode(log)
          await upsertFromStruct(ctx, block, log, campaign, campaigns)
        } else if (overrideFilter.matches(log)) {
          const { campaign } = abi.events.CampaignOverride.decode(log)
          await upsertFromStruct(ctx, block, log, campaign, campaigns)
        }
      }
    }
    await ctx.store.upsert([...campaigns.values()])
  }

  return {
    from,
    setup,
    process,
  }
}
