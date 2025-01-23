import { defineProcessor } from '@originprotocol/squid-utils'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import { baseAddresses } from '@utils/addresses-base'

export const strategies: readonly IStrategyData[] = [
  {
    chainId: 8453,
    from: 18689563,
    name: 'Bridged WOETH Strategy',
    contractName: 'BridgedWOETHStrategy',
    address: baseAddresses.superOETHb.strategies.bridgedWOETH,
    oTokenAddress: baseAddresses.superOETHb.address,
    kind: 'Generic',
    base: { address: baseAddresses.tokens.WETH, decimals: 18 },
    assets: [{ address: baseAddresses.tokens.WETH, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
  {
    chainId: 8453,
    from: 19046362,
    name: 'Aerodrome AMO Strategy',
    contractName: 'AerodromeAMOStrategy',
    address: baseAddresses.superOETHb.strategies.amo,
    oTokenAddress: baseAddresses.superOETHb.address,
    kind: 'Generic',
    base: { address: baseAddresses.tokens.WETH, decimals: 18 },
    assets: [{ address: baseAddresses.tokens.WETH, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
]

export const baseStrategies = [
  ...strategies.map((s) => {
    return defineProcessor({
      name: s.name,
      from: s.from,
      setup: createStrategySetup(s),
      process: createStrategyProcessor(s),
    })
  }),
  ...strategies
    .filter((s) => s.kind !== 'Vault')
    .map((s) => {
      return defineProcessor({
        name: s.name,
        from: s.from,
        setup: createStrategyRewardSetup(s),
        process: createStrategyRewardProcessor(s),
      })
    }),
]
