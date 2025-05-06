import * as aerodromeCLPoolAbi from '@abi/aerodrome-cl-pool'
import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import * as erc20Abi from '@abi/erc20'
import { AeroCLPoolState, AeroCLPoolTick, AeroPoolEpochState } from '@model'
import { Block, Context, Processor, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { convertRate } from '@shared/post-processors/exchange-rates'
import { createAeroPoolEpoch } from '@templates/aerodrome/epoch'
import { getPriceFromSqrtPriceX96 } from '@templates/aerodrome/prices'
import { getVoterTotalWeight } from '@templates/aerodrome/shared'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'

export const aerodromeCLPool = (params: PoolDefinition): Processor => {
  const frequencyUpdater = blockFrequencyUpdater({ from: params.from, parallelProcessing: true })
  return {
    from: params.from,
    name: `Aerodrome CL Pool ${params.address}`,
    setup: (processor) => {
      processor.includeAllBlocks({ from: params.from })
    },
    process: async (ctx) => {
      const states: AeroCLPoolState[] = []
      const ticks: AeroCLPoolTick[] = []
      const epochs: AeroPoolEpochState[] = []
      const updateState = async (ctx: Context, block: Block) => {
        const poolContract = new aerodromeCLPoolAbi.Contract(ctx, block.header, params.address)
        const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodrome.voter)
        const token0Contract = new erc20Abi.Contract(ctx, block.header, params.assets[0].address)
        const token1Contract = new erc20Abi.Contract(ctx, block.header, params.assets[1].address)
        const [totalVoteWeight, voteWeight, liquidity, stakedLiquidity, reserve0, reserve1, slot0] = await Promise.all([
          getVoterTotalWeight(ctx, block),
          voterContract.weights(params.address),
          poolContract.liquidity(),
          poolContract.stakedLiquidity(),
          token0Contract.balanceOf(params.address),
          token1Contract.balanceOf(params.address),
          poolContract.slot0(),
        ])

        const votePercentage = (voteWeight * 10n ** 18n) / totalVoteWeight
        const tick = await poolContract.ticks(slot0.tick)
        const tickPrice = getPriceFromSqrtPriceX96(slot0.sqrtPriceX96)

        const currentTick = new AeroCLPoolTick({
          id: `${ctx.chain.id}-${params.address}-${slot0.tick}-${block.header.height}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: params.address,
          tick: slot0.tick,
          tickPrice,
          sqrtPriceX96: slot0.sqrtPriceX96,
          liquidityGross: tick.liquidityGross,
          liquidityNet: tick.liquidityNet,
          stakedLiquidityNet: tick.stakedLiquidityNet,
          feeGrowthOutside0X128: tick.feeGrowthOutside0X128,
          feeGrowthOutside1X128: tick.feeGrowthOutside1X128,
          rewardGrowthOutsideX128: tick.rewardGrowthOutsideX128,
          tickCumulativeOutside: tick.tickCumulativeOutside,
          secondsPerLiquidityOutsideX128: tick.secondsPerLiquidityOutsideX128,
          secondsOutside: tick.secondsOutside,
        })

        const [reserve0Usd, reserve1Usd, epochState] = await Promise.all([
          convertRate(ctx, block, params.assets[0].address, baseAddresses.tokens.USDC, reserve0),
          convertRate(ctx, block, params.assets[1].address, baseAddresses.tokens.USDC, reserve1),
          createAeroPoolEpoch(ctx, block, params.address),
        ])

        const state = new AeroCLPoolState({
          id: `${ctx.chain.id}-${params.address}-${block.header.height}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: params.address,
          liquidity,
          stakedLiquidity,
          asset0: reserve0,
          asset1: reserve1,
          totalUsd: reserve0Usd + reserve1Usd,
          voteWeight,
          votePercentage,
          tick: currentTick,
          tickPrice,
          sqrtPriceX96: slot0.sqrtPriceX96,
        })

        if (epochState) {
          epochs.push(epochState)
        }

        states.push(state)
        ticks.push(currentTick)
      }
      await frequencyUpdater(ctx, updateState)
      await Promise.all([ctx.store.insert(ticks), ctx.store.insert(states), ctx.store.insert(epochs)])
    },
  }
}
