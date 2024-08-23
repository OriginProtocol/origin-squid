import * as aerodromePoolAbi from '@abi/aerodrome-pool'
import * as aerodromeVoterAbi from '@abi/aerodrome-voter'
import * as models from '@model'
import { AeroPoolState } from '@model'
import { Block, Context, Log, Processor } from '@processor'
import { convertRate } from '@templates/aerodrome/prices'
import { getVoterTotalWeight } from '@templates/aerodrome/shared'
import { PoolDefinition, baseAddresses } from '@utils/addresses-base'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { logFilter } from '@utils/logFilter'

export const aerodromePool = (params: PoolDefinition): Processor => {
  const eventProcessors = Object.entries(aerodromePoolAbi.events).map(([eventName, event]) => {
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
        const Model = models[`AeroPool${eventName as keyof typeof aerodromePoolAbi.events}`]
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
        const states: AeroPoolState[] = []
        await frequencyUpdater(ctx, async (ctx, block) => {
          const poolContract = new aerodromePoolAbi.Contract(ctx, block.header, params.address)
          const liquidity = await poolContract.totalSupply()
          const stakedLiquidity = params.gauge ? await poolContract.balanceOf(params.gauge.address) : 0n
          const reserves = await poolContract.getReserves()
          const reserve0Usd = await convertRate(
            ctx,
            block,
            params.assets[0].address,
            baseAddresses.tokens.USDC,
            reserves._reserve0,
          )
          const reserve1Usd = await convertRate(
            ctx,
            block,
            params.assets[1].address,
            baseAddresses.tokens.USDC,
            reserves._reserve1,
          )
          const totalVoteWeight = await getVoterTotalWeight(ctx, block)
          const voterContract = new aerodromeVoterAbi.Contract(ctx, block.header, baseAddresses.aerodrome.voter)
          const voteWeight = await voterContract.weights(params.address)
          const votePercentage = (voteWeight * 10n ** 18n) / totalVoteWeight
          const state = new AeroPoolState({
            id: `${ctx.chain.id}-${params.address}-${block.header.height}`,
            chainId: ctx.chain.id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            address: params.address,
            liquidity,
            stakedLiquidity,
            totalUsd: reserve0Usd + reserve1Usd,
            asset0: reserves._reserve0,
            asset1: reserves._reserve1,
            voteWeight,
            votePercentage,
          })
          states.push(state)
        })
        await ctx.store.insert(states)
      }

      await Promise.all([eventProcessing(), aeroPoolStateProcessing()])
    },
  }
}
