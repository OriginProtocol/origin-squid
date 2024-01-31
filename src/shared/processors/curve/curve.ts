import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../../processor'
import { tokens } from '../../../utils/addresses'
import {
  createCurveInitializer,
  createCurveProcessor,
  createCurveSetup,
} from '../../processor-templates/curve'

const ousdResetFrom = 11585978
const oethDeployFrom = 16933090

export const from = Math.min(ousdResetFrom, oethDeployFrom)

export const curvePools: (Parameters<typeof createCurveInitializer>['0'] &
  Parameters<typeof createCurveProcessor>['0'])[] = [
  // Curve (OUSD)
  {
    name: 'ThreePool',
    address: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7'.toLowerCase(),
    from: Math.max(10809473, ousdResetFrom),
    tokens: [tokens.DAI, tokens.USDC, tokens.USDT],
  },
  {
    name: 'OUSDMetapool',
    address: '0x87650d7bbfc3a9f10587d7778206671719d9910d'.toLowerCase(),
    from: Math.max(12860905, ousdResetFrom),
    tokens: [tokens.OUSD, tokens.CRV3],
  },
  {
    name: 'LUSDMetapool',
    address: '0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca'.toLowerCase(),
    from: Math.max(12184843, ousdResetFrom),
    tokens: [tokens.LUSD, tokens.CRV3],
  },

  // Curve (OETH)
  {
    name: 'factory-v2-298: ETH/OETH',
    address: '0x94B17476A93b3262d87B9a326965D1E91f9c13E7'.toLowerCase(),
    from: Math.max(17130500, oethDeployFrom),
    tokens: [tokens.ETH, tokens.OETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'factory-crvusd-15: WETH/frxETH',
    address: '0x9c3b46c0ceb5b9e304fcd6d88fc50f7dd24b31bc',
    from: Math.max(17944778, oethDeployFrom),
    tokens: [tokens.WETH, tokens.frxETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'steth: ETH/stETH',
    address: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
    from: Math.max(11592551, oethDeployFrom),
    tokens: [tokens.ETH, tokens.stETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'stETH-ng: ETH/stETH',
    address: '0x21e27a5e5513d6e65c4f830167390997aa84843a',
    from: Math.max(17281617, oethDeployFrom),
    tokens: [tokens.ETH, tokens.stETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'frxeth: ETH/frxETH',
    address: '0xa1f8a6807c402e4a15ef4eba36528a3fed24e577',
    from: Math.max(15741010, oethDeployFrom),
    tokens: [tokens.ETH, tokens.frxETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'factory-crypto-210: ETH/rETH',
    address: '0x0f3159811670c117c372428d4e69ac32325e4d0f',
    from: Math.max(16615906, oethDeployFrom),
    tokens: [tokens.ETH, tokens.rETH],
    version_get_dy: 'uint256',
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'factory-v2-274: stETH/frxETH',
    address: '0x4d9f9d15101eec665f77210cb999639f760f831e',
    from: Math.max(16683219, oethDeployFrom),
    tokens: [tokens.stETH, tokens.frxETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'factory-v2-117: WETH/stETH',
    address: '0x828b154032950c8ff7cf8085d841723db2696056',
    from: Math.max(14759666, oethDeployFrom),
    tokens: [tokens.WETH, tokens.stETH],
    ratesToPull: [{ i: 1n, j: 0n, dx: 1_000000000_000000000n }],
  },
  {
    name: 'factory-v2-89: rETH/wstETH',
    address: '0x447ddd4960d9fdbf6af9a790560d0af76795cb08',
    from: Math.max(14258216, oethDeployFrom),
    tokens: [tokens.rETH, tokens.wstETH],
    ratesToPull: [
      { i: 0n, j: 1n, dx: 1_000000000_000000000n },
      { i: 1n, j: 0n, dx: 1_000000000_000000000n },
    ],
  },
  {
    name: 'factory-crypto-218: rETH/frxETH',
    address: '0xe7c6e0a739021cdba7aac21b4b728779eef974d9',
    from: Math.max(16684327, oethDeployFrom),
    tokens: [tokens.rETH, tokens.frxETH],
    version_get_dy: 'uint256',
    ratesToPull: [
      { i: 0n, j: 1n, dx: 1_000000000_000000000n },
      { i: 1n, j: 0n, dx: 1_000000000_000000000n },
    ],
  },
  {
    name: 'factory-tricrypto-14: wstETH/rETH/sfrxETH',
    address: '0x2570f1bd5d2735314fc102eb12fc1afe9e6e7193',
    from: Math.max(18148430, oethDeployFrom),
    tokens: [tokens.wstETH, tokens.rETH, tokens.sfrxETH],
    ratesToPull: [
      // { i: 0n, j: 1n, dx: 1_000000000_000000000n },
      // { i: 0n, j: 2n, dx: 1_000000000_000000000n },
      // { i: 1n, j: 0n, dx: 1_000000000_000000000n },
      // { i: 1n, j: 2n, dx: 1_000000000_000000000n },
      // { i: 2n, j: 0n, dx: 1_000000000_000000000n },
      // { i: 2n, j: 1n, dx: 1_000000000_000000000n },
    ],
  },
]

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of curvePools) {
    createCurveSetup(pool.from, processor)
  }
}

const initializers = curvePools.map((pool) => createCurveInitializer(pool))

export const initialize = async (ctx: Context) => {
  await Promise.all(initializers.map((p) => p(ctx)))
}

const processors = curvePools.map((pool) => createCurveProcessor(pool))

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
