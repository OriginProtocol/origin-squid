import { address, bytes32, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** FEE_DENOMINATOR() */
export const FEE_DENOMINATOR = func('0xd73792a9', {}, uint256)
export type FEE_DENOMINATORParams = FunctionArguments<typeof FEE_DENOMINATOR>
export type FEE_DENOMINATORReturn = FunctionReturn<typeof FEE_DENOMINATOR>

/** INIT_CODE_PAIR_HASH() */
export const INIT_CODE_PAIR_HASH = func('0x5855a25a', {}, bytes32)
export type INIT_CODE_PAIR_HASHParams = FunctionArguments<typeof INIT_CODE_PAIR_HASH>
export type INIT_CODE_PAIR_HASHReturn = FunctionReturn<typeof INIT_CODE_PAIR_HASH>

/** OWNER_FEE_SHARE_MAX() */
export const OWNER_FEE_SHARE_MAX = func('0x90fd0687', {}, uint256)
export type OWNER_FEE_SHARE_MAXParams = FunctionArguments<typeof OWNER_FEE_SHARE_MAX>
export type OWNER_FEE_SHARE_MAXReturn = FunctionReturn<typeof OWNER_FEE_SHARE_MAX>

/** allPairs(uint256) */
export const allPairs = func('0x1e3dd18b', {
    _0: uint256,
}, address)
export type AllPairsParams = FunctionArguments<typeof allPairs>
export type AllPairsReturn = FunctionReturn<typeof allPairs>

/** allPairsLength() */
export const allPairsLength = func('0x574f2ba3', {}, uint256)
export type AllPairsLengthParams = FunctionArguments<typeof allPairsLength>
export type AllPairsLengthReturn = FunctionReturn<typeof allPairsLength>

/** createPair(address,address) */
export const createPair = func('0xc9c65396', {
    tokenA: address,
    tokenB: address,
}, address)
export type CreatePairParams = FunctionArguments<typeof createPair>
export type CreatePairReturn = FunctionReturn<typeof createPair>

/** feeTo() */
export const feeTo = func('0x017e7e58', {}, address)
export type FeeToParams = FunctionArguments<typeof feeTo>
export type FeeToReturn = FunctionReturn<typeof feeTo>

/** feeToSetter() */
export const feeToSetter = func('0x094b7415', {}, address)
export type FeeToSetterParams = FunctionArguments<typeof feeToSetter>
export type FeeToSetterReturn = FunctionReturn<typeof feeToSetter>

/** getPair(address,address) */
export const getPair = func('0xe6a43905', {
    _0: address,
    _1: address,
}, address)
export type GetPairParams = FunctionArguments<typeof getPair>
export type GetPairReturn = FunctionReturn<typeof getPair>

/** ownerFeeShare() */
export const ownerFeeShare = func('0x69c8b572', {}, uint256)
export type OwnerFeeShareParams = FunctionArguments<typeof ownerFeeShare>
export type OwnerFeeShareReturn = FunctionReturn<typeof ownerFeeShare>

/** setFeeTo(address) */
export const setFeeTo = func('0xf46901ed', {
    _feeTo: address,
})
export type SetFeeToParams = FunctionArguments<typeof setFeeTo>
export type SetFeeToReturn = FunctionReturn<typeof setFeeTo>

/** setFeeToSetter(address) */
export const setFeeToSetter = func('0xa2e74af6', {
    _feeToSetter: address,
})
export type SetFeeToSetterParams = FunctionArguments<typeof setFeeToSetter>
export type SetFeeToSetterReturn = FunctionReturn<typeof setFeeToSetter>

/** setOwnerFeeShare(uint256) */
export const setOwnerFeeShare = func('0x91b83178', {
    newOwnerFeeShare: uint256,
})
export type SetOwnerFeeShareParams = FunctionArguments<typeof setOwnerFeeShare>
export type SetOwnerFeeShareReturn = FunctionReturn<typeof setOwnerFeeShare>
