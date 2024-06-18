import { compact } from 'lodash'
import { GetTransactionReceiptReturnType, decodeEventLog, parseAbi } from 'viem'

import * as balancerVaultAbi from '@abi/balancer-vault.abi'
import * as curveLp from '@abi/curve-lp-token'
import * as curveLpAbi from '@abi/curve-lp-token.abi'
import * as oethAbi from '@abi/oeth.abi'
import * as oethVaultAbi from '@abi/otoken-vault.abi'
import { Block, Context, Log } from '@processor'
import { Activity, SwapActivity } from '@templates/otoken/activity-types'
import { logFilter } from '@utils/logFilter'

import {
  BALANCER_VAULT_ADDRESS,
  COWSWAP_SETTLEMENT_ADDRESS,
  CURVE_ETH_OETH_POOL_ADDRESS,
  CURVE_FRXETH_OETH_POOL_ADDRESS,
  OETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  OETH_ZAPPER_ADDRESS,
  ONEINCH_AGGREGATION_ROUTER_ADDRESS,
  UNISWAP_OETH_WEH_ADDRESS,
  WOETH_ADDRESS,
} from './addresses'

const UniswapV3SwapAbi = parseAbi([
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
])
const GnosisSafeAbi = parseAbi(['event ExecutionSuccess(bytes32 txHash, uint256 payment)'])
const WrappedOETHAbi = parseAbi([
  'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
])

const tryDecodeEventLog = (...params: Parameters<typeof decodeEventLog>) => {
  try {
    return decodeEventLog(...params)
  } catch (err: unknown) {
    return undefined
  }
}

export interface Transaction {
  to: string
  from: string
  input: string
  value: bigint
}

type Transfer = {
  eventName: string
  args: {
    from: string
    to: string
    value: bigint
  }
}

type NetTransfers = {
  [address: string]: bigint
}

export async function activityFromTx(ctx: Context, block: Block, log: Log) {
  const sansGnosisSafeEvents = logs.filter(({ data, topics }) => {
    try {
      decodeEventLog({
        abi: GnosisSafeAbi,
        data,
        topics,
        strict: false,
      })
      return false
    } catch (e) {
      return true
    }
  })

  const oethEvents = compact(
    logs
      .filter((l) => l.address === OETH_ADDRESS)
      .map((log) => {
        return tryDecodeEventLog({
          abi: oethAbi.ABI_JSON,
          data: log.data,
          topics: log.topics,
        })
      }),
  )

  const oethVaultEvents = compact(
    logs
      .filter((l) => l.address === OETH_VAULT_ADDRESS)
      .map((log) => {
        return tryDecodeEventLog({
          abi: oethVaultAbi.ABI_JSON,
          data: log.data,
          topics: log.topics,
        })
      }),
  )

  const woethEvents = compact(
    logs
      .filter((l) => l.address === WOETH_ADDRESS)
      .map(({ data, topics }) => tryDecodeEventLog({ abi: WrappedOETHAbi, data, topics })),
  )

  const oneInchEvents = logs.filter((l) => l.address === ONEINCH_AGGREGATION_ROUTER_ADDRESS)
  const uniswapWethEvents = compact(
    logs
      .filter((l) => l.address === UNISWAP_OETH_WEH_ADDRESS)
      .map((log) =>
        tryDecodeEventLog({
          abi: UniswapV3SwapAbi,
          data: log.data,
          topics: log.topics,
        }),
      ),
  )

  const oethTransfers = compact(oethEvents).filter((log) => log.eventName === 'Transfer') as Transfer[]

  const netTransfers = oethTransfers.reduce<NetTransfers>((acc, { args: { from, to, value } }) => {
    acc[from] = (acc[from] || 0n) - value
    acc[to] = (acc[to] || 0n) + value
    return acc
  }, {})
  const nonZeroBalances: { [address: string]: bigint } = Object.keys(netTransfers).reduce(
    (acc, key) => {
      if (netTransfers[key] !== 0n) {
        acc[key] = netTransfers[key]
      }
      return acc
    },
    {} as { [address: string]: bigint },
  )

  const sumPositiveBalances = (balances: { [address: string]: bigint }): bigint => {
    return Object.values(balances).reduce((sum, value) => {
      if (value > 0n) {
        return sum + value
      }
      return sum
    }, 0n)
  }

  const totalPositiveBalance = sumPositiveBalances(nonZeroBalances)

  let data:
    | {
        callDataLast4Bytes?: string
        exchange?: string
        action?: string
        fromSymbol?: string
        toSymbol?: string
        interface?: string
        amount?: bigint
      }
    | undefined = {}

  data.callDataLast4Bytes = transaction?.input.slice(-8)
  data.amount = totalPositiveBalance

  if (oethVaultEvents.some((e) => e.eventName === 'Redeem')) {
    data.action = 'Redeem'
  } else if (oethEvents.some((e) => e.eventName === 'TotalSupplyUpdatedHighres')) {
    data.action = 'Rebase'
  }

  if (transaction.to === ONEINCH_AGGREGATION_ROUTER_ADDRESS || oneInchEvents.length > 0) {
    data.action = 'Swap'
    data.interface = '1inch'
  }
  if (transaction.to === COWSWAP_SETTLEMENT_ADDRESS) {
    data.action = 'Swap'
    data.exchange = 'CoW Swap'
  }
  if (transaction.to === '0x6131b5fae19ea4f9d964eac0408e4408b66337b5') {
    data.action = 'Swap'
    data.exchange = 'Kyber Swap'
  }

  if (frxEthOETHCurvePoolEvents.length > 0) {
    data.action = 'Swap'
    data.exchange = 'Curve'
  }
  if (balancerVaultEvents.length > 0) {
    data.action = 'Swap'
    data.exchange = 'Balancer'
  }

  if (uniswapWethEvents.length > 0) {
    data.action = 'Swap'
    data.exchange = 'UniswapV3'
  }
  if (woethEvents.find((e) => e?.eventName === 'Deposit')) {
    data.action = 'Wrap'
    data.exchange = 'WOETH'
  } else if (woethEvents.find((e) => e?.eventName === 'Withdraw')) {
    data.action = 'Un-wrap'
    data.exchange = 'WOETH'
  }

  if (
    oethTransfers.some(
      (t) =>
        t.args.from.toLowerCase() === COWSWAP_SETTLEMENT_ADDRESS ||
        t.args.to.toLowerCase() === COWSWAP_SETTLEMENT_ADDRESS,
    )
  ) {
    data.exchange = 'CoW Swap'
  } else if (
    oethTransfers.some(
      (t) =>
        t.args.from.toLowerCase() === CURVE_ETH_OETH_POOL_ADDRESS ||
        t.args.to.toLowerCase() === CURVE_ETH_OETH_POOL_ADDRESS,
    )
  ) {
    data.exchange = 'Curve'
  }
  if (oethTransfers.length === 1 && sansGnosisSafeEvents.length === 1) {
    data.action = 'Transfer'
  }

  if (transaction.to === OETH_ZAPPER_ADDRESS) {
    data = decodeOethZapperTx(transaction)
  }

  activity.push(data)

  return activity
}

function decodeOethZapperTx(transaction: Transaction) {
  return {
    callDataLast4Bytes: transaction?.input.slice(-8),
    exchange: 'OETHZapper',
    action: 'Swap',
    fromSymbol: 'ETH',
    toSymbol: 'OETH',
  }
}
