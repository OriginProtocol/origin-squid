import 'tsconfig-paths/register'
import { formatUnits } from 'viem'

import * as aerodromeLPSugarAbi from '@abi/aerodrome-lp-sugar-v3'
import * as mixedQuoterAbi from '@abi/aerodrome-mixed-quoter.extended'
import * as erc20Abi from '@abi/erc20'
import * as otokenAbi from '@abi/otoken'
import { Context, defineProcessor, logFilter, multicall, run } from '@originprotocol/squid-utils'
import { ensureExchangeRate } from '@shared/post-processors/exchange-rates'
import { CurrencySymbol } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { priceMap } from '@shared/post-processors/exchange-rates/price-routing-mainnet'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { OUSD_ADDRESS } from '@utils/addresses'
import { baseAddresses } from '@utils/addresses-base'
import { getCoingeckoData } from '@utils/coingecko2'

const testRate = {
  name: 'test',
  from: 20837855,
  setup: (p: EvmBatchProcessor) => {
    p.includeAllBlocks({ from: 20837855 })
  },
  process: async (ctx: Context) => {
    // Validate that we're getting otoken rates the way we want to.

    for (const [pair, [getPrice, decimals]] of Object.entries(priceMap)) {
      const rate = await ensureExchangeRate(
        ctx,
        ctx.blocks[0],
        pair.split('_')[0] as CurrencySymbol,
        pair.split('_')[1] as CurrencySymbol,
      )
      console.log(`${pair} = ${Number(rate?.rate) / 10 ** decimals}`)
    }

    process.exit(0)
  },
}

const testCoingecko = {
  name: 'test-coingecko',
  from: 20933088,
  setup: (p: EvmBatchProcessor) => {
    p.includeAllBlocks({ from: 20837855 })
  },
  process: async (ctx: Context) => {
    const ognData = await getCoingeckoData(ctx, {
      coinId: 'origin-protocol',
      vsCurrency: 'usd',
    })
    const ousdData = await getCoingeckoData(ctx, {
      coinId: 'origin-dollar',
      vsCurrency: 'usd',
    })
    const oethData = await getCoingeckoData(ctx, {
      coinId: 'origin-ether',
      vsCurrency: 'eth',
    })
    const superoethData = await getCoingeckoData(ctx, {
      coinId: 'super-oeth',
      vsCurrency: 'eth',
    })
    console.log('got all data OK')
    process.exit(0)
  },
}

const testAerodromeSugar = {
  name: 'test-aerodrome-sugar',
  from: 22620028,
  setup: (p: EvmBatchProcessor) => {
    p.includeAllBlocks({ from: 22620028 })
  },
  process: async (ctx: Context) => {
    const sugar = new aerodromeLPSugarAbi.Contract(
      ctx,
      ctx.blocks[0].header,
      '0x51f290CCCD6a54Af00b38edDd59212dE068B8A4b',
    )
    let all = []
    let offset = 0
    let limit = 200
    while (true) {
      console.log(`offset: ${offset}`)
      const res = await sugar.all(limit, offset)
      all.push(...res)
      offset += limit
      if (res.length < limit) break
    }
    console.log(all.find((a) => a.lp.toLowerCase() === '0x295e0f68384ac506b0c033592eef9674da5e4f99'))
    process.exit(0)
  },
}

const testMixedQuoter = {
  name: 'test-mixed-quoter',
  from: 22620028,
  setup: (p: EvmBatchProcessor) => {
    p.includeAllBlocks({ from: 22620028 })
  },
  process: async (ctx: Context) => {
    const quoter = new mixedQuoterAbi.Contract(ctx, ctx.blocks[0].header, '0x0a5aa5d3a4d28014f967bf0f29eaa3ff9807d5c6')
    const pairs = [
      { factor: 100, tokenIn: baseAddresses.tokens.AERO, tokenOut: baseAddresses.superOETHb.address, stable: false },
      {
        factor: 1000000,
        tokenIn: baseAddresses.tokens.AERO,
        tokenOut: baseAddresses.tokens.USDC,
        decimals: 6,
        stable: false,
      },
      { factor: 100, tokenIn: baseAddresses.tokens.AERO, tokenOut: baseAddresses.tokens.WETH, stable: false },
      { factor: 100, tokenIn: baseAddresses.tokens.AERO, tokenOut: baseAddresses.tokens.WETH, tickSpacing: 200 },
    ]

    for (const tokens of pairs) {
      console.log(
        `${tokens.tokenIn} -> ${tokens.tokenOut} ${tokens.stable ? 'stable' : ''} ${
          tokens.tickSpacing ? `CL${tokens.tickSpacing}` : ''
        }`,
      )
      const getAmountOut = async (amountIn: bigint) => {
        if ('tickSpacing' in tokens && tokens.tickSpacing) {
          return await quoter
            .quoteExactInputSingleV3({
              tokenIn: tokens.tokenIn,
              tokenOut: tokens.tokenOut,
              amountIn,
              tickSpacing: tokens.tickSpacing,
              sqrtPriceLimitX96: 0n,
            })
            .then((res) => res.amountOut)
        }
        if ('stable' in tokens && tokens.stable) {
          return await quoter.quoteExactInputSingleV2({
            tokenIn: tokens.tokenIn,
            tokenOut: tokens.tokenOut,
            amountIn,
            stable: tokens.stable,
          })
        }
        return await quoter.quoteExactInputSingleV2({
          tokenIn: tokens.tokenIn,
          tokenOut: tokens.tokenOut,
          amountIn,
          stable: false,
        })
      }
      const decimalsIn = 18
      const decimalsOut = tokens.decimals ?? 18
      const initialAmountOut = await getAmountOut(10n ** BigInt(decimalsIn))
      const initialRate = Number(initialAmountOut) / 10 ** decimalsOut
      console.log('Initial rate:', initialRate)
      // Calculate amountIn needed for 100 tokens out
      let targetAmountOut = tokens.factor
      const startingAmountIn = BigInt(Math.floor((targetAmountOut / initialRate) * 10 ** decimalsIn))

      let amountIn = startingAmountIn
      while (true) {
        const amountOut = await getAmountOut(amountIn)
        const effectiveRate = Number(amountOut) / (Number(amountIn) / 10 ** (decimalsIn - decimalsOut))
        const slippage = (initialRate - effectiveRate) / initialRate
        console.log(
          `amountIn: ${formatUnits(amountIn, decimalsIn)}`,
          `amountOut: ${formatUnits(amountOut, decimalsOut)}`,
          `effectiveRate: ${effectiveRate}`,
          `slippage: ${slippage}`,
        )
        // Calculate new amountIn needed for targetAmountOut + 100 based on current rate
        targetAmountOut += tokens.factor
        amountIn = BigInt(Math.floor((targetAmountOut / effectiveRate) * 10 ** 18))
        if (slippage > 0.2) {
          console.log('slippage over 20%')
          break
        }
      }
    }
    process.exit(0)
  },
}

const ousdTransferFilter = logFilter({
  address: [OUSD_ADDRESS],
  topic0: [erc20Abi.events.Transfer.topic],
  range: { from: 10884563 },
})

const addressSet = new Set<string>()

const getOUSDAddresses = defineProcessor({
  name: 'get-ousd-addresses',
  from: 10884563,
  setup: (p: EvmBatchProcessor) => {
    p.addLog(ousdTransferFilter.value)
    p.includeAllBlocks({ from: 11585978 })
  },
  process: async (ctx: Context) => {
    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        const data = erc20Abi.events.Transfer.decode(log)
        if (data.from && data.from !== '0x0000000000000000000000000000000000000000') {
          addressSet.add(data.from)
        }
        if (data.to && data.to !== '0x0000000000000000000000000000000000000000') {
          addressSet.add(data.to)
        }
      }
      const addressList = Array.from(addressSet.values())
      if (block.header.height === 11585978) {
        const balances = await multicall(
          ctx,
          block.header,
          otokenAbi.functions.creditsBalanceOf,
          OUSD_ADDRESS,
          addressList.map((a) => ({ _account: a })),
        )
        const balanceMap = new Map(balances.map((b, i) => [addressList[i], b]))
        console.log(balanceMap)
        debugger
      }
    }
  },
})

if (require.main === module) {
  console.log('process:test running')
  run({
    chainId: 1,
    stateSchema: 'test-processor',
    processors: [
      // testRate,
      // testCoingecko,
      // testAerodromeSugar,
      // testMixedQuoter,
      getOUSDAddresses,
    ],
    postProcessors: [],
    validators: [],
  }).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
