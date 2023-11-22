import { EvmBatchProcessor } from '@subsquid/evm-processor'
import dayjs from 'dayjs'
import { LessThan } from 'typeorm'
import { formatEther, pad, parseEther, parseUnits } from 'viem'

import * as aaveLendingPool from '../../../abi/aave-lending-pool'
import * as aToken from '../../../abi/aave-token'
import * as baseRewardPool from '../../../abi/base-reward-pool'
import * as erc20 from '../../../abi/erc20'
import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import * as otoken from '../../../abi/otoken'
import { OETH, StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import {
  AURA_REWARDS_POOL_ADDRESS,
  OETH_ADDRESS,
  OETH_DRIPPER_ADDRESS,
  OETH_HARVESTER_ADDRESS,
  OUSD_ADDRESS,
  OUSD_DRIPPER_ADDRESS,
  OUSD_HARVESTER_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { blockFrequencyTracker } from '../../../utils/blockFrequencyUpdater'
import { logFilter } from '../../../utils/logFilter'
import { convertDecimals, lastExcept } from '../../../utils/utils'
import { ensureExchangeRatesAverages } from '../../post-processors/exchange-rates'
import {
  Currency,
  convertRate,
} from '../../post-processors/exchange-rates/currencies'
import { IStrategyData } from './strategy'
import { processStrategyDailyEarnings } from './strategy-daily-earnings'

const eth1 = 1000000000000000000n

const depositWithdrawalTopics = new Set([
  abstractStrategyAbi.events.Deposit.topic,
  abstractStrategyAbi.events.Withdrawal.topic,
])
const baseRewardPoolTopics = new Set([
  baseRewardPool.events.Staked.topic,
  baseRewardPool.events.Withdrawn.topic,
])

const oTokenValues = {
  [OUSD_ADDRESS]: {
    rewardConversionToken: USDT_ADDRESS,
    rewardConversionTokenDecimals: 6,
    harvester: OUSD_HARVESTER_ADDRESS,
    dripper: OUSD_DRIPPER_ADDRESS,
  },
  [OETH_ADDRESS]: {
    rewardConversionToken: WETH_ADDRESS,
    rewardConversionTokenDecimals: 18,
    harvester: OETH_HARVESTER_ADDRESS,
    dripper: OETH_DRIPPER_ADDRESS,
  },
} as const

export const setupStrategyEarnings = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  processor.includeAllBlocks({ from: strategyData.from })
  const balanceUpdateFilters = strategyData.balanceUpdateLogFilters ?? []
  strategyData.balanceUpdateLogFilters = balanceUpdateFilters

  // Detect Deposit/Withdraw events
  // To help us understand when balances change passively vs from activity.
  if (strategyData.earnings?.passiveByDepositWithdrawal) {
    processor.addLog({
      address: [strategyData.address],
      topic0: [...depositWithdrawalTopics.values()],
      range: { from: strategyData.from },
    })

    // Detect Staked/Withdrawn events
    // The curve incident caused us to fully withdraw from our pool and these logs contain that.
    if (strategyData.kind === 'CurveAMO') {
      balanceUpdateFilters.push(
        logFilter({
          address: [strategyData.curvePoolInfo!.rewardsPoolAddress],
          topic0: [...baseRewardPoolTopics.values()],
          topic1: [pad(strategyData.address as `0x${string}`)],
          range: { from: strategyData.from },
        }),
      )
    }
  }
  for (const filter of strategyData.balanceUpdateTraceFilters ?? []) {
    processor.addTrace(filter.value)
  }

  if (strategyData.kind === 'BalancerMetaStablePool') {
    processor.addLog({
      address: [AURA_REWARDS_POOL_ADDRESS],
      topic0: [...baseRewardPoolTopics.values()],
      topic1: [pad(strategyData.address as `0x${string}`)],
      range: { from: strategyData.from },
    })
  }

  // Listen for RewardTokenCollected events and their associated logs
  //  showing how much WETH Harvester sent to Dripper.
  if (strategyData.earnings?.rewardTokenCollected) {
    processor.addLog({
      address: [strategyData.address],
      topic0: [abstractStrategyAbi.events.RewardTokenCollected.topic],
      range: { from: strategyData.from },
    })
    processor.addLog({
      address: [oTokenValues[strategyData.oTokenAddress].rewardConversionToken],
      topic0: [erc20.events.Transfer.topic],
      topic1: [pad(oTokenValues[strategyData.oTokenAddress].harvester)],
      topic2: [pad(oTokenValues[strategyData.oTokenAddress].dripper)],
      range: { from: strategyData.from },
    })
  }

  if (strategyData.kind === 'Vault') {
    balanceUpdateFilters.push(
      logFilter({
        address: strategyData.assets.map((asset) => asset.address),
        topic0: [erc20.events.Transfer.topic],
        topic1: [strategyData.address],
        range: { from: strategyData.from },
      }),
      logFilter({
        address: strategyData.assets.map((asset) => asset.address),
        topic0: [erc20.events.Transfer.topic],
        topic2: [strategyData.address],
        range: { from: strategyData.from },
      }),
    )
  }

  for (const filter of balanceUpdateFilters) {
    processor.addLog(filter.value)
  }
}

const trackers = new Map<string, ReturnType<typeof blockFrequencyTracker>>()
export const processStrategyEarnings = async (
  ctx: Context,
  strategyData: IStrategyData,
  getStrategyBalances: (
    ctx: Context,
    block: {
      height: number
    },
    strategyData: IStrategyData,
  ) => Promise<
    {
      address: string
      asset: string
      balance: bigint
    }[]
  >,
) => {
  const days = new Map<string, Block>()
  const strategyYields = new Map<string, StrategyYield[]>()
  for (const block of ctx.blocks) {
    let didUpdate = false
    days.set(dayjs.utc(block.header.timestamp).format('YYYY-MM-DD'), block)
    const txIgnore = new Set<string>()
    const getBalances = async (
      {
        compare,
      }: {
        compare: number
      } = { compare: -1 },
    ) => {
      const compareBalances = await getStrategyBalances(
        ctx,
        { height: block.header.height + compare },
        strategyData,
      )
      const balances =
        compare === 0
          ? compareBalances
          : await getStrategyBalances(ctx, block.header, strategyData)
      return balances
        .map((balance, i) => {
          return {
            asset: balance.asset,
            balance: balance.balance,
            compareBalance: compareBalances[i].balance,
          }
        })
        .map((b) => {
          b.balance = convertDecimals(
            strategyData.assets.find(
              (a) => a.address.toLowerCase() === b.asset.toLowerCase(),
            )!.decimals,
            strategyData.base.decimals,
            b.balance,
          )
          b.compareBalance = convertDecimals(
            strategyData.assets.find(
              (a) => a.address.toLowerCase() === b.asset.toLowerCase(),
            )!.decimals,
            strategyData.base.decimals,
            b.compareBalance,
          )
          return b
        })
    }
    const balanceTrackingUpdate = async () => {
      // ctx.log.info(`balanceTrackingUpdate`)
      didUpdate = true
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
      // ctx.log.info(`balanceTrackingUpdateBalancerMetaStablePool`)
      didUpdate = true
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
      strategyData.balanceUpdateTraceFilters &&
      strategyData.balanceUpdateTraceFilters.length > 0
    ) {
      for (const trace of block.traces) {
        if (
          strategyData.balanceUpdateTraceFilters.find((f) => f.matches(trace))
        ) {
          await balanceTrackingUpdate()
        }
      }
    }

    for (const log of block.logs) {
      const rewardTokenCollectedUpdate = async () => {
        // ctx.log.info(`rewardTokenCollectedUpdate`)
        didUpdate = true
        txIgnore.add(log.transactionHash)

        const earningsTransferLogs = block.logs.filter(
          (l) =>
            l.transactionHash === log.transactionHash &&
            l.address.toLowerCase() ===
              oTokenValues[strategyData.oTokenAddress].rewardConversionToken &&
            l.topics[0] === erc20.events.Transfer.topic &&
            l.topics[1] ===
              pad(oTokenValues[strategyData.oTokenAddress].harvester) &&
            l.topics[2] ===
              pad(oTokenValues[strategyData.oTokenAddress].dripper),
        )
        const amount = earningsTransferLogs.reduce(
          (sum, l) => sum + BigInt(l.data),
          0n,
        )

        await processRewardTokenCollected(
          ctx,
          strategyData,
          block,
          strategyYields,
          {
            token: strategyData.base.address,
            amount: convertDecimals(
              oTokenValues[strategyData.oTokenAddress]
                .rewardConversionTokenDecimals,
              strategyData.base.decimals,
              amount,
            ),
          },
        )
      }

      if (
        strategyData.kind === 'BalancerMetaStablePool' &&
        log.address === AURA_REWARDS_POOL_ADDRESS &&
        baseRewardPoolTopics.has(log.topics[0]) &&
        log.topics[1] === pad(strategyData.address as `0x${string}`)
      ) {
        await balanceTrackingUpdateBalancerMetaStablePool()
      } else if (
        strategyData.balanceUpdateLogFilters?.find((f) => f.matches(log))
      ) {
        await balanceTrackingUpdate()
      } else if (
        log.address === strategyData.address &&
        strategyData.earnings?.passiveByDepositWithdrawal &&
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
        strategyData.earnings?.rewardTokenCollected &&
        log.topics[0] ===
          abstractStrategyAbi.events.RewardTokenCollected.topic &&
        !txIgnore.has(log.transactionHash)
      ) {
        await rewardTokenCollectedUpdate()
      }
    }

    if (!didUpdate) {
      let tracker = trackers.get(strategyData.address)
      if (!tracker) {
        tracker = blockFrequencyTracker({ from: strategyData.from })
        trackers.set(strategyData.address, tracker)
      }
      if (tracker(ctx, block)) {
        const balances = await getBalances({ compare: 0 })
        await processDepositWithdrawal(
          ctx,
          strategyData,
          block,
          strategyYields,
          balances,
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
  params: {
    token: string
    amount: bigint
  },
) => {
  const id = `${block.header.height}:${strategyData.address}:${strategyData.base.address}`
  // ctx.log.info(`processRewardTokenCollected ${id}`)
  // ctx.log.info(`Amount earned through rewards: ${formatEther(params.amount)}`)
  let { latest, current, results } = await getLatest(
    ctx,
    block,
    resultMap,
    strategyData,
    strategyData.base.address,
    id,
  )

  const amount = params.amount
  if (!current) {
    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      strategy: strategyData.address,
      asset: strategyData.base.address,
      balance: latest?.balance ?? 0n,
      balanceWeight: latest?.balanceWeight ?? 1,
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
    compareBalance: bigint
    balance: bigint
  }[],
) => {
  const id = `${block.header.height}:${strategyData.address}:${strategyData.base.address}`
  // ctx.log.info(assets, `processDepositWithdrawal ${id}`)
  let { latest, current, results } = await getLatest(
    ctx,
    block,
    resultMap,
    strategyData,
    strategyData.base.address,
    id,
  )

  if (!current) {
    // Convert incoming values to ETH
    const desiredRates = strategyData.assets
      .filter((a) => a.convertTo)
      .map((a) => [a.convertTo!.address, a.address]) as [Currency, Currency][]
    const rates = await ensureExchangeRatesAverages(
      ctx,
      block,
      dayjs.utc(block.header.timestamp).subtract(21, 'days').toDate(),
      new Date(block.header.timestamp),
      desiredRates,
    )
    const previousBalance = assets.reduce((sum, a, index) => {
      const asset = strategyData.assets[index]
      const compareBalance = asset.convertTo
        ? convertRate(rates, 'ETH', a.asset as Currency, a.compareBalance)
        : a.compareBalance
      return sum + compareBalance
    }, 0n)
    const balance = assets.reduce((sum, a, index) => {
      const asset = strategyData.assets[index]
      const balance = asset.convertTo
        ? convertRate(rates, 'ETH', a.asset as Currency, a.balance)
        : a.balance
      return sum + balance
    }, 0n)

    const otokenBalance =
      assets.find((a) => a.asset.toLowerCase() === strategyData.oTokenAddress)
        ?.balance ?? 0n

    const balanceWeightN =
      eth1 - (balance === 0n ? 0n : (otokenBalance * eth1) / balance)
    const balanceWeight = Number(formatEther(balanceWeightN))

    const timestamp = new Date(block.header.timestamp)
    let earningsChange =
      previousBalance - (latest?.balance ?? previousBalance) ?? 0n

    // TODO: ??? Probably should listen for add/remove liquidity events
    //  and calculate earnings changes from fees rather than relying on this
    //  picking up those events. It works fine in some pools, but if we want to
    //  remove OETH from APY considerations then we need more detail.
    if (strategyData.kind === 'CurveAMO') {
      // Only consider earnings on this event by ETH proportion.
      earningsChange *= balanceWeightN / eth1
    }

    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp,
      strategy: strategyData.address,
      asset: strategyData.base.address,
      balance,
      balanceWeight,
      earningsChange,
      earnings: (latest?.earnings ?? 0n) + earningsChange,
    })
    ctx.log.info(
      `${block.header.height} Setting balance: ${formatEther(
        balance,
      )}, last balance: ${formatEther(
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

    // Avoid creating this if nothing has changed.
    if (
      !(
        latest &&
        latest.strategy === current.strategy &&
        latest.asset === current.asset &&
        latest.balance === current.balance &&
        latest.balanceWeight === current.balanceWeight &&
        latest.earningsChange === current.earningsChange &&
        latest.earnings === current.earnings
      )
    ) {
      results.push(current)
    }
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
