import * as balancerComposableStablePool from '@abi/balancer-composable-stable-pool'
import * as balancerMetaStablePoolAbi from '@abi/balancer-meta-stable-pool'
import * as balancerRateProvider from '@abi/balancer-rate-provider'
import * as balancerVaultAbi from '@abi/balancer-vault'
import * as balancerWeightedPool from '@abi/balancer-weighted-pool-2-token'
import {
  BalancerPool,
  BalancerPoolBalance,
  BalancerPoolRate,
  LiquiditySource,
  LiquiditySourceType,
} from '@model'
import { ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { Currency } from '@shared/post-processors/exchange-rates/currencies'
import { updateLiquidityBalances } from '@shared/post-processors/liquidity'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, BALANCER_VAULT } from '@utils/addresses'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'

import { registerLiquiditySource } from '../../mainnet/processors/liquidity-sources'
import { Context } from '../../processor'

const eth1 = BigInt('1000000000000000000')

interface ProcessResult {
  balancerPoolBalances: BalancerPoolBalance[]
  balancerPoolRates: BalancerPoolRate[]
}

export const createBalancerSetup = (
  from: number,
  processor: EvmBatchProcessor,
) => {
  processor.includeAllBlocks({ from })
}

export const createBalancerInitializer = ({
  name,
  poolAddress,
  tokens,
}: {
  name: string
  poolAddress: string
  tokens:
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
}) => {
  for (const token of tokens) {
    registerLiquiditySource(
      poolAddress,
      LiquiditySourceType.BalancerPool,
      token,
    )
  }
  return async (ctx: Context) => {
    const pool = await ctx.store.findOneBy(BalancerPool, { id: poolAddress })
    if (!pool) {
      await ctx.store.insert(
        new BalancerPool({
          id: poolAddress,
          address: poolAddress,
          name,
          tokenCount: tokens.length,
          token0: tokens[0],
          token1: tokens[1],
          token2: tokens[2],
          token3: tokens[3],
        }),
      )
    }
  }
}

export const createBalancerProcessor = (
  poolAddress: string,
  poolId: string,
  poolType: 'MetaStable' | 'ComposableStable' | 'Weighted' | 'Gyroscope',
  from: number,
  rates?: [Currency, Currency][],
) => {
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const result: ProcessResult = {
      balancerPoolBalances: [],
      balancerPoolRates: [],
    }
    await update(ctx, async (ctx, block) => {
      if (rates) {
        await ensureExchangeRates(ctx, block, rates)
      }
      const balancerVault = new balancerVaultAbi.Contract(
        ctx,
        block.header,
        BALANCER_VAULT,
      )
      const [tokens, balances] = await balancerVault.getPoolTokens(poolId)
      const balance = new BalancerPoolBalance({
        id: `${poolAddress}-${block.header.height}`,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        address: poolAddress,
        balance0: balances[0],
        balance1: balances[1],
        balance2: balances.length > 2 ? balances[2] : 0n,
        balance3: balances.length > 3 ? balances[3] : 0n,
      })
      updateLiquidityBalances(ctx, block, {
        address: poolAddress,
        tokens,
        balances,
      })

      result.balancerPoolBalances.push(balance)

      if (poolType === 'Weighted') {
        const balancerPool = new balancerWeightedPool.Contract(
          ctx,
          block.header,
          poolAddress,
        )
        const rates: bigint[] = [await balancerPool.getRate()]
        const rate = new BalancerPoolRate({
          id: `${poolAddress}-${block.header.height}`,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: poolAddress,
          rate0: rates[0],
          rate1: rates[1] ?? 0n,
          rate2: rates[2] ?? 0n,
          rate3: rates[3] ?? 0n,
        })
        result.balancerPoolRates.push(rate)
      } else if (poolType === 'ComposableStable') {
        const balancerPool = new balancerComposableStablePool.Contract(
          ctx,
          block.header,
          poolAddress,
        )
        const rateProviders = await balancerPool.getRateProviders()
        const rates: bigint[] = []
        for (let i = 0; i < tokens.length; i++) {
          // ctx.log.info(`${rateProviders[i]}`)
          if (rateProviders[i] === ADDRESS_ZERO) {
            rates.push(eth1)
          } else {
            const provider = new balancerRateProvider.Contract(
              ctx,
              block.header,
              rateProviders[i],
            )
            const rate = await provider.getRate()
            rates.push(rate)
          }
        }
        const rate = new BalancerPoolRate({
          id: `${poolAddress}-${block.header.height}`,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: poolAddress,
          rate0: rates[0],
          rate1: rates[1],
          rate2: rates[2] ?? 0n,
          rate3: rates[3] ?? 0n,
        })
        result.balancerPoolRates.push(rate)
      } else if (poolType === 'MetaStable') {
        const balancerPool = new balancerMetaStablePoolAbi.Contract(
          ctx,
          block.header,
          poolAddress,
        )
        const rateProviders = await balancerPool.getRateProviders()
        const rates: bigint[] = []
        for (let i = 0; i < tokens.length; i++) {
          // ctx.log.info(`${rateProviders[i]}`)
          if (rateProviders[i] === ADDRESS_ZERO) {
            rates.push(eth1)
          } else {
            const provider = new balancerRateProvider.Contract(
              ctx,
              block.header,
              rateProviders[i],
            )
            const rate = await provider.getRate()
            rates.push(rate)
          }
        }
        const rate = new BalancerPoolRate({
          id: `${poolAddress}-${block.header.height}`,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          address: poolAddress,
          rate0: rates[0],
          rate1: rates[1],
          rate2: rates[2] ?? 0n,
          rate3: rates[3] ?? 0n,
        })
        result.balancerPoolRates.push(rate)
      }
    })
    await ctx.store.insert(result.balancerPoolBalances)
    await ctx.store.insert(result.balancerPoolRates)
  }
}
