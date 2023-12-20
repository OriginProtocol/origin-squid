import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../processor'
import {
  createMaverickProcessor,
  createMaverickSetup,
} from '../processor-templates/maverick'

const oethDeployFrom = 16933090

export const from = Math.min(oethDeployFrom)

const pools = [
  {
    name: 'wstETH-ETH',
    address: '0x0eb1c92f9f5ec9d817968afddb4b46c564cdedbe',
    from: Math.max(17216724, oethDeployFrom),
  },
  {
    name: 'rETH-ETH',
    address: '0xeb061a4e1ad3f1983655281cb8019ebbf8b30b29',
    from: Math.max(17216790, oethDeployFrom),
  },
] as Parameters<typeof createMaverickProcessor>['0'][]

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of pools) {
    createMaverickSetup(pool.from, processor)
  }
}

const processors = pools.map((pool) => createMaverickProcessor(pool))

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
