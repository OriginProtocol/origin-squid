import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as erc20Abi from '../../abi/erc20'
import { Context } from '../../processor'
import { logFilter } from '../../utils/logFilter'

export const from = 1234567890123

const filter = logFilter({
  address: [''],
  topic0: ['abi.events.Transfer.topic'],
  range: { from },
})

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog(filter.value)
}

interface ProcessResult {}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {}

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (filter.matches(log)) {
        // Do it!
        const contract = new erc20Abi.Contract(
          ctx,
          block.header,
          'contract address',
        )
        const [name, symbol, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
        ])
      }
      // Do your magic?
    }
    for (const tx of block.transactions) {
      // Do your magic?
    }
    for (const trace of block.traces) {
      // Do your magic?
    }
  }

  // await ctx.store.insert(result.drippers)
  // await ctx.store.upsert(result.drippers)
}
