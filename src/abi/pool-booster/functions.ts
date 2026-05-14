import { address, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** MIN_BRIBE_AMOUNT() */
export const MIN_BRIBE_AMOUNT = func('0x3978033f', {}, uint256)
export type MIN_BRIBE_AMOUNTParams = FunctionArguments<typeof MIN_BRIBE_AMOUNT>
export type MIN_BRIBE_AMOUNTReturn = FunctionReturn<typeof MIN_BRIBE_AMOUNT>

/** bribe() */
export const bribe = func('0x37d0208c', {})
export type BribeParams = FunctionArguments<typeof bribe>
export type BribeReturn = FunctionReturn<typeof bribe>

/** bribeContractOS() */
export const bribeContractOS = func('0xecdb9ea1', {}, address)
export type BribeContractOSParams = FunctionArguments<typeof bribeContractOS>
export type BribeContractOSReturn = FunctionReturn<typeof bribeContractOS>

/** bribeContractOther() */
export const bribeContractOther = func('0x840841d4', {}, address)
export type BribeContractOtherParams = FunctionArguments<typeof bribeContractOther>
export type BribeContractOtherReturn = FunctionReturn<typeof bribeContractOther>

/** osToken() */
export const osToken = func('0x12c587c5', {}, address)
export type OsTokenParams = FunctionArguments<typeof osToken>
export type OsTokenReturn = FunctionReturn<typeof osToken>

/** split() */
export const split = func('0xf7654176', {}, uint256)
export type SplitParams = FunctionArguments<typeof split>
export type SplitReturn = FunctionReturn<typeof split>
