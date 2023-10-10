import { ExchangeRate } from '../../model'
import { Block, Context } from '../../processor'
import { useProcessorState } from '../../utils/state'
import { Currency } from './currencies'
import { getPrice } from './price-routing'

const useExchangeRates = () =>
  useProcessorState('exchange-rates', new Map<string, ExchangeRate>())

export const process = async (ctx: Context) => {
  const [rates] = useExchangeRates()
  await ctx.store.insert([...rates.values()])
}

export const ensureExchangeRate = async (
  ctx: Context,
  block: Block,
  base: Currency,
  quote: Currency,
) => {
  const [exchangeRates] = useExchangeRates()
  const pair = `${base}_${quote}`
  const blockNumber = block.header.height
  const id = `${blockNumber}:${pair}`
  let exchangeRate = exchangeRates.get(id)
  if (exchangeRate) return

  const timestamp = new Date(block.header.timestamp)
  const price = await getPrice(ctx, block, base, quote).catch((err) => {
    ctx.log.info({ base, quote, err })
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
}

export const ensureExchangeRates = async (
  ctx: Context,
  block: Block,
  pairs: [Currency, Currency][],
) => {
  await Promise.all(
    pairs.map(([base, quote]) => ensureExchangeRate(ctx, block, base, quote)),
  )
}
