import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** SetMaximumDeviation(uint256,uint256) */
export const SetMaximumDeviation = event('0x7e2a21727a662d0def125b3d1237f41a099a760d472095091724cd8e56c25bf0', {
    oldMaxDeviation: uint256,
    newMaxDeviation: uint256,
})
export type SetMaximumDeviationEventArgs = EParams<typeof SetMaximumDeviation>

/** SetMaximumOracleDelay(uint256,uint256) */
export const SetMaximumOracleDelay = event('0xd72ef688fa430b6a285b84371ba35e8a8e0762b32c1deb7be9d9c111ca79f5ea', {
    oldMaxOracleDelay: uint256,
    newMaxOracleDelay: uint256,
})
export type SetMaximumOracleDelayEventArgs = EParams<typeof SetMaximumOracleDelay>

/** SetPriceSource(address,address) */
export const SetPriceSource = event('0x964298b435edfc268e11aa89b342ef1ddac566da6759b6dd15d7aad58a1dc935', {
    oldPriceSource: address,
    newPriceSource: address,
})
export type SetPriceSourceEventArgs = EParams<typeof SetPriceSource>

/** TimelockTransferStarted(address,address) */
export const TimelockTransferStarted = event('0x162998b90abc2507f3953aa797827b03a14c42dbd9a35f09feaf02e0d592773a', {
    previousTimelock: indexed(address),
    newTimelock: indexed(address),
})
export type TimelockTransferStartedEventArgs = EParams<typeof TimelockTransferStarted>

/** TimelockTransferred(address,address) */
export const TimelockTransferred = event('0x31b6c5a04b069b6ec1b3cef44c4e7c1eadd721349cda9823d0b1877b3551cdc6', {
    previousTimelock: indexed(address),
    newTimelock: indexed(address),
})
export type TimelockTransferredEventArgs = EParams<typeof TimelockTransferred>
