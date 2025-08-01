import { invertMap } from '@originprotocol/squid-utils'
import {
  BaseCurrencyAddress,
  BaseCurrencySymbol,
  baseCurrenciesByAddress,
} from '@shared/post-processors/exchange-rates/price-routing-base'

import { PlumeCurrencyAddress, PlumeCurrencySymbol } from './price-routing-plume'
import { SonicCurrencyAddress, SonicCurrencySymbol } from './price-routing-sonic'

export const mainnetCurrencies = {
  USD: '0x0000000000000000000000000000000000000348', // Chainlink Denominations.USD
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  USDS: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // Chainlink Denominations.ETH
  OETH: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
  OUSD: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
  wOETH: '0xdcee70654261af21c44c093c300ed3bb97b78192',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  rETH: '0xae78736cd615f374d3085123a210448e74fc6393',
  frxETH: '0x5e8422345238f34275888049021821e8e08caa1f',
  sfrxETH: '0xac3e018457b222d93114458476f3e3416abbe38f',
  CRV: '0xd533a949740bb3306d119cc777fa900ba034cd52',
  CVX: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
  BAL: '0xba100000625a3754423978a60c9317c58a424e3d',
  MORPHO: '0x58d97b57bb95320f9a05dc918aef65434969c2b2',
  MORPHO_LEGACY: '0x9994e35db50125e0df82e4c2dde62496ce330999',
} as const

export const mainnetCurrenciesByAddress = invertMap(mainnetCurrencies)

export const currenciesByAddress = {
  ...mainnetCurrenciesByAddress,
  ...baseCurrenciesByAddress,
} as const

export type MainnetCurrencySymbol = keyof typeof mainnetCurrencies
export type MainnetCurrencyAddress = (typeof mainnetCurrencies)[keyof typeof mainnetCurrencies]

export type MainnetCurrency = MainnetCurrencySymbol | MainnetCurrencyAddress

export type CurrencySymbol = MainnetCurrencySymbol | BaseCurrencySymbol | SonicCurrencySymbol | PlumeCurrencySymbol
export type CurrencyAddress = MainnetCurrencyAddress | BaseCurrencyAddress | SonicCurrencyAddress | PlumeCurrencyAddress

export type Currency = CurrencySymbol | CurrencyAddress
