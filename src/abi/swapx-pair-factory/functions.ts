import { address, array, bool, bytes32, struct, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** MAX_FEE() */
export const MAX_FEE = func('0xbc063e1a', {}, uint256)
export type MAX_FEEParams = FunctionArguments<typeof MAX_FEE>
export type MAX_FEEReturn = FunctionReturn<typeof MAX_FEE>

/** MAX_TREASURY_FEE() */
export const MAX_TREASURY_FEE = func('0xf2b3c809', {}, uint256)
export type MAX_TREASURY_FEEParams = FunctionArguments<typeof MAX_TREASURY_FEE>
export type MAX_TREASURY_FEEReturn = FunctionReturn<typeof MAX_TREASURY_FEE>

/** acceptFeeManager() */
export const acceptFeeManager = func('0xf94c53c7', {})
export type AcceptFeeManagerParams = FunctionArguments<typeof acceptFeeManager>
export type AcceptFeeManagerReturn = FunctionReturn<typeof acceptFeeManager>

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

/** createPair(address,address,bool) */
export const createPair = func('0x82dfdce4', {
    tokenA: address,
    tokenB: address,
    stable: bool,
}, address)
export type CreatePairParams = FunctionArguments<typeof createPair>
export type CreatePairReturn = FunctionReturn<typeof createPair>

/** dibs() */
export const dibs = func('0x7be1623e', {}, address)
export type DibsParams = FunctionArguments<typeof dibs>
export type DibsReturn = FunctionReturn<typeof dibs>

/** feeManager() */
export const feeManager = func('0xd0fb0203', {}, address)
export type FeeManagerParams = FunctionArguments<typeof feeManager>
export type FeeManagerReturn = FunctionReturn<typeof feeManager>

/** getFee(bool) */
export const getFee = func('0x512b45ea', {
    _stable: bool,
}, uint256)
export type GetFeeParams = FunctionArguments<typeof getFee>
export type GetFeeReturn = FunctionReturn<typeof getFee>

/** getInitializable() */
export const getInitializable = func('0xeb13c4cf', {}, struct({
    _0: address,
    _1: address,
    _2: bool,
}))
export type GetInitializableParams = FunctionArguments<typeof getInitializable>
export type GetInitializableReturn = FunctionReturn<typeof getInitializable>

/** getPair(address,address,bool) */
export const getPair = func('0x6801cc30', {
    _0: address,
    _1: address,
    _2: bool,
}, address)
export type GetPairParams = FunctionArguments<typeof getPair>
export type GetPairReturn = FunctionReturn<typeof getPair>

/** initialize() */
export const initialize = func('0x8129fc1c', {})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isPair(address) */
export const isPair = func('0xe5e31b13', {
    _0: address,
}, bool)
export type IsPairParams = FunctionArguments<typeof isPair>
export type IsPairReturn = FunctionReturn<typeof isPair>

/** isPaused() */
export const isPaused = func('0xb187bd26', {}, bool)
export type IsPausedParams = FunctionArguments<typeof isPaused>
export type IsPausedReturn = FunctionReturn<typeof isPaused>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** pairCodeHash() */
export const pairCodeHash = func('0x9aab9248', {}, bytes32)
export type PairCodeHashParams = FunctionArguments<typeof pairCodeHash>
export type PairCodeHashReturn = FunctionReturn<typeof pairCodeHash>

/** pairs() */
export const pairs = func('0xffb0a4a0', {}, array(address))
export type PairsParams = FunctionArguments<typeof pairs>
export type PairsReturn = FunctionReturn<typeof pairs>

/** pendingFeeManager() */
export const pendingFeeManager = func('0x8a4fa0d2', {}, address)
export type PendingFeeManagerParams = FunctionArguments<typeof pendingFeeManager>
export type PendingFeeManagerReturn = FunctionReturn<typeof pendingFeeManager>

/** renounceOwnership() */
export const renounceOwnership = func('0x715018a6', {})
export type RenounceOwnershipParams = FunctionArguments<typeof renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof renounceOwnership>

/** setDibs(address) */
export const setDibs = func('0x0c74db12', {
    _dibs: address,
})
export type SetDibsParams = FunctionArguments<typeof setDibs>
export type SetDibsReturn = FunctionReturn<typeof setDibs>

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

/** setPause(bool) */
export const setPause = func('0xbedb86fb', {
    _state: bool,
})
export type SetPauseParams = FunctionArguments<typeof setPause>
export type SetPauseReturn = FunctionReturn<typeof setPause>

/** setStakingFeeAddress(address) */
export const setStakingFeeAddress = func('0x4091cb77', {
    _feehandler: address,
})
export type SetStakingFeeAddressParams = FunctionArguments<typeof setStakingFeeAddress>
export type SetStakingFeeAddressReturn = FunctionReturn<typeof setStakingFeeAddress>

/** setStakingFees(uint256) */
export const setStakingFees = func('0x482a8d07', {
    _newFee: uint256,
})
export type SetStakingFeesParams = FunctionArguments<typeof setStakingFees>
export type SetStakingFeesReturn = FunctionReturn<typeof setStakingFees>

/** setTreasuryFee(uint256) */
export const setTreasuryFee = func('0x77e741c7', {
    _tresFee: uint256,
})
export type SetTreasuryFeeParams = FunctionArguments<typeof setTreasuryFee>
export type SetTreasuryFeeReturn = FunctionReturn<typeof setTreasuryFee>

/** stableFee() */
export const stableFee = func('0x40bbd775', {}, uint256)
export type StableFeeParams = FunctionArguments<typeof stableFee>
export type StableFeeReturn = FunctionReturn<typeof stableFee>

/** stakingFeeHandler() */
export const stakingFeeHandler = func('0xc124a4a2', {}, address)
export type StakingFeeHandlerParams = FunctionArguments<typeof stakingFeeHandler>
export type StakingFeeHandlerReturn = FunctionReturn<typeof stakingFeeHandler>

/** stakingNFTFee() */
export const stakingNFTFee = func('0x956f94a1', {}, uint256)
export type StakingNFTFeeParams = FunctionArguments<typeof stakingNFTFee>
export type StakingNFTFeeReturn = FunctionReturn<typeof stakingNFTFee>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    newOwner: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** volatileFee() */
export const volatileFee = func('0x5084ed03', {}, uint256)
export type VolatileFeeParams = FunctionArguments<typeof volatileFee>
export type VolatileFeeReturn = FunctionReturn<typeof volatileFee>
