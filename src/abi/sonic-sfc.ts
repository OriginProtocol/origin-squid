import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AnnouncedRedirection: event("0x857125196131cfcd709c738c6d1fd2701ce70f2a03785aeadae6f4b47fe73c1d", "AnnouncedRedirection(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    BurntNativeTokens: event("0x66ac49f046ee1185a59a920bbdfe95faba2bba02afc4b64a97ac35d5d14acc47", "BurntNativeTokens(uint256)", {"amount": p.uint256}),
    ChangedValidatorStatus: event("0xcd35267e7654194727477d6c78b541a553483cff7f92a055d17868d3da6e953e", "ChangedValidatorStatus(uint256,uint256)", {"validatorID": indexed(p.uint256), "status": p.uint256}),
    ClaimedRewards: event("0x70de20a533702af05c8faf1637846c4586a021bbc71b6928b089b6d555e4fbc2", "ClaimedRewards(address,uint256,uint256)", {"delegator": indexed(p.address), "toValidatorID": indexed(p.uint256), "rewards": p.uint256}),
    CreatedValidator: event("0x49bca1ed2666922f9f1690c26a569e1299c2a715fe57647d77e81adfabbf25bf", "CreatedValidator(uint256,address,uint256,uint256)", {"validatorID": indexed(p.uint256), "auth": indexed(p.address), "createdEpoch": p.uint256, "createdTime": p.uint256}),
    DeactivatedValidator: event("0xac4801c32a6067ff757446524ee4e7a373797278ac3c883eac5c693b4ad72e47", "DeactivatedValidator(uint256,uint256,uint256)", {"validatorID": indexed(p.uint256), "deactivatedEpoch": p.uint256, "deactivatedTime": p.uint256}),
    Delegated: event("0x9a8f44850296624dadfd9c246d17e47171d35727a181bd090aa14bbbe00238bb", "Delegated(address,uint256,uint256)", {"delegator": indexed(p.address), "toValidatorID": indexed(p.uint256), "amount": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    RefundedSlashedLegacyDelegation: event("0x172fdfaf5222519d28d2794b7617be033f46d954f9b6c3896e7d2611ff444252", "RefundedSlashedLegacyDelegation(address,uint256,uint256)", {"delegator": indexed(p.address), "validatorID": indexed(p.uint256), "amount": p.uint256}),
    RestakedRewards: event("0x663e0f63f4fc6b01be195c4b56111fd6f14b947d6264497119b08daf77e26da5", "RestakedRewards(address,uint256,uint256)", {"delegator": indexed(p.address), "toValidatorID": indexed(p.uint256), "rewards": p.uint256}),
    TreasuryFeesResolved: event("0x6dd5bb8ebf4cfb647c1cc0e9364ed9ecbf56202f7d3c9f058473df82664478d8", "TreasuryFeesResolved(uint256)", {"amount": p.uint256}),
    Undelegated: event("0xd3bb4e423fbea695d16b982f9f682dc5f35152e5411646a8a5a79a6b02ba8d57", "Undelegated(address,uint256,uint256,uint256)", {"delegator": indexed(p.address), "toValidatorID": indexed(p.uint256), "wrID": indexed(p.uint256), "amount": p.uint256}),
    UpdatedSlashingRefundRatio: event("0x047575f43f09a7a093d94ec483064acfc61b7e25c0de28017da442abf99cb917", "UpdatedSlashingRefundRatio(uint256,uint256)", {"validatorID": indexed(p.uint256), "refundRatio": p.uint256}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    Withdrawn: event("0x94ffd6b85c71b847775c89ef6496b93cee961bdc6ff827fd117f174f06f745ae", "Withdrawn(address,uint256,uint256,uint256,uint256)", {"delegator": indexed(p.address), "toValidatorID": indexed(p.uint256), "wrID": indexed(p.uint256), "amount": p.uint256, "penalty": p.uint256}),
}

export const functions = {
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    _syncValidator: fun("0xcc8343aa", "_syncValidator(uint256,bool)", {"validatorID": p.uint256, "syncPubkey": p.bool}, ),
    announceRedirection: fun("0x46f1ca35", "announceRedirection(address)", {"to": p.address}, ),
    burnNativeTokens: fun("0x850a10c0", "burnNativeTokens()", {}, ),
    claimRewards: fun("0x0962ef79", "claimRewards(uint256)", {"toValidatorID": p.uint256}, ),
    constsAddress: viewFun("0xd46fa518", "constsAddress()", {}, p.address),
    createValidator: fun("0xa5a470ad", "createValidator(bytes)", {"pubkey": p.bytes}, ),
    currentEpoch: viewFun("0x76671808", "currentEpoch()", {}, p.uint256),
    currentSealedEpoch: viewFun("0x7cacb1d6", "currentSealedEpoch()", {}, p.uint256),
    deactivateValidator: fun("0x1e702f83", "deactivateValidator(uint256,uint256)", {"validatorID": p.uint256, "status": p.uint256}, ),
    delegate: fun("0x9fa6dd35", "delegate(uint256)", {"toValidatorID": p.uint256}, ),
    getEpochAccumulatedOriginatedTxsFee: viewFun("0xdc31e1af", "getEpochAccumulatedOriginatedTxsFee(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint256),
    getEpochAccumulatedRewardPerToken: viewFun("0x61e53fcc", "getEpochAccumulatedRewardPerToken(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint256),
    getEpochAccumulatedUptime: viewFun("0xdf00c922", "getEpochAccumulatedUptime(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint256),
    getEpochAverageUptime: viewFun("0xaa5d8292", "getEpochAverageUptime(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint64),
    getEpochEndBlock: viewFun("0xdb5ca3e5", "getEpochEndBlock(uint256)", {"epoch": p.uint256}, p.uint256),
    getEpochOfflineBlocks: viewFun("0xa198d229", "getEpochOfflineBlocks(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint256),
    getEpochOfflineTime: viewFun("0xe261641a", "getEpochOfflineTime(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint256),
    getEpochReceivedStake: viewFun("0x58f95b80", "getEpochReceivedStake(uint256,uint256)", {"epoch": p.uint256, "validatorID": p.uint256}, p.uint256),
    getEpochSnapshot: viewFun("0x39b80c00", "getEpochSnapshot(uint256)", {"epoch": p.uint256}, {"endTime": p.uint256, "endBlock": p.uint256, "epochFee": p.uint256, "baseRewardPerSecond": p.uint256, "totalStake": p.uint256, "totalSupply": p.uint256}),
    getEpochValidatorIDs: viewFun("0xb88a37e2", "getEpochValidatorIDs(uint256)", {"epoch": p.uint256}, p.array(p.uint256)),
    getRedirection: viewFun("0x736de9ae", "getRedirection(address)", {"delegator": p.address}, p.address),
    getRedirectionRequest: viewFun("0x468f35ee", "getRedirectionRequest(address)", {"delegator": p.address}, p.address),
    getSelfStake: viewFun("0x5601fe01", "getSelfStake(uint256)", {"validatorID": p.uint256}, p.uint256),
    getStake: viewFun("0xcfd47663", "getStake(address,uint256)", {"delegator": p.address, "validatorID": p.uint256}, p.uint256),
    getValidator: viewFun("0xb5d89627", "getValidator(uint256)", {"validatorID": p.uint256}, {"status": p.uint256, "receivedStake": p.uint256, "auth": p.address, "createdEpoch": p.uint256, "createdTime": p.uint256, "deactivatedTime": p.uint256, "deactivatedEpoch": p.uint256}),
    getValidatorID: viewFun("0x0135b1db", "getValidatorID(address)", {"auth": p.address}, p.uint256),
    getValidatorPubkey: viewFun("0x854873e1", "getValidatorPubkey(uint256)", {"validatorID": p.uint256}, p.bytes),
    getWithdrawalRequest: viewFun("0x1f270152", "getWithdrawalRequest(address,uint256,uint256)", {"delegator": p.address, "validatorID": p.uint256, "wrID": p.uint256}, {"epoch": p.uint256, "time": p.uint256, "amount": p.uint256}),
    initialize: fun("0x3fbfd4df", "initialize(uint256,uint256,address,address,address)", {"sealedEpoch": p.uint256, "_totalSupply": p.uint256, "nodeDriver": p.address, "_c": p.address, "owner": p.address}, ),
    initiateRedirection: fun("0xcc172784", "initiateRedirection(address,address)", {"from": p.address, "to": p.address}, ),
    isSlashed: viewFun("0xc3de580e", "isSlashed(uint256)", {"validatorID": p.uint256}, p.bool),
    issueTokens: fun("0xa5820daa", "issueTokens(uint256)", {"amount": p.uint256}, ),
    lastValidatorID: viewFun("0xc7be95de", "lastValidatorID()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pendingRewards: viewFun("0x6099ecb2", "pendingRewards(address,uint256)", {"delegator": p.address, "toValidatorID": p.uint256}, p.uint256),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    pubkeyAddressToValidatorID: viewFun("0xfb36025f", "pubkeyAddressToValidatorID(address)", {"pubkeyAddress": p.address}, p.uint256),
    redirect: fun("0xd725e91f", "redirect(address)", {"to": p.address}, ),
    redirectionAuthorizer: viewFun("0xe9a505a7", "redirectionAuthorizer()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    resolveTreasuryFees: fun("0x84b863e0", "resolveTreasuryFees()", {}, ),
    restakeRewards: fun("0x08c36874", "restakeRewards(uint256)", {"toValidatorID": p.uint256}, ),
    rewardsStash: viewFun("0x6f498663", "rewardsStash(address,uint256)", {"delegator": p.address, "validatorID": p.uint256}, p.uint256),
    sealEpoch: fun("0xebdf104c", "sealEpoch(uint256[],uint256[],uint256[],uint256[])", {"offlineTime": p.array(p.uint256), "offlineBlocks": p.array(p.uint256), "uptimes": p.array(p.uint256), "originatedTxsFee": p.array(p.uint256)}, ),
    sealEpochValidators: fun("0xe08d7e66", "sealEpochValidators(uint256[])", {"nextValidatorIDs": p.array(p.uint256)}, ),
    setGenesisDelegation: fun("0xa8ab09ba", "setGenesisDelegation(address,uint256,uint256)", {"delegator": p.address, "toValidatorID": p.uint256, "stake": p.uint256}, ),
    setGenesisValidator: fun("0x76fed43a", "setGenesisValidator(address,uint256,bytes,uint256)", {"auth": p.address, "validatorID": p.uint256, "pubkey": p.bytes, "createdTime": p.uint256}, ),
    setRedirectionAuthorizer: fun("0xb0ef386c", "setRedirectionAuthorizer(address)", {"v": p.address}, ),
    slashingRefundRatio: viewFun("0xc65ee0e1", "slashingRefundRatio(uint256)", {"validatorID": p.uint256}, p.uint256),
    stakeSubscriberAddress: viewFun("0x093b41d0", "stakeSubscriberAddress()", {}, p.address),
    stashRewards: fun("0x8cddb015", "stashRewards(address,uint256)", {"delegator": p.address, "toValidatorID": p.uint256}, ),
    stashedRewardsUntilEpoch: viewFun("0xa86a056f", "stashedRewardsUntilEpoch(address,uint256)", {"delegator": p.address, "validatorID": p.uint256}, p.uint256),
    totalActiveStake: viewFun("0x28f73148", "totalActiveStake()", {}, p.uint256),
    totalStake: viewFun("0x8b0e9f3f", "totalStake()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    treasuryAddress: viewFun("0xc5f956af", "treasuryAddress()", {}, p.address),
    undelegate: fun("0x4f864df4", "undelegate(uint256,uint256,uint256)", {"toValidatorID": p.uint256, "wrID": p.uint256, "amount": p.uint256}, ),
    unresolvedTreasuryFees: viewFun("0x8d2da32e", "unresolvedTreasuryFees()", {}, p.uint256),
    updateConstsAddress: fun("0x860c2750", "updateConstsAddress(address)", {"v": p.address}, ),
    updateSlashingRefundRatio: fun("0x4f7c4efb", "updateSlashingRefundRatio(uint256,uint256)", {"validatorID": p.uint256, "refundRatio": p.uint256}, ),
    updateStakeSubscriberAddress: fun("0xe880a159", "updateStakeSubscriberAddress(address)", {"v": p.address}, ),
    updateTreasuryAddress: fun("0x841e4561", "updateTreasuryAddress(address)", {"v": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
    version: viewFun("0x54fd4d50", "version()", {}, p.bytes3),
    withdraw: fun("0x441a3e70", "withdraw(uint256,uint256)", {"toValidatorID": p.uint256, "wrID": p.uint256}, ),
}

export class Contract extends ContractBase {

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    constsAddress() {
        return this.eth_call(functions.constsAddress, {})
    }

    currentEpoch() {
        return this.eth_call(functions.currentEpoch, {})
    }

    currentSealedEpoch() {
        return this.eth_call(functions.currentSealedEpoch, {})
    }

    getEpochAccumulatedOriginatedTxsFee(epoch: GetEpochAccumulatedOriginatedTxsFeeParams["epoch"], validatorID: GetEpochAccumulatedOriginatedTxsFeeParams["validatorID"]) {
        return this.eth_call(functions.getEpochAccumulatedOriginatedTxsFee, {epoch, validatorID})
    }

    getEpochAccumulatedRewardPerToken(epoch: GetEpochAccumulatedRewardPerTokenParams["epoch"], validatorID: GetEpochAccumulatedRewardPerTokenParams["validatorID"]) {
        return this.eth_call(functions.getEpochAccumulatedRewardPerToken, {epoch, validatorID})
    }

    getEpochAccumulatedUptime(epoch: GetEpochAccumulatedUptimeParams["epoch"], validatorID: GetEpochAccumulatedUptimeParams["validatorID"]) {
        return this.eth_call(functions.getEpochAccumulatedUptime, {epoch, validatorID})
    }

    getEpochAverageUptime(epoch: GetEpochAverageUptimeParams["epoch"], validatorID: GetEpochAverageUptimeParams["validatorID"]) {
        return this.eth_call(functions.getEpochAverageUptime, {epoch, validatorID})
    }

    getEpochEndBlock(epoch: GetEpochEndBlockParams["epoch"]) {
        return this.eth_call(functions.getEpochEndBlock, {epoch})
    }

    getEpochOfflineBlocks(epoch: GetEpochOfflineBlocksParams["epoch"], validatorID: GetEpochOfflineBlocksParams["validatorID"]) {
        return this.eth_call(functions.getEpochOfflineBlocks, {epoch, validatorID})
    }

    getEpochOfflineTime(epoch: GetEpochOfflineTimeParams["epoch"], validatorID: GetEpochOfflineTimeParams["validatorID"]) {
        return this.eth_call(functions.getEpochOfflineTime, {epoch, validatorID})
    }

    getEpochReceivedStake(epoch: GetEpochReceivedStakeParams["epoch"], validatorID: GetEpochReceivedStakeParams["validatorID"]) {
        return this.eth_call(functions.getEpochReceivedStake, {epoch, validatorID})
    }

    getEpochSnapshot(epoch: GetEpochSnapshotParams["epoch"]) {
        return this.eth_call(functions.getEpochSnapshot, {epoch})
    }

    getEpochValidatorIDs(epoch: GetEpochValidatorIDsParams["epoch"]) {
        return this.eth_call(functions.getEpochValidatorIDs, {epoch})
    }

    getRedirection(delegator: GetRedirectionParams["delegator"]) {
        return this.eth_call(functions.getRedirection, {delegator})
    }

    getRedirectionRequest(delegator: GetRedirectionRequestParams["delegator"]) {
        return this.eth_call(functions.getRedirectionRequest, {delegator})
    }

    getSelfStake(validatorID: GetSelfStakeParams["validatorID"]) {
        return this.eth_call(functions.getSelfStake, {validatorID})
    }

    getStake(delegator: GetStakeParams["delegator"], validatorID: GetStakeParams["validatorID"]) {
        return this.eth_call(functions.getStake, {delegator, validatorID})
    }

    getValidator(validatorID: GetValidatorParams["validatorID"]) {
        return this.eth_call(functions.getValidator, {validatorID})
    }

    getValidatorID(auth: GetValidatorIDParams["auth"]) {
        return this.eth_call(functions.getValidatorID, {auth})
    }

    getValidatorPubkey(validatorID: GetValidatorPubkeyParams["validatorID"]) {
        return this.eth_call(functions.getValidatorPubkey, {validatorID})
    }

    getWithdrawalRequest(delegator: GetWithdrawalRequestParams["delegator"], validatorID: GetWithdrawalRequestParams["validatorID"], wrID: GetWithdrawalRequestParams["wrID"]) {
        return this.eth_call(functions.getWithdrawalRequest, {delegator, validatorID, wrID})
    }

    isSlashed(validatorID: IsSlashedParams["validatorID"]) {
        return this.eth_call(functions.isSlashed, {validatorID})
    }

    lastValidatorID() {
        return this.eth_call(functions.lastValidatorID, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingRewards(delegator: PendingRewardsParams["delegator"], toValidatorID: PendingRewardsParams["toValidatorID"]) {
        return this.eth_call(functions.pendingRewards, {delegator, toValidatorID})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    pubkeyAddressToValidatorID(pubkeyAddress: PubkeyAddressToValidatorIDParams["pubkeyAddress"]) {
        return this.eth_call(functions.pubkeyAddressToValidatorID, {pubkeyAddress})
    }

    redirectionAuthorizer() {
        return this.eth_call(functions.redirectionAuthorizer, {})
    }

    rewardsStash(delegator: RewardsStashParams["delegator"], validatorID: RewardsStashParams["validatorID"]) {
        return this.eth_call(functions.rewardsStash, {delegator, validatorID})
    }

    slashingRefundRatio(validatorID: SlashingRefundRatioParams["validatorID"]) {
        return this.eth_call(functions.slashingRefundRatio, {validatorID})
    }

    stakeSubscriberAddress() {
        return this.eth_call(functions.stakeSubscriberAddress, {})
    }

    stashedRewardsUntilEpoch(delegator: StashedRewardsUntilEpochParams["delegator"], validatorID: StashedRewardsUntilEpochParams["validatorID"]) {
        return this.eth_call(functions.stashedRewardsUntilEpoch, {delegator, validatorID})
    }

    totalActiveStake() {
        return this.eth_call(functions.totalActiveStake, {})
    }

    totalStake() {
        return this.eth_call(functions.totalStake, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    treasuryAddress() {
        return this.eth_call(functions.treasuryAddress, {})
    }

    unresolvedTreasuryFees() {
        return this.eth_call(functions.unresolvedTreasuryFees, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }
}

/// Event types
export type AnnouncedRedirectionEventArgs = EParams<typeof events.AnnouncedRedirection>
export type BurntNativeTokensEventArgs = EParams<typeof events.BurntNativeTokens>
export type ChangedValidatorStatusEventArgs = EParams<typeof events.ChangedValidatorStatus>
export type ClaimedRewardsEventArgs = EParams<typeof events.ClaimedRewards>
export type CreatedValidatorEventArgs = EParams<typeof events.CreatedValidator>
export type DeactivatedValidatorEventArgs = EParams<typeof events.DeactivatedValidator>
export type DelegatedEventArgs = EParams<typeof events.Delegated>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type RefundedSlashedLegacyDelegationEventArgs = EParams<typeof events.RefundedSlashedLegacyDelegation>
export type RestakedRewardsEventArgs = EParams<typeof events.RestakedRewards>
export type TreasuryFeesResolvedEventArgs = EParams<typeof events.TreasuryFeesResolved>
export type UndelegatedEventArgs = EParams<typeof events.Undelegated>
export type UpdatedSlashingRefundRatioEventArgs = EParams<typeof events.UpdatedSlashingRefundRatio>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type _syncValidatorParams = FunctionArguments<typeof functions._syncValidator>
export type _syncValidatorReturn = FunctionReturn<typeof functions._syncValidator>

export type AnnounceRedirectionParams = FunctionArguments<typeof functions.announceRedirection>
export type AnnounceRedirectionReturn = FunctionReturn<typeof functions.announceRedirection>

export type BurnNativeTokensParams = FunctionArguments<typeof functions.burnNativeTokens>
export type BurnNativeTokensReturn = FunctionReturn<typeof functions.burnNativeTokens>

export type ClaimRewardsParams = FunctionArguments<typeof functions.claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof functions.claimRewards>

export type ConstsAddressParams = FunctionArguments<typeof functions.constsAddress>
export type ConstsAddressReturn = FunctionReturn<typeof functions.constsAddress>

export type CreateValidatorParams = FunctionArguments<typeof functions.createValidator>
export type CreateValidatorReturn = FunctionReturn<typeof functions.createValidator>

export type CurrentEpochParams = FunctionArguments<typeof functions.currentEpoch>
export type CurrentEpochReturn = FunctionReturn<typeof functions.currentEpoch>

export type CurrentSealedEpochParams = FunctionArguments<typeof functions.currentSealedEpoch>
export type CurrentSealedEpochReturn = FunctionReturn<typeof functions.currentSealedEpoch>

export type DeactivateValidatorParams = FunctionArguments<typeof functions.deactivateValidator>
export type DeactivateValidatorReturn = FunctionReturn<typeof functions.deactivateValidator>

export type DelegateParams = FunctionArguments<typeof functions.delegate>
export type DelegateReturn = FunctionReturn<typeof functions.delegate>

export type GetEpochAccumulatedOriginatedTxsFeeParams = FunctionArguments<typeof functions.getEpochAccumulatedOriginatedTxsFee>
export type GetEpochAccumulatedOriginatedTxsFeeReturn = FunctionReturn<typeof functions.getEpochAccumulatedOriginatedTxsFee>

export type GetEpochAccumulatedRewardPerTokenParams = FunctionArguments<typeof functions.getEpochAccumulatedRewardPerToken>
export type GetEpochAccumulatedRewardPerTokenReturn = FunctionReturn<typeof functions.getEpochAccumulatedRewardPerToken>

export type GetEpochAccumulatedUptimeParams = FunctionArguments<typeof functions.getEpochAccumulatedUptime>
export type GetEpochAccumulatedUptimeReturn = FunctionReturn<typeof functions.getEpochAccumulatedUptime>

export type GetEpochAverageUptimeParams = FunctionArguments<typeof functions.getEpochAverageUptime>
export type GetEpochAverageUptimeReturn = FunctionReturn<typeof functions.getEpochAverageUptime>

export type GetEpochEndBlockParams = FunctionArguments<typeof functions.getEpochEndBlock>
export type GetEpochEndBlockReturn = FunctionReturn<typeof functions.getEpochEndBlock>

export type GetEpochOfflineBlocksParams = FunctionArguments<typeof functions.getEpochOfflineBlocks>
export type GetEpochOfflineBlocksReturn = FunctionReturn<typeof functions.getEpochOfflineBlocks>

export type GetEpochOfflineTimeParams = FunctionArguments<typeof functions.getEpochOfflineTime>
export type GetEpochOfflineTimeReturn = FunctionReturn<typeof functions.getEpochOfflineTime>

export type GetEpochReceivedStakeParams = FunctionArguments<typeof functions.getEpochReceivedStake>
export type GetEpochReceivedStakeReturn = FunctionReturn<typeof functions.getEpochReceivedStake>

export type GetEpochSnapshotParams = FunctionArguments<typeof functions.getEpochSnapshot>
export type GetEpochSnapshotReturn = FunctionReturn<typeof functions.getEpochSnapshot>

export type GetEpochValidatorIDsParams = FunctionArguments<typeof functions.getEpochValidatorIDs>
export type GetEpochValidatorIDsReturn = FunctionReturn<typeof functions.getEpochValidatorIDs>

export type GetRedirectionParams = FunctionArguments<typeof functions.getRedirection>
export type GetRedirectionReturn = FunctionReturn<typeof functions.getRedirection>

export type GetRedirectionRequestParams = FunctionArguments<typeof functions.getRedirectionRequest>
export type GetRedirectionRequestReturn = FunctionReturn<typeof functions.getRedirectionRequest>

export type GetSelfStakeParams = FunctionArguments<typeof functions.getSelfStake>
export type GetSelfStakeReturn = FunctionReturn<typeof functions.getSelfStake>

export type GetStakeParams = FunctionArguments<typeof functions.getStake>
export type GetStakeReturn = FunctionReturn<typeof functions.getStake>

export type GetValidatorParams = FunctionArguments<typeof functions.getValidator>
export type GetValidatorReturn = FunctionReturn<typeof functions.getValidator>

export type GetValidatorIDParams = FunctionArguments<typeof functions.getValidatorID>
export type GetValidatorIDReturn = FunctionReturn<typeof functions.getValidatorID>

export type GetValidatorPubkeyParams = FunctionArguments<typeof functions.getValidatorPubkey>
export type GetValidatorPubkeyReturn = FunctionReturn<typeof functions.getValidatorPubkey>

export type GetWithdrawalRequestParams = FunctionArguments<typeof functions.getWithdrawalRequest>
export type GetWithdrawalRequestReturn = FunctionReturn<typeof functions.getWithdrawalRequest>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type InitiateRedirectionParams = FunctionArguments<typeof functions.initiateRedirection>
export type InitiateRedirectionReturn = FunctionReturn<typeof functions.initiateRedirection>

export type IsSlashedParams = FunctionArguments<typeof functions.isSlashed>
export type IsSlashedReturn = FunctionReturn<typeof functions.isSlashed>

export type IssueTokensParams = FunctionArguments<typeof functions.issueTokens>
export type IssueTokensReturn = FunctionReturn<typeof functions.issueTokens>

export type LastValidatorIDParams = FunctionArguments<typeof functions.lastValidatorID>
export type LastValidatorIDReturn = FunctionReturn<typeof functions.lastValidatorID>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingRewardsParams = FunctionArguments<typeof functions.pendingRewards>
export type PendingRewardsReturn = FunctionReturn<typeof functions.pendingRewards>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type PubkeyAddressToValidatorIDParams = FunctionArguments<typeof functions.pubkeyAddressToValidatorID>
export type PubkeyAddressToValidatorIDReturn = FunctionReturn<typeof functions.pubkeyAddressToValidatorID>

export type RedirectParams = FunctionArguments<typeof functions.redirect>
export type RedirectReturn = FunctionReturn<typeof functions.redirect>

export type RedirectionAuthorizerParams = FunctionArguments<typeof functions.redirectionAuthorizer>
export type RedirectionAuthorizerReturn = FunctionReturn<typeof functions.redirectionAuthorizer>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type ResolveTreasuryFeesParams = FunctionArguments<typeof functions.resolveTreasuryFees>
export type ResolveTreasuryFeesReturn = FunctionReturn<typeof functions.resolveTreasuryFees>

export type RestakeRewardsParams = FunctionArguments<typeof functions.restakeRewards>
export type RestakeRewardsReturn = FunctionReturn<typeof functions.restakeRewards>

export type RewardsStashParams = FunctionArguments<typeof functions.rewardsStash>
export type RewardsStashReturn = FunctionReturn<typeof functions.rewardsStash>

export type SealEpochParams = FunctionArguments<typeof functions.sealEpoch>
export type SealEpochReturn = FunctionReturn<typeof functions.sealEpoch>

export type SealEpochValidatorsParams = FunctionArguments<typeof functions.sealEpochValidators>
export type SealEpochValidatorsReturn = FunctionReturn<typeof functions.sealEpochValidators>

export type SetGenesisDelegationParams = FunctionArguments<typeof functions.setGenesisDelegation>
export type SetGenesisDelegationReturn = FunctionReturn<typeof functions.setGenesisDelegation>

export type SetGenesisValidatorParams = FunctionArguments<typeof functions.setGenesisValidator>
export type SetGenesisValidatorReturn = FunctionReturn<typeof functions.setGenesisValidator>

export type SetRedirectionAuthorizerParams = FunctionArguments<typeof functions.setRedirectionAuthorizer>
export type SetRedirectionAuthorizerReturn = FunctionReturn<typeof functions.setRedirectionAuthorizer>

export type SlashingRefundRatioParams = FunctionArguments<typeof functions.slashingRefundRatio>
export type SlashingRefundRatioReturn = FunctionReturn<typeof functions.slashingRefundRatio>

export type StakeSubscriberAddressParams = FunctionArguments<typeof functions.stakeSubscriberAddress>
export type StakeSubscriberAddressReturn = FunctionReturn<typeof functions.stakeSubscriberAddress>

export type StashRewardsParams = FunctionArguments<typeof functions.stashRewards>
export type StashRewardsReturn = FunctionReturn<typeof functions.stashRewards>

export type StashedRewardsUntilEpochParams = FunctionArguments<typeof functions.stashedRewardsUntilEpoch>
export type StashedRewardsUntilEpochReturn = FunctionReturn<typeof functions.stashedRewardsUntilEpoch>

export type TotalActiveStakeParams = FunctionArguments<typeof functions.totalActiveStake>
export type TotalActiveStakeReturn = FunctionReturn<typeof functions.totalActiveStake>

export type TotalStakeParams = FunctionArguments<typeof functions.totalStake>
export type TotalStakeReturn = FunctionReturn<typeof functions.totalStake>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TreasuryAddressParams = FunctionArguments<typeof functions.treasuryAddress>
export type TreasuryAddressReturn = FunctionReturn<typeof functions.treasuryAddress>

export type UndelegateParams = FunctionArguments<typeof functions.undelegate>
export type UndelegateReturn = FunctionReturn<typeof functions.undelegate>

export type UnresolvedTreasuryFeesParams = FunctionArguments<typeof functions.unresolvedTreasuryFees>
export type UnresolvedTreasuryFeesReturn = FunctionReturn<typeof functions.unresolvedTreasuryFees>

export type UpdateConstsAddressParams = FunctionArguments<typeof functions.updateConstsAddress>
export type UpdateConstsAddressReturn = FunctionReturn<typeof functions.updateConstsAddress>

export type UpdateSlashingRefundRatioParams = FunctionArguments<typeof functions.updateSlashingRefundRatio>
export type UpdateSlashingRefundRatioReturn = FunctionReturn<typeof functions.updateSlashingRefundRatio>

export type UpdateStakeSubscriberAddressParams = FunctionArguments<typeof functions.updateStakeSubscriberAddress>
export type UpdateStakeSubscriberAddressReturn = FunctionReturn<typeof functions.updateStakeSubscriberAddress>

export type UpdateTreasuryAddressParams = FunctionArguments<typeof functions.updateTreasuryAddress>
export type UpdateTreasuryAddressReturn = FunctionReturn<typeof functions.updateTreasuryAddress>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

