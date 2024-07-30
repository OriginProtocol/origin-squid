import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { run } from '@processor'

import { baseERC20s } from './base'

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [baseERC20s],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
