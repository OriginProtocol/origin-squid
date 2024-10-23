import { ERC20Balance, OToken, OTokenAPY, OTokenDailyStat, OTokenRebase } from '@model'
import { Context } from '@processor'
import { env } from '@utils/env'
import { entities } from '@validation/entities'
import { validateExpectations } from '@validation/validate'

export const name = 'validate-base'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OToken, firstBlock, entities.superoethb_oTokens)
    await validateExpectations(ctx, block, OTokenAPY, firstBlock, entities.superoethb_oTokenApies)
    // await validateExpectations(ctx, block, OTokenHistory, firstBlock, entities.superoethb_oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, firstBlock, entities.superoethb_oTokenRebases)
    await validateExpectations(ctx, block, OTokenDailyStat, firstBlock, entities.superoethb_oTokenDailyStats)
    await validateExpectations(ctx, block, ERC20Balance, firstBlock, entities.superoethb_erc20Balances)
    firstBlock = false
  }
}
