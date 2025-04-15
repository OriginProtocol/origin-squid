import { Context, EvmBatchProcessor, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'

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
