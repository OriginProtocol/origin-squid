import { compact } from 'lodash'
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { base as baseChain, mainnet, sonic } from 'viem/chains'

import { ExchangeRate, ExchangeRateDaily } from '@model'
import { Block, Context, useProcessorState } from '@originprotocol/squid-utils'
import { getPrice, translateSymbol } from '@shared/post-processors/exchange-rates/price-routing'

import { Currency } from './mainnetCurrencies'

const useExchangeRates = (ctx: Context) => useProcessorState(ctx, 'exchange-rates', new Map<string, ExchangeRate>())
const useDailyExchangeRates = (ctx: Context) =>
  useProcessorState(ctx, 'exchange-rates-daily', new Map<string, ExchangeRateDaily>())
type DailyExchangeRatePair = {
  from: number
  pair: [Currency, Currency]
}

const DAILY_EXCHANGE_RATE_PAIRS: Partial<Record<number, DailyExchangeRatePair[]>> = {
  [mainnet.id]: [
    { from: 13_000_000, pair: ['ETH', 'USD'] },
    // USDe/USD oracle support starts at mainnet block 19,711,161.
    { from: 19_711_161, pair: ['USDe', 'USD'] },
  ],
  [baseChain.id]: [{ from: 16_586_878, pair: ['ETH', 'USD'] }],
  [sonic.id]: [
    { from: 3_394_366, pair: ['ETH', 'USD'] },
    { from: 4_189_824, pair: ['S', 'USD'] },
  ],
}

type OracleExchangeRate = {
  base: Currency
  quote: Currency
  pair: string
  timestamp: Date
  blockNumber: number
  rate: bigint
  decimals: number
}

const getOracleExchangeRate = async (
  ctx: Context,
  block: Block,
  base: Currency,
  quote: Currency,
): Promise<OracleExchangeRate | undefined> => {
  base = translateSymbol(ctx, base)
  quote = translateSymbol(ctx, quote)
  const pair = `${base}_${quote}`
  const blockNumber = block.header.height
  const timestamp = new Date(block.header.timestamp)
  const price = await getPrice(ctx, block.header, base, quote).catch((err) => {
    ctx.log.info({ base, quote, err, message: err.message })
    throw err
  })

  if (!price) return

  return {
    base,
    quote,
    pair,
    timestamp,
    blockNumber,
    rate: price[0],
    decimals: price[1],
  }
}

export const process = async (ctx: Context) => {
  const [dailyRates] = useDailyExchangeRates(ctx)
  const desiredPairs = DAILY_EXCHANGE_RATE_PAIRS[ctx.chain.id] ?? []
  if (desiredPairs.length > 0) {
    for (const block of ctx.frequencyBlocks) {
      const activePairs = desiredPairs
        .filter(({ from }) => block.header.height >= from)
        .map(({ pair }) => pair)
      if (activePairs.length > 0) {
        await ensureDailyExchangeRates(ctx, block, activePairs)
      }
    }
  }

  const [rates] = useExchangeRates(ctx)
  if (rates.size > 0) {
    ctx.log.debug({ count: rates.size }, 'exchange-rates')
    await ctx.store.upsert([...rates.values()])
  }
  if (dailyRates.size > 0) {
    ctx.log.debug({ count: dailyRates.size }, 'exchange-rates-daily')
    await ctx.store.upsert([...dailyRates.values()])
  }
}

export const ensureExchangeRate = async (ctx: Context, block: Block, base: Currency, quote: Currency) => {
  const [exchangeRates] = useExchangeRates(ctx)
  const exchangeRateData = await getOracleExchangeRate(ctx, block, base, quote)
  if (!exchangeRateData) return
  const { base: translatedBase, quote: translatedQuote, pair, blockNumber, timestamp, rate, decimals } = exchangeRateData
  const id = `${ctx.chain.id}:${blockNumber}:${pair}`
  let exchangeRate = exchangeRates.get(id)
  if (exchangeRate) return exchangeRate

  exchangeRate = new ExchangeRate({
    id,
    chainId: ctx.chain.id,
    timestamp,
    blockNumber,
    pair,
    base: translatedBase,
    quote: translatedQuote,
    rate,
    decimals,
  })
  exchangeRates.set(id, exchangeRate)
  return exchangeRate
}

export const ensureExchangeRates = async (ctx: Context, block: Block, pairs: [Currency, Currency][]) => {
  return await Promise.all(pairs.map(([base, quote]) => ensureExchangeRate(ctx, block, base, quote))).then(compact)
}

export const ensureDailyExchangeRate = async (ctx: Context, block: Block, base: Currency, quote: Currency) => {
  const exchangeRateData = await getOracleExchangeRate(ctx, block, base, quote)
  if (!exchangeRateData) return

  const { base: translatedBase, quote: translatedQuote, pair, timestamp, blockNumber, rate, decimals } = exchangeRateData
  const [dailyRates] = useDailyExchangeRates(ctx)
  const date = timestamp.toISOString().substring(0, 10)
  const id = `${ctx.chain.id}:${date}:${pair}`
  let dailyRate = dailyRates.get(id)
  if (!dailyRate) {
    dailyRate = new ExchangeRateDaily({
      id,
      chainId: ctx.chain.id,
      date,
      pair,
      base: translatedBase,
      quote: translatedQuote,
      timestamp,
      blockNumber,
      rate,
      decimals,
    })
  } else {
    dailyRate.timestamp = timestamp
    dailyRate.blockNumber = blockNumber
    dailyRate.rate = rate
    dailyRate.decimals = decimals
  }
  dailyRates.set(id, dailyRate)
  return dailyRate
}

export const ensureDailyExchangeRates = async (ctx: Context, block: Block, pairs: [Currency, Currency][]) => {
  return await Promise.all(pairs.map(([base, quote]) => ensureDailyExchangeRate(ctx, block, base, quote))).then(compact)
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

export const getDailyExchangeRates = async (
  ctx: Context,
  pair: string,
  range?: { from?: Date; to?: Date },
) => {
  let timestamp
  if (range?.from && range?.to) {
    timestamp = Between(range.from, range.to)
  } else if (range?.from) {
    timestamp = MoreThanOrEqual(range.from)
  } else if (range?.to) {
    timestamp = LessThanOrEqual(range.to)
  }

  return await ctx.store.find(ExchangeRateDaily, {
    where: {
      chainId: ctx.chain.id,
      pair,
      ...(timestamp ? { timestamp } : {}),
    },
    order: {
      timestamp: 'asc',
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
