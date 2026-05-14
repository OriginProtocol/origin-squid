import { address, array, bool, bytes, bytes3, bytes32, string, struct, uint256, uint64 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** UPGRADE_INTERFACE_VERSION() */
export const UPGRADE_INTERFACE_VERSION = func('0xad3cb1cc', {}, string)
export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof UPGRADE_INTERFACE_VERSION>

/** _syncValidator(uint256,bool) */
export const _syncValidator = func('0xcc8343aa', {
    validatorID: uint256,
    syncPubkey: bool,
})
export type _syncValidatorParams = FunctionArguments<typeof _syncValidator>
export type _syncValidatorReturn = FunctionReturn<typeof _syncValidator>

/** announceRedirection(address) */
export const announceRedirection = func('0x46f1ca35', {
    to: address,
})
export type AnnounceRedirectionParams = FunctionArguments<typeof announceRedirection>
export type AnnounceRedirectionReturn = FunctionReturn<typeof announceRedirection>

/** burnNativeTokens() */
export const burnNativeTokens = func('0x850a10c0', {})
export type BurnNativeTokensParams = FunctionArguments<typeof burnNativeTokens>
export type BurnNativeTokensReturn = FunctionReturn<typeof burnNativeTokens>

/** claimRewards(uint256) */
export const claimRewards = func('0x0962ef79', {
    toValidatorID: uint256,
})
export type ClaimRewardsParams = FunctionArguments<typeof claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof claimRewards>

/** constsAddress() */
export const constsAddress = func('0xd46fa518', {}, address)
export type ConstsAddressParams = FunctionArguments<typeof constsAddress>
export type ConstsAddressReturn = FunctionReturn<typeof constsAddress>

/** createValidator(bytes) */
export const createValidator = func('0xa5a470ad', {
    pubkey: bytes,
})
export type CreateValidatorParams = FunctionArguments<typeof createValidator>
export type CreateValidatorReturn = FunctionReturn<typeof createValidator>

/** currentEpoch() */
export const currentEpoch = func('0x76671808', {}, uint256)
export type CurrentEpochParams = FunctionArguments<typeof currentEpoch>
export type CurrentEpochReturn = FunctionReturn<typeof currentEpoch>

/** currentSealedEpoch() */
export const currentSealedEpoch = func('0x7cacb1d6', {}, uint256)
export type CurrentSealedEpochParams = FunctionArguments<typeof currentSealedEpoch>
export type CurrentSealedEpochReturn = FunctionReturn<typeof currentSealedEpoch>

/** deactivateValidator(uint256,uint256) */
export const deactivateValidator = func('0x1e702f83', {
    validatorID: uint256,
    status: uint256,
})
export type DeactivateValidatorParams = FunctionArguments<typeof deactivateValidator>
export type DeactivateValidatorReturn = FunctionReturn<typeof deactivateValidator>

/** delegate(uint256) */
export const delegate = func('0x9fa6dd35', {
    toValidatorID: uint256,
})
export type DelegateParams = FunctionArguments<typeof delegate>
export type DelegateReturn = FunctionReturn<typeof delegate>

/** getEpochAccumulatedOriginatedTxsFee(uint256,uint256) */
export const getEpochAccumulatedOriginatedTxsFee = func('0xdc31e1af', {
    epoch: uint256,
    validatorID: uint256,
}, uint256)
export type GetEpochAccumulatedOriginatedTxsFeeParams = FunctionArguments<typeof getEpochAccumulatedOriginatedTxsFee>
export type GetEpochAccumulatedOriginatedTxsFeeReturn = FunctionReturn<typeof getEpochAccumulatedOriginatedTxsFee>

/** getEpochAccumulatedRewardPerToken(uint256,uint256) */
export const getEpochAccumulatedRewardPerToken = func('0x61e53fcc', {
    epoch: uint256,
    validatorID: uint256,
}, uint256)
export type GetEpochAccumulatedRewardPerTokenParams = FunctionArguments<typeof getEpochAccumulatedRewardPerToken>
export type GetEpochAccumulatedRewardPerTokenReturn = FunctionReturn<typeof getEpochAccumulatedRewardPerToken>

/** getEpochAccumulatedUptime(uint256,uint256) */
export const getEpochAccumulatedUptime = func('0xdf00c922', {
    epoch: uint256,
    validatorID: uint256,
}, uint256)
export type GetEpochAccumulatedUptimeParams = FunctionArguments<typeof getEpochAccumulatedUptime>
export type GetEpochAccumulatedUptimeReturn = FunctionReturn<typeof getEpochAccumulatedUptime>

/** getEpochAverageUptime(uint256,uint256) */
export const getEpochAverageUptime = func('0xaa5d8292', {
    epoch: uint256,
    validatorID: uint256,
}, uint64)
export type GetEpochAverageUptimeParams = FunctionArguments<typeof getEpochAverageUptime>
export type GetEpochAverageUptimeReturn = FunctionReturn<typeof getEpochAverageUptime>

/** getEpochEndBlock(uint256) */
export const getEpochEndBlock = func('0xdb5ca3e5', {
    epoch: uint256,
}, uint256)
export type GetEpochEndBlockParams = FunctionArguments<typeof getEpochEndBlock>
export type GetEpochEndBlockReturn = FunctionReturn<typeof getEpochEndBlock>

/** getEpochOfflineBlocks(uint256,uint256) */
export const getEpochOfflineBlocks = func('0xa198d229', {
    epoch: uint256,
    validatorID: uint256,
}, uint256)
export type GetEpochOfflineBlocksParams = FunctionArguments<typeof getEpochOfflineBlocks>
export type GetEpochOfflineBlocksReturn = FunctionReturn<typeof getEpochOfflineBlocks>

/** getEpochOfflineTime(uint256,uint256) */
export const getEpochOfflineTime = func('0xe261641a', {
    epoch: uint256,
    validatorID: uint256,
}, uint256)
export type GetEpochOfflineTimeParams = FunctionArguments<typeof getEpochOfflineTime>
export type GetEpochOfflineTimeReturn = FunctionReturn<typeof getEpochOfflineTime>

/** getEpochReceivedStake(uint256,uint256) */
export const getEpochReceivedStake = func('0x58f95b80', {
    epoch: uint256,
    validatorID: uint256,
}, uint256)
export type GetEpochReceivedStakeParams = FunctionArguments<typeof getEpochReceivedStake>
export type GetEpochReceivedStakeReturn = FunctionReturn<typeof getEpochReceivedStake>

/** getEpochSnapshot(uint256) */
export const getEpochSnapshot = func('0x39b80c00', {
    epoch: uint256,
}, struct({
    endTime: uint256,
    endBlock: uint256,
    epochFee: uint256,
    baseRewardPerSecond: uint256,
    totalStake: uint256,
    totalSupply: uint256,
}))
export type GetEpochSnapshotParams = FunctionArguments<typeof getEpochSnapshot>
export type GetEpochSnapshotReturn = FunctionReturn<typeof getEpochSnapshot>

/** getEpochValidatorIDs(uint256) */
export const getEpochValidatorIDs = func('0xb88a37e2', {
    epoch: uint256,
}, array(uint256))
export type GetEpochValidatorIDsParams = FunctionArguments<typeof getEpochValidatorIDs>
export type GetEpochValidatorIDsReturn = FunctionReturn<typeof getEpochValidatorIDs>

/** getRedirection(address) */
export const getRedirection = func('0x736de9ae', {
    delegator: address,
}, address)
export type GetRedirectionParams = FunctionArguments<typeof getRedirection>
export type GetRedirectionReturn = FunctionReturn<typeof getRedirection>

/** getRedirectionRequest(address) */
export const getRedirectionRequest = func('0x468f35ee', {
    delegator: address,
}, address)
export type GetRedirectionRequestParams = FunctionArguments<typeof getRedirectionRequest>
export type GetRedirectionRequestReturn = FunctionReturn<typeof getRedirectionRequest>

/** getSelfStake(uint256) */
export const getSelfStake = func('0x5601fe01', {
    validatorID: uint256,
}, uint256)
export type GetSelfStakeParams = FunctionArguments<typeof getSelfStake>
export type GetSelfStakeReturn = FunctionReturn<typeof getSelfStake>

/** getStake(address,uint256) */
export const getStake = func('0xcfd47663', {
    delegator: address,
    validatorID: uint256,
}, uint256)
export type GetStakeParams = FunctionArguments<typeof getStake>
export type GetStakeReturn = FunctionReturn<typeof getStake>

/** getValidator(uint256) */
export const getValidator = func('0xb5d89627', {
    validatorID: uint256,
}, struct({
    status: uint256,
    receivedStake: uint256,
    auth: address,
    createdEpoch: uint256,
    createdTime: uint256,
    deactivatedTime: uint256,
    deactivatedEpoch: uint256,
}))
export type GetValidatorParams = FunctionArguments<typeof getValidator>
export type GetValidatorReturn = FunctionReturn<typeof getValidator>

/** getValidatorID(address) */
export const getValidatorID = func('0x0135b1db', {
    auth: address,
}, uint256)
export type GetValidatorIDParams = FunctionArguments<typeof getValidatorID>
export type GetValidatorIDReturn = FunctionReturn<typeof getValidatorID>

/** getValidatorPubkey(uint256) */
export const getValidatorPubkey = func('0x854873e1', {
    validatorID: uint256,
}, bytes)
export type GetValidatorPubkeyParams = FunctionArguments<typeof getValidatorPubkey>
export type GetValidatorPubkeyReturn = FunctionReturn<typeof getValidatorPubkey>

/** getWithdrawalRequest(address,uint256,uint256) */
export const getWithdrawalRequest = func('0x1f270152', {
    delegator: address,
    validatorID: uint256,
    wrID: uint256,
}, struct({
    epoch: uint256,
    time: uint256,
    amount: uint256,
}))
export type GetWithdrawalRequestParams = FunctionArguments<typeof getWithdrawalRequest>
export type GetWithdrawalRequestReturn = FunctionReturn<typeof getWithdrawalRequest>

/** initialize(uint256,uint256,address,address,address) */
export const initialize = func('0x3fbfd4df', {
    sealedEpoch: uint256,
    _totalSupply: uint256,
    nodeDriver: address,
    _c: address,
    owner: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** initiateRedirection(address,address) */
export const initiateRedirection = func('0xcc172784', {
    from: address,
    to: address,
})
export type InitiateRedirectionParams = FunctionArguments<typeof initiateRedirection>
export type InitiateRedirectionReturn = FunctionReturn<typeof initiateRedirection>

/** isSlashed(uint256) */
export const isSlashed = func('0xc3de580e', {
    validatorID: uint256,
}, bool)
export type IsSlashedParams = FunctionArguments<typeof isSlashed>
export type IsSlashedReturn = FunctionReturn<typeof isSlashed>

/** issueTokens(uint256) */
export const issueTokens = func('0xa5820daa', {
    amount: uint256,
})
export type IssueTokensParams = FunctionArguments<typeof issueTokens>
export type IssueTokensReturn = FunctionReturn<typeof issueTokens>

/** lastValidatorID() */
export const lastValidatorID = func('0xc7be95de', {}, uint256)
export type LastValidatorIDParams = FunctionArguments<typeof lastValidatorID>
export type LastValidatorIDReturn = FunctionReturn<typeof lastValidatorID>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** pendingRewards(address,uint256) */
export const pendingRewards = func('0x6099ecb2', {
    delegator: address,
    toValidatorID: uint256,
}, uint256)
export type PendingRewardsParams = FunctionArguments<typeof pendingRewards>
export type PendingRewardsReturn = FunctionReturn<typeof pendingRewards>

/** proxiableUUID() */
export const proxiableUUID = func('0x52d1902d', {}, bytes32)
export type ProxiableUUIDParams = FunctionArguments<typeof proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof proxiableUUID>

/** pubkeyAddressToValidatorID(address) */
export const pubkeyAddressToValidatorID = func('0xfb36025f', {
    pubkeyAddress: address,
}, uint256)
export type PubkeyAddressToValidatorIDParams = FunctionArguments<typeof pubkeyAddressToValidatorID>
export type PubkeyAddressToValidatorIDReturn = FunctionReturn<typeof pubkeyAddressToValidatorID>

/** redirect(address) */
export const redirect = func('0xd725e91f', {
    to: address,
})
export type RedirectParams = FunctionArguments<typeof redirect>
export type RedirectReturn = FunctionReturn<typeof redirect>

/** redirectionAuthorizer() */
export const redirectionAuthorizer = func('0xe9a505a7', {}, address)
export type RedirectionAuthorizerParams = FunctionArguments<typeof redirectionAuthorizer>
export type RedirectionAuthorizerReturn = FunctionReturn<typeof redirectionAuthorizer>

/** renounceOwnership() */
export const renounceOwnership = func('0x715018a6', {})
export type RenounceOwnershipParams = FunctionArguments<typeof renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof renounceOwnership>

/** resolveTreasuryFees() */
export const resolveTreasuryFees = func('0x84b863e0', {})
export type ResolveTreasuryFeesParams = FunctionArguments<typeof resolveTreasuryFees>
export type ResolveTreasuryFeesReturn = FunctionReturn<typeof resolveTreasuryFees>

/** restakeRewards(uint256) */
export const restakeRewards = func('0x08c36874', {
    toValidatorID: uint256,
})
export type RestakeRewardsParams = FunctionArguments<typeof restakeRewards>
export type RestakeRewardsReturn = FunctionReturn<typeof restakeRewards>

/** rewardsStash(address,uint256) */
export const rewardsStash = func('0x6f498663', {
    delegator: address,
    validatorID: uint256,
}, uint256)
export type RewardsStashParams = FunctionArguments<typeof rewardsStash>
export type RewardsStashReturn = FunctionReturn<typeof rewardsStash>

/** sealEpoch(uint256[],uint256[],uint256[],uint256[]) */
export const sealEpoch = func('0xebdf104c', {
    offlineTime: array(uint256),
    offlineBlocks: array(uint256),
    uptimes: array(uint256),
    originatedTxsFee: array(uint256),
})
export type SealEpochParams = FunctionArguments<typeof sealEpoch>
export type SealEpochReturn = FunctionReturn<typeof sealEpoch>

/** sealEpochValidators(uint256[]) */
export const sealEpochValidators = func('0xe08d7e66', {
    nextValidatorIDs: array(uint256),
})
export type SealEpochValidatorsParams = FunctionArguments<typeof sealEpochValidators>
export type SealEpochValidatorsReturn = FunctionReturn<typeof sealEpochValidators>

/** setGenesisDelegation(address,uint256,uint256) */
export const setGenesisDelegation = func('0xa8ab09ba', {
    delegator: address,
    toValidatorID: uint256,
    stake: uint256,
})
export type SetGenesisDelegationParams = FunctionArguments<typeof setGenesisDelegation>
export type SetGenesisDelegationReturn = FunctionReturn<typeof setGenesisDelegation>

/** setGenesisValidator(address,uint256,bytes,uint256) */
export const setGenesisValidator = func('0x76fed43a', {
    auth: address,
    validatorID: uint256,
    pubkey: bytes,
    createdTime: uint256,
})
export type SetGenesisValidatorParams = FunctionArguments<typeof setGenesisValidator>
export type SetGenesisValidatorReturn = FunctionReturn<typeof setGenesisValidator>

/** setRedirectionAuthorizer(address) */
export const setRedirectionAuthorizer = func('0xb0ef386c', {
    v: address,
})
export type SetRedirectionAuthorizerParams = FunctionArguments<typeof setRedirectionAuthorizer>
export type SetRedirectionAuthorizerReturn = FunctionReturn<typeof setRedirectionAuthorizer>

/** slashingRefundRatio(uint256) */
export const slashingRefundRatio = func('0xc65ee0e1', {
    validatorID: uint256,
}, uint256)
export type SlashingRefundRatioParams = FunctionArguments<typeof slashingRefundRatio>
export type SlashingRefundRatioReturn = FunctionReturn<typeof slashingRefundRatio>

/** stakeSubscriberAddress() */
export const stakeSubscriberAddress = func('0x093b41d0', {}, address)
export type StakeSubscriberAddressParams = FunctionArguments<typeof stakeSubscriberAddress>
export type StakeSubscriberAddressReturn = FunctionReturn<typeof stakeSubscriberAddress>

/** stashRewards(address,uint256) */
export const stashRewards = func('0x8cddb015', {
    delegator: address,
    toValidatorID: uint256,
})
export type StashRewardsParams = FunctionArguments<typeof stashRewards>
export type StashRewardsReturn = FunctionReturn<typeof stashRewards>

/** stashedRewardsUntilEpoch(address,uint256) */
export const stashedRewardsUntilEpoch = func('0xa86a056f', {
    delegator: address,
    validatorID: uint256,
}, uint256)
export type StashedRewardsUntilEpochParams = FunctionArguments<typeof stashedRewardsUntilEpoch>
export type StashedRewardsUntilEpochReturn = FunctionReturn<typeof stashedRewardsUntilEpoch>

/** totalActiveStake() */
export const totalActiveStake = func('0x28f73148', {}, uint256)
export type TotalActiveStakeParams = FunctionArguments<typeof totalActiveStake>
export type TotalActiveStakeReturn = FunctionReturn<typeof totalActiveStake>

/** totalStake() */
export const totalStake = func('0x8b0e9f3f', {}, uint256)
export type TotalStakeParams = FunctionArguments<typeof totalStake>
export type TotalStakeReturn = FunctionReturn<typeof totalStake>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    newOwner: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** treasuryAddress() */
export const treasuryAddress = func('0xc5f956af', {}, address)
export type TreasuryAddressParams = FunctionArguments<typeof treasuryAddress>
export type TreasuryAddressReturn = FunctionReturn<typeof treasuryAddress>

/** undelegate(uint256,uint256,uint256) */
export const undelegate = func('0x4f864df4', {
    toValidatorID: uint256,
    wrID: uint256,
    amount: uint256,
})
export type UndelegateParams = FunctionArguments<typeof undelegate>
export type UndelegateReturn = FunctionReturn<typeof undelegate>

/** unresolvedTreasuryFees() */
export const unresolvedTreasuryFees = func('0x8d2da32e', {}, uint256)
export type UnresolvedTreasuryFeesParams = FunctionArguments<typeof unresolvedTreasuryFees>
export type UnresolvedTreasuryFeesReturn = FunctionReturn<typeof unresolvedTreasuryFees>

/** updateConstsAddress(address) */
export const updateConstsAddress = func('0x860c2750', {
    v: address,
})
export type UpdateConstsAddressParams = FunctionArguments<typeof updateConstsAddress>
export type UpdateConstsAddressReturn = FunctionReturn<typeof updateConstsAddress>

/** updateSlashingRefundRatio(uint256,uint256) */
export const updateSlashingRefundRatio = func('0x4f7c4efb', {
    validatorID: uint256,
    refundRatio: uint256,
})
export type UpdateSlashingRefundRatioParams = FunctionArguments<typeof updateSlashingRefundRatio>
export type UpdateSlashingRefundRatioReturn = FunctionReturn<typeof updateSlashingRefundRatio>

/** updateStakeSubscriberAddress(address) */
export const updateStakeSubscriberAddress = func('0xe880a159', {
    v: address,
})
export type UpdateStakeSubscriberAddressParams = FunctionArguments<typeof updateStakeSubscriberAddress>
export type UpdateStakeSubscriberAddressReturn = FunctionReturn<typeof updateStakeSubscriberAddress>

/** updateTreasuryAddress(address) */
export const updateTreasuryAddress = func('0x841e4561', {
    v: address,
})
export type UpdateTreasuryAddressParams = FunctionArguments<typeof updateTreasuryAddress>
export type UpdateTreasuryAddressReturn = FunctionReturn<typeof updateTreasuryAddress>

/** upgradeToAndCall(address,bytes) */
export const upgradeToAndCall = func('0x4f1ef286', {
    newImplementation: address,
    data: bytes,
})
export type UpgradeToAndCallParams = FunctionArguments<typeof upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof upgradeToAndCall>

/** version() */
export const version = func('0x54fd4d50', {}, bytes3)
export type VersionParams = FunctionArguments<typeof version>
export type VersionReturn = FunctionReturn<typeof version>

/** withdraw(uint256,uint256) */
export const withdraw = func('0x441a3e70', {
    toValidatorID: uint256,
    wrID: uint256,
})
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>
