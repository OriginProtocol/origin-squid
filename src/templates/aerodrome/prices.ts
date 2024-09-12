import { Block, Context } from '@processor'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { BaseCurrency } from '@shared/post-processors/exchange-rates/price-routing-base'

const E18 = 10n ** 18n

export const convertUsingRate = (value: bigint, rate: bigint) => (value * rate) / E18
export const convertRate = async (ctx: Context, block: Block, from: BaseCurrency, to: BaseCurrency, value: bigint) => {
  const exchangeRate = await ensureExchangeRate(ctx, block, from, to)
  if (!exchangeRate) return 0n
  return convertUsingRate(value, exchangeRate.rate)
}

export const getTickFromSqrtPriceX96 = (sqrtPriceX96: bigint) => {
  const Q96 = 2n ** 96n
  return Math.floor(Math.log((Number(sqrtPriceX96) / Number(Q96)) ** 2) / Math.log(1.0001))
}

export const getPriceFromTick = (tick: number) => {
  return 1.0001 ** tick / 10 ** 18
}

export const getPriceFromSqrtPriceX96 = (sqrtPriceX96: bigint): number => {
  const Q96 = BigInt(2 ** 96)
  const sqrtPrice = Number(sqrtPriceX96) / Number(Q96)
  return sqrtPrice * sqrtPrice
}

export const getPriceFromSqrtPriceX96N = (sqrtPriceX96: bigint): bigint => {
  const Q96 = BigInt(2 ** 96)
  const sqrtPrice = (sqrtPriceX96 * 10n ** 18n) / Q96
  return (sqrtPrice * sqrtPrice) / 10n ** 18n
}
