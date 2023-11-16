import { decodeFunctionData } from 'viem'

import * as curveExchangeAbi from '../abi/curve-registry-exchange.abi'
import * as oethZapperAbi from '../abi/oeth-zapper.abi'
import {
  CURVE_EXCHANGE_ADDRESS,
  ETH_ADDRESS,
  OETH_ADDRESS,
  OETH_ZAPPER_ADDRESS,
} from './addresses'

export interface Transaction {
  to: string
  from: string
  input: string
  value: bigint
}

export async function activityFromTx(
  transaction: Transaction,
  // logs: GetTransactionReceiptReturnType['logs'],
) {
  const activity = []
  if (!transaction) return

  // const log = logs.find((l) => l.address === OETH_ADDRESS)
  // const trace = block.traces.find(t => t.transaction?.hash === txHash)

  let data

  if (transaction.to === OETH_ZAPPER_ADDRESS) {
    data = decodeOethZapperTx(transaction)
  } else if (transaction.to === CURVE_EXCHANGE_ADDRESS) {
    data = decodeCurveExchangeTx(transaction)
  } else {
    data = {
      callDataLast4Bytes: transaction?.input.slice(-8),
    }
  }

  if (data) {
    activity.push(data)
  }

  return activity
}

function decodeOethZapperTx(transaction: Transaction) {
  const data = decodeFunctionData({
    abi: oethZapperAbi.ABI_JSON,
    data: transaction.input as '0x${string}',
  })

  return {
    callDataLast4Bytes: transaction?.input.slice(-8),
    exchange: 'OETHZapper',
    from: transaction.from,
    to: transaction.from,
    action: 'Swap',
    fromTokenAddress: ETH_ADDRESS,
    toTokenAddress: OETH_ADDRESS,
    fromTokenAmount: data.functionName === 'deposit' ? transaction.value : null,
    toTokenAmount: data.functionName === 'deposit' ? transaction.value : null,
  }
}

function decodeCurveExchangeTx(transaction: Transaction) {
  const data = decodeFunctionData({
    abi: curveExchangeAbi.ABI_JSON,
    data: transaction.input as '0x${string}',
  }) as { functionName: string; args: string[] }

  if (data.functionName === 'exchange_multiple') {
    if (
      data.args[0][0].toLowerCase() === OETH_ADDRESS &&
      data.args[0][2].toLowerCase() === ETH_ADDRESS
    ) {
      return {
        callDataLast4Bytes: transaction?.input.slice(-8),
        exchange: 'Curve',
        from: transaction.from,
        to: transaction.from,
        action: 'Swap',
        fromTokenAddress: OETH_ADDRESS,
        toTokenAddress: ETH_ADDRESS,
      }
    } else if (
      data.args[0][0].toLowerCase() === ETH_ADDRESS &&
      data.args[0][2].toLowerCase() === OETH_ADDRESS
    ) {
      return {
        callDataLast4Bytes: transaction?.input.slice(-8),
        exchange: 'Curve',
        from: transaction.from,
        to: transaction.from,
        action: 'Swap',
        fromTokenAddress: ETH_ADDRESS,
        toTokenAddress: OETH_ADDRESS,
      }
    }
  }
}
