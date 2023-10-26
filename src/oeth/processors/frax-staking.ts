import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as sfrxETH from '../../abi/sfrx-eth'
import { OETHFraxStaking } from '../../model'
import { Context } from '../../processor'
import { ensureExchangeRate } from '../../shared/post-processors/exchange-rates'
import {
  OETH_FRAX_STAKING_ADDRESS,
  SFRXETH_ADDRESS,
} from '../../utils/addresses'

interface ProcessResult {
  fraxStakings: OETHFraxStaking[]
  promises: Promise<unknown>[]
}

export const from = 17067223 // https://etherscan.io/tx/0x422903d2be38a264423a77e8472d365fa567f5bca12ea2403dfaee1b305c7da4

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [sfrxETH.events.Transfer.topic],
    topic1: [pad(OETH_FRAX_STAKING_ADDRESS)],
    range: { from },
  })
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [sfrxETH.events.Transfer.topic],
    topic2: [pad(OETH_FRAX_STAKING_ADDRESS)],
    range: { from },
  })
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [sfrxETH.events.Withdraw.topic],
    topic2: [pad(OETH_FRAX_STAKING_ADDRESS)],
    range: { from },
  })
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [sfrxETH.events.Deposit.topic],
    topic2: [pad(OETH_FRAX_STAKING_ADDRESS)],
    range: { from },
  })
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [sfrxETH.events.NewRewardsCycle.topic],
    range: { from },
  })
}

const topicsToWatch = new Set([
  sfrxETH.events.Transfer.topic,
  sfrxETH.events.Transfer.topic,
  sfrxETH.events.Withdraw.topic,
  sfrxETH.events.Deposit.topic,
  sfrxETH.events.NewRewardsCycle.topic,
])

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    fraxStakings: [],
    promises: [], // Anything async we can wait for at the end of our loop.
  }

  for (const block of ctx.blocks) {
    const haveLog = block.logs.find(
      (log) =>
        log.address === SFRXETH_ADDRESS && topicsToWatch.has(log.topics[0]),
    )
    if (haveLog) {
      await createOETHFraxStaking(ctx, result, block)
    }
  }

  await Promise.all(result.promises)
  await ctx.store.insert(result.fraxStakings)
}

const createOETHFraxStaking = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const timestampId = new Date(block.header.timestamp).toISOString()
  const contract = new sfrxETH.Contract(ctx, block.header, SFRXETH_ADDRESS)
  result.promises.push(ensureExchangeRate(ctx, block, 'ETH', 'sfrxETH'))
  const fraxStaking = new OETHFraxStaking({
    id: timestampId,
    timestamp: new Date(block.header.timestamp),
    blockNumber: block.header.height,
    sfrxETH: await contract.balanceOf(OETH_FRAX_STAKING_ADDRESS),
  })
  result.fraxStakings.push(fraxStaking)
}
