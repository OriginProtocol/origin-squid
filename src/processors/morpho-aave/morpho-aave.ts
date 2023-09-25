import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import { MorphoAave } from '../../model'
import { Context } from '../../processor'
import { OETH_MORPHO_AAVE_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'
import { updateFinancialStatement } from '../financial-statement'
import { getLatestEntity, trackAddressBalances } from '../utils'

interface ProcessResult {
  morphoAaves: MorphoAave[]
}

export const from = 17367102 // https://etherscan.io/tx/0x15294349d566059bb37e200b2dba45428e237d6050de11862aa57c7875476526

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
    await trackAddressBalances({
      log,
      address: OETH_MORPHO_AAVE_ADDRESS,
      tokens: [WETH_ADDRESS],
      fn: async ({ log, token, change }) => {
        const timestampId = new Date(block.header.timestamp).toISOString()
        const { latest, current } = await getLatestEntity(
          ctx,
          MorphoAave,
          result.morphoAaves,
          timestampId,
        )

        let morphoAave = current
        if (!morphoAave) {
          morphoAave = new MorphoAave({
            id: timestampId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            weth: latest?.weth ?? 0n,
          })
          result.morphoAaves.push(morphoAave)
          await updateFinancialStatement(ctx, block, { morphoAave })
        }

        morphoAave.weth += change
      },
    })
  }
}
