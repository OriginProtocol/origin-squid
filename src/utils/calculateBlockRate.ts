import { hexToNumber, numberToHex } from 'viem'

import { Context } from '@processor'

let lastRateFrom = 0
let lastResult = 0

export const calculateBlockRate = async (ctx: Context) => {
  const lastBlockNumber = ctx.blocks[ctx.blocks.length - 1].header.height
  const rateTestRange = 100_000
  const rateFrom = Math.max(
    1,
    Math.floor(lastBlockNumber / rateTestRange) * rateTestRange - rateTestRange,
  )
  if (rateFrom === lastRateFrom) {
    return lastResult
  }
  const rateTo = Math.min(rateFrom + rateTestRange, lastBlockNumber)
  const [rateBlockFrom, rateBlockTo] = (await ctx._chain.client.batchCall([
    {
      method: 'eth_getBlockByNumber',
      params: [numberToHex(rateFrom), false],
    },
    {
      method: 'eth_getBlockByNumber',
      params: [numberToHex(rateTo), false],
    },
  ])) as { timestamp: `0x${string}` }[]

  const seconds =
    hexToNumber(rateBlockTo.timestamp) - hexToNumber(rateBlockFrom.timestamp)
  const result = seconds / rateTestRange
  lastResult = result
  return result
}
