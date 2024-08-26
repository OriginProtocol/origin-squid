import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context } from '@processor'
import { baseAddresses } from '@utils/addresses-base'
import { invertMap } from '@utils/invertMap'

const priceFeeds: Record<string, string> = {
  ETH_USD: '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70',
  WETH_USD: '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', // Same as ETH_USD
}

export const baseCurrenciesByAddress = invertMap(baseAddresses.tokens)

export type BaseCurrencySymbol = keyof typeof baseAddresses.tokens
export type BaseCurrencyAddress = (typeof baseAddresses.tokens)[keyof typeof baseAddresses.tokens]
export type BaseCurrency = BaseCurrencySymbol | BaseCurrencyAddress

export const getBasePrice = async (ctx: Context, height: number, base: BaseCurrency, quote: BaseCurrency) => {
  try {
    base = baseCurrenciesByAddress[base as BaseCurrencyAddress] || base
    quote = baseCurrenciesByAddress[quote as BaseCurrencyAddress] || quote
    if (base === 'ETH' && quote === 'WETH') return 1_000_000_000_000_000_000n
    const address = priceFeeds[`${base}_${quote}`]
    const feed = new eacAggregatorProxy.Contract(ctx, { height }, address)
    return await feed.latestAnswer()
  } catch (err) {
    ctx.log.error(`Failed to get price for: ${ctx.chain.id}, ${height}, ${base}, ${quote}`)
    throw err
  }
}
