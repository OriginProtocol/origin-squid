import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EntityManager, FindOptionsOrderValue, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'

import {
  OToken,
  OTokenAPY,
  OTokenAddress,
  OTokenHistory,
  OUSDCollateralDailyStat,
  OUSDDailyStat,
  OUSDStrategyDailyStat,
  OUSDStrategyHoldingDailyStat,
  OUSDVault,
} from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OUSD_ADDRESS } from '@utils/addresses'
import { applyCoingeckoData } from '@utils/coingecko'

dayjs.extend(utc)

export const from = 11585978 // OUSDReset

export const setup = async (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  const firstBlockTimestamp = ctx.blocks.find((b) => b.header.height >= from)?.header.timestamp
  if (!firstBlockTimestamp) return

  const firstBlock = ctx.blocks[0]
  const lastBlock = ctx.blocks[ctx.blocks.length - 1]
  const startDate = dayjs.utc(firstBlock.header.timestamp).endOf('day')
  const endDate = dayjs.utc(lastBlock.header.timestamp).endOf('day')

  let dates: Date[] = []
  for (let date = startDate; !date.isAfter(endDate); date = date.add(1, 'day').endOf('day')) {
    dates.push(date.toDate())
  }

  const dailyStats = [] as OUSDDailyStat[]
  const dailyCollateralStats = [] as OUSDCollateralDailyStat[]
  const dailyStrategyStats = [] as OUSDStrategyDailyStat[]
  const dailyHoldingsStats = [] as OUSDStrategyHoldingDailyStat[]

  for (const date of dates) {
    const dailyStatInserts = await updateDailyStats(ctx, date)
    if (dailyStatInserts) {
      dailyStats.push(dailyStatInserts.dailyStat)
      dailyCollateralStats.push(...dailyStatInserts.dailyCollateralStats)
      dailyStrategyStats.push(...dailyStatInserts.dailyStrategyStats)
      dailyHoldingsStats.push(...dailyStatInserts.dailyStrategyHoldingsStats)
    }
  }

  if (ctx.isHead) {
    const updatedStats = (await applyCoingeckoData(ctx, {
      Entity: OUSDDailyStat,
      coinId: 'origin-dollar',
      // startTimestamp: Date.UTC(2023, 4, 17),
    })) as OUSDDailyStat[]
    const existingIds = dailyStats.map((stat) => stat.id)
    dailyStats.push(...updatedStats.filter((stat) => existingIds.indexOf(stat.id) < 0))
  }

  await ctx.store.upsert(dailyStats)
  await Promise.all([
    ctx.store.upsert(dailyCollateralStats),
    ctx.store.upsert(dailyStrategyStats),
    ctx.store.upsert(dailyHoldingsStats),
  ])
}

async function updateDailyStats(ctx: Context, date: Date) {
  const queryParams = {
    where: { timestamp: LessThanOrEqual(date) },
    order: { timestamp: 'desc' as FindOptionsOrderValue },
  }
  const otokenQueryParams = {
    ...queryParams,
    where: {
      chainId: ctx.chain.id,
      otoken: OUSD_ADDRESS,
      ...queryParams.where,
    },
  }

  const [lastApy, lastOusd, lastVault, lastWrappedOUSDHistory, holdersOverThreshold] = await Promise.all([
    ctx.store.findOne(OTokenAPY, otokenQueryParams),
    ctx.store.findOne(OToken, otokenQueryParams),
    ctx.store.findOne(OUSDVault, queryParams),
    ctx.store.findOne(OTokenHistory, {
      where: {
        chainId: ctx.chain.id,
        otoken: OUSD_ADDRESS,
        timestamp: LessThanOrEqual(date),
        address: { address: '0xd2af830e8cbdfed6cc11bab697bb25496ed6fa62' },
      },
      order: { timestamp: 'desc' as FindOptionsOrderValue },
    }),
    ctx.store.countBy(OTokenAddress, {
      chainId: ctx.chain.id,
      otoken: OUSD_ADDRESS,
      balance: MoreThanOrEqual(10n ** 20n), // $100
    }),
  ])

  // Do we have any useful data yet?
  const allEntities = [lastApy, lastOusd, lastVault].filter(Boolean)
  if (![lastApy, lastOusd].every((entity) => !!entity)) {
    return null
  }

  const entityManager = (
    ctx.store as unknown as {
      em: () => EntityManager
    }
  ).em()

  const end = dayjs.utc(date).endOf('day').toDate()
  const yieldStats = await entityManager.query<
    {
      period: string
      total_yield_usd: bigint
      total_yield_eth: bigint
      total_fees_usd: bigint
      total_fees_eth: bigint
    }[]
  >(yieldStatsQuery, [end.toJSON()])

  const mostRecentEntity = allEntities.reduce((highest, current) => {
    if (!highest || !current) return current
    return current.blockNumber > highest.blockNumber ? current : highest
  })

  if (!mostRecentEntity?.blockNumber) {
    return null
  }

  const id = date.toISOString().substring(0, 10)

  const dailyStat = new OUSDDailyStat({
    id,
    blockNumber: mostRecentEntity?.blockNumber,
    timestamp: mostRecentEntity?.timestamp,

    apr: lastApy?.apr,
    apy: lastApy?.apy,
    apy7DayAvg: lastApy?.apy7DayAvg,
    apy14DayAvg: lastApy?.apy14DayAvg,
    apy30DayAvg: lastApy?.apy30DayAvg,

    totalSupply: lastOusd?.totalSupply || 0n,
    totalSupplyUSD: 0,
    rebasingSupply: lastOusd?.rebasingSupply || 0n,
    nonRebasingSupply: lastOusd?.nonRebasingSupply || 0n,
    amoSupply: 0n,
    dripperWETH: 0n,
    wrappedSupply: lastWrappedOUSDHistory?.balance || 0n,
    tradingVolumeUSD: 0,

    yieldETH: yieldStats[0].total_yield_eth || 0n,
    yieldETH7Day: yieldStats[1].total_yield_eth || 0n,
    yieldETHAllTime: yieldStats[2].total_yield_eth || 0n,

    yieldUSD: yieldStats[0].total_yield_usd || 0n,
    yieldUSD7Day: yieldStats[1].total_yield_usd || 0n,
    yieldUSDAllTime: yieldStats[2].total_yield_usd || 0n,

    feesETH: yieldStats[0].total_fees_eth || 0n,
    feesETH7Day: yieldStats[1].total_fees_eth || 0n,
    feesETHAllTime: yieldStats[2].total_fees_eth || 0n,

    feesUSD: yieldStats[0].total_fees_usd || 0n,
    feesUSD7Day: yieldStats[1].total_fees_usd || 0n,
    feesUSDAllTime: yieldStats[2].total_fees_usd || 0n,

    pegPrice: 0n,
    marketCapUSD: 0,
    holdersOverThreshold,
  })

  const dailyStrategyStats: OUSDStrategyDailyStat[] = [
    // new OUSDStrategyDailyStat({
    //   id: `${id}-CURVE`,
    //   name: 'CURVE',
    //   dailyStatId: id as unknown as OUSDDailyStat,
    //   tvl: lastCurve?.totalSupplyOwned || 0n,
    //   total: lastCurve?.totalSupplyOwned || 0n,
    // }),
  ]

  const dailyStrategyHoldingsStats: OUSDStrategyHoldingDailyStat[] = [
    // new OUSDStrategyHoldingDailyStat({
    //   id: `${id}-CURVE-ETH`,
    //   strategyDailyStatId: `${id}-CURVE` as unknown as OUSDStrategyDailyStat,
    //   symbol: 'ETH',
    //   amount: lastCurve?.ethOwned || 0n,
    //   value: lastCurve?.ethOwned || 0n,
    // }),
  ]

  const dailyCollateralStats: OUSDCollateralDailyStat[] = [
    // new OUSDCollateralDailyStat({
    //   id: `${id}-ETH`,
    //   dailyStatId: id as unknown as OUSDDailyStat,
    //   symbol: 'ETH',
    //   amount: ETH,
    //   price: 1n,
    //   value: ETH,
    // }),
  ]

  return {
    dailyStat,
    dailyCollateralStats,
    dailyStrategyStats,
    dailyStrategyHoldingsStats,
  }
}

const yieldStatsQuery = `
-- Results for 1 day
SELECT '1 day' as period,
  SUM(fee_usd) as total_fees_usd,
  SUM(yield_usd - fee_usd) as total_yield_usd,
  SUM(fee_eth) as total_fees_eth,
  SUM(yield_eth - fee_eth) as total_yield_eth

FROM o_token_rebase
WHERE chain_id = 1 AND otoken = '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86' AND timestamp BETWEEN ($1::timestamp - interval '1 day') AND $1::timestamp

UNION ALL

-- Results for 7 days
SELECT '7 days' as period,
  SUM(fee_usd) as total_fees_usd,
  SUM(yield_usd - fee_usd) as total_yield_usd,
  SUM(fee_eth) as total_fees_eth,
  SUM(yield_eth - fee_eth) as total_yield_eth

FROM o_token_rebase
WHERE chain_id = 1 AND otoken = '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86' AND timestamp BETWEEN ($1::timestamp - interval '7 days') AND $1::timestamp

UNION ALL

-- Results for all time up to the end date
SELECT 'all time' as period,
  SUM(fee_usd) as total_fees_usd,
  SUM(yield_usd - fee_usd) as total_yield_usd,
  SUM(fee_eth) as total_fees_eth,
  SUM(yield_eth - fee_eth) as total_yield_eth

FROM o_token_rebase
WHERE chain_id = 1 AND otoken = '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86' AND timestamp <= $1::timestamp
`
