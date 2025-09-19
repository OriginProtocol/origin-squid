import { base as baseChain, mainnet, plumeMainnet, sonic } from 'viem/chains'

import { Block, Context } from '@originprotocol/squid-utils'
import { Currency, MainnetCurrency } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import {
  BaseCurrency,
  getBasePrice,
  translateBaseSymbol,
} from '@shared/post-processors/exchange-rates/price-routing-base'
import { getMainnetPrice, translateMainnetSymbol } from '@shared/post-processors/exchange-rates/price-routing-mainnet'

import { PlumeCurrency, getPlumePrice, translatePlumeSymbol } from './price-routing-plume'
import { SonicCurrency, getSonicPrice, translateSonicSymbol } from './price-routing-sonic'

export const getPrice = async (
  ctx: Context,
  block: Block['header'],
  base: Currency,
  quote: Currency,
): Promise<readonly [bigint, number] | undefined> => {
  if (ctx.chain.id === mainnet.id) {
    return getMainnetPrice(ctx, block, base as MainnetCurrency, quote as MainnetCurrency)
  }
  if (ctx.chain.id === baseChain.id) {
    return getBasePrice(ctx, block, base as BaseCurrency, quote as BaseCurrency)
  }
  if (ctx.chain.id === sonic.id) {
    return getSonicPrice(ctx, block, base as SonicCurrency, quote as SonicCurrency)
  }
  if (ctx.chain.id === plumeMainnet.id) {
    return getPlumePrice(ctx, block, base as PlumeCurrency, quote as PlumeCurrency)
  }

  throw new Error('Unsupported network')
}

export const translateSymbol = (ctx: Context, symbolOrAddress: Currency) => {
  if (ctx.chain.id === mainnet.id) {
    return translateMainnetSymbol(symbolOrAddress as MainnetCurrency)
  } else if (ctx.chain.id === baseChain.id) {
    return translateBaseSymbol(symbolOrAddress as BaseCurrency)
  } else if (ctx.chain.id === sonic.id) {
    return translateSonicSymbol(symbolOrAddress as SonicCurrency)
  } else if (ctx.chain.id === plumeMainnet.id) {
    return translatePlumeSymbol(symbolOrAddress as PlumeCurrency)
  }

  throw new Error('Unsupported network')
}
