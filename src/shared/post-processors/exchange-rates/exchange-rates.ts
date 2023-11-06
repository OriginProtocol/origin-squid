import { compact } from 'lodash'

import { ExchangeRate } from '../../../model'
import { Block, Context } from '../../../processor'
import { useProcessorState } from '../../../utils/state'
import { Currency, currenciesByAddress } from './currencies'
import { getPrice } from './price-routing'

const useExchangeRates = (ctx: Context) =>
  useProcessorState(ctx, 'exchange-rates', new Map<string, ExchangeRate>())

export const process = async (ctx: Context) => {
  const [rates] = useExchangeRates(ctx)
  if (rates.size > 0) {
    ctx.log.debug({ count: rates.size }, 'exchange-rates')
    await ctx.store.insert([...rates.values()])
  }
}

export const ensureExchangeRate = async (
  ctx: Context,
  block: Block,
  base: Currency,
  quote: Currency,
) => {
  if (currenciesByAddress[base]) base = currenciesByAddress[base]
  if (currenciesByAddress[quote]) quote = currenciesByAddress[quote]
  const [exchangeRates] = useExchangeRates(ctx)
  const pair = `${base}_${quote}`
  const blockNumber = block.header.height
  const id = `${blockNumber}:${pair}`
  let exchangeRate = exchangeRates.get(id)
  if (exchangeRate) return exchangeRate

  const timestamp = new Date(block.header.timestamp)
  const price = await getPrice(ctx, block, base, quote).catch((err) => {
    ctx.log.info({ base, quote, err, message: err.message })
    throw err
  })
  if (price) {
    exchangeRate = new ExchangeRate({
      id,
      timestamp,
      blockNumber,
      pair,
      base,
      quote,
      rate: price,
    })
    exchangeRates.set(id, exchangeRate)
  }
  return exchangeRate
}

export const ensureExchangeRates = async (
  ctx: Context,
  block: Block,
  pairs: [Currency, Currency][],
) => {
  return await Promise.all(
    pairs.map(([base, quote]) => ensureExchangeRate(ctx, block, base, quote)),
  ).then(compact)
}
