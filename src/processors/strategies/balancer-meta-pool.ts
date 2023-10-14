import { EvmBatchProcessor } from '@subsquid/evm-processor'

import * as balancerMetaPoolStrategy from '../../abi/balancer-meta-pool-strategy'
import * as baseRewardPool4626 from '../../abi/base-reward-pool-4626'
import * as metaStablePool from '../../abi/meta-stable-pool'
import * as originLens from '../../abi/origin-lens'
import { OETHBalancerMetaPoolStrategy } from '../../model'
import { ensureExchangeRates } from '../../post-processors/exchange-rates'
import { Context } from '../../processor'
import { RETH_ADDRESS, WETH_ADDRESS } from '../../utils/addresses'
import { getLatestEntity } from '../utils'

const strategyDeployBlock = 18156219
const originLensProxyDeployBlock = 18292379

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

export const setup = (processor: EvmBatchProcessor) => {
  processor.addLog({
    address: [addresses.strategy],
    topic0: [
      balancerMetaPoolStrategy.events.Deposit.topic,
      balancerMetaPoolStrategy.events.Withdrawal.topic,
    ],
  })
  processor.addLog({
    address: [addresses.lpToken],
    topic0: [
      metaStablePool.events.Transfer.topic,
      metaStablePool.events.PriceRateCacheUpdated.topic,
    ],
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
  const strategy = new balancerMetaPoolStrategy.Contract(
    ctx,
    block.header,
    addresses.strategy,
  )
  const lens = new originLens.Contract(ctx, block.header, addresses.originLens)
  const [{ current, latest }, { total, rETH, weth }] = await Promise.all([
    getLatestEntity(
      ctx,
      OETHBalancerMetaPoolStrategy,
      result.strategies,
      timestampId,
    ),
    block.header.height < originLensProxyDeployBlock
      ? Promise.all([
          strategy['checkBalance()'](),
          strategy['checkBalance(address)'](RETH_ADDRESS),
          strategy['checkBalance(address)'](WETH_ADDRESS),
        ]).then(([total, rETH, weth]) => ({ total, rETH, weth }))
      : lens
          .getStrategyBalances(addresses.strategy)
          .then(({ assetBalances: [rETH, weth] }) => ({
            total: rETH + weth,
            rETH,
            weth,
          })),
  ])

  if (!current) {
    if (
      !latest ||
      latest.total !== total ||
      latest.rETH !== rETH ||
      latest.weth !== weth
    ) {
      result.strategies.push(
        new OETHBalancerMetaPoolStrategy({
          id: timestampId,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          total: total,
          rETH: rETH,
          weth: weth,
        }),
      )
    }
  }
}
