import { Block, Context, Log } from '@processor'
import { event } from '@subsquid/evm-abi'
import { IndexedCodecs } from '@subsquid/evm-abi/lib/abi-components/event'
import { DecodedStruct, Struct } from '@subsquid/evm-codec'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { Entity } from '@subsquid/typeorm-store/lib/store'
import { logFilter } from '@utils/logFilter'

export const createEventProcessor = <T extends Struct, EventEntity extends Entity>(params: {
  event: ReturnType<typeof event<T>>
  address: string
  from: number
  mapEntity: (ctx: Context, block: Block, log: Log, decoded: DecodedStruct<IndexedCodecs<T>>) => EventEntity
  extraFilterArgs?: {
    topic1?: string[]
    topic2?: string[]
    topic3?: string[]
  }
}) => {
  const filter = logFilter({
    address: [params.address],
    range: { from: params.from },
    topic0: [params.event.topic],
    ...params.extraFilterArgs,
  })
  const setup = (p: EvmBatchProcessor) => {
    p.addLog(filter.value)
  }
  const process = async (ctx: Context) => {
    const entities: EventEntity[] = []
    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        if (filter.matches(log)) {
          const decoded = params.event.decode(log)
          const entity = params.mapEntity(ctx, block, log, decoded)
          entities.push(entity)
        }
      }
    }
    await ctx.store.insert(entities)
  }

  return { from: params.from, setup, process }
}
