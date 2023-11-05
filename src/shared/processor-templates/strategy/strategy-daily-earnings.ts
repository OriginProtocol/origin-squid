import dayjs from 'dayjs'
import { compact } from 'lodash'
import { Between, In, LessThan, LessThanOrEqual } from 'typeorm'

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
    const todayYields = await ctx.store.find(StrategyYield, {
      where: {
        strategy: strategyData.address,
        asset: In(strategyData.assets),
        blockNumber: Between(
          (latest?.blockNumber ?? 0) + 1,
          block.header.height,
        ),
      },
      order: { id: 'desc' },
    })

    let yields: StrategyYield[] = []
    await Promise.all(
      strategyData.assets.map(async (asset) => {
        const todayAssetYields = todayYields.filter((y) => y.asset === asset)
        if (todayAssetYields.length > 0) {
          yields.push(...todayAssetYields)
        } else {
          const latestAssetYield = await ctx.store.findOne(StrategyYield, {
            where: {
              strategy: strategyData.address,
              asset,
              blockNumber: LessThanOrEqual(block.header.height),
            },
            order: { id: 'desc' },
          })
          if (latestAssetYield) {
            yields.push(latestAssetYield)
          }
        }
      }),
    )

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

    // Sort so following `.find` actions get the most recent.
    yields.sort((a, b) => b.blockNumber - a.blockNumber)

    // Convert into ETH values
    const ethBalance = strategyData.assets.reduce((sum, asset) => {
      const strategyYield = yields.find((y) => y.asset === asset)
      return (
        sum +
        convertRate(
          rates,
          'ETH',
          asset as Currency,
          strategyYield?.balance ?? 0n,
        )
      )
    }, 0n)
    const ethEarnings = strategyData.assets.reduce((sum, asset) => {
      const strategyYield = yields.find((y) => y.asset === asset)
      return (
        sum +
        convertRate(
          rates,
          'ETH',
          asset as Currency,
          strategyYield?.earnings ?? 0n,
        )
      )
    }, 0n)

    const ethEarningsChange = todayYields.reduce(
      (sum, y) =>
        sum + convertRate(rates, 'ETH', y.asset as Currency, y.earningsChange),
      0n,
    )

    // Apply ETH values
    current.balance = ethBalance
    current.earnings = ethEarnings
    current.earningsChange = ethEarningsChange

    if (current.earnings < (latest?.earnings ?? 0n)) {
      ctx.log.info({ current, latest, yields })
      // throw new Error('how!??!?!')
    }

    // Calculate APY values
    if (latest) {
      // On Frax Staking if we only use `latest.balance` we get crazy APY.
      //   (only early on)
      // On Morpho Aave v2 if we only use `current.balance` we get 0 APY.
      // I've done `current.balance || latest?.balance` to try and balance out what we see.
      const { apr, apy } = calculateAPY(
        latest.timestamp,
        current.timestamp,
        current.balance || latest?.balance,
        (current.balance || latest?.balance) + current.earningsChange,
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
