import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor } from './processor'
import { parse } from './parser'
import { transform } from './transform'

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const logs = parse(ctx)
  const { history, rebases, owners, vaults, rebaseOptions, fraxStakings } =
    await transform(ctx, logs)

  const ownerValues = [...owners.values()]
  ctx.log.info(
    `Storing: ${ownerValues.length} owners, ${history.length} histories, ${rebases.length} rebases, ${rebaseOptions.length} rebaseOptions, ${vaults.length} vaults`,
  )

  await ctx.store.upsert(ownerValues)
  await ctx.store.insert(history)
  await ctx.store.insert(rebases)
  await ctx.store.insert(rebaseOptions)
  await ctx.store.insert(vaults)
  await ctx.store.insert(fraxStakings)
})
