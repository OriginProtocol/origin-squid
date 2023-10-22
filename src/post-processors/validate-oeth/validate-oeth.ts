import { Entity, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { sortBy } from 'lodash'

import { OETHMorphoAave, OETHVault } from '../../model'
import { Block, Context } from '../../processor'
import { jsonify } from '../../utils/jsonify'

export const name = 'validate-oeth'

let firstBlock = true

export const process = async (ctx: Context) => {
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OETHVault, expectations.oethVaults)
    await validateExpectations(
      ctx,
      block,
      OETHMorphoAave,
      expectations.oethMorphoAave,
    )
    firstBlock = false
  }
}

const validateExpectations = async <
  T extends Entity & { timestamp: string; blockNumber: number },
>(
  ctx: Context,
  block: Block,
  Class: EntityClass<any>,
  expectations?: T[],
) => {
  if (!expectations) return
  if (firstBlock) {
    while (expectations[0]?.blockNumber < block.header.height) {
      expectations.shift()
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
  T extends Entity & { timestamp: string; blockNumber: number },
>(
  ctx: Context,
  Class: EntityClass<any>,
  expectation: T,
) => {
  const actual = await ctx.store.findOne(Class, {
    where: { id: expectation.id },
  })
  expectation.timestamp = new Date(expectation.timestamp).toJSON()
  assert.deepEqual(JSON.parse(jsonify(actual)), expectation)
}

const expectations: Record<string, any[]> = {
  oethVaults: sortBy(
    [
      {
        id: '2023-04-28T00:39:11.000Z',
        timestamp: '2023-04-28T00:39:11.000000Z',
        blockNumber: 17141121,
        rETH: '9360000000000000',
        stETH: '215069621854827437',
        weth: '1119651661749004532',
        frxETH: '7695288773432093',
      },
      {
        id: '2023-06-10T19:50:59.000Z',
        timestamp: '2023-06-10T19:50:59.000000Z',
        blockNumber: 17451954,
        rETH: '2554674408676488827943',
        stETH: '779656163342992671163',
        weth: '1026508082715309353868',
        frxETH: '0',
      },
      {
        id: '2023-06-10T19:52:11.000Z',
        timestamp: '2023-06-10T19:52:11.000000Z',
        blockNumber: 17451960,
        rETH: '2554674408676488827943',
        stETH: '779656163342992671163',
        weth: '1026508082715309353868',
        frxETH: '99144201818216785',
      },
      {
        id: '2023-06-19T06:59:47.000Z',
        timestamp: '2023-06-19T06:59:47.000000Z',
        blockNumber: 17512166,
        rETH: '2554674408676488827943',
        stETH: '781491659677780491225',
        weth: '368830581327791252482',
        frxETH: '0',
      },
    ],
    (v) => v.blockNumber,
  ),
  oethMorphoAave: sortBy(
    [
      {
        id: '2023-05-31T13:54:35.000Z',
        timestamp: '2023-05-31T13:54:35.000000Z',
        blockNumber: 17379284,
        weth: '57200000000000000000',
      },
      {
        id: '2023-06-02T09:51:11.000Z',
        timestamp: '2023-06-02T09:51:11.000000Z',
        blockNumber: 17392282,
        weth: '0',
      },
      {
        id: '2023-06-14T17:54:35.000Z',
        timestamp: '2023-06-14T17:54:35.000000Z',
        blockNumber: 17479788,
        weth: '103288680000000000000',
      },
    ],
    (v) => v.blockNumber,
  ),
}
