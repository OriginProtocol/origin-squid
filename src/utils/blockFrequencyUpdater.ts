import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

import { Block, Context } from '../processor'

dayjs.extend(duration)
dayjs.extend(utc)

const SECONDS_PER_WEEK = dayjs.duration({ weeks: 1 }).asSeconds()
const SECONDS_PER_DAY = dayjs.duration({ days: 1 }).asSeconds()
const SECONDS_PER_MINUTE = 60

// It's OK that these are only calculated at launch.
const oneYearAgo = dayjs.utc().subtract(1, 'year').valueOf()
const oneMonthAgo = dayjs.utc().subtract(1, 'month').valueOf()
const oneWeekAgo = dayjs.utc().subtract(1, 'week').valueOf()
const oneDayAgo = dayjs.utc().subtract(1, 'day').valueOf()
const oneHourAgo = dayjs.utc().subtract(1, 'hour').valueOf()

const getFrequency = (bps: number, timestamp: number) => {
  let frequency = 1
  if (timestamp < oneYearAgo) {
    frequency = (SECONDS_PER_WEEK / bps) ^ 0 // Older than one year ago
  } else if (timestamp < oneMonthAgo) {
    frequency = (SECONDS_PER_DAY / bps) ^ 0 // Older than one month ago
  } else if (timestamp < oneWeekAgo) {
    frequency = (SECONDS_PER_DAY / bps / 4) ^ 0 // Older than one week ago
  } else if (timestamp < oneDayAgo) {
    frequency = (SECONDS_PER_DAY / bps / 24) ^ 0 // Older than one day ago
  } else if (timestamp < oneHourAgo) {
    frequency = ((SECONDS_PER_MINUTE * 5) / bps) ^ 0 // Older than one hour ago
  } else {
    frequency = (SECONDS_PER_MINUTE / bps) ^ 0
  }
  return frequency || 1
}

export const blockFrequencyTracker = (params: { from: number }) => {
  let nextBlockToProcess = params.from
  const shouldProcess = (b: Block, frequency: number) => {
    let result = b.header.height >= nextBlockToProcess
    if (result) {
      nextBlockToProcess =
        Math.floor((b.header.height + frequency) / frequency) * frequency
    }
    return result
  }
  return (ctx: Context, block: Block) => {
    if (block.header.height < params.from) return
    const { bps } = ctx
    const frequency: number = getFrequency(bps, block.header.timestamp)
    return shouldProcess(block, frequency)
  }
}

export const blockFrequencyUpdater = (params: { from: number }) => {
  let nextBlockToProcess = params.from
  const shouldProcess = (b: Block) => {
    return b.header.height >= nextBlockToProcess
  }
  return async (
    ctx: Context,
    fn: (ctx: Context, block: Block) => Promise<void>,
  ) => {
    if (!ctx.blocks.length) return
    // If we're not at head, determine our frequency and then process.
    const { bps } = ctx
    let frequency: number = getFrequency(bps, ctx.blocks[0].header.timestamp)
    for (let i = 0; i < ctx.blocks.length; i += frequency) {
      const block = ctx.blocks[i]
      if (!shouldProcess(block)) continue
      await fn(ctx, block)
      nextBlockToProcess =
        Math.floor((block.header.height + frequency) / frequency) * frequency
      frequency = getFrequency(bps, block.header.timestamp)
    }
  }
}
