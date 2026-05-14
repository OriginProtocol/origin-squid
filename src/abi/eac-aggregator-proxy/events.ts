import { address, int256, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AnswerUpdated(int256,uint256,uint256) */
export const AnswerUpdated = event('0x0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f', {
    current: indexed(int256),
    roundId: indexed(uint256),
    updatedAt: uint256,
})
export type AnswerUpdatedEventArgs = EParams<typeof AnswerUpdated>

/** NewRound(uint256,address,uint256) */
export const NewRound = event('0x0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac60271', {
    roundId: indexed(uint256),
    startedBy: indexed(address),
    startedAt: uint256,
})
export type NewRoundEventArgs = EParams<typeof NewRound>

/** OwnershipTransferRequested(address,address) */
export const OwnershipTransferRequested = event('0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278', {
    from: indexed(address),
    to: indexed(address),
})
export type OwnershipTransferRequestedEventArgs = EParams<typeof OwnershipTransferRequested>

/** OwnershipTransferred(address,address) */
export const OwnershipTransferred = event('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0', {
    from: indexed(address),
    to: indexed(address),
})
export type OwnershipTransferredEventArgs = EParams<typeof OwnershipTransferred>
