import 'tsconfig-paths/register'
import { arbitrum } from 'viem/chains'

import { defineSquidProcessor, run } from '@processor'

import { arbitrumERC20s } from './arbitrum'
import { ccip } from './oeth/processors/ccip'

export const processor = defineSquidProcessor({
  chainId: arbitrum.id,
  stateSchema: 'arbitrum-processor',
  processors: [arbitrumERC20s, ccip({ chainId: arbitrum.id })],
  postProcessors: [],
  validators: [],
})
export default processor

if (require.main === module) {
  run(processor)
}
