import { minBy } from 'lodash'

import { NativeBalance } from '@model'
import { Context, blockFrequencyUpdater, defineProcessor, getNativeBalances } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OETH_VAULT_ADDRESS, OUSD_VAULT_ADDRESS, oethStrategyArray, ousdStrategyArray } from '@utils/addresses'

/**
 * We end up with a lot of initial 0 balance entities.
 * This isn't ideal but probably not worth improving.
 */

const tracks = [
  {
    from: 19072024, // As of this block, none of these addresses have ever held ETH.
    addresses: [...ousdStrategyArray, OUSD_VAULT_ADDRESS, ...oethStrategyArray, OETH_VAULT_ADDRESS],
  },
]

const from = minBy(tracks, 'from')?.from ?? 19072024
const updater = blockFrequencyUpdater({ from })
export const nativeBalanceProcessor = defineProcessor({
  name: 'nativeBalance',
  from,
  setup: (processor: EvmBatchProcessor) => {
    if (!tracks.length) return
    processor.includeAllBlocks({ from })
  },
  process: async (ctx: Context) => {
    if (!tracks.length) return
    const results: NativeBalance[] = []
    await updater(ctx, async (ctx: Context, block: Context['blocks'][number]) => {
      const addresses = tracks.filter((track) => track.from <= block.header.height).flatMap((track) => track.addresses)
      const balances = await getNativeBalances(ctx, addresses, block)
      results.push(
        ...addresses.map(
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
  },
})
