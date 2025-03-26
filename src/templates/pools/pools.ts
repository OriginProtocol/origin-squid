import { compact } from 'lodash'
import { base, mainnet, sonic } from 'viem/chains'

import * as algebraFactoryAbi from '@abi/algebra-v4-factory'
import * as algebraPoolAbi from '@abi/algebra-v4-pool'
import * as stableSwapFactoryAbi from '@abi/curve-stable-swap-factory-ng'
import * as stableSwapMetaNgAbi from '@abi/curve-stable-swap-meta-ng'
import * as stableSwapNgAbi from '@abi/curve-stable-swap-ng'
import * as triCryptoFactoryAbi from '@abi/curve-tricrypto-factory'
import * as twocryptoFactoryAbi from '@abi/curve-twocrypto-factory'
import * as erc20Abi from '@abi/erc20'
import * as swapxPairFactoryAbi from '@abi/swapx-pair-factory'
import { Pool } from '@model'
import { Context, defineProcessor, joinProcessors, logFilter } from '@originprotocol/squid-utils'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OETH_ADDRESS, OGN_ADDRESS, OUSD_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'

const TRACKED_TOKENS = [
  OETH_ADDRESS,
  OUSD_ADDRESS,
  OGN_ADDRESS,
  baseAddresses.tokens.OGN,
  baseAddresses.superOETHb.address,
].filter(Boolean)

/**
 * For curve data refer to the AddressProvider:
 * https://docs.curve.fi/integration/address-provider/?h=addressprovider
 * StableSwapFactory address = AddressProvider.get_address(11)
 * TwoCryptoFactory address = AddressProvider.get_address(12)
 * TricryptoFactory address = AddressProvider.get_address(13)
 */

const chainParams: Record<
  number,
  {
    stableSwapFactory: {
      address: string
      from: number
    }
    twoCryptoFactory: {
      address: string
      from: number
    }
    triCryptoFactory: {
      address: string
      from: number
    }
    swapxPairFactory?: {
      address: string
      from: number
    }
    swapxAlgebraFactory?: {
      address: string
      from: number
    }
  }
> = {
  [mainnet.id]: {
    stableSwapFactory: {
      address: '0x6a8cbed756804b16e05e741edabd5cb544ae21bf',
      from: 18427841,
    },
    twoCryptoFactory: {
      address: '0x98ee851a00abee0d95d08cf4ca2bdce32aeaaf7f',
      from: 18867338,
    },
    triCryptoFactory: {
      address: '0x0c0e5f2ff0ff18a3be9b835635039256dc4b4963',
      from: 17371439,
    },
  },
  [base.id]: {
    stableSwapFactory: {
      address: '0xd2002373543ce3527023c75e7518c274a51ce712',
      from: 5510440,
    },
    twoCryptoFactory: {
      address: '0xc9fe0c63af9a39402e8a5514f9c43af0322b665f',
      from: 8385770,
    },
    triCryptoFactory: {
      address: '0xa5961898870943c68037f6848d2d866ed2016bcb',
      from: 2389140,
    },
  },
  [sonic.id]: {
    stableSwapFactory: {
      address: '0x7c2085419be6a04f4ad88ea91bc9f5c6e6c463d8',
      from: 1988890,
    },
    twoCryptoFactory: {
      address: '0x1a83348f9ccfd3fe1a8c0adba580ac4e267fe495',
      from: 1988948,
    },
    triCryptoFactory: {
      address: '0x635742dcc8313dcf8c904206037d962c042eafbd',
      from: 1988919,
    },
    swapxPairFactory: {
      address: '0x05c1be79d3ac21cc4b727eed58c9b2ff757f5663',
      from: 1333667,
    },
    swapxAlgebraFactory: {
      address: '0x8121a3f8c4176e9765deea0b95fa2bdfd3016794',
      from: 1440914,
    },
  },
}
export const createPoolsProcessor = (chainId: number) => {
  if (!chainParams[chainId]) {
    throw new Error(`No params found for chainId: ${chainId}`)
  }
  return joinProcessors(
    'pools',
    compact([
      createCurveStableProcessor(chainParams[chainId].stableSwapFactory),
      createCurveTwoCryptoProcessor(chainParams[chainId].twoCryptoFactory),
      createCurveTriCryptoProcessor(chainParams[chainId].triCryptoFactory),
      chainParams[chainId].swapxPairFactory
        ? createSwapxPairProcessor(chainParams[chainId].swapxPairFactory!)
        : undefined,
      chainParams[chainId].swapxAlgebraFactory
        ? createAlgebraProcessor(chainParams[chainId].swapxAlgebraFactory!)
        : undefined,
    ]),
  )
}

export const createCurveStableProcessor = (params: { address: string; from: number }) => {
  const plainPoolDeployedFilter = logFilter({
    address: [params.address],
    topic0: [stableSwapFactoryAbi.events.PlainPoolDeployed.topic],
    range: { from: params.from },
  })
  const metaPoolDeployedFilter = logFilter({
    address: [params.address],
    topic0: [stableSwapFactoryAbi.events.MetaPoolDeployed.topic],
    range: { from: params.from },
  })
  return defineProcessor({
    name: 'curve-stable-factory',
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(plainPoolDeployedFilter.value)
      processor.addLog(metaPoolDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        const poolsWereCreated = block.logs.some(
          (log) => plainPoolDeployedFilter.matches(log) || metaPoolDeployedFilter.matches(log),
        )
        // If pools were created, get the previous and current pool count
        if (poolsWereCreated) {
          const factory = new stableSwapFactoryAbi.Contract(ctx, block.header, params.address)

          // Get pool count at previous block height and current block height
          const previousBlockHeader = { ...block.header, height: block.header.height - 1 }
          const previousFactory = new stableSwapFactoryAbi.Contract(ctx, previousBlockHeader, params.address)

          const previousPoolCount = await previousFactory.pool_count()
          const currentPoolCount = await factory.pool_count()

          // Iterate through newly created pools
          for (let i = previousPoolCount; i < currentPoolCount; i++) {
            const poolAddress = await factory.pool_list(i)

            // Check if it's a meta pool or plain pool
            const isMetaPool = await factory.is_meta(poolAddress)

            if (isMetaPool) {
              // Handle meta pool
              const poolContract = new stableSwapMetaNgAbi.Contract(ctx, block.header, poolAddress)
              const [name, symbol, coins] = await Promise.all([
                poolContract.name(),
                poolContract.symbol(),
                factory.get_coins(poolAddress),
              ])

              const pool = new Pool({
                id: `${ctx.chain.id}:${poolAddress}`,
                chainId: ctx.chain.id,
                address: poolAddress,
                name,
                symbol,
                createdAtBlock: block.header.height,
                createdAt: new Date(block.header.timestamp),
                tokens: coins.map((coin) => coin.toLowerCase()),
                exchange: 'curve',
                type: 'stable-meta',
              })
              pools.set(pool.id, pool)
            } else {
              // Handle plain pool
              const poolContract = new stableSwapNgAbi.Contract(ctx, block.header, poolAddress)
              const [name, symbol, coins] = await Promise.all([
                poolContract.name(),
                poolContract.symbol(),
                factory.get_coins(poolAddress),
              ])

              const pool = new Pool({
                id: `${ctx.chain.id}:${poolAddress}`,
                chainId: ctx.chain.id,
                address: poolAddress,
                name,
                symbol,
                createdAtBlock: block.header.height,
                createdAt: new Date(block.header.timestamp),
                tokens: coins.map((coin) => coin.toLowerCase()),
                exchange: 'curve',
                type: 'stable-plain',
              })
              pools.set(pool.id, pool)
            }
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createCurveTwoCryptoProcessor = (params: { address: string; from: number }) => {
  const twocryptoPoolDeployedFilter = logFilter({
    address: [params.address],
    topic0: [twocryptoFactoryAbi.events.TwocryptoPoolDeployed.topic],
    range: { from: params.from },
  })
  return defineProcessor({
    name: 'curve-twocrypto-factory',
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(twocryptoPoolDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (twocryptoPoolDeployedFilter.matches(log)) {
            const data = twocryptoFactoryAbi.events.TwocryptoPoolDeployed.decode(log)
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: data.name,
              symbol: data.symbol,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: data.coins.map((coin) => coin.toLowerCase()),
              exchange: 'curve',
              type: 'twocrypto',
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createCurveTriCryptoProcessor = (params: { address: string; from: number }) => {
  const twocryptoPoolDeployedFilter = logFilter({
    address: [params.address],
    topic0: [triCryptoFactoryAbi.events.TricryptoPoolDeployed.topic],
    range: { from: params.from },
  })
  return defineProcessor({
    name: 'curve-twocrypto-factory',
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(twocryptoPoolDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (twocryptoPoolDeployedFilter.matches(log)) {
            const data = triCryptoFactoryAbi.events.TricryptoPoolDeployed.decode(log)
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: data.name,
              symbol: data.symbol,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: data.coins.map((coin) => coin.toLowerCase()),
              exchange: 'curve',
              type: 'tricrypto',
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createSwapxPairProcessor = (params: { address: string; from: number }) => {
  const swapxPairDeployedFilter = logFilter({
    address: [params.address],
    topic0: [swapxPairFactoryAbi.events.PairCreated.topic],
    range: { from: params.from },
  })
  return defineProcessor({
    name: 'swapx-pair-factory',
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(swapxPairDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (swapxPairDeployedFilter.matches(log)) {
            const data = swapxPairFactoryAbi.events.PairCreated.decode(log)
            const poolContract = new erc20Abi.Contract(ctx, block.header, data.pair)
            const [name, symbol] = await Promise.all([poolContract.name(), poolContract.symbol()])
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pair}`,
              chainId: ctx.chain.id,
              address: data.pair,
              name,
              symbol,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              exchange: 'swapx',
              type: `pair-${data.stable ? 'stable' : 'volatile'}`,
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createAlgebraProcessor = (params: { address: string; from: number }) => {
  const algebraPairDeployedFilter = logFilter({
    address: [params.address],
    topic0: [algebraFactoryAbi.events.Pool.topic],
    range: { from: params.from },
  })
  return defineProcessor({
    name: 'swapx-algebra-factory',
    from: params.from,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(algebraPairDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (algebraPairDeployedFilter.matches(log)) {
            const data = algebraFactoryAbi.events.Pool.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.token0)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.token1)
            const poolContract = new algebraPoolAbi.Contract(ctx, block.header, data.pool)
            const [symbol0, symbol1, tickSpacing] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              poolContract.tickSpacing(),
            ])
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: `Algebra ${tickSpacing} ${symbol0}-${symbol1}`,
              symbol: `CL${tickSpacing}-${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              exchange: 'swapx',
              type: 'algebra',
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

// export const createCurveMetaPoolFactoryProcessor = (params: { from: number; address: string }) => {
//   const metaPoolDeployedFilter = logFilter({
//     address: [params.address],
//     topic0: [curveMetaPoolFactoryAbi.events.MetaPoolDeployed.topic],
//     range: { from: params.from },
//   })
//   return defineProcessor({
//     name: 'curve-meta-pool-factory',
//     from: params.from,
//     setup: (processor: EvmBatchProcessor) => {
//       processor.addLog(metaPoolDeployedFilter.value)
//     },
//     process: async (ctx: Context) => {
//       const pools = new Map<string, Pool>()

//       for (const block of ctx.blocksWithContent) {
//         for (const log of block.logs) {
//           if (metaPoolDeployedFilter.matches(log)) {
//             const data = curveMetaPoolFactoryAbi.events.MetaPoolDeployed.decode(log)
//             const poolContract = new curveLpTokenAbi.Contract(ctx, block.header, data.deployer)
//             const handleError = (error: Error) => {
//               if (error.toString().includes('execution reverted')) {
//                 return null
//               }
//               throw error
//             }
//             try {
//               const [A, name, symbol, coin0, coin1, coin2, coin3] = await Promise.all([
//                 poolContract.A(),
//                 poolContract.name(),
//                 poolContract.symbol(),
//                 poolContract.coins(0).catch(handleError),
//                 poolContract.coins(1).catch(handleError),
//                 poolContract.coins(2).catch(handleError),
//                 poolContract.coins(3).catch(handleError),
//               ])
//               const tokens = compact([coin0, coin1, coin2, coin3].map((token) => token?.toLowerCase()))
//               if (tokens.some((token) => TRACKED_TOKENS.includes(token))) {
//                 const pool = new Pool({
//                   id: `${ctx.chain.id}:${data.pool}`,
//                   chainId: ctx.chain.id,
//                   address: log.address,
//                   createdAtBlock: block.header.height,
//                   createdAt: new Date(block.header.timestamp),
//                   name,
//                   symbol,
//                   tokens,
//                   exchange: 'curve',
//                   isActive: true,
//                   txHash: log.transactionHash,
//                   type: `standard-${A}`,
//                 })
//                 pools.set(pool.id, pool)
//                 console.log('Pool added:', data.pool)
//                 debugger
//               } else {
//                 console.log('Pool not added:', data.pool)
//               }
//             } catch (error: any) {
//               if (error.toString().includes('execution reverted')) {
//                 console.log('Pool could not be processed:', data.pool)
//               } else {
//                 throw error
//               }
//             }
//           } else if (poolRemovedFilter.matches(log)) {
//             const data = curveRegistryAbi.events.PoolRemoved.decode(log)
//             const id = `${ctx.chain.id}:${data.pool}`
//             const pool = await ctx.store.get(Pool, id)
//             if (pool) {
//               pool.isActive = false
//               pools.set(pool.id, pool)
//             }
//           }
//         }
//       }
//     },
//   })
// }

// export const createCurveRegistryProcessor = (params: { from: number; address: string }) => {
//   const poolAddedFilter = logFilter({
//     address: [params.address],
//     topic0: [curveRegistryAbi.events.PoolAdded.topic],
//     range: { from: params.from },
//   })
//   const poolRemovedFilter = logFilter({
//     address: [params.address],
//     topic0: [curveRegistryAbi.events.PoolRemoved.topic],
//     range: { from: params.from },
//   })
//   return defineProcessor({
//     name: 'curve-registry',
//     from: params.from,
//     setup: (processor: EvmBatchProcessor) => {
//       processor.addLog(poolAddedFilter.value)
//       processor.addLog(poolRemovedFilter.value)
//     },
//     process: async (ctx: Context) => {
//       const pools = new Map<string, Pool>()

//       for (const block of ctx.blocksWithContent) {
//         for (const log of block.logs) {
//           if (poolAddedFilter.matches(log)) {
//             const data = curveRegistryAbi.events.PoolAdded.decode(log)
//             const poolContract = new curveLpTokenAbi.Contract(ctx, block.header, data.pool)
//             const handleError = (error: Error) => {
//               if (error.toString().includes('execution reverted')) {
//                 return null
//               }
//               throw error
//             }
//             try {
//               const [A, name, symbol, coin0, coin1, coin2, coin3] = await Promise.all([
//                 poolContract.A(),
//                 poolContract.name(),
//                 poolContract.symbol(),
//                 poolContract.coins(0).catch(handleError),
//                 poolContract.coins(1).catch(handleError),
//                 poolContract.coins(2).catch(handleError),
//                 poolContract.coins(3).catch(handleError),
//               ])
//               const tokens = compact([coin0, coin1, coin2, coin3].map((token) => token?.toLowerCase()))
//               if (tokens.some((token) => TRACKED_TOKENS.includes(token))) {
//                 const pool = new Pool({
//                   id: `${ctx.chain.id}:${data.pool}`,
//                   chainId: ctx.chain.id,
//                   address: log.address,
//                   createdAtBlock: block.header.height,
//                   createdAt: new Date(block.header.timestamp),
//                   name,
//                   symbol,
//                   tokens,
//                   exchange: 'curve',
//                   isActive: true,
//                   txHash: log.transactionHash,
//                   type: `standard-${A}`,
//                 })
//                 pools.set(pool.id, pool)
//                 console.log('Pool added:', data.pool)
//                 debugger
//               } else {
//                 console.log('Pool not added:', data.pool)
//               }
//             } catch (error: any) {
//               if (error.toString().includes('execution reverted')) {
//                 console.log('Pool could not be processed:', data.pool)
//               } else {
//                 throw error
//               }
//             }
//           } else if (poolRemovedFilter.matches(log)) {
//             const data = curveRegistryAbi.events.PoolRemoved.decode(log)
//             const id = `${ctx.chain.id}:${data.pool}`
//             const pool = await ctx.store.get(Pool, id)
//             if (pool) {
//               pool.isActive = false
//               pools.set(pool.id, pool)
//             }
//           }
//         }
//       }
//     },
//   })
// }
