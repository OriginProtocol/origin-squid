import { Context } from '@processor'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const name = 'exchange-rates-base'

export const from = 16586878

export const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const process = async (ctx: Context) => {
  for (const block of ctx.frequencyBlocks) {
    if (block.header.height < from) continue
    await ensureExchangeRates(ctx, block, [
      ['AERO', 'USD'],
      ['OGN', 'USD'],
      ['OGN', 'ETH'],
      ['ETH', 'USD'],
      ['superOETHb', 'USD'],
    ])
  }
}
