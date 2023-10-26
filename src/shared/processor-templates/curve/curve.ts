import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as curveLpToken from '../../../abi/curve-lp-token'
import { CurvePoolBalance } from '../../../model'
import { Context } from '../../../processor'
import { blockFrequencyUpdater } from '../../../utils/blockFrequencyUpdater'
import { range } from '../../../utils/range'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
}

export const createCurveSetup = (
  from: number,
  processor: EvmBatchProcessor,
) => {
  processor.includeAllBlocks({ from })
}

export const createCurveProcessor = (
  poolAddress: string,
  count: number,
  from: number,
) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      curvePoolBalances: [],
    }
    await update(ctx, async (ctx, block) => {
      const timestamp = new Date(block.header.timestamp)
      const timestampId = timestamp.toISOString()
      const contract = new curveLpToken.Contract(ctx, block.header, poolAddress)

      // TODO: use `get_balances()` where possible
      const balances = await Promise.all(
        range(count).map((n) => contract.balances(BigInt(n))),
      )
      const curve = new CurvePoolBalance({
        id: `${poolAddress}-${timestampId}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        address: poolAddress,
        balance0: balances[0] ?? 0n,
        balance1: balances[1] ?? 0n,
        balance2: balances[2] ?? 0n,
      })
      result.curvePoolBalances.push(curve)
    })
    await ctx.store.insert(result.curvePoolBalances)
  }
}
