import { sum } from 'lodash'
import { LessThan } from 'typeorm'
import { formatEther, pad } from 'viem'

import * as erc20 from '../../../abi/erc20'
import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import { StrategyYield } from '../../../model'
import { Block, Context } from '../../../processor'
import {
  OETH_DRIPPER_ADDRESS,
  OETH_HARVESTER_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { ensureExchangeRate } from '../../post-processors/exchange-rates'
import { IStrategyData } from './strategy'

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
      ctx.log.info(`NEW BLOCK: ${block.logs.length} logs`)
    }
    const txIgnore = new Set<string>()
    for (const log of block.logs) {
      if (log.address === strategyData.address) {
        const topic0 = log.topics[0]
        ctx.log.info({
          block: block.header.height,
          tx: log.transactionHash,
          topic0,
        })
        if (
          topic0 === abstractStrategyAbi.events.Deposit.topic ||
          topic0 === abstractStrategyAbi.events.Withdrawal.topic
        ) {
          ctx.log.info({
            type:
              topic0 === abstractStrategyAbi.events.Deposit.topic
                ? 'Deposit'
                : 'Withdrawal',
            transactionHash: log.transactionHash,
          })
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
          await Promise.all(
            strategyData.assets.map((asset) => {
              ensureExchangeRate(ctx, block, 'CRV', 'ETH')
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
        } else if (
          topic0 === abstractStrategyAbi.events.RewardTokenCollected.topic &&
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
  ctx.log.info(`${!!latest} ${!!current} ${results.length}`)
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
