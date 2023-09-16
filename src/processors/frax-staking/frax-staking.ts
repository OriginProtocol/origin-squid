import { Context } from '../../processor'
import { FraxStaking, Vault } from '../../model'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import {
  OETH_FRAX_STAKING_ADDRESS,
  SFRXETH_ADDRESS,
} from '../../utils/addresses'
import * as erc20 from '../../abi/erc20'
import { pad } from 'viem'
import { getLatest, trackAddressBalances } from '../utils'

interface ProcessResult {
  fraxStakings: FraxStaking[]
}

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
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
    }
  }

  await ctx.store.insert(result.fraxStakings)
}

const processTransfer = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
  log: Context['blocks']['0']['logs']['0'],
) => {
  if (log.topics[0] === erc20.events.Transfer.topic) {
    const data = erc20.events.Transfer.decode(log)
    await trackAddressBalances({
      log,
      data,
      address: OETH_FRAX_STAKING_ADDRESS,
      tokens: [SFRXETH_ADDRESS],
      fn: async ({ log, token, change }) => {
        const dateId = new Date(block.header.timestamp).toISOString()
        const { latest, current } = await getLatest(
          ctx,
          FraxStaking,
          result.fraxStakings,
          dateId,
        )

        let fraxStaking = current
        if (!fraxStaking) {
          fraxStaking = new FraxStaking({
            id: dateId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            frxETH: latest?.frxETH ?? 0n,
          })
          result.fraxStakings.push(fraxStaking)
        }

        if (token === SFRXETH_ADDRESS) {
          fraxStaking.frxETH += change
        }
      },
    })
  }
}
