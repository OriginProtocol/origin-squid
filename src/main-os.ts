import { OS } from 'sonic/os'
import 'tsconfig-paths/register'
import { sonic } from 'viem/chains'

import { defineSquidProcessor } from '@originprotocol/squid-utils'
import { createExchangeRatesPostProcessor } from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { initProcessorFromDump } from '@utils/dumps'

export const processor = defineSquidProcessor({
  chainId: sonic.id,
  stateSchema: 'os-processor',
  processors: [...OS],
  postProcessors: [createExchangeRatesPostProcessor('os'), processStatus('os')],
  validators: [],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  initProcessorFromDump(processor).catch((error) => {
    throw error
  })
}
