// import { compact } from 'lodash'
// import { GetTransactionReceiptReturnType, decodeEventLog, parseAbi } from 'viem'
//
// import * as balancerVaultAbi from '@abi/balancer-vault.abi'
// import * as curveLp from '@abi/curve-lp-token'
// import * as curveLpAbi from '@abi/curve-lp-token.abi'
// import * as oethAbi from '@abi/oeth.abi'
// import * as oethVaultAbi from '@abi/otoken-vault.abi'
// import { Block, Context, Log } from '@processor'
// import { Activity, SwapActivity } from '@templates/otoken/activity-types'
// import { logFilter } from '@utils/logFilter'
//
// import {
//   BALANCER_VAULT_ADDRESS,
//   COWSWAP_SETTLEMENT_ADDRESS,
//   CURVE_ETH_OETH_POOL_ADDRESS,
//   CURVE_FRXETH_OETH_POOL_ADDRESS,
//   OETH_ADDRESS,
//   OETH_VAULT_ADDRESS,
//   OETH_ZAPPER_ADDRESS,
//   ONEINCH_AGGREGATION_ROUTER_ADDRESS,
//   UNISWAP_OETH_WEH_ADDRESS,
//   WOETH_ADDRESS,
// } from './addresses'
//
// const UniswapV3SwapAbi = parseAbi([
//   'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
// ])
// const GnosisSafeAbi = parseAbi(['event ExecutionSuccess(bytes32 txHash, uint256 payment)'])
// const WrappedOETHAbi = parseAbi([
//   'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
//   'event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
// ])
//
// const tryDecodeEventLog = (...params: Parameters<typeof decodeEventLog>) => {
//   try {
//     return decodeEventLog(...params)
//   } catch (err: unknown) {
//     return undefined
//   }
// }
//
// export interface Transaction {
//   to: string
//   from: string
//   input: string
//   value: bigint
// }
//
// type Transfer = {
//   eventName: string
//   args: {
//     from: string
//     to: string
//     value: bigint
//   }
// }
//
// type NetTransfers = {
//   [address: string]: bigint
// }
//
// export async function activityFromTx(ctx: Context, block: Block, log: Log) {
//   const sansGnosisSafeEvents = logs.filter(({ data, topics }) => {
//     try {
//       decodeEventLog({
//         abi: GnosisSafeAbi,
//         data,
//         topics,
//         strict: false,
//       })
//       return false
//     } catch (e) {
//       return true
//     }
//   })
