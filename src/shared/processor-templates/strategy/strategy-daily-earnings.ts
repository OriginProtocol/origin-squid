import dayjs from 'dayjs'
import { Between, LessThan, LessThanOrEqual } from 'typeorm'
import { parseEther } from 'viem'

import { StrategyDailyYield, StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import { calculateAPY } from '../../../utils/calculateAPY'
import { lastExcept, max } from '../../../utils/utils'
import { IStrategyData } from './strategy'

const eth1 = 1000000000000000000n

export const processStrategyDailyEarnings = async (
  ctx: Context,
  blocks: Block[],
  strategyData: IStrategyData,
) => {
  const results: StrategyDailyYield[] = []
  for (const block of blocks) {
    if (block.header.height < strategyData.from) return
    const day = dayjs.utc(block.header.timestamp).format('YYYY-MM-DD')
    const id = `${strategyData.address}:${strategyData.base.address}:${day}`
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
        balanceWeight: latest?.balanceWeight ?? 1,
        earnings: latest?.earnings ?? 0n,
        earningsChange: latest?.earningsChange ?? 0n,
        asset: strategyData.base.address,
        apr: latest?.apr ?? 0,
        apy: latest?.apy ?? 0,
      })
      results.push(current)
    }

    // Get the latest StrategyYield results.
    const todayYields = await ctx.store.find(StrategyYield, {
      where: {
        strategy: strategyData.address,
        asset: strategyData.base.address,
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
          asset: strategyData.base.address,
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

    const balance = max(yields.map((y) => y.balance)) // Use the highest balance in the last day. (conservative approach)
    const balanceWeight = // Use the lowest balance weight in the last day. (conservative approach)
      Math.min(1, ...yields.map((y) => y.balanceWeight))

    // The sum of perpetual earnings, so we want to use whatever is latest.
    const earnings = yields[0]?.earnings ?? 0n
    // The sum of the earnings change per record.
    const earningsChange = todayYields.reduce(
      (sum, y) => sum + y.earningsChange,
      0n,
    )

    // Apply ETH values
    current.balance = balance
    current.balanceWeight = balanceWeight
    current.earnings = earnings
    current.earningsChange = earningsChange

    if (current.earnings < (latest?.earnings ?? 0n)) {
      ctx.log.info('earnings went down :(')
      // throw new Error('how!??!?!')
    }

    // Calculate APY values
    if (latest) {
      // The use of `balanceWeight` is for the Curve AMO ETH+OETH Strategy
      // It is an attempt at excluding OETH from the rate calculations.
      const yieldBalance =
        (max([current.balance, latest.balance]) * // Use the max of either of these two for more realistic APY values.
          parseEther(balanceWeight.toString())) /
        eth1

      const { apr, apy } = calculateAPY(
        latest.timestamp,
        current.timestamp,
        yieldBalance,
        yieldBalance + current.earningsChange,
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
        asset: strategyData.base.address,
        id: LessThan(id),
      },
    }))
  let current = results.find((l) => l.id === id)
  return { latest, current, results }
}
