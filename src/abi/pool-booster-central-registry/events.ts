import { address, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** FactoryApproved(address) */
export const FactoryApproved = event('0x4378f1462a48772813c3eb384aaee78cca44eb9a24b228a0118c8f4a8e5e3fd5', {
    factoryAddress: address,
})
export type FactoryApprovedEventArgs = EParams<typeof FactoryApproved>

/** FactoryRemoved(address) */
export const FactoryRemoved = event('0xafa2737b2090fa39c66b7348625f0c03726240f724defbc6216d679506f94441', {
    factoryAddress: address,
})
export type FactoryRemovedEventArgs = EParams<typeof FactoryRemoved>

/** GovernorshipTransferred(address,address) */
export const GovernorshipTransferred = event('0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type GovernorshipTransferredEventArgs = EParams<typeof GovernorshipTransferred>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** PoolBoosterCreated(address,address,uint8,address) */
export const PoolBoosterCreated = event('0x815a468ae1c240cd4e701cd11d7b89454db9d1c3e96c3ddda0b075e7612d5d68', {
    poolBoosterAddress: address,
    ammPoolAddress: address,
    poolBoosterType: uint8,
    factoryAddress: address,
})
export type PoolBoosterCreatedEventArgs = EParams<typeof PoolBoosterCreated>

/** PoolBoosterRemoved(address) */
export const PoolBoosterRemoved = event('0xa6267ed4a9ecad83a4813a850e7214f9a7fdf6995314c1c5efa359123d99b67b', {
    poolBoosterAddress: address,
})
export type PoolBoosterRemovedEventArgs = EParams<typeof PoolBoosterRemoved>
