import { Context, EvmBatchProcessor, defineProcessor } from '@originprotocol/squid-utils'
import { createCurveInitializer, createCurveProcessor, createCurveSetup } from '@templates/curve'
import { mainnetTokens } from '@utils/addresses'

const ousdResetFrom = 11585978
const oethDeployFrom = 16933090

const pools: (Parameters<typeof createCurveInitializer>['0'] & Parameters<typeof createCurveProcessor>['0'])[] = [
  // Curve (OUSD)
  {
    name: 'ThreePool',
    address: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7'.toLowerCase(),
    from: Math.max(10809473, ousdResetFrom),
    tokens: [mainnetTokens.DAI, mainnetTokens.USDC, mainnetTokens.USDT],
  },
  {
    name: 'OUSDMetapool',
    address: '0x87650d7bbfc3a9f10587d7778206671719d9910d'.toLowerCase(),
    from: Math.max(12860905, ousdResetFrom),
    tokens: [mainnetTokens.OUSD, mainnetTokens.CRV3],
  },
  {
    name: 'LUSDMetapool',
    address: '0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca'.toLowerCase(),
    from: Math.max(12184843, ousdResetFrom),
    tokens: [mainnetTokens.LUSD, mainnetTokens.CRV3],
  },
]

const initializers = pools.map((pool) => createCurveInitializer(pool))
const processors = pools.map((pool) => createCurveProcessor(pool))

export const ousdCurveProcessor = defineProcessor({
  name: 'curve',
  from: Math.min(ousdResetFrom, oethDeployFrom),
  setup: (processor: EvmBatchProcessor) => {
    for (const pool of pools) {
      createCurveSetup(pool.from, processor)
    }
  },
  initialize: async (ctx: Context) => {
    await Promise.all(initializers.map((p) => p(ctx)))
  },
  process: async (ctx: Context) => {
    await Promise.all(processors.map((p) => p(ctx)))
  },
})
