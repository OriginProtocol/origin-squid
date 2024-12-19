import * as metaMorpho from '@abi/meta-morpho'
import * as morpho from '@abi/morpho'
import { MorphoMarketState } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { META_MORPHO_ADDRESS, MORPHO_ADDRESS } from '@utils/addresses'
import { multicall } from '@utils/multicall'
import { range } from '@utils/range'

const from = 20685100

const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

const process = async (ctx: Context) => {
  const states: MorphoMarketState[] = []
  for (const block of ctx.frequencyBlocks) {
    if (block.header.height < from) continue
    const metaMorphoContract = new metaMorpho.Contract(ctx, block.header, META_MORPHO_ADDRESS)
    const supplyLength = await metaMorphoContract.supplyQueueLength()
    const marketIds = await multicall(
      ctx,
      block.header,
      metaMorpho.functions.supplyQueue,
      META_MORPHO_ADDRESS,
      range(Number(supplyLength)).map((index) => ({
        _0: index,
      })),
    )
    const marketStates = await multicall(
      ctx,
      block.header,
      morpho.functions.market,
      MORPHO_ADDRESS,
      marketIds.map((id) => ({ _0: id })),
    )

    states.push(
      ...marketStates.map((state, index) => {
        return new MorphoMarketState({
          id: `${ctx.chain.id}-${block.header.height}-${marketIds[index]}`,
          chainId: ctx.chain.id,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          marketId: marketIds[index],
          totalSupplyAssets: state.totalSupplyAssets,
          totalSupplyShares: state.totalSupplyShares,
          totalBorrowAssets: state.totalBorrowAssets,
          totalBorrowShares: state.totalBorrowShares,
          lastUpdate: state.lastUpdate,
          fee: state.fee,
        })
      }),
    )
  }

  await ctx.store.insert(states)
}

export const morphoMarketStatesProcessor = {
  name: 'Morpho Market States',
  from,
  setup,
  process,
}
