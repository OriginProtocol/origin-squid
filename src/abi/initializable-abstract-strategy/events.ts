import { address, array, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Deposit(address,address,uint256) */
export const Deposit = event('0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** GovernorshipTransferred(address,address) */
export const GovernorshipTransferred = event('0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type GovernorshipTransferredEventArgs = EParams<typeof GovernorshipTransferred>

/** HarvesterAddressesUpdated(address,address) */
export const HarvesterAddressesUpdated = event('0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796', {
    _oldHarvesterAddress: address,
    _newHarvesterAddress: address,
})
export type HarvesterAddressesUpdatedEventArgs = EParams<typeof HarvesterAddressesUpdated>

/** PTokenAdded(address,address) */
export const PTokenAdded = event('0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765', {
    _asset: indexed(address),
    _pToken: address,
})
export type PTokenAddedEventArgs = EParams<typeof PTokenAdded>

/** PTokenRemoved(address,address) */
export const PTokenRemoved = event('0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c', {
    _asset: indexed(address),
    _pToken: address,
})
export type PTokenRemovedEventArgs = EParams<typeof PTokenRemoved>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** RewardTokenAddressesUpdated(address[],address[]) */
export const RewardTokenAddressesUpdated = event('0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc', {
    _oldAddresses: array(address),
    _newAddresses: array(address),
})
export type RewardTokenAddressesUpdatedEventArgs = EParams<typeof RewardTokenAddressesUpdated>

/** RewardTokenCollected(address,address,uint256) */
export const RewardTokenCollected = event('0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353', {
    recipient: address,
    rewardToken: address,
    amount: uint256,
})
export type RewardTokenCollectedEventArgs = EParams<typeof RewardTokenCollected>

/** Withdrawal(address,address,uint256) */
export const Withdrawal = event('0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type WithdrawalEventArgs = EParams<typeof Withdrawal>
