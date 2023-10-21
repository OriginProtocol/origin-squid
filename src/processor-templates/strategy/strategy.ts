import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as initializableAbstractStrategy from '../../abi/initializable-abstract-strategy'
import { StrategyBalance } from '../../model'
import { Context } from '../../processor'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'

export const createStrategySetup =
  (from: number) => (processor: EvmBatchProcessor) => {
    processor.includeAllBlocks({ from })
  }

export const createStrategyProcessor = ({
  from,
  address,
  assets,
}: {
  from: number
  address: string
  assets: readonly string[]
}) => {
  const update = blockFrequencyUpdater({ from })
  let lastStrategyBalances = new Map<string, StrategyBalance>()
  return async (ctx: Context) => {
    const results = {
      strategyBalances: [] as StrategyBalance[],
    }
    await update(ctx, async (ctx, block) => {
      const contract = new initializableAbstractStrategy.Contract(
        ctx,
        block.header,
        address,
      )
      for (const asset of assets) {
        const lastStrategyBalance =
          lastStrategyBalances.get(asset) ??
          (await ctx.store.findOne(StrategyBalance, {
            where: { strategy: address, asset },
            order: {
              id: 'desc',
            },
          }))
        const balance = await contract.checkBalance(asset).catch((err) => {
          if (
            err.message === 'execution reverted: aToken does not exist' ||
            err.message === 'execution reverted: pToken does not exist' ||
            err.message === 'execution reverted: Unsupported asset' ||
            err.message === 'execution reverted: Unexpected asset address'
          ) {
            return undefined
          }
          ctx.log.info({ address, asset }, 'retrieving strategy balance failed')
          throw err
        })
        if (balance === undefined) continue
        if (!lastStrategyBalance || lastStrategyBalance.balance !== balance) {
          const strategyBalance = new StrategyBalance({
            id: `${address}:${asset}:${block.header.height}`,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            strategy: address,
            asset,
            balance,
          })
          results.strategyBalances.push(strategyBalance)
          lastStrategyBalances.set(asset, strategyBalance)
        }
      }
    })
    await ctx.store.insert(results.strategyBalances)
  }
}
