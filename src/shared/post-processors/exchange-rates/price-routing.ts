import * as chainlinkFeedRegistry from '../../../abi/chainlink-feed-registry'
import * as eacAggregatorProxy from '../../../abi/eac-aggregator-proxy'
import * as oethOracleRouter from '../../../abi/oeth-oracle-router'
import * as stakedFraxEth from '../../../abi/sfrx-eth'
import { Block, Context } from '../../../processor'
import { Currency, currencies } from './currencies'

export const getPrice = async (
  ctx: Context,
  block: Block,
  base: Currency,
  quote: Currency,
) => {
  if (base === 'ETH' && quote === 'WETH') {
    return 1_000_000_000_000_000_000n
  }
  if (base === 'ETH' && quote === 'sfrxETH') {
    return await getStakedFraxPrice(ctx, block)
  }
  if (base === 'ETH' && quote === 'rETH') {
    return await getRETHPrice(ctx, block)
  }
  if (base === 'ETH' && oethOracleCurrencies.has(quote)) {
    if (block.header.height < 18032298) return undefined
    return await getOethOraclePrice(ctx, block, quote)
  }
  return await getChainlinkPrice(ctx, block, base, quote)
}

const rETHRegistryAddress = '0x536218f9E9Eb48863970252233c8F271f554C2d0'
export const getRETHPrice = (ctx: Context, block: Block) => {
  if (block.header.height < 16700133) return undefined
  const registry = new eacAggregatorProxy.Contract(
    ctx,
    block.header,
    rETHRegistryAddress,
  )
  return registry.latestAnswer()
}

const registryAddress = '0x47fb2585d2c56fe188d0e6ec628a38b74fceeedf'
export const getChainlinkPrice = (
  ctx: Context,
  block: Block,
  base: Currency,
  quote: Currency,
) => {
  const registry = new chainlinkFeedRegistry.Contract(
    ctx,
    block.header,
    registryAddress,
  )
  return registry.latestAnswer(
    currencies[base] ?? base,
    currencies[quote] ?? quote,
  )
}

export const oethOracleCurrencies = new Set(['WETH', 'stETH', 'frxETH'])

const oethOracleAddress = '0xbE19cC5654e30dAF04AD3B5E06213D70F4e882eE'
export const getOethOraclePrice = (
  ctx: Context,
  block: Block,
  quote: Currency,
) => {
  const router = new oethOracleRouter.Contract(
    ctx,
    block.header,
    oethOracleAddress,
  )
  return router.price(currencies[quote] ?? quote)
}

const stakedFraxAddress = '0xac3e018457b222d93114458476f3e3416abbe38f'
export const getStakedFraxPrice = (ctx: Context, block: Block) => {
  if (block.header.height < 15686046) return undefined
  const router = new stakedFraxEth.Contract(
    ctx,
    block.header,
    stakedFraxAddress,
  )
  return router.previewRedeem(1_000_000_000_000_000_000n)
}