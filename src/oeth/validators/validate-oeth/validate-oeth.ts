import {
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

export const name = 'validate-oeth'

const strategyBalances = Object.keys(entities)
  .filter((k) => k.startsWith('strategyBalances_oeth_'))
  .map((k) => entities[k as keyof typeof entities])
const strategyDailyYields = Object.keys(entities)
  .filter((k) => k.startsWith('strategyDailyYields_oeth_'))
  .map((k) => entities[k as keyof typeof entities])

const expectationSets = [
  { entity: OToken, expectations: entities.oeth_oTokens },
  { entity: OTokenAPY, expectations: entities.oeth_oTokenApies },
  { entity: OTokenHistory, expectations: entities.oeth_oTokenHistories },
  { entity: OTokenRebase, expectations: entities.oeth_oTokenRebases },
  { entity: OTokenDailyStat, expectations: entities.oeth_oTokenDailyStats },
  ...strategyBalances.map((entities) => ({ entity: StrategyBalance, expectations: entities })),
  ...strategyDailyYields.map((entities) => ({ entity: StrategyDailyYield, expectations: entities })),
]

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
