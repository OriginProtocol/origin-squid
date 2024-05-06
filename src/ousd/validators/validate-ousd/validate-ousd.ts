import assert from 'assert'
import { pick, sortBy } from 'lodash'

import {
  OTokenHistory,
  OTokenRebase,
  OUSDDailyStat,
  StrategyYield,
} from '@model'
import { Block, Context } from '@processor'
import { EntityClass } from '@subsquid/typeorm-store'
import { Entity } from '@subsquid/typeorm-store/lib/store'
import { env } from '@utils/env'
import { jsonify } from '@utils/jsonify'

export const name = 'validate-ousd'

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
    await validateExpectations(
      ctx,
      block,
      OTokenHistory,
      expectations.oTokenHistories,
    )
    await validateExpectations(
      ctx,
      block,
      OTokenRebase,
      expectations.oTokenRebases,
    )
    await validateExpectations(
      ctx,
      block,
      OUSDDailyStat,
      expectations.ousdDailyStats,
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
      jsonify(pick(actual, Object.keys(expectation)), (_key, value) =>
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
      txHash:
        '0x8100a86ef0b23789be3ca200886e4b9cb4209e5c97e59eaf744b9181267ae4b3',
    },
    {
      id: '1-0x2a8e1e676ec238d8a992307b495b45b3feaa5e86-2021-12-06',
      chainId: 1,
      otoken: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
      date: '2021-12-06',
      blockNumber: 13750845,
      apy7DayAvg: 0.3063852155268674,
      apy30DayAvg: 0.3021672341297935,
      apy14DayAvg: 0.38192706131093695,
      apy: 0.37250920744724025,
      apr: 0.31677789277204865,
      rebasingCreditsPerToken: '836987556812892596511761169',
      timestamp: '2021-12-06T06:59:47.000000Z',
      txHash:
        '0x2d403152b1758105818fd597e03a9993c0c6308326f511d40ef856dc899bbba2',
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
      txHash:
        '0x951a57d616a98aeaeeb1df722d6c1565da20ad74fa410db95a80c28da3c88175',
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
      txHash:
        '0x5643e6f85bab24cf1057a09d20c7fa353d895d96d0c114141b6792c76c93dfc2',
      type: 'Sent',
      value: '-4999999999999999999999',
    },
  ]),
  oTokenRebases: e([
    {
      id: '1-0x2a8e1e676ec238d8a992307b495b45b3feaa5e86-0014883457-a66bb-000005',
      blockNumber: 14883457,
      feeETH: '178820559593958335',
      feeUSD: '346263724854739034559',
      rebasingCredits: '28313629639061008328884206782869381',
      rebasingCreditsPerToken: '793786451700174206240401619',
      timestamp: '2022-06-01T06:59:39.000000Z',
      txHash:
        '0xca8bb9f49e9135e81cb7f8c0876bfdce54352bbf45ceeda567144ca488ec1df5',
      totalSupply: '63608906999875802980711462',
      yieldETH: '1788205595939583356',
      yieldUSD: '3462637248547390345598',
    },
  ]),
  ousdDailyStats: e([
    {
      id: '2023-06-19',
      holdersOverThreshold: 555,
      feesUSDAllTime: '518443780713833984166537',
      feesUSD7Day: '2795514743154392531029',
      feesUSD: '516254133283871531214',
      feesETHAllTime: '210278929630796719347',
      feesETH7Day: '1645271818769497295',
      feesETH: '299347387486610177',
      dripperWETH: '0',
      blockNumber: 17515264,
      apy7DayAvg: 0.04004694410575804,
      apy30DayAvg: 0.0507262369607351,
      apy14DayAvg: 0.04238561434050587,
      apy: 0.05247056754803858,
      apr: 0.05114390222068438,
      amoSupply: '0',
      nonRebasingSupply: '9117247109542906814603812',
      rebasingSupply: '14754699093487549370944968',
      timestamp: '2023-06-19T17:25:59.000000Z',
      totalSupply: '23871946203030456185548780',
      totalSupplyUSD: 0,
      wrappedSupply: '1070892535136679523311083',
      yieldETH: '1197389549946440721',
      yieldETH7Day: '6581087275077989208',
      yieldETHAllTime: '1827815866678964531379',
      yieldUSD: '2065016533135486124859',
      yieldUSD7Day: '11182058972617570124126',
      yieldUSDAllTime: '4547849622244762681832073',
    },
    {
      id: '2023-09-25',
      feesUSDAllTime: '557455670955180080472479',
      feesUSD7Day: '2408539505622701328488',
      feesUSD: '327704746233735207946',
      feesETHAllTime: '232250310113095634904',
      feesETH7Day: '1497963059707839608',
      feesETH: '207514451227360360',
      dripperWETH: '0',
      blockNumber: 18212428,
      apy7DayAvg: 0.05434693946070146,
      apy30DayAvg: 0.05267689946449996,
      apy14DayAvg: 0.05496003977745272,
      apy: 0.052211543561102136,
      apr: 0.050897727114944225,
      amoSupply: '0',
      nonRebasingSupply: '6772299022398961480910233',
      rebasingSupply: '9198342543657099205207141',
      timestamp: '2023-09-25T11:13:23.000000Z',
      totalSupply: '15970641566056060686117374',
      totalSupplyUSD: 0,
      wrappedSupply: '79695352346338177503254',
      yieldETH: '830057804909441443',
      yieldETH7Day: '5991852238831358449',
      yieldETHAllTime: '1915701388608160193826',
      yieldUSD: '1310818984934940831786',
      yieldUSD7Day: '9634158022490805313962',
      yieldUSDAllTime: '4703897183210147067056057',
    },
    {
      id: '2024-03-02',
      feesUSDAllTime: '640842823767036278915355',
      feesUSD7Day: '3365292401878836638613',
      feesUSD: '579150934767120286041',
      feesETHAllTime: '270919962292839152887',
      feesETH7Day: '1023766060336515495',
      feesETH: '168279071355301816',
      dripperWETH: '0',
      blockNumber: 19348264,
      apy7DayAvg: 0.0607815460682393,
      apy30DayAvg: 0.06418055003707576,
      apy14DayAvg: 0.06908341133353671,
      apy: 0.074705394129575,
      apr: 0.0720536782079989,
      amoSupply: '0',
      nonRebasingSupply: '937326268136034563062459',
      rebasingSupply: '11735579881028694809662571',
      timestamp: '2024-03-02T15:05:35.000000Z',
      totalSupply: '12672906149164729372725030',
      totalSupplyUSD: 0,
      wrappedSupply: '81907611918642936108297',
      yieldETH: '673116285421207268',
      yieldETH7Day: '4095064241346062000',
      yieldETHAllTime: '2070379997327134266107',
      yieldUSD: '2316603739068481144165',
      yieldUSD7Day: '13461169607515346554469',
      yieldUSDAllTime: '5037445794457571860827906',
    },
  ]),
} as const
