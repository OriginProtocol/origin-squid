import * as aerodromePoolAbi from '@abi/aerodrome-pool'
import * as models from '@model'
import { Block, Context, Log, Processor } from '@processor'
import { logFilter } from '@utils/logFilter'

export const aerodromePool = (params: { address: string; from: number }): Processor => {
  const eventProcessors = Object.entries(aerodromePoolAbi.events).map(([eventName, event]) => {
    const filter = logFilter({
      address: [params.address],
      topic0: [event.topic],
      range: { from: params.from },
    })
    return {
      name: eventName,
      filter,
      process: (ctx: Context, block: Block, log: Log) => {
        if (!filter.matches(log)) return null
        const Model = models[`AeroPool${eventName as keyof typeof aerodromePoolAbi.events}`]
        const data = event.decode(log) as any
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'string') {
            data[key] = data[key].toLowerCase()
          }
        }
        return new Model({
          id: `${ctx.chain.id}-${log.id}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: log.address,
          ...data,
        })
      },
    }
  })
  return {
    from: params.from,
    name: `Aerodrome Pool ${params.address}`,
    setup: (processor) => {
      for (const { filter } of eventProcessors) {
        processor.addLog(filter.value)
      }
    },
    process: async (ctx) => {
      const entities = new Map<string, NonNullable<ReturnType<(typeof eventProcessors)[number]['process']>>[]>()
      for (const block of ctx.blocks) {
        for (const log of block.logs) {
          for (const { name, process } of eventProcessors) {
            const entity = process(ctx, block, log)
            if (entity) {
              let entitiesArray = entities.get(name)
              if (!entitiesArray) {
                entitiesArray = []
                entities.set(name, entitiesArray)
              }
              entitiesArray.push(entity)
            }
          }
        }
      }
      await Promise.all([...entities.values()].map(async (entity) => ctx.store.insert(entity)))
    },
  }
}
