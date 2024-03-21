import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad as viemPad } from 'viem'

import { Log } from '../processor'

const pad = (hex: string) => viemPad(hex as `0x${string}`)
const lower = (hex: string) => hex.toLowerCase()
const prepare = (hex: string) => pad(lower(hex))

/**
 * Helper to create and match logs, ensuring hex values are lowercase and properly padded.
 */
export const logFilter = (
  filter: Parameters<EvmBatchProcessor['addLog']>[0],
) => {
  filter = {
    address: filter.address?.map(lower),
    topic0: filter.topic0?.map(prepare),
    topic1: filter.topic1?.map(prepare),
    topic2: filter.topic2?.map(prepare),
    topic3: filter.topic3?.map(prepare),
    range: filter.range,
    transaction: filter.transaction,
  }
  return {
    value: filter,
    matches(log: Log) {
      if (filter.address && !filter.address.includes(log.address)) {
        return false
      }
      if (filter.topic0 && !filter.topic0.includes(log.topics[0])) {
        return false
      }
      if (filter.topic1 && !filter.topic1.includes(log.topics[1])) {
        return false
      }
      if (filter.topic2 && !filter.topic2.includes(log.topics[2])) {
        return false
      }
      if (filter.topic3 && !filter.topic3.includes(log.topics[3])) {
        return false
      }
      if (
        filter.range &&
        (log.block.height < filter.range.from ||
          (filter.range.to && log.block.height > filter.range.to))
      ) {
        return false
      }
      return true
    },
  } as const
}

export type LogFilter = ReturnType<typeof logFilter>
