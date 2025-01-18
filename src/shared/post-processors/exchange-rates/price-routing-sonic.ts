import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context } from '@processor'
import { sonicAddresses } from '@utils/addresses-sonic'
import { invertMap } from '@utils/invertMap'

const PRECISION_DECIMALS = 18n
const PRECISION = 10n ** PRECISION_DECIMALS

const createChainlinkPriceFeed = (address: string, decimals: bigint, from: number) => {
  return async (ctx: Context, height: number) => {
    if (height < from) return 0n
    try {
      const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
      const result = await feedContract.latestAnswer()
      return result * 10n ** (PRECISION_DECIMALS - decimals)
    } catch (err) {
      console.log('Failed to get price for: ', address, height)
      throw err
    }
  }
}

const chainlinkPriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  ETH_USD: createChainlinkPriceFeed('0x824364077993847f71293B24ccA8567c00c2de11', 8n, 3394229),
  S_ETH: async (ctx, height) => {
    const sUsd = await chainlinkPriceFeeds.S_USD(ctx, height)
    const ethUsd = await chainlinkPriceFeeds.ETH_USD(ctx, height)
    return (sUsd * PRECISION) / ethUsd
  },
  S_USD: createChainlinkPriceFeed('0xc76dfb89ff298145b417d221b2c747d84952e01d', 8n, 4189824),
}

export const sonicCurrenciesByAddress = invertMap(sonicAddresses.tokens)

export type SonicCurrencySymbol = keyof typeof sonicAddresses.tokens | 'USD' | 'S' | 'ETH'
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
  if (symbol === 'wS') return 'S'
  if (symbol === 'OS') return 'S'
  if (symbol === 'WETH') return 'ETH'
  return symbol
}
