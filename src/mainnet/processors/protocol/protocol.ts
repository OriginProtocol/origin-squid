import dayjs from 'dayjs'
import { uniq } from 'lodash'
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
import { OETH_ADDRESS, OUSD_ADDRESS, arm } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'

const startDate = '2022-01-01'

export const protocolProcessor = defineProcessor({
  name: 'protocol',
  setup: (processor) => {
    processor.includeAllBlocks({ from: 15000000 })
  },
  process: async (ctx: Context) => {
    const otokenProducts = [
      { product: 'OUSD', processorId: 'ousd', otokenAddress: OUSD_ADDRESS },
      { product: 'OETH', processorId: 'oeth', otokenAddress: OETH_ADDRESS },
      { product: 'superOETHb', processorId: 'base', otokenAddress: baseAddresses.superOETHb.address },
    ]

    const armProducts = [{ product: 'ARM-WETH-stETH', processorId: 'mainnet', armAddress: arm.address }]

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
      dailyStat.earningTVL = sumBigIntBy(dateDetails, 'earningTVL')
      dailyStat.tvl = sumBigIntBy(dateDetails, 'tvl')
      dailyStat.revenue = sumBigIntBy(dateDetails, 'revenue')

      // Find overlapping TVL
      const superOETHbWrappedOETH = await ctx.store.findOne(StrategyBalance, {
        where: {
          strategy: baseAddresses.superOETHb.strategies.bridgedWOETH,
          timestamp: LessThanOrEqual(dayjs.utc(date).endOf('day').toDate()),
        },
        order: {
          timestamp: 'desc',
        },
      })
      const superOETHbWrappedOethBalance = superOETHbWrappedOETH?.balanceETH ?? 0n

      // Adjust TVL for overlapping strategy balance.
      dailyStat.tvl -= superOETHbWrappedOethBalance
      dailyStat.apy =
        dailyStat.tvl === 0n
          ? 0
          : dateDetails.reduce((acc, detail) => {
              // We lessen the OETH TVL for APY calculation since that APY is also included in Super OETHb.
              const tvl = detail.id === 'OETH' ? detail.tvl - superOETHbWrappedOethBalance : detail.tvl
              return acc + detail.apy * Number(tvl)
            }, 0) / Number(dailyStat.tvl)

      dailyStat.meta = {
        tvlAdjustments: superOETHbWrappedOETH
          ? [
              {
                name: 'Super OETHb Wrapped OETH Strategy',
                blockNumber: superOETHbWrappedOETH.blockNumber,
                timestamp: superOETHbWrappedOETH.timestamp,
                balanceETH: superOETHbWrappedOETH.balanceETH.toString(),
              },
            ]
          : [],
      }

      dailyStats.push(dailyStat)
    }
    await ctx.store.upsert(dailyStats)
  },
})

const getLatestProtocolDailyStat = async (ctx: Context) => {
  const latestProtocolDailyStat = await ctx.store.findOne(ProtocolDailyStat, {
    order: {
      date: 'desc',
    },
  })
  if (latestProtocolDailyStat) {
    return latestProtocolDailyStat
  }
}
const getLatestProtocolDailyStatDetail = async (ctx: Context, product: string) => {
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
    earningTVL: 0n,
    tvl: 0n,
    revenue: 0n,
    apy: 0,
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
    earningTVL: 0n,
    tvl: 0n,
    revenue: 0n,
    apy: 0,
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
    product: string
    otokenAddress: string
  },
) => {
  const last = await getLatestProtocolDailyStatDetail(ctx, product)
  const status = await ctx.store.findOne(ProcessingStatus, { where: { id: processorId } })
  if (!status) return []

  const details: ProtocolDailyStatDetail[] = []
  const dates = getDatesBetween(last?.date ?? startDate, getDateForTimestamp(status.timestamp.valueOf()))
  const dailyStats = await ctx.store.find(OTokenDailyStat, { where: { date: In(dates), otoken: otokenAddress } })
  for (const date of dates) {
    const otokenDailyStat = dailyStats.find((d) => d.date === date)
    if (!otokenDailyStat) {
      if (!last) continue
      return details
    }
    const detail = await getProtocolDailyStatDetail(ctx, date, product)
    detail.rateUSD = otokenDailyStat.rateUSD
    detail.earningTVL = (otokenDailyStat.rebasingSupply * otokenDailyStat.rateETH) / BigInt(10 ** 18)
    detail.tvl = (otokenDailyStat.totalSupply * otokenDailyStat.rateETH) / BigInt(10 ** 18)
    detail.revenue = (otokenDailyStat.fees * otokenDailyStat.rateETH) / BigInt(10 ** 18)
    detail.apy = otokenDailyStat.apy
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
    product: string
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
    detail.rateUSD = BigInt(Math.round(armDailyStat.rateUSD * 1e18))
    detail.earningTVL = armDailyStat.totalSupply
    detail.tvl = armDailyStat.totalSupply
    detail.revenue = armDailyStat.fees
    detail.apy = armDailyStat.apy
    details.push(detail)
  }
  return details
}
