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
import { Context } from '@processor'
import { entities, manualEntities } from '@validation/entities'
import { validateBlocks } from '@validation/validate'

export const name = 'validate-ousd'

const strategyBalances = Object.keys(entities)
  .filter((k) => k.startsWith('strategyBalances_ousd_'))
  .map((k) => entities[k as keyof typeof entities])
const strategyDailyYields = Object.keys(entities)
  .filter((k) => k.startsWith('strategyDailyYields_ousd_'))
  .map((k) => entities[k as keyof typeof entities])

const expectationSets = [
  { entity: OToken, expectations: entities.ousd_oTokens },
  { entity: OTokenAPY, expectations: entities.ousd_oTokenApies },
  { entity: OTokenHistory, expectations: entities.ousd_oTokenHistories },
  { entity: OTokenRebase, expectations: entities.ousd_oTokenRebases },
  { entity: OTokenDailyStat, expectations: entities.ousd_oTokenDailyStats },
  { entity: ERC20Balance, expectations: entities.ousd_erc20Balances },
  { entity: ERC20Balance, expectations: manualEntities.erc20_discrepancy_testing },
  ...strategyBalances.map((entities) => ({ entity: StrategyBalance, expectations: entities })),
  ...strategyDailyYields.map((entities) => ({ entity: StrategyDailyYield, expectations: entities })),
]

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
