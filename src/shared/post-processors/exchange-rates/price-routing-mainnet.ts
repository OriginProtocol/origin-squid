import { memoize } from 'lodash'

import * as balancerMetaStablePoolAbi from '@abi/balancer-meta-stable-pool'
import * as balancerRateProvider from '@abi/balancer-rate-provider'
import * as chainlinkFeedRegistry from '@abi/chainlink-feed-registry'
import * as curveLpToken from '@abi/curve-lp-token'
import * as diaOracleAbi from '@abi/dia-oracle'
import * as eacAggregatorProxy from '@abi/eac-aggregator-proxy'
import * as frxEthFraxOracle from '@abi/frx-eth-frax-oracle'
import * as oethOracleRouter from '@abi/oeth-oracle-router'
import * as stakedFraxEth from '@abi/sfrx-eth'
import * as uniswapV3 from '@abi/uniswap-v3'
import * as woethAbi from '@abi/woeth'
import { Block, Context } from '@originprotocol/squid-utils'
import { getPriceFromSqrtPriceX96N } from '@templates/aerodrome/prices'
import { CURVE_ETH_OETH_POOL_ADDRESS, STETH_ADDRESS } from '@utils/addresses'

import { ousdDailyPrices } from './data/coingecko-ousd.json'
import {
  CurrencySymbol,
  MainnetCurrency,
  MainnetCurrencyAddress,
  MainnetCurrencySymbol,
  mainnetCurrencies,
  mainnetCurrenciesByAddress,
} from './mainnetCurrencies'

const createChainlinkPriceFeed = (address: string, decimals: bigint) => {
  return async (ctx: Context, height: number) => {
    const feedContract = new eacAggregatorProxy.Contract(ctx, { height }, address)
    const result = await feedContract.latestAnswer()
    return result * 10n ** (18n - decimals)
  }
}

// 0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f

const chainlinkPriceFeeds: Record<
  string,
  undefined | { height: number; get: (ctx: Context, height: number) => Promise<bigint> }
> = {
  CRV_USD: { height: 12162244, get: createChainlinkPriceFeed('0xcd627aa160a6fa45eb793d19ef54f5062f20f33f', 8n) },
  CRV_USDC: { height: 12162244, get: createChainlinkPriceFeed('0xcd627aa160a6fa45eb793d19ef54f5062f20f33f', 8n) },
  CVX_USD: { height: 13960589, get: createChainlinkPriceFeed('0xd962fc30a72a84ce50161031391756bf2876af5d', 8n) },
  OETH_ETH: { height: 19384550, get: createChainlinkPriceFeed('0x703118c4cbcccbf2ab31913e0f8075fbbb15f563', 18n) },
  COMP_USD: { height: 10730672, get: createChainlinkPriceFeed('0xdbd020caef83efd542f4de03e3cf0c28a4428bd5', 8n) },
  COMP_ETH: { height: 10679326, get: createChainlinkPriceFeed('0x1b39ee86ec5979ba5c322b826b3ecb8c79991699', 18n) },
}

export const getMainnetPrice = async (
  ctx: Context,
  block: Block['header'],
  base: MainnetCurrency,
  quote: MainnetCurrency,
): Promise<[bigint, number]> => {
  base = translateMainnetSymbol(base)
  quote = translateMainnetSymbol(quote)

  const feed = chainlinkPriceFeeds[`${base}_${quote}`]
  if (feed && feed.height <= block.height) {
    return [await feed.get(ctx, block.height), 18]
  }

  const priceEntry = priceMap[`${base}_${quote}`]
  if (priceEntry) {
    const [getPrice, decimals] = priceEntry
    return [await getPrice(ctx, block), decimals]
  }
  throw new Error(`No price for ${base}_${quote}`)
}

const getOETHETHPrice = async (ctx: Context, block: Block['header']) => {
  if (block.height < 17230232) return 10n ** 18n
  if (block.height < 19384550) {
    const contract = new curveLpToken.Contract(ctx, { height: block.height }, CURVE_ETH_OETH_POOL_ADDRESS)
    return await contract.get_dy(0n, 1n, 1000000000000000000n)
  }
  return chainlinkPriceFeeds['OETH_ETH']!.get(ctx, block.height)
}

const getETHOETHPrice = async (ctx: Context, block: Block['header']) => {
  if (block.height < 17230232) return 10n ** 18n
  const contract = new curveLpToken.Contract(ctx, { height: block.height }, CURVE_ETH_OETH_POOL_ADDRESS)
  return await contract.get_dy(1n, 0n, 1000000000000000000n)
}

const getRETHPrice = async (ctx: Context, block: Block['header']) => {
  if (block.height < 13846138) return 0n
  // Balancer rETH Stable Pool Rate Provider
  const rateProvider = await getBalancePoolRateProviders(
    ctx,
    { height: block.height },
    '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
  )
  // Balancer Vault `getPoolTokens` https://etherscan.io/address/0xba12222222228d8ba445958a75a0704d566bf2c8#readContract#F10
  const provider = new balancerRateProvider.Contract(
    ctx,
    { height: block.height },
    rateProvider[0], // rETH Rate
  )
  return await provider.getRate()
}

const registryAddress = '0x47fb2585d2c56fe188d0e6ec628a38b74fceeedf'
const getChainlinkPrice = async (ctx: Context, height: number, base: MainnetCurrency, quote: MainnetCurrency) => {
  if (height < 12864088) return 0n
  const registry = new chainlinkFeedRegistry.Contract(ctx, { height }, registryAddress)
  try {
    base = mainnetCurrencies[base as MainnetCurrencySymbol] ?? base
    quote = mainnetCurrencies[quote as MainnetCurrencySymbol] ?? quote

    if (quote === STETH_ADDRESS) {
      // This registry if flipped.
      return await registry
        .latestAnswer(
          mainnetCurrencies[quote as MainnetCurrencySymbol] ?? quote,
          mainnetCurrencies[base as MainnetCurrencySymbol] ?? base,
        )
        // Invert so we get the proper direction.
        .then((result) => 1_000000000_000000000_000000000_000000000n / result)
    }

    return await registry.latestAnswer(
      mainnetCurrencies[base as MainnetCurrencySymbol] ?? base,
      mainnetCurrencies[quote as MainnetCurrencySymbol] ?? quote,
    )
  } catch (err: any) {
    if (err.message.match(/: Feed not found/)) {
      return 0n
    }
    throw err
  }
}

// const oethOracleCurrencies = new Set(['WETH', 'stETH', 'frxETH'])
const oethOracleAddress = '0xbE19cC5654e30dAF04AD3B5E06213D70F4e882eE'
const getOethOraclePrice = async (ctx: Context, height: number, quote: MainnetCurrency) => {
  if (height < 18032300) return 0n
  const router = new oethOracleRouter.Contract(ctx, { height }, oethOracleAddress)
  return router.price(mainnetCurrencies[quote as MainnetCurrencySymbol] ?? quote)
}

const stakedFraxAddress = '0xac3e018457b222d93114458476f3e3416abbe38f'
const getStakedFraxPrice = async (ctx: Context, block: Block['header']) => {
  if (block.height < 15686046) return 0n
  const router = new stakedFraxEth.Contract(ctx, { height: block.height }, stakedFraxAddress)
  return router.previewRedeem(1_000_000_000_000_000_000n)
}

const frxEthFraxOracleAddress = '0xC58F3385FBc1C8AD2c0C9a061D7c13b141D7A5Df'
const getFrxEthPrice = async (ctx: Context, block: Block['header']) => {
  // Deploy block of 17571367 doesn't work, so we wait until it is functional.
  if (block.height < 17571500) return 1_000_000_000_000_000_000n
  const frxEth = new frxEthFraxOracle.Contract(ctx, { height: block.height }, frxEthFraxOracleAddress)
  return frxEth.latestRoundData().then((lrd) => lrd.answer)
}

export const getBalancePoolRateProviders = memoize(
  async (ctx: Context, block: { height: number }, address: string) => {
    const pool = new balancerMetaStablePoolAbi.Contract(ctx, block, address)
    return await pool.getRateProviders()
  },
  (_ctx, _block, address) => address.toLowerCase(),
)

const getPrice_OUSD_USD = async (ctx: Context, block: Block['header']) => {
  if (block.height < 18071236) return 1_000_000_000_000_000_000n
  if (block.height > 21696108 && block.height < 23390149) {
    // ousdDailyPrices data is stripped down to only this timespan we need.
    const price = ousdDailyPrices.find((p) => p[0] === Math.floor(block.timestamp / 86400000) * 86400000)
    if (price) {
      return BigInt(price[1] * 1e18)
    } else {
      return 1_000_000_000_000_000_000n
    }
  }
  const diaOracle = new diaOracleAbi.Contract(
    ctx,
    { height: block.height },
    '0xafa00e7eff2ea6d216e432d99807c159d08c2b79',
  )
  return diaOracle.getValue('OUSD/USD').then((d) => d._0 * 10n ** 10n)
}

const getPrice_wOETH_OETH = async (ctx: Context, block: Block['header']) => {
  if (block.height < 17141658) return 1_000_000_000_000_000_000n
  const woeth = new woethAbi.Contract(ctx, { height: block.height }, mainnetCurrencies.wOETH)
  return woeth.previewRedeem(1_000_000_000_000_000_000n)
}

const getPrice_OUSD_ETH = async (ctx: Context, block: Block['header']) => {
  const ousdusd = await getPrice_OUSD_USD(ctx, block)
  const ethusd = await getChainlinkPrice(ctx, block.height, 'ETH', 'USD')
  if (!ethusd) return 0n
  return (ousdusd * 10n ** 8n) / ethusd
}

const getMorphoEthPrice = async (ctx: Context, block: Block['header']) => {
  const morpho = new uniswapV3.Contract(ctx, { height: block.height }, '0xc8219b876753a85025156b22176c2edea17aac53')
  return morpho.slot0().then((slot0) => getPriceFromSqrtPriceX96N(slot0.sqrtPriceX96))
}

const getPrice_OETH_USD = async (ctx: Context, block: Block['header']) => {
  const ethusd = await getChainlinkPrice(ctx, block.height, 'ETH', 'USD')
  return ethusd * 10n ** 10n
}

export const translateMainnetSymbol = (symbol: MainnetCurrency): MainnetCurrencySymbol => {
  symbol = mainnetCurrenciesByAddress[symbol as MainnetCurrencyAddress] || symbol
  return symbol
}

export const derived = <Base extends MainnetCurrencySymbol, Quote extends MainnetCurrencySymbol>(
  base: Base,
  quote: Quote,
  connections: { base: MainnetCurrencySymbol; quote: MainnetCurrencySymbol }[],
  decimals: number = 18,
) => {
  return twoWay(
    base,
    quote,
    async (ctx: Context, block: Block['header']) => {
      const baseExponent = 10n ** BigInt(decimals)
      const rates = await Promise.all(connections.map(({ base, quote }) => getMainnetPrice(ctx, block, base, quote)))
      return rates.reduce((acc, [rate]) => (acc * rate) / baseExponent, baseExponent)
    },
    decimals,
  )
}
export const invertRate = (rate: bigint, decimals = 18) => (rate > 0n ? 10n ** BigInt(2 * decimals) / rate : 0n)
export const twoWay = <Base extends MainnetCurrencySymbol, Quote extends MainnetCurrencySymbol>(
  base: Base,
  quote: Quote,
  getPrice: (ctx: Context, block: Block['header']) => Promise<bigint>,
  decimals: number = 18,
) =>
  ({
    [`${base}_${quote}`]: [async (ctx: Context, block: Block['header']) => getPrice(ctx, block), decimals],
    [`${quote}_${base}`]: [
      async (ctx: Context, block: Block['header']) => getPrice(ctx, block).then((rate) => invertRate(rate, decimals)),
      decimals,
    ],
  }) as const

export const priceMap: Partial<
  Record<`${CurrencySymbol}_${CurrencySymbol}`, [(ctx: Context, block: Block['header']) => Promise<bigint>, number]>
> = {
  ETH_WETH: [async () => 1_000_000_000_000_000_000n, 18],
  WETH_ETH: [async () => 1_000_000_000_000_000_000n, 18],
  ETH_ETH: [async () => 1_000_000_000_000_000_000n, 18],
  ETH_OETH: [getETHOETHPrice, 18],
  OETH_ETH: [getOETHETHPrice, 18],
  ...twoWay('MORPHO', 'ETH', getMorphoEthPrice, 18),
  ...twoWay('MORPHO_LEGACY', 'ETH', getMorphoEthPrice, 18),
  ...twoWay('ETH', 'sfrxETH', getStakedFraxPrice),
  ...twoWay('ETH', 'rETH', getRETHPrice),
  ...twoWay('ETH', 'frxETH', getFrxEthPrice),
  ...twoWay('wOETH', 'OETH', getPrice_wOETH_OETH),
  ...twoWay('OUSD', 'USD', getPrice_OUSD_USD),
  ...twoWay('OUSD', 'ETH', getPrice_OUSD_ETH),
  ...twoWay('ETH', 'stETH', (ctx, block) => getOethOraclePrice(ctx, block.height, 'stETH')),
  ...twoWay('OETH', 'USD', getPrice_OETH_USD),
  ...twoWay('ETH', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'ETH', 'USD'), 8),
  ...twoWay('WETH', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'ETH', 'USD'), 8),
  ...twoWay('DAI', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'DAI', 'USD'), 8),
  ...twoWay('USDC', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'USDC', 'USD'), 8),
  ...twoWay('USDT', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'USDT', 'USD'), 8),
  ...twoWay('USDS', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'USDS', 'USD'), 8),
  ...twoWay('ETH', 'USDS', (ctx, block) => getChainlinkPrice(ctx, block.height, 'ETH', 'USDS'), 8),
  ...twoWay('BAL', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'BAL', 'USD'), 8),
  ...derived(
    'BAL',
    'WETH',
    [
      { base: 'BAL', quote: 'USD' },
      { base: 'USD', quote: 'ETH' },
    ],
    18,
  ),
  ...derived(
    'DAI',
    'ETH',
    [
      { base: 'DAI', quote: 'USD' },
      { base: 'USD', quote: 'ETH' },
    ],
    8,
  ),
  ...derived(
    'MORPHO',
    'USDC',
    [
      { base: 'MORPHO', quote: 'ETH' },
      { base: 'ETH', quote: 'USDC' },
    ],
    18,
  ),
  ...derived(
    'MORPHO',
    'USDT',
    [
      { base: 'MORPHO', quote: 'ETH' },
      { base: 'ETH', quote: 'USDT' },
    ],
    18,
  ),
  ...derived(
    'MORPHO_LEGACY',
    'USDC',
    [
      { base: 'MORPHO', quote: 'ETH' },
      { base: 'ETH', quote: 'USDC' },
    ],
    18,
  ),
  ...derived(
    'MORPHO_LEGACY',
    'USDT',
    [
      { base: 'MORPHO', quote: 'ETH' },
      { base: 'ETH', quote: 'USDT' },
    ],
    18,
  ),
  ...twoWay('USDC', 'ETH', (ctx, block) => getChainlinkPrice(ctx, block.height, 'USDC', 'ETH')),
  ...twoWay('USDT', 'ETH', (ctx, block) => getChainlinkPrice(ctx, block.height, 'USDT', 'ETH')),
  ...twoWay('CRV', 'WETH', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CRV', 'ETH')),
  ...twoWay('CVX', 'WETH', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CVX', 'ETH')),
  ...twoWay('CRV', 'ETH', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CRV', 'ETH')),
  ...twoWay('CVX', 'ETH', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CVX', 'ETH')),
  ...twoWay('CVX', 'USD', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CVX', 'USD')),
  ...twoWay('CVX', 'DAI', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CVX', 'USD')),
  ...twoWay('CRV', 'DAI', (ctx, block) => getChainlinkPrice(ctx, block.height, 'CRV', 'USD')),
  ...twoWay('COMP', 'DAI', (ctx, block) => getChainlinkPrice(ctx, block.height, 'COMP', 'USD')),
}
