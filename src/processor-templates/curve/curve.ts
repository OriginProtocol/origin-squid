import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as curveLpToken from '../../abi/curve-lp-token'
import { CurvePoolBalance } from '../../model'
import { Context } from '../../processor'
import { range } from '../../utils/range'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
}

const ESTIMATED_BPS = 12.06 // Circa 2023
const SECONDS_PER_DAY = 86400
const BLOCKS_PER_DAY = SECONDS_PER_DAY / ESTIMATED_BPS
const UPDATE_FREQUENCY = Math.floor(BLOCKS_PER_DAY)

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
  let lastBlockHeightProcessed = 0
  return async (ctx: Context) => {
    const result: ProcessResult = {
      curvePoolBalances: [],
    }
    const nextBlockIndex = ctx.blocks.findIndex(
      (b) => b.header.height >= lastBlockHeightProcessed + UPDATE_FREQUENCY,
    )
    for (let i = nextBlockIndex; i < ctx.blocks.length; i += UPDATE_FREQUENCY) {
      const block = ctx.blocks[i]
      if (!block || block.header.height < from) continue
      const timestamp = new Date(block.header.timestamp)
      const timestampId = timestamp.toISOString()
      const contract = new curveLpToken.Contract(ctx, block.header, poolAddress)

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
      lastBlockHeightProcessed = block.header.height
    }
    await ctx.store.insert(result.curvePoolBalances)
  }
}
