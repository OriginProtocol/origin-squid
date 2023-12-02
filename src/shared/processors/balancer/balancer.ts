import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../../processor'
import {
  createBalancerProcessor,
  createBalancerSetup,
} from '../../processor-templates/balancer'

const ousdResetFrom = 11585978
const oethDeployFrom = 16933090

export const from = Math.min(ousdResetFrom, oethDeployFrom)

const pools = [
  {
    name: 'Balancer rETH Stable Pool',
    poolSymbol: 'B-rETH-STABLE',
    poolType: 'MetaStable',
    poolAddress: '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
    poolId:
      '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
    from: Math.max(13846138, ousdResetFrom),
  },
] as const

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of pools) {
    createBalancerSetup(pool.from, processor)
  }
}

const processors = pools.map((pool) =>
  createBalancerProcessor(
    pool.poolAddress.toLowerCase(),
    pool.poolId.toLowerCase(),
    pool.from,
  ),
)

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
