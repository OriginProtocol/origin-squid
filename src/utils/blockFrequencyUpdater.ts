import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

import { Block, Context } from '../processor'

dayjs.extend(duration)
dayjs.extend(utc)

const SECONDS_PER_WEEK = dayjs.duration({ weeks: 1 }).asSeconds()
const SECONDS_PER_DAY = dayjs.duration({ days: 1 }).asSeconds()
const SECONDS_PER_MINUTE = 60

const oneYearAgo = dayjs.utc().subtract(1, 'year').valueOf()
const oneMonthAgo = dayjs.utc().subtract(1, 'month').valueOf()
const oneWeekAgo = dayjs.utc().subtract(1, 'week').valueOf()
const oneDayAgo = dayjs.utc().subtract(1, 'day').valueOf()
const oneHourAgo = dayjs.utc().subtract(1, 'hour').valueOf()

const getFrequency = (bps: number, timestamp: number) => {
  if (timestamp < oneYearAgo) {
    return (SECONDS_PER_WEEK / bps) ^ 0 // Older than one year ago
  } else if (timestamp < oneMonthAgo) {
    return (SECONDS_PER_DAY / bps) ^ 0 // Older than one month ago
  } else if (timestamp < oneWeekAgo) {
    return (SECONDS_PER_DAY / bps / 4) ^ 0 // Older than one week ago
  } else if (timestamp < oneDayAgo) {
    return (SECONDS_PER_DAY / bps / 24) ^ 0 // Older than one day ago
  } else if (timestamp < oneHourAgo) {
    return ((SECONDS_PER_MINUTE * 5) / bps) ^ 0 // Older than one hour ago
  }
  return (SECONDS_PER_MINUTE / bps) ^ 0
}

export const blockFrequencyTracker = (params: { from: number }) => {
  let lastBlockHeightProcessed = 0
  return (ctx: Context, block: Block) => {
    if (block.header.height < params.from) return
    // If we're not at head, determine our frequency and then process.
    const { bps } = ctx
    let frequency: number = getFrequency(bps, ctx.blocks[0].header.timestamp)
    if (block.header.height >= lastBlockHeightProcessed + frequency) {
      lastBlockHeightProcessed = block.header.height
      return true
    }
    return false
  }
}

export const blockFrequencyUpdater = (params: { from: number }) => {
  let lastBlockHeightProcessed = 0
  return async (
    ctx: Context,
    fn: (ctx: Context, block: Block) => Promise<void>,
  ) => {
    if (!ctx.blocks.length) return
    // If we're not at head, determine our frequency and then process.
    const { bps } = ctx
    let frequency: number = getFrequency(bps, ctx.blocks[0].header.timestamp)
    const nextBlockIndex = ctx.blocks.findIndex(
      (b) => b.header.height >= lastBlockHeightProcessed + frequency,
    )
    for (let i = nextBlockIndex; i < ctx.blocks.length; i += frequency) {
      const block = ctx.blocks[i]
      if (!block || block.header.height < params.from) continue
      await fn(ctx, block)
      lastBlockHeightProcessed = block.header.height
      frequency = getFrequency(bps, block.header.timestamp)
    }
  }
}
