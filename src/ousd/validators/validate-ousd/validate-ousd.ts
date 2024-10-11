import assert from 'assert'
import { sortBy } from 'lodash'

import {
  ERC20Balance,
  OToken,
  OTokenAPY,
  OTokenDailyStat,
  OTokenHistory,
  OTokenRebase,
  OUSDDailyStat,
  StrategyYield,
} from '@model'
import { Block, Context } from '@processor'
import { EntityClass } from '@subsquid/typeorm-store'
import { Entity } from '@subsquid/typeorm-store/lib/store'
import { env } from '@utils/env'
import { compare } from '@validation/compare'
import { entities } from '@validation/entities'

export const name = 'validate-ousd'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OToken, entities.ousd_oTokens)
    await validateExpectations(ctx, block, OTokenAPY, entities.ousd_oTokenApies)
    await validateExpectations(ctx, block, OTokenHistory, entities.ousd_oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, entities.ousd_oTokenRebases)
    await validateExpectations(ctx, block, OTokenDailyStat, entities.ousd_oTokenDailyStats)
    await validateExpectations(ctx, block, ERC20Balance, entities.ousd_erc20Balances)
    await validateExpectations(ctx, block, StrategyYield, expectations.strategyYields)
    await validateExpectations(ctx, block, OUSDDailyStat, expectations.ousdDailyStats)
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

const e = (arr: any[]) => {
  return sortBy(arr, (v) => v.blockNumber)
}

const expectations = {
  strategyYields: e([]),
  oTokenApies: e([
    {
      id: '1-0x2a8e1e676ec238d8a992307b495b45b3feaa5e86-2021-11-09',
      chainId: 1,
      otoken: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
      date: '2021-11-09',
      blockNumber: 13580743,
      apy7DayAvg: 0.13083488137587887,
      apy30DayAvg: 0.11214418403646761,
      apy14DayAvg: 0.11214418403646761,
      apy: 0.09583265106767636,
      apr: 0.09152595180820716,
      rebasingCreditsPerToken: '852686447110306439510756300',
      timestamp: '2021-11-09T06:59:40.000000Z',
      txHash: '0x8100a86ef0b23789be3ca200886e4b9cb4209e5c97e59eaf744b9181267ae4b3',
    },
  ]),
  oTokenHistories: e([
    {
      id: '1-0x2a8e1e676ec238d8a992307b495b45b3feaa5e86-0011786453-b501f-000267-0x9315cdb9dc37550f42b12a183de7b5a7876dc9f8-1',
      chainId: 1,
      blockNumber: 11786453,
      balance: '5000000000000000000000',
      otoken: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
      timestamp: '2021-02-04T00:08:32.000000Z',
      txHash: '0x951a57d616a98aeaeeb1df722d6c1565da20ad74fa410db95a80c28da3c88175',
      type: 'Received',
      value: '5000000000000000000000',
    },
    {
      id: '1-0x2a8e1e676ec238d8a992307b495b45b3feaa5e86-0012348966-f91a7-000067-0x9315cdb9dc37550f42b12a183de7b5a7876dc9f8-1',
      chainId: 1,
      blockNumber: 12348966,
      balance: '1',
      otoken: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
      timestamp: '2021-05-01T14:59:47.000000Z',
      txHash: '0x5643e6f85bab24cf1057a09d20c7fa353d895d96d0c114141b6792c76c93dfc2',
      type: 'Sent',
      value: '-4999999999999999999999',
    },
  ]),
  oTokenRebases: e([
    {
      id: '1-0x2a8e1e676ec238d8a992307b495b45b3feaa5e86-0014883457-a66bb-000005',
      blockNumber: 14883457,
      feeETH: '178820559593958066',
      feeUSD: '346263724854739034559',
      rebasingCredits: '28313629639061008328884206782869381',
      rebasingCreditsPerToken: '793786451700174206240401619',
      timestamp: '2022-06-01T06:59:39.000000Z',
      txHash: '0xca8bb9f49e9135e81cb7f8c0876bfdce54352bbf45ceeda567144ca488ec1df5',
      totalSupply: '63608906999875802980711462',
      yieldETH: '1788205595939580665',
      yieldUSD: '3462637248547390345598',
    },
  ]),
  ousdDailyStats: e([]),
} as const
