import { compact, groupBy } from 'lodash'

import { OTokenActivity, OTokenActivityType } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { balancerActivityProcessor } from '@templates/otoken/activity-processor/sub/balancer'
import { cowSwapActivityProcessor } from '@templates/otoken/activity-processor/sub/cow-swap'
import { curveActivityProcessor } from '@templates/otoken/activity-processor/sub/curve'
import { transferActivityProcessor } from '@templates/otoken/activity-processor/sub/transfer'
import { uniswapV3ActivityProcessor } from '@templates/otoken/activity-processor/sub/uniswap-v3'
import { vaultActivityProcessor } from '@templates/otoken/activity-processor/sub/vault'
import { wrappedActivityProcessor } from '@templates/otoken/activity-processor/sub/wrapped'
import { zapperActivityProcessor } from '@templates/otoken/activity-processor/sub/zapper'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { Activity } from '@templates/otoken/activity-types'

export const createOTokenActivityProcessor = (params: {
  from: number
  otokenAddress: string
  vaultAddress: string
  wotokenAddress?: string
  zapperAddress: string
  curvePools: {
    address: string
    tokens: string[]
  }[]
  balancerPools: string[]
  uniswapV3: { address: string; tokens: [string, string] }
}) => {
  const processors: ActivityProcessor[] = compact([
    // TODO: Morpho Blue: https://etherscan.io/tx/0xde3e7e991f70979ffdfaf0652b4c2722773416341ca78dcdaabd3cae98f8204d#eventlog

    // Zaps
    zapperActivityProcessor({ otokenAddress: params.otokenAddress, zapperAddress: params.zapperAddress }),

    // Swaps
    uniswapV3ActivityProcessor(params.uniswapV3),
    ...params.curvePools.map((pool) => curveActivityProcessor(pool)),
    balancerActivityProcessor({ pools: params.balancerPools }),
    cowSwapActivityProcessor({ address: params.otokenAddress }),
    params.wotokenAddress && cowSwapActivityProcessor({ address: params.wotokenAddress }),

    // Wraps & Unwraps
    params.wotokenAddress && wrappedActivityProcessor(params.wotokenAddress),

    // Mints & Redeems
    vaultActivityProcessor({ otokenAddress: params.otokenAddress, vaultAddress: params.vaultAddress }),

    // Transfers & Swaps
    transferActivityProcessor({ otokenAddress: params.otokenAddress }),
  ])

  const from = params.from
  const setup = (processor: EvmBatchProcessor) => {
    for (const p of processors) {
      for (const filter of p.filters) {
        processor.addLog(filter.value)
      }
    }
  }
  const process = async (ctx: Context) => {
    const activities: Activity[] = []
    // Loop through each block
    for (const block of ctx.blocks) {
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
    debugger
    await ctx.store.insert(
      activities.map(
        (activity) =>
          new OTokenActivity({
            id: activity.id,
            chainId: activity.chainId,
            type: OTokenActivityType[activity.type],
            txHash: activity.txHash,
            blockNumber: activity.blockNumber,
            timestamp: new Date(activity.timestamp),
            otoken: params.otokenAddress,
            data: activity,
          }),
      ),
    )
  }
  return { from, setup, process }
}
