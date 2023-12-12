import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../../processor'
import {
  createBalancerProcessor,
  createBalancerSetup,
} from '../../processor-templates/balancer'

const ousdResetFrom = 11585978
const oethDeployFrom = 16933090

const pools = [
  {
    name: 'Balancer rETH Stable Pool',
    poolSymbol: 'B-rETH-STABLE',
    poolType: 'MetaStable',
    poolAddress: '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
    poolId:
      '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
    from: Math.max(13850000, oethDeployFrom),
  },
  {
    name: 'wstETH-rETH-sfrxETH-BPT',
    poolSymbol: 'wstETH-rETH-sfrxETH-BPT',
    poolType: 'ComposableStable',
    poolAddress: '0x42ed016f826165c2e5976fe5bc3df540c5ad0af7',
    poolId:
      '0x42ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b',
    from: Math.max(17680000, oethDeployFrom),
  },
  {
    name: 'Balancer wstETH-WETH Stable Pool',
    poolSymbol: 'wstETH-WETH-BPT',
    poolType: 'ComposableStable',
    poolAddress: '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd',
    poolId:
      '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2',
    from: Math.max(17920000, oethDeployFrom),
  },
  {
    name: 'Balancer 80 BAL 20 WETH',
    poolSymbol: 'B-80BAL-20WETH',
    poolType: 'Weighted',
    poolAddress: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
    poolId:
      '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014',
    from: Math.max(12370000, oethDeployFrom),
  },
] as const

export const from = Math.min(...pools.map((p) => p.from))

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of pools) {
    createBalancerSetup(pool.from, processor)
  }
}

const processors = pools.map((pool) =>
  createBalancerProcessor(
    pool.poolAddress.toLowerCase(),
    pool.poolId.toLowerCase(),
    pool.poolType,
    pool.from,
    [
      [
        '0xba100000625a3754423978a60c9317c58a424e3d',
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      ],
    ],
  ),
)

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
