import { groupBy, keyBy, wrap } from 'lodash'

import * as balancerVault from '@abi/balancer-vault'
import * as curveLp from '@abi/curve-lp-token'
import * as woeth from '@abi/woeth'
import { OTokenActivity, OTokenActivityType } from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { Activity, SwapActivity } from '@templates/otoken/activity-types'
import { BALANCER_VAULT_ADDRESS } from '@utils/addresses'
import { LogFilter, logFilter } from '@utils/logFilter'

interface Input {
  from: number
  otokenAddress: string
  wotokenAddress?: string
  curvePools: {
    address: string
    tokens: string[]
  }[]
  balancerPools: string[]
}

export interface ActivityProcessor {
  name: string
  filters: LogFilter[]
  process: (ctx: Context, block: Block, logs: Log[]) => Promise<Activity[]>
}

export const createOTokenActivityProcessor = (params: Input) => {
  const processors: ActivityProcessor[] = [
    ...params.curvePools.map((pool) => curveActivityProcessor(pool)),
    balancerActivityProcessor({ pools: params.balancerPools }),
  ]

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
          for (const filter of p.filters) {
            if (logs.find((log) => filter.matches(log))) {
              const results = await p.process(ctx, block, logs)
              activities.push(...results)
            }
          }
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

const curveActivityProcessor = ({ address, tokens }: { address: string; tokens: string[] }): ActivityProcessor => {
  return {
    name: 'Curve Pool Processor',
    filters: [
      logFilter({
        address: [address],
        topic0: [curveLp.events.TokenExchange.topic],
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<SwapActivity[]> {
      const [tokenExchangeFilter] = this.filters
      return logs
        .filter((l) => tokenExchangeFilter.matches(l))
        .map((log) => {
          const tokenExchange = curveLp.events.TokenExchange.decode(log)
          return {
            id: `${ctx.chain.id}:${log.id}`,
            chainId: ctx.chain.id,
            type: 'Swap',
            exchange: 'Curve',
            blockNumber: block.header.height,
            timestamp: block.header.timestamp,
            status: 'success',
            pool: log.address,
            txHash: log.transactionHash,
            tokenIn: tokens[Number(tokenExchange.sold_id)],
            tokenOut: tokens[Number(tokenExchange.bought_id)],
            amountIn: tokenExchange.tokens_sold,
            amountOut: tokenExchange.tokens_bought,
          }
        })
    },
  }
}

const balancerActivityProcessor = ({ pools }: { pools: string[] }): ActivityProcessor => {
  return {
    name: 'Balancer Pool Processor',
    filters: [
      logFilter({
        address: [BALANCER_VAULT_ADDRESS],
        topic0: [balancerVault.events.Swap.topic],
        topic1: pools,
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<SwapActivity[]> {
      const [swapFilter] = this.filters
      return logs
        .filter((l) => swapFilter.matches(l))
        .map((log) => {
          const swap = balancerVault.events.Swap.decode(log)
          return {
            id: `${ctx.chain.id}:${log.id}`,
            chainId: ctx.chain.id,
            type: 'Swap',
            exchange: 'Balancer',
            blockNumber: block.header.height,
            timestamp: block.header.timestamp,
            status: 'success',
            txHash: log.transactionHash,
            pool: swap.poolId,
            tokenIn: swap.tokenIn,
            tokenOut: swap.tokenOut,
            amountIn: swap.amountIn,
            amountOut: swap.amountOut,
          }
        })
    },
  }
}

const wrappedActivityProcessor = (wrappedAddress: string) => {
  return {
    name: 'Wrapped Processor',
    filters: [
      logFilter({
        address: [wrappedAddress],
        topic0: [woeth.events.Deposit.topic],
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<SwapActivity[]> {
      const [depositFilter] = this.filters
      return logs
        .filter((l) => depositFilter.matches(l))
        .map((log) => {
          const swap = balancerVault.events.Swap.decode(log)
          return {
            id: `${ctx.chain.id}:${log.id}`,
            chainId: ctx.chain.id,
            type: 'Swap',
            exchange: 'Balancer',
            blockNumber: block.header.height,
            timestamp: block.header.timestamp,
            status: 'success',
            txHash: log.transactionHash,
            pool: swap.poolId,
            tokenIn: swap.tokenIn,
            tokenOut: swap.tokenOut,
            amountIn: swap.amountIn,
            amountOut: swap.amountOut,
          }
        })
    },
  }
}
