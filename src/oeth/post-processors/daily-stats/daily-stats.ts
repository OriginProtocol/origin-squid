import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EntityManager, FindOptionsOrderValue, LessThanOrEqual } from 'typeorm'
import { formatEther } from 'viem'

import {
  ExchangeRate,
  OETH,
  OETHAPY,
  OETHBalancerMetaPoolStrategy,
  OETHCollateralDailyStat,
  OETHCurveLP,
  OETHDailyStat,
  OETHDripper,
  OETHFraxStaking,
  OETHMorphoAave,
  OETHStrategyDailyStat,
  OETHStrategyHoldingDailyStat,
  OETHVault,
} from '../../../model'
import { Context } from '../../../processor'

dayjs.extend(utc)

export const from = 16933090 // https://etherscan.io/tx/0x3b4ece4f5fef04bf7ceaec4f6c6edf700540d7597589f8da0e3a8c94264a3b50

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
    // ctx.log.info({ date, startDate, endDate })
    dates.push(date.toDate())
  }

  const dailyStats = [] as OETHDailyStat[]
  const dailyCollateralStats = [] as OETHCollateralDailyStat[]
  const dailyStrategyStats = [] as OETHStrategyDailyStat[]
  const dailyHoldingsStats = [] as OETHStrategyHoldingDailyStat[]

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

  const [
    lastApy,
    lastOeth,
    lastCurve,
    lastVault,
    lastBalancer,
    lastFrax,
    lastMorpho,
    lastDripper,
    lastRethRate,
    lastSfrxEthRate,
  ] = await Promise.all([
    ctx.store.findOne(OETHAPY, queryParams),
    ctx.store.findOne(OETH, queryParams),
    ctx.store.findOne(OETHCurveLP, queryParams),
    ctx.store.findOne(OETHVault, queryParams),
    ctx.store.findOne(OETHBalancerMetaPoolStrategy, queryParams),
    ctx.store.findOne(OETHFraxStaking, queryParams),
    ctx.store.findOne(OETHMorphoAave, queryParams),
    ctx.store.findOne(OETHDripper, queryParams),
    ctx.store.findOne(ExchangeRate, {
      where: { timestamp: LessThanOrEqual(date), pair: 'ETH_rETH' },
      order: { timestamp: 'desc' as FindOptionsOrderValue },
    }),
    ctx.store.findOne(ExchangeRate, {
      where: { timestamp: LessThanOrEqual(date), pair: 'ETH_sfrxETH' },
      order: { timestamp: 'desc' as FindOptionsOrderValue },
    }),
  ])

  // Do we have any useful data yet?
  const allEntities = [
    lastApy,
    lastOeth,
    lastCurve,
    lastVault,
    lastBalancer,
    lastFrax,
    lastMorpho,
    lastDripper,
    lastRethRate,
    lastSfrxEthRate,
  ]
  if (![lastApy, lastOeth].every((entity) => !!entity)) {
    return null
  }

  // console.log({
  //   lastApy,
  //   lastOeth,
  //   lastCurve,
  //   lastVault,
  //   lastBalancer,
  //   lastFrax,
  //   lastMorpho,
  // })

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
    }[]
  >(yieldStatsQuery, [end])

  const mostRecentEntity = allEntities.reduce((highest, current) => {
    if (!highest || !current) return current
    return current.blockNumber > highest.blockNumber ? current : highest
  })

  const id = date.toISOString().substring(0, 10)
  // ctx.log.info({ date, id })

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
    dripperWETH: lastDripper?.weth || 0n,

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
  const OETHOwned = lastCurve?.oethOwned || 0n
  const WETH =
    (lastVault?.weth || 0n) +
    (lastMorpho?.weth || 0n) +
    (lastBalancer?.weth || 0n)
  const stETH = lastVault?.stETH || 0n

  const rETHRaw = (lastVault?.rETH || 0n) + (lastBalancer?.rETH || 0n)
  const rethRate = lastRethRate?.rate || 1000000000000000000n
  const rETH = (rETHRaw * rethRate) / 1000000000000000000n

  const sfrxEthExchangeRate = lastSfrxEthRate?.rate || 1000000000000000000n
  const sfrxETH = lastFrax?.sfrxETH || 0n
  const convertedSfrxEth =
    (sfrxETH * sfrxEthExchangeRate) / 1000000000000000000n
  const frxETH = (lastVault?.frxETH || 0n) + convertedSfrxEth

  const totalCollateral = ETH + WETH + frxETH + stETH + rETH

  // console.log(`Day: ${date}`)
  // log([
  //   ['Total Supply', dailyStat.totalSupply],
  //   ['Circulating Supply', dailyStat.totalSupply - OETHOwned],
  //   ['Total Collateral', totalCollateral],
  //   ['Difference', dailyStat.totalSupply - OETHOwned - totalCollateral],
  //   ['Total ETH', ETH],
  //   ['Total WETH', WETH],
  //   ['Total stETH', stETH],
  //   ['Total rETH', rETH],
  //   ['Total frxETH', frxETH],
  //   ['', null],
  //   ['Vault frxETH', lastVault?.frxETH || 0n],
  //   ['Total sfrxETH', sfrxETH],
  // ])

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
      name: 'CURVE',
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: lastCurve?.totalSupply || 0n,
      total: lastCurve?.totalSupplyOwned || 0n,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-VAULT`,
      name: 'VAULT',
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: vaultTotal,
      total: vaultTotal,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-BALANCER`,
      name: 'BALANCER',
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: balancerTotal,
      total: balancerTotal,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-FRAX`,
      name: 'FRAX',
      dailyStatId: id as unknown as OETHDailyStat,
      tvl: lastFrax?.sfrxETH || 0n,
      total: frxETH,
    }),
    new OETHStrategyDailyStat({
      id: `${id}-MORPHO`,
      name: 'MORPHO',
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
      amount: lastCurve?.ethOwned || 0n,
      value: lastCurve?.ethOwned || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-CURVE-OETH`,
      strategyDailyStatId: `${id}-CURVE` as unknown as OETHStrategyDailyStat,
      symbol: 'OETH',
      amount: lastCurve?.oethOwned || 0n,
      value: lastCurve?.oethOwned || 0n,
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
      value: ((lastVault?.rETH || 0n) * rethRate) / 1000000000000000000n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-BALANCER-RETH`,
      strategyDailyStatId: `${id}-BALANCER` as unknown as OETHStrategyDailyStat,
      symbol: 'RETH',
      amount: lastBalancer?.rETH || 0n,
      value: ((lastBalancer?.rETH || 0n) * rethRate) / 1000000000000000000n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-BALANCER-WETH`,
      strategyDailyStatId: `${id}-BALANCER` as unknown as OETHStrategyDailyStat,
      symbol: 'WETH',
      amount: lastBalancer?.weth || 0n,
      value: lastBalancer?.weth || 0n,
    }),
    new OETHStrategyHoldingDailyStat({
      id: `${id}-FRAX-SFRXETH`,
      strategyDailyStatId: `${id}-FRAX` as unknown as OETHStrategyDailyStat,
      symbol: 'SFRXETH',
      amount: lastFrax?.sfrxETH || 0n,
      value: (sfrxETH * sfrxEthExchangeRate) / 1000000000000000000n,
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
      price: rethRate,
      value: (rETH * rethRate) / 1000000000000000000n,
    }),
    new OETHCollateralDailyStat({
      id: `${id}-FRXETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'FRXETH',
      amount: sfrxETH,
      price: 1n,
      value: sfrxETH,
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
SELECT '1 day' as period, SUM(fee) as total_fees, SUM(yield - fee) as total_yield, SUM(yield) as total_revenue
FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '1 day') AND $1::timestamp

UNION ALL

-- Results for 7 days
SELECT '7 days' as period, SUM(fee) as total_fees, SUM(yield - fee) as total_yield, SUM(yield) as total_revenue
FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '7 days') AND $1::timestamp

UNION ALL

-- Results for all time up to the end date
SELECT 'all time' as period, SUM(fee) as total_fees, SUM(yield - fee) as total_yield, SUM(yield) as total_revenue
FROM oeth_rebase
WHERE timestamp <= $1::timestamp
`

function log(entries: [string, bigint | null][]): void {
  if (!entries) {
    console.log('')
    return
  }
  // Find the longest label for alignment
  const maxLength = Math.max(...entries.map((entry) => entry[0].length))

  const lines = entries.map(([label, value]) => {
    // Format the value
    const formattedValue = value ? Number(formatEther(value)).toFixed(3) : ''
    // Right-align the label and value
    return `${label.padEnd(maxLength)} ${formattedValue.padStart(10)}`
  })

  console.log(`${lines.join('\n')}\n`)
}
