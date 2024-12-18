import { Context, Processor } from '@processor'

import { LogFilter } from './logFilter'

/**
 * *** not fully tested ***
 */
export const waitForEvents = ({
  processors,
  proxyAddresses,
  logFilters,
  requirements,
}: {
  processors: Processor[]
  proxyAddresses: string[]
  logFilters: LogFilter[]
  requirements: (context: Context) => Promise<boolean>
}): Processor[] => {
  let requirementsMet = 0
  return processors.map((processor) => ({
    ...processor,
    setup: async (evmBatchProcessor) => {
      for (const logFilter of logFilters) {
        evmBatchProcessor.addLog(logFilter.value)
      }
      processor.setup?.(evmBatchProcessor)
    },
    initialize: async (ctx: Context) => {
      await processor.initialize?.(ctx)
      if (await requirements(ctx)) {
        requirementsMet = logFilters.length
      }
    },
    process: async (ctx: Context) => {
      if (requirementsMet >= logFilters.length) {
        return processor.process(ctx)
      } else {
        for (const block of ctx.blocksWithContent) {
          if (requirementsMet >= logFilters.length) {
            return processor.process(ctx)
          } else {
            for (const filter of logFilters) {
              if (block.logs.find((log) => filter.matches(log))) {
                requirementsMet++
              }
            }
          }
        }
      }
    },
  }))
}
