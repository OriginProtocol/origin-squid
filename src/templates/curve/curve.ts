import * as curveLpToken from '@abi/curve-lp-token'
import { CurvePool, CurvePoolBalance, CurvePoolRate } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { range } from '@utils/range'

interface ProcessResult {
  curvePoolBalances: CurvePoolBalance[]
  curvePoolRates: CurvePoolRate[]
}

export const createCurveSetup = (from: number, processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

export const createCurveInitializer = ({
  name,
  address,
  tokens,
}: {
  name: string
  address: string
  tokens: [string, string] | [string, string, string]
}) => {
  return async (ctx: Context) => {
    const pool = await ctx.store.findOneBy(CurvePool, { id: address })
    if (!pool) {
      await ctx.store.insert(
        new CurvePool({
          id: address,
          address,
          name,
          tokenCount: tokens.length,
          token0: tokens[0],
          token1: tokens[1],
          token2: tokens[2],
        }),
      )
    }
  }
}

export const createCurveProcessor = ({
  name,
  address,
  from,
  tokens,
  ratesToPull,
}: {
  name: string
  address: string
  from: number
  tokens: string[]
  ratesToPull?: { i: bigint; j: bigint; dx: bigint }[] | undefined
}) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      curvePoolBalances: [],
      curvePoolRates: [],
    }
    await update(ctx, async (ctx, block) => {
      const contract = new curveLpToken.Contract(ctx, block.header, address)

      // TODO: use `get_balances()` where possible
      const [balances, rates] = await Promise.all([
        Promise.all(range(tokens.length).map((n) => contract.balances(BigInt(n)))),
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
        id: `${address}-${block.header.height}`,
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
              id: `${address}-${block.header.height}-${r.name}`,
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
