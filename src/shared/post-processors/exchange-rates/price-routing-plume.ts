import * as aerodromeClPoolAbi from '@abi/aerodrome-cl-pool'
import * as aerodromePoolAbi from '@abi/aerodrome-pool'
import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import { Context, invertMap } from '@originprotocol/squid-utils'
import { getPriceFromSqrtPriceX96N } from '@templates/aerodrome/prices'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'
import { plumeAddresses } from '@utils/addresses-plume'

const ONE_ETH = 10n ** 18n

const createEacAggregatorPriceFeed = (address: string, decimals: bigint) => {
  return async (ctx: Context, height: number) => {
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - decimals)
  }
}

const chainlinkPriceFeeds: Record<string, (ctx: Context, height: number) => Promise<bigint>> = {
  ETH_USD: createEacAggregatorPriceFeed('0xeb50c42823f3d9979b09c5a0491766d596b4a87e', 8n),
  superOETHb_USD: createEacAggregatorPriceFeed('0xeb50c42823f3d9979b09c5a0491766d596b4a87e', 8n),
  PLUME_USD: createEacAggregatorPriceFeed('0xb5a9a03aebb1f8733cc0597d3b503269b816ecb2', 8n),
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

const data = {
  totalCalls: 928,
  totalCUCost: 116335,
  averageRpcCallTime: 23.822198275862068,
  callTypes: {
    eth_getBlockByNumber: 176,
    eth_blockNumber: 35,
    alchemy_getTransactionReceipts: 6,
    eth_getBlockReceipts: 175,
    debug_traceBlockByHash: 169,
    eth_call: 367,
  },
  cuCosts: {
    eth_getBlockByNumber: 2640,
    eth_blockNumber: 350,
    alchemy_getTransactionReceipts: 120,
    eth_getBlockReceipts: 35000,
    debug_traceBlockByHash: 50700,
    eth_call: 27525,
  },
  topCUMethods: [
    { method: 'debug_traceBlockByHash', cost: 50700 },
    { method: 'eth_getBlockReceipts', cost: 35000 },
    { method: 'eth_call', cost: 27525 },
    { method: 'eth_getBlockByNumber', cost: 2640 },
    { method: 'eth_blockNumber', cost: 350 },
  ],
}
