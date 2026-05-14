import { address, bytes32, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** MessageExecuted(bytes32,uint64,address,bytes32) */
export const MessageExecuted = event('0x9b877de93ea9895756e337442c657f95a34fc68e7eb988bdfa693d5be83016b6', {
    messageId: bytes32,
    sourceChainSelector: uint64,
    offRamp: address,
    calldataHash: bytes32,
})
export type MessageExecutedEventArgs = EParams<typeof MessageExecuted>

/** OffRampAdded(uint64,address) */
export const OffRampAdded = event('0xa4bdf64ebdf3316320601a081916a75aa144bcef6c4beeb0e9fb1982cacc6b94', {
    sourceChainSelector: indexed(uint64),
    offRamp: address,
})
export type OffRampAddedEventArgs = EParams<typeof OffRampAdded>

/** OffRampRemoved(uint64,address) */
export const OffRampRemoved = event('0xa823809efda3ba66c873364eec120fa0923d9fabda73bc97dd5663341e2d9bcb', {
    sourceChainSelector: indexed(uint64),
    offRamp: address,
})
export type OffRampRemovedEventArgs = EParams<typeof OffRampRemoved>

/** OnRampSet(uint64,address) */
export const OnRampSet = event('0x1f7d0ec248b80e5c0dde0ee531c4fc8fdb6ce9a2b3d90f560c74acd6a7202f23', {
    destChainSelector: indexed(uint64),
    onRamp: address,
})
export type OnRampSetEventArgs = EParams<typeof OnRampSet>

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
