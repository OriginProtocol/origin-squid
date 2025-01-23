import { ProcessingStatus } from '@model'
import { Context } from '@originprotocol/squid-utils'

const processorIds = new Set<string>()

export const processStatus = (id: string) => {
  if (processorIds.has(id)) {
    throw new Error(`Already have a \`processStatus\` with id: ${id}`)
  } else {
    processorIds.add(id)
  }

  let status: ProcessingStatus | undefined = undefined

  return {
    name: `processor-status-${id}`,
    async process(ctx: Context) {
      if (!status) {
        status = await ctx.store.get(ProcessingStatus, id)
        if (!status) {
          status = new ProcessingStatus({
            blockNumber: 0,
            timestamp: new Date(0),
            id,
            startTimestamp: new Date(),
            headTimestamp: null,
          })
        }
      }
      const header = ctx.blocks[ctx.blocks.length - 1].header
      if (header) {
        status.blockNumber = header.height
        status.timestamp = new Date(header.timestamp)
        if (!status.headTimestamp && ctx.isHead) {
          status.headTimestamp = new Date()
        }
        await ctx.store.upsert(status)
      }
    },
  }
}
