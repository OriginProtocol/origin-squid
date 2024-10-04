import { formatEther, formatUnits } from 'viem'

export const calculateAPY = (from: Date, to: Date, fromAmount: bigint, toAmount: bigint) => {
  if (fromAmount === 0n || toAmount === 0n) {
    return { apr: 0, apy: 0 }
  }

  const diffTime = to.getTime() - from.getTime()
  const dayDiff = diffTime / (1000 * 60 * 60 * 24)

  const apr = (Number(formatEther(toAmount)) / Number(formatEther(fromAmount)) - 1) * (365.25 / dayDiff)
  const periods_per_year = 365.25 / Number(dayDiff)
  const apy = (1 + apr / periods_per_year) ** periods_per_year - 1

  return {
    apr: apr || 0,
    apy: apy || 0,
  }
}

export const convertApyToApr = (apy: number, compoundingPeriods: number = 365.25): number => {
  return compoundingPeriods * (Math.pow(1 + apy, 1 / compoundingPeriods) - 1)
}

export const calculateAPY2 = (fromAmount: bigint, toAmount: bigint) => {
  return +formatUnits(((toAmount - fromAmount) * 10n ** 18n) / fromAmount, 18)
}

export const calculateAPR = (from: Date, to: Date, fromAmount: bigint, toAmount: bigint): number => {
  if (fromAmount === 0n || toAmount === 0n) {
    return 0
  }

  const diffTime = to.getTime() - from.getTime()
  const yearFraction = diffTime / (1000 * 60 * 60 * 24 * 365.25)

  const growth = Number(formatEther(toAmount)) / Number(formatEther(fromAmount)) - 1
  const apr = growth / yearFraction

  return apr
}
