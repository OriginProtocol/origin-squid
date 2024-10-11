import 'tsconfig-paths/register'

import { Context, run } from '@processor'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { priceMap } from '@shared/post-processors/exchange-rates/price-routing-mainnet'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { getCoingeckoData } from '@utils/coingecko2'

const testRate = {
  name: 'test',
  from: 20837855,
  setup: (p: EvmBatchProcessor) => {
    p.includeAllBlocks({ from: 20837855 })
  },
  process: async (ctx: Context) => {
    // Validate that we're getting otoken rates the way we want to.

    for (const [pair, [getPrice, decimals]] of Object.entries(priceMap)) {
      const rate = await ensureExchangeRate(
        ctx,
        ctx.blocks[0],
        pair.split('_')[0] as CurrencySymbol,
        pair.split('_')[1] as CurrencySymbol,
      )
      console.log(`${pair} = ${Number(rate?.rate) / 10 ** decimals}`)
    }

    process.exit(0)
  },
}

const testCoingecko = {
  name: 'test-coingecko',
  from: 20933088,
  setup: (p: EvmBatchProcessor) => {
    p.includeAllBlocks({ from: 20837855 })
  },
  process: async (ctx: Context) => {
    const ognData = await getCoingeckoData(ctx, {
      coinId: 'origin-protocol',
      vsCurrency: 'usd',
    })
    const ousdData = await getCoingeckoData(ctx, {
      coinId: 'origin-dollar',
      vsCurrency: 'usd',
    })
    const oethData = await getCoingeckoData(ctx, {
      coinId: 'origin-ether',
      vsCurrency: 'eth',
    })
    const superoethData = await getCoingeckoData(ctx, {
      coinId: 'super-oeth',
      vsCurrency: 'eth',
    })
    console.log('got all data OK')
    process.exit(0)
  },
}

if (require.main === module) {
  console.log('process:test running')
  run({
    chainId: 1,
    stateSchema: 'test-processor',
    processors: [
      // testRate,
      testCoingecko,
    ],
    postProcessors: [],
    validators: [],
  })
}
