import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { LessThan } from 'typeorm'
import { formatEther, pad } from 'viem'

import * as baseRewardPool from '../../../abi/base-reward-pool'
import * as erc20 from '../../../abi/erc20'
import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import { StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import {
  AURA_REWARDS_POOL_ADDRESS,
  ETH_ADDRESS,
  OETH_DRIPPER_ADDRESS,
  OETH_HARVESTER_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { lastExcept } from '../../../utils/utils'
import {
  ensureExchangeRate,
  ensureExchangeRates,
} from '../../post-processors/exchange-rates'
import {
  Currency,
  convertRate,
} from '../../post-processors/exchange-rates/currencies'
import { IStrategyData } from './strategy'
import { processStrategyDailyEarnings } from './strategy-daily-earnings'

const depositWithdrawalTopics = new Set([
  abstractStrategyAbi.events.Deposit.topic,
  abstractStrategyAbi.events.Withdrawal.topic,
])
const baseRewardPoolTopics = new Set([
  baseRewardPool.events.Staked.topic,
  baseRewardPool.events.Withdrawn.topic,
])

export const setupStrategyEarnings = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  // Detect Deposit/Withdraw events
  // To help us understand when balances change passively vs from activity.
  if (strategyData.earnings.passiveByDepositWithdrawal) {
    processor.addLog({
      address: [strategyData.address],
      topic0: [...depositWithdrawalTopics.values()],
    })

    // Detect Staked/Withdrawn events
    // The curve incident caused us to fully withdraw from our pool and these logs contain that.
    if (strategyData.kind === 'CurveAMO') {
      processor.addLog({
        address: [strategyData.curvePoolInfo!.rewardsPoolAddress],
        topic0: [...baseRewardPoolTopics.values()],
        topic1: [pad(strategyData.address as `0x${string}`)],
      })
    }
  }

  if (strategyData.kind === 'BalancerMetaStablePool') {
    processor.addLog({
      address: [AURA_REWARDS_POOL_ADDRESS],
      topic0: [...baseRewardPoolTopics.values()],
      topic1: [pad(strategyData.address as `0x${string}`)],
    })
  }

  // Listen for RewardTokenCollected events and their associated logs
  //  showing how much WETH Harvester sent to Dripper.
  if (strategyData.earnings.rewardTokenCollected) {
    processor.addLog({
      address: [strategyData.address],
      topic0: [abstractStrategyAbi.events.RewardTokenCollected.topic],
    })
    processor.addLog({
      address: [WETH_ADDRESS],
      topic0: [erc20.events.Transfer.topic],
      topic1: [pad(OETH_HARVESTER_ADDRESS)],
      topic2: [pad(OETH_DRIPPER_ADDRESS)],
    })
  }
}

export const processStrategyEarnings = async (
  ctx: Context,
  strategyData: IStrategyData,
  getStrategyBalances: (
    ctx: Context,
    block: { height: number },
    strategyData: IStrategyData,
  ) => Promise<{ address: string; asset: string; balance: bigint }[]>,
) => {
  const days = new Map<string, Block>()
  const strategyYields = new Map<string, StrategyYield[]>()
  for (const block of ctx.blocks) {
    const dayId = dayjs.utc(block.header.timestamp).format('YYYY-MM-DD')
    const txIgnore = new Set<string>()
    for (const log of block.logs) {
      const getBalances = async () => {
        const previousBalances = await getStrategyBalances(
          ctx,
          { height: block.header.height - 1 },
          strategyData,
        )
        const balances = await getStrategyBalances(
          ctx,
          block.header,
          strategyData,
        )
        return balances.map((balance, i) => {
          return {
            asset: balance.asset,
            balance: balance.balance,
            previousBalance: previousBalances[i].balance,
          }
        })
      }
      const balanceTrackingUpdate = async () => {
        ctx.log.info(`balanceTrackingUpdate`)
        days.set(dayId, block)
        const balances = await getBalances()
        await processDepositWithdrawal(
          ctx,
          strategyData,
          block,
          strategyYields,
          balances,
        )
      }
      const balanceTrackingUpdateBalancerMetaStablePool = async () => {
        ctx.log.info(`balanceTrackingUpdateBalancerMetaStablePool`)
        days.set(dayId, block)
        const balances = await getBalances()
        await processDepositWithdrawal(
          ctx,
          strategyData,
          block,
          strategyYields,
          balances,
        )
      }
      if (
        strategyData.kind === 'CurveAMO' &&
        log.address === strategyData.curvePoolInfo!.rewardsPoolAddress &&
        baseRewardPoolTopics.has(log.topics[0]) &&
        log.topics[1] === pad(strategyData.address as `0x${string}`)
      ) {
        await balanceTrackingUpdate()
      } else if (
        strategyData.kind === 'BalancerMetaStablePool' &&
        log.address === AURA_REWARDS_POOL_ADDRESS &&
        baseRewardPoolTopics.has(log.topics[0]) &&
        log.topics[1] === pad(strategyData.address as `0x${string}`)
      ) {
        await balanceTrackingUpdateBalancerMetaStablePool()
      } else if (
        log.address === strategyData.address &&
        strategyData.earnings.passiveByDepositWithdrawal &&
        depositWithdrawalTopics.has(log.topics[0])
      ) {
        ctx.log.info({
          type:
            log.topics[0] === abstractStrategyAbi.events.Deposit.topic
              ? 'Deposit'
              : 'Withdrawal',
          transactionHash: log.transactionHash,
        })
        await balanceTrackingUpdate()
      } else if (
        log.address === strategyData.address &&
        strategyData.earnings.rewardTokenCollected &&
        log.topics[0] ===
          abstractStrategyAbi.events.RewardTokenCollected.topic &&
        !txIgnore.has(log.transactionHash)
      ) {
        days.set(dayId, block)
        txIgnore.add(log.transactionHash)
        const wethTransferLogs = block.logs.filter(
          (l) =>
            l.transactionHash === log.transactionHash &&
            l.address.toLowerCase() === WETH_ADDRESS &&
            l.topics[0] === erc20.events.Transfer.topic &&
            l.topics[1] === pad(OETH_HARVESTER_ADDRESS) &&
            l.topics[2] === pad(OETH_DRIPPER_ADDRESS),
        )
        const amount = wethTransferLogs.reduce(
          (sum, l) => sum + BigInt(l.data),
          0n,
        )

        await processRewardTokenCollected(
          ctx,
          strategyData,
          block,
          strategyYields,
          {
            token: WETH_ADDRESS,
            amount,
          },
        )
      }
    }
  }
  const results = [...strategyYields.values()].flat()
  await ctx.store.upsert(results)
  await processStrategyDailyEarnings(ctx, [...days.values()], strategyData)
}

const processRewardTokenCollected = async (
  ctx: Context,
  strategyData: IStrategyData,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  params: { token: string; amount: bigint },
) => {
  const id = `${block.header.height}:${strategyData.address}:${ETH_ADDRESS}`
  // ctx.log.info(`processRewardTokenCollected ${id}`)
  // ctx.log.info(`Amount earned through rewards: ${formatEther(params.amount)}`)
  let { latest, current, results } = await getLatest(
    ctx,
    block,
    resultMap,
    strategyData,
    ETH_ADDRESS,
    id,
  )

  // Convert value to ETH
  const rate = await ensureExchangeRate(
    ctx,
    block,
    'ETH',
    params.token as Currency,
  )

  const amount = convertRate(
    [rate!],
    'ETH',
    params.token as Currency,
    params.amount,
  )

  if (!current) {
    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      strategy: strategyData.address,
      asset: ETH_ADDRESS,
      balance: latest?.balance ?? 0n,
      earnings: (latest?.earnings ?? 0n) + amount,
      earningsChange: amount,
    })
    results.push(current)
  } else {
    current.earnings += amount
    current.earningsChange += amount
  }
}

const processDepositWithdrawal = async (
  ctx: Context,
  strategyData: IStrategyData,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  assets: {
    asset: string
    previousBalance: bigint
    balance: bigint
  }[],
) => {
  const id = `${block.header.height}:${strategyData.address}:${ETH_ADDRESS}`
  ctx.log.info(assets, `processDepositWithdrawal ${id}`)
  let { latest, current, results } = await getLatest(
    ctx,
    block,
    resultMap,
    strategyData,
    ETH_ADDRESS,
    id,
  )

  if (!current) {
    // Convert incoming values to ETH
    const rates = await ensureExchangeRates(
      ctx,
      block,
      assets.map((a) => ['ETH', a.asset as Currency]),
    )
    const previousBalance = assets.reduce((sum, a) => {
      return (
        sum + convertRate(rates, 'ETH', a.asset as Currency, a.previousBalance)
      )
    }, 0n)
    const balance = assets.reduce((sum, a) => {
      return sum + convertRate(rates, 'ETH', a.asset as Currency, a.balance)
    }, 0n)

    const timestamp = new Date(block.header.timestamp)
    let earningsChange =
      previousBalance - (latest?.balance ?? previousBalance) ?? 0n

    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp,
      strategy: strategyData.address,
      asset: ETH_ADDRESS,
      balance,
      earningsChange,
      earnings: (latest?.earnings ?? 0n) + earningsChange,
    })
    ctx.log.info(
      `Setting balance: ${formatEther(balance)}, last balance: ${formatEther(
        latest?.balance ?? 0n,
      )}, previous block balance: ${formatEther(
        previousBalance,
      )}, perceived earnings: ${formatEther(
        earningsChange,
      )}, total earnings: ${formatEther(current.earnings)}`,
    )
    if (earningsChange < 0) {
      ctx.log.warn('WARNING: earnings change is negative')
    }
    results.push(current)
  }
}

const getLatest = async (
  ctx: Context,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  strategyData: IStrategyData,
  asset: string,
  id: string,
) => {
  let results = resultMap.get(asset)
  if (!results) {
    // ctx.log.info(`creating results set for ${asset}`)
    results = []
    resultMap.set(asset, results)
  }
  let latest =
    lastExcept(resultMap.get(asset), id) ??
    (await ctx.store.findOne(StrategyYield, {
      order: { blockNumber: 'desc' },
      where: {
        blockNumber: LessThan(block.header.height),
        strategy: strategyData.address,
        asset,
      },
    }))
  let current = resultMap.get(asset)?.find((l) => l.id === id)
  return { latest, current, results }
}
