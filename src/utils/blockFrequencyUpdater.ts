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
const fifteenMinutesAgo = dayjs.utc().subtract(15, 'minutes').valueOf()

const getFrequency = (blockRate: number, timestamp: number) => {
  if (timestamp < oneYearAgo) {
    return (SECONDS_PER_WEEK / blockRate) ^ 0 // Older than one year ago
  } else if (timestamp < oneMonthAgo) {
    return (SECONDS_PER_DAY / blockRate) ^ 0 // Older than one month ago
  } else if (timestamp < oneWeekAgo) {
    return (SECONDS_PER_DAY / blockRate / 4) ^ 0 // Older than one week ago
  } else if (timestamp < oneDayAgo) {
    return (SECONDS_PER_DAY / blockRate / 12) ^ 0 // Older than one day ago
  } else if (timestamp < oneHourAgo) {
    return ((SECONDS_PER_MINUTE * 30) / blockRate) ^ 0 // Older than one hour ago
  } else if (timestamp < fifteenMinutesAgo) {
    return ((SECONDS_PER_MINUTE * 5) / blockRate) ^ 0 // Older than 15 minutes ago
  } else {
    return (SECONDS_PER_MINUTE / blockRate) ^ 0
  }
}

export const blockFrequencyTracker = (params: { from: number }) => {
  return (ctx: Context, block: Block) => {
    if (block.header.height < params.from) return
    const frequency: number = getFrequency(
      ctx.blockRate,
      block.header.timestamp,
    )
    return block.header.height % frequency === 0
  }
}

export const blockFrequencyUpdater = (params: { from: number }) => {
  return async (
    ctx: Context,
    fn: (ctx: Context, block: Block) => Promise<void>,
  ) => {
    if (!ctx.blocks.length) return
    if (ctx.blocks[ctx.blocks.length - 1].header.height < params.from) {
      // No applicable blocks in current context.
      return
    }
    let frequency: number = getFrequency(
      ctx.blockRate,
      ctx.blocks[0].header.timestamp,
    )
    for (
      let i = ctx.blocks.findIndex(
        (b) =>
          b.header.height % frequency === 0 && b.header.height >= params.from,
      );
      i < ctx.blocks.length;
      i += frequency
    ) {
      const block = ctx.blocks[i]
      if (!block) break
      if (block.header.height % frequency !== 0) {
        throw new Error(
          'This should never happen. Ensure you are passing all blocks through here.',
        )
      }
      await fn(ctx, block)
      frequency = getFrequency(ctx.blockRate, block.header.timestamp)
      i -= ctx.blocks[i].header.height % frequency
    }
  }
}
