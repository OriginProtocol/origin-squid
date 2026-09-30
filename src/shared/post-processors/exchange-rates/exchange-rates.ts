import { compact } from 'lodash'
import { LessThanOrEqual } from 'typeorm'

import { ExchangeRate, ExchangeRateDaily } from '@model'
import { Block, Context, useProcessorState } from '@originprotocol/squid-utils'
import { getPrice, translateSymbol } from '@shared/post-processors/exchange-rates/price-routing'

import { Currency } from './mainnetCurrencies'

const useExchangeRates = (ctx: Context) => useProcessorState(ctx, 'exchange-rates', new Map<string, ExchangeRate>())
const useDailyExchangeRates = (ctx: Context) =>
  useProcessorState(ctx, 'exchange-rates-daily', new Map<string, ExchangeRateDaily>())

// Several processors on the same chain upsert the same rows (e.g. os + sonic both write chain 146).
// Upserting in a stable id order makes every transaction lock rows in the same order, so they
// queue behind each other instead of deadlocking (40P01) and crash-looping the processor.
const byId = <T extends { id: string }>(a: T, b: T) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

export const process = async (ctx: Context) => {
  const [rates] = useExchangeRates(ctx)
  if (rates.size > 0) {
    ctx.log.debug({ count: rates.size }, 'exchange-rates')
    await ctx.store.upsert([...rates.values()].sort(byId))
  }
  const [dailyRates] = useDailyExchangeRates(ctx)
  if (dailyRates.size > 0) {
    ctx.log.debug({ count: dailyRates.size }, 'exchange-rates-daily')
    await ctx.store.upsert([...dailyRates.values()].sort(byId))
  }
}

export const ensureExchangeRate = async (ctx: Context, block: Block, base: Currency, quote: Currency) => {
  base = translateSymbol(ctx, base)
  quote = translateSymbol(ctx, quote)
  const [exchangeRates] = useExchangeRates(ctx)
  const pair = `${base}_${quote}`
  const blockNumber = block.header.height
  const id = `${ctx.chain.id}:${blockNumber}:${pair}`
  let exchangeRate = exchangeRates.get(id)
  if (exchangeRate) return exchangeRate

  const timestamp = new Date(block.header.timestamp)
  const price = await getPrice(ctx, block.header, base, quote).catch((err) => {
    ctx.log.info({ base, quote, err, message: err.message })
    throw err
  })
  if (!price) return

  exchangeRate = new ExchangeRate({
    id,
    chainId: ctx.chain.id,
    timestamp,
    blockNumber,
    pair,
    base,
    quote,
    rate: price[0],
    decimals: price[1],
  })
  exchangeRates.set(id, exchangeRate)

  const [dailyRates] = useDailyExchangeRates(ctx)
  const date = timestamp.toISOString().substring(0, 10)
  const dailyId = `${ctx.chain.id}:${date}:${pair}`
  dailyRates.set(
    dailyId,
    new ExchangeRateDaily({
      id: dailyId,
      chainId: ctx.chain.id,
      date,
      pair,
      base,
      quote,
      timestamp,
      blockNumber,
      rate: price[0],
      decimals: price[1],
    }),
  )

  return exchangeRate
}

export const ensureExchangeRates = async (ctx: Context, block: Block, pairs: [Currency, Currency][]) => {
  return await Promise.all(pairs.map(([base, quote]) => ensureExchangeRate(ctx, block, base, quote))).then(compact)
}

export const getLatestExchangeRateForDate = async (ctx: Context, pair: string, date: Date) => {
  return await ctx.store.findOne(ExchangeRate, {
    where: {
      chainId: ctx.chain.id,
      pair,
      timestamp: LessThanOrEqual(date),
    },
    order: {
      timestamp: 'desc',
    },
  })
}

const E18 = 10n ** 18n
export const convertUsingRate = (value: bigint, rate: bigint) => (value * rate) / E18
export const convertRate = async (ctx: Context, block: Block, from: Currency, to: Currency, value: bigint) => {
  if (from === to) return value
  const exchangeRate = await ensureExchangeRate(ctx, block, from, to)
  if (!exchangeRate) return 0n
  return convertUsingRate(value, exchangeRate.rate)
}
