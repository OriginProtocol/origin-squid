import { Chain, defineChain } from 'viem'
import { base, mainnet } from 'viem/chains'

export const sonic = defineChain({
  id: 146,
  name: 'Sonic',
  network: 'sonic',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soniclabs.com'],
    },
    public: {
      http: ['https://rpc.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://sonicscan.org/',
    },
  },
})

// Export all chains
export const chains: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [sonic.id]: sonic,
}

// Export individual chains
export { base, mainnet }
