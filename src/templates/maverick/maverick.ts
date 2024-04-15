import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { add } from 'lodash'

import * as maverickPool from '../../abi/maverick-pool'
import { registerLiquiditySource } from '../../mainnet/processors/liquidity-sources'
import {
  LiquiditySource,
  LiquiditySourceType,
  MaverickPool,
  MaverickPoolBalance,
} from '../../model'
import { Context } from '../../processor'
import { updateLiquidityBalances } from '../../shared/post-processors/liquidity'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'

// Maverick Pool Reference: https://docs.mav.xyz/guides/technical-reference/pool

interface ProcessResult {
  maverickPoolBalances: MaverickPoolBalance[]
}

export const createMaverickSetup = (
  from: number,
  processor: EvmBatchProcessor,
) => {
  processor.includeAllBlocks({ from })
}

export const createMaverickInitializer = ({
  name,
  address,
  tokens,
}: {
  name: string
  address: string
  tokens: [string, string]
}) => {
  for (const token of tokens) {
    registerLiquiditySource(address, LiquiditySourceType.MaverickPool, token)
  }
  return async (ctx: Context) => {
    const pool = await ctx.store.findOneBy(MaverickPool, { id: address })
    if (!pool) {
      await ctx.store.insert(
        new MaverickPool({
          id: address,
          address,
          name,
          tokenA: tokens[0],
          tokenB: tokens[1],
        }),
      )
    }
  }
}

export const createMaverickProcessor = ({
  name,
  address,
  from,
  tokens,
}: {
  name: string
  address: string
  from: number
  tokens: [string, string]
}) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      maverickPoolBalances: [],
    }
    await update(ctx, async (ctx, block) => {
      const timestamp = new Date(block.header.timestamp)
      const timestampId = timestamp.toISOString()
      const contract = new maverickPool.Contract(ctx, block.header, address)

      // TODO: use `get_balances()` where possible
      const [binBalanceA, binBalanceB] = await Promise.all([
        contract.binBalanceA(),
        contract.binBalanceB(),
      ])
      const curve = new MaverickPoolBalance({
        id: `${address}-${timestampId}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        address: address,
        binBalanceA: binBalanceA ?? 0n,
        binBalanceB: binBalanceB ?? 0n,
      })
      result.maverickPoolBalances.push(curve)
      updateLiquidityBalances(ctx, block, {
        address,
        tokens,
        balances: [binBalanceA, binBalanceB],
      })
    })
    await ctx.store.insert(result.maverickPoolBalances)
  }
}
