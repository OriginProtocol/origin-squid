import { address, bool, uint24, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** MAX_FEE() */
export const MAX_FEE = func('0xbc063e1a', {}, uint256)
export type MAX_FEEParams = FunctionArguments<typeof MAX_FEE>
export type MAX_FEEReturn = FunctionReturn<typeof MAX_FEE>

/** ZERO_FEE_INDICATOR() */
export const ZERO_FEE_INDICATOR = func('0x38c55d46', {}, uint256)
export type ZERO_FEE_INDICATORParams = FunctionArguments<typeof ZERO_FEE_INDICATOR>
export type ZERO_FEE_INDICATORReturn = FunctionReturn<typeof ZERO_FEE_INDICATOR>

/** allPools(uint256) */
export const allPools = func('0x41d1de97', {
    _0: uint256,
}, address)
export type AllPoolsParams = FunctionArguments<typeof allPools>
export type AllPoolsReturn = FunctionReturn<typeof allPools>

/** allPoolsLength() */
export const allPoolsLength = func('0xefde4e64', {}, uint256)
export type AllPoolsLengthParams = FunctionArguments<typeof allPoolsLength>
export type AllPoolsLengthReturn = FunctionReturn<typeof allPoolsLength>

/** createPool(address,address,bool) */
export const createPool = func('0x36bf95a0', {
    tokenA: address,
    tokenB: address,
    stable: bool,
}, address)
export type CreatePoolParams = FunctionArguments<typeof createPool>
export type CreatePoolReturn = FunctionReturn<typeof createPool>

/** createPool(address,address,uint24) */
export const createPool_1 = func('0xa1671295', {
    tokenA: address,
    tokenB: address,
    fee: uint24,
}, address)
export type CreatePoolParams_1 = FunctionArguments<typeof createPool_1>
export type CreatePoolReturn_1 = FunctionReturn<typeof createPool_1>

/** customFee(address) */
export const customFee = func('0x4d419abc', {
    _0: address,
}, uint256)
export type CustomFeeParams = FunctionArguments<typeof customFee>
export type CustomFeeReturn = FunctionReturn<typeof customFee>

/** feeManager() */
export const feeManager = func('0xd0fb0203', {}, address)
export type FeeManagerParams = FunctionArguments<typeof feeManager>
export type FeeManagerReturn = FunctionReturn<typeof feeManager>

/** getFee(address,bool) */
export const getFee = func('0xcc56b2c5', {
    pool: address,
    _stable: bool,
}, uint256)
export type GetFeeParams = FunctionArguments<typeof getFee>
export type GetFeeReturn = FunctionReturn<typeof getFee>

/** getPool(address,address,uint24) */
export const getPool = func('0x1698ee82', {
    tokenA: address,
    tokenB: address,
    fee: uint24,
}, address)
export type GetPoolParams = FunctionArguments<typeof getPool>
export type GetPoolReturn = FunctionReturn<typeof getPool>

/** getPool(address,address,bool) */
export const getPool_1 = func('0x79bc57d5', {
    tokenA: address,
    tokenB: address,
    stable: bool,
}, address)
export type GetPoolParams_1 = FunctionArguments<typeof getPool_1>
export type GetPoolReturn_1 = FunctionReturn<typeof getPool_1>

/** implementation() */
export const implementation = func('0x5c60da1b', {}, address)
export type ImplementationParams = FunctionArguments<typeof implementation>
export type ImplementationReturn = FunctionReturn<typeof implementation>

/** isPaused() */
export const isPaused = func('0xb187bd26', {}, bool)
export type IsPausedParams = FunctionArguments<typeof isPaused>
export type IsPausedReturn = FunctionReturn<typeof isPaused>

/** isPool(address) */
export const isPool = func('0x5b16ebb7', {
    pool: address,
}, bool)
export type IsPoolParams = FunctionArguments<typeof isPool>
export type IsPoolReturn = FunctionReturn<typeof isPool>

/** pauser() */
export const pauser = func('0x9fd0506d', {}, address)
export type PauserParams = FunctionArguments<typeof pauser>
export type PauserReturn = FunctionReturn<typeof pauser>

/** setCustomFee(address,uint256) */
export const setCustomFee = func('0xd49466a8', {
    pool: address,
    fee: uint256,
})
export type SetCustomFeeParams = FunctionArguments<typeof setCustomFee>
export type SetCustomFeeReturn = FunctionReturn<typeof setCustomFee>

/** setFee(bool,uint256) */
export const setFee = func('0xe1f76b44', {
    _stable: bool,
    _fee: uint256,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setFeeManager(address) */
export const setFeeManager = func('0x472d35b9', {
    _feeManager: address,
})
export type SetFeeManagerParams = FunctionArguments<typeof setFeeManager>
export type SetFeeManagerReturn = FunctionReturn<typeof setFeeManager>

/** setPauseState(bool) */
export const setPauseState = func('0xcdb88ad1', {
    _state: bool,
})
export type SetPauseStateParams = FunctionArguments<typeof setPauseState>
export type SetPauseStateReturn = FunctionReturn<typeof setPauseState>

/** setPauser(address) */
export const setPauser = func('0x2d88af4a', {
    _pauser: address,
})
export type SetPauserParams = FunctionArguments<typeof setPauser>
export type SetPauserReturn = FunctionReturn<typeof setPauser>

/** setVoter(address) */
export const setVoter = func('0x4bc2a657', {
    _voter: address,
})
export type SetVoterParams = FunctionArguments<typeof setVoter>
export type SetVoterReturn = FunctionReturn<typeof setVoter>

/** stableFee() */
export const stableFee = func('0x40bbd775', {}, uint256)
export type StableFeeParams = FunctionArguments<typeof stableFee>
export type StableFeeReturn = FunctionReturn<typeof stableFee>

/** volatileFee() */
export const volatileFee = func('0x5084ed03', {}, uint256)
export type VolatileFeeParams = FunctionArguments<typeof volatileFee>
export type VolatileFeeReturn = FunctionReturn<typeof volatileFee>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>
