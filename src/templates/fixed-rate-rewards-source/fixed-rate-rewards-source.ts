import * as abi from '@abi/fixed-rate-rewards-source'
import {
  GovernorshipTransferred,
  PendingGovernorshipTransfer,
  RewardCollected,
  RewardsPerSecondChanged,
  RewardsTargetChange,
  StrategistUpdated,
} from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { LogFilter, logFilter } from '@utils/logFilter'

interface State {
  // Event Entities
  governorshipTransferred: Map<string, GovernorshipTransferred>
  pendingGovernorshipTransfer: Map<string, PendingGovernorshipTransfer>
  rewardCollected: Map<string, RewardCollected>
  rewardsPerSecondChanged: Map<string, RewardsPerSecondChanged>
  rewardsTargetChange: Map<string, RewardsTargetChange>
  strategistUpdated: Map<string, StrategistUpdated>
}

export const createFixedRewardsSourceProcessor = ({ from, address }: { from: number; address: string }) => {
  const governorshipTransferredFilter = logFilter({
    address: [address],
    topic0: [abi.events.GovernorshipTransferred.topic],
    range: { from },
  })
  const pendingGovernorshipTransferFilter = logFilter({
    address: [address],
    topic0: [abi.events.PendingGovernorshipTransfer.topic],
    range: { from },
  })
  const rewardCollectedFilter = logFilter({
    address: [address],
    topic0: [abi.events.RewardCollected.topic],
    range: { from },
  })
  const rewardsPerSecondChangedFilter = logFilter({
    address: [address],
    topic0: [abi.events.RewardsPerSecondChanged.topic],
    range: { from },
  })
  const rewardsTargetChangeFilter = logFilter({
    address: [address],
    topic0: [abi.events.RewardsTargetChange.topic],
    range: { from },
  })
  const strategistUpdatedFilter = logFilter({
    address: [address],
    topic0: [abi.events.StrategistUpdated.topic],
    range: { from },
  })

  const subProcessors: {
    description: string
    filter: LogFilter
    processor: (ctx: Context, block: Block, log: Log, state: State) => Promise<void>
  }[] = [
    {
      description: 'Create GovernorshipTransferred event',
      filter: governorshipTransferredFilter,
      processor: async (ctx: Context, block: Block, log: Log, state: State) => {
        const data = abi.events.GovernorshipTransferred.decode(log)
        const id = `${ctx.chain.id}:${log.id}`
        state.governorshipTransferred.set(
          id,
          new GovernorshipTransferred({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            newGovernor: data.newGovernor,
            previousGovernor: data.previousGovernor,
          }),
        )
      },
    },
    {
      description: 'Create PendingGovernorshipTransfer event',
      filter: pendingGovernorshipTransferFilter,
      processor: async (ctx: Context, block: Block, log: Log, state: State) => {
        const data = abi.events.PendingGovernorshipTransfer.decode(log)
        const id = `${ctx.chain.id}:${log.id}`
        state.pendingGovernorshipTransfer.set(
          id,
          new PendingGovernorshipTransfer({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            newGovernor: data.newGovernor,
            previousGovernor: data.previousGovernor,
          }),
        )
      },
    },
    {
      description: 'Create RewardCollected event',
      filter: rewardCollectedFilter,
      processor: async (ctx: Context, block: Block, log: Log, state: State) => {
        const data = abi.events.RewardCollected.decode(log)
        const id = `${ctx.chain.id}:${log.id}`
        state.rewardCollected.set(
          id,
          new RewardCollected({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            amountCollected: data.amountCollected,
          }),
        )
      },
    },
    {
      description: 'Create RewardsPerSecondChanged event',
      filter: rewardsPerSecondChangedFilter,
      processor: async (ctx: Context, block: Block, log: Log, state: State) => {
        const data = abi.events.RewardsPerSecondChanged.decode(log)
        const id = `${ctx.chain.id}:${log.id}`
        state.rewardsPerSecondChanged.set(
          id,
          new RewardsPerSecondChanged({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            newRPS: data.newRPS,
            oldRPS: data.oldRPS,
          }),
        )
      },
    },
    {
      description: 'Create RewardsTargetChange event',
      filter: rewardsTargetChangeFilter,
      processor: async (ctx: Context, block: Block, log: Log, state: State) => {
        const data = abi.events.RewardsTargetChange.decode(log)
        const id = `${ctx.chain.id}:${log.id}`
        state.rewardsTargetChange.set(
          id,
          new RewardsTargetChange({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            previousTarget: data.previousTarget,
            target: data.target,
          }),
        )
      },
    },
    {
      description: 'Create StrategistUpdated event',
      filter: strategistUpdatedFilter,
      processor: async (ctx: Context, block: Block, log: Log, state: State) => {
        const data = abi.events.StrategistUpdated.decode(log)
        const id = `${ctx.chain.id}:${log.id}`
        state.strategistUpdated.set(
          id,
          new StrategistUpdated({
            id,
            chainId: ctx.chain.id,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            strategistAddress: data._address,
          }),
        )
      },
    },
  ]

  const setup = (processor: EvmBatchProcessor) => {
    for (const subProcessor of subProcessors) {
      processor.addLog(subProcessor.filter.value)
    }
  }

  const process = async (ctx: Context) => {
    const state: State = {
      // Event Entities
      governorshipTransferred: new Map<string, GovernorshipTransferred>(),
      pendingGovernorshipTransfer: new Map<string, PendingGovernorshipTransfer>(),
      rewardCollected: new Map<string, RewardCollected>(),
      rewardsPerSecondChanged: new Map<string, RewardsPerSecondChanged>(),
      rewardsTargetChange: new Map<string, RewardsTargetChange>(),
      strategistUpdated: new Map<string, StrategistUpdated>(),
    }
    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        for (const subProcessor of subProcessors) {
          if (subProcessor.filter.matches(log)) {
            await subProcessor.processor(ctx, block, log, state)
          }
        }
      }
    }
    await Promise.all([
      ctx.store.insert([...state.governorshipTransferred.values()]),
      ctx.store.insert([...state.pendingGovernorshipTransfer.values()]),
      ctx.store.insert([...state.rewardCollected.values()]),
      ctx.store.insert([...state.rewardsPerSecondChanged.values()]),
      ctx.store.insert([...state.rewardsTargetChange.values()]),
      ctx.store.insert([...state.strategistUpdated.values()]),
    ])
  }

  return {
    from,
    setup,
    process,
  }
}
