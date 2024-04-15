import * as erc20Abi from '@abi/erc20'
import { OGV } from '@model'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OGV_ADDRESS, VEOGV_ADDRESS } from '@utils/addresses'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

import { Context } from '../../processor'

export const from = 14439231 // https://etherscan.io/tx/0x9295cac246169f06a3d4ec33fdbd87fced7a9e19ea61177cae75034e45ae66f4

export const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({
    from,
  })
}

const update = blockFrequencyUpdater({ from })
export const process = async (ctx: Context) => {
  const supplyData: OGV[] = []

  await update(ctx, async (ctx, block) => {
    const ogvToken = new erc20Abi.Contract(ctx, block.header, OGV_ADDRESS)

    const [staked, total] = await Promise.all([
      ogvToken.balanceOf(VEOGV_ADDRESS),
      ogvToken.totalSupply(),
    ])
    const circulating = total - staked

    const supplyAtBlock = new OGV({
      id: `${block.header.height}`,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      circulating,
      staked,
      total,
    })

    supplyData.push(supplyAtBlock)
  })

  await ctx.store.insert(supplyData)
}
