import { address, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** deposit() */
export const deposit = func('0xd0e30db0', {}, uint256)
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** depositSFRXETH(uint256,uint256) */
export const depositSFRXETH = func('0xd443e97d', {
    amount: uint256,
    minOETH: uint256,
}, uint256)
export type DepositSFRXETHParams = FunctionArguments<typeof depositSFRXETH>
export type DepositSFRXETHReturn = FunctionReturn<typeof depositSFRXETH>

/** frxeth() */
export const frxeth = func('0x6f708a9d', {}, address)
export type FrxethParams = FunctionArguments<typeof frxeth>
export type FrxethReturn = FunctionReturn<typeof frxeth>

/** oeth() */
export const oeth = func('0xccfe2a69', {}, address)
export type OethParams = FunctionArguments<typeof oeth>
export type OethReturn = FunctionReturn<typeof oeth>

/** sfrxeth() */
export const sfrxeth = func('0xa07311af', {}, address)
export type SfrxethParams = FunctionArguments<typeof sfrxeth>
export type SfrxethReturn = FunctionReturn<typeof sfrxeth>

/** vault() */
export const vault = func('0xfbfa77cf', {}, address)
export type VaultParams = FunctionArguments<typeof vault>
export type VaultReturn = FunctionReturn<typeof vault>

/** weth() */
export const weth = func('0x3fc8cef3', {}, address)
export type WethParams = FunctionArguments<typeof weth>
export type WethReturn = FunctionReturn<typeof weth>
