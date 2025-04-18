import * as abstractStrategyAbi from '@abi/initializable-abstract-strategy'
import { StrategyBalance } from '@model'
import { Context, EvmBatchProcessor, blockFrequencyUpdater } from '@originprotocol/squid-utils'
import { convertRate } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { IStrategyData } from '@templates/strategy/strategy'
import { processStrategyEarnings, setupStrategyEarnings } from '@templates/strategy/strategy-earnings'
import { addressToSymbol } from '@utils/symbols'

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
  })
  await ctx.store.insert(data)
  await processStrategyEarnings(ctx, strategyData, getStrategyBalances)
}

export const getStrategyBalances = async (ctx: Context, block: { height: number }, strategyData: IStrategyData) => {
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new abstractStrategyAbi.Contract(ctx, block, strategyData.address)
      const balance = await contract.checkBalance(asset.address)
      return { address: strategyData.address, asset: asset.address, balance }
    }),
  )
}
