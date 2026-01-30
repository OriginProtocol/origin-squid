import * as curvePool from '@abi/curve-lp-token'
import * as erc20 from '@abi/erc20'
import * as abstractStrategyAbi from '@abi/initializable-abstract-strategy'
import { StrategyBalance } from '@model'
import { Block, Context, EvmBatchProcessor, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { convertRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { ETH_ADDRESS, WETH_ADDRESS } from '@utils/addresses'
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
  let strategyBalances: StrategyBalance[] = []
  for (const { address, asset, balance } of balances) {
    strategyBalances.push(
      new StrategyBalance({
        id: `${ctx.chain.id}:${address}:${asset}:${block.header.height}`,
        chainId: ctx.chain.id,
        otoken: strategyData.oTokenAddress,
        strategy: address,
        asset,
        symbol: addressToSymbol(asset),
        balance,
        balanceETH: await convertRate(ctx, block, asset as CurrencyAddress, 'ETH', balance),
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
      }),
    )
  }
  return strategyBalances
}

export const getStrategyBalances = async (ctx: Context, block: { height: number }, strategyData: IStrategyData) => {
  // Use gauge-based balance calculation if gaugeAddress is provided
  if (strategyData.curvePoolInfo?.gaugeAddress) {
    return getCurveGaugeBalances(ctx, block, strategyData)
  }
  return await Promise.all(
    strategyData.assets
      .filter((asset) => asset.checkBalance !== false)
      .map(async (asset) => {
        const contract = new abstractStrategyAbi.Contract(ctx, block, strategyData.address)
        const balance = await contract.checkBalance(asset.address)
        return { address: strategyData.address, asset: asset.address, balance }
      }),
  )
}

export const getCurveGaugeBalances = async (
  ctx: Context,
  block: { height: number },
  strategyData: IStrategyData,
) => {
  const { address, curvePoolInfo } = strategyData
  const { poolAddress, gaugeAddress } = curvePoolInfo!

  const pool = new curvePool.Contract(ctx, block, poolAddress)
  const gauge = new erc20.Contract(ctx, block, gaugeAddress!)

  // Get pool state in parallel - use balances(i) instead of get_balances() for compatibility
  const [poolBalance0, poolBalance1, totalSupply, strategyLpBalance, coin0, coin1] = await Promise.all([
    pool.balances(0n),
    pool.balances(1n),
    pool.totalSupply(),
    gauge.balanceOf(address),
    pool.coins(0n),
    pool.coins(1n),
  ])

  // Calculate strategy's share of each coin
  const eth1 = 1000000000000000000n
  const share = totalSupply > 0n ? (strategyLpBalance * eth1) / totalSupply : 0n

  return [
    { address, asset: coin0.toLowerCase(), balance: (poolBalance0 * share) / eth1 },
    { address, asset: coin1.toLowerCase(), balance: (poolBalance1 * share) / eth1 },
  ]
}

export const getConvexEthMetaStrategyBalances = async (
  ctx: Context,
  block: { height: number },
  strategyData: IStrategyData,
) => {
  const { assets, address, curvePoolInfo } = strategyData
  const { poolAddress, rewardsPoolAddress } = curvePoolInfo!

  const pool = new curvePool.Contract(ctx, block, poolAddress)
  const rewardsPool = new erc20.Contract(ctx, block, rewardsPoolAddress!)
  const strategy = new abstractStrategyAbi.Contract(ctx, block, address)

  const lpPrice = await pool.get_virtual_price()
  const stakedLPBalance = await rewardsPool.balanceOf(address)
  let unstakedBalance = BigInt(0)

  const pTokenAddresses = new Set<string>()
  const poolAssets: string[] = []
  const assetBalances: bigint[] = []
  let totalPoolValue = BigInt(0)
  for (let i = 0; i < assets.length; i++) {
    const balance = await pool.balances(BigInt(i))
    assetBalances.push(balance)
    totalPoolValue += balance

    let coin = (await pool.coins(BigInt(i))).toLowerCase()
    if (coin !== strategyData.oTokenAddress) {
      const pTokenAddr = await strategy.assetToPToken(
        assets[i].address === ETH_ADDRESS ? WETH_ADDRESS : assets[i].address,
      )
      if (!pTokenAddresses.has(pTokenAddr)) {
        pTokenAddresses.add(pTokenAddr)
        const pToken = new erc20.Contract(ctx, block, pTokenAddr)
        const pTokenBalance = await pToken.balanceOf(address)
        // ctx.log.info({ height: block.height, pTokenAddr, pTokenBalance })
        unstakedBalance += pTokenBalance
      }
    }

    poolAssets.push(coin)
  }

  const eth1 = 1000000000000000000n
  const totalStrategyLPBalance = ((stakedLPBalance + unstakedBalance) * lpPrice) / eth1

  return poolAssets.map((asset, i) => {
    const poolAssetSplit = (eth1 * assetBalances[i]) / totalPoolValue
    const balance = (totalStrategyLPBalance * poolAssetSplit) / eth1
    return { address, asset, balance }
  })
}
