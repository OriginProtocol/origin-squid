import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { getPositions } from '@templates/aerodrome/lp'
import { createOTokenProcessor } from '@templates/otoken'
import { createOTokenActivityProcessor } from '@templates/otoken/activity-processor/activity-processor'
import { aerodromePools, baseAddresses } from '@utils/addresses-base'

const otokenProcessor = createOTokenProcessor({
  from: 17819702,
  vaultFrom: 17819702,
  otokenAddress: baseAddresses.tokens.superOETHb,
  wotoken: {
    address: baseAddresses.tokens.wsuperOETHb,
    from: 18760018,
  },
  dripperAddress: baseAddresses.superOETHb.dripper,
  otokenVaultAddress: baseAddresses.superOETHb.vault,
  oTokenAssets: [
    { asset: baseAddresses.tokens.superOETHb, symbol: 'superOETHb' },
    {
      asset: baseAddresses.tokens.WETH,
      symbol: 'WETH',
    },
  ],
  getAmoSupply: async (ctx, height) => {
    const positions = await getPositions(
      ctx,
      height,
      aerodromePools['CL1-WETH/superOETHb'],
      baseAddresses.superOETHb.strategies.amo,
    )
    return positions.reduce((acc, position) => acc + BigInt(position.amount1) + BigInt(position.staked1), 0n)
  },
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
