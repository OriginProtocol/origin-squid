import { arbitrum } from 'viem/chains'

import { transfers } from './arbitrum'
import { ccip } from './oeth/processors/ccip'
import { run } from './processor'

export const processor = {
  chainId: arbitrum.id,
  stateSchema: 'arbitrum-processor',
  processors: [transfers, ccip({ chainId: arbitrum.id })],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
