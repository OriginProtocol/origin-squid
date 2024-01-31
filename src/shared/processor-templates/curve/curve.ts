import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as curveLpToken from '../../../abi/curve-lp-token'
import * as curveLpToken2 from '../../../abi/curve-lp-token-2'
import {
  CurvePool,
  CurvePoolBalance,
  CurvePoolRate,
  LiquiditySourceType,
} from '../../../model'
import { Block, Context } from '../../../processor'
import { blockFrequencyUpdater } from '../../../utils/blockFrequencyUpdater'
import { range } from '../../../utils/range'
import {
  registerLiquiditySource,
  updateLiquidityBalances,
} from '../../liquidity'

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

export const createCurveInitializer = ({
  name,
  address,
  tokens,
}: {
  name: string
  address: string
  tokens: [string, string] | [string, string, string]
}) => {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    registerLiquiditySource(address, LiquiditySourceType.CurvePool, token)
  }
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
  version_get_dy,
  ratesToPull,
}: {
  name: string
  address: string
  from: number
  tokens: string[]
  version_get_dy?: 'int128' | 'uint256'
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
      const contract = getCurveContract(ctx, block, address, version_get_dy)

      // TODO: use `get_balances()` where possible
      const [balances, rates] = await Promise.all([
        Promise.all(
          range(tokens.length).map((n) => contract.balances(BigInt(n))),
        ),
        Promise.all(
          (ratesToPull ?? []).map(async ({ i, j, dx }) => {
            return {
              name: `${i}-${j}-${dx}`,
              data: await contract.get_dy(i, j, dx),
            }
          }),
        ),
      ]).catch((err) => {
        ctx.log.error({ name, address })
        throw err
      })
      const curve = new CurvePoolBalance({
        id: `${address}-${timestampId}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        address: address,
        balance0: balances[0] ?? 0n,
        balance1: balances[1] ?? 0n,
        balance2: balances[2] ?? 0n,
      })
      updateLiquidityBalances(ctx, block, {
        address,
        tokens,
        balances,
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

export const getCurveContract = (
  ctx: Context,
  block: Block,
  address: string,
  version_get_dy?: 'int128' | 'uint256',
) => {
  return version_get_dy === 'uint256'
    ? new curveLpToken2.Contract(ctx, block.header, address)
    : new curveLpToken.Contract(ctx, block.header, address)
}
