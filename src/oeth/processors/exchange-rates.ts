import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../processor'
import { ensureExchangeRates } from '../../shared/post-processors/exchange-rates'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'

export const from = 16933090 // OETH Deploy

export const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  const blockFrequencyUpdate = blockFrequencyUpdater({ from })
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    await ensureExchangeRates(ctx, block, [['ETH', 'USD']])
  })
}
