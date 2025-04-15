import * as erc20 from '@abi/erc20'
import { StrategyBalance } from '@model'
import { Block, Context, EvmBatchProcessor, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { convertRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { addressToSymbol } from '@utils/symbols'
import { convertDecimals } from '@utils/utils'

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
  const strategyBalances: StrategyBalance[] = []
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    const results = await getStrategyHoldings(ctx, block, strategyData)
    strategyBalances.push(...results)
  })
  await ctx.store.insert(strategyBalances)
  await processStrategyEarnings(ctx, strategyData, getStrategyBalances)
}

const getStrategyHoldings = async (
  ctx: Context,
  block: Block,
  strategyData: IStrategyData,
): Promise<StrategyBalance[]> => {
  const data: StrategyBalance[] = []
  const balances = await getStrategyBalances(ctx, block.header, strategyData)
  for (const { address, asset, balance } of balances) {
    data.push(
      new StrategyBalance({
        id: `${ctx.chain.id}:${address}:${asset}:${block.header.height}`,
        chainId: ctx.chain.id,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        otoken: strategyData.oTokenAddress,
        strategy: address,
        asset,
        symbol: addressToSymbol(asset),
        balance,
        balanceETH: await convertRate(ctx, block, asset as CurrencyAddress, 'ETH', balance),
      }),
    )
  }
  return data
}

const getStrategyBalances = async (
  ctx: Context,
  block: {
    height: number
  },
  strategyData: IStrategyData,
) => {
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new erc20.Contract(ctx, block, asset.address)
      const balance = await contract.balanceOf(strategyData.address)
      return {
        address: strategyData.address,
        asset: asset.address,
        balance: convertDecimals(asset.decimals, strategyData.base.decimals, balance),
      }
    }),
  )
}
