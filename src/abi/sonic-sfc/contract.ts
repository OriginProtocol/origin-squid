import { ContractBase } from '../abi.support.js'
import { UPGRADE_INTERFACE_VERSION, constsAddress, currentEpoch, currentSealedEpoch, getEpochAccumulatedOriginatedTxsFee, getEpochAccumulatedRewardPerToken, getEpochAccumulatedUptime, getEpochAverageUptime, getEpochEndBlock, getEpochOfflineBlocks, getEpochOfflineTime, getEpochReceivedStake, getEpochSnapshot, getEpochValidatorIDs, getRedirection, getRedirectionRequest, getSelfStake, getStake, getValidator, getValidatorID, getValidatorPubkey, getWithdrawalRequest, isSlashed, lastValidatorID, owner, pendingRewards, proxiableUUID, pubkeyAddressToValidatorID, redirectionAuthorizer, rewardsStash, slashingRefundRatio, stakeSubscriberAddress, stashedRewardsUntilEpoch, totalActiveStake, totalStake, totalSupply, treasuryAddress, unresolvedTreasuryFees, version } from './functions.js'
import type { GetEpochAccumulatedOriginatedTxsFeeParams, GetEpochAccumulatedRewardPerTokenParams, GetEpochAccumulatedUptimeParams, GetEpochAverageUptimeParams, GetEpochEndBlockParams, GetEpochOfflineBlocksParams, GetEpochOfflineTimeParams, GetEpochReceivedStakeParams, GetEpochSnapshotParams, GetEpochValidatorIDsParams, GetRedirectionParams, GetRedirectionRequestParams, GetSelfStakeParams, GetStakeParams, GetValidatorIDParams, GetValidatorParams, GetValidatorPubkeyParams, GetWithdrawalRequestParams, IsSlashedParams, PendingRewardsParams, PubkeyAddressToValidatorIDParams, RewardsStashParams, SlashingRefundRatioParams, StashedRewardsUntilEpochParams } from './functions.js'

export class Contract extends ContractBase {
    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(UPGRADE_INTERFACE_VERSION, {})
    }

    constsAddress() {
        return this.eth_call(constsAddress, {})
    }

    currentEpoch() {
        return this.eth_call(currentEpoch, {})
    }

    currentSealedEpoch() {
        return this.eth_call(currentSealedEpoch, {})
    }

    getEpochAccumulatedOriginatedTxsFee(epoch: GetEpochAccumulatedOriginatedTxsFeeParams["epoch"], validatorID: GetEpochAccumulatedOriginatedTxsFeeParams["validatorID"]) {
        return this.eth_call(getEpochAccumulatedOriginatedTxsFee, {epoch, validatorID})
    }

    getEpochAccumulatedRewardPerToken(epoch: GetEpochAccumulatedRewardPerTokenParams["epoch"], validatorID: GetEpochAccumulatedRewardPerTokenParams["validatorID"]) {
        return this.eth_call(getEpochAccumulatedRewardPerToken, {epoch, validatorID})
    }

    getEpochAccumulatedUptime(epoch: GetEpochAccumulatedUptimeParams["epoch"], validatorID: GetEpochAccumulatedUptimeParams["validatorID"]) {
        return this.eth_call(getEpochAccumulatedUptime, {epoch, validatorID})
    }

    getEpochAverageUptime(epoch: GetEpochAverageUptimeParams["epoch"], validatorID: GetEpochAverageUptimeParams["validatorID"]) {
        return this.eth_call(getEpochAverageUptime, {epoch, validatorID})
    }

    getEpochEndBlock(epoch: GetEpochEndBlockParams["epoch"]) {
        return this.eth_call(getEpochEndBlock, {epoch})
    }

    getEpochOfflineBlocks(epoch: GetEpochOfflineBlocksParams["epoch"], validatorID: GetEpochOfflineBlocksParams["validatorID"]) {
        return this.eth_call(getEpochOfflineBlocks, {epoch, validatorID})
    }

    getEpochOfflineTime(epoch: GetEpochOfflineTimeParams["epoch"], validatorID: GetEpochOfflineTimeParams["validatorID"]) {
        return this.eth_call(getEpochOfflineTime, {epoch, validatorID})
    }

    getEpochReceivedStake(epoch: GetEpochReceivedStakeParams["epoch"], validatorID: GetEpochReceivedStakeParams["validatorID"]) {
        return this.eth_call(getEpochReceivedStake, {epoch, validatorID})
    }

    getEpochSnapshot(epoch: GetEpochSnapshotParams["epoch"]) {
        return this.eth_call(getEpochSnapshot, {epoch})
    }

    getEpochValidatorIDs(epoch: GetEpochValidatorIDsParams["epoch"]) {
        return this.eth_call(getEpochValidatorIDs, {epoch})
    }

    getRedirection(delegator: GetRedirectionParams["delegator"]) {
        return this.eth_call(getRedirection, {delegator})
    }

    getRedirectionRequest(delegator: GetRedirectionRequestParams["delegator"]) {
        return this.eth_call(getRedirectionRequest, {delegator})
    }

    getSelfStake(validatorID: GetSelfStakeParams["validatorID"]) {
        return this.eth_call(getSelfStake, {validatorID})
    }

    getStake(delegator: GetStakeParams["delegator"], validatorID: GetStakeParams["validatorID"]) {
        return this.eth_call(getStake, {delegator, validatorID})
    }

    getValidator(validatorID: GetValidatorParams["validatorID"]) {
        return this.eth_call(getValidator, {validatorID})
    }

    getValidatorID(auth: GetValidatorIDParams["auth"]) {
        return this.eth_call(getValidatorID, {auth})
    }

    getValidatorPubkey(validatorID: GetValidatorPubkeyParams["validatorID"]) {
        return this.eth_call(getValidatorPubkey, {validatorID})
    }

    getWithdrawalRequest(delegator: GetWithdrawalRequestParams["delegator"], validatorID: GetWithdrawalRequestParams["validatorID"], wrID: GetWithdrawalRequestParams["wrID"]) {
        return this.eth_call(getWithdrawalRequest, {delegator, validatorID, wrID})
    }

    isSlashed(validatorID: IsSlashedParams["validatorID"]) {
        return this.eth_call(isSlashed, {validatorID})
    }

    lastValidatorID() {
        return this.eth_call(lastValidatorID, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    pendingRewards(delegator: PendingRewardsParams["delegator"], toValidatorID: PendingRewardsParams["toValidatorID"]) {
        return this.eth_call(pendingRewards, {delegator, toValidatorID})
    }

    proxiableUUID() {
        return this.eth_call(proxiableUUID, {})
    }

    pubkeyAddressToValidatorID(pubkeyAddress: PubkeyAddressToValidatorIDParams["pubkeyAddress"]) {
        return this.eth_call(pubkeyAddressToValidatorID, {pubkeyAddress})
    }

    redirectionAuthorizer() {
        return this.eth_call(redirectionAuthorizer, {})
    }

    rewardsStash(delegator: RewardsStashParams["delegator"], validatorID: RewardsStashParams["validatorID"]) {
        return this.eth_call(rewardsStash, {delegator, validatorID})
    }

    slashingRefundRatio(validatorID: SlashingRefundRatioParams["validatorID"]) {
        return this.eth_call(slashingRefundRatio, {validatorID})
    }

    stakeSubscriberAddress() {
        return this.eth_call(stakeSubscriberAddress, {})
    }

    stashedRewardsUntilEpoch(delegator: StashedRewardsUntilEpochParams["delegator"], validatorID: StashedRewardsUntilEpochParams["validatorID"]) {
        return this.eth_call(stashedRewardsUntilEpoch, {delegator, validatorID})
    }

    totalActiveStake() {
        return this.eth_call(totalActiveStake, {})
    }

    totalStake() {
        return this.eth_call(totalStake, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    treasuryAddress() {
        return this.eth_call(treasuryAddress, {})
    }

    unresolvedTreasuryFees() {
        return this.eth_call(unresolvedTreasuryFees, {})
    }

    version() {
        return this.eth_call(version, {})
    }
}
