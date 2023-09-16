import { Context } from '../../processor'
import { Dripper } from '../../model'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OETH_DRIPPER_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'
import * as erc20 from '../../abi/erc20'
import { pad } from 'viem'
import { getLatest, trackAddressBalances } from '../utils'

interface ProcessResult {
  drippers: Dripper[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_DRIPPER_ADDRESS)],
  })
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_DRIPPER_ADDRESS)],
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    drippers: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
    }
  }

  await ctx.store.insert(result.drippers)
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
      address: OETH_DRIPPER_ADDRESS,
      tokens: [WETH_ADDRESS],
      fn: async ({ log, token, change }) => {
        const dateId = new Date(block.header.timestamp).toISOString()
        const { latest, current } = await getLatest(
          ctx,
          Dripper,
          result.drippers,
          dateId,
        )

        let dripper = current
        if (!dripper) {
          dripper = new Dripper({
            id: dateId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            weth: latest?.weth ?? 0n,
          })
          result.drippers.push(dripper)
        }

        if (token === WETH_ADDRESS) {
          dripper.weth += change
        }
      },
    })
  }
}
