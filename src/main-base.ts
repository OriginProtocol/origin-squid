import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { run } from '@processor'
import { aerodromePool } from '@templates/aerodrome/pool'

import { baseERC20s } from './base'

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    // baseERC20s,
    aerodromePool({ address: '0x8eA4C49B712217fd6e29Db920E3dd48287a0d50D', from: 15676793 }),
  ],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
