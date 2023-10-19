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
  OETHStrategyDailyStat,
  OETHStrategyHoldingDailyStat,
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
  const dailyStrategyStats = [] as OETHStrategyDailyStat[]
  const dailyHoldingsStats = [] as OETHStrategyHoldingDailyStat[]

  for (const day of days) {
    const dailyStatInserts = await updateDailyStats(ctx, day)
    if (dailyStatInserts) {
      dailyStats.push(dailyStatInserts.dailyStat)
      dailyCollateralStats.push(...dailyStatInserts.dailyCollateralStats)
      dailyStrategyStats.push(...dailyStatInserts.dailyStrategyStats)
      dailyHoldingsStats.push(...dailyStatInserts.dailyStrategyHoldingsStats)
    }
  }

  await ctx.store.upsert(dailyStats)
  await ctx.store.upsert(dailyCollateralStats)
  await ctx.store.upsert(dailyStrategyStats)
  await ctx.store.upsert(dailyHoldingsStats)
}

async function updateDailyStats(ctx: Context, date: Date) {
  const queryParams = {
    where: { timestamp: LessThanOrEqual(date) },
    order: { timestamp: 'desc' as FindOptionsOrderValue },
  }

  const [
    lastApy,
    lastOeth,
    lastCurve,
    lastVault,
    lastBalancer,
    lastFrax,
    lastMorpho,
  ] = await Promise.all([
    ctx.store.findOne(OETHAPY, queryParams),
    ctx.store.findOne(OETH, queryParams),
    ctx.store.findOne(OETHCurveLP, queryParams),
    ctx.store.findOne(OETHVault, queryParams),
    ctx.store.findOne(OETHBalancerMetaPoolStrategy, queryParams),
    ctx.store.findOne(OETHFraxStaking, queryParams),
    ctx.store.findOne(OETHMorphoAave, queryParams),
  ])

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

    totalSupply: lastOeth?.totalSupply || 0n,
    totalSupplyUSD: 0,
    rebasingSupply: lastOeth?.rebasingSupply || 0n,
    nonRebasingSupply: lastOeth?.nonRebasingSupply || 0n,
    amoSupply: lastCurve?.oethOwned || 0n,

    yield: yieldStats[0].total_yield || 0n,
    fees: yieldStats[0].total_fees || 0n,
    revenue: yieldStats[0].total_revenue || 0n,
    revenue7DayAvg: BigInt(yieldStats[1].total_revenue || 0n) / 7n,
    revenue7DayTotal: yieldStats[1].total_revenue || 0n,
    revenueAllTime: yieldStats[2].total_revenue || 0n,

    pegPrice: 0n,
  })

  // Collateral totals
  const ETH = lastCurve?.ethOwned || 0n
  const WETH =
    (lastVault?.weth || 0n) +
    (lastMorpho?.weth || 0n) +
    (lastBalancer?.weth || 0n)
  const stETH = lastVault?.stETH || 0n
  const rETH = (lastVault?.rETH || 0n) + (lastBalancer?.rETH || 0n)
  const frxETH = (lastVault?.frxETH || 0n) + (lastFrax?.frxETH || 0n)

  const totalCollateral = ETH + WETH + frxETH + stETH + rETH
  console.log({
    date,
    totalCollateral,
    totalSupply: dailyStat.totalSupply,
  })

  // Strategy totals
  const vaultTotal =
    (lastVault?.frxETH || 0n) +
    (lastVault?.weth || 0n) +
    (lastVault?.stETH || 0n) +
    (lastVault?.rETH || 0n)

  const balancerTotal = (lastBalancer?.weth || 0n) + (lastBalancer?.rETH || 0n)

  const dailyStrategyStats = [
    new OETHStrategyDailyStat({
      id: `${id}-CURVE`,
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: lastCurve?.ethOwned || 0n,
      total: lastCurve?.ethOwned || 0n,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-VAULT`,
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: vaultTotal,
      total: vaultTotal,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-BALANCER`,
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: balancerTotal,
      total: balancerTotal,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-FRAX`,
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: lastFrax?.frxETH || 0n,
      total: lastFrax?.frxETH || 0n,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-MORPHO`,
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: lastMorpho?.weth || 0n,
      total: lastMorpho?.weth || 0n,
    }),
  ]

  const dailyStrategyHoldingsStats = [
    new OETHStrategyHoldingDailyStat({
      id: `${id}-CURVE-ETH`,
      strategyDailyStatId: `${id}-CURVE` as unknown as OETHStrategyDailyStat,
      symbol: 'ETH',
      amount: lastCurve?.eth || 0n,
      value: lastCurve?.eth || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-VAULT-WETH`,
      strategyDailyStatId: `${id}-VAULT` as unknown as OETHStrategyDailyStat,
      symbol: 'WETH',
      amount: lastVault?.weth || 0n,
      value: lastVault?.weth || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-VAULT-FRXETH`,
      strategyDailyStatId: `${id}-VAULT` as unknown as OETHStrategyDailyStat,
      symbol: 'FRXETH',
      amount: lastVault?.frxETH || 0n,
      value: lastVault?.frxETH || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-VAULT-STETH`,
      strategyDailyStatId: `${id}-VAULT` as unknown as OETHStrategyDailyStat,
      symbol: 'STETH',
      amount: lastVault?.stETH || 0n,
      value: lastVault?.stETH || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-VAULT-RETH`,
      strategyDailyStatId: `${id}-VAULT` as unknown as OETHStrategyDailyStat,
      symbol: 'RETH',
      amount: lastVault?.rETH || 0n,
      value: lastVault?.rETH || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-BALANCER-RETH`,
      strategyDailyStatId: `${id}-BALANCER` as unknown as OETHStrategyDailyStat,
      symbol: 'RETH',
      amount: lastBalancer?.rETH || 0n,
      value: lastBalancer?.rETH || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-BALANCER-WETH`,
      strategyDailyStatId: `${id}-BALANCER` as unknown as OETHStrategyDailyStat,
      symbol: 'WETH',
      amount: lastBalancer?.weth || 0n,
      value: lastBalancer?.weth || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-FRAX-FRXETH`,
      strategyDailyStatId: `${id}-FRAX` as unknown as OETHStrategyDailyStat,
      symbol: 'FRXETH',
      amount: lastFrax?.frxETH || 0n,
      value: lastFrax?.frxETH || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-MORPHO-WETH`,
      strategyDailyStatId: `${id}-MORPHO` as unknown as OETHStrategyDailyStat,
      symbol: 'WETH',
      amount: lastMorpho?.weth || 0n,
      value: lastMorpho?.weth || 0n,
    }),
  ]

  const dailyCollateralStats = [
    new OETHCollateralDailyStat({
      id: `${id}-ETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'ETH',
      amount: ETH,
      price: 1n,
      value: ETH,
    }),
    new OETHCollateralDailyStat({
      id: `${id}-WETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'WETH',
      amount: WETH,
      price: 1n,
      value: WETH,
    }),
    new OETHCollateralDailyStat({
      id: `${id}-STETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'STETH',
      amount: stETH,
      price: 1n,
      value: stETH,
    }),
    new OETHCollateralDailyStat({
      id: `${id}-RETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'RETH',
      amount: rETH,
      price: 1n,
      value: rETH,
    }),
    new OETHCollateralDailyStat({
      id: `${id}-FRXETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'FRXETH',
      amount: frxETH,
      price: 1n,
      value: frxETH,
    }),
  ]

  return {
    dailyStat,
    dailyCollateralStats,
    dailyStrategyStats,
    dailyStrategyHoldingsStats,
  }
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
