import { MorphoVaultApy } from '@model';
import { Context, EvmBatchProcessor, blockFrequencyUpdater, defineProcessor } from '@originprotocol/squid-utils';
import { ousd } from '@utils/addresses';



import { fetchVaultApy } from './fetch'

export const createMorphoVaultApyProcessor = (params: { from: number }) => {
  const frequencyUpdate = blockFrequencyUpdater({ from: params.from })

  return defineProcessor({
    name: 'Morpho Vault APY',
    from: params.from,
    setup(processor: EvmBatchProcessor) {
      processor.includeAllBlocks({ from: params.from })
    },
    async process(ctx: Context) {
      const vaultAddress = ousd.morpho.vault[ctx.chain.id]
      const morphoAddress = ousd.morpho.blue[ctx.chain.id]
      if (!vaultAddress || !morphoAddress) {
        throw new Error(`No Morpho config for ${ctx.chain.name} (${ctx.chain.id})`)
      }
      const snapshots: MorphoVaultApy[] = []
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

      await frequencyUpdate(ctx, async (ctx, block) => {
        if (block.header.timestamp < oneWeekAgo) return
        let apy: number | null
        try {
          apy = await fetchVaultApy(ctx, block.header, vaultAddress, morphoAddress)
        } catch (err) {
          ctx.log.warn(
            { err },
            `[Morpho Vault APY - ${ctx.chain.name}] Failed to fetch vault APY at block ${block.header.height}`,
          )
          return
        }

        if (apy === null) return // vault not yet deployed

        snapshots.push(
          new MorphoVaultApy({
            id: `${ctx.chain.id}:${vaultAddress.toLowerCase()}:${block.header.height}`,
            chainId: ctx.chain.id,
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