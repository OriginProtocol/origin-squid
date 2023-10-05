import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as balancerMetaPoolStrategy from '../../abi/balancer-meta-pool-strategy'
import { BalancerMetaPoolStrategy } from '../../model'
import { Context } from '../../processor'
import {
  OETH_STRATEGY_BALANCER_ADDRESS,
  RETH_ADDRESS,
  WETH_ADDRESS,
} from '../../utils/addresses'
import { getOrCreate } from '../utils'

export const from = 18156219 // https://etherscan.io/tx/0x41c4c0e86ef95e0bfaac7bd94f30f7c30505278f5d7d70c4e99deb4d79b14f58

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [OETH_STRATEGY_BALANCER_ADDRESS],
    topic0: [
      balancerMetaPoolStrategy.events.Deposit.topic,
      balancerMetaPoolStrategy.events.Withdrawal.topic,
    ],
  })
}

interface ProcessResult {
  strategies: BalancerMetaPoolStrategy[]
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    strategies: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (log.address === OETH_STRATEGY_BALANCER_ADDRESS) {
        if (
          log.topics[0] === balancerMetaPoolStrategy.events.Deposit.topic ||
          log.topics[0] === balancerMetaPoolStrategy.events.Withdrawal.topic
        ) {
          await updateValues(ctx, block, log, result)
        }
      }
    }
  }
  await ctx.store.insert(result.strategies)
}

export const updateValues = async (
  ctx: Context,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
  result: ProcessResult,
) => {
  const timestampId = new Date(block.header.timestamp).toISOString()
  const strategy = new balancerMetaPoolStrategy.Contract(
    ctx,
    block.header,
    OETH_STRATEGY_BALANCER_ADDRESS,
  )
  const [record, total, rETH, weth] = await Promise.all([
    getOrCreateBalancerMetaPool(ctx, block, log, result, timestampId),
    strategy['checkBalance()'](),
    strategy['checkBalance(address)'](RETH_ADDRESS),
    strategy['checkBalance(address)'](WETH_ADDRESS),
  ])
  record.total = total
  record.rETH = rETH
  record.weth = weth
}

export const getOrCreateBalancerMetaPool = (
  ctx: Context,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
  result: ProcessResult,
  id: string,
) => {
  return getOrCreate(
    ctx,
    BalancerMetaPoolStrategy,
    result.strategies,
    id,
    (latest) =>
      new BalancerMetaPoolStrategy({
        id,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        total: latest?.total ?? 0n,
        rETH: latest?.rETH ?? 0n,
        weth: latest?.weth ?? 0n,
      }),
  )
}
