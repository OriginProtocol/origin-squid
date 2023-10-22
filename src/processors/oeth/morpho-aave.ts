import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as erc20 from '../../abi/erc20'
import * as initializableAbstractStrategy from '../../abi/initializable-abstract-strategy'
import { OETHMorphoAave } from '../../model'
import { ensureExchangeRate } from '../../post-processors/exchange-rates'
import { Context } from '../../processor'
import { OETH_MORPHO_AAVE_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'

interface ProcessResult {
  morphoAaves: OETHMorphoAave[]
}

export const from = 17367102 // https://etherscan.io/tx/0x15294349d566059bb37e200b2dba45428e237d6050de11862aa57c7875476526

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_MORPHO_AAVE_ADDRESS)],
    range: { from },
  })
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic2: [pad(OETH_MORPHO_AAVE_ADDRESS)],
    range: { from },
  })
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    morphoAaves: [],
  }

  for (const block of ctx.blocks) {
    const haveTransfer = block.logs.find(
      (log) =>
        log.topics[0] === erc20.events.Transfer.topic &&
        WETH_ADDRESS === log.address &&
        (log.topics[1] === pad(OETH_MORPHO_AAVE_ADDRESS) ||
          log.topics[2] === pad(OETH_MORPHO_AAVE_ADDRESS)),
    )
    if (haveTransfer) {
      await updateValues(ctx, result, block)
    }
  }
  await ctx.store.insert(result.morphoAaves)
}

const updateValues = async (
  ctx: Context,
  result: ProcessResult,
  block: Context['blocks']['0'],
) => {
  const timestampId = new Date(block.header.timestamp).toISOString()
  await ensureExchangeRate(ctx, block, 'ETH', 'WETH') // No async since WETH.
  const contract = new initializableAbstractStrategy.Contract(
    ctx,
    block.header,
    OETH_MORPHO_AAVE_ADDRESS,
  )
  const morphoAave = new OETHMorphoAave({
    id: timestampId,
    timestamp: new Date(block.header.timestamp),
    blockNumber: block.header.height,
    weth: await contract.checkBalance(WETH_ADDRESS),
  })
  result.morphoAaves.push(morphoAave)
}
