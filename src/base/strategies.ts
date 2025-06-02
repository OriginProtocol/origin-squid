import { defineProcessor } from '@originprotocol/squid-utils'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import { baseAddresses } from '@utils/addresses-base'

export const baseCurveAMO: IStrategyData = {
  chainId: 8453,
  from: 26212490,
  name: 'Curve AMO Strategy',
  contractName: 'OETHBaseCurveAMO',
  address: baseAddresses.superOETHb.strategies.curveAMO,
  oTokenAddress: baseAddresses.superOETHb.address,
  kind: 'CurveAMO',
  curvePoolInfo: {
    poolAddress: '0x302a94e3c28c290eaf2a4605fc52e11eb915f378',
    gaugeAddress: '0x9da8420dbeebdfc4902b356017610259ef7eedd8',
    rewardsPoolAddress: '0x9da8420dbeebdfc4902b356017610259ef7eedd8',
  },
  base: { address: baseAddresses.tokens.WETH, decimals: 18 },
  assets: [
    { address: baseAddresses.tokens.WETH, decimals: 18 },
    { address: baseAddresses.tokens.superOETHb, decimals: 18, checkBalance: false },
  ],
  earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
}

export const baseStrategies: readonly IStrategyData[] = [
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
    address: baseAddresses.superOETHb.strategies.aerodromeAMO,
    oTokenAddress: baseAddresses.superOETHb.address,
    kind: 'Generic',
    base: { address: baseAddresses.tokens.WETH, decimals: 18 },
    assets: [{ address: baseAddresses.tokens.WETH, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
  baseCurveAMO,
]

export const baseStrategiesProcessors = [
  ...baseStrategies.map((s) => {
    return defineProcessor({
      name: s.name,
      from: s.from,
      setup: createStrategySetup(s),
      process: createStrategyProcessor(s),
    })
  }),
  ...baseStrategies
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
