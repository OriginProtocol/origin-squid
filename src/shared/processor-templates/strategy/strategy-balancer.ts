import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { memoize } from 'lodash'

import * as balancerMetaStablePoolStrategyAbi from '../../../abi/balancer-meta-pool-strategy'
import * as balancerRateProvider from '../../../abi/balancer-rate-provider'
import * as balancerVaultAbi from '../../../abi/balancer-vault'
import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import * as balancerMetaStablePoolAbi from '../../../abi/meta-stable-pool'
import { StrategyBalance } from '../../../model'
import { Block, Context } from '../../../processor'
import {
  ADDRESS_ZERO,
  BALANCER_VAULT,
  ETH_ADDRESS,
  OETH_HARVESTER_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { blockFrequencyTracker } from '../../../utils/blockFrequencyUpdater'
import { IStrategyData } from './index'
import { getStrategyBalances } from './strategy-curve-amo'
import {
  processStrategyEarnings,
  setupStrategyEarnings,
} from './strategy-earnings'

export const setup = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  processor.includeAllBlocks({ from: strategyData.from })
  setupStrategyEarnings(processor, strategyData)
}

export const process = async (ctx: Context, strategyData: IStrategyData) => {
  const shouldUpdate = blockFrequencyTracker({ from: strategyData.from })
  const data: StrategyBalance[] = []
  for (const block of ctx.blocks) {
    if (shouldUpdate(ctx, block)) {
      const results = await getBalancerStrategyHoldings(
        ctx,
        block,
        strategyData,
      )
      data.push(...results)
    }
  }
  await ctx.store.insert(data)
  await processStrategyEarnings(ctx, strategyData, getStrategyBalances)
}

export const getBalancerStrategyHoldings = async (
  ctx: Context,
  block: Block,
  strategyData: IStrategyData,
) => {
  const { address, balancerPoolInfo } = strategyData
  const { poolAddress, poolId } = balancerPoolInfo!

  const rateProviders = await _getBalancePoolRateProviders(
    ctx,
    block,
    poolAddress,
  )

  const strategy = new balancerMetaStablePoolStrategyAbi.Contract(
    ctx,
    block.header,
    address,
  )
  const balancerVault = new balancerVaultAbi.Contract(
    ctx,
    block.header,
    BALANCER_VAULT,
  )
  let [poolAssets, balances] = await balancerVault.getPoolTokens(poolId)

  const totalStrategyBalance = await strategy['checkBalance()']() // in WETH
  const eth1 = BigInt('1000000000000000000')

  let totalPoolValue = BigInt(0)
  const assetBalances: bigint[] = []
  const assetRates: bigint[] = []
  for (let i = 0; i < poolAssets.length; i++) {
    let tokenBalance = balances[i] // Balance of asset

    if ([ADDRESS_ZERO, WETH_ADDRESS, ETH_ADDRESS].includes(poolAssets[i])) {
      poolAssets[i] = WETH_ADDRESS
    }

    if (ADDRESS_ZERO == rateProviders[i]) {
      assetRates.push(eth1)
    } else {
      const provider = new balancerRateProvider.Contract(
        ctx,
        block.header,
        rateProviders[i],
      )
      const rate = await provider.getRate()
      assetRates.push(rate)
      tokenBalance = (tokenBalance * rate) / eth1
    }

    assetBalances.push(tokenBalance)
    totalPoolValue += tokenBalance // Balance of asset in WETH
  }

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = (BigInt(10000) * assetBalances[i]) / totalPoolValue
    const balance =
      (eth1 * totalStrategyBalance * poolAssetSplit) /
      assetRates[i] /
      BigInt(10000)

    return new StrategyBalance({
      id: `${address}:${asset}:${block.header.height}`,
      strategy: address,
      asset,
      balance,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp),
    })
  })
}

const _getBalancePoolRateProviders = memoize(
  async (ctx: Context, block: Block, address: string) => {
    const pool = new balancerMetaStablePoolAbi.Contract(
      ctx,
      block.header,
      address,
    )
    const rateProviders = await pool.getRateProviders()
    return rateProviders
  },
  (_ctx, _block, address) => address.toLowerCase(),
)
