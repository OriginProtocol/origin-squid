import { Entity, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { sortBy } from 'lodash'

import { ERC20Balance, ERC20State } from '../../model'
import { Block, Context } from '../../processor'
import { env } from '../../utils/env'
import { jsonify } from '../../utils/jsonify'

export const name = 'validate-shared'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, ERC20State, expectations.erc20States)
    await validateExpectations(
      ctx,
      block,
      ERC20Balance,
      expectations.erc20Balances,
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
  erc20States: e([
    {
      totalSupply: '1000000000000000000000000000',
      timestamp: '2022-08-17T23:57:22.000000Z',
      id: '15361708:0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
      holderCount: 1,
      blockNumber: 15361708,
      address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
    },
    {
      totalSupply: '38364302476507778835584',
      timestamp: '2023-07-17T07:17:35.000000Z',
      id: '17711440:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      holderCount: 348,
      blockNumber: 17711440,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
    },
    {
      totalSupply: '38364302476507778835584',
      timestamp: '2023-07-17T10:39:35.000000Z',
      id: '17712439:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      holderCount: 349,
      blockNumber: 17712439,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
    },
    {
      totalSupply: '38364302476507778835584',
      timestamp: '2023-07-17T10:41:47.000000Z',
      id: '17712450:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      holderCount: 348,
      blockNumber: 17712450,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
    },
    {
      totalSupply: '38406082572640197584644',
      timestamp: '2024-01-01T17:38:11.000000Z',
      id: '18914116:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      holderCount: 592,
      blockNumber: 18914116,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
    },
  ]),
  erc20Balances: e([
    {
      id: '11362821:0xdac17f958d2ee523a2206206994597c13d831ec7:0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
      balance: '11457161992607',
      timestamp: '2020-11-30T22:20:30.000000Z',
      blockNumber: 11362821,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      account: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
    },
    {
      id: '11378250:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:0xbcca60bb61934080951369a648fb03df4f96263c',
      balance: '9900888622',
      timestamp: '2020-12-03T07:18:44.000000Z',
      blockNumber: 11378250,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      account: '0xbcca60bb61934080951369a648fb03df4f96263c',
    },
    {
      id: '17149443:0x9c354503c38481a7a7a51629142963f98ecc12d0:0x2eae0cae2323167abf78462e0c0686865c67a655',
      balance: '7931542000000000000000000',
      timestamp: '2023-04-29T04:41:23.000000Z',
      blockNumber: 17149443,
      address: '0x9c354503c38481a7a7a51629142963f98ecc12d0',
      account: '0x2eae0cae2323167abf78462e0c0686865c67a655',
    },
    {
      id: '17288778:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3:0xab7C7E7ac51f70dd959f3541316dBd715773158B',
      balance: '5023909062476346',
      timestamp: '2023-05-18T20:22:11.000000Z',
      blockNumber: 17288778,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      account: '0xab7c7e7ac51f70dd959f3541316dbd715773158b',
    },
    {
      id: '17572288:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3:0x67dFCfd5D79A5D1bE7eE295233C2C966eF3A403E',
      balance: '9859680088763371928',
      timestamp: '2023-06-27T17:52:23.000000Z',
      blockNumber: 17572288,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      account: '0x67dfcfd5d79a5d1be7ee295233c2c966ef3a403e',
    },
    {
      id: '18732788:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3:0xad3b67BCA8935Cb510C8D18bD45F0b94F54A968f',
      balance: '56178503424784614',
      timestamp: '2023-12-07T06:59:59.000000Z',
      blockNumber: 18732788,
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      account: '0xad3b67bca8935cb510c8d18bd45f0b94f54a968f',
    },
    {
      id: '19029947:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:0x39aa39c021dfbae8fac545936693ac917d5e7563',
      balance: '28479817605372',
      timestamp: '2024-01-17T23:42:59.000000Z',
      blockNumber: 19029947,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      account: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
    },
    {
      id: '19029947:0x6b175474e89094c44da98b954eedeac495271d0f:0x028171bca77440897b824ca71d1c56cac55b68a3',
      balance: '14897045505942361213471443',
      timestamp: '2024-01-17T23:42:59.000000Z',
      blockNumber: 19029947,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x028171bca77440897b824ca71d1c56cac55b68a3',
    },
    {
      id: '19086303:0xdac17f958d2ee523a2206206994597c13d831ec7:0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
      balance: '40175463143636',
      timestamp: '2024-01-25T21:26:35.000000Z',
      blockNumber: 19086303,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      account: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
    },
  ]),
} as const
