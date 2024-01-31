import { formatEther } from 'viem'

import * as curveLpToken from '../../abi/curve-lp-token'
import * as curveLpToken2 from '../../abi/curve-lp-token-2'
import { LiquidityDepth, LiquiditySourceType } from '../../model'
import { Block, Context } from '../../processor'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'
import { multicall } from '../../utils/multicall'
import { useProcessorState } from '../../utils/state'
import { registerLiquiditySource } from '../liquidity'
import { getCurveContract } from '../processor-templates/curve'
import { curvePools } from '../processors/curve'
import { ensureExchangeRate } from './exchange-rates'
import { CurrencyAddress } from './exchange-rates/currencies'

export const useStrategyBalance = (ctx: Context) =>
  useProcessorState(
    ctx,
    'strategy-balance',
    {} as Record<string, bigint | undefined>,
  )

export const updateStrategyBalance = (
  ctx: Context,
  block: Block,
  params: {
    token: string
    balance: bigint
  },
) => {
  const [strategyBalances] = useStrategyBalance(ctx)
  const key = `${block.header.height}:${params.token}`
  strategyBalances[key] = (strategyBalances[key] ?? 0n) + params.balance
}

export interface LiquidityPath {
  name: string
  address: string
  from: string
  to: string
  fn: (ctx: Context, block: Block, amount: bigint[]) => Promise<bigint[]>
}

const liquidityPaths: LiquidityPath[] = []
const liquidityTests = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

export const addLiquidityPath = (params: LiquidityPath) => {
  liquidityPaths.push(params)
}

export const initialize = async () => {
  for (const { name, address, tokens, version_get_dy } of curvePools) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      registerLiquiditySource(address, LiquiditySourceType.CurvePool, token)
      for (let j = 0; j < tokens.length; j++) {
        const tokenB = tokens[j]
        if (token !== tokenB) {
          addLiquidityPath({
            name,
            address,
            from: token,
            to: tokenB,
            fn: (ctx: Context, block: Block, amounts: bigint[]) => {
              const abi =
                version_get_dy === 'uint256' ? curveLpToken2 : curveLpToken
              return multicall(
                ctx,
                block.header,
                abi.functions.get_dy,
                address,
                amounts.map((amount) => [BigInt(i), BigInt(j), amount]),
              )
            },
          })
        }
      }
    }
  }
}

const updater = blockFrequencyUpdater({
  from: 19000000,
  staticFrequency: 300,
})
/**
 * This depends on strategy balances coming from OETH,
 *   so we want to run this post-processor with OETH.
 */
export const process = async (ctx: Context) => {
  const [strategyBalances] = useStrategyBalance(ctx)
  const results = {
    liquidityDepths: [] as LiquidityDepth[],
  }
  await updater(ctx, async (ctx: Context, block: Block) => {
    // Determine the costs of moving liquidity
    await Promise.all(
      liquidityPaths.map(async (path) => {
        const strategyBalanceKey = `${block.header.height}:${path.from}`
        const pathBalance = strategyBalances[strategyBalanceKey] ?? 0n
        if (pathBalance === 0n) return // skip it!
        // const runTest = async (name: string, fromAmount: bigint) => {
        //   const id = `${block.header.height}:${path.address}:${path.from}:${path.to}:${name}`
        //   const toAmount = await path
        //     .fn(ctx, block, fromAmount)
        //     .catch((err) => {
        //       if (err.code === 3 || err.value === '0x') {
        //         return 0n
        //       } else {
        //         ctx.log.error({ err: JSON.stringify(err) })
        //         throw err
        //       }
        //     })
        //   return new LiquidityDepth({
        //     id,
        //     blockNumber: block.header.height,
        //     timestamp: new Date(block.header.timestamp),
        //     address: path.address,
        //     name,
        //     from: path.from,
        //     fromAmount,
        //     to: path.to,
        //     toAmount,
        //   })
        // }
        const fromAmounts = liquidityTests.map(
          (test) => (pathBalance * BigInt(test * 100)) / 100n,
        )
        const toAmounts = await path.fn(ctx, block, fromAmounts)
        const pathResults = toAmounts.map((toAmount, i) => {
          const name = `strategy-${(liquidityTests[i] * 100).toFixed(0)}%`
          const id = `${block.header.height}:${path.address}:${path.from}:${path.to}:${name}`
          return new LiquidityDepth({
            id,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp),
            address: path.address,
            name: name,
            from: path.from,
            fromAmount: fromAmounts[i],
            to: path.to,
            toAmount,
          })
        })
        const rate = await ensureExchangeRate(
          ctx,
          block,
          path.from as CurrencyAddress,
          path.to as CurrencyAddress,
        )
        ctx.log.info({
          name: 'exchange-rate',
          rate: formatEther(rate?.rate ?? 0n),
        })
        for (const result of pathResults) {
          ctx.log.info({
            name: result.name,
            rate: formatEther(
              (result.toAmount * 10n ** 18n) / result.fromAmount,
            ),
          })
        }

        results.liquidityDepths.push(...pathResults)
      }),
    )
    await ctx.store.upsert(results.liquidityDepths)
  })
}

export const pathsToETH = () => {
  // What'll it be?!
}
