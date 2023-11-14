import { Entity, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { sortBy } from 'lodash'

import { StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import { env } from '../../../utils/env'
import { jsonify } from '../../../utils/jsonify'

export const name = 'validate-oeth'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(
      ctx,
      block,
      StrategyYield,
      expectations.strategyYields,
    )
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
  assert(
    !expectations.length || expectations[0]?.blockNumber >= block.header.height,
    'Something is missing',
  )
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
  assert(
    actual,
    `Expected entity does not exist: Entity=${Class.name} id=${expectation.id}`,
  )
  expectation.timestamp = new Date(expectation.timestamp).toJSON()
  // We decide to only care about float decimal accuracy to the 8th.
  assert.deepEqual(
    JSON.parse(
      jsonify(actual, (_key, value) =>
        typeof value === 'number' ? Number(value.toFixed(8)) : value,
      ),
    ),
    JSON.parse(
      jsonify(expectation, (_key, value) =>
        typeof value === 'number' ? Number(value.toFixed(8)) : value,
      ),
    ),
  )
  ctx.log.info(`Validated entity: Entity=${Class.name} id=${expectation.id}`)
}

const e = (arr: any[]) => {
  return sortBy(arr, (v) => v.blockNumber)
}

const expectations = {
  strategyYields: e([]),
  // strategyYields: e([
  //   {
  //     id: '16421264:0x79f2188ef9350a1dc11a062cca0abe90684b0197:0x0000000000000000000000000000000000000348',
  //     timestamp: '2023-01-16T18:52:35.000000Z',
  //     blockNumber: 16421264,
  //     strategy: '0x79f2188ef9350a1dc11a062cca0abe90684b0197',
  //     asset: '0x0000000000000000000000000000000000000348',
  //     balance: '1494000000000000000000000',
  //     balanceWeight: 1,
  //     earnings: '0',
  //     earningsChange: '0',
  //   },
  //   {
  //     id: '16421590:0x79f2188ef9350a1dc11a062cca0abe90684b0197:0x0000000000000000000000000000000000000348',
  //     timestamp: '2023-01-16T19:57:59.000000Z',
  //     blockNumber: 16421590,
  //     strategy: '0x79f2188ef9350a1dc11a062cca0abe90684b0197',
  //     asset: '0x0000000000000000000000000000000000000348',
  //     balance: '1494005405114000000000000',
  //     balanceWeight: 1,
  //     earnings: '5405114000000000000',
  //     earningsChange: '5405114000000000000',
  //   },
  //   {
  //     id: '16427826:0x79f2188ef9350a1dc11a062cca0abe90684b0197:0x0000000000000000000000000000000000000348',
  //     timestamp: '2023-01-17T16:50:23.000000Z',
  //     blockNumber: 16427826,
  //     strategy: '0x79f2188ef9350a1dc11a062cca0abe90684b0197',
  //     asset: '0x0000000000000000000000000000000000000348',
  //     balance: '1513111416702000000000000',
  //     balanceWeight: 1,
  //     earnings: '111399765000000000000',
  //     earningsChange: '105994651000000000000',
  //   },
  // ]),
} as const
