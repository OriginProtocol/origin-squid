import {
  ERC20Balance,
  OToken,
  OTokenAPY,
  OTokenDailyStat,
  OTokenHistory,
  OTokenRebase,
  StrategyBalance,
  StrategyDailyYield,
} from '@model'
import { Context } from '@originprotocol/squid-utils'
import { entities } from '@validation/entities'
import { validateBlocks } from '@validation/validate'

export const name = 'validate-base'

const strategyBalances = Object.keys(entities)
  .filter((k) => k.startsWith('strategyBalances_superoethb_'))
  .map((k) => entities[k as keyof typeof entities])
const strategyDailyYields = Object.keys(entities)
  .filter((k) => k.startsWith('strategyDailyYields_superoethb_'))
  .map((k) => entities[k as keyof typeof entities])

const expectationSets = [
  { entity: OToken, expectations: entities.superoethb_oTokens },
  { entity: OTokenAPY, expectations: entities.superoethb_oTokenApies },
  { entity: OTokenHistory, expectations: entities.superoethb_oTokenHistories },
  { entity: OTokenRebase, expectations: entities.superoethb_oTokenRebases },
  { entity: OTokenDailyStat, expectations: entities.superoethb_oTokenDailyStats },
  { entity: ERC20Balance, expectations: entities.superoethb_erc20Balances },
  ...strategyBalances.map((entities) => ({ entity: StrategyBalance, expectations: entities })),
  ...strategyDailyYields.map((entities) => ({ entity: StrategyDailyYield, expectations: entities })),
]

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
