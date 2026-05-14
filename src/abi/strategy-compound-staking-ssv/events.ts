import { address, array, bytes, bytes32, uint256, uint40, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** BalancesSnapped(bytes32,uint256) */
export const BalancesSnapped = event('0xb7523e03ed4a74718427c422a01fee1138835adb5bd592240f30bd8b5e1b929a', {
    blockRoot: indexed(bytes32),
    ethBalance: uint256,
})
export type BalancesSnappedEventArgs = EParams<typeof BalancesSnapped>

/** BalancesVerified(uint64,uint256,uint256,uint256) */
export const BalancesVerified = event('0xed2528338eefb63fd1860078b91e35106bc25e3fd528634d180f662582fe5ec1', {
    timestamp: indexed(uint64),
    totalDepositsWei: uint256,
    totalValidatorBalance: uint256,
    ethBalance: uint256,
})
export type BalancesVerifiedEventArgs = EParams<typeof BalancesVerified>

/** Deposit(address,address,uint256) */
export const Deposit = event('0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** DepositVerified(bytes32,uint256) */
export const DepositVerified = event('0xae0e4f727389efd70d748d667436e0264f370ae498b339b713797dbab57b12ff', {
    pendingDepositRoot: indexed(bytes32),
    amountWei: uint256,
})
export type DepositVerifiedEventArgs = EParams<typeof DepositVerified>

/** ETHStaked(bytes32,bytes32,bytes,uint256) */
export const ETHStaked = event('0xaca97428a1d7f2b7c4cee2fbe4feda457e132b404b0c9c3ff73bf7a988d889a8', {
    pubKeyHash: indexed(bytes32),
    pendingDepositRoot: indexed(bytes32),
    pubKey: bytes,
    amountWei: uint256,
})
export type ETHStakedEventArgs = EParams<typeof ETHStaked>

/** FirstDepositReset() */
export const FirstDepositReset = event('0xce77f85e30b0e6df0d12527ddf038f900fdeda0eeda4284c52be47b05de31a97', {})
export type FirstDepositResetEventArgs = EParams<typeof FirstDepositReset>

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

/** Paused(address) */
export const Paused = event('0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258', {
    account: address,
})
export type PausedEventArgs = EParams<typeof Paused>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** RegistratorChanged(address) */
export const RegistratorChanged = event('0x83f29c79feb71f8fba9d0fbc4ba5f0982a28b6b1e868b3fc50e6400d100bca0f', {
    newAddress: indexed(address),
})
export type RegistratorChangedEventArgs = EParams<typeof RegistratorChanged>

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

/** SSVValidatorRegistered(bytes32,uint64[]) */
export const SSVValidatorRegistered = event('0x50837f89f5e75ae0a7bcc858f53ea15fa398dc007fd52cbfe4683ae9a6c2d722', {
    pubKeyHash: indexed(bytes32),
    operatorIds: array(uint64),
})
export type SSVValidatorRegisteredEventArgs = EParams<typeof SSVValidatorRegistered>

/** SSVValidatorRemoved(bytes32,uint64[]) */
export const SSVValidatorRemoved = event('0x63d54ea43f163d6e28fc23abec67eb7c3294e7e6f0620955a73cd8d17c7367f4', {
    pubKeyHash: indexed(bytes32),
    operatorIds: array(uint64),
})
export type SSVValidatorRemovedEventArgs = EParams<typeof SSVValidatorRemoved>

/** Unpaused(address) */
export const Unpaused = event('0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa', {
    account: address,
})
export type UnpausedEventArgs = EParams<typeof Unpaused>

/** ValidatorInvalid(bytes32) */
export const ValidatorInvalid = event('0xb8318df57b70f6381fb18aaf762e33efa2cc92627aae83d417f6710e1415d8d8', {
    pubKeyHash: indexed(bytes32),
})
export type ValidatorInvalidEventArgs = EParams<typeof ValidatorInvalid>

/** ValidatorVerified(bytes32,uint40) */
export const ValidatorVerified = event('0x8142f1367675d1a37dc1aa31258c38b05f5348de55b799764472d94ccb4a71f4', {
    pubKeyHash: indexed(bytes32),
    validatorIndex: indexed(uint40),
})
export type ValidatorVerifiedEventArgs = EParams<typeof ValidatorVerified>

/** ValidatorWithdraw(bytes32,uint256) */
export const ValidatorWithdraw = event('0x8dd83105dbd4263d41c76e5d414905babdd3f035bd2031f6ce8895715595979c', {
    pubKeyHash: indexed(bytes32),
    amountWei: uint256,
})
export type ValidatorWithdrawEventArgs = EParams<typeof ValidatorWithdraw>

/** Withdrawal(address,address,uint256) */
export const Withdrawal = event('0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type WithdrawalEventArgs = EParams<typeof Withdrawal>
