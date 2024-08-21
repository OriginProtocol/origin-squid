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

import { baseERC20s, baseStrategies, superOETHb } from './base'

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [
    // ...baseERC20s,
    // superOETHb,
    baseStrategies,
    // aerodromePool({
    //   ...baseAddresses.aerodrome['vAMM-WETH/OGN'].pool,
    //   gaugeAddress: baseAddresses.aerodrome['vAMM-WETH/OGN'].gauge.address,
    // }),
    // aerodromeGauge(baseAddresses.aerodrome['vAMM-WETH/OGN'].gauge),
    // aerodromePool({
    //   ...baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool,
    //   gaugeAddress: undefined, // baseAddresses.aerodrome['vAMM-OGN/superOETHb'].gauge.address,
    // }),
    // // aerodromeGauge(baseAddresses.aerodrome['vAMM-OGN/superOETHb'].gauge),
    // aerodromeCLPool(baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool),
    // // aerodromeCLGauge(baseAddresses.aerodrome['CL1-WETH/OETHb'].gauge),
    // aerodromeCLPool(baseAddresses.aerodrome['CL1-cbETH/WETH'].pool),
    // aerodromeCLGauge(baseAddresses.aerodrome['CL1-cbETH/WETH'].gauge),
    // aerodromeVoter({
    //   address: baseAddresses.aerodrome.voter,
    //   pools: [
    //     baseAddresses.aerodrome['vAMM-WETH/OGN'].pool.address,
    //     baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool.address,
    //     baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool.address,
    //     baseAddresses.aerodrome['CL1-cbETH/WETH'].pool.address,
    //   ],
    //   from: 15676793, // Should be the pools' lowest `from`
    // }),
    // // CL100-WETH/USDC
    // aerodromeCLPool(baseAddresses.aerodrome['CL100-WETH/USDC'].pool),
    // aerodromeCLGauge(baseAddresses.aerodrome['CL100-WETH/USDC'].gauge),
    // aerodromeLP({
    //   pool: baseAddresses.aerodrome['CL100-WETH/USDC'].pool.address,
    //   poolType: 'cl',
    //   account: '0x0d90e61805c101d88ddc614344274c0249b793ef', // Random Wallet with Positions
    //   from: baseAddresses.aerodrome['CL100-WETH/USDC'].pool.from,
    // }),
    // aerodromeLP({
    //   pool: baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool.address,
    //   poolType: 'amm',
    //   account: '0xfd9e6005187f448957a0972a7d0c0a6da2911236', // First Minter
    //   from: baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool.from,
    // }),
    // aerodromeLP({
    //   pool: baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool.address,
    //   poolType: 'cl',
    //   account: '0xfd9e6005187f448957a0972a7d0c0a6da2911236', // First Minter
    //   from: baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool.from,
    // }),
    // // TODO: I don't know if we need this one...
    // // aerodromeVoterEscrow({
    // //   address: '0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4',
    // //   from: 3200584,
    // // }),
  ],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
