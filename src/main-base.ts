import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { run } from '@processor'
import { aerodromeCLGauge } from '@templates/aerodrome/cl-gauge'
import { aerodromeCLPool } from '@templates/aerodrome/cl-pool'
import { aerodromeGauge } from '@templates/aerodrome/gauge'
import { aerodromePool } from '@templates/aerodrome/pool'
import { aerodromeVoter } from '@templates/aerodrome/voter'
import { aerodromeVoterEscrow } from '@templates/aerodrome/voter-escrow'
import { baseAddresses } from '@utils/addresses-base'

import { baseERC20s } from './base'

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    baseERC20s,
    aerodromePool(baseAddresses.aerodrome['vAMM-WETH/OGN'].pool),
    aerodromeGauge(baseAddresses.aerodrome['vAMM-WETH/OGN'].gauge),
    aerodromePool(baseAddresses.aerodrome['vAMM-OGN/OETHb'].pool),
    // aerodromeGauge(baseAddresses.aerodrome['vAMM-OGN/OETHb'].gauge),
    aerodromeCLPool(baseAddresses.aerodrome['CL1-WETH/OETHb'].pool),
    // aerodromeCLGauge(baseAddresses.aerodrome['CL1-WETH/OETHb'].gauge),
    aerodromeCLPool(baseAddresses.aerodrome['CL1-cbETH/WETH'].pool),
    aerodromeCLGauge(baseAddresses.aerodrome['CL1-cbETH/WETH'].gauge),
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