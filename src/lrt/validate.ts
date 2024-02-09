import { Entity, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { sortBy } from 'lodash'

import { LRTPointRecipientHistory, LRTSummary } from '../model'
import { Block, Context } from '../processor'
import { env } from '../utils/env'
import { jsonify } from '../utils/jsonify'

export const name = 'validate'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
  for (const block of ctx.blocks) {
    await validateExpectations(
      ctx,
      block,
      LRTSummary,
      expectations.lrtSummaries,
    )
    await validateExpectations(
      ctx,
      block,
      LRTPointRecipientHistory,
      expectations.lrtPointRecipientHistory,
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
  lrtSummaries: e([
    {
      id: '0019166085-edcef',
      blockNumber: 19166085,
      timestamp: '2024-02-06T02:00:11.000Z',
      points: '2672325507512817972374837075',
      elPoints: '36324188090338929198927',
      balance: '8334746792825522021313',
    },
    {
      id: '0019166381-29e27',
      blockNumber: 19166381,
      timestamp: '2024-02-06T03:00:11.000Z',
      points: '3149113938270375048001805640',
      elPoints: '44583277713572466088012',
      balance: '8356644840910364276715',
    },
    {
      id: '0019167875-45547',
      blockNumber: 19167875,
      timestamp: '2024-02-06T08:00:11.000Z',
      points: '5536965117244154128649493305',
      elPoints: '85878725829740150525177',
      balance: '8392904024018801932697',
    },
    {
      id: '0019168171-0ba0d',
      blockNumber: 19168171,
      timestamp: '2024-02-06T09:00:11.000Z',
      points: '6015847448723452686672752210',
      elPoints: '94153083079015894818671',
      balance: '8394903735597264441651',
    },
    {
      id: '0019168470-411fb',
      blockNumber: 19168470,
      timestamp: '2024-02-06T10:00:11.000Z',
      points: '6494819350694968866042963210',
      elPoints: '102467356892763434404283',
      balance: '8399153136840707236525',
    },
    {
      id: '0019168766-e640f',
      blockNumber: 19168766,
      timestamp: '2024-02-06T11:00:11.000Z',
      points: '6974064145537862845183906270',
      elPoints: '110781630706510973989895',
      balance: '8401609887634694351974',
    },
    {
      id: '0019169063-3b0f1',
      blockNumber: 19169063,
      timestamp: '2024-02-06T12:00:23.000Z',
      points: '7454947151389658945895890789',
      elPoints: '119123618766304338704687',
      balance: '8402519756402894793545',
    },
    {
      id: '0019170836-425c3',
      blockNumber: 19170836,
      timestamp: '2024-02-06T18:00:11.000Z',
      points: '10332979902410256305291924617',
      elPoints: '168981547402743751080864',
      balance: '8422405482898549977946',
    },
    {
      id: '0019171134-1c5c1',
      blockNumber: 19171134,
      timestamp: '2024-02-06T19:00:11.000Z',
      points: '10813317121811029068938843772',
      elPoints: '177295821216491290666476',
      balance: '8423095798725294042525',
    },
    {
      id: '0019171430-5730f',
      blockNumber: 19171430,
      timestamp: '2024-02-06T20:00:11.000Z',
      points: '11293891372533557028395470897',
      elPoints: '185610095030238830252088',
      balance: '8471120582432800180376',
    },
    {
      id: '0019175583-6b912',
      blockNumber: 19175583,
      timestamp: '2024-02-07T10:00:11.000Z',
      points: '17112074194551081902699217567',
      elPoints: '303219303406174497624068',
      balance: '8539207764597013750746',
    },
    {
      id: '0019175880-3ea11',
      blockNumber: 19175880,
      timestamp: '2024-02-07T11:00:11.000Z',
      points: '17501192737649237758178825411',
      elPoints: '311700372922880617947441',
      balance: '8539707649111912468766',
    },
    {
      id: '0019176177-01b05',
      blockNumber: 19176177,
      timestamp: '2024-02-07T12:00:11.000Z',
      points: '17890324611422714174407626712',
      elPoints: '320182642439586738270813',
      balance: '8539907090938056324285',
    },
    {
      id: '0019176474-42e0a',
      blockNumber: 19176474,
      timestamp: '2024-02-07T13:00:11.000Z',
      points: '18279492122592847702630438348',
      elPoints: '328665711956292858594186',
      balance: '8540906855932307355903',
    },
    {
      id: '0019176769-3b692',
      blockNumber: 19176769,
      timestamp: '2024-02-07T14:00:11.000Z',
      points: '18668667840790252407073380952',
      elPoints: '337148781472998978917559',
      balance: '8541006832431732459064',
    },
    {
      id: '0019179747-25451',
      blockNumber: 19179747,
      timestamp: '2024-02-08T00:00:11.000Z',
      points: '22560255834671812368953409404',
      elPoints: '421983441361964742932494',
      balance: '8542367747624284021714',
    },
    {
      id: '0019180038-cdec8',
      blockNumber: 19180038,
      timestamp: '2024-02-08T01:00:11.000Z',
      points: '22852159066464762577064015484',
      elPoints: '430469239314826391895627',
      balance: '8543097416883609892245',
    },
    {
      id: '0019180335-cb136',
      blockNumber: 19180335,
      timestamp: '2024-02-08T02:00:11.000Z',
      points: '23144066668635577573558150399',
      elPoints: '438955598045425159900359',
      balance: '8543676420105225831926',
    },
    {
      id: '0019180632-7ac41',
      blockNumber: 19180632,
      timestamp: '2024-02-08T03:00:11.000Z',
      points: '23436028603606741501599059503',
      elPoints: '447441956776023927905091',
      balance: '8566694756048615723342',
    },
    {
      id: '0019180924-ce090',
      blockNumber: 19180924,
      timestamp: '2024-02-08T04:00:11.000Z',
      points: '23732550709563711636663186724',
      elPoints: '456003033385945905500354',
      balance: '8711811804686321300176',
    },
    {
      id: '0019181220-fe9a3',
      blockNumber: 19181220,
      timestamp: '2024-02-08T05:00:11.000Z',
      points: '24029238668695189225210855543',
      elPoints: '464654210967992929973631',
      balance: '8713270261840954879870',
    },
    {
      id: '0019182712-3fe58',
      blockNumber: 19182712,
      timestamp: '2024-02-08T10:00:11.000Z',
      points: '25519287140526405241356793459',
      elPoints: '508045512650897256145948',
      balance: '8773659698262668873448',
    },
    {
      id: '0019183011-49ba6',
      blockNumber: 19183011,
      timestamp: '2024-02-08T11:00:11.000Z',
      points: '25818051734304075007194324910',
      elPoints: '516753953443265220696602',
      balance: '8776675189728616986051',
    },
    {
      id: '0019183310-81728',
      blockNumber: 19183310,
      timestamp: '2024-02-08T12:00:11.000Z',
      points: '26116873283480519740602726610',
      elPoints: '525465983159515662409871',
      balance: '8776675189728616986051',
    },
    {
      id: '0019183606-af405',
      blockNumber: 19183606,
      timestamp: '2024-02-08T13:00:11.000Z',
      points: '26415739742023776969697613590',
      elPoints: '534182340695742032485511',
      balance: '8779194246285290895315',
    },
    {
      id: '0019183903-75629',
      blockNumber: 19183903,
      timestamp: '2024-02-08T14:00:11.000Z',
      points: '26714636918235462143386561390',
      elPoints: '542899867804247848892421',
      balance: '8779269165206310930403',
    },
    {
      id: '0019184196-74472',
      blockNumber: 19184196,
      timestamp: '2024-02-08T15:00:11.000Z',
      points: '27013548099513442131262978300',
      elPoints: '551618805279325938835682',
      balance: '8865152299926417932683',
    },
    {
      id: '0019184492-b4ffc',
      blockNumber: 19184492,
      timestamp: '2024-02-08T16:00:11.000Z',
      points: '27312631928665769160758065065',
      elPoints: '560337742754404028778943',
      balance: '8871096165600175459417',
    },
    {
      id: '0019184790-ca592',
      blockNumber: 19184790,
      timestamp: '2024-02-08T17:00:11.000Z',
      points: '27611794703739413010337726065',
      elPoints: '569056680229482118722204',
      balance: '8871096165600175459417',
    },
    {
      id: '0019185087-e688f',
      blockNumber: 19185087,
      timestamp: '2024-02-08T18:00:11.000Z',
      points: '27910987937581631603247255538',
      elPoints: '577775617704560208665465',
      balance: '8871096165600175459417',
    },
    {
      id: '0019185980-8d5c6',
      blockNumber: 19185980,
      timestamp: '2024-02-08T21:00:11.000Z',
      points: '28838381241917005873236926302',
      elPoints: '603932430129794478486528',
      balance: '8872045960720471481441',
    },
  ]),
  lrtPointRecipientHistory: e([
    {
      id: '19150363:0xd85a569f3c26f81070544451131c742283360400',
      timestamp: '2024-02-03T21:00:11.000Z',
      blockNumber: 19150363,
      balance: '10000000000000000',
      points: '0',
      pointsDate: '2024-02-03T21:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19159856:0x09fddbbaf37b19ca477649aeef6f4bb46b3dfb7b',
      timestamp: '2024-02-05T05:00:11.000Z',
      blockNumber: 19159856,
      balance: '50487717154427',
      points: '0',
      pointsDate: '2024-02-05T05:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19160451:0x0693e566e00d95edea67deb414e49c17768d6596',
      timestamp: '2024-02-05T07:00:11.000Z',
      blockNumber: 19160451,
      balance: '739718750311937',
      points: '0',
      pointsDate: '2024-02-05T07:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19162525:0x8b18657595cd99954cafcd9b126b5b2f9233fab9',
      timestamp: '2024-02-05T14:00:11.000Z',
      blockNumber: 19162525,
      balance: '20000000000000000',
      points: '0',
      pointsDate: '2024-02-05T14:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19162525:0xa9aebf6c32c4ff24dd67785d57608f0c4fc79960',
      timestamp: '2024-02-05T14:00:11.000Z',
      blockNumber: 19162525,
      balance: '637200101867437467',
      points: '0',
      pointsDate: '2024-02-05T14:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19162525:0x8d1cdd26bab908eb966400e96039b0a6ba75eb35',
      timestamp: '2024-02-05T14:00:11.000Z',
      blockNumber: 19162525,
      balance: '109970260142225114',
      points: '0',
      pointsDate: '2024-02-05T14:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19162820:0xd683cbeb396b460e1866c1504ab2661b544d74af',
      timestamp: '2024-02-05T15:00:11.000Z',
      blockNumber: 19162820,
      balance: '148007525355600511',
      points: '0',
      pointsDate: '2024-02-05T15:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19162820:0x8d1cdd26bab908eb966400e96039b0a6ba75eb35',
      timestamp: '2024-02-05T15:00:11.000Z',
      blockNumber: 19162820,
      balance: '109970260142225114',
      points: '0',
      pointsDate: '2024-02-05T15:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19163115:0x6f167b86443d04f4b1705a0c78b6cc6ac691e381',
      timestamp: '2024-02-05T16:00:11.000Z',
      blockNumber: 19163115,
      balance: '8497294169670276',
      points: '0',
      pointsDate: '2024-02-05T16:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19163409:0x187a4165efb41709ae0b52ccf7950b3eb9169bf8',
      timestamp: '2024-02-05T17:00:11.000Z',
      blockNumber: 19163409,
      balance: '4999989813903566984',
      points: '0',
      pointsDate: '2024-02-05T17:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19164298:0x3bcb74dde1459f4fcb36615a3ec74786bb1b904f',
      timestamp: '2024-02-05T20:00:11.000Z',
      blockNumber: 19164298,
      balance: '3500147226088588876',
      points: '641693658116241387270',
      pointsDate: '2024-02-05T20:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19164298:0xd1173e79ca3eb3859e36fbc07a92b2ebdba13528',
      timestamp: '2024-02-05T20:00:11.000Z',
      blockNumber: 19164298,
      balance: '1092842267799548239',
      points: '200354415763250539620',
      pointsDate: '2024-02-05T20:00:11.000Z',
      elPoints: '0',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19164892:0x339a263df676046502c28ee1d87abcc2af366359',
      timestamp: '2024-02-05T22:00:11.000Z',
      blockNumber: 19164892,
      balance: '16063644833409673',
      points: '1930582381561952533788',
      pointsDate: '2024-02-05T22:00:11.000Z',
      elPoints: '3590788497890365',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19164892:0x9227dff3a69cac5bc42984256588c88d1581237b',
      timestamp: '2024-02-05T22:00:11.000Z',
      blockNumber: 19164892,
      balance: '446572079769821914',
      points: '53670521120336430376140',
      pointsDate: '2024-02-05T22:00:11.000Z',
      elPoints: '99824535723134904',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19166085:0x0fde32a92d1b4f2a182a757704facfb3f09478da',
      timestamp: '2024-02-06T02:00:11.000Z',
      blockNumber: 19166085,
      balance: '39997274198308408942',
      points: '9112095680204041897315748',
      pointsDate: '2024-02-06T02:00:11.000Z',
      elPoints: '94504571619028364453',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19167278:0x07afdb837e1157ba18c5f99b3ef7904b65e45885',
      timestamp: '2024-02-06T06:00:11.000Z',
      blockNumber: 19167278,
      balance: '3030844910829731347',
      points: '1545032126390943920796880',
      pointsDate: '2024-02-06T06:00:11.000Z',
      elPoints: '20452767846989391189',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19167577:0xb42d9b70b8090976a41ec48c475f2c5a9f6028c6',
      timestamp: '2024-02-06T07:00:11.000Z',
      blockNumber: 19167577,
      balance: '51979875271814150',
      points: '30676067780203542566598',
      pointsDate: '2024-02-06T07:00:11.000Z',
      elPoints: '402082228734024474',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19168470:0x68a611ed2791ffffa54b5d107eb8e567171b3251',
      timestamp: '2024-02-06T10:00:11.000Z',
      blockNumber: 19168470,
      balance: '23761031623021827647',
      points: '18117261889772468629133892',
      pointsDate: '2024-02-06T10:00:11.000Z',
      elPoints: '237141937824351530971',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19168766:0x659c92a1c1050684ab6dac7755dc4f35912bd5de',
      timestamp: '2024-02-06T11:00:11.000Z',
      blockNumber: 19168766,
      balance: '109992504045348123',
      points: '86910882606165279192798',
      pointsDate: '2024-02-06T11:00:11.000Z',
      elPoints: '1206637816594705708',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19168766:0xeca944e6531f12c1074891b8d0205a94ef9c7ce2',
      timestamp: '2024-02-06T11:00:11.000Z',
      blockNumber: 19168766,
      balance: '99953554098440715',
      points: '78978578419644315972789',
      pointsDate: '2024-02-06T11:00:11.000Z',
      elPoints: '1096508705979624673',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
    {
      id: '19169356:0xf35913d6ddf60ab370b21ba11091d374f13e7546',
      timestamp: '2024-02-06T13:00:11.000Z',
      blockNumber: 19169356,
      balance: '22735769383904550285',
      points: '21250223685597470491692851',
      pointsDate: '2024-02-06T13:00:11.000Z',
      elPoints: '294486942448738237311',
      referralPoints: '0',
      referralCount: 0,
      referrerCount: 0,
    },
  ]),
} as const
