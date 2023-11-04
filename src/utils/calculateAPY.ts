import { formatEther } from 'viem'

export const calculateAPY = (
  from: Date,
  to: Date,
  fromAmount: bigint,
  toAmount: bigint,
) => {
  if (fromAmount === 0n || toAmount === 0n) {
    return { apr: 0, apy: 0 }
  }

  const diffTime = to.getTime() - from.getTime()
  const dayDiff = diffTime / (1000 * 60 * 60 * 24)

  const apr =
    (Number(formatEther(toAmount)) / Number(formatEther(fromAmount)) - 1) *
    (365.25 / dayDiff)
  const periods_per_year = 365.25 / Number(dayDiff)
  const apy = (1 + apr / periods_per_year) ** periods_per_year - 1

  if (apy > 1) {
    // console.log(
    //   {
    //     diffTime,
    //     dayDiff,
    //     apr,
    //     periods_per_year,
    //     apy,
    //     fromAmount: formatEther(fromAmount),
    //     toAmount: formatEther(toAmount),
    //   },
    //   'HIGH APY CALCULATION',
    // )
    // if (apy > 1000) {
    //   throw new Error('APY calculation is unrealistic')
    // }
  }
  return {
    apr: apr || 0,
    apy: apy || 0,
  }
}
