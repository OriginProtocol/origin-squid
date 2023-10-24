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
      timestamp: '2023-06-25T21:18:47.000Z',
      txHash:
        '0x43ce3a8d77ab8d0ec80e1929c6e2490ef2aeb5563c5f9f17a83a0467ebc13182',
      rebasingCreditsPerToken: '964774349509154447326281289',
      apy7DayAvg: 0.09953001952182788,
      apy30DayAvg: 0.10876492345344473,
      apy14DayAvg: 0.1077996886608841,
      apy: 0.08976154125067537,
      apr: 0.08596862227643688,
    },
    {
      id: '2023-08-01',
      blockNumber: 17822414,
      timestamp: '2023-08-01T20:03:11.000000Z',
      txHash:
        '0xdb0d39ba852986922f1aac3287a1e6cf47e60e45681011f6e778cfc2be8e8a89',
      rebasingCreditsPerToken: '957036931267910885633239775',
      apy7DayAvg: 0.07675027302663752,
      apy30DayAvg: 0.09497559027580538,
      apy14DayAvg: 0.08339748368809637,
      apy: 0.043503105119109486,
      apr: 0.0425872562366986,
    },
    {
      id: '2023-08-24',
      blockNumber: 17982932,
      timestamp: '2023-08-24T06:59:47.000000Z',
      txHash:
        '0x7e3babd3c816f676e14409077a955796de0f30dbd72b26ca103b618ca3cc85dd',
      rebasingCreditsPerToken: '952455810812982773029042302',
      apy7DayAvg: 0.09684362917507827,
      apy30DayAvg: 0.08341071009645365,
      apy14DayAvg: 0.08959106507298947,
      apy: 0.08723340962362891,
      apr: 0.08364588976201764,
    },
    {
      id: '2023-09-19',
      blockNumber: 18168332,
      timestamp: '2023-09-19T07:00:23.000Z',
      txHash:
        '0x100ed769fccd330bde46eef786676ab664088f0df2fa65bfea471864a1f5ad6c',
      rebasingCreditsPerToken: '947329020791392212393605891',
      apy7DayAvg: 0.08259288698445386,
      apy30DayAvg: 0.08029158038416882,
      apy14DayAvg: 0.08154501471751427,
      apy: 0.09203689283631888,
      apr: 0.08805527839694752,
    },
    {
      id: '2023-10-22',
      blockNumber: 18404209,
      timestamp: '2023-10-22T06:59:47.000000Z',
      txHash:
        '0x1eab96d75579c8050869ffadec5d38bccf8a9714f49d6e27ce67088f15be0535',
      rebasingCreditsPerToken: '941672759591769536254510513',
      apy7DayAvg: 0.05113846400982916,
      apy30DayAvg: 0.06959144820278466,
      apy14DayAvg: 0.05170463696483984,
      apy: 0.042174184267448345,
      apr: 0.04131142884409124,
    },
  ]),
  oethHistories: e([
    {
      balance: '13987429920013242130',
      blockNumber: 18075086,
      id: '0018075086-000196-50c8a-2',
      timestamp: '2023-09-06T04:38:23.000000Z',
      txHash:
        '0xe797abdfd662fd5e6152a635c2aaaf455e54634bcff360a4bf5928194d948661',
      type: 'Received',
      value: '10935521709908207',
    },
    {
      balance: '10487562438176924705683',
      blockNumber: 18346536,
      id: '0018346536-000037-d5bed-2',
      timestamp: '2023-10-14T05:27:35.000000Z',
      txHash:
        '0xefd867cba53819b5bddeb0653d6387980982f06ce386aafefbfb02b159bc20c9',
      type: 'Received',
      value: '5000778025217823025',
    },
    {
      balance: '21000000000000000000',
      blockNumber: 17278915,
      id: '0017278915-000308-412b0-1',
      timestamp: '2023-05-17T10:57:47.000000Z',
      txHash:
        '0x572d309ef687d754dbece6e6759f6126482fdf2bce57338810661c319a953fa1',
      type: 'Received',
      value: '21000000000000000000',
    },
    {
      balance: '311882418829195228',
      blockNumber: 17283335,
      id: '0017283335-000324-55c51-1',
      timestamp: '2023-05-18T02:00:47.000000Z',
      txHash:
        '0x6a64db405e94e8e26dd1774ee936a3497f6b6a802048a4d7db99bd52850b4e3f',
      type: 'Received',
      value: '311882418829195228',
    },
    {
      balance: '51880556301906027215',
      blockNumber: 18251159,
      id: '0018251159-000208-fc1cb-1',
      timestamp: '2023-09-30T21:18:47.000000Z',
      txHash:
        '0x6c3074d7320cb8c57625b5c252c97399b16cfafc35e9ba6f8aad74907e1063eb',
      type: 'Received',
      value: '1000626349292158922',
    },
    {
      balance: '10000515009818247',
      blockNumber: 17279172,
      id: '0017279172-000268-95215-1',
      timestamp: '2023-05-17T11:50:47.000000Z',
      txHash:
        '0x6e128fe7693a07cad0bbfbd654d2c197d4ae8bf61c7d71167c4eae4a2364c28a',
      type: 'Sent',
      value: '-40000000000000000',
    },
    {
      balance: '166758246750072239',
      blockNumber: 17445535,
      id: '0017445535-000182-dc439-1',
      timestamp: '2023-06-09T22:09:47.000000Z',
      txHash:
        '0x9f5ff108282854b28bfb4cb618530b857dd5361cc06b52241fb010071f9739f8',
      type: 'Sent',
      value: '-98999900999999994152',
    },
    {
      balance: '16770072629850821310607',
      blockNumber: 17687713,
      id: '0017687713-000204-0068f-1',
      timestamp: '2023-07-13T23:01:47.000000Z',
      txHash:
        '0x2ffa4d77940d8e3945194d5175e1d2201cb8b67e0ee12518f7ef3584921e5b1a',
      type: 'Sent',
      value: '-9990884222103433354',
    },
    {
      balance: '1111594032314947470136',
      blockNumber: 17812666,
      id: '0017812666-000139-0ceb8-1',
      timestamp: '2023-07-31T11:23:11.000000Z',
      txHash:
        '0x062050a76f2a499a0718fd2b59d6e7b46c41475d9cba63677c131ad2ef75b666',
      type: 'Sent',
      value: '-5021389780904766551',
    },
    {
      balance: '306978963632616869886',
      blockNumber: 18240076,
      id: '0018240076-000195-0ab0e-1',
      timestamp: '2023-09-29T08:06:59.000000Z',
      txHash:
        '0xdd02f42b665768f707877bd0f41fb0b20ab1d7999903d4b26130c39e19493e80',
      type: 'Sent',
      value: '-7836161626988506325',
    },
    {
      balance: '4499373824035149677',
      blockNumber: 17388572,
      id: '0017388572-000150-2e667-1',
      timestamp: '2023-06-01T21:18:47.000000Z',
      txHash:
        '0x5455d1a566dc6671bcd5935c69cf881056d599c273caac05600e968131329f21',
      type: 'Swap',
      value: '3556793833885390',
    },
    {
      balance: '11814029765485703398',
      blockNumber: 17492619,
      id: '0017492619-000175-7793c-1',
      timestamp: '2023-06-16T13:13:11.000000Z',
      txHash:
        '0x061286790b758c2f034fda884b65ede709e5412e5c03984951493c271f1e13f5',
      type: 'Swap',
      value: '22832794838843563',
    },
    {
      balance: '334048578222992110',
      blockNumber: 17289337,
      id: '0017289337-000403-a0833-1',
      timestamp: '2023-05-18T22:15:11.000000Z',
      txHash:
        '0xfdb96d4634187e443ec35622894acb07196389c36dab4837854b7c80753b3251',
      type: 'Swap',
      value: '432966462039980',
    },
    {
      balance: '14092480141686390511',
      blockNumber: 18318256,
      id: '0018318256-000104-13f79-1',
      timestamp: '2023-10-10T06:26:47.000000Z',
      txHash:
        '0x5e277c4266d1ec6a8d2f8486bace5880abc9750ee1258e499ef5c5c6ea0ac6b9',
      type: 'Swap',
      value: '198249596109639907',
    },
    {
      balance: '3815398015586297699',
      blockNumber: 17619422,
      id: '0017619422-000138-32953-1',
      timestamp: '2023-07-04T08:38:11.000000Z',
      txHash:
        '0x129c3aa3a51612a9be0057d0bfd099af96e4575f8d094f91e6470e6dd86cb214',
      type: 'Swap',
      value: '10907502987947219',
    },
    {
      balance: '35147263697482588',
      blockNumber: 17277300,
      id: '0017277300-000172-f770f-40',
      timestamp: '2023-05-17T05:30:35.000000Z',
      txHash:
        '0x6b6b3c790b620b0b49565b2a4db638486fd0b7f4a40e041125b7ed15572769fa',
      type: 'Yield',
      value: '4666944493',
    },
    {
      balance: '18172491113834079',
      blockNumber: 17303732,
      id: '0017303732-000106-8fa18-14',
      timestamp: '2023-05-20T22:56:11.000000Z',
      txHash:
        '0x2d5908634f127e53004bf2101fdb666b4be2c3f1c023655a6fac2d42c48d9a5b',
      type: 'Yield',
      value: '204004869711',
    },
    {
      balance: '10007043850414257967',
      blockNumber: 17312867,
      id: '0017312867-000117-22833-97',
      timestamp: '2023-05-22T05:50:11.000000Z',
      txHash:
        '0xb153084dcd9a313a8c164475adc64b2158bca890eceaf56b31cc72998c7a41ce',
      type: 'Yield',
      value: '6415492777836',
    },
    {
      balance: '5011984570476488439',
      blockNumber: 17351494,
      id: '0017351494-000218-2a40b-40',
      timestamp: '2023-05-27T16:10:59.000000Z',
      txHash:
        '0xde83c6ab3c2d90e4d5f865d120221f25be6229596c2b6da617b56f6ae058d7a5',
      type: 'Yield',
      value: '1508169313310977',
    },
    {
      balance: '2012201770052974873',
      blockNumber: 17363021,
      id: '0017363021-000033-2489d-57',
      timestamp: '2023-05-29T07:00:11.000000Z',
      txHash:
        '0x0be92f6a0b99de47b499df51495d2e032daadee494566b470bb7a5e2dd3a3ede',
      type: 'Yield',
      value: '190302506124917',
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
