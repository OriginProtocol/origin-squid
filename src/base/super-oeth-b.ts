import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { createOTokenProcessor } from '@templates/otoken'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { baseAddresses } from '@utils/addresses-base'

const otokenProcessor = createOTokenProcessor({
  from: 17819702,
  vaultFrom: 17819702,
  otokenAddress: baseAddresses.superOETHb,
  wotokenAddress: baseAddresses.wsuperOETHb,
  otokenVaultAddress: baseAddresses.superOETHbVault,
  oTokenAssets: [
    { asset: baseAddresses.superOETHb, symbol: 'superOETHb' },
    {
      asset: baseAddresses.WETH,
      symbol: 'WETH',
    },
  ],
  upgrades: {
    rebaseOptEvents: false,
  },
})

const otokenActivityProcessor = createOTokenActivityProcessor({
  from: 17819702,
  otokenAddress: baseAddresses.superOETHb,
  wotokenAddress: baseAddresses.wsuperOETHb,
  vaultAddress: baseAddresses.superOETHbVault,
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
