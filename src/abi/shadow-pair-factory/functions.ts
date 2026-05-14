import { address, bool, bytes32, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** MAX_FEE() */
export const MAX_FEE = func('0xbc063e1a', {}, uint256)
export type MAX_FEEParams = FunctionArguments<typeof MAX_FEE>
export type MAX_FEEReturn = FunctionReturn<typeof MAX_FEE>

/** accessHub() */
export const accessHub = func('0xe7589b39', {}, address)
export type AccessHubParams = FunctionArguments<typeof accessHub>
export type AccessHubReturn = FunctionReturn<typeof accessHub>

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

/** fee() */
export const fee = func('0xddca3f43', {}, uint256)
export type FeeParams = FunctionArguments<typeof fee>
export type FeeReturn = FunctionReturn<typeof fee>

/** feeRecipientFactory() */
export const feeRecipientFactory = func('0xd32af6c1', {}, address)
export type FeeRecipientFactoryParams = FunctionArguments<typeof feeRecipientFactory>
export type FeeRecipientFactoryReturn = FunctionReturn<typeof feeRecipientFactory>

/** feeSplit() */
export const feeSplit = func('0x6373ea69', {}, uint256)
export type FeeSplitParams = FunctionArguments<typeof feeSplit>
export type FeeSplitReturn = FunctionReturn<typeof feeSplit>

/** feeSplitWhenNoGauge() */
export const feeSplitWhenNoGauge = func('0x83b274f2', {}, bool)
export type FeeSplitWhenNoGaugeParams = FunctionArguments<typeof feeSplitWhenNoGauge>
export type FeeSplitWhenNoGaugeReturn = FunctionReturn<typeof feeSplitWhenNoGauge>

/** getPair(address,address,bool) */
export const getPair = func('0x6801cc30', {
    token0: address,
    token1: address,
    stable: bool,
}, address)
export type GetPairParams = FunctionArguments<typeof getPair>
export type GetPairReturn = FunctionReturn<typeof getPair>

/** isPair(address) */
export const isPair = func('0xe5e31b13', {
    pair: address,
}, bool)
export type IsPairParams = FunctionArguments<typeof isPair>
export type IsPairReturn = FunctionReturn<typeof isPair>

/** pairCodeHash() */
export const pairCodeHash = func('0x9aab9248', {}, bytes32)
export type PairCodeHashParams = FunctionArguments<typeof pairCodeHash>
export type PairCodeHashReturn = FunctionReturn<typeof pairCodeHash>

/** pairFee(address) */
export const pairFee = func('0x841fa66b', {
    _pair: address,
}, uint256)
export type PairFeeParams = FunctionArguments<typeof pairFee>
export type PairFeeReturn = FunctionReturn<typeof pairFee>

/** setFee(uint256) */
export const setFee = func('0x69fe0e2d', {
    _fee: uint256,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setFeeRecipient(address,address) */
export const setFeeRecipient = func('0x270401cb', {
    _pair: address,
    _feeRecipient: address,
})
export type SetFeeRecipientParams = FunctionArguments<typeof setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof setFeeRecipient>

/** setFeeSplit(uint256) */
export const setFeeSplit = func('0xcd962a06', {
    _feeSplit: uint256,
})
export type SetFeeSplitParams = FunctionArguments<typeof setFeeSplit>
export type SetFeeSplitReturn = FunctionReturn<typeof setFeeSplit>

/** setFeeSplitWhenNoGauge(bool) */
export const setFeeSplitWhenNoGauge = func('0x90291058', {
    status: bool,
})
export type SetFeeSplitWhenNoGaugeParams = FunctionArguments<typeof setFeeSplitWhenNoGauge>
export type SetFeeSplitWhenNoGaugeReturn = FunctionReturn<typeof setFeeSplitWhenNoGauge>

/** setPairFee(address,uint256) */
export const setPairFee = func('0xa93a897d', {
    _pair: address,
    _fee: uint256,
})
export type SetPairFeeParams = FunctionArguments<typeof setPairFee>
export type SetPairFeeReturn = FunctionReturn<typeof setPairFee>

/** setPairFeeSplit(address,uint256) */
export const setPairFeeSplit = func('0x407c301e', {
    _pair: address,
    _feeSplit: uint256,
})
export type SetPairFeeSplitParams = FunctionArguments<typeof setPairFeeSplit>
export type SetPairFeeSplitReturn = FunctionReturn<typeof setPairFeeSplit>

/** setSkimEnabled(address,bool) */
export const setSkimEnabled = func('0xe0bd111d', {
    _pair: address,
    _status: bool,
})
export type SetSkimEnabledParams = FunctionArguments<typeof setSkimEnabled>
export type SetSkimEnabledReturn = FunctionReturn<typeof setSkimEnabled>

/** setTreasury(address) */
export const setTreasury = func('0xf0f44260', {
    _treasury: address,
})
export type SetTreasuryParams = FunctionArguments<typeof setTreasury>
export type SetTreasuryReturn = FunctionReturn<typeof setTreasury>

/** skimEnabled(address) */
export const skimEnabled = func('0xd2b66384', {
    pair: address,
}, bool)
export type SkimEnabledParams = FunctionArguments<typeof skimEnabled>
export type SkimEnabledReturn = FunctionReturn<typeof skimEnabled>

/** treasury() */
export const treasury = func('0x61d027b3', {}, address)
export type TreasuryParams = FunctionArguments<typeof treasury>
export type TreasuryReturn = FunctionReturn<typeof treasury>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>
