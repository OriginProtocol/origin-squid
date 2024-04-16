import { toHex } from 'viem'
import { arbitrum, mainnet } from 'viem/chains'

import { Func } from '@abi/abi.support'
import { Multicall } from '@abi/multicall'
import { Block, Context } from '@processor'

const MULTICALL_CONTRACTS: Record<
  number,
  undefined | { from: number; address: string }
> = {
  [mainnet.id]: {
    from: 12336033,
    address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  },
  [arbitrum.id]: {
    from: 821923,
    address: '0x842ec2c7d803033edf55e478f461fc547bc54eb2',
  },
}
export const multicall = async <Args extends any[], R>(
  ctx: Context,
  header: Block['header'],
  func: Func<Args, {}, R>,
  address: string,
  calls: Args[],
) => {
  const multicallContract = MULTICALL_CONTRACTS[ctx.chain.id]
  if (multicallContract && header.height >= multicallContract.from) {
    const multicall = new Multicall(ctx, header, multicallContract.address)
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
