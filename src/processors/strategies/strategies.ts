import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { Context } from '../../processor'
import {
  createStrategyProcessor,
  createStrategySetup,
} from '../../processor-templates/strategy'

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

const oethStrategies = [
  {
    from: 18083920,
    name: 'OETH Convex ETH+OETH (AMO)',
    address: '0x1827F9eA98E0bf96550b2FC20F7233277FcD7E63'.toLowerCase(),
    kind: 'CurveAMO',
  },
  {
    from: 17513633,
    name: 'OETH Frax Staking',
    address: '0x3fF8654D633D4Ea0faE24c52Aec73B4A20D0d0e5'.toLowerCase(),
    kind: 'CurveAMO',
  },
  {
    from: 17612333,
    name: 'OETH Morpho Aave V2',
    address: '0xc1fc9E5eC3058921eA5025D703CBE31764756319'.toLowerCase(),
    kind: 'CurveAMO',
  },
  {
    from: 18156225,
    name: 'OETH Aura rETH/WETH',
    address: '0x49109629aC1deB03F2e9b2fe2aC4a623E0e7dfDC'.toLowerCase(),
    kind: 'BalancerMetaStablePool',
  },
] as const

const strategies = oethStrategies

export const from = Math.min(...strategies.map((s) => s.from))

export const setup = (processor: EvmBatchProcessor) => {
  strategies.forEach((s) => createStrategySetup(s.from)(processor))
}

const processors = strategies.map(createStrategyProcessor)

export const process = async (ctx: Context) => {
  await Promise.all(processors.map((p) => p(ctx)))
}
