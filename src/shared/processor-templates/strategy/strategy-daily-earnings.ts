import dayjs from 'dayjs'
import { compact } from 'lodash'
import { Between, In, LessThan, LessThanOrEqual } from 'typeorm'

import { StrategyDailyYield, StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import { ETH_ADDRESS } from '../../../utils/addresses'
import { calculateAPY } from '../../../utils/calculateAPY'
import { lastExcept } from '../../../utils/utils'
import { IStrategyData } from './strategy'

export const processStrategyDailyEarnings = async (
  ctx: Context,
  blocks: Block[],
  strategyData: IStrategyData,
) => {
  const results: StrategyDailyYield[] = []
  for (const block of blocks) {
    if (block.header.height < strategyData.from) return
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
        asset: ETH_ADDRESS,
        blockNumber: Between(
          (latest?.blockNumber ?? 0) + 1,
          block.header.height,
        ),
      },
      order: { id: 'asc' },
    })

    let yields: StrategyYield[] = []
    if (todayYields.length > 0) {
      yields.push(...todayYields)
    } else {
      const latestAssetYield = await ctx.store.findOne(StrategyYield, {
        where: {
          strategy: strategyData.address,
          asset: ETH_ADDRESS,
          blockNumber: LessThanOrEqual(block.header.height),
        },
        order: { id: 'desc' },
      })
      if (latestAssetYield) {
        yields.push(latestAssetYield)
      }
    }

    // Sort so following `.find` actions get the most recent.
    yields.sort((a, b) => b.blockNumber - a.blockNumber)

    // Convert into ETH values
    const balance = yields[yields.length - 1]?.balance ?? 0n
    const earnings = yields[yields.length - 1]?.earnings ?? 0n
    const earningsChange = todayYields.reduce(
      (sum, y) => sum + y.earningsChange,
      0n,
    )

    // Apply ETH values
    current.balance = balance
    current.earnings = earnings
    current.earningsChange = earningsChange

    if (current.earnings < (latest?.earnings ?? 0n)) {
      ctx.log.info({ current, latest, yields }, 'earnings went down :(')
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
