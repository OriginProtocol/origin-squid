import { ProcessingStatus } from '@model'
import { Context } from '@processor'

const processorIds = new Set<string>()

export const processStatus = (id: string) => {
  if (processorIds.has(id)) {
    throw new Error(`Already have a \`processStatus\` with id: ${id}`)
  } else {
    processorIds.add(id)
  }

  return {
    name: `processor-status-${id}`,
    async process(ctx: Context) {
      const header = ctx.blocks[ctx.blocks.length - 1].header
      if (header) {
        await ctx.store.upsert([
          new ProcessingStatus({
            id,
            blockNumber: header.height,
            timestamp: new Date(header.timestamp),
          }),
        ])
      }
    },
  }
}
