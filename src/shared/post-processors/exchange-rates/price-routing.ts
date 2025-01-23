import { base as baseChain, mainnet } from 'viem/chains'
import { sonic } from 'viem/chains'

import { Context } from '@originprotocol/squid-utils'
import { Currency, MainnetCurrency } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import {
  BaseCurrency,
  getBasePrice,
  translateBaseSymbol,
} from '@shared/post-processors/exchange-rates/price-routing-base'
import { getMainnetPrice, translateMainnetSymbol } from '@shared/post-processors/exchange-rates/price-routing-mainnet'

import { SonicCurrency, getSonicPrice, translateSonicSymbol } from './price-routing-sonic'

export const getPrice = async (ctx: Context, height: number, base: Currency, quote: Currency) => {
  if (ctx.chain.id === mainnet.id) {
    return getMainnetPrice(ctx, height, base as MainnetCurrency, quote as MainnetCurrency)
  }
  if (ctx.chain.id === baseChain.id) {
    return getBasePrice(ctx, height, base as BaseCurrency, quote as BaseCurrency)
  }
  if (ctx.chain.id === sonic.id) {
    return getSonicPrice(ctx, height, base as SonicCurrency, quote as SonicCurrency)
  }

  throw new Error('Unsupported network')
}

export const translateSymbol = (ctx: Context, symbolOrAddress: Currency) => {
  if (ctx.chain.id === 1) {
    return translateMainnetSymbol(symbolOrAddress as MainnetCurrency)
  } else if (ctx.chain.id === 8453) {
    return translateBaseSymbol(symbolOrAddress as BaseCurrency)
  } else if (ctx.chain.id === 146) {
    return translateSonicSymbol(symbolOrAddress as SonicCurrency)
  }

  throw new Error('Unsupported network')
}
