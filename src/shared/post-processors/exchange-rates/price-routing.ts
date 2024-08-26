import { base as baseChain, mainnet } from 'viem/chains'

import { Context } from '@processor'
import { Currency, MainnetCurrency } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { BaseCurrency, getBasePrice } from '@shared/post-processors/exchange-rates/price-routing-base'
import { getMainnetPrice } from '@shared/post-processors/exchange-rates/price-routing-mainnet'

export const getPrice = async (ctx: Context, height: number, base: Currency, quote: Currency) => {
  if (ctx.chain.id === mainnet.id) {
    return getMainnetPrice(ctx, height, base as MainnetCurrency, quote as MainnetCurrency)
  }
  if (ctx.chain.id === baseChain.id) {
    return getBasePrice(ctx, height, base as BaseCurrency, quote as BaseCurrency)
  }

  throw new Error('Unsupported network')
}
