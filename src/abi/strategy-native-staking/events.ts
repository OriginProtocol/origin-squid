import { address, array, bytes, bytes32, int256, uint256, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AccountingConsensusRewards(uint256) */
export const AccountingConsensusRewards = event('0x7a745a2c63a535068f52ceca27debd5297bbad5f7f37ec53d044a59d0362445d', {
    amount: uint256,
})
export type AccountingConsensusRewardsEventArgs = EParams<typeof AccountingConsensusRewards>

/** AccountingFullyWithdrawnValidator(uint256,uint256,uint256) */
export const AccountingFullyWithdrawnValidator = event('0xbe7040030ff7b347853214bf49820c6d455fedf58f3815f85c7bc5216993682b', {
    noOfValidators: uint256,
    remainingValidators: uint256,
    wethSentToVault: uint256,
})
export type AccountingFullyWithdrawnValidatorEventArgs = EParams<typeof AccountingFullyWithdrawnValidator>

/** AccountingManuallyFixed(int256,int256,uint256) */
export const AccountingManuallyFixed = event('0x80d022717ea022455c5886b8dd8a29c037570aae58aeb4d7b136d7a10ec2e431', {
    validatorsDelta: int256,
    consensusRewardsDelta: int256,
    wethToVault: uint256,
})
export type AccountingManuallyFixedEventArgs = EParams<typeof AccountingManuallyFixed>

/** AccountingValidatorSlashed(uint256,uint256) */
export const AccountingValidatorSlashed = event('0x6aa7e30787b26429ced603a7aba8b19c4b5d5bcf29a3257da953c8d53bcaa3a6', {
    remainingValidators: uint256,
    wethSentToVault: uint256,
})
export type AccountingValidatorSlashedEventArgs = EParams<typeof AccountingValidatorSlashed>

/** ConsolidationConfirmed(uint256,uint256) */
export const ConsolidationConfirmed = event('0xb7f9b24f2efc7c0499fca5fd498666e42547910efe905fd5c16f835af7781990', {
    consolidationCount: uint256,
    activeDepositedValidators: uint256,
})
export type ConsolidationConfirmedEventArgs = EParams<typeof ConsolidationConfirmed>

/** ConsolidationFailed(bytes[],uint256) */
export const ConsolidationFailed = event('0x074b3c18e21730a43902b43af97fb84b42b016f1cf86c3e0c829ca01ca8c7b63', {
    sourcePubKeys: array(bytes),
    consolidationCount: uint256,
})
export type ConsolidationFailedEventArgs = EParams<typeof ConsolidationFailed>

/** ConsolidationRequested(bytes[],bytes,uint256) */
export const ConsolidationRequested = event('0x4112c6a63b43261097d9a5032ac2fff06997b110d3105de2f2320bb86f27cc58', {
    sourcePubKeys: array(bytes),
    targetPubKey: bytes,
    consolidationCount: uint256,
})
export type ConsolidationRequestedEventArgs = EParams<typeof ConsolidationRequested>

/** Deposit(address,address,uint256) */
export const Deposit = event('0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** ETHStaked(bytes32,bytes,uint256) */
export const ETHStaked = event('0x958934bb53d6b4dc911b6173e586864efbc8076684a31f752c53d5778340b37f', {
    pubKeyHash: indexed(bytes32),
    pubKey: bytes,
    amount: uint256,
})
export type ETHStakedEventArgs = EParams<typeof ETHStaked>

/** FuseIntervalUpdated(uint256,uint256) */
export const FuseIntervalUpdated = event('0xcb8d24e46eb3c402bf344ee60a6576cba9ef2f59ea1af3b311520704924e901a', {
    start: uint256,
    end: uint256,
})
export type FuseIntervalUpdatedEventArgs = EParams<typeof FuseIntervalUpdated>

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

/** SSVValidatorExitCompleted(bytes32,bytes,uint64[]) */
export const SSVValidatorExitCompleted = event('0x6aecca20726a17c1b81989b2fd09dfdf636bae9e564d4066ca18df62dc1f3dc2', {
    pubKeyHash: indexed(bytes32),
    pubKey: bytes,
    operatorIds: array(uint64),
})
export type SSVValidatorExitCompletedEventArgs = EParams<typeof SSVValidatorExitCompleted>

/** SSVValidatorExitInitiated(bytes32,bytes,uint64[]) */
export const SSVValidatorExitInitiated = event('0x8c2e15303eb94e531acc988c2a01d1193bdaaa15eda7f16dda85316ed463578d', {
    pubKeyHash: indexed(bytes32),
    pubKey: bytes,
    operatorIds: array(uint64),
})
export type SSVValidatorExitInitiatedEventArgs = EParams<typeof SSVValidatorExitInitiated>

/** SSVValidatorRegistered(bytes32,bytes,uint64[]) */
export const SSVValidatorRegistered = event('0xacd38e900350661e325d592c959664c0000a306efb2004e7dc283f44e0ea0423', {
    pubKeyHash: indexed(bytes32),
    pubKey: bytes,
    operatorIds: array(uint64),
})
export type SSVValidatorRegisteredEventArgs = EParams<typeof SSVValidatorRegistered>

/** StakeETHTallyReset() */
export const StakeETHTallyReset = event('0xe765a88a37047c5d793dce22b9ceb5a0f5039d276da139b4c7d29613f341f110', {})
export type StakeETHTallyResetEventArgs = EParams<typeof StakeETHTallyReset>

/** StakeETHThresholdChanged(uint256) */
export const StakeETHThresholdChanged = event('0xe26b067424903962f951f568e52ec9a3bbe1589526ea54a4e69ca6eaae1a4c77', {
    amount: uint256,
})
export type StakeETHThresholdChangedEventArgs = EParams<typeof StakeETHThresholdChanged>

/** StakingMonitorChanged(address) */
export const StakingMonitorChanged = event('0x3329861a0008b3348767567d2405492b997abd79a088d0f2cef6b1a09a8e7ff7', {
    newAddress: indexed(address),
})
export type StakingMonitorChangedEventArgs = EParams<typeof StakingMonitorChanged>

/** Unpaused(address) */
export const Unpaused = event('0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa', {
    account: address,
})
export type UnpausedEventArgs = EParams<typeof Unpaused>

/** Withdrawal(address,address,uint256) */
export const Withdrawal = event('0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398', {
    _asset: indexed(address),
    _pToken: address,
    _amount: uint256,
})
export type WithdrawalEventArgs = EParams<typeof Withdrawal>
