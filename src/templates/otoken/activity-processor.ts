import { add, compact, groupBy, uniq } from 'lodash'

import * as balancerVaultAbi from '@abi/balancer-vault'
import * as cowswapSettlementAbi from '@abi/cow-swap-settlement'
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
import {
  BALANCER_VAULT_ADDRESS,
  COWSWAP_SETTLEMENT_ADDRESS,
  ETH_ADDRESS,
  ONEINCH_AGGREGATION_ROUTER_ADDRESS,
} from '@utils/addresses'
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
          return createActivity<SwapActivity>(
            { ctx, block, log },
            {
              type: 'Swap',
              account: tokenExchange.buyer,
              exchange: 'Curve',
              contract: log.address,
              tokensIn: [
                { token: tokens[Number(tokenExchange.sold_id)], amount: tokenExchange.tokens_sold.toString() },
              ],
              tokensOut: [
                {
                  token: tokens[Number(tokenExchange.bought_id)],
                  amount: tokenExchange.tokens_bought.toString(),
                },
              ],
            },
          )
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
          return createActivity<SwapActivity>(
            { ctx, block, log },
            {
              type: 'Swap',
              account: log.transaction!.from,
              exchange: 'Balancer',
              contract: swap.poolId,
              tokensIn: [{ token: swap.tokenIn, amount: swap.amountIn.toString() }],
              tokensOut: [{ token: swap.tokenOut, amount: swap.amountOut.toString() }],
            },
          )
        })
    },
  }
}

const cowSwapActivityProcessor = ({ address }: { address: string }): ActivityProcessor<SwapActivity> => {
  const tradeFilter = logFilter({
    address: [COWSWAP_SETTLEMENT_ADDRESS],
    topic0: [cowswapSettlementAbi.events.Trade.topic],
    transaction: true,
  })
  return {
    name: 'Cowswap Activity Processor',
    filters: [tradeFilter],
    async process(ctx: Context, block: Block, logs: Log[]): Promise<SwapActivity[]> {
      const tradeLogs = logs
        .filter((l) => tradeFilter.matches(l))
        .map((log) => ({
          log,
          data: cowswapSettlementAbi.events.Trade.decode(log),
        }))
      return tradeLogs
        .filter(({ data }) => data.buyToken.toLowerCase() === address || data.sellToken.toLowerCase() === address)
        .map(({ log, data }) => {
          return createActivity<SwapActivity>(
            { ctx, block, log },
            {
              type: 'Swap',
              account: log.transaction!.from,
              exchange: 'Balancer',
              contract: COWSWAP_SETTLEMENT_ADDRESS,
              tokensIn: [{ token: data.sellToken, amount: data.sellAmount.toString() }],
              tokensOut: [{ token: data.buyToken, amount: data.buyAmount.toString() }],
            },
          )
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
            return createActivity<WrapActivity>(
              { ctx, block, log },
              {
                type: 'Wrap',
                contract: wrappedAddress,
                account: data.owner,
                tokenIn,
                tokenOut: wrappedAddress,
                amountIn: data.assets.toString(),
                amountOut: data.shares.toString(),
              },
            )
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
            return createActivity<UnwrapActivity>(
              { ctx, block, log },
              {
                type: 'Unwrap',
                contract: wrappedAddress,
                account: data.owner,
                tokenIn: wrappedAddress,
                tokenOut,
                amountIn: data.shares.toString(),
                amountOut: data.assets.toString(),
              },
            )
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
            return createActivity<MintActivity>(
              { ctx, block, log },
              {
                type: 'Mint',
                contract: log.address,
                account: data._addr,
                tokenIn,
                amountIn: amountIn.toString(),
                tokenOut: otokenAddress,
                amountOut: data._value.toString(),
              },
            )
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
            return createActivity<RedeemActivity>(
              { ctx, block, log },
              {
                type: 'Redeem',
                contract: log.address,
                account: data._addr,
                tokenIn: otokenAddress,
                amountIn: data._value.toString(),
                tokenOut: tokensOut.length > 1 ? 'MIX' : tokensOut[0] ?? ETH_ADDRESS,
                amountOut: amountOut.toString(),
              },
            )
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

      const swapActivity = calculateTransferActivityAsSwap(ctx, block, transferLogs)
      if (swapActivity) return swapActivity

      return transferLogs.map(({ log, data }) => {
        return createActivity<TransferActivity>(
          { ctx, block, log },
          {
            type: 'Transfer',
            token: log.address,
            from: data.from.toLowerCase(),
            to: data.to.toLowerCase(),
            amount: data.value.toString(),
          },
        )
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
) => {
  if (logs.length === 1) return undefined
  const resultMap: Record<string, SwapActivity> = {}
  const tokens = new Set<string>()
  for (const { log, data } of logs) {
    tokens.add(log.address)
    // To
    resultMap[data.to.toLowerCase()] =
      resultMap[data.to.toLowerCase()] ??
      createActivity<SwapActivity>(
        { ctx, block, log: logs[0].log, id: `${ctx.chain.id}:${log.id}:${data.to.toLowerCase()}` },
        {
          type: 'Swap',
          exchange: logs.find((l) => l.log.address === ONEINCH_AGGREGATION_ROUTER_ADDRESS) ? '1inch' : 'other',
          contract: log.address,
          account: data.to.toLowerCase(),
          tokensOut: [],
          tokensIn: [],
        },
      )
    resultMap[data.to.toLowerCase()].tokensIn.push({ token: log.address, amount: data.value.toString() })

    // From
    resultMap[data.from.toLowerCase()] =
      resultMap[data.from.toLowerCase()] ??
      createActivity<SwapActivity>(
        { ctx, block, log: logs[0].log, id: `${ctx.chain.id}:${log.id}:${data.from.toLowerCase()}` },
        {
          type: 'Swap',
          exchange: logs.find((l) => l.log.address === ONEINCH_AGGREGATION_ROUTER_ADDRESS) ? '1inch' : 'other',
          contract: log.address,
          account: data.to.toLowerCase(),
          tokensOut: [],
          tokensIn: [],
        },
      )
    resultMap[data.from.toLowerCase()].tokensOut.push({ token: log.address, amount: data.value.toString() })
  }
  if (tokens.size <= 1) return undefined
  // We are a swap if we sent and received more than one token
  const results = Object.values(resultMap).filter((r) => r.tokensIn.length > 0 && r.tokensOut.length > 0)
  if (results.length > 0) return results
  return undefined
}

const createActivity = <T extends Activity>(
  {
    ctx,
    block,
    log,
    id,
  }: {
    ctx: Context
    block: Block
    log: Log
    id?: string
  },
  partial: Omit<T, 'id' | 'chainId' | 'blockNumber' | 'timestamp' | 'status' | 'txHash'>,
) =>
  ({
    id: id ?? `${ctx.chain.id}:${log.id}`,
    chainId: ctx.chain.id,
    blockNumber: block.header.height,
    timestamp: block.header.timestamp,
    status: 'success',
    txHash: log.transactionHash,
    ...partial,
  }) as T
