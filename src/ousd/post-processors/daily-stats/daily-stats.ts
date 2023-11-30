import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EntityManager, FindOptionsOrderValue, LessThanOrEqual } from 'typeorm'

import {
  ExchangeRate,
  OUSD,
  OUSDAPY,
  OUSDCollateralDailyStat,
  OUSDDailyStat,
  OUSDHistory,
  OUSDMorphoAave,
  OUSDStrategyDailyStat,
  OUSDStrategyHoldingDailyStat,
  OUSDVault,
} from '../../../model'
import { Context } from '../../../processor'

dayjs.extend(utc)

export const from = 11585978 // OUSDReset

export const setup = async (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  const firstBlockTimestamp = ctx.blocks.find((b) => b.header.height >= from)
    ?.header.timestamp
  if (!firstBlockTimestamp) return

  const firstBlock = ctx.blocks[0]
  const lastBlock = ctx.blocks[ctx.blocks.length - 1]
  const startDate = dayjs.utc(firstBlock.header.timestamp).endOf('day')
  const endDate = dayjs.utc(lastBlock.header.timestamp).endOf('day')

  let dates: Date[] = []
  for (
    let date = startDate;
    !date.isAfter(endDate);
    date = date.add(1, 'day').endOf('day')
  ) {
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

  const [lastApy, lastOusd, lastVault, lastMorpho, lastWrappedOUSDHistory] =
    await Promise.all([
      ctx.store.findOne(OUSDAPY, queryParams),
      ctx.store.findOne(OUSD, queryParams),
      ctx.store.findOne(OUSDVault, queryParams),
      ctx.store.findOne(OUSDMorphoAave, queryParams),
      ctx.store.findOne(OUSDHistory, {
        where: {
          timestamp: LessThanOrEqual(date),
          address: { id: '0xd2af830e8cbdfed6cc11bab697bb25496ed6fa62' },
        },
        order: { timestamp: 'desc' as FindOptionsOrderValue },
      }),
    ])

  // Do we have any useful data yet?
  const allEntities = [lastApy, lastOusd, lastVault, lastMorpho].filter(Boolean)
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
      total_yield: bigint
      total_fees: bigint
      total_revenue: bigint
      total_yield_converted: bigint
      total_fees_converted: bigint
      total_revenue_converted: bigint
    }[]
  >(yieldStatsQuery, [end])

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

    yield: yieldStats[0].total_yield || 0n,
    fees: yieldStats[0].total_fees || 0n,
    revenue: yieldStats[0].total_revenue || 0n,
    revenue7DayAvg: BigInt(yieldStats[1].total_revenue || 0n) / 7n,
    revenue7DayTotal: yieldStats[1].total_revenue || 0n,
    revenueAllTime: yieldStats[2].total_revenue || 0n,

    yieldConverted: yieldStats[0].total_yield_converted || 0n,
    feesConverted: yieldStats[0].total_fees_converted || 0n,
    revenueConverted: yieldStats[0].total_revenue_converted || 0n,
    revenue7DayAvgConverted: BigInt(yieldStats[1].total_revenue_converted || 0n) / 7n,
    revenue7DayTotalConverted: yieldStats[1].total_revenue_converted || 0n,
    revenueAllTimeConverted: yieldStats[2].total_revenue_converted || 0n,

    pegPrice: 0n,
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
  SUM(fee) as total_fees,
  SUM(yield - fee) as total_yield,
  SUM(yield) as total_revenue,

  SUM(fee_converted) as total_fees_converted,
  SUM(yield_converted - fee_converted) as total_yield_converted,
  SUM(yield_converted) as total_revenue_converted

FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '1 day') AND $1::timestamp

UNION ALL

-- Results for 7 days
SELECT '7 days' as period,
  SUM(fee) as total_fees,
  SUM(yield - fee) as total_yield,
  SUM(yield) as total_revenue,

  SUM(fee_converted) as total_fees_converted,
  SUM(yield_converted - fee_converted) as total_yield_converted,
  SUM(yield_converted) as total_revenue_converted

FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '7 days') AND $1::timestamp

UNION ALL

-- Results for all time up to the end date
SELECT 'all time' as period,
  SUM(fee) as total_fees,
  SUM(yield - fee) as total_yield,
  SUM(yield) as total_revenue,

  SUM(fee_converted) as total_fees_converted,
  SUM(yield_converted - fee_converted) as total_yield_converted,
  SUM(yield_converted) as total_revenue_converted

FROM oeth_rebase
WHERE timestamp <= $1::timestamp
`
