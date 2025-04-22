import { sonic } from 'viem/chains'

import * as nativeStakingAbi from '@abi/strategy-native-staking'
import { AccountingConsensusRewards } from '@model'
import { Context, EvmBatchProcessor, defineProcessor } from '@originprotocol/squid-utils'
import { createEventProcessor } from '@templates/events/createEventProcessor'
import { IStrategyData, createStrategyProcessor, createStrategySetup } from '@templates/strategy'
import { createStrategyRewardProcessor, createStrategyRewardSetup } from '@templates/strategy-rewards'
import { sonicAddresses } from '@utils/addresses-sonic'

export const sonicStrategies: readonly IStrategyData[] = [
  ...sonicAddresses.OS.nativeStrategies.map(
    (strategy, index) =>
      ({
        chainId: sonic.id,
        from: strategy.from,
        name: `Sonic Staking ${index + 1}`,
        contractName: 'SonicStakingStrategy',
        address: strategy.address,
        oTokenAddress: sonicAddresses.OS.address,
        kind: 'NativeStaking',
        base: { address: sonicAddresses.tokens.wS, decimals: 18 },
        assets: [sonicAddresses.tokens.wS].map((address) => ({ address, decimals: 18 })),
        earnings: { passiveByDepositWithdrawal: true, rewardTokenCollected: true },
      }) as const,
  ),
  {
    chainId: sonic.id,
    from: sonicAddresses.OS.amoSwapX.strategy.from,
    name: 'Sonic SwapX AMO Strategy',
    contractName: 'SonicSwapXAMOStrategy',
    address: sonicAddresses.OS.amoSwapX.strategy.address,
    oTokenAddress: sonicAddresses.OS.address,
    kind: 'Generic',
    base: { address: sonicAddresses.tokens.wS, decimals: 18 },
    assets: [{ address: sonicAddresses.tokens.wS, decimals: 18 }],
    earnings: { rewardTokenCollected: true, passiveByDepositWithdrawal: true },
  },
]

const strategies = sonicStrategies

const eventProcessors = [
  ...sonicAddresses.OS.nativeStrategies.map((strategy) =>
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
]

export const name = 'strategies'
export const from = Math.min(...strategies.map((s) => s.from))

export const setup = (processor: EvmBatchProcessor) => {
  strategies.forEach((s) => createStrategySetup(s)(processor))
  strategies.filter((s) => s.kind !== 'Vault').forEach((s) => createStrategyRewardSetup(s)(processor))
  eventProcessors.forEach((p) => p.setup(processor))
}

const processors = [
  ...strategies.map(createStrategyProcessor),
  ...strategies.filter((s) => s.kind !== 'Vault').map((strategy) => createStrategyRewardProcessor(strategy)),
]

export const process = async (ctx: Context) => {
  await Promise.all([...processors.map((p) => p(ctx)), ...eventProcessors.map((p) => p.process(ctx))])
}

export const sonicStrategiesProcessor = defineProcessor({
  name,
  from,
  setup,
  process,
})
