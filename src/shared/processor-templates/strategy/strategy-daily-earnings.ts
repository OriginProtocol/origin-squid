import dayjs from 'dayjs'
import { compact } from 'lodash'
import { Between, In, LessThan } from 'typeorm'

import { StrategyDailyYield, StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import { ETH_ADDRESS } from '../../../utils/addresses'
import { calculateAPY } from '../../../utils/calculateAPY'
import { lastExcept } from '../../../utils/utils'
import { ensureExchangeRates } from '../../post-processors/exchange-rates'
import {
  Currency,
  convertRate,
} from '../../post-processors/exchange-rates/currencies'
import { IStrategyData } from './strategy'

export const processStrategyDailyEarnings = async (
  ctx: Context,
  blocks: Block[],
  strategyData: IStrategyData,
) => {
  const results: StrategyDailyYield[] = []
  for (const block of blocks) {
    const day = dayjs.utc(block.header.timestamp).format('YYYY-MM-DD')
    const id = `${strategyData.address}:${ETH_ADDRESS}:${day}`
    // ctx.log.info(`processStrategyDailyEarnings ${block.header.height} ${id}`)

    // Get or create today's StrategyDailyYield.
    let { latest, current } = await getLatest(ctx, results, strategyData, id)
    if (!current) {
      current = new StrategyDailyYield({
        id,
        timestamp: dayjs.utc(block.header.timestamp).endOf('day').toDate(),
        blockNumber: block.header.height,
        strategy: strategyData.address,
        balance: latest?.balance ?? 0n,
        earnings: latest?.earnings ?? 0n,
        earningsChange: latest?.earningsChange ?? 0n,
        asset: ETH_ADDRESS,
        apr: latest?.apr ?? 0,
        apy: latest?.apy ?? 0,
      })
      results.push(current)
    }

    // Get the latest StrategyYield results.
    const yields = await ctx.store.find(StrategyYield, {
      where: {
        strategy: strategyData.address,
        asset: In(strategyData.assets),
        blockNumber: Between(latest?.blockNumber ?? 0, block.header.height),
      },
      order: { id: 'desc' },
    })

    // TODO: This is good except sometimes certain assets get yield while other's don't on a specific day.
    // So if for one of our assets this has no results, then we need to look back for whatever the last
    //  balance/earnings were so we can populate today's values properly.
    //  (since today's values are an aggregate of all assets)

    // Get ETH rates for all StrategyYield assets.
    const rates = await ensureExchangeRates(
      ctx,
      block,
      yields.map((y) => ['ETH', y.asset as Currency]),
    ).then(compact)

    // Convert into ETH values
    const ethBalance = yields.reduce(
      (sum, y) =>
        sum + convertRate(rates, 'ETH', y.asset as Currency, y.balance),
      0n,
    )
    const ethEarnings = yields.reduce(
      (sum, y) =>
        sum + convertRate(rates, 'ETH', y.asset as Currency, y.earnings),
      0n,
    )
    const ethEarningsChange = yields.reduce(
      (sum, y) =>
        sum + convertRate(rates, 'ETH', y.asset as Currency, y.earningsChange),
      0n,
    )

    // Apply ETH values
    current.balance = ethBalance
    current.earnings = ethEarnings
    current.earningsChange = ethEarningsChange

    // Calculate APY values
    if (latest) {
      // ctx.log.info(
      //   `Calculating APR: ${formatEther(latest.balance)} ${formatEther(
      //     current.earningsChange,
      //   )}`,
      // )
      const { apr, apy } = calculateAPY(
        latest.timestamp,
        current.timestamp,
        current.balance,
        current.balance + current.earningsChange,
      )
      current.apr = apr
      current.apy = apy
    }

    // ctx.log.info(current, `Daily Earnings: ${current.id}`)
  }
  await ctx.store.upsert(results)
}

const getLatest = async (
  ctx: Context,
  results: StrategyDailyYield[],
  strategyData: IStrategyData,
  id: string,
) => {
  let latest =
    lastExcept(results, id) ??
    (await ctx.store.findOne(StrategyDailyYield, {
      order: { id: 'desc' },
      where: {
        strategy: strategyData.address,
        id: LessThan(id),
      },
    }))
  let current = results.find((l) => l.id === id)
  return { latest, current, results }
}
