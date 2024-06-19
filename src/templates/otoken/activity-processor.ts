import { compact, groupBy, uniq } from 'lodash'

import * as balancerVaultAbi from '@abi/balancer-vault'
import * as curvePoolAbi from '@abi/curve-lp-token'
import * as otokenAbi from '@abi/otoken'
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
  TransferActivity,
  UnwrapActivity,
  WrapActivity,
} from '@templates/otoken/activity-types'
import { BALANCER_VAULT_ADDRESS, ETH_ADDRESS, ONEINCH_AGGREGATION_ROUTER_ADDRESS } from '@utils/addresses'
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
    // Swaps
    ...params.curvePools.map((pool) => curveActivityProcessor(pool)),

    // Swaps
    balancerActivityProcessor({ pools: params.balancerPools }),

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

const curveActivityProcessor = ({ address, tokens }: { address: string; tokens: string[] }): ActivityProcessor => {
  return {
    name: 'Curve Pool Processor',
    filters: [logFilter({ address: [address], topic0: [curvePoolAbi.events.TokenExchange.topic] })],
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
            amountIn: tokenExchange.tokens_sold.toString(),
            amountOut: tokenExchange.tokens_bought.toString(),
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
            amountIn: swap.amountIn.toString(),
            amountOut: swap.amountOut.toString(),
          })
        })
    },
  }
}

const wrappedActivityProcessor = (wrappedAddress: string): ActivityProcessor<WrapActivity | UnwrapActivity> => {
  const depositFilter = logFilter({ address: [wrappedAddress], topic0: [wotokenAbi.events.Deposit.topic] })
  const withdrawFilter = logFilter({ address: [wrappedAddress], topic0: [wotokenAbi.events.Withdraw.topic] })
  const transferInFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic2: [wrappedAddress] })
  const transferOutFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic1: [wrappedAddress] })
  return {
    name: 'Wrapped Processor',
    filters: [depositFilter, withdrawFilter, transferInFilter, transferOutFilter],
    async process(ctx: Context, block: Block, logs: Log[]) {
      const result: (WrapActivity | UnwrapActivity)[] = []
      // Wrap
      const depositLogs = logs.filter((l) => depositFilter.matches(l))
      if (depositLogs.length) {
        const transferInLog = logs.find((l) => transferInFilter.matches(l))
        result.push(
          ...depositLogs.map((log) => {
            const data = wotokenAbi.events.Deposit.decode(log)
            const tokenIn = transferInLog?.address ?? 'unknown'
            return createActivity<WrapActivity>(ctx, block, log, {
              type: 'Wrap',
              contract: wrappedAddress,
              account: data.owner,
              tokenIn,
              tokenOut: wrappedAddress,
              amountIn: data.assets.toString(),
              amountOut: data.shares.toString(),
            })
          }),
        )
      }
      // Unwrap
      const withdrawLogs = logs.filter((l) => withdrawFilter.matches(l))
      if (withdrawLogs.length) {
        const transferOutLog = logs.find((l) => transferOutFilter.matches(l))
        result.push(
          ...withdrawLogs.map((log) => {
            const data = wotokenAbi.events.Withdraw.decode(log)
            const tokenOut = transferOutLog?.address ?? 'unknown'
            return createActivity<UnwrapActivity>(ctx, block, log, {
              type: 'Unwrap',
              contract: wrappedAddress,
              account: data.owner,
              tokenIn: wrappedAddress,
              tokenOut,
              amountIn: data.shares.toString(),
              amountOut: data.assets.toString(),
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
  const transferInFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic2: [vaultAddress] })
  const transferOutFilter = logFilter({ topic0: [wotokenAbi.events.Transfer.topic], topic1: [vaultAddress] })
  return {
    name: 'Vault Processor',
    filters: [mintFilter, redeemFilter, transferInFilter, transferOutFilter],
    process: async (ctx, block, logs) => {
      const result: (MintActivity | RedeemActivity)[] = []
      // Mint
      const mintLogs = logs.filter((l) => mintFilter.matches(l))
      if (mintLogs.length) {
        const transferInLogs = logs.filter((l) => transferInFilter.matches(l))
        const tokenIn = transferInLogs[0]?.address ?? ETH_ADDRESS
        const amountIn = mintLogs.reduce((sum, l) => sum + otokenVaultAbi.events.Mint.decode(l)._value, 0n)
        result.push(
          ...mintLogs.map((log) => {
            const data = otokenVaultAbi.events.Mint.decode(log)
            return createActivity<MintActivity>(ctx, block, log, {
              type: 'Mint',
              contract: log.address,
              account: data._addr,
              tokenIn,
              amountIn: amountIn.toString(),
              tokenOut: otokenAddress,
              amountOut: data._value.toString(),
            })
          }),
        )
      }
      // Redeem
      const redeemLogs = logs.filter((l) => redeemFilter.matches(l))
      if (redeemLogs.length) {
        const transferOutLogs = logs.filter((l) => transferOutFilter.matches(l))
        const tokensOut = uniq(transferOutLogs.map((l) => l.address))
        const amountOut = redeemLogs.reduce((sum, l) => sum + otokenVaultAbi.events.Redeem.decode(l)._value, 0n)
        result.push(
          ...redeemLogs.map((log) => {
            const data = otokenVaultAbi.events.Redeem.decode(log)
            return createActivity<RedeemActivity>(ctx, block, log, {
              type: 'Redeem',
              contract: log.address,
              account: data._addr,
              tokenIn: otokenAddress,
              amountIn: data._value.toString(),
              tokenOut: tokensOut.length > 1 ? 'MIX' : tokensOut[0] ?? ETH_ADDRESS,
              amountOut: amountOut.toString(),
            })
          }),
        )
      }
      return result
    },
  }
}

const transferActivityProcessor = ({
  otokenAddress,
}: {
  otokenAddress: string
}): ActivityProcessor<TransferActivity | SwapActivity> => {
  const transferFilter = logFilter({
    address: [otokenAddress],
    topic0: [otokenAbi.events.Transfer.topic],
  })
  return {
    name: 'Transfer Activity',
    filters: [transferFilter],
    process: async (ctx, block, logs) => {
      const transferLogs = logs
        .filter((l) => transferFilter.matches(l))
        .map((log) => ({
          log,
          data: otokenAbi.events.Transfer.decode(log),
        }))

      const swapActivity = calculateTransferActivityAsSwap(ctx, block, transferLogs, ONEINCH_AGGREGATION_ROUTER_ADDRESS)
      if (swapActivity) return swapActivity

      return transferLogs.map(({ log, data }) => {
        return createActivity<TransferActivity>(ctx, block, log, {
          type: 'Transfer',
          token: log.address,
          from: data.from.toLowerCase(),
          to: data.to.toLowerCase(),
          amount: data.value.toString(),
        })
      })
    },
  }
}

const calculateTransferActivityAsSwap = (
  ctx: Context,
  block: Block,
  logs: {
    log: Log
    data: ReturnType<typeof wotokenAbi.events.Transfer.decode>
  }[],
  swapperAddress: string,
) => {
  const swapperLogs = logs.filter(
    ({ log, data }) => data.from.toLowerCase() === swapperAddress || data.to.toLowerCase() === swapperAddress,
  )
  if (swapperLogs.length === 2) {
    const changes = calculateBalanceChanges(swapperLogs)
    let account: string = ''
    let tokenIn: string = ''
    let tokenOut: string = ''
    let amountIn: bigint = 0n
    let amountOut: bigint = 0n
    for (const { token, from, to, value } of changes) {
      if (from === swapperAddress) {
        account = to
        tokenOut = token
        amountOut = value
      } else if (to === swapperAddress) {
        tokenIn = token
        amountIn = value
      }
    }
    return [
      createActivity<SwapActivity>(ctx, block, swapperLogs[0].log, {
        type: 'Swap',
        account,
        exchange: 'Curve',
        contract: swapperAddress,
        tokenIn,
        tokenOut,
        amountIn: amountIn.toString(),
        amountOut: amountOut.toString(),
      }),
    ]
  }
  return undefined
}

const calculateBalanceChanges = (
  logs: {
    log: Log
    data: ReturnType<typeof wotokenAbi.events.Transfer.decode>
  }[],
) => {
  return Object.entries(
    logs.reduce<Record<string, bigint>>((acc, { log, data }) => {
      const key = `${log.address}:${data.from.toLowerCase()}:${data.to.toLowerCase()}`
      acc[key] = (acc[key] || 0n) + data.value
      return acc
    }, {}),
  ).map(([data, value]) => {
    const [token, from, to] = data.split(':')
    return { token, from, to, value }
  })
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
