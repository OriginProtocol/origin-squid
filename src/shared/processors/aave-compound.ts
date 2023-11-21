import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../processor'
import { createERC20Tracker } from '../processor-templates/erc20'

const tracks: Parameters<typeof createERC20Tracker>[0][] = [
  {
    from: 11362821,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    accountFilter: ['0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811'], // aUSDT
  },
  {
    from: 11367200,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    accountFilter: ['0xBcca60bB61934080951369a648Fb03DF4F96263C'], // aUSDC
  },
  {
    from: 11367184,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    accountFilter: ['0x028171bca77440897b824ca71d1c56cac55b68a3'], // aDAI
  },
]

export const from = Math.min(...tracks.map((t) => t.from))

const processors = tracks.map(createERC20Tracker)

export const setup = (processor: EvmBatchProcessor) => {
  processors.forEach((p) => p.setup(processor))
}
export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p.process(ctx)))
}
