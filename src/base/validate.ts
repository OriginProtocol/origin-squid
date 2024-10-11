import assert from 'assert'

import { ERC20Balance, OToken, OTokenAPY, OTokenDailyStat, OTokenHistory, OTokenRebase } from '@model'
import { Block, Context } from '@processor'
import { EntityClass } from '@subsquid/typeorm-store'
import { Entity } from '@subsquid/typeorm-store/lib/store'
import { env } from '@utils/env'
import { compare } from '@validation/compare'
import { entities } from '@validation/entities'

export const name = 'validate-base'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OToken, entities.superoethb_oTokens)
    await validateExpectations(ctx, block, OTokenAPY, entities.superoethb_oTokenApies)
    await validateExpectations(ctx, block, OTokenHistory, entities.superoethb_oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, entities.superoethb_oTokenRebases)
    await validateExpectations(ctx, block, OTokenDailyStat, entities.superoethb_oTokenDailyStats)
    await validateExpectations(ctx, block, ERC20Balance, entities.superoethb_erc20Balances)
    firstBlock = false
  }
}

const validateExpectations = async <
  T extends Entity & {
    timestamp: string
    blockNumber: number
  },
>(
  ctx: Context,
  block: Block,
  Class: EntityClass<any>,
  expectations?: T[],
) => {
  if (!expectations) return
  if (firstBlock) {
    while (expectations[0]?.blockNumber < block.header.height) {
      const entity = expectations.shift()!
      await validateExpectation(ctx, Class, entity)
    }
  }
  assert(!expectations.length || expectations[0]?.blockNumber >= block.header.height, 'Something is missing')
  while (expectations[0]?.blockNumber === block.header.height) {
    const entity = expectations.shift()!
    await validateExpectation(ctx, Class, entity)
  }
}

const validateExpectation = async <
  T extends Entity & {
    timestamp: string
    blockNumber: number
  },
>(
  ctx: Context,
  Class: EntityClass<any>,
  expectation: T,
) => {
  const actual = await ctx.store.findOne(Class, {
    where: { id: expectation.id },
  })
  assert(actual, `Expected entity does not exist: Entity=${Class.name} id=${expectation.id}`)
  expectation.timestamp = new Date(expectation.timestamp).toJSON()
  compare(expectation, actual)
  ctx.log.info(`Validated entity: Entity=${Class.name} id=${expectation.id}`)
}
