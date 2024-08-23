import { minBy } from 'lodash'
import 'tsconfig-paths/register'
import { base } from 'viem/chains'

import { Processor, run } from '@processor'
import { aerodromeCLGauge } from '@templates/aerodrome/cl-gauge'
import { aerodromeCLPool } from '@templates/aerodrome/cl-pool'
import { aerodromeGauge } from '@templates/aerodrome/gauge'
import { aerodromeLP } from '@templates/aerodrome/lp'
import { aerodromePool } from '@templates/aerodrome/pool'
import { aerodromeVoter } from '@templates/aerodrome/voter'
import { PoolDefinition, aerodromePools, baseAddresses } from '@utils/addresses-base'

import { baseERC20s, baseStrategies, bridgedWoethStrategy, superOETHb } from './base'

const pools: PoolDefinition[] = [
  aerodromePools['vAMM-WETH/OGN'],
  aerodromePools['vAMM-OGN/superOETHb'],
  aerodromePools['CL1-WETH/superOETHb'],
  aerodromePools['CL1-cbETH/WETH'],
  aerodromePools['CL100-WETH/USDC'],
]

const aerodromeProcessors = pools
  .flatMap((pool) => {
    const processors: Processor[] = []
    if (pool.type == 'amm') {
      processors.push(aerodromePool(pool))
      if (pool.gauge) {
        processors.push(aerodromeGauge(pool.gauge))
      }
    }
    if (pool.type == 'cl') {
      processors.push(aerodromeCLPool(pool))
      if (pool.gauge) {
        processors.push(aerodromeCLGauge(pool.gauge))
      }
    }
    if (pool.lps?.length > 0) {
      aerodromeLP(pool)
    }

    return processors
  })
  .concat([
    aerodromeVoter({
      address: baseAddresses.aerodrome.voter,
      pools: pools.map((p) => p.address),
      from: Math.min(...pools.map((p) => p.from)), // Should be the pools' lowest `from`
    }),
    // TODO: I don't think we need this one...
    // aerodromeVoterEscrow({
    //   address: '0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4',
    //   from: 3200584,
    // }),
  ])

export const processor = {
  chainId: base.id,
  stateSchema: 'base-processor',
  processors: [...baseERC20s, superOETHb, baseStrategies, bridgedWoethStrategy, ...aerodromeProcessors],
  postProcessors: [],
  validators: [],
}
export default processor

if (require.main === module) {
  run(processor)
}
