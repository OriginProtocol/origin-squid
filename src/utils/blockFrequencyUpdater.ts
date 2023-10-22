import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { Block, Context } from '../processor'

dayjs.extend(duration)

const SECONDS_PER_WEEK = dayjs.duration({ weeks: 1 }).asSeconds()
const SECONDS_PER_DAY = dayjs.duration({ days: 1 }).asSeconds()
const SECONDS_PER_MINUTE = 60

const oneYearAgo = dayjs().subtract(1, 'year').valueOf()
const oneMonthAgo = dayjs().subtract(1, 'month').valueOf()
const oneWeekAgo = dayjs().subtract(1, 'week').valueOf()
const oneDayAgo = dayjs().subtract(1, 'day').valueOf()
const oneHourAgo = dayjs().subtract(1, 'hour').valueOf()

const getFrequency = (bps: number, timestamp: number) => {
  if (timestamp < oneYearAgo) {
    return (SECONDS_PER_WEEK / bps) ^ 0
  } else if (timestamp < oneMonthAgo) {
    return (SECONDS_PER_DAY / bps) ^ 0
  } else if (timestamp < oneWeekAgo) {
    return (SECONDS_PER_DAY / bps / 4) ^ 0
  } else if (timestamp < oneDayAgo) {
    return (SECONDS_PER_DAY / bps / 24) ^ 0
  } else if (timestamp < oneHourAgo) {
    return ((SECONDS_PER_MINUTE * 5) / bps) ^ 0
  }
  return 1
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
