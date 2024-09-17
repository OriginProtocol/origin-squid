import assert from 'assert'
import { pick, sortBy } from 'lodash'

import { OTokenHistory, OTokenRebase, OUSDDailyStat, StrategyYield } from '@model'
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
    await validateExpectations(ctx, block, StrategyYield, expectations.strategyYields)
    await validateExpectations(ctx, block, OTokenHistory, expectations.oTokenHistories)
    await validateExpectations(ctx, block, OTokenRebase, expectations.oTokenRebases)
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
  // We decide to only care about float decimal accuracy to the 8th.
  assert.deepEqual(
    JSON.parse(
      jsonify(pick(actual, Object.keys(expectation)), (_key, value) =>
        typeof value === 'number' ? Number(value.toFixed(8)) : value,
      ),
    ),
    JSON.parse(jsonify(expectation, (_key, value) => (typeof value === 'number' ? Number(value.toFixed(8)) : value))),
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
      txHash: '0x8100a86ef0b23789be3ca200886e4b9cb4209e5c97e59eaf744b9181267ae4b3',
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
      txHash: '0x2d403152b1758105818fd597e03a9993c0c6308326f511d40ef856dc899bbba2',
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
  ousdDailyStats: e([
    {
      id: '2021-12-17',
      holdersOverThreshold: 687,
      feesUSDAllTime: '59939169997049755367246',
      feesUSD7Day: '12605055186180748608847',
      feesUSD: '1670589006808677839786',
      feesETHAllTime: '14091491199663039668',
      feesETH7Day: '3190580923884018186',
      dripperWETH: '0',
      feesETH: '423827876265115507',
      apy7DayAvg: 0.15894427812897968,
      apy30DayAvg: 0.30439887514753666,
      apy14DayAvg: 0.2418631929308643,
      apy: 0.11381463834604988,
      apr: 0.10780664168646359,
      amoSupply: '0',
      marketCapUSD: 0,
      nonRebasingSupply: '222342278264565565928323669',
      pegPrice: '0',
      rebasingSupply: '50969406955931552234477326',
      timestamp: '2021-12-17T23:56:53.000000Z',
      totalSupply: '273311685220497118162800995',
      totalSupplyUSD: 0,
      tradingVolumeUSD: 0,
      wrappedSupply: '0',
      yieldETH: '3814450886386039570',
      yieldETH7Day: '28715228314956163737',
      yieldETHAllTime: '126823420796967357521',
      yieldUSD: '15035301061278100558077',
      yieldUSD7Day: '113445496675626737479694',
      yieldUSDAllTime: '539452529973447798305736',
      blockNumber: 13825714,
    },
    {
      yieldUSDAllTime: '1311283975671287992227093',
      yieldUSD7Day: '619689672997345417796846',
      yieldUSD: '1783648991262064261222',
      yieldETHAllTime: '337913562027090356981',
      yieldETH7Day: '172655260371650923573',
      yieldETH: '555057293237191827',
      tradingVolumeUSD: 0,
      totalSupplyUSD: 0,
      wrappedSupply: '0',
      totalSupply: '278717783007542940600491379',
      timestamp: '2022-01-08T23:39:46.000000Z',
      rebasingSupply: '68716537068168416849045404',
      pegPrice: '0',
      nonRebasingSupply: '210001245939374523751445975',
      marketCapUSD: 0,
      id: '2022-01-08',
      holdersOverThreshold: 835,
      feesUSDAllTime: '145698219519031999136273',
      feesUSD7Day: '68854408110816157532976',
      feesUSD: '198183221251340473469',
      feesETH7Day: '19183917819072324835',
      feesETH: '61673032581910203',
      dripperWETH: '0',
      feesETHAllTime: '37545951336343372927',
      blockNumber: 13967839,
      apy7DayAvg: 1.2359382941222326,
      apy30DayAvg: 0.3684241495684772,
      apy14DayAvg: 0.6051867443880607,
      apy: 0.009432457648751225,
      apr: 0.009388370452224348,
      amoSupply: '0',
    },
    {
      yieldUSDAllTime: '1682004095006152481383332',
      yieldUSD7Day: '224482678946860590615362',
      yieldUSD: '33583092140622430099386',
      yieldETHAllTime: '452869208117364765698',
      yieldETH7Day: '69950178360756721418',
      yieldETH: '11788766671127947679',
      tradingVolumeUSD: 0,
      totalSupplyUSD: 0,
      wrappedSupply: '0',
      totalSupply: '264378823699738345588442745',
      timestamp: '2022-01-21T23:57:28.000000Z',
      rebasingSupply: '75223139034557150938696879',
      pegPrice: '0',
      nonRebasingSupply: '189155684665181194649745866',
      marketCapUSD: 0,
      id: '2022-01-21',
      holdersOverThreshold: 906,
      feesUSDAllTime: '186889343889572497931400',
      feesUSD7Day: '24942519882984510068367',
      feesUSD: '3731454682291381122153',
      feesETH7Day: '7772242040084080152',
      feesETH: '1309862963458660852',
      dripperWETH: '0',
      feesETHAllTime: '50318800901929418332',
      blockNumber: 14051973,
      apy7DayAvg: 0.18326330478210992,
      apy30DayAvg: 0.363845886326651,
      apy14DayAvg: 0.1583000259419563,
      apy: 0.18040094050222555,
      apr: 0.1658918224081249,
      amoSupply: '0',
    },
  ]),
} as const
