import * as aerodromePricesAbi from '@abi/aerodrome-base-prices'
import { Block, Context } from '@processor'
import { baseAddresses } from '@utils/addresses-base'
import { cached } from '@utils/state'

const E18 = 10n ** 18n

export const getAerodromeRates = cached(
  (ctx: Context, block: Block, from: string, to: string) => `${block.header.height}:${from}:${to}`,
  async (ctx, block, from, to) => {
    const pricesContract = new aerodromePricesAbi.Contract(ctx, block.header, baseAddresses.aerodromeBasePrices)
    // For superOETHb and OGN there is currently no direct path to USDC - so we rate through WETH.
    if (from !== baseAddresses.WETH && to === baseAddresses.USDC) {
      return await pricesContract.getManyRatesWithConnectors(1, [from, baseAddresses.WETH, to]).then((rate) => rate[0])
    } else {
      return await pricesContract.getManyRatesWithConnectors(1, [from, to]).then((rate) => rate[0])
    }
  },
)

export const convertUsingRate = (value: bigint, rate: bigint) => (value * rate) / E18
export const convertRate = async (ctx: Context, block: Block, from: string, to: string, value: bigint) => {
  const rate = await getAerodromeRates(ctx, block, from, to)
  return convertUsingRate(value, rate)
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
