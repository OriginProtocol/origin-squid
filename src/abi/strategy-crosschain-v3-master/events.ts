import { address, array, bool, uint256, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** BalanceReported(uint64,uint256,uint256) */
export const BalanceReported = event('0xd4fd4771d0cd0c0ae174b20500f87727ae4f91c9b1131c16ef01f64e31cdf3e3', {
    nonce: uint64,
    remoteBalance: uint256,
    remoteTimestamp: uint256,
})
export type BalanceReportedEventArgs = EParams<typeof BalanceReported>

/** Deposit(address,address,uint256) */
export const Deposit = event('0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** DepositAcked(uint64,uint256) */
export const DepositAcked = event('0x27f05f9e295fc53ad300dc8df4662dffdcde09aa5addf12e565f2ff05bbaef2f', {
    nonce: uint64,
    remoteBalance: uint256,
})
export type DepositAckedEventArgs = EParams<typeof DepositAcked>

/** DepositRequested(uint64,uint256) */
export const DepositRequested = event('0xf5038ffb5f135253d0b2baba462c2bf29d8f3fa9c81edeb752ffed877503f5da', {
    nonce: uint64,
    amount: uint256,
})
export type DepositRequestedEventArgs = EParams<typeof DepositRequested>

/** DepositSkipped(uint256,uint256) */
export const DepositSkipped = event('0xf679b1e20c26ae4921ab36e5e65e647694045634ed1779841c726eaadf50df4c', {
    amount: uint256,
    minTransfer: uint256,
})
export type DepositSkippedEventArgs = EParams<typeof DepositSkipped>

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

/** InboundAdapterUpdated(address,address) */
export const InboundAdapterUpdated = event('0x079a2665443e2ba2ce6116a6117b90649e0e6285a7ed3553a24b6df3ed93e46a', {
    oldAdapter: address,
    newAdapter: address,
})
export type InboundAdapterUpdatedEventArgs = EParams<typeof InboundAdapterUpdated>

/** OperatorUpdated(address,address) */
export const OperatorUpdated = event('0xfbe5b6cbafb274f445d7fed869dc77a838d8243a22c460de156560e8857cad03', {
    oldOperator: address,
    newOperator: address,
})
export type OperatorUpdatedEventArgs = EParams<typeof OperatorUpdated>

/** OutboundAdapterUpdated(address,address) */
export const OutboundAdapterUpdated = event('0x94659083196a5228c09d850023176cdf7bc52a1eb4a086e8ab45324e2470cb5a', {
    oldAdapter: address,
    newAdapter: address,
})
export type OutboundAdapterUpdatedEventArgs = EParams<typeof OutboundAdapterUpdated>

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

/** RemoteStrategyBalanceUpdated(uint256) */
export const RemoteStrategyBalanceUpdated = event('0x1cc993845fe77d504bd0e3391d651586e84db1cefbcdd9b4f85e8ed1c1f13c10', {
    remoteBalance: uint256,
})
export type RemoteStrategyBalanceUpdatedEventArgs = EParams<typeof RemoteStrategyBalanceUpdated>

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

/** WithdrawClaimAcked(uint64,uint256,bool) */
export const WithdrawClaimAcked = event('0xd28436e36b265c71ca002c1a654a79dfc3d96202396c1728b01fa890ab9c54e2', {
    nonce: uint64,
    remoteBalance: uint256,
    success: bool,
})
export type WithdrawClaimAckedEventArgs = EParams<typeof WithdrawClaimAcked>

/** WithdrawClaimTriggered(uint64,uint256) */
export const WithdrawClaimTriggered = event('0x418a2ac7ca6a86bcea1d8947d84274ceda43b1cdcc4ebba03ca18ce91eb134ec', {
    nonce: uint64,
    amount: uint256,
})
export type WithdrawClaimTriggeredEventArgs = EParams<typeof WithdrawClaimTriggered>

/** WithdrawRequestAcked(uint64,uint256) */
export const WithdrawRequestAcked = event('0xae808b4d085fda3ca3c970c036f833259990543b2bab001ddb9dbcc6f77d4aa0', {
    nonce: uint64,
    remoteBalance: uint256,
})
export type WithdrawRequestAckedEventArgs = EParams<typeof WithdrawRequestAcked>

/** WithdrawRequested(uint64,uint256) */
export const WithdrawRequested = event('0x2faceadd8f84cd9c4f0c0f9fc8fc82265bcdbada1d5e5ce9f381891e4a648237', {
    nonce: uint64,
    amount: uint256,
})
export type WithdrawRequestedEventArgs = EParams<typeof WithdrawRequested>

/** Withdrawal(address,address,uint256) */
export const Withdrawal = event('0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type WithdrawalEventArgs = EParams<typeof Withdrawal>

/** YieldNonceAdvanced(uint64) */
export const YieldNonceAdvanced = event('0x2f7e37765552c9ad20400590baa7a61f867e701e82a76f4fc92987c2212b2e23', {
    nonce: uint64,
})
export type YieldNonceAdvancedEventArgs = EParams<typeof YieldNonceAdvanced>

/** YieldNonceProcessed(uint64) */
export const YieldNonceProcessed = event('0xdf4d7560e27f8a36c62d192a1a7b53b02d3216008f1d48194acd689aae344e3c', {
    nonce: uint64,
})
export type YieldNonceProcessedEventArgs = EParams<typeof YieldNonceProcessed>
