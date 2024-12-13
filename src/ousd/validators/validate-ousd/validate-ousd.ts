import assert from 'assert'

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
import { env } from '@utils/env'
import { entities, manualEntities } from '@validation/entities'
import { validateExpectations } from '@validation/validate'

export const name = 'validate-ousd'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM || env.PROCESSOR) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OToken, firstBlock, entities.ousd_oTokens)
    await validateExpectations(ctx, block, OTokenAPY, firstBlock, entities.ousd_oTokenApies)
    await validateExpectations(ctx, block, OTokenHistory, firstBlock, entities.ousd_oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, firstBlock, entities.ousd_oTokenRebases)
    await validateExpectations(ctx, block, OTokenDailyStat, firstBlock, entities.ousd_oTokenDailyStats)
    await validateExpectations(ctx, block, ERC20Balance, firstBlock, entities.ousd_erc20Balances)
    await validateExpectations(ctx, block, ERC20Balance, firstBlock, manualEntities.erc20_discrepancy_testing)
    const strategyBalances = Object.keys(entities).filter((k) => k.startsWith('strategyBalances_ousd_'))
    assert(strategyBalances.length > 0, 'No strategyBalances found')
    for (const key of strategyBalances) {
      await validateExpectations(ctx, block, StrategyBalance, firstBlock, entities[key as keyof typeof entities])
    }
    const strategyDailyYields = Object.keys(entities).filter((k) => k.startsWith('strategyDailyYields_ousd_'))
    assert(strategyDailyYields.length > 0, 'No strategyDailyYields found')
    for (const key of strategyDailyYields) {
      await validateExpectations(ctx, block, StrategyDailyYield, firstBlock, entities[key as keyof typeof entities])
    }
    firstBlock = false
  }
}
