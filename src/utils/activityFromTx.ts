import {
  GetTransactionReceiptReturnType,
  decodeEventLog,
  decodeFunctionData,
} from 'viem'

import * as curveLpAbi from '../abi/curve-lp-token.abi'
import * as oethZapperAbi from '../abi/oeth-zapper.abi'
import * as oethAbi from '../abi/oeth.abi'
import { OETH_ADDRESS, OETH_ZAPPER_ADDRESS } from './addresses'

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

export async function activityFromTx(
  transaction: Transaction,
  logs: GetTransactionReceiptReturnType['logs'],
) {
  const activity = []
  if (!transaction) return

  // console.log(logs)

  // const log = logs.find((l) => l.address === OETH_ADDRESS)
  // const trace = block.traces.find(t => t.transaction?.hash === txHash)

  const curveEvents = logs
    .filter((l) =>
      addressEq(l.address, '0x94B17476A93b3262d87B9a326965D1E91f9c13E7'),
    )
    .map((log) => {
      return decodeEventLog({
        abi: curveLpAbi.ABI_JSON,
        data: log.data,
        topics: log.topics,
      })
    })

  const oethEvents = logs
    .filter((l) => l.address === OETH_ADDRESS)
    .map((log) => {
      return decodeEventLog({
        abi: oethAbi.ABI_JSON,
        data: log.data,
        topics: log.topics,
      })
    })

  const oneInchEvents = logs.filter((l) =>
    addressEq(l.address, '0x1111111254eeb25477b68fb85ed929f73a960582'),
  )

  const oethTransfers = oethEvents.filter(
    (log) => log.eventName === 'Transfer',
  ) as Transfer[]

  const netTransfers = oethTransfers.reduce<NetTransfers>(
    (acc, { args: { from, to, value } }) => {
      acc[from] = (acc[from] || 0n) - value
      acc[to] = (acc[to] || 0n) + value
      return acc
    },
    {},
  )
  const nonZeroBalances: { [address: string]: bigint } = Object.keys(
    netTransfers,
  ).reduce(
    (acc, key) => {
      if (netTransfers[key] !== 0n) {
        acc[key] = netTransfers[key]
      }
      return acc
    },
    {} as { [address: string]: bigint },
  )

  const sumPositiveBalances = (balances: {
    [address: string]: bigint
  }): bigint => {
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

  if (oethEvents.some((e) => e.eventName === 'TotalSupplyUpdatedHighres')) {
    data.action = 'Rebase'
  }

  if (
    addressEq(transaction.to, '0x1111111254EEB25477B68fb85Ed929f73A960582') ||
    oneInchEvents.length > 0
  ) {
    data.action = 'Swap'
    data.interface = '1inch'
  }

  if (curveEvents.length > 0) {
    data.action = 'Swap'
    data.exchange = 'Curve'
  }

  if (
    oethTransfers.some(
      (t) =>
        addressEq(t.args.from, '0x9008d19f58aabd9ed0d60971565aa8510560ab41') ||
        addressEq(t.args.to, '0x9008d19f58aabd9ed0d60971565aa8510560ab41'),
    )
  ) {
    data.exchange = 'CoW Swap'
  } else if (
    oethTransfers.some(
      (t) =>
        addressEq(t.args.from, '0x94b17476a93b3262d87b9a326965d1e91f9c13e7') ||
        addressEq(t.args.to, '0x94b17476a93b3262d87b9a326965d1e91f9c13e7'),
    )
  ) {
    data.exchange = 'Curve'
  }

  if (transaction.to === OETH_ZAPPER_ADDRESS) {
    data = decodeOethZapperTx(transaction)
  }

  activity.push(data)

  return activity
}

function decodeOethZapperTx(transaction: Transaction) {
  try {
    const data = decodeFunctionData({
      abi: oethZapperAbi.ABI_JSON,
      data: transaction.input as '0x${string}',
    })

    return {
      callDataLast4Bytes: transaction?.input.slice(-8),
      exchange: 'OETHZapper',
      action: 'Swap',
      fromSymbol: 'ETH',
      toSymbol: 'OETH',
    }
  } catch (e) {
    console.log('Error decoding OETHZapper tx', e)
    return
  }
}

function addressEq(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}
