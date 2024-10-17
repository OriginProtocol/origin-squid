import { arbitrum, base, mainnet } from 'viem/chains'

import { addresses } from './addresses'
import { arbitrumAddresses } from './addresses-arbitrum'
import { baseAddresses } from './addresses-base'

export const tokensByChain: Record<number, Record<string, string>> = {
  [mainnet.id]: addresses.tokens,
  [base.id]: baseAddresses.tokens,
  [arbitrum.id]: arbitrumAddresses.tokens,
}
