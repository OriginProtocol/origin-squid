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
  OETH_DRIPPER_ADDRESS,
  OETH_HARVESTER_ADDRESS,
  WETH_ADDRESS,
} from '../../../utils/addresses'
import { blockFrequencyTracker } from '../../../utils/blockFrequencyUpdater'
import { IStrategyData } from './index'
import { processStrategyEarnings } from './strategy-earnings'

export const setup = (
  processor: EvmBatchProcessor,
  strategyData: IStrategyData,
) => {
  processor.includeAllBlocks({ from: strategyData.from })
  processor.addLog({
    address: [strategyData.address],
    topic0: [
      abstractStrategyAbi.events.Deposit.topic,
      abstractStrategyAbi.events.Withdrawal.topic,
      abstractStrategyAbi.events.RewardTokenCollected.topic,
    ],
  })
  processor.addLog({
    address: [WETH_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
    topic1: [pad(OETH_HARVESTER_ADDRESS)],
    topic2: [pad(OETH_DRIPPER_ADDRESS)],
  })
}

export const process = async (ctx: Context, strategyData: IStrategyData) => {
  const shouldUpdate = blockFrequencyTracker({ from: strategyData.from })
  const data: StrategyBalance[] = []
  for (const block of ctx.blocks) {
    if (shouldUpdate(ctx, block)) {
      const results = await getCurveAMOStrategyHoldings(
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
  const { assets, address, curvePoolInfo } = strategyData
  const { poolAddress, rewardsPoolAddress } = curvePoolInfo!

  const pool = new curvePool.Contract(ctx, block, poolAddress)
  const rewardsPool = new erc20.Contract(ctx, block, rewardsPoolAddress)
  const strategy = new abstractStrategyAbi.Contract(ctx, block, address)

  const lpPrice = await pool.get_virtual_price()
  const stakedLPBalance = await rewardsPool.balanceOf(address)
  let unstakedBalance = BigInt(0)

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

    if (coin != OETH_ADDRESS) {
      const pTokenAddr = await strategy.assetToPToken(assets[i])
      const pToken = new erc20.Contract(ctx, block, pTokenAddr)
      unstakedBalance += await pToken.balanceOf(address)
    }

    poolAssets.push(coin)
  }

  const eth1 = BigInt('1000000000000000000')
  const totalStrategyLPBalance =
    ((stakedLPBalance + unstakedBalance) * lpPrice) / eth1

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = (BigInt(10000) * assetBalances[i]) / totalPoolValue
    const balance = (totalStrategyLPBalance * poolAssetSplit) / BigInt(10000)
    return { address, asset: coins[i], balance }
  })
}
