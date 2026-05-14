import { ContractBase } from '../abi.support.js'
import { balanceOf, earned, fees0, fees1, feesVotingReward, isPool, isTrustedForwarder, lastTimeRewardApplicable, lastUpdateTime, left, periodFinish, rewardPerToken, rewardPerTokenStored, rewardRate, rewardRateByEpoch, rewardToken, rewards, stakingToken, totalSupply, userRewardPerTokenPaid, ve, voter } from './functions.js'
import type { BalanceOfParams, EarnedParams, IsTrustedForwarderParams, RewardRateByEpochParams, RewardsParams, UserRewardPerTokenPaidParams } from './functions.js'

export class Contract extends ContractBase {
    balanceOf(_0: BalanceOfParams["_0"]) {
        return this.eth_call(balanceOf, {_0})
    }

    earned(_account: EarnedParams["_account"]) {
        return this.eth_call(earned, {_account})
    }

    fees0() {
        return this.eth_call(fees0, {})
    }

    fees1() {
        return this.eth_call(fees1, {})
    }

    feesVotingReward() {
        return this.eth_call(feesVotingReward, {})
    }

    isPool() {
        return this.eth_call(isPool, {})
    }

    isTrustedForwarder(forwarder: IsTrustedForwarderParams["forwarder"]) {
        return this.eth_call(isTrustedForwarder, {forwarder})
    }

    lastTimeRewardApplicable() {
        return this.eth_call(lastTimeRewardApplicable, {})
    }

    lastUpdateTime() {
        return this.eth_call(lastUpdateTime, {})
    }

    left() {
        return this.eth_call(left, {})
    }

    periodFinish() {
        return this.eth_call(periodFinish, {})
    }

    rewardPerToken() {
        return this.eth_call(rewardPerToken, {})
    }

    rewardPerTokenStored() {
        return this.eth_call(rewardPerTokenStored, {})
    }

    rewardRate() {
        return this.eth_call(rewardRate, {})
    }

    rewardRateByEpoch(_0: RewardRateByEpochParams["_0"]) {
        return this.eth_call(rewardRateByEpoch, {_0})
    }

    rewardToken() {
        return this.eth_call(rewardToken, {})
    }

    rewards(_0: RewardsParams["_0"]) {
        return this.eth_call(rewards, {_0})
    }

    stakingToken() {
        return this.eth_call(stakingToken, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    userRewardPerTokenPaid(_0: UserRewardPerTokenPaidParams["_0"]) {
        return this.eth_call(userRewardPerTokenPaid, {_0})
    }

    ve() {
        return this.eth_call(ve, {})
    }

    voter() {
        return this.eth_call(voter, {})
    }
}
