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
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      blockNumber: 11367184,
      holderCount: 0,
      id: '11367184:0x6b175474e89094c44da98b954eedeac495271d0f',
      timestamp: '2020-12-01T14:22:02.000000Z',
      totalSupply: '692399822445745145525155198',
    },
    {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      blockNumber: 11401000,
      holderCount: 2,
      id: '11401000:0xdac17f958d2ee523a2206206994597c13d831ec7',
      timestamp: '2020-12-06T19:20:45.000000Z',
      totalSupply: '12442213561495551',
    },
    {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      blockNumber: 12964450,
      holderCount: 3,
      id: '12964450:0x6b175474e89094c44da98b954eedeac495271d0f',
      timestamp: '2021-08-05T10:27:01.000000Z',
      totalSupply: '5445306543169379254918394333',
    },
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      blockNumber: 12964450,
      holderCount: 3,
      id: '12964450:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      timestamp: '2021-08-05T10:27:01.000000Z',
      totalSupply: '26720553335039550',
    },
    {
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      blockNumber: 17296080,
      holderCount: 90,
      id: '17296080:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      timestamp: '2023-05-19T21:05:35.000000Z',
      totalSupply: '3528560797966319884732',
    },
    {
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      blockNumber: 17296257,
      holderCount: 90,
      id: '17296257:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      timestamp: '2023-05-19T21:40:59.000000Z',
      totalSupply: '3529563347644033413431',
    },
    {
      address: '0x5e8422345238f34275888049021821e8e08caa1f',
      blockNumber: 17979735,
      holderCount: 0,
      id: '17979735:0x5e8422345238f34275888049021821e8e08caa1f',
      timestamp: '2023-08-23T20:16:11.000000Z',
      totalSupply: '254108641082873082034663',
    },
    {
      address: '0x5e8422345238f34275888049021821e8e08caa1f',
      blockNumber: 17986884,
      holderCount: 0,
      id: '17986884:0x5e8422345238f34275888049021821e8e08caa1f',
      timestamp: '2023-08-24T20:16:59.000000Z',
      totalSupply: '254331703007023082033663',
    },
    {
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      blockNumber: 18388340,
      holderCount: 499,
      id: '18388340:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      timestamp: '2023-10-20T01:44:59.000000Z',
      totalSupply: '38214229823673500371847',
    },
    {
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      blockNumber: 18389908,
      holderCount: 499,
      id: '18389908:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      timestamp: '2023-10-20T06:59:47.000000Z',
      totalSupply: '38217047513690199318528',
    },
  ]),
  erc20Balances: e([
    {
      id: '11362821:0xdac17f958d2ee523a2206206994597c13d831ec7:0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
      timestamp: '2020-11-30T22:20:30.000000Z',
      blockNumber: 11362821,
      balance: '11457161992607',
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      account: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
    },
    {
      id: '11367184:0x6b175474e89094c44da98b954eedeac495271d0f:0x89eb88fedc50fc77ae8a18aad1ca0ac27f777a90',
      timestamp: '2020-12-01T14:22:02.000000Z',
      blockNumber: 11367184,
      balance: '0',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x89eb88fedc50fc77ae8a18aad1ca0ac27f777a90',
    },
    {
      id: '11367184:0x6b175474e89094c44da98b954eedeac495271d0f:0x5e3646a1db86993f73e6b74a57d8640b69f7e259',
      timestamp: '2020-12-01T14:22:02.000000Z',
      blockNumber: 11367184,
      balance: '0',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x5e3646a1db86993f73e6b74a57d8640b69f7e259',
    },
    {
      id: '17149230:0x6b175474e89094c44da98b954eedeac495271d0f:0x7a192dd9cc4ea9bdedec9992df74f1da55e60a19',
      timestamp: '2023-04-29T03:58:35.000000Z',
      blockNumber: 17149230,
      balance: '0',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x7a192dd9cc4ea9bdedec9992df74f1da55e60a19',
    },
    {
      id: '17149230:0x6b175474e89094c44da98b954eedeac495271d0f:0xe75d77b1865ae93c7eaa3040b038d7aa7bc02f70',
      timestamp: '2023-04-29T03:58:35.000000Z',
      blockNumber: 17149230,
      balance: '556620480436222718976',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0xe75d77b1865ae93c7eaa3040b038d7aa7bc02f70',
    },
    {
      id: '17149230:0x6b175474e89094c44da98b954eedeac495271d0f:0x028171bca77440897b824ca71d1c56cac55b68a3',
      timestamp: '2023-04-29T03:58:35.000000Z',
      blockNumber: 17149230,
      balance: '29859949254086282250927323',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x028171bca77440897b824ca71d1c56cac55b68a3',
    },
    {
      id: '17149230:0x6b175474e89094c44da98b954eedeac495271d0f:0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
      timestamp: '2023-04-29T03:58:35.000000Z',
      blockNumber: 17149230,
      balance: '175900582068662134551795199',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    },
    {
      id: '17156244:0x6b175474e89094c44da98b954eedeac495271d0f:0x89eb88fedc50fc77ae8a18aad1ca0ac27f777a90',
      timestamp: '2023-04-30T03:38:59.000000Z',
      blockNumber: 17156244,
      balance: '0',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      account: '0x89eb88fedc50fc77ae8a18aad1ca0ac27f777a90',
    },
    {
      id: '17904321:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3:0x9283099a29556fcf8fff5b2cea2d4f67cb7a7a8b',
      timestamp: '2023-08-13T07:02:47.000000Z',
      blockNumber: 17904321,
      balance: '4081205214585785457',
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      account: '0x9283099a29556fcf8fff5b2cea2d4f67cb7a7a8b',
    },
    {
      id: '17904321:0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3:0x46d13d72db5d05bd2671312e321867ab8b30d9f6',
      timestamp: '2023-08-13T07:02:47.000000Z',
      blockNumber: 17904321,
      balance: '4081198559585393770',
      address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
      account: '0x46d13d72db5d05bd2671312e321867ab8b30d9f6',
    },
  ]),
} as const
