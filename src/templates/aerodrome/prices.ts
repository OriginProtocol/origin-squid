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

export const getPriceFromTick = (tick: number, decimals0: number = 18, decimals1: number = 18) => {
  return 1.0001 ** tick / 10 ** (decimals1 - decimals0)
}

export const getPriceFromSqrtPriceX96 = (sqrtPriceX96: bigint, decimals0: number = 18, decimals1: number = 18) => {
  return getPriceFromTick(getTickFromSqrtPriceX96(sqrtPriceX96), decimals0, decimals1)
}
