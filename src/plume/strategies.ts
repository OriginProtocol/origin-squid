import { plumeMainnet } from 'viem/chains'

import { defineProcessor } from '@originprotocol/squid-utils'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import { plumeAddresses } from '@utils/addresses-plume'

export const plumeStrategies: readonly IStrategyData[] = [
  {
    chainId: plumeMainnet.id,
    from: 1107513,
    name: 'Bridged WOETH Strategy',
    contractName: 'BridgedWOETHStrategy',
    address: plumeAddresses.superOETHp.strategies.bridgedWOETH,
    oTokenAddress: plumeAddresses.superOETHp.address,
    kind: 'Generic',
    base: { address: plumeAddresses.tokens.WETH, decimals: 18 },
    assets: [{ address: plumeAddresses.tokens.WETH, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
]

export const plumeStrategyProcessors = [
  ...plumeStrategies.map((s) => {
    return defineProcessor({
      name: s.name,
      from: s.from,
      setup: createStrategySetup(s),
      process: createStrategyProcessor(s),
    })
  }),
  ...plumeStrategies
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
