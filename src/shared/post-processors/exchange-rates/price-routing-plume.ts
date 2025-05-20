import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context, invertMap } from '@originprotocol/squid-utils'
import { plumeAddresses } from '@utils/addresses-plume'

const createEacAggregatorPriceFeed = (address: string, decimals: bigint) => {
  return async (ctx: Context, height: number) => {
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - decimals)
  }
}

const chainlinkPriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  ETH_USD: createEacAggregatorPriceFeed('0xeb50c42823f3d9979b09c5a0491766d596b4a87e', 8n),
  superOETHp_USD: createEacAggregatorPriceFeed('0xeb50c42823f3d9979b09c5a0491766d596b4a87e', 8n),
  PLUME_USD: createEacAggregatorPriceFeed('0xb5a9a03aebb1f8733cc0597d3b503269b816ecb2', 8n),
}

const alternativePriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  ETH_superOETHp: async () => 10n ** 18n,
  superOETHp_ETH: async () => 10n ** 18n,
}

export const plumeCurrenciesByAddress = invertMap(plumeAddresses.tokens)

export type PlumeCurrencySymbol = keyof typeof plumeAddresses.tokens | 'USD'
export type PlumeCurrencyAddress = (typeof plumeAddresses.tokens)[keyof typeof plumeAddresses.tokens]
export type PlumeCurrency = PlumeCurrencySymbol | PlumeCurrencyAddress

export const getPlumePrice = async (ctx: Context, height: number, base: PlumeCurrency, quote: PlumeCurrency) => {
  try {
    base = translatePlumeSymbol(base)
    quote = translatePlumeSymbol(quote)
    if (base === quote) return 1_000_000_000_000_000_000n
    const feed = chainlinkPriceFeeds[`${base}_${quote}`]
    if (feed) {
      return feed(ctx, height)
    }
    const alternateFeed = alternativePriceFeeds[`${base}_${quote}`]
    if (alternateFeed) {
      return alternateFeed(ctx, height)
    }
    return undefined
  } catch (err) {
    ctx.log.error(`Failed to get price for: ${ctx.chain.id}, ${height}, ${base}, ${quote}`)
    throw err
  }
}

export const translatePlumeSymbol = (symbol: PlumeCurrency): PlumeCurrencySymbol => {
  symbol = plumeCurrenciesByAddress[symbol as PlumeCurrencyAddress] || symbol
  if (symbol === 'WETH') return 'ETH'
  if (symbol === 'USDC') return 'USD'
  return symbol as PlumeCurrencySymbol
}
