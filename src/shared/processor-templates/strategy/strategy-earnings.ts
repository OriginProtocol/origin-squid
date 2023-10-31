import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { LessThan } from 'typeorm'
import { formatEther, pad } from 'viem'

import * as baseRewardPool from '../../../abi/base-reward-pool'
import * as erc20 from '../../../abi/erc20'
import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import { StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import {
  OETH_DRIPPER_ADDRESS,
  OETH_HARVESTER_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { IStrategyData } from './strategy'

const depositWithdrawalTopics = new Set([
  abstractStrategyAbi.events.Deposit.topic,
  abstractStrategyAbi.events.Withdrawal.topic,
])

export const setupStrategyEarnings = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  if (strategyData.earnings.passiveByDepositWithdrawal) {
    processor.addLog({
      address: [strategyData.address],
      topic0: [
        abstractStrategyAbi.events.Deposit.topic,
        abstractStrategyAbi.events.Withdrawal.topic,
      ],
    })
    if (strategyData.kind === 'CurveAMO') {
      processor.addLog({
        address: [strategyData.curvePoolInfo!.rewardsPoolAddress],
        topic0: [
          baseRewardPool.events.Staked.topic,
          baseRewardPool.events.Withdrawn.topic,
        ],
        topic1: [pad(strategyData.address as `0x${string}`)],
      })
    }
  }
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
  ctx.log.info(`NEW CONTEXT`)

  const strategyYields = new Map<string, StrategyYield[]>()

  for (const block of ctx.blocks) {
    if (block.logs.length) {
      ctx.log.info(
        `${new Date(block.header.timestamp).toJSON()} NEW BLOCK: ${
          block.logs.length
        } logs`,
      )
    }
    const txIgnore = new Set<string>()
    for (const log of block.logs) {
      if (
        log.topics[0] === baseRewardPool.events.Staked.topic ||
        log.topics[0] === baseRewardPool.events.Withdrawn.topic
      )
        ctx.log.info(log.topics)
      const balanceTrackingUpdate = async () => {
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
        if (strategyData.kind === 'CurveAMO') {
          await processDepositWithdrawal(
            ctx,
            strategyData,
            block,
            strategyYields,
            strategyData.curvePoolInfo!.poolAddress,
            previousBalances.reduce((sum, b) => sum + b.balance, 0n),
            balances.reduce((sum, b) => sum + b.balance, 0n),
          )
        } else {
          await Promise.all(
            strategyData.assets.map((asset) => {
              return processDepositWithdrawal(
                ctx,
                strategyData,
                block,
                strategyYields,
                asset,
                previousBalances.find((b) => b.asset === asset)!.balance,
                balances.find((b) => b.asset === asset)!.balance,
              )
            }),
          )
        }
      }
      if (
        strategyData.kind === 'CurveAMO' &&
        log.address === strategyData.curvePoolInfo!.rewardsPoolAddress &&
        log.topics[0] === baseRewardPool.events.Staked.topic &&
        log.topics[1] === pad(strategyData.address as `0x${string}`)
      ) {
        ctx.log.info({
          type: 'Staked',
          transactionHash: log.transactionHash,
        })
        await balanceTrackingUpdate()
      } else if (
        strategyData.kind === 'CurveAMO' &&
        log.address === strategyData.curvePoolInfo!.rewardsPoolAddress &&
        log.topics[0] === baseRewardPool.events.Withdrawn.topic &&
        log.topics[1] === pad(strategyData.address as `0x${string}`)
      ) {
        ctx.log.info({
          type: 'Withdrawn',
          transactionHash: log.transactionHash,
        })
        await balanceTrackingUpdate()
      } else if (log.address === strategyData.address) {
        // ctx.log.info({
        //   block: block.header.height,
        //   tx: log.transactionHash,
        //   log.topics[0],
        // })
        // TODO: TRACK CURVE AMO VIRTUAL PRICE INCREASES
        if (
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
          strategyData.earnings.rewardTokenCollected &&
          log.topics[0] ===
            abstractStrategyAbi.events.RewardTokenCollected.topic &&
          !txIgnore.has(log.transactionHash)
        ) {
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
  }
  await ctx.store.upsert([...strategyYields.values()].flat())
}

const processRewardTokenCollected = async (
  ctx: Context,
  strategyData: IStrategyData,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  params: { token: string; amount: bigint },
) => {
  ctx.log.info(`Amount earned through rewards: ${formatEther(params.amount)}`)
  const id = `${block.header.height}:${strategyData.address}:${params.token}`
  let { latest, current, results } = await getLatest(
    ctx,
    block,
    resultMap,
    strategyData,
    params.token,
    id,
  )
  if (!current) {
    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      strategy: strategyData.address,
      asset: params.token,
      balance: latest?.balance ?? 0n,
      earnings: (latest?.earnings ?? 0n) + params.amount,
    })
    results.push(current)
  } else {
    current.earnings += params.amount
  }
}

const processDepositWithdrawal = async (
  ctx: Context,
  strategyData: IStrategyData,
  block: Block,
  resultMap: Map<string, StrategyYield[]>,
  asset: string,
  previousBalance: bigint,
  balance: bigint,
) => {
  const id = `${block.header.height}:${strategyData.address}:${asset}`
  let { latest, current, results } = await getLatest(
    ctx,
    block,
    resultMap,
    strategyData,
    asset,
    id,
  )
  if (!current) {
    const earningsChange =
      previousBalance - (latest?.balance ?? previousBalance)
    current = new StrategyYield({
      id,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
      strategy: strategyData.address,
      asset,
      balance,
      earnings: (latest?.earnings ?? 0n) + earningsChange,
    })
    ctx.log.info(
      `${asset} Setting balance: ${formatEther(
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
    results.push(current)
  }
}

const last = <T>(arr?: T[]) => (arr ? arr[arr.length - 1] : undefined)
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
    ctx.log.info(`creating results set for ${asset}`)
    results = []
    resultMap.set(asset, results)
  }
  let latest =
    last(resultMap.get(asset)) ??
    (await ctx.store.findOne(StrategyYield, {
      order: { blockNumber: 'desc' },
      where: {
        blockNumber: LessThan(block.header.height),
        strategy: strategyData.address,
        asset,
      },
    }))
  let current = latest?.id === id ? latest : undefined
  return { latest, current, results }
}
