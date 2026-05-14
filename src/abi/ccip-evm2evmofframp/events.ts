import { address, array, bytes, bytes32, struct, uint16, uint32, uint64, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AdminSet(address) */
export const AdminSet = event('0x8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c', {
    newAdmin: address,
})
export type AdminSetEventArgs = EParams<typeof AdminSet>

/** ConfigSet((address,uint64,uint64,address,address,address),(uint32,address,address,uint16,uint32,uint32)) */
export const ConfigSet = event('0xe668e1a4644c1a030b909bbfd837f5cfa914994ed5e0bb2e9c34a5c37753128a', {
    staticConfig: struct({
        commitStore: address,
        chainSelector: uint64,
        sourceChainSelector: uint64,
        onRamp: address,
        prevOffRamp: address,
        armProxy: address,
    }),
    dynamicConfig: struct({
        permissionLessExecutionThresholdSeconds: uint32,
        router: address,
        priceRegistry: address,
        maxNumberOfTokensPerMsg: uint16,
        maxDataBytes: uint32,
        maxPoolReleaseOrMintGas: uint32,
    }),
})
export type ConfigSetEventArgs = EParams<typeof ConfigSet>

/** ConfigSet(uint32,bytes32,uint64,address[],address[],uint8,bytes,uint64,bytes) */
export const ConfigSet_1 = event('0x1591690b8638f5fb2dbec82ac741805ac5da8b45dc5263f4875b0496fdce4e05', {
    previousConfigBlockNumber: uint32,
    configDigest: bytes32,
    configCount: uint64,
    signers: array(address),
    transmitters: array(address),
    f: uint8,
    onchainConfig: bytes,
    offchainConfigVersion: uint64,
    offchainConfig: bytes,
})
export type ConfigSetEventArgs_1 = EParams<typeof ConfigSet_1>

/** ExecutionStateChanged(uint64,bytes32,uint8,bytes) */
export const ExecutionStateChanged = event('0xd4f851956a5d67c3997d1c9205045fef79bae2947fdee7e9e2641abc7391ef65', {
    sequenceNumber: indexed(uint64),
    messageId: indexed(bytes32),
    state: uint8,
    returnData: bytes,
})
export type ExecutionStateChangedEventArgs = EParams<typeof ExecutionStateChanged>

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

/** PoolAdded(address,address) */
export const PoolAdded = event('0x95f865c2808f8b2a85eea2611db7843150ee7835ef1403f9755918a97d76933c', {
    token: address,
    pool: address,
})
export type PoolAddedEventArgs = EParams<typeof PoolAdded>

/** PoolRemoved(address,address) */
export const PoolRemoved = event('0x987eb3c2f78454541205f72f34839b434c306c9eaf4922efd7c0c3060fdb2e4c', {
    token: address,
    pool: address,
})
export type PoolRemovedEventArgs = EParams<typeof PoolRemoved>

/** SkippedIncorrectNonce(uint64,address) */
export const SkippedIncorrectNonce = event('0xd32ddb11d71e3d63411d37b09f9a8b28664f1cb1338bfd1413c173b0ebf41237', {
    nonce: indexed(uint64),
    sender: indexed(address),
})
export type SkippedIncorrectNonceEventArgs = EParams<typeof SkippedIncorrectNonce>

/** SkippedSenderWithPreviousRampMessageInflight(uint64,address) */
export const SkippedSenderWithPreviousRampMessageInflight = event('0xe44a20935573a783dd0d5991c92d7b6a0eb3173566530364db3ec10e9a990b5d', {
    nonce: indexed(uint64),
    sender: indexed(address),
})
export type SkippedSenderWithPreviousRampMessageInflightEventArgs = EParams<typeof SkippedSenderWithPreviousRampMessageInflight>

/** Transmitted(bytes32,uint32) */
export const Transmitted = event('0xb04e63db38c49950639fa09d29872f21f5d49d614f3a969d8adf3d4b52e41a62', {
    configDigest: bytes32,
    epoch: uint32,
})
export type TransmittedEventArgs = EParams<typeof Transmitted>
