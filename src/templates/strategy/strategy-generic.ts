import * as abstractStrategyAbi from '@abi/initializable-abstract-strategy'
import { StrategyBalance } from '@model'
import { Block, Context } from '@processor'
import { convertRate, ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress, MainnetCurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
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
  const strategyBalances: StrategyBalance[] = []
  await blockFrequencyUpdate(ctx, async (ctx, block) => {
    await ensureExchangeRates(
      ctx,
      block,
      strategyData.assets.map((asset) => ['ETH', asset.address as MainnetCurrencyAddress]),
    )
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

const getStrategyBalances = async (ctx: Context, block: { height: number }, strategyData: IStrategyData) => {
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new abstractStrategyAbi.Contract(ctx, block, strategyData.address)
      const balance = await contract.checkBalance(asset.address)
      return { address: strategyData.address, asset: asset.address, balance }
    }),
  )
}
