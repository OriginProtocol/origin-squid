import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as aaveLendingPool from '../../../abi/aave-lending-pool'
import * as aToken from '../../../abi/aave-token'
import { OETHRewardTokenCollected } from '../../../model'
import { Context } from '../../../processor'
import { currencies } from '../../../shared/post-processors/exchange-rates/currencies'
import {
  IStrategyData,
  createStrategyProcessor,
  createStrategySetup,
} from '../../../shared/processor-templates/strategy'
import {
  createStrategyRewardProcessor,
  createStrategyRewardSetup,
} from '../../../shared/processor-templates/strategy-rewards'
import { logFilter } from '../../../utils/logFilter'
import { aaveStrategy } from './aave-strategy'

const DAI = {
  address: '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase(),
  decimals: 18,
}
const USDT = {
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7'.toLowerCase(),
  decimals: 6,
}
const USDC = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase(),
  decimals: 6,
}

const ousdStrategies: readonly IStrategyData[] = [
  // aaveStrategy,
  {
    from: 15896478,
    kind: 'CurveAMO',
    name: 'OUSD Convex OUSD+3Crv (AMO)',
    contractName: 'ConvexOUSDMetaStrategy',
    address: '0x89eb88fedc50fc77ae8a18aad1ca0ac27f777a90'.toLowerCase(),
    base: { address: currencies.USD, decimals: 18 },
    assets: [DAI, USDT, USDC],
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
    curvePoolInfo: {
      poolAddress: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'.toLowerCase(),
      rewardsPoolAddress:
        '0x7D536a737C13561e0D2Decf1152a653B4e615158'.toLowerCase(),
    },
  },
  // {
  //   from: 15949661,
  //   kind: 'Generic',
  //   name: 'OUSD Morpho Compound',
  //   contractName: 'MorphoCompoundStrategy',
  //   address: '0x5a4eee58744d1430876d5ca93cab5ccb763c037d'.toLowerCase(),
  //   base: { address: currencies.USD, decimals: 18 },
  //   assets: [DAI, USDT, USDC],
  //   earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  // },
  // {
  //   from: 16331911,
  //   kind: 'Generic',
  //   name: 'OUSD Morpho Aave',
  //   contractName: 'MorphoAaveStrategy',
  //   address: '0x79F2188EF9350A1dC11A062cca0abE90684b0197'.toLowerCase(),
  //   base: { address: currencies.USD, decimals: 18 },
  //   assets: [DAI, USDT, USDC],
  //   earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  // },
  // {
  //   from: 17877308,
  //   kind: 'Generic',
  //   name: 'OUSD Flux',
  //   contractName: 'FluxStrategy',
  //   address: '0x76Bf500B6305Dc4ea851384D3d5502f1C7a0ED44'.toLowerCase(),
  //   base: { address: currencies.USD, decimals: 18 },
  //   assets: [DAI, USDT, USDC],
  //   earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  // },
  // {
  //   from: 17883036,
  //   kind: 'Generic',
  //   name: 'OUSD Maker DSR',
  //   contractName: 'Generalized4626Strategy',
  //   address: '0x6b69B755C629590eD59618A2712d8a2957CA98FC'.toLowerCase(),
  //   base: { address: currencies.USD, decimals: 18 },
  //   assets: [DAI, USDT, USDC],
  //   earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
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
]

const strategies = ousdStrategies

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
