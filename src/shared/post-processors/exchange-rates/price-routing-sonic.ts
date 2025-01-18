import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context } from '@processor'
import { sonicAddresses } from '@utils/addresses-sonic'
import { invertMap } from '@utils/invertMap'

const ONE_S = 10n ** 18n

const createChainlinkPriceFeed = (address: string, decimals: bigint) => {
  return async (ctx: Context, height: number) => {
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - decimals)
  }
}

const chainlinkPriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  // ETH_USD: createChainlinkPriceFeed('0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', 8n),
  // superOETHb_USD: createChainlinkPriceFeed('0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', 8n),
  // AERO_USD: createChainlinkPriceFeed('0x4EC5970fC728C5f65ba413992CD5fF6FD70fcfF0', 8n),
}

export const sonicCurrenciesByAddress = invertMap(sonicAddresses.tokens)

export type SonicCurrencySymbol = keyof typeof sonicAddresses.tokens | 'USD'
export type SonicCurrencyAddress = (typeof sonicAddresses.tokens)[keyof typeof sonicAddresses.tokens]
export type SonicCurrency = SonicCurrencySymbol | SonicCurrencyAddress

export const getSonicPrice = async (ctx: Context, height: number, base: SonicCurrency, quote: SonicCurrency) => {
  try {
    base = translateSonicSymbol(base)
    quote = translateSonicSymbol(quote)
    if (base === quote) return 1_000_000_000_000_000_000n
    const feed = chainlinkPriceFeeds[`${base}_${quote}`]
    if (feed) {
      return feed(ctx, height)
    }
    return undefined
  } catch (err) {
    ctx.log.error(`Failed to get price for: ${ctx.chain.id}, ${height}, ${base}, ${quote}`)
    throw err
  }
}

export const translateSonicSymbol = (symbol: SonicCurrency): SonicCurrencySymbol => {
  symbol = sonicCurrenciesByAddress[symbol as SonicCurrencyAddress] || symbol
  if (symbol === 'USDC') return 'USD'
  return symbol
}
