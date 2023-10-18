import { EntityManager, FindOptionsOrderValue, LessThanOrEqual } from 'typeorm'

import {
  OETH,
  OETHAPY,
  OETHBalancerMetaPoolStrategy,
  OETHCollateralDailyStat,
  OETHCurveLP,
  OETHDailyStat,
  OETHFraxStaking,
  OETHMorphoAave,
  OETHVault,
} from '../../model'
import { Context } from '../../processor'

export const process = async (ctx: Context) => {
  const firstBlockTimestamp = new Date(ctx.blocks[0]?.header.timestamp)

  const firstBlock = ctx.blocks[0]
  const lastBlock = ctx.blocks[ctx.blocks.length - 1]
  const lastDailyStat = await ctx.store.findOne(OETHDailyStat, {
    where: { timestamp: LessThanOrEqual(firstBlockTimestamp) },
    order: { id: 'desc' },
  })

  const startTimestamp = Math.min(
    lastDailyStat?.timestamp.getTime() || Date.now(),
    firstBlock.header.timestamp,
  )
  const endTimestamp = lastBlock?.header.timestamp || Date.now()

  const days = getStartOfDays(startTimestamp, endTimestamp)

  const dailyStats = [] as OETHDailyStat[]
  const dailyCollateralStats = [] as OETHCollateralDailyStat[]
  for (const day of days) {
    const dailyStatInserts = await updateDailyStats(ctx, day)
    if (dailyStatInserts) {
      dailyStats.push(dailyStatInserts.dailyStat)
      dailyCollateralStats.push(...dailyStatInserts.dailyCollateralStats)
    }
  }

  await ctx.store.upsert(dailyStats)
  await ctx.store.upsert(dailyCollateralStats)
}

async function updateDailyStats(ctx: Context, date: Date) {
  const queryParams = {
    where: { timestamp: LessThanOrEqual(date) },
    order: { timestamp: 'desc' as FindOptionsOrderValue },
  }
  const lastApy = await ctx.store.findOne(OETHAPY, queryParams)
  const lastOeth = await ctx.store.findOne(OETH, queryParams)
  const lastCurve = await ctx.store.findOne(OETHCurveLP, queryParams)
  const lastVault = await ctx.store.findOne(OETHVault, queryParams)
  const lastBalancer = await ctx.store.findOne(
    OETHBalancerMetaPoolStrategy,
    queryParams,
  )
  const lastFrax = await ctx.store.findOne(OETHFraxStaking, queryParams)
  const lastMorpho = await ctx.store.findOne(OETHMorphoAave, queryParams)

  const allEntities = [lastApy, lastOeth]
  if (!allEntities.every((entity) => !!entity)) {
    return null
  }

  console.log({
    lastApy,
    lastOeth,
    lastCurve,
    lastVault,
    lastBalancer,
    lastFrax,
    lastMorpho,
  })

  const entityManager = (
    ctx.store as unknown as { em: () => EntityManager }
  ).em()

  const end = new Date(date)
  end.setUTCHours(23, 59, 59, 0)
  const yieldStats = await entityManager.query(yieldStatsQuery, [end])

  const mostRecentEntity = allEntities.reduce((highest, current) => {
    if (!highest || !current) return current
    return current.blockNumber > highest.blockNumber ? current : highest
  })

  const id = date.toISOString().substring(0, 10)

  const dailyStat = new OETHDailyStat({
    id,
    blockNumber: mostRecentEntity?.blockNumber,
    timestamp: mostRecentEntity?.timestamp,

    apr: lastApy?.apr,
    apy: lastApy?.apy,
    apy7DayAvg: lastApy?.apy7DayAvg,
    apy14DayAvg: lastApy?.apy14DayAvg,
    apy30DayAvg: lastApy?.apy30DayAvg,

    totalSupply: lastOeth?.totalSupply,
    totalSupplyUSD: 0,
    rebasingSupply: lastOeth?.rebasingSupply,
    nonRebasingSupply: lastOeth?.nonRebasingSupply,
    amoSupply: lastCurve?.oethOwned,

    yield: yieldStats[0].total_yield || 0n,
    fees: yieldStats[0].total_fees || 0n,
    revenue: yieldStats[0].total_revenue || 0n,
    revenue7DayAvg: BigInt(yieldStats[1].total_revenue || 0n) / 7n,
    revenue7DayTotal: yieldStats[1].total_revenue || 0n,
    revenueAllTime: yieldStats[2].total_revenue || 0n,

    pegPrice: 0n,
  })

  const dailyCollateralStats = [
    new OETHCollateralDailyStat({
      id: `${id}-ETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'ETH',
      amount: 0n,
      price: 0n,
      value: 0n,
    }),
  ]

  return { dailyStat, dailyCollateralStats }
}

function getStartOfDays(startTimestamp: number, endTimestamp: number): Date[] {
  const dayMilliseconds = 24 * 60 * 60 * 1000 // Number of milliseconds in a day
  let startTimestampStart = new Date(startTimestamp)
  startTimestampStart.setUTCHours(0, 0, 0, 0)

  let currentTimestamp = startTimestampStart.getTime()
  let dates: Date[] = []

  while (currentTimestamp <= endTimestamp) {
    let date = new Date(currentTimestamp)
    date.setUTCHours(0, 0, 0, 0) // Set to start of the day
    dates.push(date)

    currentTimestamp += dayMilliseconds // Move to the next day
  }

  return dates
}

const yieldStatsQuery = `
-- Results for 1 day
SELECT '1 day' as period, SUM(fee) as total_fees, SUM(yield) as total_yield, SUM(yield - fee) as total_revenue
FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '1 day') AND $1::timestamp

UNION ALL

-- Results for 7 days
SELECT '7 days' as period, SUM(fee) as total_fees, SUM(yield) as total_yield, SUM(yield - fee) as total_revenue
FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '7 days') AND $1::timestamp

UNION ALL

-- Results for all time up to the end date
SELECT 'all time' as period, SUM(fee) as total_fees, SUM(yield) as total_yield, SUM(yield - fee) as total_revenue
FROM oeth_rebase
WHERE timestamp <= $1::timestamp
`
