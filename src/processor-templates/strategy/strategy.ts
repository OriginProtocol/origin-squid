import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { memoize } from 'lodash'

import * as abstractStrategyAbi from '../../abi/initializable-abstract-strategy'
import * as curvePool from '../../abi/curve-lp-token'
import * as erc20 from '../../abi/erc20'
import * as balancerVaultAbi from '../../abi/balancer-vault'
import * as balancerMetaStablePoolAbi from '../../abi/meta-stable-pool'
import * as balancerRateProvider from '../../abi/balancer-rate-provider'
import * as balancerMetaStablePoolStrategyAbi from '../../abi/balancer-meta-pool-strategy'

import { StrategyBalance } from '../../model'
import { Context, Block } from '../../processor'
import { blockFrequencyUpdater } from '../../utils/blockFrequencyUpdater'
import { ADDRESS_ZERO, BALANCER_VAULT, ETH_ADDRESS, OETH_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'

export type IBalancerPoolInfo = {
  poolId: string,
  poolAddress: string,
}

export type ICurveAMOInfo = {
  poolAddress: string,
  rewardsPoolAddress: string
}

export type IStrategyData = {
  from: number,
  name: string,
  address: string,
  kind: 'Generic' | 'CurveAMO' | 'BalancerMetaStablePool' | 'BalancerComposableStablePool',
  assets: readonly string[],
  balancerPoolInfo?: IBalancerPoolInfo,
  curvePoolInfo?: ICurveAMOInfo,
}

export const createStrategySetup =
  (from: number) => (processor: EvmBatchProcessor) => {
    processor.includeAllBlocks({ from })
  }

// Used by `src/processors/strategies/strategies.ts`
export const createStrategyProcessor = (strategyData: IStrategyData) => {
  const { from, kind } = strategyData
  const update = blockFrequencyUpdater({ from })
  return async (ctx: Context) => {
    const results = {
      strategyBalances: [] as StrategyBalance[],
    }
    await update(ctx, async (ctx, block) => {
      if (kind == 'Generic') {
        results.strategyBalances.push(
          ...(await _getStrategyHoldings(ctx, block, strategyData))
        )
      } else if (kind == 'CurveAMO') {
        results.strategyBalances.push(
          ...(await _getCurveAMOStrategyHoldings(ctx, block, strategyData))
        )
      } else if (kind == 'BalancerMetaStablePool') {
        results.strategyBalances.push(
          ...(await _getBalancerStrategyHoldings(ctx, block, strategyData))
        )
      }
    })
    await ctx.store.insert(results.strategyBalances)
  }
}

const _getStrategyHoldings = async (ctx: Context, block: Block, strategyData: IStrategyData): Promise<StrategyBalance[]> => {
  const { assets, address } = strategyData
  const strategy = new abstractStrategyAbi.Contract(ctx, block.header, address)
  const promises = assets.map(async asset => {
    return new StrategyBalance({
      id: `${address}:${asset}:${block.header.height}`,
      strategy: address,
      asset: asset,
      balance: await strategy.checkBalance(asset),
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp)
    })
  })

  return await Promise.all(promises)
}

const _getCurveAMOStrategyHoldings = async (ctx: Context, block: Block, strategyData: IStrategyData): Promise<StrategyBalance[]> => {
  const { assets, address, curvePoolInfo } = strategyData
  const { poolAddress, rewardsPoolAddress } = curvePoolInfo!

  const pool = new curvePool.Contract(ctx, block.header, poolAddress)
  const rewardsPool = new erc20.Contract(ctx, block.header, rewardsPoolAddress)
  const strategy = new abstractStrategyAbi.Contract(ctx, block.header, address)

  const lpPrice = await pool.get_virtual_price()
  const stakedLPBalance = await rewardsPool.balanceOf(address)
  let unstakedBalance = BigInt(0)

  const poolAssets: string[] = []
  const assetBalances: bigint[] = []
  let totalPoolValue = BigInt(0)
  for (let i = 0; i < assets.length; i++) {
    const balance = await pool.balances(BigInt(i))
    assetBalances.push(balance)
    totalPoolValue += balance

    let coin = (await pool.coins(BigInt(i))).toLowerCase()
    if (coin == ETH_ADDRESS) {
      // Vault only deals in WETH not ETH
      coin = WETH_ADDRESS
    }
    
    if (coin != OETH_ADDRESS) {
      const pTokenAddr = await strategy.assetToPToken(assets[i])
      const pToken = new erc20.Contract(ctx, block.header, pTokenAddr)
      unstakedBalance += await pToken.balanceOf(address)
    }

    poolAssets.push(coin)
  }

  const eth1 = BigInt("1000000000000000000")
  const totalStrategyLPBalance = (stakedLPBalance + unstakedBalance) * lpPrice / eth1

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = BigInt(10000) * assetBalances[i] / totalPoolValue
    const balance = totalStrategyLPBalance * poolAssetSplit / BigInt(10000)

    return new StrategyBalance({
      id: `${address}:${asset}:${block.header.height}`,
      strategy: address,
      asset,
      balance,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp)
    })
  })
}

const _getBalancerStrategyHoldings = async (ctx: Context, block: Block, strategyData: IStrategyData) => {
  const { address, balancerPoolInfo } = strategyData
  const { poolAddress, poolId } = balancerPoolInfo!

  const rateProviders = await _getBalancePoolRateProviders(ctx, block, poolAddress);

  const strategy = new balancerMetaStablePoolStrategyAbi.Contract(ctx, block.header, address)
  const balancerVault = new balancerVaultAbi.Contract(ctx, block.header, BALANCER_VAULT)
  let [poolAssets, balances] = await balancerVault.getPoolTokens(poolId)

  const totalStrategyBalance = await strategy['checkBalance()']() // in WETH
  const eth1 = BigInt("1000000000000000000")

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
      const provider = new balancerRateProvider.Contract(ctx, block.header, rateProviders[i])
      const rate = await provider.getRate()
      assetRates.push(rate)
      tokenBalance = tokenBalance * rate / eth1
    }

    assetBalances.push(tokenBalance) 
    totalPoolValue += tokenBalance // Balance of asset in WETH
  }

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = BigInt(10000) * assetBalances[i] / totalPoolValue
    const balance = eth1 * totalStrategyBalance * poolAssetSplit / assetRates[i] / BigInt(10000)

    return new StrategyBalance({
      id: `${address}:${asset}:${block.header.height}`,
      strategy: address,
      asset,
      balance,
      blockNumber: block.header.height,
      timestamp: new Date(block.header.timestamp)
    })
  })
}

const _getBalancePoolRateProviders = memoize(async (ctx: Context, block: Block, address: string) => {
  const pool = new balancerMetaStablePoolAbi.Contract(ctx, block.header, address)
  const rateProviders = await pool.getRateProviders();
  return rateProviders
}, (_ctx, _block, address) => address.toLowerCase())
