import { AeroRate } from '@model'
import { Context, Processor } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { getAerodromeRates } from '@templates/aerodrome/prices'
import { baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

const from = 17819702
const frequencyUpdater = blockFrequencyUpdater({ from })

const tokens = [
  [baseAddresses.tokens.superOETHb, baseAddresses.tokens.USDC],
  [baseAddresses.tokens.superOETHb, baseAddresses.tokens.WETH],
  [baseAddresses.tokens.OGN, baseAddresses.tokens.USDC],
]

export const aerodromePrices: Processor = {
  from,
  name: 'Aerodrome Prices',
  setup(processor: EvmBatchProcessor) {
    processor.includeAllBlocks({ from })
  },
  async process(ctx: Context) {
    const prices: AeroRate[] = []
    await frequencyUpdater(ctx, async (ctx, block) => {
      for (const [from, to] of tokens) {
        const price = await getAerodromeRates(ctx, block, from, to)
        prices.push(
          new AeroRate({
            id: `${ctx.chain.id}:${block.header.height}:${from}:${to}`,
            chainId: ctx.chain.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            from,
            to,
            price,
          }),
        )
      }
    })
    await ctx.store.insert(prices)
  },
}
