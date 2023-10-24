import { formatEther } from 'viem'

const eth1 = 1000000000000000000n
const aprDays = 365250000000000000000n

export const calculateAPY = (
  from: Date,
  to: Date,
  fromAmount: bigint,
  toAmount: bigint,
) => {
  const diffTime = BigInt(to.getTime() - from.getTime())
  const dayDiff = (diffTime * eth1) / 86400000n

  const apr =
    (((toAmount * eth1) / fromAmount - eth1) * ((aprDays * eth1) / dayDiff)) /
    eth1
  const periods_per_year = (aprDays * eth1) / dayDiff
  const apy =
    (1 + Number(formatEther((apr * eth1) / periods_per_year))) **
      Number(formatEther(periods_per_year)) -
    1

  return {
    apr,
    apy,
    aprDecimal: Number(formatEther(apr)),
    apyDecimal: apy,
  }
}

/**
 * WARNING: Less reproducible results.
 */
export const calculateAPYFloat = (
  from: Date,
  to: Date,
  fromAmount: bigint,
  toAmount: bigint,
) => {
  const diffTime = to.getTime() - from.getTime()
  const dayDiff = diffTime / (1000 * 60 * 60 * 24)

  const apr = (Number(toAmount) / Number(fromAmount) - 1) * (365.25 / dayDiff)
  const periods_per_year = 365.25 / Number(dayDiff)
  console.log(periods_per_year)
  const apy = (1 + apr / periods_per_year) ** periods_per_year - 1

  return {
    apr,
    apy,
  }
}

if (require.main === module) {
  console.log(
    calculateAPYFloat(
      new Date('2023-01-01'),
      new Date('2023-02-01'),
      100n,
      125n,
    ),
  )
  console.log(
    calculateAPY(new Date('2023-01-01'), new Date('2023-02-01'), 100n, 125n),
  )
}
