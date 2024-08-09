import * as aerodromeCLPoolAbi from '@abi/aerodrome-cl-pool'
import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import * as models from '@model'
import { AeroCLPoolState, AeroCLPoolTick, AeroPoolState } from '@model'
import { Block, Context, Log, Processor } from '@processor'
import { getVoterTotalWeight } from '@templates/aerodrome/shared'
import { baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { logFilter } from '@utils/logFilter'

export const aerodromeCLPool = (params: { address: string; from: number }): Processor => {
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
        await frequencyUpdater(ctx, async (ctx, block) => {
          const poolContract = new aerodromeCLPoolAbi.Contract(ctx, block.header, params.address)
          const totalVoteWeight = await getVoterTotalWeight(ctx, block)
          const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodromeVoter)
          const voteWeight = await voterContract.weights(params.address)
          const votePercentage = (voteWeight * 10n ** 18n) / totalVoteWeight

          const slot0 = await poolContract.slot0()
          const tick = await poolContract.ticks(slot0.tick)

          const currentTick = new AeroCLPoolTick({
            id: `${ctx.chain.id}-${params.address}-${slot0.tick}-${block.header.height}`,
            chainId: ctx.chain.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            address: params.address,
            tick: slot0.tick,
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

          const state = new AeroCLPoolState({
            id: `${ctx.chain.id}-${params.address}-${block.header.height}`,
            chainId: ctx.chain.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            address: params.address,
            voteWeight,
            votePercentage,
            currentTick,
          })
          states.push(state)
          ticks.push(currentTick)
        })
        await ctx.store.insert(ticks)
        await ctx.store.insert(states)
      }
      await Promise.all([eventProcessing(), aeroPoolStateProcessing()])
    },
  }
}
