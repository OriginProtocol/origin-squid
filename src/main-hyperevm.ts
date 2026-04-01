import 'tsconfig-paths/register'
import { hyperEvm } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import { createMorphoVaultApyProcessor } from '@templates/morpho/processor'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'

export const processor = defineSquidProcessor({
  chainId: hyperEvm.id as any, // cast needed until squid-utils adds HyperEVM to chainConfigs
  stateSchema: 'hyperevm-processor',
  processors: [
    createMorphoVaultApyProcessor({
      from: 31_029_000, // ~7 days before 2026-04-01
    }),
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