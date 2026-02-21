import { superOETHb } from 'oethb/super-oeth-b'
import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import * as exchangeRatesPostProcessor from '@shared/post-processors/exchange-rates'
import { processStatus } from '@templates/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { initProcessorFromDump } from '@utils/dumps'

export const processor = defineSquidProcessor({
  chainId: base.id,
  stateSchema: 'oethb-processor',
  processors: [...superOETHb],
  postProcessors: [exchangeRatesPostProcessor, processStatus('oethb')],
  validators: [],
  fields: DEFAULT_FIELDS,
})

export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
