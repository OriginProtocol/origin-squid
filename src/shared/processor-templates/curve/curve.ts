import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as curveLpToken from '../../../abi/curve-lp-token'
import { CurvePoolBalance, CurvePoolRate } from '../../../model'
import { Context } from '../../../processor'
import { blockFrequencyUpdater } from '../../../utils/blockFrequencyUpdater'
import { range } from '../../../utils/range'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
  curvePoolRates: CurvePoolRate[]
}

export const createCurveSetup = (
  from: number,
  processor: EvmBatchProcessor,
) => {
  processor.includeAllBlocks({ from })
}

export const createCurveProcessor = ({
  name,
  address,
  count,
  from,
  ratesToPull,
}: {
  name: string
  address: string
  count: number
  from: number
  ratesToPull?: { i: bigint; j: bigint; dx: bigint }[] | undefined
}) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      curvePoolBalances: [],
      curvePoolRates: [],
    }
    await update(ctx, async (ctx, block) => {
      const timestamp = new Date(block.header.timestamp)
      const timestampId = timestamp.toISOString()
      const contract = new curveLpToken.Contract(ctx, block.header, address)

      // TODO: use `get_balances()` where possible
      const [balances, rates] = await Promise.all([
        Promise.all(range(count).map((n) => contract.balances(BigInt(n)))),
        Promise.all(
          (ratesToPull ?? []).map(async ({ i, j, dx }) => {
            return {
              name: `${i}-${j}-${dx}`,
              data: await contract.get_dy(i, j, dx),
            }
          }),
        ),
      ])
      const curve = new CurvePoolBalance({
        id: `${address}-${timestampId}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        address: address,
        balance0: balances[0] ?? 0n,
        balance1: balances[1] ?? 0n,
        balance2: balances[2] ?? 0n,
      })
      result.curvePoolBalances.push(curve)
      result.curvePoolRates.push(
        ...rates.map(
          (r) =>
            new CurvePoolRate({
              id: `${address}-${timestampId}-${r.name}`,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              address: address,
              name: r.name,
              rate: r.data,
            }),
        ),
      )
    })
    await ctx.store.insert(result.curvePoolBalances)
    await ctx.store.insert(result.curvePoolRates)
  }
}
