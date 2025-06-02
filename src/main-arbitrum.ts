import 'tsconfig-paths/register'
import { arbitrum } from 'viem/chains'

import { defineSquidProcessor } from '@originprotocol/squid-utils'
import { processStatus } from '@templates/processor-status/processor-status'
import { DEFAULT_FIELDS } from '@utils/batch-proccesor-fields'
import { initProcessorFromDump } from '@utils/dumps'

import { arbitrumERC20s } from './arbitrum'
import { ccip } from './oeth/processors/ccip'

export const processor = defineSquidProcessor({
  chainId: arbitrum.id,
  stateSchema: 'arbitrum-processor',
  processors: [arbitrumERC20s, ccip({ chainId: arbitrum.id })],
  postProcessors: [processStatus('arbitrum')],
  validators: [],
  fields: DEFAULT_FIELDS,
})
export default processor

if (require.main === module) {
  initProcessorFromDump(processor).catch((error) => {
    throw error
  })
}
