import { toHex } from 'viem'
import { arbitrum, mainnet } from 'viem/chains'

import { Multicall } from '@abi/multicall'
import { Block, Context } from '@processor'
import { type AbiFunction, type FunctionArguments } from '@subsquid/evm-abi'

const MULTICALL_CONTRACTS: Record<number, undefined | { from: number; address: string }> = {
  [mainnet.id]: {
    from: 12336033,
    address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  },
  [arbitrum.id]: {
    from: 821923,
    address: '0x842ec2c7d803033edf55e478f461fc547bc54eb2',
  },
}
export const multicall = async <Function extends AbiFunction<any, any>>(
  ctx: Context,
  header: Block['header'],
  func: Function,
  address: string,
  calls: FunctionArguments<Function>[],
  throttle = 50,
) => {
  const results = [] as ReturnType<Function['decodeResult']>[]
  const pendingCalls = [...calls]
  while (pendingCalls.length > 0) {
    const callsToMake = pendingCalls.splice(0, throttle)
    const multicallContract = MULTICALL_CONTRACTS[ctx.chain.id]
    if (multicallContract && header.height >= multicallContract.from) {
      const multicall = new Multicall(ctx, header, multicallContract.address)
      const response = await multicall.aggregate(func, address, callsToMake)
      results.push(...response)
    } else {
      const batchCalls = callsToMake.map((fnParams) => ({
        method: 'eth_call',
        params: [{ to: address, data: func.encode(fnParams) }, toHex(header.height)],
      }))
      const response = await ctx._chain.client.batchCall(batchCalls)
      results.push(...response.map((r) => func.decodeResult(r)))
    }
  }
  return results
}
