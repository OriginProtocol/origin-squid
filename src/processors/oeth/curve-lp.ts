import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as baseRewardPool from '../../abi/base-reward-pool'
import * as curveLpToken from '../../abi/curve-lp-token'
import { OETHCurveLP } from '../../model'
import { Context } from '../../processor'
import {
  OETH_CONVEX_ADDRESS,
  OETH_CURVE_LP_ADDRESS,
  OETH_CURVE_REWARD_LP_ADDRESS,
} from '../../utils/addresses'
import { getLatestEntity } from '../utils'

interface ProcessResult {
  curveLPs: OETHCurveLP[]
}

export const from = Math.min(
  17130232, // https://etherscan.io/tx/0xbf9dca462a157215e744ba7f2c17f036ad4d5c708f0e9e49ec53e4069e87771f
  17221745, // https://etherscan.io/tx/0xb969af9b4757baaddc1fa93186df25ef2016d52e83a915816e14d44671eb7a02
)

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [OETH_CURVE_LP_ADDRESS],
    topic0: [
      curveLpToken.events.AddLiquidity.topic,
      curveLpToken.events.RemoveLiquidity.topic,
      curveLpToken.events.RemoveLiquidityImbalance.topic,
      curveLpToken.events.RemoveLiquidityOne.topic,
      curveLpToken.events.TokenExchange.topic,
    ],
    range: { from },
  })
  processor.addLog({
    address: [OETH_CURVE_REWARD_LP_ADDRESS],
    topic0: [
      baseRewardPool.events.Staked.topic,
      baseRewardPool.events.Withdrawn.topic,
    ],
    topic1: [pad(OETH_CONVEX_ADDRESS)],
    range: { from },
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    curveLPs: [],
  }

  for (const block of ctx.blocks) {
    const haveCurveLpEvent = block.logs.find(
      (log) => log.address === OETH_CURVE_LP_ADDRESS,
    )
    if (haveCurveLpEvent) {
      await updateCurveValues(ctx, result, block)
    }
    for (const log of block.logs) {
      if (log.address === OETH_CURVE_REWARD_LP_ADDRESS) {
        await processCurveRewardEvents(ctx, result, block, log)
      }
    }
  }

  await ctx.store.insert(result.curveLPs)
}

const updateCurveValues = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const { curveLP } = await getLatestCurveLP(ctx, result, block)
  const poolContract = new curveLpToken.Contract(
    ctx,
    block.header,
    OETH_CURVE_LP_ADDRESS,
  )
  const [totalSupply, balances] = await Promise.all([
    poolContract.totalSupply(),
    poolContract.get_balances(),
  ])
  curveLP.totalSupply = totalSupply
  curveLP.eth = balances[0]
  curveLP.oeth = balances[1]
  curveLP.ethOwned = curveLP.totalSupply
    ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
    : 0n
  curveLP.oethOwned = curveLP.totalSupply
    ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
    : 0n
}

const processCurveRewardEvents = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[1] !== pad(OETH_CONVEX_ADDRESS)) return
  if (log.topics[0] === baseRewardPool.events.Staked.topic) {
    const { amount } = baseRewardPool.events.Staked.decode(log)
    const { curveLP } = await getLatestCurveLP(ctx, result, block)
    curveLP.totalSupplyOwned += amount
    curveLP.ethOwned = curveLP.totalSupply
      ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
    curveLP.oethOwned = curveLP.totalSupply
      ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
  } else if (log.topics[0] === baseRewardPool.events.Withdrawn.topic) {
    const { amount } = baseRewardPool.events.Withdrawn.decode(log)
    const { curveLP } = await getLatestCurveLP(ctx, result, block)
    curveLP.totalSupplyOwned -= amount
    curveLP.ethOwned = curveLP.totalSupply
      ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
    curveLP.oethOwned = curveLP.totalSupply
      ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
  }
}

const getLatestCurveLP = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const timestampId = new Date(block.header.timestamp).toISOString()
  const { latest, current } = await getLatestEntity(
    ctx,
    OETHCurveLP,
    result.curveLPs,
    timestampId,
  )

  let isNew = false
  let curveLP = current
  if (!curveLP) {
    curveLP = new OETHCurveLP({
      id: timestampId,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      totalSupply: latest?.totalSupply ?? 0n,
      eth: latest?.eth ?? 0n,
      oeth: latest?.oeth ?? 0n,
      totalSupplyOwned: latest?.totalSupplyOwned ?? 0n,
      ethOwned: latest?.ethOwned ?? 0n,
      oethOwned: latest?.oethOwned ?? 0n,
    })
    result.curveLPs.push(curveLP)
    isNew = true
  }
  return { curveLP, isNew }
}
