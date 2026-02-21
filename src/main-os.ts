import { OS } from 'sonic/os'
import 'tsconfig-paths/register'
import { sonic } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { initProcessorFromDump } from '@utils/dumps'

export const processor = defineSquidProcessor({
  chainId: sonic.id,
  stateSchema: 'os-processor',
  processors: [...OS],
  postProcessors: [exchangeRatesPostProcessor, processStatus('os')],
  validators: [],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
