import { compact } from 'lodash'
import { Between } from 'typeorm'

import { ExchangeRate } from '@model'
import { Block, Context } from '@processor'
import { useProcessorState } from '@utils/state'

import { Currency, currenciesByAddress } from './currencies'
import { getPrice } from './price-routing'

const useExchangeRates = (ctx: Context) =>
  useProcessorState(ctx, 'exchange-rates', new Map<string, ExchangeRate>())

export const process = async (ctx: Context) => {
  const [rates] = useExchangeRates(ctx)
  if (rates.size > 0) {
    ctx.log.debug({ count: rates.size }, 'exchange-rates')
    await ctx.store.upsert([...rates.values()])
  }
}

export const ensureExchangeRate = async (
  ctx: Context,
  block: Block,
  base: Currency,
  quote: Currency,
) => {
  if (currenciesByAddress[base.toLowerCase()])
    base = currenciesByAddress[base.toLowerCase()]
  if (currenciesByAddress[quote.toLowerCase()])
    quote = currenciesByAddress[quote.toLowerCase()]
  const [exchangeRates] = useExchangeRates(ctx)
  const pair = `${base}_${quote}`
  const blockNumber = block.header.height
  const id = `${blockNumber}:${pair}`
  let exchangeRate = exchangeRates.get(id)
  if (exchangeRate) return exchangeRate

  const timestamp = new Date(block.header.timestamp)
  const price = await getPrice(ctx, block.header.height, base, quote).catch(
    (err) => {
      ctx.log.info({ base, quote, err, message: err.message })
      throw err
    },
  )
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

export const ensureExchangeRatesAverages = async (
  ctx: Context,
  block: Block,
  from: Date,
  to: Date,
  pairs: [Currency, Currency][],
) => {
  return await Promise.all(
    pairs.map(([base, quote]) =>
      ensureExchangeRate(ctx, block, base, quote)
        .then((rate) => {
          if (!rate) return []
          return ctx.store
            .find(ExchangeRate, {
              where: { pair: rate?.pair, timestamp: Between(from, to) },
            })
            .then((rates) => rates.concat(rate!))
        })
        .then((rates) => {
          const pair = `${base}_${quote}`
          const rate =
            rates.reduce((sum, r) => sum + r.rate, 0n) / BigInt(rates.length)
          // ctx.log.info(
          //   `Created average exchange rate of ${rate} using ${rates.length} rates`,
          // )
          return new ExchangeRate({
            base: rates[0].base,
            quote: rates[0].quote,
            pair,
            rate,
          })
        }),
    ),
  )
}
