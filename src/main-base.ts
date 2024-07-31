import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { run } from '@processor'
import { aerodromeGauge } from '@templates/aerodrome/gauge'
import { aerodromePool } from '@templates/aerodrome/pool'
import { aerodromeVoter } from '@templates/aerodrome/voter'

import { baseERC20s } from './base'

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    baseERC20s,
    aerodromePool({
      address: '0x8eA4C49B712217fd6e29Db920E3dd48287a0d50D',
      from: 15676793,
    }),
    aerodromeGauge({
      address: '0xA88BcfEcC886dEA1e8B3108179F0532d53c8c055',
      from: 16014718,
    }),
    aerodromeVoter({
      address: '0x16613524e02ad97edfef371bc883f2f5d6c480a5',
      pools: ['0x8eA4C49B712217fd6e29Db920E3dd48287a0d50D'],
      from: 15676793, // Should be the pools' lowest `from`
    }),
  ],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
