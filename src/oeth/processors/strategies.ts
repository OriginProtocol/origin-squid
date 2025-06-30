import * as feeAccumulatorAbi from '@abi/fee-accumulator'
import * as nativeStakingAbi from '@abi/strategy-native-staking'
import { AccountingConsensusRewards, ExecutionRewardsCollected } from '@model'
import { Context, EvmBatchProcessor, defineProcessor } from '@originprotocol/squid-utils'
import { mainnetCurrencies } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { createEventProcessor } from '@templates/events/createEventProcessor'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import {
  ETH_ADDRESS,
  FRXETH_ADDRESS,
  OETH_ADDRESS,
  OETH_NATIVE_STRATEGIES,
  OETH_VAULT_ADDRESS,
  RETH_ADDRESS,
  STETH_ADDRESS,
  WETH_ADDRESS,
  addresses,
} from '@utils/addresses'

export const oethStrategies: readonly IStrategyData[] = [
  {
    chainId: 1,
    from: 17249899,
    name: 'OETH Convex ETH+OETH (AMO)',
    contractName: 'ConvexEthMetaStrategy',
    address: addresses.strategies.oeth.ConvexEthMetaStrategy,
    oTokenAddress: OETH_ADDRESS,
    kind: 'CurveAMO',
    curvePoolInfo: {
      poolAddress: '0x94b17476a93b3262d87b9a326965d1e91f9c13e7',
      rewardsPoolAddress: '0x24b65dc1cf053a8d96872c323d29e86ec43eb33a',
    },
    base: { address: mainnetCurrencies.ETH, decimals: 18 },
    assets: [
      {
        address: WETH_ADDRESS,
        decimals: 18,
      },
    ],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
  {
    chainId: 1,
    from: 22423606,
    name: 'OETH Convex OETH+WETH (AMO)',
    contractName: 'ConvexEthMetaStrategy',
    address: '0xba0e352ab5c13861c26e4e773e7a833c3a223fe6',
    oTokenAddress: OETH_ADDRESS,
    kind: 'CurveAMO',
    curvePoolInfo: {
      poolAddress: '0xcc7d5785ad5755b6164e21495e07adb0ff11c2a8',
      rewardsPoolAddress: '0xac15fffdca77fc86770beaba20cbc1bc2d00494c',
      gaugeAddress: '0x36cc1d791704445a5b6b9c36a667e511d4702f3f',
    },
    base: { address: mainnetCurrencies.WETH, decimals: 18 },
    assets: [
      {
        address: WETH_ADDRESS,
        decimals: 18,
      },
    ],
    earnings: {
      passiveByDepositWithdrawal: true,
      rewardTokenCollected: true,
      rewardTokenCollectedSimple: true,
    },
  },
  {
    chainId: 1,
    from: 17067232,
    to: 18363599,
    name: 'OETH Frax Staking',
    contractName: 'FraxETHStrategy',
    address: addresses.strategies.oeth.FraxETHStrategy,
    oTokenAddress: OETH_ADDRESS,
    kind: 'Generic',
    base: { address: mainnetCurrencies.ETH, decimals: 18 },
    assets: [FRXETH_ADDRESS].map((address) => ({ address, decimals: 18 })),
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  },
  {
    chainId: 1,
    from: 17367105,
    to: 21264028,
    name: 'OETH Morpho Aave V2',
    contractName: 'MorphoAaveStrategy',
    address: '0xc1fc9e5ec3058921ea5025d703cbe31764756319',
    oTokenAddress: OETH_ADDRESS,
    kind: 'Generic',
    base: { address: mainnetCurrencies.ETH, decimals: 18 },
    assets: [WETH_ADDRESS].map((address) => ({ address, decimals: 18 })),
    earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
  },
  {
    chainId: 1,
    from: 18156225,
    to: 20136072,
    name: 'OETH Aura rETH/WETH',
    contractName: 'BalancerMetaPoolStrategy',
    address: addresses.strategies.oeth.BalancerMetaPoolStrategy,
    oTokenAddress: OETH_ADDRESS,
    kind: 'BalancerMetaStablePool',
    base: { address: mainnetCurrencies.ETH, decimals: 18 },
    assets: [
      {
        address: WETH_ADDRESS,
        decimals: 18,
      },
      {
        address: RETH_ADDRESS,
        decimals: 18,
        convertTo: {
          address: ETH_ADDRESS,
          decimals: 18,
        },
      },
    ],
    earnings: {
      rewardTokenCollected: true,
      passiveByDepositWithdrawal: true,
    },
    balancerPoolInfo: {
      poolId: '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
      poolAddress: '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
      rewardPoolAddress: '0xdd1fe5ad401d4777ce89959b7fa587e569bf125d',
    },
  },
  {
    chainId: 1,
    from: 17141121,
    to: 20136072,
    name: 'OETH Vault (rETH)',
    contractName: 'VaultCore',
    address: OETH_VAULT_ADDRESS,
    oTokenAddress: OETH_ADDRESS,
    kind: 'Vault',
    base: { address: RETH_ADDRESS, decimals: 18 },
    assets: [RETH_ADDRESS].map((address) => ({
      address,
      decimals: 18,
      convertTo: {
        address: ETH_ADDRESS,
        decimals: 18,
      },
    })),
  },
  {
    chainId: 1,
    from: 17067232,
    to: 20136072,
    name: 'OETH Vault (stETH)',
    contractName: 'VaultCore',
    address: OETH_VAULT_ADDRESS,
    oTokenAddress: OETH_ADDRESS,
    kind: 'Vault',
    base: { address: STETH_ADDRESS, decimals: 18 },
    assets: [STETH_ADDRESS].map((address) => ({ address, decimals: 18 })),
  },
  {
    chainId: 1,
    from: 17067232,
    name: 'OETH Vault (WETH)',
    contractName: 'VaultCore',
    address: OETH_VAULT_ADDRESS,
    oTokenAddress: OETH_ADDRESS,
    kind: 'Vault',
    base: { address: ETH_ADDRESS, decimals: 18 },
    assets: [WETH_ADDRESS].map((address) => ({
      address,
      decimals: 18,
    })),
  },
  ...OETH_NATIVE_STRATEGIES.map(
    (strategy, index) =>
      ({
        chainId: 1,
        from: strategy.from,
        name: `OETH Native Staking ${index + 1}`,
        contractName: 'NativeStakingSSVStrategy',
        address: strategy.address,
        oTokenAddress: OETH_ADDRESS,
        kind: 'NativeStaking',
        base: { address: WETH_ADDRESS, decimals: 18 },
        assets: [WETH_ADDRESS].map((address) => ({ address, decimals: 18 })),
        earnings: {
          passiveByDepositWithdrawal: true,
          rewardTokenCollected: true,
          rewardTokenCollectedSimple: true,
        },
      }) as const,
  ),
]

const strategies = oethStrategies

const eventProcessors = [
  ...OETH_NATIVE_STRATEGIES.map((strategy) =>
    createEventProcessor({
      address: strategy.address,
      event: nativeStakingAbi.events.AccountingConsensusRewards,
      from: 20046251,
      mapEntity: (ctx, block, log, decoded) =>
        new AccountingConsensusRewards({
          id: `${ctx.chain.id}:${log.id}`,
          chainId: ctx.chain.id,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          address: strategy.address,
          rewards: decoded.amount,
        }),
    }),
  ),
  createEventProcessor({
    address: addresses.oeth.nativeStakingFeeAccumulator,
    event: feeAccumulatorAbi.events.ExecutionRewardsCollected,
    from: 20046238,
    mapEntity: (ctx, block, log, decoded) =>
      new ExecutionRewardsCollected({
        id: `${ctx.chain.id}:${log.id}`,
        chainId: ctx.chain.id,
        timestamp: new Date(block.header.timestamp),
        blockNumber: block.header.height,
        address: addresses.oeth.nativeStakingFeeAccumulator,
        strategy: decoded.strategy,
        amount: decoded.amount,
      }),
  }),
]

const processors = [
  ...strategies.map(createStrategyProcessor),
  ...strategies.filter((s) => s.kind !== 'Vault').map((strategy) => createStrategyRewardProcessor(strategy)),
]

export const oethStrategiesProcessor = defineProcessor({
  name: 'oeth-strategies',
  from: Math.min(...strategies.map((s) => s.from)),
  setup: (processor: EvmBatchProcessor) => {
    strategies.forEach((s) => createStrategySetup(s)(processor))
    strategies.filter((s) => s.kind !== 'Vault').forEach((s) => createStrategyRewardSetup(s)(processor))
    eventProcessors.forEach((p) => p.setup(processor))
  },
  process: async (ctx: Context) => {
    await Promise.all([...processors.map((p) => p(ctx)), ...eventProcessors.map((p) => p.process(ctx))])
  },
})
