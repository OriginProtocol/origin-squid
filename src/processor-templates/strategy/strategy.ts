import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as initializableAbstractStrategy from '../../abi/initializable-abstract-strategy'
import { StrategyBalance } from '../../model'
import { Context } from '../../processor'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'

export const createStrategySetup =
  (from: number) => (processor: EvmBatchProcessor) => {
    processor.includeAllBlocks({ from })
  }

// Used by `src/processors/strategies/strategies.ts`
export const createStrategyProcessor = ({
  from,
  address,
  kind,
}: {
  from: number
  address: string
  kind: 'CurveAMO' | 'BalancerMetaStablePool' | 'BalancerComposableStablePool'
}) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const results = {
      strategyBalances: [] as StrategyBalance[],
    }
    await update(ctx, async (ctx, block) => {
      // TODO: Process
    })
    await ctx.store.insert(results.strategyBalances)
  }
}
