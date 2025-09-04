import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context, invertMap } from '@originprotocol/squid-utils'
import { sonicAddresses } from '@utils/addresses-sonic'

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

const chainlinkPriceFeeds: Record<string, { height: number; get: (ctx: Context, height: number) => Promise<bigint> }> =
  {
    ETH_USD: {
      height: 3394366,
      get: createChainlinkPriceFeed('0x824364077993847f71293B24ccA8567c00c2de11', 8n, 3394229),
    },
    S_ETH: {
      height: 4189824,
      get: async (ctx, height) => {
        const sUsd = await chainlinkPriceFeeds.S_USD.get(ctx, height)
        const ethUsd = await chainlinkPriceFeeds.ETH_USD.get(ctx, height)
        return (sUsd * PRECISION) / ethUsd
      },
    },
    S_USD: {
      height: 4189824,
      get: createChainlinkPriceFeed('0xc76dfb89ff298145b417d221b2c747d84952e01d', 8n, 4189824),
    },
    OS_S: {
      height: 21623950,
      get: createChainlinkPriceFeed('0x30caC44b395eB969C9CA0d44dF39e6E0aE8f8D94', 18n, 4189824),
    },
    OS_ETH: {
      height: 4189824,
      get: async (ctx, height) => {
        if (height < 21623950 && height >= chainlinkPriceFeeds.S_ETH.height) {
          return chainlinkPriceFeeds.S_ETH.get(ctx, height)
        }
        const osS = await chainlinkPriceFeeds.OS_S.get(ctx, height)
        const sEth = await chainlinkPriceFeeds.S_ETH.get(ctx, height)
        return (osS * sEth) / PRECISION
      },
    },
    OS_USD: {
      height: 4189824,
      get: async (ctx, height) => {
        if (height < 21623950 && height >= chainlinkPriceFeeds.S_USD.height) {
          return chainlinkPriceFeeds.S_USD.get(ctx, height)
        }
        const osS = await chainlinkPriceFeeds.OS_S.get(ctx, height)
        const sEth = await chainlinkPriceFeeds.S_ETH.get(ctx, height)
        const ethUsd = await chainlinkPriceFeeds.ETH_USD.get(ctx, height)
        return (((osS * sEth) / PRECISION) * ethUsd) / PRECISION
      },
    },
  }

export const sonicCurrenciesByAddress = invertMap(sonicAddresses.tokens)

export type SonicCurrencySymbol = keyof typeof sonicAddresses.tokens | 'USD' | 'S' | 'ETH'
export type SonicCurrencyAddress = (typeof sonicAddresses.tokens)[keyof typeof sonicAddresses.tokens]
export type SonicCurrency = SonicCurrencySymbol | SonicCurrencyAddress

export const getSonicPrice = async (ctx: Context, height: number, base: SonicCurrency, quote: SonicCurrency) => {
  try {
    base = translateSonicSymbol(base)
    quote = translateSonicSymbol(quote)
    if (base === quote) return [1_000_000_000_000_000_000n, 18] as const
    const feed = chainlinkPriceFeeds[`${base}_${quote}`]
    if (feed && feed.height <= height) {
      return [await feed.get(ctx, height), 18] as const
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
  if (symbol === 'WETH') return 'ETH'
  return symbol
}
