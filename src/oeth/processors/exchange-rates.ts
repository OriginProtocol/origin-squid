import { Context, EvmBatchProcessor, blockFrequencyUpdater, defineProcessor } from '@originprotocol/squid-utils'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'

export const oethExchangeRatesProcessor = defineProcessor({
  name: 'oeth-exchange-rates',
  from: 16933090, // OETH Deploy
  setup: (processor: EvmBatchProcessor) => {
    processor.includeAllBlocks({ from: 16933090 })
  },
  process: async (ctx: Context) => {
    const blockFrequencyUpdate = blockFrequencyUpdater({ from: 16933090, parallelProcessing: true })
    await blockFrequencyUpdate(ctx, async (ctx, block) => {
      await ensureExchangeRates(ctx, block, [
        ['ETH', 'USD'],
        ['wOETH', 'OETH'],
      ])
    })
  },
})
