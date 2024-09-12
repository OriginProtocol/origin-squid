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
      id: '2022-05-31',
      holdersOverThreshold: 792,
      feesUSDAllTime: '388571306817943400287751',
      feesUSD7Day: '2185365204644583280450',
      feesUSD: '367706874848760840671',
      feesETHAllTime: '123862044443947936019',
      feesETH7Day: '1169229003183379899',
      dripperWETH: '0',
      feesETH: '187174508847414031',
      apy7DayAvg: 0.028168972115182545,
      apy30DayAvg: 0.09025717562484387,
      apy14DayAvg: 0.030305475258120083,
      apy: 0.03442248411037707,
      apr: 0.03384485258987047,
      amoSupply: '0',
      marketCapUSD: 0,
      nonRebasingSupply: '27883775054280824221275245',
      pegPrice: '0',
      rebasingSupply: '35721669308346431369090619',
      timestamp: '2022-05-31T23:53:36.000000Z',
      totalSupply: '63605444362627255590365864',
      totalSupplyUSD: 0,
      tradingVolumeUSD: 0,
      wrappedSupply: '4226368208095469416728',
      yieldETH: '1684570579626726283',
      yieldETH7Day: '10523061028650419114',
      yieldETHAllTime: '1114758399995531425834',
      yieldUSD: '3309361873638847566043',
      yieldUSD7Day: '19668286841801249524100',
      yieldUSDAllTime: '3497141761361490602591464',
      blockNumber: 14881649,
    },
    {
      id: '2023-01-17',
      holdersOverThreshold: 562,
      feesUSDAllTime: '451582174020037177649706',
      feesUSD7Day: '1603487853671879697004',
      feesUSD: '194310381691037524902',
      feesETHAllTime: '171192372143302471426',
      feesETH7Day: '1082711286197683328',
      dripperWETH: '0',
      feesETH: '124441472526377386',
      apy7DayAvg: 0.04278201298510487,
      apy30DayAvg: 0.040567682510963717,
      apy14DayAvg: 0.04326144397430006,
      apy: 0.03627942350281099,
      apr: 0.035638559845426576,
      amoSupply: '0',
      marketCapUSD: 0,
      nonRebasingSupply: '35355054095227703856760328',
      pegPrice: '0',
      rebasingSupply: '18189823866426845541330666',
      timestamp: '2023-01-17T19:58:47.000000Z',
      totalSupply: '53544877961654549398090994',
      totalSupplyUSD: 0,
      tradingVolumeUSD: 0,
      wrappedSupply: '28044077608633124799856',
      yieldETH: '1119973252737396478',
      yieldETH7Day: '9744401575779149991',
      yieldETHAllTime: '1540731349289722245851',
      yieldUSD: '1748793435219337724123',
      yieldUSD7Day: '14431390683046917273074',
      yieldUSDAllTime: '4064239566180334598850438',
      blockNumber: 16428764,
    },
  ]),
} as const
