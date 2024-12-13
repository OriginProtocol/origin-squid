import assert from 'assert'

import {
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
import { entities } from '@validation/entities'
import { validateExpectations } from '@validation/validate'

export const name = 'validate-oeth'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM || env.PROCESSOR) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OToken, firstBlock, entities.oeth_oTokens)
    await validateExpectations(ctx, block, OTokenAPY, firstBlock, entities.oeth_oTokenApies)
    await validateExpectations(ctx, block, OTokenHistory, firstBlock, entities.oeth_oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, firstBlock, entities.oeth_oTokenRebases)
    await validateExpectations(ctx, block, OTokenDailyStat, firstBlock, entities.oeth_oTokenDailyStats)
    const strategyBalances = Object.keys(entities).filter((k) => k.startsWith('strategyBalances_oeth_'))
    assert(strategyBalances.length > 0, 'No strategyBalances found')
    for (const key of strategyBalances) {
      await validateExpectations(ctx, block, StrategyBalance, firstBlock, entities[key as keyof typeof entities])
    }
    const strategyDailyYields = Object.keys(entities).filter((k) => k.startsWith('strategyDailyYields_oeth_'))
    assert(strategyDailyYields.length > 0, 'No strategyDailyYields found')
    for (const key of strategyDailyYields) {
      await validateExpectations(ctx, block, StrategyDailyYield, firstBlock, entities[key as keyof typeof entities])
    }
    firstBlock = false
  }
}
