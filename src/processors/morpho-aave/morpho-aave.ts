import { Context } from '../../processor'
import { MorphoAave } from '../../model'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OETH_MORPHO_AAVE_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'
import * as erc20 from '../../abi/erc20'
import { pad } from 'viem'
import { getLatest, trackAddressBalances } from '../utils'

interface ProcessResult {
  morphoAaves: MorphoAave[]
}

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_MORPHO_AAVE_ADDRESS)],
  })
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_MORPHO_AAVE_ADDRESS)],
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    morphoAaves: [],
  }

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processTransfer(ctx, result, block, log)
    }
  }

  await ctx.store.insert(result.morphoAaves)
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
      address: OETH_MORPHO_AAVE_ADDRESS,
      tokens: [WETH_ADDRESS],
      fn: async ({ log, token, change }) => {
        const dateId = new Date(block.header.timestamp).toISOString()
        const { latest, current } = await getLatest(
          ctx,
          MorphoAave,
          result.morphoAaves,
          dateId,
        )

        let morphoAave = current
        if (!morphoAave) {
          morphoAave = new MorphoAave({
            id: dateId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            txHash: log.transactionHash,
            weth: latest?.weth ?? 0n,
          })
          result.morphoAaves.push(morphoAave)
        }

        if (token === WETH_ADDRESS) {
          morphoAave.weth += change
        }
      },
    })
  }
}
