import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as balancerVaultAbi from '../../../abi/balancer-vault'
import { BalancerPoolBalance } from '../../../model'
import { Context } from '../../../processor'
import { BALANCER_VAULT } from '../../../utils/addresses'
import { blockFrequencyUpdater } from '../../../utils/blockFrequencyUpdater'

interface ProcessResult {
  balancerPoolBalances: BalancerPoolBalance[]
}

export const createBalancerSetup = (
  from: number,
  processor: EvmBatchProcessor,
) => {
  processor.includeAllBlocks({ from })
}

export const createBalancerProcessor = (
  poolAddress: string,
  poolId: string,
  from: number,
) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      balancerPoolBalances: [],
    }
    await update(ctx, async (ctx, block) => {
      const timestamp = new Date(block.header.timestamp)
      // const balancerPool = new balancerMetaStablePoolAbi.Contract(
      //   ctx,
      //   block.header,
      //   poolAddress,
      // )
      const balancerVault = new balancerVaultAbi.Contract(
        ctx,
        block.header,
        BALANCER_VAULT,
      )

      const [tokens, balances] = await balancerVault.getPoolTokens(poolId)

      const curve = new BalancerPoolBalance({
        id: `${poolAddress}-${block.header.height}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        address: poolAddress,
        balance0: balances[0],
        balance1: balances[1],
        balance2: balances.length > 2 ? balances[2] : 0n,
      })
      result.balancerPoolBalances.push(curve)
    })
    await ctx.store.insert(result.balancerPoolBalances)
  }
}
