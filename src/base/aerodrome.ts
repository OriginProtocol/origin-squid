import * as aerodromeCLPoolFactoryAbi from '@abi/aerodrome-cl-pool-factory'
import * as aerodromeGaugeAbi from '@abi/aerodrome-gauge'
import * as aerodromePoolFactoryAbi from '@abi/aerodrome-pool-factory'
import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import { AeroCLPoolCreated, AeroGaugeNotifyReward, AeroPoolCreated, AeroVoterGaugeCreated } from '@model'
import { Processor } from '@originprotocol/squid-utils'
import { aerodromeCLGauge } from '@templates/aerodrome/cl-gauge'
import { aerodromeGauge } from '@templates/aerodrome/gauge'
import { aerodromeLP } from '@templates/aerodrome/lp'
import { aerodromePool } from '@templates/aerodrome/pool'
import { createEventProcessor } from '@templates/events/createEventProcessor'
import { PoolDefinition, aerodromePools, baseAddresses } from '@utils/addresses-base'

const pools: PoolDefinition[] = [
  aerodromePools['vAMM-WETH/OGN'],
  aerodromePools['vAMM-OGN/superOETHb'],
  aerodromePools['CL1-WETH/superOETHb'],
  // aerodromePools['CL1-cbETH/WETH'],
  // aerodromePools['CL100-WETH/USDC'],
]

export const aerodromeProcessors = pools
  .flatMap((pool) => {
    const processors: Processor[] = []
    if (pool.type == 'amm') {
      processors.push(aerodromePool(pool))
      if (pool.gauge) {
        processors.push(aerodromeGauge(pool.gauge))
      }
    }
    if (pool.type == 'cl') {
      if (pool.gauge) {
        processors.push(aerodromeCLGauge(pool.gauge))
      }
    }
    if (pool.lps?.length > 0) {
      processors.push(...aerodromeLP(pool))
    }

    return processors
  })
  .concat([
    createEventProcessor({
      event: aerodromeGaugeAbi.events.NotifyReward,
      from: 3200584,
      mapEntity: (ctx, block, log, decoded) => {
        return new AeroGaugeNotifyReward({
          id: `${ctx.chain.id}:${log.id}`,
          chainId: ctx.chain.id,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          address: log.address,
          ...decoded,
        })
      },
    }),
    createEventProcessor({
      address: baseAddresses.aerodrome.voter,
      event: aerodromeVoterAbi.events.GaugeCreated,
      from: 3200584,
      mapEntity: (ctx, block, log, decoded) => {
        return new AeroVoterGaugeCreated({
          id: `${ctx.chain.id}:${log.id}`,
          chainId: ctx.chain.id,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          address: log.address,
          ...decoded,
        })
      },
    }),
    createEventProcessor({
      address: baseAddresses.aerodrome.poolFactory.amm,
      event: aerodromePoolFactoryAbi.events.PoolCreated,
      from: 3200559,
      mapEntity: (ctx, block, log, decoded) => {
        return new AeroPoolCreated({
          id: `${ctx.chain.id}:${log.id}`,
          chainId: ctx.chain.id,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          address: log.address,
          pool: decoded.pool,
          token0: decoded.token0,
          token1: decoded.token1,
          stable: decoded.stable,
        })
      },
    }),
    createEventProcessor({
      address: baseAddresses.aerodrome.poolFactory.cl,
      event: aerodromeCLPoolFactoryAbi.events.PoolCreated,
      from: 13843704,
      mapEntity: (ctx, block, log, decoded) => {
        return new AeroCLPoolCreated({
          id: `${ctx.chain.id}:${log.id}`,
          chainId: ctx.chain.id,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          address: log.address,
          pool: decoded.pool,
          token0: decoded.token0,
          token1: decoded.token1,
          tickSpacing: decoded.tickSpacing,
        })
      },
    }),
  ])
