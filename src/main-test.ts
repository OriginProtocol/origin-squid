import 'tsconfig-paths/register'

import { run } from '@processor'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { priceMap } from '@shared/post-processors/exchange-rates/price-routing-mainnet'

if (require.main === module) {
  console.log('process:test running')
  run({
    chainId: 1,
    stateSchema: 'test-processor',
    processors: [
      {
        name: 'test',
        from: 20837855,
        setup: (p) => {
          p.includeAllBlocks({ from: 20837855 })
        },
        process: async (ctx) => {
          // Validate that we're getting otoken rates the way we want to.

          for (const pair of Object.keys(priceMap)) {
            const rate = await ensureExchangeRate(
              ctx,
              ctx.blocks[0],
              pair.split('_')[0] as CurrencySymbol,
              pair.split('_')[1] as CurrencySymbol,
            )
            console.log(`${pair} = ${Number(rate?.rate) / 1e18}`)
          }

          process.exit(0)
        },
      },
    ],
    postProcessors: [],
    validators: [],
  })
}
