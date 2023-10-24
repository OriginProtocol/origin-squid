export const calculateAPY = (
  from: Date,
  to: Date,
  fromAmount: bigint,
  toAmount: bigint,
) => {
  const diffTime = to.getTime() - from.getTime()
  const dayDiff = diffTime / (1000 * 60 * 60 * 24)

  const apr = (Number(toAmount) / Number(fromAmount) - 1) * (365.25 / dayDiff)
  const periods_per_year = 365.25 / Number(dayDiff)
  const apy = (1 + apr / periods_per_year) ** periods_per_year - 1

  return {
    apr,
    apy,
  }
}
