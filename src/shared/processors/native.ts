import { EvmBatchProcessor } from '@subsquid/evm-processor'

import { NativeBalance } from '../../model'
import { Context } from '../../processor'
import {
  OETH_VAULT_ADDRESS,
  OUSD_VAULT_ADDRESS,
  oethStrategyArray,
  ousdStrategyArray,
} from '../../utils/addresses'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'
import { getNativeBalances } from '../../utils/nativeBalance'

/**
 * We end up with a lot of initial 0 balance entities.
 * This isn't ideal but probably not worth improving.
 */

const tracks = [
  ...ousdStrategyArray,
  OUSD_VAULT_ADDRESS,
  ...oethStrategyArray,
  OETH_VAULT_ADDRESS,
]

const ousdFrom = 11362821
const oethFrom = 16935276

export const from = Math.min(ousdFrom, oethFrom)

export const setup = (processor: EvmBatchProcessor) => {
  processor.includeAllBlocks({ from })
}

const updater = blockFrequencyUpdater({ from })
export const process = async (ctx: Context) => {
  const results: NativeBalance[] = []
  await updater(ctx, async (ctx: Context, block: Context['blocks'][number]) => {
    const balances = await getNativeBalances(ctx, tracks, block)
    results.push(
      ...tracks.map(
        (account, index) =>
          new NativeBalance({
            id: `${account}:${block.header.height}`,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            account,
            balance: balances[index],
          }),
      ),
    )
  })
  await ctx.store.insert(results)
}
