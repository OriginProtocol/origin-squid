import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { run } from '@processor'
import { aerodromeCLGauge } from '@templates/aerodrome/cl-gauge'
import { aerodromeCLPool } from '@templates/aerodrome/cl-pool'
import { aerodromeGauge } from '@templates/aerodrome/gauge'
import { aerodromeLP } from '@templates/aerodrome/lp'
import { aerodromePool } from '@templates/aerodrome/pool'
import { aerodromeVoter } from '@templates/aerodrome/voter'
import { aerodromeVoterEscrow } from '@templates/aerodrome/voter-escrow'
import { baseAddresses } from '@utils/addresses-base'

import { baseERC20s, superOETHb } from './base'

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    ...baseERC20s,
    superOETHb,
    aerodromePool(baseAddresses.aerodrome['vAMM-WETH/OGN'].pool),
    aerodromeGauge(baseAddresses.aerodrome['vAMM-WETH/OGN'].gauge),
    aerodromePool(baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool),
    // aerodromeGauge(baseAddresses.aerodrome['vAMM-OGN/OETHb'].gauge),
    aerodromeCLPool(baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool),
    // aerodromeCLGauge(baseAddresses.aerodrome['CL1-WETH/OETHb'].gauge),
    aerodromeCLPool(baseAddresses.aerodrome['CL1-cbETH/WETH'].pool),
    aerodromeCLGauge(baseAddresses.aerodrome['CL1-cbETH/WETH'].gauge),
    aerodromeVoter({
      address: baseAddresses.aerodrome.voter,
      pools: [
        baseAddresses.aerodrome['vAMM-WETH/OGN'].pool.address,
        baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool.address,
        baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool.address,
        baseAddresses.aerodrome['CL1-cbETH/WETH'].pool.address,
      ],
      from: 15676793, // Should be the pools' lowest `from`
    }),
    aerodromeLP({
      address: '0x0d5cf17cd8ac6d45a01defac7adede953072d705', // Random Wallet with Positions
      from: 17000000,
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