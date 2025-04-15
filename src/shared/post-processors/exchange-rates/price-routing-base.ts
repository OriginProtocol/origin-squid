import * as aerodromeClPoolAbi from '@abi/aerodrome-cl-pool'
import * as aerodromePoolAbi from '@abi/aerodrome-pool'
import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context, invertMap } from '@originprotocol/squid-utils'
import { getPriceFromSqrtPriceX96N } from '@templates/aerodrome/prices'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'

const ONE_ETH = 10n ** 18n

const createChainlinkPriceFeed = (address: string, decimals: bigint) => {
  return async (ctx: Context, height: number) => {
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - decimals)
  }
}

const chainlinkPriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  ETH_USD: createChainlinkPriceFeed('0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', 8n),
  superOETHb_USD: createChainlinkPriceFeed('0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', 8n),
  AERO_USD: createChainlinkPriceFeed('0x4EC5970fC728C5f65ba413992CD5fF6FD70fcfF0', 8n),
}

const createAMMPriceFeed = (pool: PoolDefinition) => async (ctx: Context, height: number) => {
  if (pool.from > height) return 0n
  const poolContract = new aerodromePoolAbi.Contract(ctx, { height }, pool.address)
  return await poolContract.getReserves().then((r) => (r._reserve1 * ONE_ETH) / r._reserve0)
}

const alternativePriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  ETH_superOETHb: async (ctx, height) => {
    if (height < baseAddresses.aerodrome.pools['CL1-WETH/superOETHb'].from) {
      return 10n ** 18n
    }
    const pool = new aerodromeClPoolAbi.Contract(
      ctx,
      { height },
      baseAddresses.aerodrome.pools['CL1-WETH/superOETHb'].address,
    )
    const slot0 = await pool.slot0()
    return getPriceFromSqrtPriceX96N(slot0.sqrtPriceX96)
  },
  superOETHb_ETH: async (ctx, height) => {
    if (height < baseAddresses.aerodrome.pools['CL1-WETH/superOETHb'].from) {
      return 10n ** 18n
    }
    const pool = new aerodromeClPoolAbi.Contract(
      ctx,
      { height },
      baseAddresses.aerodrome.pools['CL1-WETH/superOETHb'].address,
    )
    const slot0 = await pool.slot0()
    return 10n ** 36n / getPriceFromSqrtPriceX96N(slot0.sqrtPriceX96)
  },
  OGN_ETH: createAMMPriceFeed(baseAddresses.aerodrome.pools['vAMM-OGN/superOETHb']),
  OGN_superOETHb: createAMMPriceFeed(baseAddresses.aerodrome.pools['vAMM-OGN/superOETHb']),
  OGN_USD: async (ctx: Context, height: number) => {
    const rate1 = await alternativePriceFeeds['OGN_superOETHb'](ctx, height)
    const rate2 = await chainlinkPriceFeeds['superOETHb_USD'](ctx, height)
    return (rate1 * rate2) / ONE_ETH
  },
}

export const baseCurrenciesByAddress = invertMap(baseAddresses.tokens)

export type BaseCurrencySymbol = keyof typeof baseAddresses.tokens | 'USD'
export type BaseCurrencyAddress = (typeof baseAddresses.tokens)[keyof typeof baseAddresses.tokens]
export type BaseCurrency = BaseCurrencySymbol | BaseCurrencyAddress

export const getBasePrice = async (ctx: Context, height: number, base: BaseCurrency, quote: BaseCurrency) => {
  try {
    base = translateBaseSymbol(base)
    quote = translateBaseSymbol(quote)
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

export const translateBaseSymbol = (symbol: BaseCurrency): BaseCurrencySymbol => {
  symbol = baseCurrenciesByAddress[symbol as BaseCurrencyAddress] || symbol
  if (symbol === 'WETH') return 'ETH'
  if (symbol === 'USDC') return 'USD'
  return symbol
}
