import { address, uint16 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AccessControllerSet(address,address) */
export const AccessControllerSet = event('0x953e92b1a6442e9c3242531154a3f6f6eb00b4e9c719ba8118fa6235e4ce89b6', {
    accessController: indexed(address),
    sender: indexed(address),
})
export type AccessControllerSetEventArgs = EParams<typeof AccessControllerSet>

/** FeedConfirmed(address,address,address,address,uint16,address) */
export const FeedConfirmed = event('0x27a180c70f2642f63d1694eb252b7df52e7ab2565e3f67adf7748acb7d82b9bc', {
    asset: indexed(address),
    denomination: indexed(address),
    latestAggregator: indexed(address),
    previousAggregator: address,
    nextPhaseId: uint16,
    sender: address,
})
export type FeedConfirmedEventArgs = EParams<typeof FeedConfirmed>

/** FeedProposed(address,address,address,address,address) */
export const FeedProposed = event('0xb56c4f88c3e344891ef92e51f036d7116e886f4ea57f5ba93e28b5f44925b9ce', {
    asset: indexed(address),
    denomination: indexed(address),
    proposedAggregator: indexed(address),
    currentAggregator: address,
    sender: address,
})
export type FeedProposedEventArgs = EParams<typeof FeedProposed>

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
