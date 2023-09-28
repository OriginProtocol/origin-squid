import { hexToBigInt } from 'viem'

import { Context } from '../processor'

export const getEthBalance = async (
  ctx: Context,
  address: string,
  block: Context['blocks']['0'],
) =>
  await ctx._chain.client
    .call('eth_getBalance', [address, block.header.hash])
    .then((r: `0x${string}`) => hexToBigInt(r))
