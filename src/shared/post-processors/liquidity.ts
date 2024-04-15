import { LiquidityDailyBalance } from '@model'
import { useProcessorState } from '@utils/state'
import dayjs from 'dayjs'

import { Context } from '../../processor'

const useLiquidityDailyBalance = (ctx: Context) =>
  useProcessorState(
    ctx,
    'liquidity-daily-balance',
    new Map<string, LiquidityDailyBalance>(),
  )

export const process = async (ctx: Context) => {
  const [ldb] = useLiquidityDailyBalance(ctx)
  if (ldb.size > 0) {
    ctx.log.debug({ count: ldb.size }, 'liquidity-daily-balance')
    await ctx.store.upsert([...ldb.values()])
  }
}

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
    updateLiquidityBalance(ctx, block, {
      address: params.address,
      token: params.tokens[0],
      balance: params.balances[0],
    })
  }
}

export const updateLiquidityBalance = (
  ctx: Context,
  block: Context['blocks'][number],
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
