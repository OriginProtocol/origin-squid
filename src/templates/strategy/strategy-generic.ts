import * as abstractStrategyAbi from '@abi/initializable-abstract-strategy'
import { StrategyBalance } from '@model'
import { Block, Context, blockFrequencyTracker, logFilter } from '@originprotocol/squid-utils'
import { convertRate, ensureExchangeRates } from '@shared/post-processors/exchange-rates'
import { CurrencyAddress, MainnetCurrencyAddress } from '@shared/post-processors/exchange-rates/mainnetCurrencies'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { addressToSymbol } from '@utils/symbols'

import { IStrategyData } from './index'
import { processStrategyEarnings, setupStrategyEarnings } from './strategy-earnings'

const getFilter = (strategyData: IStrategyData) => {
  return {
    depositFilter: logFilter({
      address: [strategyData.address],
      topic0: [abstractStrategyAbi.events.Deposit.topic],
      range: { from: strategyData.from },
    }),
    withdrawFilter: logFilter({
      address: [strategyData.address],
      topic0: [abstractStrategyAbi.events.Withdrawal.topic],
      range: { from: strategyData.from },
    }),
  }
}

export const setup = (processor: EvmBatchProcessor, strategyData: IStrategyData) => {
  const { depositFilter, withdrawFilter } = getFilter(strategyData)
  processor.addLog(depositFilter.value)
  processor.addLog(withdrawFilter.value)
  processor.includeAllBlocks({ from: strategyData.from })
  setupStrategyEarnings(processor, strategyData)
}

const trackers = new Map<string, ReturnType<typeof blockFrequencyTracker>>()
export const process = async (ctx: Context, strategyData: IStrategyData) => {
  if (!trackers.has(strategyData.address)) {
    trackers.set(strategyData.address, blockFrequencyTracker({ from: strategyData.from }))
  }
  const { depositFilter, withdrawFilter } = getFilter(strategyData)
  const tracker = trackers.get(strategyData.address)!
  const strategyBalances: StrategyBalance[] = []
  const processStrategyBalance = async (ctx: Context, block: Block) => {
    await ensureExchangeRates(
      ctx,
      block,
      strategyData.assets.map((asset) => ['ETH', asset.address as MainnetCurrencyAddress]),
    )
    const results = await getStrategyHoldings(ctx, block, strategyData)
    strategyBalances.push(...results)
  }
  for (const block of ctx.blocks) {
    const intervalMatch = tracker(ctx, block)
    const match = intervalMatch || block.logs.find((log) => depositFilter.matches(log) || withdrawFilter.matches(log))
    if (match) {
      await processStrategyBalance(ctx, block)
    }
  }
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

const getStrategyBalances = async (ctx: Context, block: { height: number }, strategyData: IStrategyData) => {
  return await Promise.all(
    strategyData.assets.map(async (asset) => {
      const contract = new abstractStrategyAbi.Contract(ctx, block, strategyData.address)
      const balance = await contract.checkBalance(asset.address)
      return { address: strategyData.address, asset: asset.address, balance }
    }),
  )
}
