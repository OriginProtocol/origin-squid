import { Entity, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { sortBy } from 'lodash'

import { OETHMorphoAave, OETHVault } from '../../model'
import { Block, Context } from '../../processor'
import { jsonify } from '../../utils/jsonify'

export const name = 'validate-oeth'

export const process = async (ctx: Context) => {
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OETHVault, expectations.oethVaults)
    await validateExpectations(
      ctx,
      block,
      OETHMorphoAave,
      expectations.oethMorphoAave,
    )
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
        id: '2023-04-26T12:09:35.000Z',
        timestamp: '2023-04-26T12:09:35.000000Z',
        blockNumber: 17130306,
        rETH: '0',
        stETH: '250206338304274399',
        weth: '72000000000000000',
        frxETH: '99995919665342123',
      },
      {
        id: '2023-06-20T09:07:35.000Z',
        timestamp: '2023-06-20T09:07:35.000000Z',
        blockNumber: 17519916,
        rETH: '2554674408676488827943',
        stETH: '781566911007603525469',
        weth: '9305529378012728527471',
        frxETH: '2497474125748771996882',
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
