import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import { OETHFraxStaking } from '../../model'
import { ensureExchangeRate } from '../../post-processors/exchange-rates'
import { Context } from '../../processor'
import {
  OETH_FRAX_STAKING_ADDRESS,
  SFRXETH_ADDRESS,
} from '../../utils/addresses'
import { getLatestEntity, trackAddressBalances } from '../utils'

interface ProcessResult {
  fraxStakings: OETHFraxStaking[]
  promises: Promise<unknown>[]
}

export const from = 17067223 // https://etherscan.io/tx/0x422903d2be38a264423a77e8472d365fa567f5bca12ea2403dfaee1b305c7da4

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_FRAX_STAKING_ADDRESS)],
  })
  processor.addLog({
    address: [SFRXETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_FRAX_STAKING_ADDRESS)],
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    fraxStakings: [],
    promises: [], // Anything async we can wait for at the end of our loop.
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
    }
  }

  await Promise.all(result.promises)
  await ctx.store.insert(result.fraxStakings)
}

const processTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[0] === erc20.events.Transfer.topic) {
    await trackAddressBalances({
      log,
      address: OETH_FRAX_STAKING_ADDRESS,
      tokens: [SFRXETH_ADDRESS],
      fn: async ({ token, change }) => {
        const timestampId = new Date(block.header.timestamp).toISOString()
        const { latest, current } = await getLatestEntity(
          ctx,
          OETHFraxStaking,
          result.fraxStakings,
          timestampId,
        )

        let fraxStaking = current
        if (!fraxStaking) {
          result.promises.push(ensureExchangeRate(ctx, block, 'ETH', 'sfrxETH'))
          fraxStaking = new OETHFraxStaking({
            id: timestampId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            frxETH: latest?.frxETH ?? 0n,
          })
          result.fraxStakings.push(fraxStaking)
        }

        fraxStaking.frxETH += change
      },
    })
  }
}
