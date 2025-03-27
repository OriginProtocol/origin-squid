import { compact } from 'lodash'
import { base, mainnet, sonic } from 'viem/chains'

import * as aerodromeCLPoolFactoryAbi from '@abi/aerodrome-cl-pool-factory'
import * as aerodromePoolFactoryAbi from '@abi/aerodrome-pool-factory'
import * as algebraFactoryAbi from '@abi/algebra-v4-factory'
import * as algebraPoolAbi from '@abi/algebra-v4-pool'
import * as stableSwapFactoryAbi from '@abi/curve-stable-swap-factory-ng'
import * as stableSwapMetaNgAbi from '@abi/curve-stable-swap-meta-ng'
import * as stableSwapNgAbi from '@abi/curve-stable-swap-ng'
import * as triCryptoFactoryAbi from '@abi/curve-tricrypto-factory'
import * as twocryptoFactoryAbi from '@abi/curve-twocrypto-factory'
import * as erc20Abi from '@abi/erc20'
import * as metropolisLbFactoryAbi from '@abi/metropolis-lb-factory'
import * as metropolisV2FactoryAbi from '@abi/metropolis-v2-factory'
import * as shadowPairFactoryAbi from '@abi/shadow-pair-factory'
import * as shadowV3FactoryAbi from '@abi/shadow-v3-factory'
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
  let initialized = false
  return joinProcessors(
    'pools',
    compact([
      mainnet.id === chainId
        ? defineProcessor({
            name: 'default-pools',
            from: 17371439,
            process: async (ctx: Context) => {
              if (initialized) return
              initialized = true
              if ((await ctx.store.count(Pool)) === 0) return
              await ctx.store.insert([
                new Pool({
                  id: '1:0x94b17476a93b3262d87b9a326965d1e91f9c13e7',
                  chainId: 1,
                  address: '0x94b17476a93b3262d87b9a326965d1e91f9c13e7',
                  name: 'Curve.fi Factory Pool: OETH',
                  symbol: 'OETHCRV-f',
                  createdAtBlock: 17130232,
                  createdAt: new Date('Apr-26-2023 11:54:47 AM UTC'),
                  tokens: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3'],
                  symbols: ['ETH', 'OETH'],
                  decimals: [18, 18],
                  exchange: 'curve',
                  type: 'stable',
                }),
                new Pool({
                  id: '1:0xfa0bbb0a5815f6648241c9221027b70914dd8949',
                  chainId: 1,
                  address: '0xfa0bbb0a5815f6648241c9221027b70914dd8949',
                  name: 'Curve.fi Factory Plain Pool: frxETH/OETH',
                  symbol: 'frxETHOETH-f',
                  createdAtBlock: 18123489,
                  createdAt: new Date('Sep-12-2023 11:21:47 PM UTC'),
                  tokens: ['0x5e8422345238f34275888049021821e8e08caa1f', '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3'],
                  symbols: ['frxETH', 'OETH'],
                  decimals: [18, 18],
                  exchange: 'curve',
                  type: 'stable',
                }),
                new Pool({
                  id: '1:0x87650d7bbfc3a9f10587d7778206671719d9910d',
                  chainId: 1,
                  address: '0x87650d7bbfc3a9f10587d7778206671719d9910d',
                  name: 'Curve.fi Factory USD Metapool: Origin Dollar',
                  symbol: 'OUSD3CRV-f',
                  createdAtBlock: 12860905,
                  createdAt: new Date('Jul-20-2021 02:59:14 AM UTC'),
                  tokens: ['0x2a8e1e676ec238d8a992307b495b45b3feaa5e86', '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490'],
                  symbols: ['OUSD', '3Crv'],
                  decimals: [18, 18],
                  exchange: 'curve',
                  type: 'stable',
                }),
              ])
            },
          })
        : undefined,
      createCurveStableProcessor(chainParams[chainId].stableSwapFactory),
      createCurveTwoCryptoProcessor(chainParams[chainId].twoCryptoFactory),
      createCurveTriCryptoProcessor(chainParams[chainId].triCryptoFactory),
      chainParams[chainId].swapxPairFactory
        ? createSwapxPairProcessor(chainParams[chainId].swapxPairFactory!)
        : undefined,
      chainParams[chainId].swapxAlgebraFactory
        ? createAlgebraProcessor(chainParams[chainId].swapxAlgebraFactory!)
        : undefined,
      chainId === base.id ? createAeroProcessor() : undefined,
      chainId === sonic.id ? createMetropolisProcessor() : undefined,
      chainId === sonic.id ? createShadowProcessor() : undefined,
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
              const [symbols, decimals] = (await Promise.all(
                coins.map(async (coin) => {
                  const tokenContract = new erc20Abi.Contract(ctx, block.header, coin)
                  return Promise.all([tokenContract.symbol(), tokenContract.decimals()])
                }),
              )) as [string[], number[]]

              const pool = new Pool({
                id: `${ctx.chain.id}:${poolAddress}`,
                chainId: ctx.chain.id,
                address: poolAddress,
                name,
                symbol,
                createdAtBlock: block.header.height,
                createdAt: new Date(block.header.timestamp),
                tokens: coins.map((coin) => coin.toLowerCase()),
                symbols,
                decimals,
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
              const [symbols, decimals] = (await Promise.all(
                coins.map(async (coin) => {
                  const tokenContract = new erc20Abi.Contract(ctx, block.header, coin)
                  return Promise.all([tokenContract.symbol(), tokenContract.decimals()])
                }),
              )) as [string[], number[]]

              const pool = new Pool({
                id: `${ctx.chain.id}:${poolAddress}`,
                chainId: ctx.chain.id,
                address: poolAddress,
                name,
                symbol,
                createdAtBlock: block.header.height,
                createdAt: new Date(block.header.timestamp),
                tokens: coins.map((coin) => coin.toLowerCase()),
                symbols,
                decimals,
                exchange: 'curve',
                type: 'stable',
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
            const [symbols, decimals] = (await Promise.all(
              data.coins.map(async (coin) => {
                const tokenContract = new erc20Abi.Contract(ctx, block.header, coin)
                return Promise.all([tokenContract.symbol(), tokenContract.decimals()])
              }),
            )) as [string[], number[]]
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: data.name,
              symbol: data.symbol,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: data.coins.map((coin) => coin.toLowerCase()),
              symbols,
              decimals,
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
            const [symbols, decimals] = (await Promise.all(
              data.coins.map(async (coin) => {
                const tokenContract = new erc20Abi.Contract(ctx, block.header, coin)
                return Promise.all([tokenContract.symbol(), tokenContract.decimals()])
              }),
            )) as [string[], number[]]
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: data.name,
              symbol: data.symbol,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: data.coins.map((coin) => coin.toLowerCase()),
              symbols,
              decimals,
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
            const [symbols, decimals] = (await Promise.all(
              [data.token0, data.token1].map(async (coin) => {
                const tokenContract = new erc20Abi.Contract(ctx, block.header, coin)
                return Promise.all([tokenContract.symbol(), tokenContract.decimals()])
              }),
            )) as [string[], number[]]
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pair}`,
              chainId: ctx.chain.id,
              address: data.pair,
              name,
              symbol,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols,
              decimals,
              exchange: 'swapx',
              type: data.stable ? 'stable' : 'volatile',
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
            const [symbol0, symbol1, decimals0, decimals1, tickSpacing] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
              poolContract.tickSpacing(),
            ])
            const type = `CL${tickSpacing}`
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: `SwapX ${type} ${symbol0}-${symbol1}`,
              symbol: `${type}-${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'swapx',
              type,
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createAeroProcessor = () => {
  const aeroPoolDeployedFilter = logFilter({
    address: [baseAddresses.aerodrome.poolFactory.amm],
    topic0: [aerodromePoolFactoryAbi.events.PoolCreated.topic],
    range: { from: 3200559 },
  })
  const aeroCLPoolDeployedFilter = logFilter({
    address: [baseAddresses.aerodrome.poolFactory.cl],
    topic0: [aerodromeCLPoolFactoryAbi.events.PoolCreated.topic],
    range: { from: 13843704 },
  })
  return defineProcessor({
    name: 'aerodrome-pool-factories',
    from: 3200559,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(aeroPoolDeployedFilter.value)
      processor.addLog(aeroCLPoolDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (aeroPoolDeployedFilter.matches(log)) {
            const data = aerodromePoolFactoryAbi.events.PoolCreated.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.token0)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.token1)
            const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
            ])
            const type = data.stable ? 'sAMM' : 'vAMM'
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: `Aerodrome ${type} ${symbol0}/${symbol1}`,
              symbol: `${type}-${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'aerodrome',
              type,
            })
            pools.set(pool.id, pool)
          } else if (aeroCLPoolDeployedFilter.matches(log)) {
            const data = aerodromeCLPoolFactoryAbi.events.PoolCreated.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.token0)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.token1)
            const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
            ])
            const type = `CL${data.tickSpacing}`
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: `Aerodrome ${type} ${symbol0}/${symbol1}`,
              symbol: `${type}-${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'aerodrome',
              type,
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createMetropolisProcessor = () => {
  const metropolisPoolDeployedFilter = logFilter({
    address: ['0x1570300e9cfec66c9fb0c8bc14366c86eb170ad0'],
    topic0: [metropolisV2FactoryAbi.events.PairCreated.topic],
    range: { from: 3200559 },
  })
  const metropolisLbPoolDeployedFilter = logFilter({
    address: ['0x39d966c1bafe7d3f1f53da4845805e15f7d6ee43'],
    topic0: [metropolisLbFactoryAbi.events.LBPairCreated.topic],
    range: { from: 13843704 },
  })
  return defineProcessor({
    name: 'metropolis-pool-factories',
    from: 276327,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(metropolisPoolDeployedFilter.value)
      processor.addLog(metropolisLbPoolDeployedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (metropolisPoolDeployedFilter.matches(log)) {
            const data = metropolisV2FactoryAbi.events.PairCreated.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.token0)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.token1)
            const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
            ])
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pair}`,
              chainId: ctx.chain.id,
              address: data.pair,
              name: `Metropolis V2 ${symbol0}/${symbol1}`,
              symbol: `${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'metropolis',
              type: 'pair',
            })
            pools.set(pool.id, pool)
          } else if (metropolisLbPoolDeployedFilter.matches(log)) {
            const data = metropolisLbFactoryAbi.events.LBPairCreated.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.tokenX)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.tokenY)
            const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
            ])
            const type = `CL${data.binStep}`
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.LBPair}`,
              chainId: ctx.chain.id,
              address: data.LBPair,
              name: `Metropolis ${type} ${symbol0}/${symbol1}`,
              symbol: `${type}-${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.tokenX.toLowerCase(), data.tokenY.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'metropolis',
              type,
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}

export const createShadowProcessor = () => {
  const shadowV2PairCreatedFilter = logFilter({
    address: ['0x2da25e7446a70d7be65fd4c053948becaa6374c8'],
    topic0: [shadowPairFactoryAbi.events.PairCreated.topic],
    range: { from: 4028276 },
  })
  const shadowV3PoolCreatedFilter = logFilter({
    address: ['0xcd2d0637c94fe77c2896bbcbb174ceffb08de6d7'],
    topic0: [shadowV3FactoryAbi.events.PoolCreated.topic],
    range: { from: 1705781 },
  })
  return defineProcessor({
    name: 'shadow-pool-factories',
    from: 1705781,
    setup: (processor: EvmBatchProcessor) => {
      processor.addLog(shadowV2PairCreatedFilter.value)
      processor.addLog(shadowV3PoolCreatedFilter.value)
    },
    process: async (ctx: Context) => {
      const pools = new Map<string, Pool>()
      for (const block of ctx.blocksWithContent) {
        for (const log of block.logs) {
          if (shadowV2PairCreatedFilter.matches(log)) {
            const data = shadowPairFactoryAbi.events.PairCreated.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.token0)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.token1)
            const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
            ])
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pair}`,
              chainId: ctx.chain.id,
              address: data.pair,
              name: `Shadow Pair ${symbol0}/${symbol1}`,
              symbol: `${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'shadow',
              type: 'pair',
            })
            pools.set(pool.id, pool)
          } else if (shadowV3PoolCreatedFilter.matches(log)) {
            const data = shadowV3FactoryAbi.events.PoolCreated.decode(log)
            const token0Contract = new erc20Abi.Contract(ctx, block.header, data.token0)
            const token1Contract = new erc20Abi.Contract(ctx, block.header, data.token1)
            const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
              token0Contract.symbol(),
              token1Contract.symbol(),
              token0Contract.decimals(),
              token1Contract.decimals(),
            ])
            const pool = new Pool({
              id: `${ctx.chain.id}:${data.pool}`,
              chainId: ctx.chain.id,
              address: data.pool,
              name: `Shadow CL${data.tickSpacing} ${symbol0}/${symbol1}`,
              symbol: `CL${data.tickSpacing}-${symbol0}/${symbol1}`,
              createdAtBlock: block.header.height,
              createdAt: new Date(block.header.timestamp),
              tokens: [data.token0.toLowerCase(), data.token1.toLowerCase()],
              symbols: [symbol0, symbol1],
              decimals: [decimals0, decimals1],
              exchange: 'shadow',
              type: `CL${data.tickSpacing}`,
            })
            pools.set(pool.id, pool)
          }
        }
      }
      await ctx.store.insert([...pools.values()])
    },
  })
}
