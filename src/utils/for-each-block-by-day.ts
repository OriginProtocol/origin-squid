import { Block, Context } from '@originprotocol/squid-utils'

const utcDate = (block: Block) => new Date(block.header.timestamp).toISOString().slice(0, 10)

export interface DayBoundaryCarry {
  lastBlock?: Block
}

/**
 * Deterministically drive per-day work over a batch, independent of batch boundaries.
 *
 * `onBlock` runs for every block in order. `onDayEnd(block)` runs once per UTC day, at that day's
 * true last block — detected by the next block being a different UTC day. `carry` bridges a day
 * boundary that lands exactly on a batch split, so the day is still finalized at its real last block
 * (not wherever the batch happened to end). When the batch is at the chain head, the final (still
 * in-progress) day is also swept at the latest block so the current day stays fresh while live.
 *
 * This replaces `ctx.latestBlockOfDay`, whose `lastBlockPerDay` / `blocks.at(-1)` are computed per
 * batch and therefore fire on batch boundaries — non-deterministic timing and redundant work.
 *
 * `carry` must persist across batches: declare it once at processor scope.
 */
/**
 * The blocks `forEachBlockByDay` will treat as day-ends this batch — pure, and does not mutate
 * `carry`. Use it to pre-warm any per-block RPC (e.g. an on-chain rate read) for all day-ends in one
 * parallel batch before the sequential per-day pass, so `onDayEnd` never blocks on a round-trip.
 */
export const dayEndBlocks = (ctx: Context, carry: DayBoundaryCarry): Block[] => {
  const blocks = ctx.blocks
  const ends: Block[] = []
  for (let i = 0; i < blocks.length; i++) {
    const prev = i === 0 ? carry.lastBlock : blocks[i - 1]
    if (prev && utcDate(prev) !== utcDate(blocks[i])) ends.push(prev)
  }
  // At the chain head the current (incomplete) day is swept at the latest block for live freshness.
  if (ctx.isHead && blocks.length > 0) ends.push(blocks[blocks.length - 1])
  return ends
}

export const forEachBlockByDay = async (
  ctx: Context,
  carry: DayBoundaryCarry,
  handlers: {
    onBlock: (block: Block) => Promise<void>
    onDayEnd: (dayEndBlock: Block) => Promise<void>
  },
) => {
  // Compute day-ends up front (shared with `dayEndBlocks` so prefetch and this loop never drift).
  const endHeights = new Set(dayEndBlocks(ctx, carry).map((b) => b.header.height))
  const blocks = ctx.blocks
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const prev = i === 0 ? carry.lastBlock : blocks[i - 1]
    // A new UTC day has started, so `prev` was the previous day's last block — finalize it there.
    if (prev && endHeights.has(prev.header.height) && utcDate(prev) !== utcDate(block)) {
      await handlers.onDayEnd(prev)
    }
    await handlers.onBlock(block)
  }
  if (blocks.length > 0) {
    const tail = blocks[blocks.length - 1]
    // The head-tail day-end (current day, live freshness) has no following block to trigger it above.
    if (endHeights.has(tail.header.height)) await handlers.onDayEnd(tail)
    carry.lastBlock = tail
  }
}
