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
import { env } from '../../utils/env'
import { jsonify } from '../../utils/jsonify'

export const name = 'validate-oeth'

let firstBlock = true

export const process = async (ctx: Context) => {
  if (env.BLOCK_FROM) return
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
  oethApies: e([
    {
      id: '2023-06-25',
      timestamp: '2023-06-25T21:18:47.000Z',
      blockNumber: 17559113,
      txHash:
        '0x43ce3a8d77ab8d0ec80e1929c6e2490ef2aeb5563c5f9f17a83a0467ebc13182',
      apr: 0.08596862,
      apy: 0.08976154,
      apy7DayAvg: 0.0957242,
      apy14DayAvg: 0.10951981,
      apy30DayAvg: 0.10838487,
      rebasingCreditsPerToken: '964774349509154447326281289',
    },
    {
      id: '2023-08-01',
      timestamp: '2023-08-01T20:03:11.000Z',
      blockNumber: 17822414,
      txHash:
        '0xdb0d39ba852986922f1aac3287a1e6cf47e60e45681011f6e778cfc2be8e8a89',
      apr: 0.04258726,
      apy: 0.04350311,
      apy7DayAvg: 0.08161053,
      apy14DayAvg: 0.08480437,
      apy30DayAvg: 0.09689357,
      rebasingCreditsPerToken: '957036931267910885633239775',
    },
    {
      id: '2023-08-24',
      timestamp: '2023-08-24T06:59:47.000Z',
      blockNumber: 17982932,
      txHash:
        '0x7e3babd3c816f676e14409077a955796de0f30dbd72b26ca103b618ca3cc85dd',
      apr: 0.08364589,
      apy: 0.08723341,
      apy7DayAvg: 0.09847635,
      apy14DayAvg: 0.09029411,
      apy30DayAvg: 0.08411732,
      rebasingCreditsPerToken: '952455810812982773029042302',
    },
    {
      id: '2023-09-19',
      timestamp: '2023-09-19T07:00:23.000Z',
      blockNumber: 18168332,
      txHash:
        '0x100ed769fccd330bde46eef786676ab664088f0df2fa65bfea471864a1f5ad6c',
      apr: 0.08805528,
      apy: 0.09203689,
      apy7DayAvg: 0.08234453,
      apy14DayAvg: 0.08165562,
      apy30DayAvg: 0.07996603,
      rebasingCreditsPerToken: '947329020791392212393605891',
    },
    {
      id: '2023-10-22',
      timestamp: '2023-10-22T06:59:47.000Z',
      blockNumber: 18404209,
      txHash:
        '0x1eab96d75579c8050869ffadec5d38bccf8a9714f49d6e27ce67088f15be0535',
      apr: 0.04131143,
      apy: 0.04217418,
      apy7DayAvg: 0.05115644,
      apy14DayAvg: 0.05202892,
      apy30DayAvg: 0.0676049,
      rebasingCreditsPerToken: '941672759591769536254510513',
    },
  ]),
  oethHistories: e([
    {
      balance: '4994819891394470874',
      blockNumber: 17684499,
      id: '0017684499-000297-32534-0x0ad9ea110bdd131683c0d36df8ba80cd3ed1a5fb-1',
      timestamp: '2023-07-13T12:12:23.000000Z',
      txHash:
        '0x51dc5890e7057aa049a8ee3675e9f5a2d1df8afae3ccf1aae7991d2141b082bb',
      type: 'Received',
      value: '4994819891394470874',
    },
    {
      balance: '989',
      blockNumber: 17780803,
      id: '0017780803-000424-d030b-0x24902aa0cf0000a08c0ea0b003b0c0bf600000e0-1',
      timestamp: '2023-07-27T00:22:23.000000Z',
      txHash:
        '0x723583207fa4221d4ad6d606b43927019e088c93c0edcbcd89a62c6327e1925f',
      type: 'Received',
      value: '81',
    },
    {
      balance: '3620809167086458796690',
      blockNumber: 18161346,
      id: '0018161346-000161-142ff-0xdcee70654261af21c44c093c300ed3bb97b78192-1',
      timestamp: '2023-09-18T07:27:11.000000Z',
      txHash:
        '0xa66fbf3fb92fc8d44e2790a1692ce5e9f10139f0bf728da2533c8d5e7b4a1a70',
      type: 'Received',
      value: '316259151664720778',
    },
    {
      balance: '30999999999999',
      blockNumber: 18412140,
      id: '0018412140-000178-00f48-0xc69bfa6ab78853a4addb9b6c553102c7e62ada15-1',
      timestamp: '2023-10-23T09:41:23.000000Z',
      txHash:
        '0xc1cdeca03c9214546cf820a725ed6c730860479197c19c6fa1836f1d92a9eb09',
      type: 'Received',
      value: '10000000000000',
    },
    {
      balance: '199908452113059508',
      blockNumber: 18229171,
      id: '0018229171-000263-264de-0x018abc2b6bc71013efd9f98f2104ca53132db615-1',
      timestamp: '2023-09-27T19:26:47.000000Z',
      txHash:
        '0x4dfaca9c52226b02c6ebd16f97bab0159370bf3e9f252a48ff965700e27f4653',
      type: 'Received',
      value: '108554825178258',
    },
    {
      balance: '70007164149821693',
      blockNumber: 17130412,
      id: '0017130412-000118-770f2-0x94b17476a93b3262d87b9a326965d1e91f9c13e7-1',
      timestamp: '2023-04-26T12:30:59.000000Z',
      txHash:
        '0xf9498f5b8d65e7f7252a515edcc3af4cd3b0e96ee841ef82f11de349ded5f330',
      type: 'Sent',
      value: '-9992835850178307',
    },
    {
      balance: '0',
      blockNumber: 17542358,
      id: '0017542358-000170-8207a-0x9ffd0a5b5438b95861167422e745d34d151bcc3b-1',
      timestamp: '2023-06-23T12:46:47.000000Z',
      txHash:
        '0x02d96712bdceff945b568905980bc747e920b58cab2191b6ac04a6f0223efd6d',
      type: 'Sent',
      value: '-753495508936036139',
    },
    {
      balance: '0',
      blockNumber: 18202824,
      id: '0018202824-000167-52e26-0x9c51ff53e842eeec93f9d5efbf52f6a02591755c-1',
      timestamp: '2023-09-24T02:55:59.000000Z',
      txHash:
        '0x427dd09882a59b6906d40b5031029fbd34e4ebc747b4429cc8cad1aefb9e62c5',
      type: 'Sent',
      value: '-33861098543774741169',
    },
    {
      balance: '0',
      blockNumber: 18260101,
      id: '0018260101-000216-20cba-0xe4bac3e44e8080e1491c11119197d33e396ea82b-1',
      timestamp: '2023-10-02T03:16:23.000000Z',
      txHash:
        '0xb8b8a275a004ccfbc4159989cec584b266c148153dd37658b8a26966d39d18de',
      type: 'Sent',
      value: '-20491766350512037673',
    },
    {
      balance: '35811706077256008074',
      blockNumber: 18154738,
      id: '0018154738-000203-13b93-0x9c51ff53e842eeec93f9d5efbf52f6a02591755c-1',
      timestamp: '2023-09-17T09:00:35.000000Z',
      txHash:
        '0x931e5cea2e7d4551691988867947489594d30cdef7acd0906fd7607e887e5aae',
      type: 'Sent',
      value: '-1200000000000000000',
    },
    {
      balance: '49999999999999999',
      blockNumber: 17150073,
      id: '0017150073-000306-0f425-0x58890a9cb27586e83cb51d2d26bbe18a1a647245-1',
      timestamp: '2023-04-29T06:48:11.000000Z',
      txHash:
        '0x4af5c7b310ae8c814ae6e5415da99f9c9f414e6b4ca8257cd1dea1a6d9067b36',
      type: 'Swap',
      value: '49999999999999999',
    },
    {
      balance: '375433998881638354',
      blockNumber: 17278567,
      id: '0017278567-000195-1f61f-0x79b664dba8015e3aa505fa4507f0d64df7e451e2-1',
      timestamp: '2023-05-17T09:47:23.000000Z',
      txHash:
        '0xd9a0e30f23956cb91293cb44a6e54b6d6bbe772e3d70b5e68a1760b28c8f78ef',
      type: 'Swap',
      value: '375433998881638354',
    },
    {
      balance: '1499066120128420574',
      blockNumber: 17286539,
      id: '0017286539-000156-4976c-0x938500c0df0fdc138c28ddf4bc4289107c7354ce-1',
      timestamp: '2023-05-18T12:49:35.000000Z',
      txHash:
        '0xcd68e7d50fcb683add60e71253673af2ff2547e6375d40ffc4639a1410bc3104',
      type: 'Swap',
      value: '1499066120128420574',
    },
    {
      balance: '5384270268711162736',
      blockNumber: 17633180,
      id: '0017633180-000408-d89c5-0xf14bbdf064e3f67f51cd9bd646ae3716ad938fdc-1',
      timestamp: '2023-07-06T07:00:11.000000Z',
      txHash:
        '0x97db34103137321f032b4a54ccaed3112d054bc1204125ac862a0b81fb3f3279',
      type: 'Swap',
      value: '1273337667112407520',
    },
    {
      balance: '674774321229336771',
      blockNumber: 17299409,
      id: '0017299409-000434-9ce80-0xf14bbdf064e3f67f51cd9bd646ae3716ad938fdc-1',
      timestamp: '2023-05-20T08:19:59.000000Z',
      txHash:
        '0x787fbdec5e65927b0e1b48601d891f48d7671db88fc4c11ac74f8e874e667936',
      type: 'Swap',
      value: '1049118249013688',
    },
    {
      balance: '32292882396504207',
      blockNumber: 17275137,
      id: '0017275137-000516-66451-0xdcee70654261af21c44c093c300ed3bb97b78192-1',
      timestamp: '2023-05-16T22:12:35.000000Z',
      txHash:
        '0x24d1f4ff2ad45826b91206594d706af0866bca1f5d20377d070679599a2dbe55',
      type: 'Yield',
      value: '218258202002',
    },
    {
      balance: '10070499668604762317',
      blockNumber: 17276891,
      id: '0017276891-000052-12fd3-0x57b0dd7967955c92b6e34a038b47fee63e1efd1a-1',
      timestamp: '2023-05-17T04:08:11.000000Z',
      txHash:
        '0x76fe3dc19782ba2e1274f81dd4347dcacc151960918b1b52bb91582a9d49ab50',
      type: 'Yield',
      value: '16150488605744',
    },
    {
      balance: '100429877759821',
      blockNumber: 17277099,
      id: '0017277099-000273-05d64-0xd6415162f48140d6090959cb8068174c68e81705-1',
      timestamp: '2023-05-17T04:49:59.000000Z',
      txHash:
        '0xeec79549578a28e024ce86def3784830d28c26b8fe1bfe4bde093f4854b32cde',
      type: 'Yield',
      value: '87786385',
    },
    {
      balance: '1025746659014252',
      blockNumber: 17283304,
      id: '0017283304-000280-32e6f-0xfd9e6005187f448957a0972a7d0c0a6da2911236-1',
      timestamp: '2023-05-18T01:54:23.000000Z',
      txHash:
        '0xaa9c72db7346ea7de332196f6df85d4f47c6fe42e3b7f7fcdc0965933486b128',
      type: 'Yield',
      value: '1492199898',
    },
    {
      balance: '261226340935297362',
      blockNumber: 17283378,
      id: '0017283378-000634-fde11-0x2f19980c3acd87f6d9468663c9a9839c12456a14-1',
      timestamp: '2023-05-18T02:09:23.000000Z',
      txHash:
        '0xda99a68fd12da72f11d68e5997fa1cccea120a4e5a5b71d2e660785ddf5251ab',
      type: 'Yield',
      value: '13753918397190',
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
