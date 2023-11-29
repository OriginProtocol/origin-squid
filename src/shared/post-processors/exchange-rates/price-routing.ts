import * as chainlinkFeedRegistry from '../../../abi/chainlink-feed-registry'
import * as eacAggregatorProxy from '../../../abi/eac-aggregator-proxy'
import * as frxEthFraxOracle from '../../../abi/frx-eth-frax-oracle'
import * as oethOracleRouter from '../../../abi/oeth-oracle-router'
import * as stakedFraxEth from '../../../abi/sfrx-eth'
import { Context } from '../../../processor'
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
  if (base === 'ETH' && oethOracleCurrencies.has(quote) && height >= 18032298) {
    return getOethOraclePrice(ctx, height, quote)
  }
  return getChainlinkPrice(ctx, height, base, quote)
}

const rETHRegistryAddress = '0x536218f9E9Eb48863970252233c8F271f554C2d0'
export const getRETHPrice = (ctx: Context, height: number) => {
  if (height < 16700133) return undefined
  const registry = new eacAggregatorProxy.Contract(
    ctx,
    { height },
    rETHRegistryAddress,
  )
  return registry.latestAnswer()
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
