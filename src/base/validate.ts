import { StrategyBalance, StrategyDailyYield } from '@model'
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
  ...strategyBalances.map((entities) => ({ entity: StrategyBalance, expectations: entities })),
  ...strategyDailyYields.map((entities) => ({ entity: StrategyDailyYield, expectations: entities })),
]

export const process = async (ctx: Context) => {
  await validateBlocks(ctx, expectationSets)
}
