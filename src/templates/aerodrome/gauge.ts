import * as aerodromeGaugeAbi from '@abi/aerodrome-gauge'
import * as models from '@model'
import { Block, Context, Log, Processor } from '@processor'
import { logFilter } from '@utils/logFilter'

export const aerodromeGauge = (params: { address: string; from: number }): Processor => {
  const eventProcessors = Object.entries(aerodromeGaugeAbi.events).map(([eventName, event]) => {
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
        const Model = models[`AeroGauge${eventName as keyof typeof aerodromeGaugeAbi.events}`]
        const data = event.decode(log) as any
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'string') {
            data[key] = data[key].toLowerCase()
          }
        }
        return new Model({
          ...data,
          id: `${ctx.chain.id}-${log.id}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: log.address,
        })
      },
    }
  })
  return {
    from: params.from,
    name: `Aerodrome Gauge ${params.address}`,
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