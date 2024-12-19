import { pick } from 'lodash'

import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import * as models from '@model'
import { Block, Context, Log, Processor } from '@processor'
import { logFilter } from '@utils/logFilter'

export const aerodromeVoter = (params: { address: string; pools: string[]; from: number }): Processor => {
  const aeroVoterEvents = pick(aerodromeVoterAbi.events, ['Voted', 'Abstained'])
  const eventProcessors = Object.entries(aeroVoterEvents).map(([eventName, event]) => {
    const filter = logFilter({
      address: [params.address],
      topic0: [event.topic],
      topic2: params.pools,
      range: { from: params.from },
    })
    return {
      name: eventName,
      filter,
      process: (ctx: Context, block: Block, log: Log) => {
        if (!filter.matches(log)) return null
        const Model = models[`AeroVoter${eventName as keyof typeof aeroVoterEvents}`]
        const data = event.decode(log) as any
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'string') {
            data[key] = data[key].toLowerCase()
            if (key === '_bool') {
              data.bool = data._bool
              delete data._bool
            }
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
    name: `Aerodrome Voter ${params.address}`,
    setup: (processor) => {
      for (const { filter } of eventProcessors) {
        processor.addLog(filter.value)
      }
    },
    process: async (ctx) => {
      const entities = new Map<string, NonNullable<ReturnType<(typeof eventProcessors)[number]['process']>>[]>()
      for (const block of ctx.blocksWithContent) {
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
