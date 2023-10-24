import { Entity, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { sortBy } from 'lodash'

import {
  OETHAPY,
  OETHHistory,
  OETHMorphoAave,
  OETHRebase,
  OETHVault,
  StrategyBalance,
} from '../../model'
import { Block, Context } from '../../processor'
import { jsonify } from '../../utils/jsonify'

export const name = 'validate-oeth'

let firstBlock = true

export const process = async (ctx: Context) => {
  for (const block of ctx.blocks) {
    await validateExpectations(ctx, block, OETHAPY, expectations.oethApies)
    await validateExpectations(
      ctx,
      block,
      OETHHistory,
      expectations.oethHistories,
    )
    await validateExpectations(ctx, block, OETHRebase, expectations.oethRebases)
    await validateExpectations(ctx, block, OETHVault, expectations.oethVaults)
    await validateExpectations(
      ctx,
      block,
      OETHMorphoAave,
      expectations.oethMorphoAave,
    )
    await validateExpectations(
      ctx,
      block,
      StrategyBalance,
      expectations.strategyBalances,
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
  assert.deepEqual(JSON.parse(jsonify(actual)), expectation)
  ctx.log.info(`Validated entity: Entity=${Class.name} id=${expectation.id}`)
}

const e = (arr: any[]) => {
  return sortBy(arr, (v) => v.blockNumber)
}

const expectations = {
  oethApies: e([
    {
      id: '2023-06-25',
      blockNumber: 17559113,
      timestamp: '2023-06-25T21:18:47.000000Z',
      txHash:
        '0x43ce3a8d77ab8d0ec80e1929c6e2490ef2aeb5563c5f9f17a83a0467ebc13182',
      rebasingCreditsPerToken: '964774349509154447326281289',
      apy7DayAvg: 0.09953001952183743,
      apy30DayAvg: 0.1087649234534527,
      apy14DayAvg: 0.1077996886609001,
      apy: 0.08976154125067537,
      apr: 0.08596862227645369,
    },
    {
      id: '2023-08-01',
      blockNumber: 17822414,
      timestamp: '2023-08-01T20:03:11.000000Z',
      txHash:
        '0xdb0d39ba852986922f1aac3287a1e6cf47e60e45681011f6e778cfc2be8e8a89',
      rebasingCreditsPerToken: '957036931267910885633239775',
      apy7DayAvg: 0.07675027302663857,
      apy30DayAvg: 0.09497559027581592,
      apy14DayAvg: 0.08339748368809696,
      apy: 0.043503105119109486,
      apr: 0.04258725623671474,
    },
    {
      id: '2023-08-24',
      blockNumber: 17982932,
      timestamp: '2023-08-24T06:59:47.000000Z',
      txHash:
        '0x7e3babd3c816f676e14409077a955796de0f30dbd72b26ca103b618ca3cc85dd',
      rebasingCreditsPerToken: '952455810812982773029042302',
      apy7DayAvg: 0.09684362917504816,
      apy30DayAvg: 0.08341071009644238,
      apy14DayAvg: 0.08959106507297927,
      apy: 0.08723340962362891,
      apr: 0.08364588976198084,
    },
    {
      id: '2023-09-19',
      blockNumber: 18168332,
      timestamp: '2023-09-19T07:00:23.000000Z',
      txHash:
        '0x100ed769fccd330bde46eef786676ab664088f0df2fa65bfea471864a1f5ad6c',
      rebasingCreditsPerToken: '947329020791392212393605891',
      apy7DayAvg: 0.08259288698447587,
      apy30DayAvg: 0.08029158038417668,
      apy14DayAvg: 0.08154501471752601,
      apy: 0.09203689283640748,
      apr: 0.08805527839701369,
    },
    {
      id: '2023-10-22',
      blockNumber: 18404209,
      timestamp: '2023-10-22T06:59:47.000000Z',
      txHash:
        '0x1eab96d75579c8050869ffadec5d38bccf8a9714f49d6e27ce67088f15be0535',
      rebasingCreditsPerToken: '941672759591769536254510513',
      apy7DayAvg: 0.05113846400982916,
      apy30DayAvg: 0.06959144820278103,
      apy14DayAvg: 0.0517046369648323,
      apy: 0.042174184267448345,
      apr: 0.04131142884407507,
    },
  ]),
  oethHistories: e([
    {
      id: '0017448122-000001-2db00-2',
      blockNumber: 17448122,
      timestamp: '2023-06-10T06:53:47.000000Z',
      balance: '54269081655259431188',
      type: 'Received',
      txHash:
        '0x334a2c2d69205ed97c205ff0efd3ff54f19c9acb23a8393f4d2aaebedfb630da',
      value: '-4528428283779551001',
    },
    {
      id: '0017981349-000279-11920-2',
      blockNumber: 17981349,
      timestamp: '2023-08-24T01:40:59.000000Z',
      balance: '16567405974344349682',
      type: 'Received',
      txHash:
        '0xd44c412b9ca902289beaf0fbb8c69b2ea03b7e7f08eb22f4a7d04ebdd1bc1aa8',
      value: '349963057927172181',
    },
    {
      id: '0018210827-000166-9ac57-1',
      blockNumber: 18210827,
      timestamp: '2023-09-25T05:50:47.000000Z',
      balance: '0',
      type: 'Received',
      txHash:
        '0x43ab72d152cb130b7b4689199ebaea37c8e5b40f15d6afc6c4a27afe857ec24b',
      value: '0',
    },
    {
      id: '0018411970-000151-b09fb-2',
      blockNumber: 18411970,
      timestamp: '2023-10-23T09:07:11.000000Z',
      balance: '2500600214692767585',
      type: 'Received',
      txHash:
        '0xb38699895ac1eed36ec3dea56be4038b2d7fa6ff83ac3a4e099459b0352236ed',
      value: '1999431151658221182',
    },
    {
      id: '0017325665-000222-bb52b-1',
      blockNumber: 17325665,
      timestamp: '2023-05-24T01:03:35.000000Z',
      balance: '1518502560492495675505',
      type: 'Received',
      txHash:
        '0x8e113b649e739f98f5e4459cbb64da9186a6dbf9d3ad0e5d73bb13afe1e4f46b',
      value: '262499999999999999999',
    },
    {
      id: '0017481076-000107-fbce2-2',
      blockNumber: 17481076,
      timestamp: '2023-06-14T22:14:35.000000Z',
      balance: '53423263935262651794',
      type: 'Sent',
      txHash:
        '0x97e569e4e0fb12f2cb15687db00b26ec8f8e42020795d6cecd54d7a0fdda3639',
      value: '-120019220020411503',
    },
    {
      id: '0017760559-000231-5d794-2',
      blockNumber: 17760559,
      timestamp: '2023-07-24T04:23:35.000000Z',
      balance: '41923787891862932559',
      type: 'Sent',
      txHash:
        '0x65b4e86f3ea5f5173917b98151c7b136e35c37849c9be53f606f2bb4d62c2e61',
      value: '0',
    },
    {
      id: '0018348957-000120-213ab-2',
      blockNumber: 18348957,
      timestamp: '2023-10-14T13:36:11.000000Z',
      balance: '0',
      type: 'Sent',
      txHash:
        '0xb157fe3ef2ceb1c6b238842e29a62c5b9a2dc6b4f958ab35f54a2041c2e75af7',
      value: '-865307408847667252',
    },
    {
      id: '0017516713-000203-0dfcb-1',
      blockNumber: 17516713,
      timestamp: '2023-06-19T22:20:23.000000Z',
      balance: '0',
      type: 'Sent',
      txHash:
        '0x2bfa5f354ca845e515dec129578ff2e37e4c218edcd34539a7cf0e2de7e66a25',
      value: '0',
    },
    {
      id: '0017527550-000129-f42c5-2',
      blockNumber: 17527550,
      timestamp: '2023-06-21T10:50:23.000000Z',
      balance: '5688157047270493570549',
      type: 'Sent',
      txHash:
        '0xbf4c60a70a47998ed7360b28851e06c2c73a162023b76e4b4f5097283f4583c2',
      value: '-16980807390958917240',
    },
    {
      id: '0017189726-000506-2d30f-2',
      blockNumber: 17189726,
      timestamp: '2023-05-04T20:37:59.000000Z',
      balance: '0',
      type: 'Swap',
      txHash:
        '0x5ba5b845a1829863756e2af0572d70121cee13968e6f260fcbf1169986a8f811',
      value: '0',
    },
    {
      id: '0017385450-000357-946e1-2',
      blockNumber: 17385450,
      timestamp: '2023-06-01T10:45:35.000000Z',
      balance: '0',
      type: 'Swap',
      txHash:
        '0x9ee048bf89bf92783a9cb3e0a01eff8775728c5a81cb1e3233172721f43f1414',
      value: '0',
    },
    {
      id: '0017444613-000265-2962b-1',
      blockNumber: 17444613,
      timestamp: '2023-06-09T19:02:35.000000Z',
      balance: '0',
      type: 'Swap',
      txHash:
        '0x0bacb249d1562bdd43cfa8d5dfc3396f1792fc56887907039943ed610abaca44',
      value: '0',
    },
    {
      id: '0017760876-000137-ffcd8-1',
      blockNumber: 17760876,
      timestamp: '2023-07-24T05:27:47.000000Z',
      balance: '0',
      type: 'Swap',
      txHash:
        '0xf5cc833f7e762f48c8213490f26a5341bf866673bee7e89357858c3558c7602d',
      value: '0',
    },
    {
      id: '0017997221-000140-78424-1',
      blockNumber: 17997221,
      timestamp: '2023-08-26T07:01:11.000000Z',
      balance: '10881483809262264875',
      type: 'Swap',
      txHash:
        '0x2e85b0cc1b6f85aebb26cc45d620fcf521ce901f6f5b662cb62b34c2c8c866e1',
      value: '988832714543348663',
    },
    {
      id: '0017193191-000115-fbe27-15',
      blockNumber: 17193191,
      timestamp: '2023-05-05T08:17:59.000000Z',
      balance: '22535751744063969467',
      type: 'Yield',
      txHash:
        '0x4dbda6d0b12c71f9d438a47210f2d348422e83928461f859eaa37f8aea501f56',
      value: '154429314564162',
    },
    {
      id: '0017275142-000249-3edd0-16',
      blockNumber: 17275142,
      timestamp: '2023-05-16T22:13:35.000000Z',
      balance: '30095268186371063',
      type: 'Yield',
      txHash:
        '0x4d7959cda3ca1699caf7179d20ccf5294856970f6fd79a5628a0e0384e8d2113',
      value: '2388892809',
    },
    {
      id: '0017275823-000272-843af-14',
      blockNumber: 17275823,
      timestamp: '2023-05-17T00:30:35.000000Z',
      balance: '4798484031005241244',
      type: 'Yield',
      txHash:
        '0x2f62cd6ab307233ca751ee0264f03cca302390f9ee60914992196e7e6a64f4b2',
      value: '38308162641651',
    },
    {
      id: '0017277825-000185-fadc4-34',
      blockNumber: 17277825,
      timestamp: '2023-05-17T07:17:35.000000Z',
      balance: '35147348289421819',
      type: 'Yield',
      txHash:
        '0xb7c484f2d2625e0354c7e29b3c345a71e0419afb07152febee9cdc963a6ead52',
      value: '11972581721',
    },
    {
      id: '0017283378-000634-fde11-45',
      blockNumber: 17283378,
      timestamp: '2023-05-18T02:09:23.000000Z',
      balance: '3000311847766043460',
      type: 'Yield',
      txHash:
        '0xda99a68fd12da72f11d68e5997fa1cccea120a4e5a5b71d2e660785ddf5251ab',
      value: '157970456472902',
    },
  ]),
  oethRebases: e([
    {
      id: '0017305345-000456-5f62d',
      blockNumber: 17305345,
      timestamp: '2023-05-21T04:22:11.000000Z',
      fee: '6000055597516131',
      rebasingCredits: '2787113542887662778878885791818',
      rebasingCreditsPerToken: '973864011520629021168619646',
      totalSupply: '4100236147122104146565',
      txHash:
        '0x7de27a14c9f139d9019e6f067dc926de5a1318d1c8703696d1f87c7e11b405eb',
      yield: '30000277987580656',
    },
    {
      id: '0017331591-000369-f9f77',
      blockNumber: 17331591,
      timestamp: '2023-05-24T21:02:59.000000Z',
      fee: '6492737577781034',
      rebasingCredits: '3677621799805326022027580379682',
      rebasingCreditsPerToken: '972810711211478539104302424',
      totalSupply: '5393628338867046745384',
      txHash:
        '0x651848930f76eb8677a2d90067841ae1d5419276dafb7828d145eeb482b362cc',
      yield: '32463687888905171',
    },
    {
      id: '0017583331-000121-dccba',
      blockNumber: 17583331,
      timestamp: '2023-06-29T07:00:23.000000Z',
      fee: '577769460917579313',
      rebasingCredits: '11978493735413759353827056755312',
      rebasingCreditsPerToken: '963907687618519656276956464',
      totalSupply: '21187279626610714331049',
      txHash:
        '0xe9261579ff7ccbbbe0cc5895a376c8177409a8a0503acf3bf04ee106ccb9c540',
      yield: '2888847304587896566',
    },
    {
      id: '0018139997-000303-52abd',
      blockNumber: 18139997,
      timestamp: '2023-09-15T06:59:59.000000Z',
      fee: '1190995054063049444',
      rebasingCredits: '22395831398283302999639860139823',
      rebasingCreditsPerToken: '948155891702979766036181091',
      totalSupply: '44971365122525849270172',
      txHash:
        '0xb3441c6184326378fe98af3cb3e425c015a5a2cce4d0055f2e8c3b0dc1bcdd98',
      yield: '5954975270315247221',
    },
    {
      id: '0018404209-000053-b6b49',
      blockNumber: 18404209,
      timestamp: '2023-10-22T06:59:47.000000Z',
      fee: '885619331985372380',
      rebasingCredits: '29496888949221038689228739185366',
      rebasingCreditsPerToken: '941672759591769536254510513',
      totalSupply: '41530447614871349372266',
      txHash:
        '0x1eab96d75579c8050869ffadec5d38bccf8a9714f49d6e27ce67088f15be0535',
      yield: '4428096659926861900',
    },
  ]),
  oethVaults: e([
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
  ]),
  oethMorphoAave: e([
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
  ]),
  strategyBalances: e([
    // Place verified strategy balances in here.
  ]),
} as const
