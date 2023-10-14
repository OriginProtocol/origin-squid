import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as baseRewardPool from '../../abi/base-reward-pool'
import * as curveLpToken from '../../abi/curve-lp-token'
import * as erc20 from '../../abi/erc20'
import { OETHCurveLP } from '../../model'
import { Context } from '../../processor'
import {
  OETH_ADDRESS,
  OETH_CONVEX_ADDRESS,
  OETH_CURVE_LP_ADDRESS,
  OETH_CURVE_REWARD_LP_ADDRESS,
} from '../../utils/addresses'
import { getEthBalance } from '../../utils/getEthBalance'
import { getLatestEntity, trackAddressBalances } from '../utils'

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
      // curve_lp_token.events.TokenExchange.topic, // Not sure if including this helps get up-to-date eth balances.
    ],
  })
  processor.addLog({
    address: [OETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_CURVE_LP_ADDRESS)],
  })
  processor.addLog({
    address: [OETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_CURVE_LP_ADDRESS)],
  })
  processor.addLog({
    address: [OETH_CURVE_REWARD_LP_ADDRESS],
    topic0: [
      baseRewardPool.events.Staked.topic,
      baseRewardPool.events.Withdrawn.topic,
    ],
    topic1: [pad(OETH_CONVEX_ADDRESS)],
  })
  // Not sure if this is needed to get up-to-date ETH balances.
  // processor.addTransaction({
  //   from: [OETH_CURVE_LP_ADDRESS],
  //   traces: false,
  //   logs: false,
  //   stateDiffs: false,
  // })
  // processor.addTransaction({
  //   to: [OETH_CURVE_LP_ADDRESS],
  //   traces: false,
  //   logs: false,
  //   stateDiffs: false,
  // })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    curveLPs: [],
  }

  for (const block of ctx.blocks) {
    let haveUpdatedEthBalance = false
    for (const log of block.logs) {
      await processHoldingsTransfer(ctx, result, block, log)
      if (log.address === OETH_CURVE_LP_ADDRESS) {
        await processLiquidityEvents(ctx, result, block, log)
        if (!haveUpdatedEthBalance) {
          haveUpdatedEthBalance = true
          await updateETHBalance(ctx, result, block)
        }
      }
      if (log.address === OETH_CURVE_REWARD_LP_ADDRESS) {
        await processCurveRewardEvents(ctx, result, block, log)
      }
    }
    // Not sure if this is needed to get up-to-date ETH balances.
    // const transaction = block.transactions.find(
    //   (transaction) =>
    //     transaction.from === OETH_CURVE_LP_ADDRESS ||
    //     transaction.to === OETH_CURVE_LP_ADDRESS,
    // )
    // if (transaction) {
    //   await updateETHBalance(ctx, result, block, transaction.hash)
    // }
  }

  await ctx.store.insert(result.curveLPs)
}

const updateETHBalance = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const [eth, { curveLP, isNew }] = await Promise.all([
    getEthBalance(ctx, OETH_CURVE_LP_ADDRESS, block),
    getLatestCurveLP(ctx, result, block),
  ])
  if (curveLP.eth === eth) {
    // No change, let's cancel what we're doing.
    if (isNew) {
      result.curveLPs.pop()
    }
    return
  }
  curveLP.eth = eth
  curveLP.ethOwned = curveLP.totalSupply
    ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
    : 0n
  curveLP.oethOwned = curveLP.totalSupply
    ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
    : 0n
}

const processHoldingsTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[0] === erc20.events.Transfer.topic) {
    await trackAddressBalances({
      log,
      address: OETH_CURVE_LP_ADDRESS,
      tokens: [OETH_ADDRESS],
      fn: async ({ log, change }) => {
        const { curveLP } = await getLatestCurveLP(ctx, result, block)
        curveLP.oeth += change
        curveLP.oethOwned = curveLP.totalSupply
          ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
          : 0n
      },
    })
  }
}

const processLiquidityEvents = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[0] === curveLpToken.events.AddLiquidity.topic) {
    const { token_supply } = curveLpToken.events.AddLiquidity.decode(log)
    const { curveLP } = await getLatestCurveLP(ctx, result, block)
    curveLP.totalSupply = token_supply
  } else if (
    log.topics[0] === curveLpToken.events.RemoveLiquidityImbalance.topic
  ) {
    const { token_supply } =
      curveLpToken.events.RemoveLiquidityImbalance.decode(log)
    const { curveLP } = await getLatestCurveLP(ctx, result, block)
    curveLP.totalSupply = token_supply
  } else if (log.topics[0] === curveLpToken.events.RemoveLiquidityOne.topic) {
    const { token_supply } = curveLpToken.events.RemoveLiquidityOne.decode(log)
    const { curveLP } = await getLatestCurveLP(ctx, result, block)
    curveLP.totalSupply = token_supply
  } else if (log.topics[0] === curveLpToken.events.RemoveLiquidity.topic) {
    const { token_supply } = curveLpToken.events.RemoveLiquidity.decode(log)
    const { curveLP } = await getLatestCurveLP(ctx, result, block)
    curveLP.totalSupply = token_supply
  }
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
