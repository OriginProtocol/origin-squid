import dayjs from 'dayjs'
import { compact, uniq } from 'lodash'
import { In, LessThanOrEqual } from 'typeorm'

import {
  ArmDailyStat,
  OTokenDailyStat,
  ProcessingStatus,
  ProtocolDailyStat,
  ProtocolDailyStatDetail,
  StrategyBalance,
} from '@model'
import {
  Context,
  defineProcessor,
  getDateForTimestamp,
  getDatesBetween,
  sumBigIntBy,
} from '@originprotocol/squid-utils'
import { getLatestExchangeRateForDate } from '@shared/post-processors/exchange-rates/exchange-rates'
import { baseAddresses } from '@utils/addresses-base'
import { plumeAddresses } from '@utils/addresses-plume'
import { ProductName, armProducts, otokenProducts } from '@utils/products'

const startDate = '2022-01-01'

export const protocolProcessor = defineProcessor({
  name: 'protocol',
  setup: (processor) => {
    processor.includeAllBlocks({ from: 15000000 })
  },
  process: async (ctx: Context) => {
    // Generate all product details
    let details = await Promise.all([
      ...otokenProducts.map((p) => getOTokenDetails(ctx, p)),
      ...armProducts.map((p) => getArmDetails(ctx, p)),
    ]).then((details) => details.flat())

    // Save product details
    await ctx.store.upsert(details)

    // Merge all product details into daily statistics
    const dailyStats = []

    // Get all details ever saved for the dates we've affected.
    // We must do this due to the asynchronous nature of processing with multiple processors.
    details = await ctx.store.findBy(ProtocolDailyStatDetail, {
      date: In(uniq(details.map((d) => d.date))),
    })

    const dates = uniq(details.map((d) => d.date))
    for (const date of dates) {
      const dateDetails = details.filter((d) => d.date === date)
      const dailyStat = await getProtocolDailyStat(ctx, date)
      dailyStat.rateUSD = await getLatestExchangeRateForDate(ctx, 'ETH_USD', dailyStat.timestamp).then(
        (rate) => (rate?.rate ?? 0n) * 10n ** 10n,
      )
      dailyStat.earningTvl = sumBigIntBy(dateDetails, 'earningTvl')
      dailyStat.tvl = sumBigIntBy(dateDetails, 'tvl') - sumBigIntBy(dateDetails, 'inheritedTvl')
      dailyStat.revenue = sumBigIntBy(dateDetails, 'revenue')
      dailyStat.yield = sumBigIntBy(dateDetails, 'yield') + dailyStat.revenue

      const apyYield = dailyStat.yield - dailyStat.revenue
      dailyStat.apy = dailyStat.earningTvl !== 0n ? (Number(apyYield) / Number(dailyStat.earningTvl)) * 365 : 0

      dailyStats.push(dailyStat)
    }
    await ctx.store.upsert(dailyStats)
  },
})

const getLatestProtocolDailyStatDetail = async (ctx: Context, product: ProductName) => {
  const latestProtocolDailyStatDetail = await ctx.store.findOne(ProtocolDailyStatDetail, {
    order: {
      date: 'desc',
    },
    where: {
      product,
    },
  })
  if (latestProtocolDailyStatDetail) {
    return latestProtocolDailyStatDetail
  }
}

const getProtocolDailyStat = async (ctx: Context, date: string) => {
  let dailyStat = await ctx.store.findOne(ProtocolDailyStat, {
    where: { date },
  })
  if (dailyStat) {
    return dailyStat
  }
  return new ProtocolDailyStat({
    id: date,
    date,
    timestamp: dayjs.utc(date).endOf('day').toDate(),
    rateUSD: 0n,
    earningTvl: 0n,
    tvl: 0n,
    yield: 0n,
    revenue: 0n,
    apy: 0,
    meta: {},
  })
}
const getProtocolDailyStatDetail = async (ctx: Context, date: string, product: string) => {
  const dailyStatDetail = await ctx.store.findOne(ProtocolDailyStatDetail, {
    where: { date, product },
    order: { date: 'desc' },
  })
  if (dailyStatDetail) {
    return dailyStatDetail
  }
  return new ProtocolDailyStatDetail({
    id: `${date}-${product}`,
    date,
    product,
    timestamp: dayjs.utc(date).endOf('day').toDate(),
    rateUSD: 0n,
    earningTvl: 0n,
    tvl: 0n,
    yield: 0n,
    revenue: 0n,
    apy: 0,
    inheritedTvl: 0n,
    inheritedYield: 0n,
    inheritedRevenue: 0n,
    bridgedTvl: 0n,
  })
}

const getOTokenDetails = async (
  ctx: Context,
  {
    processorId,
    product,
    otokenAddress,
  }: {
    processorId: string
    product: ProductName
    otokenAddress: string
  },
) => {
  const last = await getLatestProtocolDailyStatDetail(ctx, product)

  // Since we depend on superOETHb and superOETHp, we need to continue updating
  //  our product's details until our dependencies are all caught up.
  const lastOETH = await getLatestProtocolDailyStatDetail(ctx, 'OETH')
  const lastSuperOETHb = await getLatestProtocolDailyStatDetail(ctx, 'superOETHb')
  const lastSuperOETHp = await getLatestProtocolDailyStatDetail(ctx, 'superOETHp')
  const lastDates = compact([last?.date ?? startDate, lastOETH?.date, lastSuperOETHb?.date, lastSuperOETHp?.date])

  const oldestDate = lastDates.reduce((min, d) => (d < min ? d : min), lastDates[0])

  const status = await ctx.store.findOne(ProcessingStatus, { where: { id: processorId } })
  if (!status) return []

  const details: ProtocolDailyStatDetail[] = []

  const dates = getDatesBetween(oldestDate, getDateForTimestamp(status.timestamp.valueOf()))
  const dailyStats = await ctx.store.find(OTokenDailyStat, { where: { date: In(dates), otoken: otokenAddress } })
  for (const date of dates) {
    const otokenDailyStat = dailyStats.find((d) => d.date === date)
    if (!otokenDailyStat) {
      if (!last) continue
      return details
    }
    const detail = await getProtocolDailyStatDetail(ctx, date, product)
    const eth = (value: bigint) => (value * otokenDailyStat.rateETH) / BigInt(10 ** 18)
    detail.rateUSD = otokenDailyStat.rateUSD
    detail.earningTvl = eth(otokenDailyStat.rebasingSupply)
    detail.tvl = eth(otokenDailyStat.totalSupply - (otokenDailyStat.amoSupply ?? 0n))
    detail.supply = eth(otokenDailyStat.totalSupply)
    detail.yield = eth(otokenDailyStat.yield + otokenDailyStat.fees)
    detail.revenue = eth(otokenDailyStat.fees)
    detail.apy = otokenDailyStat.apy
    detail.inheritedTvl = 0n
    detail.inheritedYield = 0n
    detail.inheritedRevenue = 0n
    detail.bridgedTvl = 0n

    const getLatestStrategyBalance = async (ctx: Context, strategy: string, date: string) => {
      return await ctx.store.findOne(StrategyBalance, {
        where: {
          strategy,
          timestamp: LessThanOrEqual(dayjs.utc(date).endOf('day').toDate()),
        },
        order: {
          timestamp: 'desc',
        },
      })
    }

    if (detail.product === 'OETH') {
      // Pull superOETHp and superOETHb overlapping details.
      const superOETHbWrappedOETH = await getLatestStrategyBalance(
        ctx,
        baseAddresses.superOETHb.strategies.bridgedWOETH,
        date,
      )
      const superOETHpWrappedOETH = await getLatestStrategyBalance(
        ctx,
        plumeAddresses.superOETHp.strategies.bridgedWOETH,
        date,
      )

      detail.inheritedTvl = (superOETHbWrappedOETH?.balanceETH ?? 0n) + (superOETHpWrappedOETH?.balanceETH ?? 0n)
      detail.inheritedYield = detail.earningTvl !== 0n ? (detail.yield * detail.inheritedTvl) / detail.earningTvl : 0n
      detail.inheritedRevenue =
        detail.earningTvl !== 0n ? (detail.revenue * detail.inheritedTvl) / detail.earningTvl : 0n
      detail.bridgedTvl = (superOETHbWrappedOETH?.balanceETH ?? 0n) + (superOETHpWrappedOETH?.balanceETH ?? 0n)
    } else if (detail.product === 'superOETHb') {
      const detailOETH = await getProtocolDailyStatDetail(ctx, date, 'OETH')
      const superOETHbWrappedOETH = await getLatestStrategyBalance(
        ctx,
        baseAddresses.superOETHb.strategies.bridgedWOETH,
        date,
      )
      const woethBalance = superOETHbWrappedOETH?.balanceETH ?? 0n
      detail.bridgedTvl = woethBalance
      detail.revenue += ((detailOETH?.revenue ?? 0n) * woethBalance) / detail.tvl
    } else if (detail.product === 'superOETHp') {
      const detailOETH = await getProtocolDailyStatDetail(ctx, date, 'OETH')
      const superOETHpWrappedOETH = await getLatestStrategyBalance(
        ctx,
        plumeAddresses.superOETHp.strategies.bridgedWOETH,
        date,
      )
      const woethBalance = superOETHpWrappedOETH?.balanceETH ?? 0n
      detail.bridgedTvl = woethBalance
      detail.revenue += ((detailOETH?.revenue ?? 0n) * woethBalance) / detail.tvl
    }

    details.push(detail)
  }
  return details
}
const getArmDetails = async (
  ctx: Context,
  {
    processorId: statusId,
    product,
    armAddress,
  }: {
    processorId: string
    product: ProductName
    armAddress: string
  },
) => {
  const last = await getLatestProtocolDailyStatDetail(ctx, product)
  const status = await ctx.store.findOne(ProcessingStatus, { where: { id: statusId } })
  if (!status) return []

  const details: ProtocolDailyStatDetail[] = []
  const dates = getDatesBetween(last?.date ?? startDate, getDateForTimestamp(status.timestamp.valueOf()))
  const dailyStats = await ctx.store.find(ArmDailyStat, { where: { date: In(dates), address: armAddress } })
  for (const date of dates) {
    const armDailyStat = dailyStats.find((d) => d.date === date)
    if (!armDailyStat) {
      if (!last) continue
      return details
    }
    const detail = await getProtocolDailyStatDetail(ctx, date, product)
    const eth = (value: bigint) => (value * BigInt(Math.round(armDailyStat.rateETH * 1e18))) / BigInt(10 ** 18)
    detail.rateUSD = BigInt(Math.round(armDailyStat.rateUSD * 1e18))
    detail.earningTvl = eth(armDailyStat.totalAssets)
    detail.tvl = eth(armDailyStat.totalAssets)
    detail.supply = eth(armDailyStat.totalSupply)
    detail.yield = eth(armDailyStat.yield + armDailyStat.fees)
    detail.revenue = eth(armDailyStat.fees)
    detail.apy = armDailyStat.apy
    details.push(detail)
  }
  return details
}
