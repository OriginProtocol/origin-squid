import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { LessThan } from 'typeorm'
import { formatEther } from 'viem'

import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import { StrategyBalance, StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import { blockFrequencyTracker } from '../../../utils/blockFrequencyUpdater'
import { IStrategyData } from './index'
import { processStrategyEarnings } from './strategy-earnings'

export const setup = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  processor.includeAllBlocks({ from: strategyData.from })
  processor.addLog({
    address: [strategyData.address],
    topic0: [
      abstractStrategyAbi.events.Deposit.topic,
      abstractStrategyAbi.events.Withdrawal.topic,
      abstractStrategyAbi.events.RewardTokenCollected.topic,
    ],
  })
}

export const process = async (ctx: Context, strategyData: IStrategyData) => {
  ctx.log.info(`NEW CONTEXT`)

  const shouldUpdate = blockFrequencyTracker({ from: strategyData.from })
  const strategyBalances: StrategyBalance[] = []
  const strategyYields = new Map<string, StrategyYield[]>()

  for (const block of ctx.blocks) {
    if (block.logs.length) {
      ctx.log.info(`NEW BLOCK: ${block.logs.length} logs`)
    }
    if (shouldUpdate(ctx, block)) {
      const results = await getStrategyHoldings(ctx, block, strategyData)
      strategyBalances.push(...results)
    }
  }
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
      id: `${address}:${asset}:${block.header.height}`,
      strategy: address,
      asset: asset,
      balance: balances.find((b) => b.asset === asset)?.balance,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
    })
  })

  return await Promise.all(promises)
}

const getStrategyBalances = async (
  ctx: Context,
  block: { height: number },
  strategyData: IStrategyData,
) => {
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new abstractStrategyAbi.Contract(
        ctx,
        block,
        strategyData.address,
      )
      const balance = await contract.checkBalance(asset)
      return { address: strategyData.address, asset, balance }
    }),
  )
}
