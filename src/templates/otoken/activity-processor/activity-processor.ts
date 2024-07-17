import { compact, groupBy } from 'lodash'

import { OTokenActivity, OTokenActivityType } from '@model'
import { Context } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { balancerActivityProcessor } from '@templates/otoken/activity-processor/sub/balancer'
import { cowSwapActivityProcessor } from '@templates/otoken/activity-processor/sub/cow-swap'
import { curveActivityProcessor } from '@templates/otoken/activity-processor/sub/curve'
import { transferActivityProcessor } from '@templates/otoken/activity-processor/sub/transfer'
import { vaultActivityProcessor } from '@templates/otoken/activity-processor/sub/vault'
import { wrappedActivityProcessor } from '@templates/otoken/activity-processor/sub/wrapped'
import { ActivityProcessor } from '@templates/otoken/activity-processor/types'
import { Activity } from '@templates/otoken/activity-types'

export const createOTokenActivityProcessor = (params: {
  from: number
  otokenAddress: string
  vaultAddress: string
  wotokenAddress?: string
  curvePools: {
    address: string
    tokens: string[]
  }[]
  balancerPools: string[]
}) => {
  const processors: ActivityProcessor[] = compact([
    // Swaps
    ...params.curvePools.map((pool) => curveActivityProcessor(pool)),

    // Swaps
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
    for (const block of ctx.blocks) {
      const transactions = groupBy(block.logs, (l) => l.transactionHash)
      for (const logs of Object.values(transactions)) {
        for (const p of processors) {
          let hit = false
          for (const filter of p.filters) {
            if (logs.find((log) => filter.matches(log))) {
              const results = await p.process(ctx, block, logs)
              activities.push(...results)
              hit = true
              break
            }
          }
          if (hit) break
        }
      }
    }
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
