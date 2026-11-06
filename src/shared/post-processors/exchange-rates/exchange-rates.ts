import { compact } from 'lodash'
import { LessThanOrEqual } from 'typeorm'

import { ExchangeRate, ExchangeRateDaily } from '@model'
import { Block, Context, useProcessorState } from '@originprotocol/squid-utils'
import { getPrice, translateSymbol } from '@shared/post-processors/exchange-rates/price-routing'

import { Currency } from './mainnetCurrencies'

const useExchangeRates = (ctx: Context) => useProcessorState(ctx, 'exchange-rates', new Map<string, ExchangeRate>())
const useDailyExchangeRates = (ctx: Context) =>
  useProcessorState(ctx, 'exchange-rates-daily', new Map<string, ExchangeRateDaily>())

// Stable id order makes concurrent writers lock rows in the same order, so they queue
// instead of deadlocking (40P01).
const byId = <T extends { id: string }>(a: T, b: T) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

/**
 * Pairs that more than one processor on the same chain computes, mapped to the one
 * processor (its `processStatus` id) that persists them. The others still compute the
 * rate in memory for their own entities; they just do not upsert it. Two processes
 * upserting the same ids in long catch-up transactions otherwise wait on each other's
 * row locks until `statement_timeout` and restart.
 *
 * Pairs not listed here are persisted by whichever processor computes them. Owners are
 * the processors that write the pair most often, so the fewest rows are dropped.
 */
const PAIR_OWNERS: Record<number, Record<string, string>> = {
  1: {
    ETH_USD: 'mainnet', // mainnet/processors/exchange-rates.ts exists for this pair
    WETH_ETH: 'oeth', // OETH strategies; mainnet only for the WETH ARMs
    USDC_USD: 'ousd', // OUSD strategies; mainnet only for the USDC ARM
    USDC_ETH: 'ousd',
    // Also computed by mainnet's OGN buybacks when a buyback sells the token.
    OETH_USD: 'oeth', // read back by protocol-sql-simple.ts
    OUSD_USD: 'ousd',
    DAI_USD: 'ousd',
    USDT_USD: 'ousd',
    USDS_USD: 'ousd',
  },
  8453: {
    ETH_USD: 'base',
    superOETHb_USD: 'base',
  },
  146: {
    S_USD: 'sonic',
    S_ETH: 'sonic',
  },
}

const isPersistedBy = (processorId: string) => (rate: { chainId: number; pair: string }) => {
  const owner = PAIR_OWNERS[rate.chainId]?.[rate.pair]
  return owner === undefined || owner === processorId
}

/** Post-processor that persists the rates this processor owns (see `PAIR_OWNERS`). */
export const createExchangeRatesPostProcessor = (processorId: string) => {
  const persisted = isPersistedBy(processorId)
  return {
    async process(ctx: Context) {
      const [rates] = useExchangeRates(ctx)
      const toUpsert = [...rates.values()].filter(persisted).sort(byId)
      if (toUpsert.length > 0) {
        ctx.log.debug({ count: toUpsert.length, skipped: rates.size - toUpsert.length }, 'exchange-rates')
        await ctx.store.upsert(toUpsert)
      }
      const [dailyRates] = useDailyExchangeRates(ctx)
      const dailyToUpsert = [...dailyRates.values()].filter(persisted).sort(byId)
      if (dailyToUpsert.length > 0) {
        ctx.log.debug({ count: dailyToUpsert.length }, 'exchange-rates-daily')
        await ctx.store.upsert(dailyToUpsert)
      }
    },
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
