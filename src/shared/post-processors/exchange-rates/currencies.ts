import { invert, mapKeys } from 'lodash'

import { ExchangeRate } from '../../../model'

export const currencies = {
  USD: '0x0000000000000000000000000000000000000348', // Chainlink Denominations.USD
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Chainlink Denominations.ETH
  OETH: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  rETH: '0xae78736cd615f374d3085123a210448e74fc6393',
  frxETH: '0x5e8422345238f34275888049021821e8e08caa1f',
  sfrxETH: '0xac3e018457b222d93114458476f3e3416abbe38f',
  CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
} as const

export const currenciesByAddress = mapKeys(invert(currencies), (v, k) =>
  k.toLowerCase(),
) as Record<string, Currency>

const eth1 = 1000000000000000000n
export const convertRate = (
  rates: ExchangeRate[],
  base: Currency,
  quote: Currency,
  balance: bigint,
) => {
  base = currenciesByAddress[base.toLowerCase() as CurrencyAddress] ?? base
  quote = currenciesByAddress[quote.toLowerCase() as CurrencyAddress] ?? quote
  const rate = rates.find((r) => r.base === base && r.quote === quote)
  if (rate) {
    return (balance * rate.rate) / eth1
  } else {
    return 0n
  }
}

export type CurrencySymbol = keyof typeof currencies
export type CurrencyAddress = (typeof currencies)[keyof typeof currencies]

export type Currency = CurrencySymbol | CurrencyAddress
