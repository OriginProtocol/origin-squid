import { Context, EvmBatchProcessor, defineProcessor } from '@originprotocol/squid-utils'
import { mainnetCurrencies } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import * as mainnetAddresses from '@utils/addresses'
import { USDS_ADDRESS } from '@utils/addresses'

import { aaveStrategy } from './aave-strategy'
import { USDC, USDT } from './const'
import { convexMetaStrategy } from './convex-meta-strategy'
import { fluxStrategy } from './flux-strategy'
import { makerDsrStrategy } from './maker-dsr-strategy'
import { metamorphoStrategy } from './metamorpho-strategy'
import { morphoAave } from './morpho-aave'
import { morphoCompound } from './morpho-compound'

export const ousdStrategies: readonly IStrategyData[] = [
  {
    chainId: 1,
    from: 22090164,
    oTokenAddress: mainnetAddresses.OUSD_ADDRESS,
    kind: 'Generic',
    name: 'OUSD Sky Savings Rate',
    contractName: 'Generalized4626Strategy',
    address: mainnetAddresses.strategies.ousd.SkySavingsRateStrategy,
    base: { address: mainnetCurrencies.USD, decimals: 18 },
    assets: [{ address: USDS_ADDRESS, decimals: 18 }],
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  },
  convexMetaStrategy,
  aaveStrategy,
  morphoCompound,
  morphoAave,
  fluxStrategy,
  makerDsrStrategy,
  metamorphoStrategy,
  {
    chainId: 1,
    from: 21425796,
    oTokenAddress: mainnetAddresses.OUSD_ADDRESS,
    kind: 'Generic',
    name: 'OUSD Gauntlet Prime USDC',
    contractName: 'Generalized4626Strategy',
    address: mainnetAddresses.strategies.ousd.GauntletPrimeUSDCStrategy,
    base: { address: mainnetCurrencies.USD, decimals: 18 },
    assets: [USDC],
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  },
  {
    chainId: 1,
    from: 21425837,
    oTokenAddress: mainnetAddresses.OUSD_ADDRESS,
    kind: 'Generic',
    name: 'OUSD Gauntlet Prime USDT',
    contractName: 'Generalized4626Strategy',
    address: mainnetAddresses.strategies.ousd.GauntletPrimeUSDTStrategy,
    base: { address: mainnetCurrencies.USD, decimals: 18 },
    assets: [USDT],
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  },
  {
    chainId: 1,
    from: 22224255,
    oTokenAddress: mainnetAddresses.OUSD_ADDRESS,
    kind: 'Generic',
    name: 'OUSD Curve AMO',
    contractName: 'CurveAMOStrategy',
    address: mainnetAddresses.strategies.ousd.CurveUSDCAMOStrategy,
    base: { address: mainnetCurrencies.USD, decimals: 18 },
    assets: [USDC],
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  },
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

const processors = [
  ...strategies.map(createStrategyProcessor),
  ...strategies.map((strategy) => createStrategyRewardProcessor(strategy)),
]

export const ousdStrategiesProcessor = defineProcessor({
  name: 'strategies',
  from: Math.min(...strategies.map((s) => s.from)),
  setup: (processor: EvmBatchProcessor) => {
    strategies.forEach((s) => createStrategySetup(s)(processor))
    strategies.forEach((s) => createStrategyRewardSetup(s)(processor))
  },
  process: async (ctx: Context) => {
    await Promise.all(processors.map((p) => p(ctx)))
  },
})
