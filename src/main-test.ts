import 'tsconfig-paths/register'

import { run } from '@processor'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { OETH_ADDRESS, OUSD_ADDRESS } from '@utils/addresses'

if (require.main === module) {
  run({
    chainId: 1,
    stateSchema: 'test-processor',
    processors: [
      {
        name: 'test',
        from: 19300000,
        setup: (p) => {
          p.includeAllBlocks({ from: 19300000 })
        },
        process: async (ctx) => {
          // Validate that we're getting otoken rates the way we want to.

          // OUSD
          // OUSD
          const OUSD_USD = await ensureExchangeRate(ctx, ctx.blocks[0], OUSD_ADDRESS, 'USD')
          const OUSD_ETH = await ensureExchangeRate(ctx, ctx.blocks[0], OUSD_ADDRESS, 'ETH')
          // OETH
          const OETH_USD = await ensureExchangeRate(ctx, ctx.blocks[0], OETH_ADDRESS, 'USD')
          const OETH_ETH = await ensureExchangeRate(ctx, ctx.blocks[0], OETH_ADDRESS, 'ETH')

          debugger
        },
      },
    ],
    postProcessors: [],
    validators: [],
  })
}
