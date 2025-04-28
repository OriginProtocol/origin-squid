import { arbitrum, base, mainnet, plumeMainnet, sonic } from 'viem/chains'

import { mainnetTokens } from './addresses'
import { arbitrumTokens } from './addresses-arbitrum'
import { baseTokens } from './addresses-base'
import { plumeTokens } from './addresses-plume'
import { sonicTokens } from './addresses-sonic'

export const symbols = [
  ...Object.entries(mainnetTokens).map(([symbol, address]) => ({ chainId: mainnet.id, address, symbol })),
  ...Object.entries(baseTokens).map(([symbol, address]) => ({ chainId: base.id, address, symbol })),
  ...Object.entries(arbitrumTokens).map(([symbol, address]) => ({ chainId: arbitrum.id, address, symbol })),
  ...Object.entries(sonicTokens).map(([symbol, address]) => ({ chainId: sonic.id, address, symbol })),
  ...Object.entries(plumeTokens).map(([symbol, address]) => ({ chainId: plumeMainnet.id, address, symbol })),
]

export type TokenSymbol = (typeof symbols)[number]['symbol']
export type TokenAddress = (typeof symbols)[number]['address']

const addressSymbolMap = new Map(symbols.map((symbol) => [symbol.address, symbol.symbol]))
export const addressToSymbol = (address: TokenAddress) => {
  return addressSymbolMap.get(address)
}
