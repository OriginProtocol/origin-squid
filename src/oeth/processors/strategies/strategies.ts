import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { OETHRewardTokenCollected } from '../../../model'
import { Context } from '../../../processor'
import {
  IStrategyData,
  createStrategyProcessor,
  createStrategySetup,
} from '../../../shared/processor-templates/strategy'
import {
  createStrategyRewardProcessor,
  createStrategyRewardSetup,
} from '../../../shared/processor-templates/strategy-rewards'
import {
  FRXETH_ADDRESS,
  OETH_ADDRESS,
  RETH_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'

export const oethStrategies: readonly IStrategyData[] = [
  {
    from: 17249899,
    name: 'OETH Convex ETH+OETH (AMO)',
    address: '0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63',
    kind: 'CurveAMO',
    curvePoolInfo: {
      poolAddress: '0x94b17476a93b3262d87b9a326965d1e91f9c13e7',
      rewardsPoolAddress: '0x24b65dc1cf053a8d96872c323d29e86ec43eb33a',
    },
    assets: [WETH_ADDRESS, OETH_ADDRESS],
  },
  // {
  //   from: 17067232,
  //   name: 'OETH Frax Staking',
  //   address: '0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5',
  //   kind: 'Generic',
  //   assets: [FRXETH_ADDRESS],
  // },
  // {
  //   from: 17367105,
  //   name: 'OETH Morpho Aave V2',
  //   address: '0xc1fc9e5ec3058921ea5025d703cbe31764756319',
  //   kind: 'Generic',
  //   assets: [WETH_ADDRESS],
  // },
  // {
  //   from: 18156225,
  //   name: 'OETH Aura rETH/WETH',
  //   address: '0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc',
  //   kind: 'BalancerMetaStablePool',
  //   assets: [WETH_ADDRESS, RETH_ADDRESS],
  //   balancerPoolInfo: {
  //     poolId:
  //       '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
  //     poolAddress: '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
  //   },
  // },
] as const

const strategies = oethStrategies

export const from = Math.min(...strategies.map((s) => s.from))

export const setup = (processor: EvmBatchProcessor) => {
  strategies.forEach((s) => createStrategySetup(s)(processor))
  strategies.forEach((s) => createStrategyRewardSetup(s)(processor))
}

const processors = [
  ...strategies.map(createStrategyProcessor),
  ...strategies.map((strategy) =>
    createStrategyRewardProcessor({
      ...strategy,
      OTokenRewardTokenCollected: OETHRewardTokenCollected,
    }),
  ),
]

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}

// Useful values for OUSD later

// const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase()
// const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'.toLowerCase()
// const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase()

// const ousdStrategies = [
// {
//   from: 14206832, // 13369326, Initial Deploy
//   name: 'OUSD Aave',
//   address: '0x5e3646a1db86993f73e6b74a57d8640b69f7e259'.toLowerCase(),
//   assets: [DAI, USDT, USDC],
// },
// {
//   from: 15896478,
//   name: 'OUSD Convex OUSD+3Crv (AMO)',
//   address: '0x89eb88fedc50fc77ae8a18aad1ca0ac27f777a90'.toLowerCase(),
//   assets: [DAI, USDT, USDC],
// },
// {
//   from: 15949661,
//   name: 'OUSD Morpho Compound',
//   address: '0x5a4eee58744d1430876d5ca93cab5ccb763c037d'.toLowerCase(),
//   assets: [DAI, USDT, USDC],
// },
// {
//   from: 16331911,
//   name: 'OUSD Morpho Aave',
//   address: '0x79F2188EF9350A1dC11A062cca0abE90684b0197'.toLowerCase(),
//   assets: [DAI, USDT, USDC],
// },
// {
//   from: 17877308,
//   name: 'OUSD Flux',
//   address: '0x76Bf500B6305Dc4ea851384D3d5502f1C7a0ED44'.toLowerCase(),
//   assets: [DAI, USDT, USDC],
// },
// {
//   from: 17883036,
//   name: 'OUSD Maker DSR',
//   address: '0x6b69B755C629590eD59618A2712d8a2957CA98FC'.toLowerCase(),
//   assets: [DAI, USDT, USDC],
// },
// Deprecated
// {
//   from: 13369299,
//   name: 'CompoundStrategy',
//   address: '0x9c459eeb3fa179a40329b81c1635525e9a0ef094'.toLowerCase(),
// },
// {
//   from: 13639477,
//   name: 'ConvexStrategy',
//   address: '0xea2ef2e2e5a749d4a66b41db9ad85a38aa264cb3'.toLowerCase(),
// },
// {
//   from: 16226229,
//   name: 'LUSDMetaStrategy',
//   address: '0x7A192DD9Cc4Ea9bdEdeC9992df74F1DA55e60a19'.toLowerCase(),
// },
// ] as const
