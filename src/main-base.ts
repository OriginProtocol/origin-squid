import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { run } from '@processor'
import { aerodromeCLGauge } from '@templates/aerodrome/cl-gauge'
import { aerodromeCLPool } from '@templates/aerodrome/cl-pool'
import { aerodromeGauge } from '@templates/aerodrome/gauge'
import { aerodromePool } from '@templates/aerodrome/pool'
import { aerodromeVoter } from '@templates/aerodrome/voter'
import { aerodromeVoterEscrow } from '@templates/aerodrome/voter-escrow'

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
    aerodromeCLPool({
      address: '0x565aecF84b5d30a6E79a5CEf3f0dA0Fc4280dEBC',
      from: 13901333,
    }),
    aerodromeCLGauge({
      address: '0x45F8b8eC9c92D09BA8495074436fD97073423041',
      from: 13903918,
    }),
    aerodromeVoter({
      address: '0x16613524e02ad97edfef371bc883f2f5d6c480a5',
      pools: ['0x8eA4C49B712217fd6e29Db920E3dd48287a0d50D', '0x565aecF84b5d30a6E79a5CEf3f0dA0Fc4280dEBC'],
      from: 15676793, // Should be the pools' lowest `from`
    }),
    // TODO: I don't know if we need this one...
    // aerodromeVoterEscrow({
    //   address: '0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4',
    //   from: 3200584,
    // }),
  ],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
