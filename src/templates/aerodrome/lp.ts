import { uniqBy } from 'lodash'

import * as aerodromeLPSugarAbi from '@abi/aerodrome-lp-sugar-v3'
import { AeroLP, AeroLPPosition } from '@model'
import { Block, Context, Processor } from '@processor'
import { baseAddresses } from '@utils/addresses-base'
import { batchPromises } from '@utils/batchPromises'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { range } from '@utils/range'

// For AMM Pools the sugar contract iterates through all the pools, according to the pool indices.
// To shortcut - we can supply accurate offsets and limits.
const ammPoolFactory = '0x420dd381b31aef6683db6b902084cb0ffece40da'
const ammPoolLookupOffset: Record<string, number | undefined> = {
  [baseAddresses.aerodrome['vAMM-WETH/OGN'].pool.address]: 1324,
  [baseAddresses.aerodrome['vAMM-OGN/superOETHb'].pool.address]: 1673,
}

// For CL Pools the sugar contract quickly checks unstaked positions.
// Staked positions then require iteration through all the pools.
// This leaves us in a "can we skip anything?" situation.
// Strategy
// - 1 call at index 0 with our desired limit
// - 1 call at the known pool index + count we just found, with our desired limit
// (not perfect, but good enough?)
const clPoolFactory = '0x5e7bb104d84c7cb9b682aac2f3d509f5f406809a' // 0xb2cc224c1c9fee385f8ad6a55b4d94e92359dc59
const clPoolLookupOffset: Record<string, number | undefined> = {
  [baseAddresses.aerodrome['CL1-WETH/superOETHb'].pool.address]: 113,
  [baseAddresses.aerodrome['CL100-WETH/USDC'].pool.address]: 1,
}

const MAX_POSITIONS = 200

export const aerodromeLP = (params: {
  pool: string
  poolType: 'amm' | 'cl'
  account: string
  from: number
}): Processor => {
  const frequencyUpdater = blockFrequencyUpdater({ from: params.from })
  return {
    from: params.from,
    name: `Aerodrome LP ${params.account}`,
    setup: (processor) => {
      processor.includeAllBlocks({ from: params.from })
    },
    process: async (ctx) => {
      const lpStates: AeroLP[] = []
      const lpPositionStates: AeroLPPosition[] = []
      await frequencyUpdater(ctx, async (ctx: Context, block: Block) => {
        const sugar = new aerodromeLPSugarAbi.Contract(ctx, block.header, baseAddresses.aerodrome.sugarLPV3)
        const offset = params.poolType === 'amm' ? ammPoolLookupOffset[params.pool] : clPoolLookupOffset[params.pool]
        const factoryAddress = params.poolType === 'amm' ? ammPoolFactory : clPoolFactory
        if (!offset) throw new Error('Pool offset not found.')
        let positions = []
        if (params.poolType === 'cl') {
          positions = await sugar.positionsByFactory(MAX_POSITIONS, offset, params.account, factoryAddress)
          positions = uniqBy(
            [
              ...positions,
              ...(await sugar.positionsByFactory(
                MAX_POSITIONS,
                offset + positions.length,
                params.account,
                factoryAddress,
              )),
            ],
            (p) => p.id,
          )
        } else {
          positions = await sugar.positionsByFactory(MAX_POSITIONS, offset, params.account, factoryAddress)
        }
        lpPositionStates.push(
          ...positions.map(
            (p) =>
              new AeroLPPosition({
                id: `${ctx.chain.id}-${params.pool}-${params.account}-${p.id}-${block.header.height}`,
                chainId: ctx.chain.id,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                pool: params.pool,
                positionId: p.id,
                account: params.account,
                liquidity: p.liquidity,
                staked: p.staked,
                amount0: p.amount0,
                amount1: p.amount1,
                staked0: p.staked0,
                staked1: p.staked1,
                unstakedEarned0: p.unstaked_earned0,
                unstakedEarned1: p.unstaked_earned1,
                emissionsEarned: p.emissions_earned,
                tickLower: p.tick_lower,
                tickUpper: p.tick_upper,
                sqrtRatioLower: p.sqrt_ratio_lower,
                sqrtRatioUpper: p.sqrt_ratio_upper,
              }),
          ),
        )
        // TODO: Aggregate for lpStates
      })
      await ctx.store.insert(lpStates)
      await ctx.store.insert(lpPositionStates)
    },
  }
}
