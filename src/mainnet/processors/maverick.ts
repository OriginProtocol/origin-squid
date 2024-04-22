import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import {
  createMaverickInitializer,
  createMaverickProcessor,
  createMaverickSetup,
} from '@templates/maverick'

const oethDeployFrom = 16933090

export const from = Math.min(oethDeployFrom)

const pools: (Parameters<typeof createMaverickProcessor>['0'] &
  Parameters<typeof createMaverickInitializer>['0'])[] = [
  // {
  //   name: 'wstETH-ETH',
  //   address: '0x0eb1c92f9f5ec9d817968afddb4b46c564cdedbe',
  //   from: Math.max(17216724, oethDeployFrom),
  //   tokens: [tokens.wstETH, tokens.ETH],
  // },
  // {
  //   name: 'rETH-ETH',
  //   address: '0xeb061a4e1ad3f1983655281cb8019ebbf8b30b29',
  //   from: Math.max(17216790, oethDeployFrom),
  //   tokens: [tokens.rETH, tokens.ETH],
  // },
  // {
  //   name: 'OETH-ETH',
  //   address: '0xa51822839bfa4685b27ad60305264a37eae28a68',
  //   from: Math.max(17444830, oethDeployFrom),
  //   tokens: [tokens.OETH, tokens.ETH],
  // },
]

export const setup = (processor: EvmBatchProcessor) => {
  for (const pool of pools) {
    createMaverickSetup(pool.from, processor)
  }
}

const initializers = pools.map((pool) => createMaverickInitializer(pool))

export const initialize = async (ctx: Context) => {
  await Promise.all(initializers.map((p) => p(ctx)))
}

const processors = pools.map((pool) => createMaverickProcessor(pool))

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
