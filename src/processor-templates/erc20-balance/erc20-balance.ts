import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as erc20 from '../../abi/erc20'
import { Balance } from '../../model'
import { Context } from '../../processor'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'

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
}: {
  from: number
  address: string
  token: string
}) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      balances: [],
    }
    await update(ctx, async (ctx, block) => {
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
    })
    await ctx.store.insert(result.balances)
  }
}
