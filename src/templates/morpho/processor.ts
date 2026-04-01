import { MorphoVaultApy } from '@model'
import { Context, EvmBatchProcessor, blockFrequencyUpdater, defineProcessor } from '@originprotocol/squid-utils'
import { ousd } from '@utils/addresses'

import { fetchVaultApy } from './fetch'

export const createMorphoVaultApyProcessor = (params: {
  name: string
  from: number
  chainId: number
}) => {
  const vaultAddress = ousd.morpho.vault[params.chainId]
  const morphoAddress = ousd.morpho.blue[params.chainId]
  if (!vaultAddress || !morphoAddress) {
    throw new Error(`No Morpho config for chainId ${params.chainId}`)
  }

  const frequencyUpdate = blockFrequencyUpdater({ from: params.from })

  return defineProcessor({
    name: params.name,
    from: params.from,
    setup(processor: EvmBatchProcessor) {
      processor.includeAllBlocks({ from: params.from })
    },
    async process(ctx: Context) {
      const snapshots: MorphoVaultApy[] = []

      await frequencyUpdate(ctx, async (ctx, block) => {
        let apy: number | null
        try {
          apy = await fetchVaultApy(ctx, block.header, vaultAddress, morphoAddress)
        } catch (err) {
          ctx.log.warn({ err }, `[${params.name}] Failed to fetch vault APY at block ${block.header.height}`)
          return
        }

        if (apy === null) return // vault not yet deployed

        snapshots.push(
          new MorphoVaultApy({
            id: `${params.chainId}:${vaultAddress.toLowerCase()}:${block.header.height}`,
            chainId: params.chainId,
            timestamp: new Date(block.header.timestamp),
            blockNumber: block.header.height,
            vaultAddress: vaultAddress.toLowerCase(),
            apy,
          }),
        )
      })

      if (snapshots.length > 0) {
        await ctx.store.insert(snapshots)
      }
    },
  })
}
