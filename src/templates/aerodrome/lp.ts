import { uniqBy } from 'lodash'

import * as aerodromeLPSugarAbi from '@abi/aerodrome-lp-sugar-v3'
import { AeroLP, AeroLPPosition } from '@model'
import { Block, Context, Processor } from '@processor'
import { PoolDefinition, aerodromePools, baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

// For AMM Pools the sugar contract iterates through all the pools, according to the pool indices.
// To shortcut - we can supply accurate offsets and limits.
const ammPoolFactory = '0x420dd381b31aef6683db6b902084cb0ffece40da'
const ammPoolLookupOffset: Record<string, number | undefined> = {
  [aerodromePools['vAMM-WETH/OGN'].address]: 1324,
  [aerodromePools['vAMM-OGN/superOETHb'].address]: 1673,
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
  [aerodromePools['CL1-WETH/superOETHb'].address]: 113,
  [aerodromePools['CL100-WETH/USDC'].address]: 1,
}

const MAX_POSITIONS = 200

export const aerodromeLP = (pool: PoolDefinition): Processor[] => {
  const from = Math.max(16962730, pool.from) // Sugar deploy date or from.
  const frequencyUpdater = blockFrequencyUpdater({ from })
  return pool.lps.map((account) => {
    const processor: Processor = {
      from,
      name: `Aerodrome LP ${account}`,
      setup: (processor) => {
        processor.includeAllBlocks({ from: pool.from })
      },
      process: async (ctx) => {
        const lpStates: AeroLP[] = []
        const lpPositionStates: AeroLPPosition[] = []
        await frequencyUpdater(ctx, async (ctx: Context, block: Block) => {
          const sugar = new aerodromeLPSugarAbi.Contract(ctx, block.header, baseAddresses.aerodrome.sugarLPV3)
          const offset = pool.type === 'amm' ? ammPoolLookupOffset[pool.address] : clPoolLookupOffset[pool.address]
          const factoryAddress = pool.type === 'amm' ? ammPoolFactory : clPoolFactory
          if (!offset) throw new Error('Pool offset not found.')
          let positions = []
          if (pool.type === 'cl') {
            // First pull from offset 0 to capture any unstaked positions.
            positions = await sugar.positionsByFactory(MAX_POSITIONS, 0, account, factoryAddress)
            // Then pull from pool offset + however many positions we just found and merge the result.
            positions = uniqBy(
              [
                ...positions,
                ...(await sugar.positionsByFactory(MAX_POSITIONS, offset + positions.length, account, factoryAddress)),
              ],
              (p) => p.id,
            )
          } else {
            // No special logic needed for AMM.
            positions = await sugar.positionsByFactory(MAX_POSITIONS, offset, account, factoryAddress)
          }
          lpPositionStates.push(
            ...positions.map(
              (p) =>
                new AeroLPPosition({
                  id: `${ctx.chain.id}-${pool.address}-${account}-${p.id}-${block.header.height}`,
                  chainId: ctx.chain.id,
                  blockNumber: block.header.height,
                  timestamp: new Date(block.header.timestamp),
                  pool: pool.address,
                  positionId: p.id,
                  account: account,
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
          if (positions.length) {
            const lpState = new AeroLP({
              id: `${ctx.chain.id}-${pool.address}-${account}-${block.header.height}`,
              chainId: ctx.chain.id,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              pool: pool.address,
              account: account,
              liquidity: positions.reduce((sum, p) => sum + p.liquidity, 0n),
              staked: positions.reduce((sum, p) => sum + p.staked, 0n),
              amount0: positions.reduce((sum, p) => sum + p.amount0, 0n),
              amount1: positions.reduce((sum, p) => sum + p.amount1, 0n),
              staked0: positions.reduce((sum, p) => sum + p.staked0, 0n),
              staked1: positions.reduce((sum, p) => sum + p.staked1, 0n),
              unstakedEarned0: positions.reduce((sum, p) => sum + p.unstaked_earned0, 0n),
              unstakedEarned1: positions.reduce((sum, p) => sum + p.unstaked_earned1, 0n),
              emissionsEarned: positions.reduce((sum, p) => sum + p.emissions_earned, 0n),
              tickLower: positions.reduce(
                (lower, p) => (lower === undefined || lower > p.tick_lower ? p.tick_lower : lower),
                undefined as undefined | number,
              ),
              tickUpper: positions.reduce(
                (upper, p) => (upper === undefined || upper < p.tick_upper ? p.tick_upper : upper),
                undefined as undefined | number,
              ),
              sqrtRatioLower: positions.reduce(
                (lower, p) => (lower === undefined || lower > p.sqrt_ratio_lower ? p.sqrt_ratio_lower : lower),
                undefined as undefined | bigint,
              ),
              sqrtRatioUpper: positions.reduce(
                (upper, p) => (upper === undefined || upper < p.sqrt_ratio_upper ? p.sqrt_ratio_upper : upper),
                undefined as undefined | bigint,
              ),
            })
            lpStates.push(lpState)
          }
        })
        await ctx.store.insert(lpStates)
        await ctx.store.insert(lpPositionStates)
      },
    }
    return processor
  })
}
