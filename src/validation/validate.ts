import assert from 'assert'

import { Block, Context } from '@originprotocol/squid-utils'
import { Entity, EntityClass } from '@subsquid/typeorm-store/lib/store'
import { env } from '@utils/env'

import { compare } from './compare'

export const validateBlocks = async (
  ctx: Context,
  expectationSets: {
    entity: EntityClass<any>
    expectations: (Entity & {
      timestamp: string
      blockNumber: number
    })[]
  }[],
) => {
  let firstBlock = true
  if (env.BLOCK_FROM || env.PROCESSOR) return
  for (const block of ctx.blocks) {
    await Promise.all(
      expectationSets.map(({ entity, expectations }) =>
        validateExpectations(ctx, block, entity, firstBlock, expectations),
      ),
    )
    firstBlock = false
  }
}

// If there is nothing to validate, we don't return a promise. (for performance)
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
  if (!expectations) return
  if (firstBlock) {
    while (expectations[0]?.blockNumber < block.header.height) {
      const entity = expectations.shift()!
      await validateExpectation(ctx, block, Class, entity)
    }
  }
  if (expectations.length && expectations[0]?.blockNumber < block.header.height) {
    throw new Error(`Something is missing: ${expectations[0].id}`)
  }
  while (expectations[0]?.blockNumber === block.header.height) {
    const entity = expectations.shift()!
    await validateExpectation(ctx, block, Class, entity)
  }
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
  const relations = Object.keys(expectation)
    .filter((key) => typeof expectation[key as keyof typeof expectation] === 'object')
    .reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
  const actual = await ctx.store.findOne(Class, { where: { id: expectation.id }, relations })
  if (process.env.IGNORE_VALIDATION !== 'true') {
    assert(
      actual,
      `Expected entity does not exist: block=${block.header.height} Entity=${Class.name} id=${expectation.id}`,
    )
  }
  expectation.timestamp = new Date(expectation.timestamp).toJSON()
  compare(expectation, actual)
  ctx.log.info(`Validated entity: block=${block.header.height} Entity=${Class.name} id=${expectation.id}`)
}
