import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  EntityManager,
  FindOptionsOrderValue,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm'

import {
  ExchangeRate,
  OETH,
  OETHAPY,
  OETHAddress,
  OETHBalancerMetaPoolStrategy,
  OETHCollateralDailyStat,
  OETHCurveLP,
  OETHDailyStat,
  OETHDripper,
  OETHFraxStaking,
  OETHHistory,
  OETHMorphoAave,
  OETHStrategyDailyStat,
  OETHStrategyHoldingDailyStat,
  OETHVault,
} from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { applyCoingeckoData } from '@utils/coingecko'

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

  if (ctx.isHead) {
    const updatedStats = (await applyCoingeckoData(ctx, {
      Entity: OETHDailyStat,
      coinId: 'origin-ether',
      startTimestamp: Date.UTC(2023, 4, 17),
    })) as OETHDailyStat[]
    const existingIds = dailyStats.map((stat) => stat.id)
    dailyStats.push(
      ...updatedStats.filter((stat) => existingIds.indexOf(stat.id) < 0),
    )
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
    lastWrappedOETHHistory,
    holdersOverThreshold,
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
    ctx.store.findOne(OETHHistory, {
      where: {
        timestamp: LessThanOrEqual(date),
        address: { id: '0xdcee70654261af21c44c093c300ed3bb97b78192' },
      },
      order: { timestamp: 'desc' as FindOptionsOrderValue },
    }),
    ctx.store.countBy(OETHAddress, { balance: MoreThanOrEqual(10n ** 17n) }),
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
  ].filter(Boolean)
  if (![lastApy, lastOeth].every((entity) => !!entity)) {
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
    dripperWETH: lastDripper?.weth || 0n,
    wrappedSupply: lastWrappedOETHHistory?.balance || 0n,
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
      tvl: lastCurve?.totalSupplyOwned || 0n,
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
      tvl: convertedSfrxEth,
      total: sfrxETH,
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
      value: convertedSfrxEth,
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
      amount: rETHRaw,
      price: rethRate,
      value: rETH,
    }),
    new OETHCollateralDailyStat({
      id: `${id}-FRXETH`,
      dailyStatId: id as unknown as OETHDailyStat,
      symbol: 'FRXETH',
      amount: sfrxETH,
      price: 1n,
      value: convertedSfrxEth,
    }),
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

FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '1 day') AND $1::timestamp

UNION ALL

-- Results for 7 days
SELECT '7 days' as period,
  SUM(fee_usd) as total_fees_usd,
  SUM(yield_usd - fee_usd) as total_yield_usd,
  SUM(fee_eth) as total_fees_eth,
  SUM(yield_eth - fee_eth) as total_yield_eth

FROM oeth_rebase
WHERE timestamp BETWEEN ($1::timestamp - interval '7 days') AND $1::timestamp

UNION ALL

-- Results for all time up to the end date
SELECT 'all time' as period,
  SUM(fee_usd) as total_fees_usd,
  SUM(yield_usd - fee_usd) as total_yield_usd,
  SUM(fee_eth) as total_fees_eth,
  SUM(yield_eth - fee_eth) as total_yield_eth

FROM oeth_rebase
WHERE timestamp <= $1::timestamp
`
