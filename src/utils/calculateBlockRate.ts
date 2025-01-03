import { arbitrum, base, mainnet } from 'viem/chains'

import { Context } from '@processor'

const blockRates: Record<number, number> = {
  [mainnet.id]: 12.04,
  [arbitrum.id]: 0.25,
  [base.id]: 2,
}

export const calculateBlockRate = async (ctx: Context) => {
  const rate = blockRates[ctx.chain.id]
  if (rate) {
    return rate
  }
  throw new Error('No block rate found')
}
