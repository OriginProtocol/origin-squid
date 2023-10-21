import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { Block, Context } from '../processor'

dayjs.extend(duration)

const SECONDS_PER_WEEK = dayjs.duration({ weeks: 1 }).asSeconds()
const SECONDS_PER_DAY = dayjs.duration({ days: 1 }).asSeconds()

const oneYearAgo = dayjs().subtract(1, 'year')
const oneMonthAgo = dayjs().subtract(1, 'month')

const getFrequency = (bps: number, timestamp: number) => {
  if (dayjs(timestamp).isBefore(oneYearAgo)) {
    return (SECONDS_PER_WEEK / bps) ^ 0
  } else if (dayjs(timestamp).isBefore(oneMonthAgo)) {
    return (SECONDS_PER_DAY / bps) ^ 0
  }
  return (SECONDS_PER_DAY / bps / 96) ^ 0
}

export const blockFrequencyUpdater = (params: { from: number }) => {
  let lastBlockHeightProcessed = 0
  return async (
    ctx: Context,
    fn: (ctx: Context, block: Block) => Promise<void>,
  ) => {
    // If we're at head, always process.
    if (ctx.isHead) {
      for (const block of ctx.blocks) {
        await fn(ctx, block)
      }
    }

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
