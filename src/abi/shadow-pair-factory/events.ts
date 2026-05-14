import { address, bool, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** FeeSplitWhenNoGauge(address,bool) */
export const FeeSplitWhenNoGauge = event('0x09f29919de9bbce805ed8b6088457163a7508940470e70a1c67a8d58a70b433d', {
    _caller: indexed(address),
    _status: indexed(bool),
})
export type FeeSplitWhenNoGaugeEventArgs = EParams<typeof FeeSplitWhenNoGauge>

/** NewTreasury(address,address) */
export const NewTreasury = event('0x567657fa3f286518b318f4a29870674f433f622fdfc819691acb13105b228225', {
    _caller: indexed(address),
    _newTreasury: indexed(address),
})
export type NewTreasuryEventArgs = EParams<typeof NewTreasury>

/** PairCreated(address,address,address,uint256) */
export const PairCreated = event('0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9', {
    token0: indexed(address),
    token1: indexed(address),
    pair: address,
    _3: uint256,
})
export type PairCreatedEventArgs = EParams<typeof PairCreated>

/** SetFee(uint256) */
export const SetFee = event('0x00172ddfc5ae88d08b3de01a5a187667c37a5a53989e8c175055cb6c993792a7', {
    fee: indexed(uint256),
})
export type SetFeeEventArgs = EParams<typeof SetFee>

/** SetFeeRecipient(address,address) */
export const SetFeeRecipient = event('0xd9d6b85b6d670cd443496fc6d03390f739bbff47f96a8e33fb0cdd52ad26f5c2', {
    pair: indexed(address),
    feeRecipient: indexed(address),
})
export type SetFeeRecipientEventArgs = EParams<typeof SetFeeRecipient>

/** SetFeeSplit(uint256) */
export const SetFeeSplit = event('0x2b29780fbcadbddb5194d8c2c6a834e1cd71e5a38456738fb1c9d39c7821066b', {
    _feeSplit: indexed(uint256),
})
export type SetFeeSplitEventArgs = EParams<typeof SetFeeSplit>

/** SetPairFee(address,uint256) */
export const SetPairFee = event('0xc792b1e9d2b63c63a75f8146a0b5bd7f568bdd6a0b97b9c31d585398718d4c46', {
    pair: indexed(address),
    fee: indexed(uint256),
})
export type SetPairFeeEventArgs = EParams<typeof SetPairFee>

/** SetPairFeeSplit(address,uint256) */
export const SetPairFeeSplit = event('0x40c433a8082166fcd8218fba9d4247bb08e03016d0056fc857d6363673ded031', {
    pair: indexed(address),
    _feeSplit: indexed(uint256),
})
export type SetPairFeeSplitEventArgs = EParams<typeof SetPairFeeSplit>

/** SkimStatus(address,bool) */
export const SkimStatus = event('0x13af6400168c56d7a03760d35e1d3d7e60d3f86c654d857e5c77ed8a83ffc119', {
    _pair: indexed(address),
    _status: indexed(bool),
})
export type SkimStatusEventArgs = EParams<typeof SkimStatus>
