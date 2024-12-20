import { compact, groupBy } from 'lodash'

import { OTokenActivity } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { approvalActivityProcessor } from '@templates/otoken/activity-processor/sub/approval'
import { balancerActivityProcessor } from '@templates/otoken/activity-processor/sub/balancer'
import { ccipBridgeActivityProcessor } from '@templates/otoken/activity-processor/sub/ccip-bridge'
import { cowSwapActivityProcessor } from '@templates/otoken/activity-processor/sub/cow-swap'
import { curveActivityProcessor } from '@templates/otoken/activity-processor/sub/curve'
import { transferActivityProcessor } from '@templates/otoken/activity-processor/sub/transfer'
import { uniswapV3ActivityProcessor } from '@templates/otoken/activity-processor/sub/uniswap-v3'
import { vaultActivityProcessor } from '@templates/otoken/activity-processor/sub/vault'
import { wrappedActivityProcessor } from '@templates/otoken/activity-processor/sub/wrapped'
import { zapperActivityProcessor } from '@templates/otoken/activity-processor/sub/zapper'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'

export const createOTokenActivityProcessor = (params: {
  from: number
  otokenAddress: string
  vaultAddress: string
  wotokenAddress?: string
  wotokenArbitrumAddress?: string

  cowSwap: boolean
  zapperAddress?: string
  curvePools?: {
    address: string
    tokens: string[]
  }[]
  balancerPools?: string[]
  uniswapV3?: { address: string; tokens: [string, string] }
}) => {
  const processors: ActivityProcessor[] = compact([
    // TODO: Morpho Blue: https://etherscan.io/tx/0xde3e7e991f70979ffdfaf0652b4c2722773416341ca78dcdaabd3cae98f8204d#eventlog

    // Approvals
    approvalActivityProcessor(params),

    // Bridges
    params.wotokenAddress &&
      ccipBridgeActivityProcessor({
        otokenAddress: params.otokenAddress,
        wotokenAddresses: compact([params.wotokenAddress, params.wotokenArbitrumAddress]),
      }),

    // Zaps
    params.zapperAddress &&
      zapperActivityProcessor({
        otokenAddress: params.otokenAddress,
        zapperAddress: params.zapperAddress,
      }),

    // Swaps
    // =====

    // Uniswap
    params.uniswapV3 && uniswapV3ActivityProcessor({ otokenAddress: params.otokenAddress, ...params.uniswapV3 }),
    ...(params.curvePools
      ? params.curvePools.map((pool) => curveActivityProcessor({ otokenAddress: params.otokenAddress, ...pool }))
      : []),

    // Balancer
    params.balancerPools &&
      balancerActivityProcessor({
        otokenAddress: params.otokenAddress,
        pools: params.balancerPools,
      }),

    // Cowswap
    params.cowSwap && cowSwapActivityProcessor({ otokenAddress: params.otokenAddress, address: params.otokenAddress }),
    params.cowSwap &&
      params.wotokenAddress &&
      cowSwapActivityProcessor({
        otokenAddress: params.otokenAddress,
        address: params.wotokenAddress,
      }),

    // Wraps & Unwraps
    params.wotokenAddress &&
      wrappedActivityProcessor({
        otokenAddress: params.otokenAddress,
        wotokenAddress: params.wotokenAddress,
      }),

    // Mints & Redeems
    vaultActivityProcessor({ otokenAddress: params.otokenAddress, vaultAddress: params.vaultAddress }),

    // Transfers & Swaps
    transferActivityProcessor({ otokenAddress: params.otokenAddress }),
  ]).filter((p) => p.name.includes('Approval'))

  const from = params.from
  const setup = (processor: EvmBatchProcessor) => {
    for (const p of processors) {
      for (const filter of p.filters) {
        processor.addLog(filter.value)
      }
    }
  }
  const process = async (ctx: Context) => {
    const activities: OTokenActivity[] = []
    // Loop through each block
    for (const block of ctx.blocksWithContent) {
      // Group logs by transaction
      const transactions = groupBy(block.logs, (l) => l.transactionHash)
      // Loop through each transaction's set of logs.
      for (const logs of Object.values(transactions)) {
        for (const p of processors) {
          const filterMatch = p.filters.find((f) => logs.find((l) => f.matches(l)))
          if (filterMatch) {
            const results = await p.process(ctx, block, logs)
            activities.push(...results)
          }
        }
      }
    }
    await ctx.store.insert(activities)
  }
  return { from, setup, process }
}
