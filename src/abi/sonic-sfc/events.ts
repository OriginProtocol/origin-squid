import { address, uint256, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AnnouncedRedirection(address,address) */
export const AnnouncedRedirection = event('0x857125196131cfcd709c738c6d1fd2701ce70f2a03785aeadae6f4b47fe73c1d', {
    from: indexed(address),
    to: indexed(address),
})
export type AnnouncedRedirectionEventArgs = EParams<typeof AnnouncedRedirection>

/** BurntNativeTokens(uint256) */
export const BurntNativeTokens = event('0x66ac49f046ee1185a59a920bbdfe95faba2bba02afc4b64a97ac35d5d14acc47', {
    amount: uint256,
})
export type BurntNativeTokensEventArgs = EParams<typeof BurntNativeTokens>

/** ChangedValidatorStatus(uint256,uint256) */
export const ChangedValidatorStatus = event('0xcd35267e7654194727477d6c78b541a553483cff7f92a055d17868d3da6e953e', {
    validatorID: indexed(uint256),
    status: uint256,
})
export type ChangedValidatorStatusEventArgs = EParams<typeof ChangedValidatorStatus>

/** ClaimedRewards(address,uint256,uint256) */
export const ClaimedRewards = event('0x70de20a533702af05c8faf1637846c4586a021bbc71b6928b089b6d555e4fbc2', {
    delegator: indexed(address),
    toValidatorID: indexed(uint256),
    rewards: uint256,
})
export type ClaimedRewardsEventArgs = EParams<typeof ClaimedRewards>

/** CreatedValidator(uint256,address,uint256,uint256) */
export const CreatedValidator = event('0x49bca1ed2666922f9f1690c26a569e1299c2a715fe57647d77e81adfabbf25bf', {
    validatorID: indexed(uint256),
    auth: indexed(address),
    createdEpoch: uint256,
    createdTime: uint256,
})
export type CreatedValidatorEventArgs = EParams<typeof CreatedValidator>

/** DeactivatedValidator(uint256,uint256,uint256) */
export const DeactivatedValidator = event('0xac4801c32a6067ff757446524ee4e7a373797278ac3c883eac5c693b4ad72e47', {
    validatorID: indexed(uint256),
    deactivatedEpoch: uint256,
    deactivatedTime: uint256,
})
export type DeactivatedValidatorEventArgs = EParams<typeof DeactivatedValidator>

/** Delegated(address,uint256,uint256) */
export const Delegated = event('0x9a8f44850296624dadfd9c246d17e47171d35727a181bd090aa14bbbe00238bb', {
    delegator: indexed(address),
    toValidatorID: indexed(uint256),
    amount: uint256,
})
export type DelegatedEventArgs = EParams<typeof Delegated>

/** Initialized(uint64) */
export const Initialized = event('0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2', {
    version: uint64,
})
export type InitializedEventArgs = EParams<typeof Initialized>

/** OwnershipTransferred(address,address) */
export const OwnershipTransferred = event('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0', {
    previousOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnershipTransferredEventArgs = EParams<typeof OwnershipTransferred>

/** RefundedSlashedLegacyDelegation(address,uint256,uint256) */
export const RefundedSlashedLegacyDelegation = event('0x172fdfaf5222519d28d2794b7617be033f46d954f9b6c3896e7d2611ff444252', {
    delegator: indexed(address),
    validatorID: indexed(uint256),
    amount: uint256,
})
export type RefundedSlashedLegacyDelegationEventArgs = EParams<typeof RefundedSlashedLegacyDelegation>

/** RestakedRewards(address,uint256,uint256) */
export const RestakedRewards = event('0x663e0f63f4fc6b01be195c4b56111fd6f14b947d6264497119b08daf77e26da5', {
    delegator: indexed(address),
    toValidatorID: indexed(uint256),
    rewards: uint256,
})
export type RestakedRewardsEventArgs = EParams<typeof RestakedRewards>

/** TreasuryFeesResolved(uint256) */
export const TreasuryFeesResolved = event('0x6dd5bb8ebf4cfb647c1cc0e9364ed9ecbf56202f7d3c9f058473df82664478d8', {
    amount: uint256,
})
export type TreasuryFeesResolvedEventArgs = EParams<typeof TreasuryFeesResolved>

/** Undelegated(address,uint256,uint256,uint256) */
export const Undelegated = event('0xd3bb4e423fbea695d16b982f9f682dc5f35152e5411646a8a5a79a6b02ba8d57', {
    delegator: indexed(address),
    toValidatorID: indexed(uint256),
    wrID: indexed(uint256),
    amount: uint256,
})
export type UndelegatedEventArgs = EParams<typeof Undelegated>

/** UpdatedSlashingRefundRatio(uint256,uint256) */
export const UpdatedSlashingRefundRatio = event('0x047575f43f09a7a093d94ec483064acfc61b7e25c0de28017da442abf99cb917', {
    validatorID: indexed(uint256),
    refundRatio: uint256,
})
export type UpdatedSlashingRefundRatioEventArgs = EParams<typeof UpdatedSlashingRefundRatio>

/** Upgraded(address) */
export const Upgraded = event('0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b', {
    implementation: indexed(address),
})
export type UpgradedEventArgs = EParams<typeof Upgraded>

/** Withdrawn(address,uint256,uint256,uint256,uint256) */
export const Withdrawn = event('0x94ffd6b85c71b847775c89ef6496b93cee961bdc6ff827fd117f174f06f745ae', {
    delegator: indexed(address),
    toValidatorID: indexed(uint256),
    wrID: indexed(uint256),
    amount: uint256,
    penalty: uint256,
})
export type WithdrawnEventArgs = EParams<typeof Withdrawn>
