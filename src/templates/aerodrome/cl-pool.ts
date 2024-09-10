import * as aerodromeCLPoolAbi from '@abi/aerodrome-cl-pool'
import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import * as erc20Abi from '@abi/erc20'
import * as models from '@model'
import { AeroCLPoolState, AeroCLPoolTick, AeroPoolEpochState, AeroPoolState, TokenAmount } from '@model'
import { Block, Context, Log, Processor } from '@processor'
import { createAeroPoolEpoch } from '@templates/aerodrome/epoch'
import { convertRate, getPriceFromSqrtPriceX96 } from '@templates/aerodrome/prices'
import { getVoterTotalWeight } from '@templates/aerodrome/shared'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { logFilter } from '@utils/logFilter'

export const aerodromeCLPool = (params: PoolDefinition): Processor => {
  const eventProcessors = Object.entries(aerodromeCLPoolAbi.events).map(([eventName, event]) => {
    const filter = logFilter({
      address: [params.address],
      topic0: [event.topic],
      range: { from: params.from },
    })
    return {
      name: eventName,
      filter,
      process: (ctx: Context, block: Block, log: Log) => {
        if (!filter.matches(log)) return null
        const Model = models[`AeroCLPool${eventName as keyof typeof aerodromeCLPoolAbi.events}`]
        const data = event.decode(log) as any
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'string') {
            data[key] = data[key].toLowerCase()
          }
        }
        return new Model({
          ...data,
          id: `${ctx.chain.id}-${log.id}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: log.address,
        })
      },
    }
  })
  const frequencyUpdater = blockFrequencyUpdater({ from: params.from })
  return {
    from: params.from,
    name: `Aerodrome Pool ${params.address}`,
    setup: (processor) => {
      processor.includeAllBlocks({ from: params.from })
      for (const { filter } of eventProcessors) {
        processor.addLog(filter.value)
      }
    },
    process: async (ctx) => {
      const eventProcessing = async () => {
        const entities = new Map<string, NonNullable<ReturnType<(typeof eventProcessors)[number]['process']>>[]>()
        for (const block of ctx.blocks) {
          for (const log of block.logs) {
            for (const { name, process } of eventProcessors) {
              const entity = process(ctx, block, log)
              if (entity) {
                let entitiesArray = entities.get(name)
                if (!entitiesArray) {
                  entitiesArray = []
                  entities.set(name, entitiesArray)
                }
                entitiesArray.push(entity)
              }
            }
          }
        }
        await Promise.all([...entities.values()].map(async (entity) => ctx.store.insert(entity)))
      }
      const aeroPoolStateProcessing = async () => {
        const states: AeroCLPoolState[] = []
        const ticks: AeroCLPoolTick[] = []
        const epochs: AeroPoolEpochState[] = []
        const updateState = async (ctx: Context, block: Block) => {
          const poolContract = new aerodromeCLPoolAbi.Contract(ctx, block.header, params.address)
          const totalVoteWeight = await getVoterTotalWeight(ctx, block)
          const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodrome.voter)
          const voteWeight = await voterContract.weights(params.address)
          const votePercentage = (voteWeight * 10n ** 18n) / totalVoteWeight

          const token0Contract = new erc20Abi.Contract(ctx, block.header, params.assets[0].address)
          const token1Contract = new erc20Abi.Contract(ctx, block.header, params.assets[1].address)
          const [liquidity, stakedLiquidity, reserve0, reserve1, slot0] = await Promise.all([
            poolContract.liquidity(),
            poolContract.stakedLiquidity(),
            token0Contract.balanceOf(params.address),
            token1Contract.balanceOf(params.address),
            poolContract.slot0(),
          ])

          const tick = await poolContract.ticks(slot0.tick)
          const tickPrice = getPriceFromSqrtPriceX96(
            slot0.sqrtPriceX96,
            params.assets[0].decimals,
            params.assets[1].decimals,
          )

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

          const [reserve0Usd, reserve1Usd] = await Promise.all([
            convertRate(ctx, block, params.assets[0].address, baseAddresses.tokens.USDC, reserve0),
            convertRate(ctx, block, params.assets[1].address, baseAddresses.tokens.USDC, reserve1),
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

          const epochState = await createAeroPoolEpoch(ctx, block, params.address)
          if (epochState) {
            epochs.push(epochState)
          }

          states.push(state)
          ticks.push(currentTick)
        }
        await frequencyUpdater(ctx, updateState)
        await ctx.store.insert(ticks)
        await ctx.store.insert(states)
        await ctx.store.insert(epochs)
      }
      await Promise.all([eventProcessing(), aeroPoolStateProcessing()])
    },
  }
}
