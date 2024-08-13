import * as aerodromeLPSugarAbi from '@abi/aerodrome-lp-sugar-v3'
import { AeroLPPosition } from '@model'
import { Block, Context, Processor } from '@processor'
import { baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

export const aerodromeLP = (params: { address: string; from: number }): Processor => {
  const frequencyUpdater = blockFrequencyUpdater({ from: params.from })
  return {
    from: params.from,
    name: `Aerodrome LP ${params.address}`,
    setup: (processor) => {
      processor.includeAllBlocks({ from: params.from })
    },
    process: async (ctx) => {
      const states: AeroLPPosition[] = []
      await frequencyUpdater(ctx, async (ctx: Context, block: Block) => {
        const sugar = new aerodromeLPSugarAbi.Contract(ctx, block.header, baseAddresses.aerodrome.sugarLPV3)
        const positions = await sugar.positions(1_000_000, 0, params.address)
        states.push(
          ...positions.map(
            (p) =>
              new AeroLPPosition({
                id: `${ctx.chain.id}-${params.address}-${block.header.height}-${p.id}`,
                chainId: ctx.chain.id,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                address: params.address,
                positionId: p.id,
                lp: p.lp,
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
      })
      await ctx.store.insert(states)
    },
  }
}
