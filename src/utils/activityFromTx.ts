import {
  GetTransactionReceiptReturnType,
  decodeEventLog,
  decodeFunctionData,
  parseAbi,
} from 'viem'

import * as balancerVaultAbi from '../abi/balancer-vault.abi'
import * as curveLpAbi from '../abi/curve-lp-token.abi'
import * as oethZapperAbi from '../abi/oeth-zapper.abi'
import * as oethAbi from '../abi/oeth.abi'
import * as oethVaultAbi from '../abi/otoken-vault.abi'
import {
  OETH_ADDRESS,
  OETH_VAULT_ADDRESS,
  OETH_ZAPPER_ADDRESS,
} from './addresses'

const UniswapV3SwapAbi = parseAbi([
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
])
const GnosisSafeAbi = parseAbi([
  'event ExecutionSuccess(bytes32 txHash, uint256 payment)',
])
const WrappedOETHAbi = parseAbi([
  'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
])

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

  const oethEvents = logs
    .filter((l) => l.address === OETH_ADDRESS)
    .map((log) => {
      return decodeEventLog({
        abi: oethAbi.ABI_JSON,
        data: log.data,
        topics: log.topics,
      })
    })

  const balancerVaultEvents = logs
    .filter((l) =>
      addressEq(l.address, '0xBA12222222228d8Ba445958a75a0704d566BF2C8'),
    )
    .map((log) => {
      return decodeEventLog({
        abi: balancerVaultAbi.ABI_JSON,
        data: log.data,
        topics: log.topics,
      })
    })

  const oethVaultEvents = logs
    .filter((l) => l.address === OETH_VAULT_ADDRESS)
    .map((log) => {
      return decodeEventLog({
        abi: oethVaultAbi.ABI_JSON,
        data: log.data,
        topics: log.topics,
      })
    })

  const woethEvents = logs
    .filter((l) =>
      addressEq(l.address, '0xdcee70654261af21c44c093c300ed3bb97b78192'),
    )
    .map(({ data, topics }) => {
      try {
        return decodeEventLog({ abi: WrappedOETHAbi, data, topics })
      } catch (e) {
        /* Ignore */
      }
    })
    .filter(Boolean)

  const oneInchEvents = logs.filter((l) =>
    addressEq(l.address, '0x1111111254eeb25477b68fb85ed929f73a960582'),
  )
  const uniswapWethEvents = logs
    .filter((l) =>
      addressEq(l.address, '0x52299416c469843f4e0d54688099966a6c7d720f'),
    )
    .map((log) =>
      decodeEventLog({
        abi: UniswapV3SwapAbi,
        data: log.data,
        topics: log.topics,
      }),
    )

  const frxEthOETHCurvePoolEvents = logs.filter((l) =>
    addressEq(l.address, '0xfa0bbb0a5815f6648241c9221027b70914dd8949'),
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

  if (oethVaultEvents.some((e) => e.eventName === 'Redeem')) {
    data.action = 'Redeem'
  } else if (
    oethEvents.some((e) => e.eventName === 'TotalSupplyUpdatedHighres')
  ) {
    data.action = 'Rebase'
  }

  if (
    addressEq(transaction.to, '0x1111111254EEB25477B68fb85Ed929f73A960582') ||
    oneInchEvents.length > 0
  ) {
    data.action = 'Swap'
    data.interface = '1inch'
  }
  if (addressEq(transaction.to, '0x9008d19f58aabd9ed0d60971565aa8510560ab41')) {
    data.action = 'Swap'
    data.exchange = 'CoW Swap'
  }
  if (addressEq(transaction.to, '0x6131b5fae19ea4f9d964eac0408e4408b66337b5')) {
    data.action = 'Swap'
    data.exchange = 'Kyber Swap'
  }

  if (curveEvents.length > 0) {
    data.action = 'Swap'
    data.exchange = 'Curve'
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

function addressEq(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}
