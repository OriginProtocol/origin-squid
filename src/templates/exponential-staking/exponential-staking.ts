import * as abi from '@abi/exponential-staking'
import * as fixedRewardsAbi from '@abi/fixed-rate-rewards-source'
import {
  ESAccount,
  ESDelegateChanged,
  ESDelegateVotesChanged,
  ESLockup,
  ESLockupEvent,
  ESLockupEventType,
  ESLockupState,
  ESPenalty,
  ESReward,
  ESStake,
  ESUnstake,
  ESYield,
  FRRSRewardsPerSecondChanged,
} from '@model'
import {
  Block,
  Context,
  EvmBatchProcessor,
  Log,
  LogFilter,
  calculateAPY2,
  convertApyToApr,
  logFilter,
} from '@originprotocol/squid-utils'
import { waitForERC20State } from '@shared/erc20'
import { TokenAddress } from '@utils/symbols'

interface State {
  // State Entities
  account: Map<string, ESAccount>
  lockup: Map<string, ESLockup>
  lockupEvent: Map<string, ESLockupEvent>
  yield: Map<string, ESYield>

  // Event Entities
  delegateChanged: Map<string, ESDelegateChanged>
  delegateVotesChanged: Map<string, ESDelegateVotesChanged>
  penalty: Map<string, ESPenalty>
  reward: Map<string, ESReward>
  stake: Map<string, ESStake>
  unstake: Map<string, ESUnstake>

  // Local State Tracking
  rewardsPerSecond: bigint[]
}

interface SubProcessor {
  enabled?: boolean
  description: string
  filter: LogFilter | LogFilter[]
  processor: (params: { ctx: Context; block: Block; log: Log; state: State }) => Promise<void>
}

/**
 * Create an ExponentialStaking contract tracker.
 */
export const createESTracker = ({
  from,
  address,
  assetAddress,
  rewardsAddress,
  yieldType,
}: {
  from: number
  address: TokenAddress
  assetAddress: TokenAddress
  rewardsAddress: string
  yieldType: 'fixed' | undefined
}) => {
  const assetTransferFromFilter = logFilter({
    address: [assetAddress],
    topic0: [abi.events.Transfer.topic],
    topic1: [address],
    range: { from },
  })
  const assetTransferToFilter = logFilter({
    address: [assetAddress],
    topic0: [abi.events.Transfer.topic],
    topic2: [address],
    range: { from },
  })
  const fixedRewardsChangeFilter = logFilter({
    address: [rewardsAddress],
    topic0: [fixedRewardsAbi.events.RewardsPerSecondChanged.topic],
    range: { from },
  })
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
  const rewardFilter = logFilter({
    address: [address],
    topic0: [abi.events.Reward.topic],
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

  const eventProcessors: SubProcessor[] = [
    {
      description: 'Create DelegateChanged event',
      filter: delegateChangedFilter,
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.DelegateChanged.decode(log)
        const id = `${chainId}:${log.id}`
        const entity = new ESDelegateChanged({
          id,
          chainId,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
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
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.DelegateVotesChanged.decode(log)
        const id = `${chainId}:${log.id}`
        const entity = new ESDelegateVotesChanged({
          id,
          chainId,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
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
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.Penalty.decode(log)
        const id = `${chainId}:${log.id}`
        const entity = new ESPenalty({
          id,
          chainId,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
          account: data.user,
          amount: data.amount,
        })
        state.penalty.set(id, entity)
      },
    },
    {
      description: 'Create Reward event',
      filter: rewardFilter,
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.Reward.decode(log)
        const id = `${chainId}:${log.id}`
        const entity = new ESReward({
          id,
          chainId,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
          account: data.user,
          amount: data.amount,
        })
        state.reward.set(id, entity)
      },
    },
    {
      description: 'Create Stake event',
      filter: stakeFilter,
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.Stake.decode(log)
        const id = `${chainId}:${log.id}`
        const entity = new ESStake({
          id,
          chainId,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
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
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.Unstake.decode(log)
        const id = `${chainId}:${log.id}`
        const entity = new ESUnstake({
          id,
          chainId,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
          lockupId: data.lockupId,
          account: data.user,
          amount: data.amount,
          points: data.points,
          end: data.end,
        })
        state.unstake.set(id, entity)
      },
    },
  ]

  const lockupProcessors: SubProcessor[] = [
    {
      description: 'Handle Stake',
      filter: stakeFilter,
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.Stake.decode(log)
        const id = `${chainId}:${address}:${data.user}:${data.lockupId}`
        const entity = new ESLockup({
          id,
          chainId,
          address,
          txHash: log.transactionHash,
          account: data.user,
          lockupId: data.lockupId,
          timestamp: new Date(block.header.timestamp),
          lastUpdated: new Date(block.header.timestamp),
          end: new Date(Number(data.end) * 1000),
          amount: data.amount,
          points: data.points,
          withdrawAmount: 0n,
          penalty: 0n,
          state: ESLockupState.Open,
        })
        state.lockup.set(id, entity)

        const isExtend = block.logs.find(
          (l) => unstakeFilter.matches(l) && abi.events.Unstake.decode(l).lockupId === data.lockupId,
        )
        const lockupEventId = `${id}:${log.id}`
        state.lockupEvent.set(
          lockupEventId,
          new ESLockupEvent({
            id: lockupEventId,
            chainId,
            address,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            lockup: entity,
            event: isExtend ? ESLockupEventType.Extended : ESLockupEventType.Staked,
          }),
        )

        const contract = new abi.Contract(ctx, block.header, address)
        const account = await getAccount(ctx, state, data.user)
        account.stakedBalance += data.amount
        account.votingPower = await contract.getVotes(account.account)
        if (account.delegateTo) {
          const delegateAccount = await getAccount(ctx, state, account.delegateTo.account)
          delegateAccount.votingPower = await contract.getVotes(delegateAccount.account)
        }
      },
    },
    {
      description: 'Handle Unstake',
      filter: unstakeFilter,
      processor: async ({ ctx, block, log, state }) => {
        const chainId = ctx.chain.id
        const data = abi.events.Unstake.decode(log)
        const id = `${chainId}:${address}:${data.user}:${data.lockupId}`
        const entity = state.lockup.get(id) ?? (await ctx.store.get(ESLockup, id))
        if (!entity) throw new Error(`Lockup not found: ${id}`)
        entity.lastUpdated = new Date(block.header.timestamp)
        entity.withdrawAmount = data.amount
        entity.penalty = entity.amount - data.amount
        entity.state = ESLockupState.Closed
        state.lockup.set(id, entity)

        const isExtend = block.logs.find(
          (l) => stakeFilter.matches(l) && abi.events.Stake.decode(l).lockupId === data.lockupId,
        )
        if (!isExtend) {
          const lockupEventId = `${id}:${log.id}`
          state.lockupEvent.set(
            lockupEventId,
            new ESLockupEvent({
              id: lockupEventId,
              chainId,
              address,
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
              txHash: log.transactionHash,
              lockup: entity,
              event: ESLockupEventType.Unstaked,
            }),
          )
        }

        const contract = new abi.Contract(ctx, block.header, address)
        const account = await getAccount(ctx, state, data.user)
        account.votingPower = await contract.getVotes(account.account)
        account.stakedBalance -= entity.amount
        if (account.delegateTo) {
          const delegateAccount = await getAccount(ctx, state, account.delegateTo.account)
          delegateAccount.votingPower = await contract.getVotes(delegateAccount.account)
        }
      },
    },
  ]

  const yieldProcessors: SubProcessor[] = [
    {
      description: 'Add rewardsPerSecond for local state',
      filter: fixedRewardsChangeFilter,
      processor: async ({ log, state }) => {
        const rewardsPerSecond = fixedRewardsAbi.events.RewardsPerSecondChanged.decode(log).newRPS
        state.rewardsPerSecond.push(rewardsPerSecond)
      },
    },
    {
      description: 'Create Yield Entity',
      enabled: yieldType === 'fixed',
      filter: [assetTransferFromFilter, assetTransferToFilter, fixedRewardsChangeFilter],
      processor: async ({ ctx, block, log, state }) => {
        // TODO: this looks too complicated (?)
        const id = `${ctx.chain.id}:${log.id}`
        const assetContract = new abi.Contract(ctx, block.header, assetAddress)
        const assetBalance = await assetContract.balanceOf(address) // Could optimize to not use RPC but saving time here.
        // Get the latest rewards per second - consider that it might be on this block.
        const rpsLog = block.logs.find((l) => fixedRewardsChangeFilter.matches(l))
        const rpsFromBlock = rpsLog && fixedRewardsAbi.events.RewardsPerSecondChanged.decode(rpsLog).newRPS
        const rpsFromState =
          state.rewardsPerSecond.length > 0 && state.rewardsPerSecond[state.rewardsPerSecond.length - 1]
        const rewardsPerSecond =
          rpsFromBlock ||
          rpsFromState ||
          (await ctx.store
            .findOne(FRRSRewardsPerSecondChanged, {
              order: { timestamp: 'desc' },
              where: { chainId: ctx.chain.id, address: rewardsAddress },
            })
            .then((r) => r?.newRPS)) ||
          0n

        const rewardsPerYear = (60n * 60n * 24n * 36525n * rewardsPerSecond) / 100n
        const apy = calculateAPY2(assetBalance, assetBalance + rewardsPerYear)
        const apr = convertApyToApr(apy)
        const entity = new ESYield({
          id,
          chainId: ctx.chain.id,
          address,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          assetBalance,
          rewardsPerSecond,
          apr,
          apy,
        })

        const existing = state.yield.get(id)
        if (
          !existing ||
          (entity.rewardsPerSecond !== existing.rewardsPerSecond && fixedRewardsChangeFilter.matches(log))
        ) {
          state.yield.set(id, entity)
        }
      },
    },
  ]

  const delegationProcessors: SubProcessor[] = [
    {
      description: 'Add delegate to account',
      filter: delegateChangedFilter,
      processor: async ({ ctx, log, state }) => {
        const data = abi.events.DelegateChanged.decode(log)
        const entity = await getAccount(ctx, state, data.delegator)
        if (data.toDelegate === data.delegator) {
          entity.delegateTo = null
        } else {
          entity.delegateTo = await getAccount(ctx, state, data.toDelegate)
        }
        state.account.set(entity.id, entity)
      },
    },
    {
      description: 'Update delegate voting balance',
      filter: delegateVotesChangedFilter,
      processor: async ({ ctx, log, state }) => {
        const data = abi.events.DelegateVotesChanged.decode(log)
        const entity = await getAccount(ctx, state, data.delegate)
        entity.votingPower = data.newBalance
        state.account.set(entity.id, entity)
      },
    },
  ]

  const subProcessors: SubProcessor[] = [
    ...eventProcessors,
    ...lockupProcessors,
    ...yieldProcessors,
    ...delegationProcessors,
  ].filter((f) => f.enabled !== false)

  const updateBalances = async (ctx: Context, state: State) => {
    // Take updated balances from erc20 processors and update our local balances.
    const erc20State = await waitForERC20State(ctx, address)
    for (const holder of erc20State.holders.values()) {
      const account = await getAccount(ctx, state, holder.account)
      account.balance = holder.balance
    }
  }

  const updateAssetBalances = async (ctx: Context, state: State) => {
    const assetERC20State = await waitForERC20State(ctx, assetAddress)
    for (const holder of assetERC20State.holders.values()) {
      const account = await getAccount(ctx, state, holder.account)
      account.assetBalance = holder.balance
    }
  }

  const getAccount = async (ctx: Context, state: State, account: string) => {
    const id = `${ctx.chain.id}:${address}:${account}`
    const local = state.account.get(id)
    if (local) {
      return local
    }
    const existing = await ctx.store.get(ESAccount, { where: { id }, relations: { delegateTo: true } })
    if (existing) {
      state.account.set(id, existing)
      return existing
    }
    const created = new ESAccount({
      id,
      chainId: ctx.chain.id,
      address,
      account,
      assetBalance: 0n,
      stakedBalance: 0n,
      balance: 0n,
      votingPower: 0n,
      delegateTo: null,
      delegatesFrom: [],
    })
    state.account.set(id, created)
    return created
  }

  return {
    from,
    setup(processor: EvmBatchProcessor) {
      processor.addLog(assetTransferFromFilter.value)
      processor.addLog(assetTransferToFilter.value)
      processor.addLog(fixedRewardsChangeFilter.value)
      processor.addLog(delegateChangedFilter.value)
      processor.addLog(delegateVotesChangedFilter.value)
      processor.addLog(penaltyFilter.value)
      processor.addLog(stakeFilter.value)
      processor.addLog(unstakeFilter.value)
    },
    async process(ctx: Context) {
      const state: State = {
        // State Entities
        lockup: new Map<string, ESLockup>(),
        lockupEvent: new Map<string, ESLockupEvent>(),
        yield: new Map<string, ESYield>(),
        account: new Map<string, ESAccount>(),

        // Event Entities
        delegateChanged: new Map<string, ESDelegateChanged>(),
        delegateVotesChanged: new Map<string, ESDelegateVotesChanged>(),
        penalty: new Map<string, ESPenalty>(),
        reward: new Map<string, ESReward>(),
        stake: new Map<string, ESStake>(),
        unstake: new Map<string, ESUnstake>(),

        // Local State Tracking
        rewardsPerSecond: [],
      }
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          for (const subProcessor of subProcessors) {
            if (Array.isArray(subProcessor.filter)) {
              for (const filter of subProcessor.filter) {
                if (filter.matches(log)) {
                  await subProcessor.processor({ ctx, block, log, state })
                }
              }
            } else {
              if (subProcessor.filter.matches(log)) {
                await subProcessor.processor({ ctx, block, log, state })
              }
            }
          }
        }
      }
      await Promise.all([updateBalances(ctx, state), updateAssetBalances(ctx, state)])
      await Promise.all([
        ctx.store.insert([...state.delegateChanged.values()]),
        ctx.store.insert([...state.delegateVotesChanged.values()]),
        ctx.store.insert([...state.penalty.values()]),
        ctx.store.insert([...state.reward.values()]),
        ctx.store.insert([...state.stake.values()]),
        ctx.store.insert([...state.unstake.values()]),
        ctx.store.upsert([...state.account.values()]),
        ctx.store.upsert([...state.lockup.values()]),
        ctx.store.insert([...state.yield.values()]),
      ])
      await ctx.store.insert([...state.lockupEvent.values()])
    },
  }
}
