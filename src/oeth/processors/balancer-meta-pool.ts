import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as balancerMetaPoolStrategy from '../../abi/balancer-meta-pool-strategy'
import * as baseRewardPool4626 from '../../abi/base-reward-pool-4626'
import * as metaStablePool from '../../abi/meta-stable-pool'
import { OETHBalancerMetaPoolStrategy } from '../../model'
import { Context } from '../../processor'
import { ensureExchangeRates } from '../../shared/post-processors/exchange-rates'
import { getBalancerStrategyHoldings } from '../../shared/processor-templates/strategy'
import { RETH_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'
import { getLatestEntity } from '../../utils/utils'
import { oethStrategies } from './strategies'

const strategyDeployBlock = 18156219

export const from = strategyDeployBlock // https://etherscan.io/tx/0x41c4c0e86ef95e0bfaac7bd94f30f7c30505278f5d7d70c4e99deb4d79b14f58
const addresses = {
  originLens: '0x6590e684c23dbea7fc61598f601a36e9bbd0c7d9',
  strategy: '0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc',
  lpToken: '0x1e19cf2d73a72ef1332c882f20534b6519be0276',
  auraRewardsPool: '0xdd1fe5ad401d4777ce89959b7fa587e569bf125d',
  balancerVault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
}
const poolId =
  '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112'

const strategyData = oethStrategies.find(
  (s) => s.address === addresses.strategy,
)!

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [addresses.strategy],
    topic0: [
      balancerMetaPoolStrategy.events.Deposit.topic,
      balancerMetaPoolStrategy.events.Withdrawal.topic,
    ],
    range: { from },
  })
  processor.addLog({
    address: [addresses.lpToken],
    topic0: [
      metaStablePool.events.Transfer.topic,
      metaStablePool.events.PriceRateCacheUpdated.topic,
    ],
    range: { from },
  })
  processor.addLog({
    address: [addresses.auraRewardsPool],
    topic0: [
      baseRewardPool4626.events.Transfer.topic,
      baseRewardPool4626.events.Staked.topic,
      baseRewardPool4626.events.Deposit.topic,
      baseRewardPool4626.events.Withdrawn.topic,
      baseRewardPool4626.events.Withdraw.topic,
    ],
    range: { from },
  })
}

const addressesToListenTo = new Set([
  addresses.strategy,
  addresses.lpToken,
  addresses.auraRewardsPool,
  addresses.balancerVault,
])
const topicsToListenTo = new Set([
  balancerMetaPoolStrategy.events.Deposit.topic,
  balancerMetaPoolStrategy.events.Withdrawal.topic,
  metaStablePool.events.Transfer.topic,
  metaStablePool.events.PriceRateCacheUpdated.topic,
  baseRewardPool4626.events.Transfer.topic,
  baseRewardPool4626.events.Staked.topic,
  baseRewardPool4626.events.Deposit.topic,
  baseRewardPool4626.events.Withdrawn.topic,
  baseRewardPool4626.events.Withdraw.topic,
])

interface ProcessResult {
  strategies: OETHBalancerMetaPoolStrategy[]
  promises: Promise<unknown>[]
}

export const process = async (ctx: Context) => {
  const result: ProcessResult = {
    strategies: [],
    promises: [], // Anything async we can wait for at the end of our loop.
  }

  for (const block of ctx.blocks) {
    if (block.header.height < from) continue
    const shouldUpdate = !!block.logs.find(
      (log) =>
        addressesToListenTo.has(log.address) &&
        topicsToListenTo.has(log.topics[0]),
    )
    if (shouldUpdate) {
      await updateValues(ctx, block, result)
    }
  }
  await ctx.store.insert(result.strategies)
}

export const updateValues = async (
  ctx: Context,
  block: Context['blocks']['0'],
  result: ProcessResult,
) => {
  result.promises.push(
    ensureExchangeRates(ctx, block, [
      ['ETH', 'WETH'],
      ['ETH', 'rETH'],
    ]),
  )
  const timestampId = new Date(block.header.timestamp).toISOString()
  const [{ current, latest }, { rETH, weth }] = await Promise.all([
    getLatestEntity(
      ctx,
      OETHBalancerMetaPoolStrategy,
      result.strategies,
      timestampId,
    ),
    getBalancerStrategyHoldings(ctx, block, strategyData).then((holdings) => {
      return {
        rETH: holdings.find((h) => h.asset.toLowerCase() === RETH_ADDRESS)!
          .balance,
        weth: holdings.find((h) => h.asset.toLowerCase() === WETH_ADDRESS)!
          .balance,
      }
    }),
  ])

  if (!current) {
    if (!latest || latest.rETH !== rETH || latest.weth !== weth) {
      const entry = new OETHBalancerMetaPoolStrategy({
        id: timestampId,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        rETH: rETH,
        weth: weth,
      })
      result.strategies.push(entry)
    }
  }
}
