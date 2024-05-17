import * as abi from '@abi/exponential-staking'
import {
  ExponentialStakingDelegateChanged,
  ExponentialStakingDelegateVotesChanged,
  ExponentialStakingLockup,
  ExponentialStakingLockupState,
  ExponentialStakingPenalty,
  ExponentialStakingReward,
  ExponentialStakingStake,
  ExponentialStakingUnstake,
} from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { TokenAddress } from '@utils/addresses'
import { LogFilter, logFilter } from '@utils/logFilter'

interface State {
  // State Entities
  lockup: Map<string, ExponentialStakingLockup>

  // Event Entities
  delegateChanged: Map<string, ExponentialStakingDelegateChanged>
  delegateVotesChanged: Map<string, ExponentialStakingDelegateVotesChanged>
  penalty: Map<string, ExponentialStakingPenalty>
  reward: Map<string, ExponentialStakingReward>
  stake: Map<string, ExponentialStakingStake>
  unstake: Map<string, ExponentialStakingUnstake>
}

export const createExponentialStakingTracker = ({
  from,
  chainId,
  address,
}: {
  from: number
  chainId: number
  address: TokenAddress
}) => {
  const delegateChangedFilter = logFilter({
    address: [address],
    topic0: [abi.events.DelegateChanged.topic],
    range: { from },
  })
  const delegateVotesChangedFilter = logFilter({
    address: [address],
    topic0: [abi.events.DelegateVotesChanged.topic],
    range: { from },
  })
  const penaltyFilter = logFilter({
    address: [address],
    topic0: [abi.events.Penalty.topic],
    range: { from },
  })
  const stakeFilter = logFilter({
    address: [address],
    topic0: [abi.events.Stake.topic],
    range: { from },
  })
  const unstakeFilter = logFilter({
    address: [address],
    topic0: [abi.events.Unstake.topic],
    range: { from },
  })
  const subProcessors: {
    description: string
    filter: LogFilter
    processor: (ctx: Context, block: Block, log: Log, state: State) => Promise<void>
  }[] = [
    // Event Entity Processors
    {
      description: 'Create DelegateChanged event',
      filter: delegateChangedFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.DelegateChanged.decode(log)
        const id = log.id
        const entity = new ExponentialStakingDelegateChanged({
          id,
          chainId,
          address,
          delegator: data.delegator,
          fromDelegate: data.fromDelegate,
          toDelegate: data.toDelegate,
        })
        state.delegateChanged.set(id, entity)
      },
    },
    {
      description: 'Create DelegateVotesChanged event',
      filter: delegateVotesChangedFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.DelegateVotesChanged.decode(log)
        const id = log.id
        const entity = new ExponentialStakingDelegateVotesChanged({
          id,
          chainId,
          address,
          delegate: data.delegate,
          newBalance: data.newBalance,
          previousBalance: data.previousBalance,
        })
        state.delegateVotesChanged.set(id, entity)
      },
    },
    {
      description: 'Create Penalty event',
      filter: penaltyFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.Penalty.decode(log)
        const id = log.id
        const entity = new ExponentialStakingPenalty({
          id,
          chainId,
          address,
          account: data.user,
          amount: data.amount,
        })
        state.penalty.set(id, entity)
      },
    },
    {
      description: 'Create Stake event',
      filter: stakeFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.Stake.decode(log)
        const id = log.id
        const entity = new ExponentialStakingStake({
          id,
          chainId,
          address,
          lockupId: data.lockupId,
          account: data.user,
          amount: data.amount,
          points: data.points,
          end: data.end,
        })
        state.stake.set(id, entity)
      },
    },
    {
      description: 'Create Unstake event',
      filter: unstakeFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.Unstake.decode(log)
        const id = log.id
        const entity = new ExponentialStakingUnstake({
          id,
          chainId,
          address,
          lockupId: data.lockupId,
          account: data.user,
          amount: data.amount,
          points: data.points,
          end: data.end,
        })
        state.unstake.set(id, entity)
      },
    },
    
    // State Entity Processors
    {
      description: 'Handle Stake for Lockup',
      filter: stakeFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.Stake.decode(log)
        const id = `${chainId}:${address}:${data.lockupId}`
        const entity = new ExponentialStakingLockup({
          id,
          chainId,
          address,
          account: data.user,
          lockupId: data.lockupId,
          end: data.end,
          amount: data.amount,
          points: data.points,
          withdrawAmount: 0n,
          penalty: 0n,
          state: ExponentialStakingLockupState.Open,
        })
        state.lockup.set(id, entity)
      },
    },
    {
      description: 'Handle Unstake for Lockup',
      filter: unstakeFilter,
      processor: async (ctx, block, log, state) => {
        const data = abi.events.Unstake.decode(log)
        const id = `${chainId}:${address}:${data.lockupId}`
        const entity = state.lockup.get(id) ?? (await ctx.store.get(ExponentialStakingLockup, id))
        if (!entity) throw new Error(`Lockup not found: ${id}`)
        entity.withdrawAmount = data.amount
        entity.penalty = entity.amount - data.amount
        entity.state = ExponentialStakingLockupState.Closed
        state.lockup.set(id, entity)
      },
    },
  ]

  return {
    from,
    setup(processor: EvmBatchProcessor) {
      for (const subProcessor of subProcessors) {
        processor.addLog(subProcessor.filter.value)
      }
      processor.includeAllBlocks({ from })
    },
    async process(ctx: Context) {
      const state: State = {
        // State Entities
        lockup: new Map<string, ExponentialStakingLockup>(),

        // Event Entities
        delegateChanged: new Map<string, ExponentialStakingDelegateChanged>(),
        delegateVotesChanged: new Map<string, ExponentialStakingDelegateVotesChanged>(),
        penalty: new Map<string, ExponentialStakingPenalty>(),
        reward: new Map<string, ExponentialStakingReward>(),
        stake: new Map<string, ExponentialStakingStake>(),
        unstake: new Map<string, ExponentialStakingUnstake>(),
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
        ctx.store.insert([...state.delegateChanged.values()]),
        ctx.store.insert([...state.delegateVotesChanged.values()]),
        ctx.store.insert([...state.penalty.values()]),
        ctx.store.insert([...state.reward.values()]),
        ctx.store.insert([...state.stake.values()]),
        ctx.store.upsert([...state.lockup.values()]),
      ])
    },
  }
}
