import * as aerodromeClPoolAbi from '@abi/aerodrome-cl-pool'
import * as aerodromePoolAbi from '@abi/aerodrome-pool'
import * as curvePoolAbi from '@abi/curve-lp-token'
import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Block, Context, invertMap } from '@originprotocol/squid-utils'
import { getPriceFromSqrtPriceX96N } from '@templates/aerodrome/prices'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'

const ONE_ETH = 10n ** 18n

// Curve factory-crypto-4: coins(0) = CRV, coins(1) = crvUSD.
// https://api.curve.finance/v1/getPools/base/factory-crypto
const CRV_CRVUSD_POOL = '0xde37e221442fa15c35dc19fbae11ed106ba52fb2'
const CRV_CRVUSD_POOL_HEIGHT = 3327708

const getCRVUSDPrice = async (ctx: Context, height: number) => {
  const pool = new curvePoolAbi.Contract(ctx, { height }, CRV_CRVUSD_POOL)
  // price_oracle is CRV per crvUSD, scaled by 1e18. Invert to crvUSD per CRV.
  // Treat crvUSD as $1 for analytics, just as the Base routes treat USDC as USD.
  const crvPerCrvUsd = await pool.price_oracle()
  if (crvPerCrvUsd <= 0n) throw new Error('Invalid CRV/crvUSD oracle price')
  return (ONE_ETH * ONE_ETH) / crvPerCrvUsd
}

const createChainlinkPriceFeed = (address: string, decimals: bigint) => {
  return async (ctx: Context, height: number) => {
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - decimals)
  }
}

const chainlinkPriceFeeds: Record<string, { height: number; get: (ctx: Context, height: number) => Promise<bigint> }> =
  {
    ETH_USD: { height: 2092862, get: createChainlinkPriceFeed('0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', 8n) },
    superOETHb_USD: {
      height: 2092862,
      get: createChainlinkPriceFeed('0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70', 8n),
    },
    superOETHb_ETH: {
      height: 27814188,
      get: createChainlinkPriceFeed('0x39C6E14CdE46D4FFD9F04Ff159e7ce8eC20E10B4', 18n),
    },
    AERO_USD: { height: 12730314, get: createChainlinkPriceFeed('0x4EC5970fC728C5f65ba413992CD5fF6FD70fcfF0', 8n) },
  }

const createAMMPriceFeed = (pool: PoolDefinition) => async (ctx: Context, height: number) => {
  if (pool.from > height) return 0n
  const poolContract = new aerodromePoolAbi.Contract(ctx, { height }, pool.address)
  return await poolContract.getReserves().then((r) => (r._reserve1 * ONE_ETH) / r._reserve0)
}

const alternativePriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  CRV_USD: getCRVUSDPrice,
  CRV_ETH: async (ctx, height) => {
    const crvUsd = await getCRVUSDPrice(ctx, height)
    const ethUsd = await chainlinkPriceFeeds['ETH_USD'].get(ctx, height)
    // A missing price must stop processing rather than silently discard harvested CRV.
    if (ethUsd <= 0n) throw new Error('Invalid ETH/USD oracle price for CRV')
    return (crvUsd * ONE_ETH) / ethUsd
  },
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
    const rate2 = await chainlinkPriceFeeds['superOETHb_USD'].get(ctx, height)
    return (rate1 * rate2) / ONE_ETH
  },
  AERO_ETH: async (ctx: Context, height: number) => {
    const aeroUsd = await chainlinkPriceFeeds['AERO_USD'].get(ctx, height)
    const ethUsd = await chainlinkPriceFeeds['ETH_USD'].get(ctx, height)
    if (ethUsd === 0n) return 0n
    return (aeroUsd * ONE_ETH) / ethUsd
  },
  AERO_WETH: async (ctx: Context, height: number) => {
    const aeroUsd = await chainlinkPriceFeeds['AERO_USD'].get(ctx, height)
    const ethUsd = await chainlinkPriceFeeds['ETH_USD'].get(ctx, height)
    if (ethUsd === 0n) return 0n
    return (aeroUsd * ONE_ETH) / ethUsd
  },
}

export const baseCurrenciesByAddress = invertMap(baseAddresses.tokens)

export type BaseCurrencySymbol = keyof typeof baseAddresses.tokens | 'USD'
export type BaseCurrencyAddress = (typeof baseAddresses.tokens)[keyof typeof baseAddresses.tokens]
export type BaseCurrency = BaseCurrencySymbol | BaseCurrencyAddress

export const getBasePrice = async (ctx: Context, block: Block['header'], base: BaseCurrency, quote: BaseCurrency) => {
  try {
    base = translateBaseSymbol(base)
    quote = translateBaseSymbol(quote)
    if (base === quote) return [1_000_000_000_000_000_000n, 18] as const
    if (base === 'CRV' && block.height < CRV_CRVUSD_POOL_HEIGHT) return undefined
    const feed = chainlinkPriceFeeds[`${base}_${quote}`]
    if (feed && feed.height <= block.height) {
      return [await feed.get(ctx, block.height), 18] as const
    }
    const alternateFeed = alternativePriceFeeds[`${base}_${quote}`]
    if (alternateFeed) {
      return [await alternateFeed(ctx, block.height), 18] as const
    }
    return undefined
  } catch (err) {
    ctx.log.error(`Failed to get price for: ${ctx.chain.id}, ${block.height}, ${base}, ${quote}`)
    throw err
  }
}

export const translateBaseSymbol = (symbol: BaseCurrency): BaseCurrencySymbol => {
  symbol = baseCurrenciesByAddress[symbol as BaseCurrencyAddress] || symbol
  if (symbol === 'WETH') return 'ETH'
  if (symbol === 'USDC') return 'USD'
  return symbol
}
