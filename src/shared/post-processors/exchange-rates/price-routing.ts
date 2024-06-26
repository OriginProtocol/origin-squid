import { memoize } from 'lodash'

import * as balancerMetaStablePoolAbi from '@abi/balancer-meta-stable-pool'
import * as balancerRateProvider from '@abi/balancer-rate-provider'
import * as chainlinkFeedRegistry from '@abi/chainlink-feed-registry'
import * as frxEthFraxOracle from '@abi/frx-eth-frax-oracle'
import * as oethOracleRouter from '@abi/oeth-oracle-router'
import * as stakedFraxEth from '@abi/sfrx-eth'
import * as woethAbi from '@abi/woeth'
import { Context } from '@processor'
import { STETH_ADDRESS } from '@utils/addresses'

import { Currency, CurrencySymbol, currencies } from './currencies'

export const getPrice = async (
  ctx: Context,
  height: number,
  base: Currency,
  quote: Currency,
) => {
  if (base === 'ETH' && quote === 'OETH') {
    return 1_005_000_000_000_000_000n
  }
  if (base === 'ETH' && quote === 'WETH') {
    return 1_000_000_000_000_000_000n
  }
  if (base === 'ETH' && quote === 'ETH') {
    return 1_000_000_000_000_000_000n
  }
  if (base === 'ETH' && quote === 'sfrxETH') {
    return getStakedFraxPrice(ctx, height)
  }
  if (base === 'ETH' && quote === 'rETH') {
    return getRETHPrice(ctx, height)
  }
  if (base === 'ETH' && quote === 'frxETH') {
    return getFrxEthPrice(ctx, height)
  }
  if (base === 'wOETH' && quote === 'OETH') {
    return getPrice_wOETH_OETH(ctx, height)
  }
  if (base === 'ETH' && oethOracleCurrencies.has(quote) && height >= 18032298) {
    return getOethOraclePrice(ctx, height, quote)
  }
  return getChainlinkPrice(ctx, height, base, quote)
}

export const getRETHPrice = async (ctx: Context, height: number) => {
  if (height < 13846138) return undefined
  // Balancer rETH Stable Pool Rate Provider
  const rateProvider = await getBalancePoolRateProviders(
    ctx,
    { height },
    '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
  )
  // Balancer Vault `getPoolTokens` https://etherscan.io/address/0xba12222222228d8ba445958a75a0704d566bf2c8#readContract#F10
  const provider = new balancerRateProvider.Contract(
    ctx,
    { height },
    rateProvider[0], // rETH Rate
  )
  return await provider.getRate()
}

const registryAddress = '0x47fb2585d2c56fe188d0e6ec628a38b74fceeedf'
export const getChainlinkPrice = async (
  ctx: Context,
  height: number,
  base: Currency,
  quote: Currency,
) => {
  const registry = new chainlinkFeedRegistry.Contract(
    ctx,
    { height },
    registryAddress,
  )
  try {
    base = currencies[base as CurrencySymbol] ?? base
    quote = currencies[quote as CurrencySymbol] ?? quote

    if (quote === STETH_ADDRESS) {
      // This registry if flipped.
      return await registry
        .latestAnswer(
          currencies[quote as CurrencySymbol] ?? quote,
          currencies[base as CurrencySymbol] ?? base,
        )
        // Invert so we get the proper direction.
        .then((result) => 1_000000000_000000000_000000000_000000000n / result)
    }

    return await registry.latestAnswer(
      currencies[base as CurrencySymbol] ?? base,
      currencies[quote as CurrencySymbol] ?? quote,
    )
  } catch (err: any) {
    if (err.message.match(/: Feed not found/)) {
      return 0n
    }
    throw err
  }
}

export const oethOracleCurrencies = new Set(['WETH', 'stETH', 'frxETH'])

const oethOracleAddress = '0xbE19cC5654e30dAF04AD3B5E06213D70F4e882eE'
export const getOethOraclePrice = (
  ctx: Context,
  height: number,
  quote: Currency,
) => {
  const router = new oethOracleRouter.Contract(
    ctx,
    { height },
    oethOracleAddress,
  )
  return router.price(currencies[quote as CurrencySymbol] ?? quote)
}

const stakedFraxAddress = '0xac3e018457b222d93114458476f3e3416abbe38f'
export const getStakedFraxPrice = (ctx: Context, height: number) => {
  if (height < 15686046) return undefined
  const router = new stakedFraxEth.Contract(ctx, { height }, stakedFraxAddress)
  return router.previewRedeem(1_000_000_000_000_000_000n)
}

const frxEthFraxOracleAddress = '0xC58F3385FBc1C8AD2c0C9a061D7c13b141D7A5Df'
export const getFrxEthPrice = (ctx: Context, height: number) => {
  // Deploy block of 17571367 doesn't work, so we wait until it is functional.
  if (height < 17571500) return 1_000_000_000_000_000_000n
  const frxEth = new frxEthFraxOracle.Contract(
    ctx,
    { height },
    frxEthFraxOracleAddress,
  )
  return frxEth.latestRoundData().then((lrd) => lrd.answer)
}

export const getBalancePoolRateProviders = memoize(
  async (ctx: Context, block: { height: number }, address: string) => {
    const pool = new balancerMetaStablePoolAbi.Contract(ctx, block, address)
    return await pool.getRateProviders()
  },
  (_ctx, _block, address) => address.toLowerCase(),
)

export const getPrice_wOETH_OETH = (ctx: Context, height: number) => {
  if (height < 17141658) return 1_000_000_000_000_000_000n
  const woeth = new woethAbi.Contract(ctx, { height }, currencies.wOETH)
  return woeth.previewRedeem(1_000_000_000_000_000_000n)
}
