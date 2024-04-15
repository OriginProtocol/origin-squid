import * as erc20 from '@abi/erc20'
import { StrategyBalance } from '@model'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { convertDecimals } from '@utils/utils'

import { Block, Context } from '../../processor'
import { IStrategyData } from './index'
import {
  processStrategyEarnings,
  setupStrategyEarnings,
} from './strategy-earnings'

export const setup = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  processor.includeAllBlocks({ from: strategyData.from })
  setupStrategyEarnings(processor, strategyData)
}

const trackers = new Map<string, ReturnType<typeof blockFrequencyUpdater>>()
export const process = async (ctx: Context, strategyData: IStrategyData) => {
  if (!trackers.has(strategyData.address)) {
    trackers.set(
      strategyData.address,
      blockFrequencyUpdater({ from: strategyData.from }),
    )
  }
  const blockFrequencyUpdate = trackers.get(strategyData.address)!
  const strategyBalances: StrategyBalance[] = []
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    const results = await getStrategyHoldings(ctx, block, strategyData)
    strategyBalances.push(...results)
  })
  await ctx.store.insert(strategyBalances)
  await processStrategyEarnings(ctx, strategyData, getStrategyBalances)
}

const getStrategyHoldings = async (
  ctx: Context,
  block: Block,
  strategyData: IStrategyData,
): Promise<StrategyBalance[]> => {
  const { assets, address } = strategyData
  const balances = await getStrategyBalances(ctx, block.header, strategyData)
  const promises = assets.map(async (asset) => {
    return new StrategyBalance({
      id: `${address}:${asset.address}:${block.header.height}`,
      strategy: address,
      asset: asset.address,
      balance: balances.find((b) => b.asset === asset.address)?.balance,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
    })
  })

  return await Promise.all(promises)
}

const getStrategyBalances = async (
  ctx: Context,
  block: {
    height: number
  },
  strategyData: IStrategyData,
) => {
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new erc20.Contract(ctx, block, asset.address)
      const balance = await contract.balanceOf(strategyData.address)
      return {
        address: strategyData.address,
        asset: asset.address,
        balance: convertDecimals(
          asset.decimals,
          strategyData.base.decimals,
          balance,
        ),
      }
    }),
  )
}
