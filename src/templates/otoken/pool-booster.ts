import * as poolBoosterAbi from '@abi/pool-booster'
import * as poolBoosterCentralRegistryAbi from '@abi/pool-booster-central-registry'
import { PoolBooster, PoolBoosterBribeExecuted } from '@model'
import { Context, defineProcessor, logFilter } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

export const createPoolBoosterProcessor = (params: { registryAddress: string; from: number }) => {
  const poolBoosterCreatedFilter = logFilter({
    address: [params.registryAddress],
    topic0: [poolBoosterCentralRegistryAbi.events.PoolBoosterCreated.topic],
    range: { from: params.from },
  })

  const poolBoosterRemovedFilter = logFilter({
    address: [params.registryAddress],
    topic0: [poolBoosterCentralRegistryAbi.events.PoolBoosterRemoved.topic],
    range: { from: params.from },
  })

  const bribeExecutedFilter = logFilter({
    topic0: [poolBoosterAbi.events.BribeExecuted.topic],
    range: { from: params.from },
  })

  return defineProcessor({
    name: `pool-booster`,
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(poolBoosterCreatedFilter.value)
      processor.addLog(poolBoosterRemovedFilter.value)
      processor.addLog(bribeExecutedFilter.value)
    },
    process: async (ctx: Context) => {
      const poolBoosters = new Map<string, PoolBooster>()
      const bribeExecutions = new Map<string, PoolBoosterBribeExecuted>()

      const getPoolBooster = async (address: string): Promise<PoolBooster | undefined> => {
        const id = `${ctx.chain.id}-${address}`
        let poolBooster = poolBoosters.get(id) || (await ctx.store.get(PoolBooster, id))
        if (poolBooster) {
          poolBoosters.set(id, poolBooster)
        }
        return poolBooster
      }

      for (const block of ctx.blocks) {
        for (const log of block.logs) {
          try {
            if (poolBoosterCreatedFilter.matches(log)) {
              const data = poolBoosterCentralRegistryAbi.events.PoolBoosterCreated.decode(log)
              const id = `${ctx.chain.id}-${data.poolBoosterAddress}`
              const poolBooster = new PoolBooster({
                id,
                chainId: ctx.chain.id,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                address: data.poolBoosterAddress,
                registryAddress: params.registryAddress,
                ammPoolAddress: data.ammPoolAddress,
                factoryAddress: data.factoryAddress,
                poolBoosterType: data.poolBoosterType,
                active: true,
              })
              poolBoosters.set(id, poolBooster)
            } else if (poolBoosterRemovedFilter.matches(log)) {
              const data = poolBoosterCentralRegistryAbi.events.PoolBoosterRemoved.decode(log)
              const poolBooster = await getPoolBooster(data.poolBoosterAddress)
              if (poolBooster) {
                poolBooster.active = false
              }
            } else if (bribeExecutedFilter.matches(log)) {
              const data = poolBoosterAbi.events.BribeExecuted.decode(log)
              const bribeExecuted = new PoolBoosterBribeExecuted({
                id: `${ctx.chain.id}-${log.address}-${log.transactionHash}`,
                chainId: ctx.chain.id,
                address: log.address,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                txHash: log.transactionHash,
                amount: data.amount,
                fee: 0n,
              })
              bribeExecutions.set(bribeExecuted.id, bribeExecuted)
            }
          } catch (err) {
            console.error(err)
          }
        }
      }

      await ctx.store.upsert([...poolBoosters.values()])
      await ctx.store.insert([...bribeExecutions.values()])
    },
  })
}
