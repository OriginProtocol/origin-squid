import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context } from '@processor'
import { baseAddresses } from '@utils/addresses-base'
import { invertMap } from '@utils/invertMap'

const priceFeeds: Record<string, { address: string; decimals: bigint }> = {
  ETH_USD: {
    address: '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70',
    decimals: 8n,
  },
}

export const baseCurrenciesByAddress = invertMap(baseAddresses.tokens)

export type BaseCurrencySymbol = keyof typeof baseAddresses.tokens
export type BaseCurrencyAddress = (typeof baseAddresses.tokens)[keyof typeof baseAddresses.tokens]
export type BaseCurrency = BaseCurrencySymbol | BaseCurrencyAddress

export const getBasePrice = async (ctx: Context, height: number, base: BaseCurrency, quote: BaseCurrency) => {
  try {
    base = translateSymbol(baseCurrenciesByAddress[base as BaseCurrencyAddress] || base)
    quote = translateSymbol(baseCurrenciesByAddress[quote as BaseCurrencyAddress] || quote)
    if (base === quote) return 1_000_000_000_000_000_000n
    const feed = priceFeeds[`${base}_${quote}`]
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, feed.address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - feed.decimals)
  } catch (err) {
    ctx.log.error(`Failed to get price for: ${ctx.chain.id}, ${height}, ${base}, ${quote}`)
    throw err
  }
}

export const translateSymbol = (symbol: BaseCurrencySymbol): BaseCurrencySymbol => {
  if (symbol === 'WETH') return 'ETH'
  if (symbol === 'superOETHb') return 'ETH'
  return symbol
}
