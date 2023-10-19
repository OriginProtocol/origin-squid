import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as erc20 from '../../abi/erc20'
import { Balance } from '../../model'
import { Context } from '../../processor'

interface ProcessResult {
  balances: Balance[]
}

export const createER20BalanceSetup =
  (from: number) => (processor: EvmBatchProcessor) => {
    processor.includeAllBlocks({ from })
  }

export const createERC20BalanceProcessor = ({
  from,
  address,
  token,
  frequency,
}: {
  from: number
  address: string
  token: string
  frequency: number
}) => {
  let lastBlockHeightProcessed = 0
  return async (ctx: Context) => {
    const result: ProcessResult = {
      balances: [],
    }
    const nextBlockIndex = ctx.blocks.findIndex(
      (b) => b.header.height >= lastBlockHeightProcessed + frequency,
    )
    for (let i = nextBlockIndex; i < ctx.blocks.length; i += frequency) {
      const block = ctx.blocks[i]
      if (!block || block.header.height < from) continue
      const contract = new erc20.Contract(ctx, block.header, token)

      const curve = new Balance({
        id: `${token}:${address}:${block.header.height}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        token,
        address,
        balance: await contract.balanceOf(address),
      })
      result.balances.push(curve)
      lastBlockHeightProcessed = block.header.height
    }
    await ctx.store.insert(result.balances)
  }
}
