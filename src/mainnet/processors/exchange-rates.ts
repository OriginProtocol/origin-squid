import { Context } from '@processor'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

export const from = 13000000

export const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  const blockFrequencyUpdate = blockFrequencyUpdater({ from, parallelProcessing: true })
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    await ensureExchangeRates(ctx, block, [['ETH', 'USD']])
  })
}