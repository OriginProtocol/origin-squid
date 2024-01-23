import { hexToBigInt } from 'viem'

import { Context } from '../processor'

export const getNativeBalance = async (
  ctx: Context,
  address: string,
  block: Context['blocks']['0'],
) => {
  return await ctx._chain.client
    .call('eth_getBalance', [address, block.header.hash])
    .then((r: `0x${string}`) => hexToBigInt(r))
}

export const getNativeBalances = async (
  ctx: Context,
  addresses: string[],
  block: Context['blocks']['0'],
) => {
  if (!addresses.length) return []
  return await ctx._chain.client
    .batchCall(
      addresses.map((address) => ({
        method: 'eth_getBalance',
        params: [address, block.header.hash],
      })),
    )
    .then((rs: `0x${string}`[]) => rs.map((r) => hexToBigInt(r)))
}
