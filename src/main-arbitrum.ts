import 'tsconfig-paths/register'
import { arbitrum } from 'viem/chains'
 
import { run } from '@processor'

import { erc20 } from './arbitrum'
import { ccip } from './oeth/processors/ccip'

export const processor = {
  chainId: arbitrum.id,
  stateSchema: 'arbitrum-processor',
  processors: [erc20, ccip({ chainId: arbitrum.id })],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
