import dayjs from 'dayjs'

import { LiquidityDailyBalance } from '../../model'
import { Block, Context } from '../../processor'
import { useProcessorState } from '../../utils/state'

export const postProcess = async (ctx: Context) => {
  const [ldb] = useLiquidityDailyBalance(ctx)
  if (ldb.size > 0) {
    ctx.log.debug({ count: ldb.size }, 'liquidity-daily-balance')
    await ctx.store.upsert([...ldb.values()])
  }
}

export const useLiquidityDailyBalance = (ctx: Context) =>
  useProcessorState(
    ctx,
    'liquidity-daily-balance',
    new Map<string, LiquidityDailyBalance>(),
  )

export const useLiquidityBalance = (ctx: Context) =>
  useProcessorState(
    ctx,
    'liquidity-balance',
    {} as Record<string, bigint | undefined>,
  )

export const updateLiquidityBalances = (
  ctx: Context,
  block: Context['blocks'][number],
  params: {
    address: string
    tokens: string[]
    balances: bigint[]
  },
) => {
  for (let i = 0; i < params.tokens.length; i++) {
    const updateParams = {
      address: params.address,
      token: params.tokens[0],
      balance: params.balances[0],
    }
    updateLiquidityBalance(ctx, block, updateParams)
    updateLiquidityDailyBalance(ctx, block, updateParams)
  }
}

export const updateLiquidityBalance = (
  ctx: Context,
  block: Block,
  params: {
    address: string
    token: string
    balance: bigint
  },
) => {
  const [liquidityBalances] = useLiquidityBalance(ctx)
  const key = `${block.header.height}:${params.token}`
  liquidityBalances[key] = (liquidityBalances[key] ?? 0n) + params.balance
}

export const updateLiquidityDailyBalance = (
  ctx: Context,
  block: Block,
  params: Pick<LiquidityDailyBalance, 'address' | 'token' | 'balance'>,
) => {
  const [ldb] = useLiquidityDailyBalance(ctx)
  const date = dayjs
    .utc(block.header.timestamp)
    .endOf('day')
    .format('YYYY-MM-DD')
  const id = `${params.address}:${params.token}:${date}`
  ldb.set(
    id,
    new LiquidityDailyBalance({
      id: id,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      address: params.address,
      token: params.token,
      balance: params.balance,
    }),
  )
}
