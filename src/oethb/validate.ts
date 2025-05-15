import { ERC20Balance, OToken, OTokenAPY, OTokenDailyStat, OTokenHistory, OTokenRebase } from '@model'
import { Context } from '@originprotocol/squid-utils'
import { entities } from '@validation/entities'
import { validateBlocks } from '@validation/validate'

export const name = 'validate-oethb'

const expectationSets = [
  { entity: OToken, expectations: entities.superoethb_oTokens },
  { entity: OTokenAPY, expectations: entities.superoethb_oTokenApies },
  { entity: OTokenHistory, expectations: entities.superoethb_oTokenHistories },
  { entity: OTokenRebase, expectations: entities.superoethb_oTokenRebases },
  { entity: OTokenDailyStat, expectations: entities.superoethb_oTokenDailyStats },
  { entity: ERC20Balance, expectations: entities.superoethb_erc20Balances },
]

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
