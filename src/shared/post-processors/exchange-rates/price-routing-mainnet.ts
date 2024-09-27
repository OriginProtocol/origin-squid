import { memoize } from 'lodash'

import * as balancerMetaStablePoolAbi from '@abi/balancer-meta-stable-pool'
import * as balancerRateProvider from '@abi/balancer-rate-provider'
import * as chainlinkFeedRegistry from '@abi/chainlink-feed-registry'
import * as curveLpToken from '@abi/curve-lp-token'
import * as diaOracleAbi from '@abi/dia-oracle'
import * as frxEthFraxOracle from '@abi/frx-eth-frax-oracle'
import * as oethOracleRouter from '@abi/oeth-oracle-router'
import * as stakedFraxEth from '@abi/sfrx-eth'
import * as woethAbi from '@abi/woeth'
import { Context } from '@processor'
import { CURVE_ETH_OETH_POOL_ADDRESS, STETH_ADDRESS } from '@utils/addresses'

import {
  CurrencySymbol,
  MainnetCurrency,
  MainnetCurrencyAddress,
  MainnetCurrencySymbol,
  mainnetCurrencies,
  mainnetCurrenciesByAddress,
} from './mainnetCurrencies'

export const getMainnetPrice = async (ctx: Context, height: number, base: MainnetCurrency, quote: MainnetCurrency) => {
  base = translateMainnetSymbol(base)
  quote = translateMainnetSymbol(quote)

  const priceEntry = priceMap[`${base}_${quote}`]
  if (priceEntry) {
    const [getPrice] = priceEntry
    return getPrice(ctx, height)
  }
  throw new Error(`No price for ${base}_${quote}`)
}

const getOETHETHPrice = async (ctx: Context, height: number) => {
  if (height < 17230232) return 10n ** 18n
  const contract = new curveLpToken.Contract(ctx, { height }, CURVE_ETH_OETH_POOL_ADDRESS)
  return await contract.get_dy(0n, 1n, 1000000000000000000n)
}

const getETHOETHPrice = async (ctx: Context, height: number) => {
  if (height < 17230232) return 10n ** 18n
  const contract = new curveLpToken.Contract(ctx, { height }, CURVE_ETH_OETH_POOL_ADDRESS)
  return await contract.get_dy(1n, 0n, 1000000000000000000n)
}

const getRETHPrice = async (ctx: Context, height: number) => {
  if (height < 13846138) return 0n
  // Balancer rETH Stable Pool Rate Provider
  const rateProvider = await getBalancePoolRateProviders(ctx, { height }, '0x1e19cf2d73a72ef1332c882f20534b6519be0276')
  // Balancer Vault `getPoolTokens` https://etherscan.io/address/0xba12222222228d8ba445958a75a0704d566bf2c8#readContract#F10
  const provider = new balancerRateProvider.Contract(
    ctx,
    { height },
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

const oethOracleCurrencies = new Set(['WETH', 'stETH', 'frxETH'])
const oethOracleAddress = '0xbE19cC5654e30dAF04AD3B5E06213D70F4e882eE'
const getOethOraclePrice = async (ctx: Context, height: number, quote: MainnetCurrency) => {
  if (height < 18032300) return 0n
  const router = new oethOracleRouter.Contract(ctx, { height }, oethOracleAddress)
  return router.price(mainnetCurrencies[quote as MainnetCurrencySymbol] ?? quote)
}

const stakedFraxAddress = '0xac3e018457b222d93114458476f3e3416abbe38f'
const getStakedFraxPrice = async (ctx: Context, height: number) => {
  if (height < 15686046) return 0n
  const router = new stakedFraxEth.Contract(ctx, { height }, stakedFraxAddress)
  return router.previewRedeem(1_000_000_000_000_000_000n)
}

const frxEthFraxOracleAddress = '0xC58F3385FBc1C8AD2c0C9a061D7c13b141D7A5Df'
const getFrxEthPrice = async (ctx: Context, height: number) => {
  // Deploy block of 17571367 doesn't work, so we wait until it is functional.
  if (height < 17571500) return 1_000_000_000_000_000_000n
  const frxEth = new frxEthFraxOracle.Contract(ctx, { height }, frxEthFraxOracleAddress)
  return frxEth.latestRoundData().then((lrd) => lrd.answer)
}

export const getBalancePoolRateProviders = memoize(
  async (ctx: Context, block: { height: number }, address: string) => {
    const pool = new balancerMetaStablePoolAbi.Contract(ctx, block, address)
    return await pool.getRateProviders()
  },
  (_ctx, _block, address) => address.toLowerCase(),
)

const getPrice_OUSD_USD = async (ctx: Context, height: number) => {
  if (height < 18071236) return 1_000_000_000_000_000_000n
  const diaOracle = new diaOracleAbi.Contract(ctx, { height }, '0xafa00e7eff2ea6d216e432d99807c159d08c2b79')
  return diaOracle.getValue('OUSD/USD').then((d) => d._0 * 10n ** 10n)
}

const getPrice_wOETH_OETH = async (ctx: Context, height: number) => {
  if (height < 17141658) return 1_000_000_000_000_000_000n
  const woeth = new woethAbi.Contract(ctx, { height }, mainnetCurrencies.wOETH)
  return woeth.previewRedeem(1_000_000_000_000_000_000n)
}

const getPrice_OUSD_ETH = async (ctx: Context, height: number) => {
  const ousdusd = await getPrice_OUSD_USD(ctx, height)
  const ethusd = await getChainlinkPrice(ctx, height, 'ETH', 'USD')
  if (!ethusd) return 0n
  return (ousdusd * 10n ** 8n) / ethusd
}

const getPrice_OETH_USD = async (ctx: Context, height: number) => {
  const ethusd = await getChainlinkPrice(ctx, height, 'ETH', 'USD')
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
    async (ctx: Context, height: number) => {
      const baseExponent = 10n ** BigInt(decimals)
      const rates = await Promise.all(connections.map(({ base, quote }) => getMainnetPrice(ctx, height, base, quote)))
      return rates.reduce((acc, rate) => (acc * rate) / baseExponent, baseExponent)
    },
    decimals,
  )
}
export const invertRate = (rate: bigint, decimals = 18) => (rate > 0n ? 10n ** BigInt(2 * decimals) / rate : 0n)
export const twoWay = <Base extends MainnetCurrencySymbol, Quote extends MainnetCurrencySymbol>(
  base: Base,
  quote: Quote,
  getPrice: (ctx: Context, height: number) => Promise<bigint>,
  decimals: number = 18,
) =>
  ({
    [`${base}_${quote}`]: [async (ctx: Context, height: number) => getPrice(ctx, height), decimals],
    [`${quote}_${base}`]: [
      async (ctx: Context, height: number) => getPrice(ctx, height).then((rate) => invertRate(rate, decimals)),
      decimals,
    ],
  }) as Record<`${Base}_${Quote}` | `${Quote}_${Base}`, [(ctx: Context, height: number) => Promise<bigint>, number]>

export const priceMap: Partial<
  Record<`${CurrencySymbol}_${CurrencySymbol}`, [(ctx: Context, height: number) => Promise<bigint>, number]>
> = {
  ETH_WETH: [async () => 1_000_000_000_000_000_000n, 18],
  WETH_ETH: [async () => 1_000_000_000_000_000_000n, 18],
  ETH_ETH: [async () => 1_000_000_000_000_000_000n, 18],
  ETH_OETH: [getETHOETHPrice, 18],
  OETH_ETH: [getOETHETHPrice, 18],
  ...twoWay('ETH', 'sfrxETH', getStakedFraxPrice),
  ...twoWay('ETH', 'rETH', getRETHPrice),
  ...twoWay('ETH', 'frxETH', getFrxEthPrice),
  ...twoWay('wOETH', 'OETH', getPrice_wOETH_OETH),
  ...twoWay('OUSD', 'USD', getPrice_OUSD_USD),
  ...twoWay('OUSD', 'ETH', getPrice_OUSD_ETH),
  ...twoWay('ETH', 'stETH', (ctx, height) => getOethOraclePrice(ctx, height, 'stETH')),
  ...twoWay('OETH', 'USD', getPrice_OETH_USD),
  ...twoWay('ETH', 'USD', (ctx, height) => getChainlinkPrice(ctx, height, 'ETH', 'USD'), 8),
  ...twoWay('DAI', 'USD', (ctx, height) => getChainlinkPrice(ctx, height, 'DAI', 'USD'), 8),
  ...twoWay('USDC', 'USD', (ctx, height) => getChainlinkPrice(ctx, height, 'USDC', 'USD'), 8),
  ...twoWay('USDT', 'USD', (ctx, height) => getChainlinkPrice(ctx, height, 'USDT', 'USD'), 8),
  ...derived(
    'DAI',
    'ETH',
    [
      { base: 'DAI', quote: 'USD' },
      { base: 'USD', quote: 'ETH' },
    ],
    8,
  ),
  ...twoWay('USDC', 'ETH', (ctx, height) => getChainlinkPrice(ctx, height, 'USDC', 'ETH')),
  ...twoWay('USDT', 'ETH', (ctx, height) => getChainlinkPrice(ctx, height, 'USDT', 'ETH')),
}
