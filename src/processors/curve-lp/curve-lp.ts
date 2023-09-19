import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { hexToBigInt, pad } from 'viem'

import * as curve_lp_token from '../../abi/curve_lp_token'
import * as erc20 from '../../abi/erc20'
import { CurveLP } from '../../model'
import { Context } from '../../processor'
import {
  OETH_ADDRESS,
  OETH_CURVE_LP_ADDRESS,
  OETH_CURVE_LP_OWNER_ADDRESS,
} from '../../utils/addresses'
import { getLatest, trackAddressBalances } from '../utils'

interface ProcessResult {
  curveLPs: CurveLP[]
}

export const from = 17130232 // https://etherscan.io/tx/0xbf9dca462a157215e744ba7f2c17f036ad4d5c708f0e9e49ec53e4069e87771f

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [OETH_CURVE_LP_ADDRESS],
    topic0: [
      curve_lp_token.events.AddLiquidity.topic,
      curve_lp_token.events.RemoveLiquidity.topic,
      curve_lp_token.events.RemoveLiquidityImbalance.topic,
      curve_lp_token.events.RemoveLiquidityOne.topic,
      curve_lp_token.events.Transfer.topic,
      curve_lp_token.events.TokenExchange.topic,
    ],
  })
  processor.addLog({
    address: [OETH_ADDRESS],
    topic0: [curve_lp_token.events.Transfer.topic],
    topic1: [pad(OETH_CURVE_LP_ADDRESS)],
  })
  processor.addLog({
    address: [OETH_ADDRESS],
    topic0: [curve_lp_token.events.Transfer.topic],
    topic2: [pad(OETH_CURVE_LP_ADDRESS)],
  })
  processor.addLog({
    address: [OETH_CURVE_LP_ADDRESS],
    topic0: [curve_lp_token.events.Transfer.topic],
    topic1: [pad(OETH_CURVE_LP_OWNER_ADDRESS)],
  })
  processor.addLog({
    address: [OETH_CURVE_LP_ADDRESS],
    topic0: [curve_lp_token.events.Transfer.topic],
    topic2: [pad(OETH_CURVE_LP_OWNER_ADDRESS)],
  })
  // processor.addTransaction({
  //   from: [OETH_CURVE_LP_ADDRESS],
  // })
  // processor.addTransaction({
  //   to: [OETH_CURVE_LP_ADDRESS],
  // })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    curveLPs: [],
  }

  for (const block of ctx.blocks) {
    // for (const transaction of block.transactions) {
    //   await processNativeTransfers(ctx, result, block, transaction)
    // }
    for (const log of block.logs) {
      await processHoldingsTransfer(ctx, result, block, log)
      if (log.address === OETH_CURVE_LP_ADDRESS) {
        await processLiquidityEvents(ctx, result, block, log)
        await processCurveLPTransfer(ctx, result, block, log)
      }
    }
  }

  await ctx.store.insert(result.curveLPs)
}

const processNativeTransfers = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  transaction: Context['blocks']['0']['transactions']['0'],
) => {
  if (!transaction) return
  if (transaction.value > 0n) {
    if (
      transaction.from.toLowerCase() === OETH_CURVE_LP_ADDRESS &&
      transaction.to?.toLowerCase() !== OETH_CURVE_LP_ADDRESS
    ) {
      const curveLP = await getLatestCurveLP(ctx, result, block, {
        transactionHash: transaction.hash,
      })
      curveLP.eth -= transaction.value
      curveLP.ethOwned = curveLP.totalSupply
        ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
        : 0n
    } else if (transaction.to?.toLowerCase() === OETH_CURVE_LP_ADDRESS) {
      const curveLP = await getLatestCurveLP(ctx, result, block, {
        transactionHash: transaction.hash,
      })
      curveLP.eth += transaction.value
      curveLP.ethOwned = curveLP.totalSupply
        ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
        : 0n
    }
  }
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
        const curveLP = await getLatestCurveLP(ctx, result, block, log)
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
  if (log.topics[0] === curve_lp_token.events.AddLiquidity.topic) {
    const eth = await ctx._chain.client
      .call('eth_getBalance', [OETH_CURVE_LP_ADDRESS, block.header.hash])
      .then((r: `0x${string}`) => hexToBigInt(r))
    const { token_supply } = curve_lp_token.events.AddLiquidity.decode(log)
    const curveLP = await getLatestCurveLP(ctx, result, block, log)
    curveLP.totalSupply = token_supply
    curveLP.eth = eth
    curveLP.ethOwned = curveLP.totalSupply
      ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
    curveLP.oethOwned = curveLP.totalSupply
      ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
  } else if (
    log.topics[0] === curve_lp_token.events.RemoveLiquidityImbalance.topic
  ) {
    const eth = await ctx._chain.client
      .call('eth_getBalance', [OETH_CURVE_LP_ADDRESS, block.header.hash])
      .then((r: `0x${string}`) => hexToBigInt(r))
    const { token_supply } =
      curve_lp_token.events.RemoveLiquidityImbalance.decode(log)
    const curveLP = await getLatestCurveLP(ctx, result, block, log)
    curveLP.totalSupply = token_supply
    curveLP.eth = eth
    curveLP.ethOwned = curveLP.totalSupply
      ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
    curveLP.oethOwned = curveLP.totalSupply
      ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
  } else if (log.topics[0] === curve_lp_token.events.RemoveLiquidityOne.topic) {
    const eth = await ctx._chain.client
      .call('eth_getBalance', [OETH_CURVE_LP_ADDRESS, block.header.hash])
      .then((r: `0x${string}`) => hexToBigInt(r))
    const { token_supply } =
      curve_lp_token.events.RemoveLiquidityOne.decode(log)
    const curveLP = await getLatestCurveLP(ctx, result, block, log)
    curveLP.totalSupply = token_supply
    curveLP.eth = eth
    curveLP.ethOwned = curveLP.totalSupply
      ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
    curveLP.oethOwned = curveLP.totalSupply
      ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
  } else if (log.topics[0] === curve_lp_token.events.RemoveLiquidity.topic) {
    const eth = await ctx._chain.client
      .call('eth_getBalance', [OETH_CURVE_LP_ADDRESS, block.header.hash])
      .then((r: `0x${string}`) => hexToBigInt(r))
    const { token_supply } = curve_lp_token.events.RemoveLiquidity.decode(log)
    const curveLP = await getLatestCurveLP(ctx, result, block, log)
    curveLP.totalSupply = token_supply
    curveLP.eth = eth
    curveLP.ethOwned = curveLP.totalSupply
      ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
    curveLP.oethOwned = curveLP.totalSupply
      ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
      : 0n
  }
}

const processCurveLPTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[0] === curve_lp_token.events.Transfer.topic) {
    await trackAddressBalances({
      log,
      address: OETH_CURVE_LP_OWNER_ADDRESS,
      tokens: [OETH_CURVE_LP_ADDRESS],
      fn: async ({ log, token, change }) => {
        const curveLP = await getLatestCurveLP(ctx, result, block, log)
        curveLP.totalSupplyOwned += change
        curveLP.ethOwned = curveLP.totalSupply
          ? (curveLP.eth * curveLP.totalSupplyOwned) / curveLP.totalSupply
          : 0n
        curveLP.oethOwned = curveLP.totalSupply
          ? (curveLP.oeth * curveLP.totalSupplyOwned) / curveLP.totalSupply
          : 0n
      },
    })
  }
}

const getLatestCurveLP = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: { transactionHash: string },
) => {
  const dateId = new Date(block.header.timestamp).toISOString()
  const { latest, current } = await getLatest(
    ctx,
    CurveLP,
    result.curveLPs,
    dateId,
  )

  let curveLP = current
  if (!curveLP) {
    curveLP = new CurveLP({
      id: dateId,
      timestamp: new Date(block.header.timestamp),
      blockNumber: block.header.height,
      txHash: log.transactionHash,
      totalSupply: latest?.totalSupply ?? 0n,
      eth: latest?.eth ?? 0n,
      oeth: latest?.oeth ?? 0n,
      totalSupplyOwned: latest?.totalSupplyOwned ?? 0n,
      ethOwned: latest?.ethOwned ?? 0n,
      oethOwned: latest?.oethOwned ?? 0n,
    })
    result.curveLPs.push(curveLP)
  }
  return curveLP
}
