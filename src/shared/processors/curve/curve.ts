import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../../processor'
import {
  createCurveProcessor,
  createCurveSetup,
} from '../../processor-templates/curve'

const ousdResetFrom = 11585978
const oethDeployFrom = 16933090

export const from = Math.min(ousdResetFrom, oethDeployFrom)

const pools = [
  // Curve (OUSD)
  {
    name: 'ThreePool',
    address: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7'.toLowerCase(),
    from: Math.max(10809473, ousdResetFrom),
    count: 3,
  },
  {
    name: 'OUSDMetapool',
    address: '0x87650d7bbfc3a9f10587d7778206671719d9910d'.toLowerCase(),
    from: Math.max(12860905, ousdResetFrom),
    count: 2,
  },
  {
    name: 'LUSDMetapool',
    address: '0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca'.toLowerCase(),
    from: Math.max(12184843, ousdResetFrom),
    count: 2,
  },

  // Curve (OETH)
  {
    name: 'EthFrxEthPool',
    address: '0xa1f8a6807c402e4a15ef4eba36528a3fed24e577'.toLowerCase(),
    from: Math.max(15741010, oethDeployFrom),
    count: 2,
  },
  {
    name: 'EthRethPool',
    address: '0x0f3159811670c117c372428d4e69ac32325e4d0f'.toLowerCase(),
    from: Math.max(16615906, oethDeployFrom),
    count: 2,
  },
  {
    name: 'EthStEthPool',
    address: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022'.toLowerCase(),
    from: Math.max(11592551, oethDeployFrom),
    count: 2,
  },
  {
    name: 'WEthStEthPool',
    address: '0x828b154032950c8ff7cf8085d841723db2696056'.toLowerCase(),
    from: Math.max(14759666, oethDeployFrom),
    count: 2,
  },
  {
    name: 'OEthEthPool',
    address: '0x94B17476A93b3262d87B9a326965D1E91f9c13E7'.toLowerCase(),
    from: Math.max(17130500, oethDeployFrom),
    count: 2,
    ratesToPull: [{ i: 1n, j: 0n, dx: 1000000000000000000n }],
  },
] as Parameters<typeof createCurveProcessor>['0'][]

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of pools) {
    createCurveSetup(pool.from, processor)
  }
}

const processors = pools.map((pool) => createCurveProcessor(pool))

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
