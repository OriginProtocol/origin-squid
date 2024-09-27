import * as balancerMetaStablePoolStrategyAbi from '@abi/balancer-meta-pool-strategy'
import * as balancerRateProvider from '@abi/balancer-rate-provider'
import * as balancerVaultAbi from '@abi/balancer-vault'
import { StrategyBalance } from '@model'
import { Context } from '@processor'
import { convertRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { getBalancePoolRateProviders } from '@shared/post-processors/exchange-rates/price-routing-mainnet'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { ADDRESS_ZERO, BALANCER_VAULT, ETH_ADDRESS, WETH_ADDRESS } from '@utils/addresses'
import { blockFrequencyUpdater } from '@utils/blockFrequencyUpdater'
import { addressToSymbol } from '@utils/symbols'

import { IStrategyData } from './index'
import { processStrategyEarnings, setupStrategyEarnings } from './strategy-earnings'

export const setup = (processor: EvmBatchProcessor, strategyData: IStrategyData) => {
  processor.includeAllBlocks({ from: strategyData.from })
  setupStrategyEarnings(processor, strategyData)
}

const trackers = new Map<string, ReturnType<typeof blockFrequencyUpdater>>()
export const process = async (ctx: Context, strategyData: IStrategyData) => {
  if (!trackers.has(strategyData.address)) {
    trackers.set(strategyData.address, blockFrequencyUpdater({ from: strategyData.from }))
  }
  const blockFrequencyUpdate = trackers.get(strategyData.address)!
  const data: StrategyBalance[] = []
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    const balances = await getBalancerStrategyHoldings(ctx, block.header, strategyData)
    for (const { address, asset, balance } of balances) {
      data.push(
        new StrategyBalance({
          id: `${ctx.chain.id}:${address}:${asset}:${block.header.height}`,
          chainId: ctx.chain.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          strategy: address,
          asset,
          symbol: addressToSymbol(asset),
          balance,
          balanceETH: await convertRate(ctx, block, asset as CurrencyAddress, 'ETH', balance),
        }),
      )
    }
  })
  await ctx.store.insert(data)
  await processStrategyEarnings(ctx, strategyData, getStrategyETHBalance)
}

export const getStrategyETHBalance = async (ctx: Context, block: { height: number }, strategyData: IStrategyData) => {
  const { address } = strategyData
  const strategy = new balancerMetaStablePoolStrategyAbi.Contract(ctx, block, address)
  return [
    {
      address,
      asset: WETH_ADDRESS,
      balance: await strategy['checkBalance()'](),
    },
  ]
}

export const getBalancerStrategyHoldings = async (
  ctx: Context,
  block: { height: number },
  strategyData: IStrategyData,
) => {
  const { address, balancerPoolInfo } = strategyData
  const { poolAddress, poolId } = balancerPoolInfo!

  const rateProviders = await getBalancePoolRateProviders(ctx, block, poolAddress)

  const strategy = new balancerMetaStablePoolStrategyAbi.Contract(ctx, block, address)
  const balancerVault = new balancerVaultAbi.Contract(ctx, block, BALANCER_VAULT)
  const { tokens: poolAssets, balances } = await balancerVault.getPoolTokens(poolId)

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

    if (ADDRESS_ZERO === rateProviders[i]) {
      assetRates.push(eth1)
    } else {
      const provider = new balancerRateProvider.Contract(ctx, block, rateProviders[i])
      const rate = await provider.getRate()
      assetRates.push(rate)
      tokenBalance = (tokenBalance * rate) / eth1
    }

    assetBalances.push(tokenBalance)
    totalPoolValue += tokenBalance // Balance of asset in WETH
  }

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = (BigInt(10000) * assetBalances[i]) / totalPoolValue
    const balance = (eth1 * totalStrategyBalance * poolAssetSplit) / assetRates[i] / BigInt(10000)

    return { address, asset: asset.toLowerCase(), balance }
  })
}
