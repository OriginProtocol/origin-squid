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
