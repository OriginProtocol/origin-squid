import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { pad } from 'viem'

import * as curvePool from '../../../abi/curve-lp-token'
import * as erc20 from '../../../abi/erc20'
import * as abstractStrategyAbi from '../../../abi/initializable-abstract-strategy'
import { StrategyBalance } from '../../../model'
import { Block, Context } from '../../../processor'
import {
  ETH_ADDRESS,
  OETH_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { blockFrequencyUpdater } from '../../../utils/blockFrequencyUpdater'
import { IStrategyData } from './index'
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

const trackers = new Map<string, ReturnType<typeof blockFrequencyUpdater>>()
export const process = async (ctx: Context, strategyData: IStrategyData) => {
  if (!trackers.has(strategyData.address)) {
    trackers.set(
      strategyData.address,
      blockFrequencyUpdater({ from: strategyData.from }),
    )
  }
  const blockFrequencyUpdate = trackers.get(strategyData.address)!
  const data: StrategyBalance[] = []
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    const results = await getCurveAMOStrategyHoldings(ctx, block, strategyData)
    data.push(...results)
  })
  await ctx.store.insert(data)
  await processStrategyEarnings(ctx, strategyData, getStrategyBalances)
}

const getCurveAMOStrategyHoldings = async (
  ctx: Context,
  block: Block,
  strategyData: IStrategyData,
): Promise<StrategyBalance[]> => {
  const balances = await getStrategyBalances(ctx, block.header, strategyData)
  return balances.map(({ address, asset, balance }) => {
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

export const getStrategyBalances = async (
  ctx: Context,
  block: { height: number },
  strategyData: IStrategyData,
) => {
  if (strategyData.address === '0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63') {
    return getConvexEthMetaStrategyBalances(ctx, block, strategyData)
  }
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new abstractStrategyAbi.Contract(
        ctx,
        block,
        strategyData.address,
      )
      const balance = await contract.checkBalance(asset.address)
      return { address: strategyData.address, asset: asset.address, balance }
    }),
  )
}

export const getConvexEthMetaStrategyBalances = async (
  ctx: Context,
  block: { height: number },
  strategyData: IStrategyData,
) => {
  const { assets, address, curvePoolInfo } = strategyData
  const { poolAddress, rewardsPoolAddress } = curvePoolInfo!

  const pool = new curvePool.Contract(ctx, block, poolAddress)
  const rewardsPool = new erc20.Contract(ctx, block, rewardsPoolAddress)
  const strategy = new abstractStrategyAbi.Contract(ctx, block, address)

  const lpPrice = await pool.get_virtual_price()
  const stakedLPBalance = await rewardsPool.balanceOf(address)
  let unstakedBalance = BigInt(0)

  const pTokenAddresses = new Set<string>()
  const poolAssets: string[] = []
  const assetBalances: bigint[] = []
  let totalPoolValue = BigInt(0)
  let coins: Record<string, string> = {}
  for (let i = 0; i < assets.length; i++) {
    const balance = await pool.balances(BigInt(i))
    assetBalances.push(balance)
    totalPoolValue += balance

    let coin = (await pool.coins(BigInt(i))).toLowerCase()
    if (coin == ETH_ADDRESS) {
      // Vault only deals in WETH not ETH
      coin = WETH_ADDRESS
      coins[i] = WETH_ADDRESS
    } else {
      coins[i] = coin
    }

    if (coin !== strategyData.oTokenAddress) {
      const pTokenAddr = await strategy.assetToPToken(assets[i].address)
      if (!pTokenAddresses.has(pTokenAddr)) {
        pTokenAddresses.add(pTokenAddr)
        const pToken = new erc20.Contract(ctx, block, pTokenAddr)
        const pTokenBalance = await pToken.balanceOf(address)
        ctx.log.info({ height: block.height, pTokenAddr, pTokenBalance })
        unstakedBalance += pTokenBalance
      }
    }

    poolAssets.push(coin)
  }

  const eth1 = 1000000000000000000n
  const totalStrategyLPBalance =
    ((stakedLPBalance + unstakedBalance) * lpPrice) / eth1

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = (eth1 * assetBalances[i]) / totalPoolValue
    const balance = (totalStrategyLPBalance * poolAssetSplit) / eth1
    return { address, asset: coins[i].toLowerCase(), balance }
  })
}
