import * as erc20Abi from '@abi/erc20'
import { OGN } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OGN_ADDRESS, XOGN_ADDRESS } from '@utils/addresses'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

export const from = 6436154 // https://etherscan.io/tx/0x9b8a3a8db40b02078f89cec2eed569682a23e37b36c3e462190ef391ebdd1d11

export const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({
    from,
  })
}

const update = blockFrequencyUpdater({ from })
export const process = async (ctx: Context) => {
  const supplyData: OGN[] = []

  await update(ctx, async (ctx, block) => {
    const ognToken = new erc20Abi.Contract(ctx, block.header, OGN_ADDRESS)

    const [staked, total] = await Promise.all([
      ognToken.balanceOf(XOGN_ADDRESS),
      ognToken.totalSupply(),
    ])
    const circulating = total - staked

    const supplyAtBlock = new OGN({
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
