import * as abi from '@abi/merkl-distribution-creator'
import { MerklCampaign } from '@model'
import { Block, Context, EvmBatchProcessor, Log, logFilter } from '@originprotocol/squid-utils'
import { arms } from '@utils/addresses'

// Merkl DistributionCreator (campaign creation) — same address across most chains.
const DISTRIBUTION_CREATOR = '0x8bb4c975ff3c250e0ceea271728547f3802b36fd'
// Address(es) Origin uses to create Merkl campaigns (CampaignParameters.creator).
// Used to filter NewCampaign events down to our own campaigns. Extend as needed.
const CREATORS = ['0x4ff1b9d9ba8558f5eafcec096318ea0d8b541971', '0x67ce815d91de0f843472fe9c171acb036994cd05']
// Earliest mainnet ARM deploy — campaigns can only target an ARM after it exists.
const FROM = 20987226
const MERKL_API = 'https://api.merkl.xyz/v4'

const creatorSet = new Set(CREATORS.map((c) => c.toLowerCase()))
const armSet = new Set(Object.values(arms).map((arm) => arm.address.toLowerCase()))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type CampaignStruct = ReturnType<typeof abi.events.NewCampaign.decode>['campaign']

/**
 * Resolve a campaign's targeted contract via the Merkl API.
 *
 * The on-chain event does not carry the target — it lives in Merkl's off-chain payload
 * (params.targetToken). We resolve it inline at capture so the row is written complete
 * and deterministically (the campaign->target mapping is immutable). Transient failures
 * are retried with exponential backoff; if it still fails we throw, which fails the batch
 * so Subsquid retries it later — no partial/null data is ever written, and the processor
 * pauses rather than crashing.
 */
type ResolvedCampaign = {
  targetToken: string | null
  rewardTokenDecimals: number
  distributionMethod: string | null
  aprCap: number | null
}

type MerklCampaignApi = {
  campaignId?: string
  params?: {
    targetToken?: string
    decimalsRewardToken?: number
    distributionMethodParameters?: {
      distributionMethod?: string
      distributionSettings?: { apr?: string | number }
    }
  }
}

const resolveCampaign = async (ctx: Context, chainId: number, campaignId: string): Promise<ResolvedCampaign> => {
  // test=true includes test campaigns in the response (additive — live campaigns still returned).
  const url = `${MERKL_API}/campaigns?chainId=${chainId}&campaignId=${campaignId}&test=true`
  const maxAttempts = 6
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) await sleep(500 * 2 ** (attempt - 1)) // 0.5s, 1s, 2s, 4s, 8s
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data = (await res.json()) as MerklCampaignApi[]
      const match = data.find((c) => c?.campaignId?.toLowerCase() === campaignId.toLowerCase())
      if (!match) throw new Error('campaign not yet indexed by Merkl')
      const dist = match.params?.distributionMethodParameters
      // MAX_APR campaigns cap the reward rate; distributionSettings.apr is the cap (e.g. "0.02").
      const aprCap = dist?.distributionMethod === 'MAX_APR' && dist.distributionSettings?.apr != null
        ? Number(dist.distributionSettings.apr)
        : null
      return {
        targetToken: match.params?.targetToken?.toLowerCase() ?? null,
        rewardTokenDecimals: match.params?.decimalsRewardToken ?? 18,
        distributionMethod: dist?.distributionMethod ?? null,
        aprCap: Number.isFinite(aprCap) ? aprCap : null,
      }
    } catch (err) {
      lastError = err
      ctx.log.warn(`merkl resolve attempt ${attempt + 1}/${maxAttempts} failed for ${campaignId}: ${err}`)
    }
  }
  throw new Error(`merkl: failed to resolve campaign ${campaignId} after ${maxAttempts} attempts: ${lastError}`)
}

const newCampaignFilter = logFilter({
  address: [DISTRIBUTION_CREATOR],
  topic0: [abi.events.NewCampaign.topic],
  range: { from: FROM },
})
const overrideFilter = logFilter({
  address: [DISTRIBUTION_CREATOR],
  topic0: [abi.events.CampaignOverride.topic],
  range: { from: FROM },
})

const upsertFromStruct = async (
  ctx: Context,
  block: Block,
  log: Log,
  campaign: CampaignStruct,
  campaigns: Map<string, MerklCampaign>,
) => {
  if (!creatorSet.has(campaign.creator.toLowerCase())) return

  const id = `${ctx.chain.id}:${campaign.campaignId}`
  const { targetToken, rewardTokenDecimals, distributionMethod, aprCap } = await resolveCampaign(
    ctx,
    ctx.chain.id,
    campaign.campaignId,
  )
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

  // Resolved target (Merkl API), and the ARM it rewards when the target is one of ours.
  entity.rewardTokenDecimals = rewardTokenDecimals
  entity.distributionMethod = distributionMethod
  entity.aprCap = aprCap
  entity.targetToken = targetToken
  entity.armAddress = targetToken && armSet.has(targetToken) ? targetToken : null
  // Mutable fields (overrideCampaign can change start/duration/campaignData).
  entity.campaignType = campaign.campaignType
  entity.startTimestamp = new Date(campaign.startTimestamp * 1000)
  entity.endTimestamp = new Date((campaign.startTimestamp + campaign.duration) * 1000)
  entity.duration = campaign.duration
  entity.campaignData = campaign.campaignData
  entity.lastUpdatedBlockNumber = block.header.height
  entity.lastUpdatedTimestamp = timestamp

  campaigns.set(id, entity)
}

/**
 * Index Merkl campaigns created by Origin (filtered on-chain by creator), resolving each
 * campaign's targeted ARM via the Merkl API at capture time.
 */
export const merklProcessor = {
  from: FROM,
  setup: (processor: EvmBatchProcessor) => {
    processor.addLog(newCampaignFilter.value)
    processor.addLog(overrideFilter.value)
  },
  process: async (ctx: Context) => {
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
  },
}
