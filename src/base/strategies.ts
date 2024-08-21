import { OETHRewardTokenCollected } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import { baseAddresses } from '@utils/addresses-base'

export const oethbStrategies: readonly IStrategyData[] = [
  {
    from: 18689563,
    name: 'Bridged WOETH Strategy',
    contractName: 'BridgedWOETHStrategy',
    address: baseAddresses.superOETHb.strategies.bridgedWOETH,
    oTokenAddress: baseAddresses.superOETHb.address,
    kind: 'Generic',
    base: { address: baseAddresses.tokens.WETH, decimals: 18 },
    assets: [
      { address: baseAddresses.tokens.WETH, decimals: 18 },
      { address: baseAddresses.tokens.bridgedWOETH, decimals: 18 },
    ],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
]

const strategies = oethbStrategies

const processors = [
  ...strategies.map(createStrategyProcessor),
  ...strategies
    .filter((s) => s.kind !== 'Vault')
    .map((strategy) =>
      createStrategyRewardProcessor({
        ...strategy,
        OTokenRewardTokenCollected: OETHRewardTokenCollected,
      }),
    ),
]

export const baseStrategies = {
  from: Math.min(...strategies.map((s) => s.from)),
  setup: (processor: EvmBatchProcessor) => {
    strategies.forEach((s) => createStrategySetup(s)(processor))
    strategies.filter((s) => s.kind !== 'Vault').forEach((s) => createStrategyRewardSetup(s)(processor))
  },
  process: async (ctx: Context) => {
    await Promise.all(processors.map((p) => p(ctx)))
  },
}
