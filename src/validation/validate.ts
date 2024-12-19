import assert from 'assert'
import { compact } from 'lodash'

import { Block, Context } from '@processor'
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
  let promises: Promise<void>[] = []
  for (const block of ctx.blocks) {
    const validations = []
    for (const { entity, expectations } of expectationSets) {
      validations.push(validateExpectations(ctx, block, entity, firstBlock, expectations))
      firstBlock = false
    }
    promises.push(...compact(validations))
  }
  await Promise.all(promises)
}

// If there is nothing to validate, we don't return a promise. (for performance)
export const validateExpectations = <
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
): Promise<void> | undefined => {
  if (!expectations) return
  return new Promise(async (resolve, reject) => {
    try {
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
      resolve()
    } catch (e) {
      reject(e)
    }
  })
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
