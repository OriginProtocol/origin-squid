import { arbitrum, base, mainnet, sonic } from 'viem/chains'

import { addresses } from './addresses'
import { arbitrumAddresses } from './addresses-arbitrum'
import { baseAddresses } from './addresses-base'
import { sonicAddresses } from './addresses-sonic'

export const tokensByChain: Record<number, Record<string, string>> = {
  [mainnet.id]: addresses.tokens,
  [base.id]: baseAddresses.tokens,
  [arbitrum.id]: arbitrumAddresses.tokens,
  [sonic.id]: sonicAddresses.tokens,
}
