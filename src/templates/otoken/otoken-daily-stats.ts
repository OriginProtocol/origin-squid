import dayjs from 'dayjs'
import { findLast } from 'lodash'
import { Between, LessThanOrEqual } from 'typeorm'
import { formatUnits } from 'viem'

import * as otokenAbi from '@abi/otoken'
import * as otokenDripper from '@abi/otoken-dripper'
import * as otokenVault from '@abi/otoken-vault'
import * as wotokenAbi from '@abi/woeth'
import { OToken, OTokenAPY, OTokenDailyStat, OTokenRebase } from '@model'
import { Block, Context } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { Currency, CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'

import { OTokenEntityProducer } from './otoken-entity-producer'

/**
 * For sake of efficiency, we only want to update the daily stats if the block is within 20 seconds of the hourly crossover or if there has been recent activity on the OToken.
 */
export const processOTokenDailyStats = async (
  ctx: Context,
  params: {
    from: number
    otokenAddress: string
    otokens: OToken[]
    apies: OTokenAPY[]
    rebases: OTokenRebase[]
    balances: Map<string, bigint>
    dailyStats: Map<string, { block: Block; entity: OTokenDailyStat }>
    wotoken?: {
      address: string
      from: number
    }
    dripper?: {
      vaultDripper: boolean
      address: string
      from: number
      to?: number
      token: string
    }[]
    getAmoSupply: (ctx: Context, height: number) => Promise<bigint>
    producer: OTokenEntityProducer
    accountsOverThresholdMinimum: bigint
    forceUpdate: boolean
  },
) => {
  // Daily Stats
  // Whatever days we've just crossed over, let's update their respective daily stat entry using the last block seen at that time.
  for (const { block, entity } of params.dailyStats.values()) {
    if (block.header.height < params.from) continue
    const blockDate = new Date(block.header.timestamp)

    // Only update if we're within 20 seconds of the end of the hour (or force update is enabled)
    const secondsUntilHourEnd = dayjs.utc(blockDate).endOf('hour').diff(dayjs.utc(blockDate), 'seconds')
    if (!params.forceUpdate && secondsUntilHourEnd >= 20) continue

    const startOfDay = dayjs.utc(blockDate).startOf('day').toDate()
    const getDripperAvailableFunds = async () => {
      if (!params.dripper) return 0n
      const dripper = params.dripper.find(
        (d) => d.from <= block.header.height && (!d.to || d.to >= block.header.height),
      )
      if (dripper) {
        if (dripper.vaultDripper) {
          const vaultContract = new otokenVault.Contract(ctx, block.header, dripper.address)
          const otokenContract = new otokenAbi.Contract(ctx, block.header, params.otokenAddress)
          const [totalValue, totalSupply] = await Promise.all([
            vaultContract.totalValue(),
            otokenContract.totalSupply(),
          ])
          return totalValue - totalSupply
        } else {
          const dripperContract = new otokenDripper.Contract(ctx, block.header, dripper.address)
          return await dripperContract.availableFunds()
        }
      }
      return 0n
    }
    const wotokenContract =
      params.wotoken && block.header.height >= params.wotoken.from
        ? new wotokenAbi.Contract(ctx, block.header, params.wotoken.address)
        : null

    const asyncStartTime = Date.now()
    const [
      otokenObject,
      apy,
      rebases,
      rateETH,
      rateUSD,
      dripperWETH,
      amoSupply,
      wrappedSupply,
      wrappedRate,
      rateNative,
    ] = await Promise.all([
      (async () => {
        let otokenObject = findLast(params.otokens, (o) => o.timestamp <= blockDate)
        if (!otokenObject) {
          otokenObject = await ctx.store.findOne(OToken, {
            where: {
              chainId: ctx.chain.id,
              otoken: params.otokenAddress,
              timestamp: LessThanOrEqual(blockDate),
            },
            order: { timestamp: 'desc' },
          })
        }
        return otokenObject
      })(),
      (async () => {
        let apy = findLast(params.apies, (apy) => apy.timestamp >= startOfDay && apy.timestamp <= blockDate)
        if (!apy) {
          apy = await ctx.store.findOne(OTokenAPY, {
            order: { timestamp: 'desc' },
            where: { chainId: ctx.chain.id, otoken: params.otokenAddress, timestamp: Between(startOfDay, blockDate) },
          })
          if (!apy) {
            apy = await params.producer.getOrCreateAPYEntity({ block: block.header })
          }
        }
        return apy
      })(),
      (async () => {
        let rebases = params.rebases.filter((rebase) => rebase.timestamp >= startOfDay && rebase.timestamp <= blockDate)
        rebases.push(
          ...(await ctx.store.find(OTokenRebase, {
            order: { timestamp: 'desc' },
            where: {
              chainId: ctx.chain.id,
              otoken: params.otokenAddress,
              timestamp: Between(startOfDay, blockDate),
            },
          })),
        )
        return rebases
      })(),
      ensureExchangeRate(ctx, block, params.otokenAddress as CurrencyAddress, 'ETH').then((a) => a?.rate ?? 0n),
      ensureExchangeRate(ctx, block, params.otokenAddress as CurrencyAddress, 'USD').then((a) => a?.rate ?? 0n),
      getDripperAvailableFunds(),
      params.getAmoSupply(ctx, block.header.height),
      wotokenContract ? wotokenContract.totalSupply() : 0n,
      wotokenContract ? wotokenContract.previewRedeem(10n ** 18n) : 0n,
      ensureExchangeRate(
        ctx,
        block,
        params.otokenAddress as CurrencyAddress,
        ctx.chain.nativeCurrency.symbol as Currency,
      ).then((a) => a?.rate ?? 0n),
    ])
    if (process.env.DEBUG_PERF === 'true') {
      ctx.log.info(`getOTokenDailyStat async calls took ${Date.now() - asyncStartTime}ms`)
    }

    if (!otokenObject) continue

    entity.totalSupply = otokenObject.totalSupply ?? 0n
    entity.nonRebasingSupply = otokenObject.nonRebasingSupply ?? 0n
    entity.rebasingSupply = otokenObject.rebasingSupply ?? 0n

    if (apy) {
      entity.apr = apy.apr
      entity.apy = apy.apy
      entity.apy7 = apy.apy7DayAvg
      entity.apy14 = apy.apy14DayAvg
      entity.apy30 = apy.apy30DayAvg
    }

    entity.yield = rebases.reduce((sum, current) => sum + current.yield - current.fee, 0n)
    // There was a time when this was considered to be used, but I think we will *not* do that now.
    // Leaving it here for now...
    // let yieldSentEvents: OTokenHarvesterYieldSent[] = []
    // if (params.harvester?.yieldSent) {
    //   yieldSentEvents = result.harvesterYieldSent.filter(
    //     (event) => event.timestamp >= startOfDay && event.timestamp <= blockDate,
    //   )
    //   yieldSentEvents.push(
    //     ...(await ctx.store.find(OTokenHarvesterYieldSent, {
    //       order: { timestamp: 'desc' },
    //       where: {
    //         chainId: ctx.chain.id,
    //         otoken: params.otokenAddress,
    //         timestamp: Between(startOfDay, blockDate),
    //       },
    //     })),
    //   )
    // }
    entity.fees = rebases.reduce((sum, current) => sum + current.fee, 0n)

    const lastDayString = dayjs(block.header.timestamp).subtract(1, 'day').toISOString().substring(0, 10)
    const lastId = `${ctx.chain.id}-${params.otokenAddress}-${lastDayString}`
    const last = params.dailyStats.get(lastId)?.entity ?? (await ctx.store.get(OTokenDailyStat, lastId))
    entity.cumulativeYield = (last?.cumulativeYield ?? 0n) + entity.yield
    entity.cumulativeFees = (last?.cumulativeFees ?? 0n) + entity.fees

    entity.rateETH = rateETH
    entity.rateUSD = rateUSD
    entity.rateNative = rateNative
    entity.amoSupply = amoSupply

    entity.dripperWETH = dripperWETH
    entity.marketCapUSD = +formatUnits(entity.totalSupply * entity.rateUSD, 18)
    entity.wrappedSupply = wrappedSupply
    entity.rateWrapped = wrappedRate
    entity.accountsOverThreshold = Array.from(params.balances.values()).filter(
      (balance) => balance >= params.accountsOverThresholdMinimum,
    ).length
    ctx.log.info(`Updated OTokenDailyStat: ${entity.id}`)
  }
}

export const getOTokenDailyStat = async (
  ctx: Context,
  block: Block,
  otokenAddress: string,
  cache: Map<string, { block: Block; entity: OTokenDailyStat }>,
) => {
  const dayString = new Date(block.header.timestamp).toISOString().substring(0, 10)
  const id = `${ctx.chain.id}-${otokenAddress}-${dayString}`
  let entity = cache.get(id)?.entity
  if (!entity) {
    entity = await ctx.store.get(OTokenDailyStat, id)
  }
  if (!entity) {
    entity = new OTokenDailyStat({
      id,
      chainId: ctx.chain.id,
      timestamp: new Date(block.header.timestamp),
      date: dayString,
      blockNumber: block.header.height,
      otoken: otokenAddress,

      apr: 0,
      apy: 0,
      apy7: 0,
      apy14: 0,
      apy30: 0,

      rateUSD: 0n,
      rateETH: 0n,
      rateNative: 0n,

      totalSupply: 0n,
      rebasingSupply: 0n,
      nonRebasingSupply: 0n,
      wrappedSupply: 0n,
      rateWrapped: 0n,

      amoSupply: 0n,
      dripperWETH: 0n,

      yield: 0n,
      fees: 0n,
      cumulativeYield: 0n,
      cumulativeFees: 0n,

      marketCapUSD: 0,
      accountsOverThreshold: 0,
    })
  }
  cache.set(entity.id, { block, entity })
  entity.timestamp = new Date(block.header.timestamp)
  entity.blockNumber = block.header.height
  return entity
}
