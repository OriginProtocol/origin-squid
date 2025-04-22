import 'tsconfig-paths/register'
import { arbitrum } from 'viem/chains'

import { defineSquidProcessor, run } from '@originprotocol/squid-utils'
import { processStatus } from '@templates/processor-status/processor-status'
import { EXCLUDE_TX_RECEIPT_FIELDS } from '@utils/batch-proccesor-fields'

import { arbitrumERC20s } from './arbitrum'
import { ccip } from './oeth/processors/ccip'

export const processor = defineSquidProcessor({
  chainId: arbitrum.id,
  stateSchema: 'arbitrum-processor',
  processors: [arbitrumERC20s, ccip({ chainId: arbitrum.id })],
  postProcessors: [processStatus('arbitrum')],
  validators: [],
  fields: {
    transaction: {
      ...EXCLUDE_TX_RECEIPT_FIELDS,
    },
  },
})
export default processor

if (require.main === module) {
  run(processor).catch((error) => {
    throw error
  })
}
