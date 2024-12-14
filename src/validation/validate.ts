import assert from 'assert'

import { Block, Context } from '@processor'
import { Entity, EntityClass } from '@subsquid/typeorm-store/lib/store'

import { compare } from './compare'

export const validateExpectations = async <
  T extends Entity & {
    timestamp: string
    blockNumber: number
  },
>(
  ctx: Context,
  block: Block,
  Class: EntityClass<any>,
  firstBlock: boolean,
  expectations?: T[],
) => {
  return // skipping for fresh load of v999
  // if (!expectations) return
  // if (firstBlock) {
  //   while (expectations[0]?.blockNumber < block.header.height) {
  //     const entity = expectations.shift()!
  //     await validateExpectation(ctx, block, Class, entity)
  //   }
  // }
  // assert(!expectations.length || expectations[0]?.blockNumber >= block.header.height, 'Something is missing')
  // while (expectations[0]?.blockNumber === block.header.height) {
  //   const entity = expectations.shift()!
  //   await validateExpectation(ctx, block, Class, entity)
  // }
}

const validateExpectation = async <
  T extends Entity & {
    timestamp: string
    blockNumber: number
  },
>(
  ctx: Context,
  block: Block,
  Class: EntityClass<any>,
  expectation: T,
) => {
  const actual = await ctx.store.get(Class, expectation.id)
  assert(
    actual,
    `Expected entity does not exist: block=${block.header.height} Entity=${Class.name} id=${expectation.id}`,
  )
  expectation.timestamp = new Date(expectation.timestamp).toJSON()
  compare(expectation, actual)
  ctx.log.info(`Validated entity: block=${block.header.height} Entity=${Class.name} id=${expectation.id}`)
}
