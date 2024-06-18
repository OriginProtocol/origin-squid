import { compact, groupBy, uniq } from 'lodash'

import * as balancerVaultAbi from '@abi/balancer-vault'
import * as curvePoolAbi from '@abi/curve-lp-token'
import * as otokenVaultAbi from '@abi/otoken-vault'
import * as wotokenAbi from '@abi/woeth'
import { OTokenActivity, OTokenActivityType } from '@model'
import { Block, Context, Log } from '@processor'
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import {
  Activity,
  MintActivity,
  RedeemActivity,
  SwapActivity,
  UnwrapActivity,
  WrapActivity,
} from '@templates/otoken/activity-types'
import { BALANCER_VAULT_ADDRESS } from '@utils/addresses'
import { LogFilter, logFilter } from '@utils/logFilter'

interface Input {
  from: number
  otokenAddress: string
  vaultAddress: string
  wotokenAddress?: string
  curvePools: {
    address: string
    tokens: string[]
  }[]
  balancerPools: string[]
}

export interface ActivityProcessor<T extends Activity = Activity> {
  name: string
  filters: LogFilter[]
  process: (ctx: Context, block: Block, logs: Log[]) => Promise<T[]>
}

export const createOTokenActivityProcessor = (params: Input) => {
  const processors: ActivityProcessor[] = compact([
    ...params.curvePools.map((pool) => curveActivityProcessor(pool)),
    balancerActivityProcessor({ pools: params.balancerPools }),
    params.wotokenAddress && wrappedActivityProcessor(params.wotokenAddress),
    vaultActivityProcessor({ otokenAddress: params.otokenAddress, vaultAddress: params.vaultAddress }),
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

const curveActivityProcessor = ({ address, tokens }: { address: string; tokens: string[] }): ActivityProcessor => {
  return {
    name: 'Curve Pool Processor',
    filters: [
      logFilter({
        address: [address],
        topic0: [curvePoolAbi.events.TokenExchange.topic],
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<SwapActivity[]> {
      const [tokenExchangeFilter] = this.filters
      return logs
        .filter((l) => tokenExchangeFilter.matches(l))
        .map((log) => {
          const tokenExchange = curvePoolAbi.events.TokenExchange.decode(log)
          return createActivity<SwapActivity>(ctx, block, log, {
            type: 'Swap',
            account: tokenExchange.buyer,
            exchange: 'Curve',
            contract: log.address,
            tokenIn: tokens[Number(tokenExchange.sold_id)],
            tokenOut: tokens[Number(tokenExchange.bought_id)],
            amountIn: tokenExchange.tokens_sold,
            amountOut: tokenExchange.tokens_bought,
          })
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
        topic0: [balancerVaultAbi.events.Swap.topic],
        topic1: pools,
        transaction: true,
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<SwapActivity[]> {
      const [swapFilter] = this.filters
      return logs
        .filter((l) => swapFilter.matches(l))
        .map((log) => {
          const swap = balancerVaultAbi.events.Swap.decode(log)
          return createActivity<SwapActivity>(ctx, block, log, {
            type: 'Swap',
            account: log.transaction!.from,
            exchange: 'Balancer',
            contract: swap.poolId,
            tokenIn: swap.tokenIn,
            tokenOut: swap.tokenOut,
            amountIn: swap.amountIn,
            amountOut: swap.amountOut,
          })
        })
    },
  }
}

const wrappedActivityProcessor = (wrappedAddress: string): ActivityProcessor<WrapActivity | UnwrapActivity> => {
  return {
    name: 'Wrapped Processor',
    filters: [
      logFilter({
        address: [wrappedAddress],
        topic0: [wotokenAbi.events.Deposit.topic],
      }),
      logFilter({
        address: [wrappedAddress],
        topic0: [wotokenAbi.events.Withdraw.topic],
      }),
    ],
    async process(ctx: Context, block: Block, logs: Log[]) {
      const result: (WrapActivity | UnwrapActivity)[] = []
      const [depositFilter, withdrawFilter] = this.filters
      // Deposits
      const depositLogs = logs.filter((l) => depositFilter.matches(l))
      if (depositLogs.length) {
        const transferInFilter = logFilter({
          topic0: [wotokenAbi.events.Transfer.topic],
          topic2: [wrappedAddress],
        })
        const transferInLogs = logs.filter((l) => transferInFilter.matches(l))
        result.push(
          ...depositLogs.map((log) => {
            const data = wotokenAbi.events.Deposit.decode(log)
            const tokenIn = transferInLogs[0].address
            const amountIn = transferInLogs.reduce((sum, l) => sum + wotokenAbi.events.Deposit.decode(l).assets, 0n)
            return createActivity<WrapActivity>(ctx, block, log, {
              type: 'Wrap',
              contract: wrappedAddress,
              account: data.owner,
              tokenIn,
              tokenOut: wrappedAddress,
              amountIn,
              amountOut: data.shares,
            })
          }),
        )
      }
      // Withdrawals
      const withdrawLogs = logs.filter((l) => withdrawFilter.matches(l))
      if (withdrawLogs.length) {
        const transferOutFilter = logFilter({
          topic0: [wotokenAbi.events.Transfer.topic],
          topic1: [wrappedAddress],
        })
        const transferOutLogs = logs.filter((l) => transferOutFilter.matches(l))
        result.push(
          ...withdrawLogs.map((log) => {
            const data = wotokenAbi.events.Withdraw.decode(log)
            const tokenOut = transferOutLogs[0].address
            const amountOut = transferOutLogs.reduce((sum, l) => sum + wotokenAbi.events.Withdraw.decode(l).assets, 0n)
            return createActivity<UnwrapActivity>(ctx, block, log, {
              type: 'Unwrap',
              contract: wrappedAddress,
              account: data.owner,
              tokenIn: wrappedAddress,
              tokenOut,
              amountIn: data.shares,
              amountOut,
            })
          }),
        )
      }
      return result
    },
  }
}

const vaultActivityProcessor = ({
  otokenAddress,
  vaultAddress,
}: {
  otokenAddress: string
  vaultAddress: string
}): ActivityProcessor<MintActivity | RedeemActivity> => {
  const mintFilter = logFilter({ address: [vaultAddress], topic0: [otokenVaultAbi.events.Mint.topic] })
  const redeemFilter = logFilter({ address: [vaultAddress], topic0: [otokenVaultAbi.events.Redeem.topic] })
  return {
    name: 'Vault Processor',
    filters: [mintFilter, redeemFilter],
    process: async (ctx, block, logs) => {
      const result: (MintActivity | RedeemActivity)[] = []
      const mintLogs = logs.filter((l) => mintFilter.matches(l))
      if (mintLogs.length) {
        const transferInFilter = logFilter({
          topic0: [wotokenAbi.events.Transfer.topic],
          topic2: [vaultAddress],
        })
        const transferInLogs = logs.filter((l) => transferInFilter.matches(l))
        const tokenIn = transferInLogs[0].address
        const amountIn = transferInLogs.reduce((sum, l) => sum + wotokenAbi.events.Deposit.decode(l).assets, 0n)
        result.push(
          ...mintLogs.map((log) => {
            const data = otokenVaultAbi.events.Mint.decode(log)
            return createActivity<MintActivity>(ctx, block, log, {
              type: 'Mint',
              contract: log.address,
              account: data._addr,
              tokenIn,
              amountIn,
              tokenOut: otokenAddress,
              amountOut: data._value,
            })
          }),
        )
      }
      const redeemLogs = logs.filter((l) => redeemFilter.matches(l))
      if (redeemLogs.length) {
        const transferOutFilter = logFilter({
          topic0: [wotokenAbi.events.Transfer.topic],
          topic1: [vaultAddress],
        })
        const transferOutLogs = logs.filter((l) => transferOutFilter.matches(l))
        const tokensOut = uniq(transferOutLogs.map((l) => l.address))
        const amountOut = transferOutLogs.reduce((sum, l) => sum + wotokenAbi.events.Deposit.decode(l).assets, 0n)
        result.push(
          ...mintLogs.map((log) => {
            const data = otokenVaultAbi.events.Redeem.decode(log)
            return createActivity<RedeemActivity>(ctx, block, log, {
              type: 'Redeem',
              contract: log.address,
              account: data._addr,
              tokenIn: otokenAddress,
              amountIn: data._value,
              tokenOut: tokensOut.length > 1 ? 'MIX' : tokensOut[0],
              amountOut,
            })
          }),
        )
      }
      return result
    },
  }
}

const createActivity = <T extends Activity>(
  ctx: Context,
  block: Block,
  log: Log,
  partial: Omit<T, 'id' | 'chainId' | 'blockNumber' | 'timestamp' | 'status' | 'txHash'>,
) =>
  ({
    id: `${ctx.chain.id}:${log.id}`,
    chainId: ctx.chain.id,
    blockNumber: block.header.height,
    timestamp: block.header.timestamp,
    status: 'success',
    txHash: log.transactionHash,
    ...partial,
  }) as T
