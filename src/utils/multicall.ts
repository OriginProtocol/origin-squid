import { toHex } from 'viem'

import { Func } from '../abi/abi.support'
import { Multicall } from '../abi/multicall'
import { Block, Context } from '../processor'

const MULTICALL_CONTRACT = '0x5ba1e12693dc8f9c48aad8770482f4739beed696'
const from = 12336033

export const multicall = async <Args extends any[], R>(
  ctx: Context,
  header: Block['header'],
  func: Func<Args, {}, R>,
  address: string,
  calls: Args[],
) => {
  if (header.height >= from) {
    const multicall = new Multicall(ctx, header, MULTICALL_CONTRACT)
    return multicall.aggregate(func, address, calls)
  }
  const batchCalls = calls.map((fnParams) => ({
    method: 'eth_call',
    params: [
      { to: address, data: func.encode(fnParams) },
      toHex(header.height),
    ],
  }))
  const results = await ctx._chain.client.batchCall(batchCalls)
  return results.map((r) => func.decodeResult(r))
}
