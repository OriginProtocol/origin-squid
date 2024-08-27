import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { createOTokenProcessor } from '@templates/otoken'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { baseAddresses } from '@utils/addresses-base'

const otokenProcessor = createOTokenProcessor({
  from: 17819702,
  vaultFrom: 17819702,
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotoken: {
    address: baseAddresses.tokens.wsuperOETHb,
    from: 18760018,
  },
  otokenVaultAddress: baseAddresses.superOETHb.vault,
  oTokenAssets: [
    { asset: baseAddresses.tokens.superOETHb, symbol: 'superOETHb' },
    {
      asset: baseAddresses.tokens.WETH,
      symbol: 'WETH',
    },
  ],
  upgrades: {
    rebaseOptEvents: false,
  },
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: 17819702,
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotokenAddress: baseAddresses.tokens.wsuperOETHb,
  vaultAddress: baseAddresses.superOETHb.vault,
  cowSwap: false,
})

export const superOETHb = {
  from: Math.min(otokenProcessor.from, otokenActivityProcessor.from),
  setup: (processor: EvmBatchProcessor) => {
    otokenProcessor.setup(processor)
    otokenActivityProcessor.setup(processor)
  },
  process: async (ctx: Context) => {
    await Promise.all([otokenProcessor.process(ctx), otokenActivityProcessor.process(ctx)])
  },
}
