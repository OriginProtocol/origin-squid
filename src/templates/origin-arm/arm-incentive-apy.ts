import dayjs from 'dayjs'
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { formatUnits, parseUnits } from 'viem'

import { MerklCampaign } from '@model'
import { Block, Context } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { Currency } from '@shared/post-processors/exchange-rates/mainnetCurrencies'

const DAY_MS = 86_400_000
const DAYS_PER_YEAR = 365.25
// All mainnet ARM liquidity assets (token0: WETH, USDe) are 18-decimal.
const TOKEN0_DECIMALS = 18

/**
 * External incentive rewards (currently Merkl campaigns) for an ARM on a given day.
 *
 * Sums each active campaign's reward value for the day (USD, prorated for the first/last day and
 * capped at the current block for today's in-progress stat), then:
 *   - incentiveYield: that value expressed in token0 units (parallel to ArmDailyStat.yield)
 *   - incentiveApr:   dailyRewardUSD / TVL_USD * 365.25
 *   - incentiveApy:   the same, daily-compounded
 * MAX_APR campaigns (aprCap set) don't emit their full budget — Merkl caps the daily payout at
 * aprCap * TVL / 365 — so we use min(maxDaily, cappedDaily), matching what holders actually earn.
 * Reward tokens are valued via the exchange-rate infra; unpriceable ones are skipped rather than
 * failing the batch. Returns zeros when no campaigns are active.
 */
export const calculateArmIncentiveApy = async (
  ctx: Context,
  block: Block,
  {
    armAddress,
    totalAssets,
    rateUSD,
  }: {
    armAddress: string
    totalAssets: bigint
    rateUSD?: { rate: bigint; decimals: number }
  },
): Promise<{ incentiveYield: bigint; incentiveApr: number; incentiveApy: number }> => {
  const zero = { incentiveYield: 0n, incentiveApr: 0, incentiveApy: 0 }

  const date = new Date(block.header.timestamp)
  const startOfDay = dayjs.utc(date).startOf('day').toDate()
  const endOfDay = dayjs.utc(date).endOf('day').toDate()
  const isCurrentDay = dayjs.utc(date).isSame(dayjs.utc(), 'day')
  const endOfRewardWindow = isCurrentDay ? date : endOfDay

  const campaigns = await ctx.store.find(MerklCampaign, {
    where: {
      armAddress: armAddress.toLowerCase(),
      startTimestamp: LessThanOrEqual(endOfDay),
      endTimestamp: MoreThanOrEqual(startOfDay),
    },
  })
  if (campaigns.length === 0) return zero

  const token0PriceUSD = +formatUnits(rateUSD?.rate ?? 0n, rateUSD?.decimals ?? 18)
  if (token0PriceUSD <= 0) return zero
  const tvlUSD = +formatUnits(totalAssets, TOKEN0_DECIMALS) * token0PriceUSD

  let dailyRewardsUSD = 0
  for (const campaign of campaigns) {
    const durationDays = campaign.duration / 86_400
    if (durationDays <= 0) continue
    let priceUSD = 0
    try {
      const rate = await ensureExchangeRate(ctx, block, campaign.rewardToken as Currency, 'USD')
      if (rate) priceUSD = +formatUnits(rate.rate, rate.decimals)
    } catch (err) {
      // Reward token not priceable — skip its contribution rather than failing the batch.
      ctx.log.warn(`incentive apy: no price for reward token ${campaign.rewardToken}: ${err}`)
      continue
    }
    if (priceUSD <= 0) continue
    // Max daily emission: the full budget spread evenly over the campaign duration.
    const maxDailyUSD = (+formatUnits(campaign.amount, campaign.rewardTokenDecimals) / durationDays) * priceUSD
    // MAX_APR campaigns cap the rate: Merkl distributes only min(maxDaily, aprCap * TVL / 365), so a
    // small pool earns far less than the max budget. Uncapped campaigns emit the full daily budget.
    const dailyUSD =
      campaign.aprCap != null && tvlUSD > 0 ? Math.min(maxDailyUSD, (campaign.aprCap * tvlUSD) / 365) : maxDailyUSD
    // Prorate by how much of the day's current reward window the campaign is active.
    const overlapMs =
      Math.min(endOfRewardWindow.getTime(), campaign.endTimestamp.getTime()) -
      Math.max(startOfDay.getTime(), campaign.startTimestamp.getTime())
    const activeFraction = Math.max(0, Math.min(1, overlapMs / DAY_MS))
    dailyRewardsUSD += dailyUSD * activeFraction
  }

  // Express the day's reward value in token0 units, to parallel ArmDailyStat.yield.
  const incentiveYield = parseUnits((dailyRewardsUSD / token0PriceUSD).toFixed(TOKEN0_DECIMALS), TOKEN0_DECIMALS)
  if (tvlUSD <= 0) return { ...zero, incentiveYield }

  const dailyRate = dailyRewardsUSD / tvlUSD
  return {
    incentiveYield,
    incentiveApr: dailyRate * DAYS_PER_YEAR,
    incentiveApy: (1 + dailyRate) ** DAYS_PER_YEAR - 1,
  }
}
