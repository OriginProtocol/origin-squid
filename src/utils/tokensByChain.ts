import { arbitrum, base, mainnet } from 'viem/chains'

import { addresses } from './addresses'
import { arbitrumAddresses } from './addresses-arbitrum'
import { baseAddresses } from './addresses-base'
import { sonicAddresses } from './addresses-sonic'
import { sonic } from './chains'

export const tokensByChain: Record<number, Record<string, string>> = {
  [mainnet.id]: addresses.tokens,
  [base.id]: baseAddresses.tokens,
  [arbitrum.id]: arbitrumAddresses.tokens,
  [sonic.id]: sonicAddresses.tokens,
}
