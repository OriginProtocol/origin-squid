import 'tsconfig-paths/register'

import { chainConfigs, defineSquidProcessor, run } from '@originprotocol/squid-utils'
import { processStatus } from '@templates/processor-status'
import { createMorphoVaultApyProcessor } from '@templates/morpho/processor'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { hyperEvm } from 'viem/chains'

/**
 * Inject HyperEVM into chainConfigs so that defineSquidProcessor can use it.
 * This is necessary because @originprotocol/squid-utils only has mainnet, base,
 * arbitrum, sonic, etc. hardcoded. HyperEVM support will be added upstream.
 */
Object.assign(chainConfigs, {
  [hyperEvm.id]: {
    chain: hyperEvm,
    gateway: 'https://v2.archive.subsquid.io/network/hyperliquid-mainnet',
    endpoints: [process.env.RPC_HYPEREVM_ENDPOINT ?? 'https://rpc.hyperliquid.xyz/evm'],
  },
})

const FROM_BLOCK = 31_029_000 // ~7 days before 2026-04-01

export const processor = defineSquidProcessor({
  chainId: hyperEvm.id as any, // cast needed until squid-utils adds HyperEVM to chainConfigs
  stateSchema: 'hyperevm-processor',
  processors: [
    createMorphoVaultApyProcessor({ name: 'Morpho Vault APY - HyperEVM', from: FROM_BLOCK, chainId: hyperEvm.id }),
  ],
  postProcessors: [processStatus('hyperevm')],
  validators: [],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
