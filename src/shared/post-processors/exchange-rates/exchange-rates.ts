import { compact } from 'lodash'
import { LessThanOrEqual } from 'typeorm'

import { ExchangeRate, ExchangeRateDaily } from '@model'
import { Block, Context, useProcessorState } from '@originprotocol/squid-utils'
import { getPrice, translateSymbol } from '@shared/post-processors/exchange-rates/price-routing'
import { convertDecimals } from '@utils/utils'

import { Currency } from './mainnetCurrencies'

const useExchangeRates = (ctx: Context) => useProcessorState(ctx, 'exchange-rates', new Map<string, ExchangeRate>())
const useDailyExchangeRates = (ctx: Context) =>
  useProcessorState(ctx, 'exchange-rates-daily', new Map<string, ExchangeRateDaily>())

export const process = async (ctx: Context) => {
  const [rates] = useExchangeRates(ctx)
  if (rates.size > 0) {
    ctx.log.debug({ count: rates.size }, 'exchange-rates')
    await ctx.store.upsert([...rates.values()])
  }
  const [dailyRates] = useDailyExchangeRates(ctx)
  if (dailyRates.size > 0) {
    ctx.log.debug({ count: dailyRates.size }, 'exchange-rates-daily')
    await ctx.store.upsert([...dailyRates.values()])
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

/**
 * Apply an exchange rate to `value`.
 *
 * `rateDecimals` is the rate's own scale (`ExchangeRate.decimals`) — not every pair is
 * 18-decimal: `DAI_ETH` and `USDS_ETH` are 8, as is every `*_USD` pair.
 *
 * The result carries `value`'s decimals, because only the rate is divided out. Callers
 * writing an 18-decimal field must pass an 18-decimal `value` — see `convertRateTo18`.
 */
export const convertUsingRate = (value: bigint, rate: bigint, rateDecimals: number) =>
  (value * rate) / 10n ** BigInt(rateDecimals)

export const convertRate = async (ctx: Context, block: Block, from: Currency, to: Currency, value: bigint) => {
  if (from === to) return value
  const exchangeRate = await ensureExchangeRate(ctx, block, from, to)
  if (!exchangeRate) return 0n
  return convertUsingRate(value, exchangeRate.rate, exchangeRate.decimals)
}

/**
 * `convertRate` for a `value` that is not 18-decimal: normalizes the input first, so the
 * result is 18-decimal whatever the source token's scale.
 *
 * Anything writing an 18-decimal field must use this. `convertRate` alone returns the
 * converted amount still carrying `valueDecimals`, which silently understates every
 * 6-decimal asset by 1e12 and makes sums over mixed-decimal assets meaningless.
 */
export const convertRateTo18 = async (
  ctx: Context,
  block: Block,
  from: Currency,
  to: Currency,
  value: bigint,
  valueDecimals: number,
) => convertRate(ctx, block, from, to, convertDecimals(valueDecimals, 18, value))
