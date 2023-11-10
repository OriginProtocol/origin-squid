import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad as viemPad } from 'viem'

import { Trace } from '../processor'

const pad = (hex: string) => viemPad(hex as `0x${string}`)
const lower = (hex: string) => hex.toLowerCase()

/**
 * Helper to create and match traces.
 */
export const traceFilter = (
  filter: Pick<
    Parameters<EvmBatchProcessor['addTrace']>[0] & { type: ['call'] },
    'type' | 'callTo' | 'callSighash' | 'transaction' | 'range'
  >,
) => {
  filter = {
    type: filter.type,
    callTo: filter.callTo?.map(lower),
    callSighash: filter.callSighash?.map(lower),
    transaction: filter.transaction,
    range: filter.range,
  }
  return {
    value: filter,
    matches(trace: Trace) {
      if (filter.type && !filter.type.includes(trace.type)) return false
      if (
        filter.callTo &&
        trace.type === 'call' &&
        !filter.callTo.includes(trace.action.to)
      )
        return false
      if (
        filter.callSighash &&
        trace.type === 'call' &&
        !filter.callSighash.includes(trace.action.sighash)
      )
        return false

      if (
        filter.range &&
        (trace.block.height < filter.range.from ||
          (filter.range.to && trace.block.height > filter.range.to))
      ) {
        return false
      }
      return true
    },
  } as const
}

export type TraceFilter = ReturnType<typeof traceFilter>
