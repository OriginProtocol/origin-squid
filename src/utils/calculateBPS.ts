import { hexToNumber, numberToHex } from 'viem'

import { Context } from '../processor'

let lastBpsFrom = 0
let lastResult = 0

export const calculateBPS = async (ctx: Context) => {
  const lastBlockNumber = ctx.blocks[ctx.blocks.length - 1].header.height
  const bpsTestRange = 100_000
  const bpsFrom = Math.max(
    1,
    Math.floor(lastBlockNumber / bpsTestRange) * bpsTestRange - bpsTestRange,
  )
  if (bpsFrom === lastBpsFrom) {
    return lastResult
  }
  const bpsTo = bpsFrom + bpsTestRange
  const [bpsBlockFrom, bpsBlockTo] = (await ctx._chain.client.batchCall([
    {
      method: 'eth_getBlockByNumber',
      params: [numberToHex(bpsFrom), false],
    },
    {
      method: 'eth_getBlockByNumber',
      params: [numberToHex(bpsTo), false],
    },
  ])) as { timestamp: `0x${string}` }[]

  const seconds =
    hexToNumber(bpsBlockTo.timestamp) - hexToNumber(bpsBlockFrom.timestamp)
  const result = seconds / bpsTestRange
  lastResult = result
  return result
}
