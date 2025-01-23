import * as aerodromeLPSugarAbi from '@abi/aerodrome-lp-sugar-v3'
import { AeroLP, AeroLPPosition } from '@model'
import { Block, Context, Processor, blockFrequencyUpdater, multicall } from '@originprotocol/squid-utils'
import { PoolDefinition, aerodromePools, baseAddresses } from '@utils/addresses-base'

// For AMM Pools the sugar contract iterates through all the pools, according to the pool indices.
// To shortcut - we can supply accurate offsets and limits.
export const ammPoolFactory = '0x420dd381b31aef6683db6b902084cb0ffece40da'
export const ammPoolLookupOffset: Record<string, number | undefined> = {
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
export const clPoolFactory = '0x5e7bb104d84c7cb9b682aac2f3d509f5f406809a'
export const clPoolLookupOffset: Record<string, number | undefined> = {
  [aerodromePools['CL1-WETH/superOETHb'].address]: 114,
  // [aerodromePools['CL100-WETH/USDC'].address]: 1,
}

export const getPositions = async (
  ctx: Context,
  height: number,
  pool: PoolDefinition,
  account: string,
  maxLikelyPositions = 10,
) => {
  const sugar = new aerodromeLPSugarAbi.Contract(ctx, { height }, baseAddresses.aerodrome.sugarLPV3)
  const offset = pool.type === 'amm' ? ammPoolLookupOffset[pool.address] : clPoolLookupOffset[pool.address]
  const factoryAddress = pool.type === 'amm' ? ammPoolFactory : clPoolFactory
  if (!offset) throw new Error('Pool offset not found.')
  let positions = []
  if (pool.type === 'cl') {
    positions = await multicall(
      ctx,
      { height },
      aerodromeLPSugarAbi.functions.positionsByFactory,
      baseAddresses.aerodrome.sugarLPV3,
      [
        { _limit: maxLikelyPositions, _offset: 0, _account: account, _factory: factoryAddress },
        { _limit: maxLikelyPositions * 2, _offset: offset, _account: account, _factory: factoryAddress },
      ],
    ).then((positions) => positions.flat())
  } else {
    // No special logic needed for AMM.
    positions = await sugar.positionsByFactory(maxLikelyPositions, offset, account, factoryAddress)
  }
  return positions
}

export const aerodromeLP = (pool: PoolDefinition): Processor[] => {
  const from = Math.max(16962730, pool.from) // Sugar deploy date or from.
  const frequencyUpdater = blockFrequencyUpdater({ from, parallelProcessing: true })
  return pool.lps.map((lp) => {
    const processor: Processor = {
      from,
      name: `Aerodrome LP ${lp.address}`,
      setup: (processor) => {
        processor.includeAllBlocks({ from: pool.from })
      },
      process: async (ctx) => {
        const lpStates: AeroLP[] = []
        const lpPositionStates: AeroLPPosition[] = []
        await frequencyUpdater(ctx, async (ctx: Context, block: Block) => {
          const positions = await getPositions(ctx, block.header.height, pool, lp.address, lp.maxLikelyPositions)
          lpPositionStates.push(
            ...positions.map(
              (p) =>
                new AeroLPPosition({
                  id: `${ctx.chain.id}-${pool.address}-${lp.address}-${p.id}-${block.header.height}`,
                  chainId: ctx.chain.id,
                  blockNumber: block.header.height,
                  timestamp: new Date(block.header.timestamp),
                  pool: pool.address,
                  positionId: p.id,
                  account: lp.address,
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
              id: `${ctx.chain.id}-${pool.address}-${lp.address}-${block.header.height}`,
              chainId: ctx.chain.id,
              blockNumber: block.header.height,
              timestamp: new Date(block.header.timestamp),
              pool: pool.address,
              account: lp.address,
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
        await Promise.all([ctx.store.insert(lpStates), ctx.store.insert(lpPositionStates)])
      },
    }
    return processor
  })
}
