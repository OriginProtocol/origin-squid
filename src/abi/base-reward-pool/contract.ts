import { ContractBase } from '../abi.support.js'
import { addExtraReward, balanceOf, currentRewards, donate, duration, earned, extraRewards, extraRewardsLength, getReward, getReward_1, historicalRewards, lastTimeRewardApplicable, lastUpdateTime, newRewardRatio, operator, periodFinish, pid, queueNewRewards, queuedRewards, rewardManager, rewardPerToken, rewardPerTokenStored, rewardRate, rewardToken, rewards, stake, stakeAll, stakeFor, stakingToken, totalSupply, userRewardPerTokenPaid, withdraw, withdrawAndUnwrap } from './functions.js'
import type { AddExtraRewardParams, BalanceOfParams, DonateParams, EarnedParams, ExtraRewardsParams, GetRewardParams_1, QueueNewRewardsParams, RewardsParams, StakeForParams, StakeParams, UserRewardPerTokenPaidParams, WithdrawAndUnwrapParams, WithdrawParams } from './functions.js'

export class Contract extends ContractBase {
    addExtraReward(_reward: AddExtraRewardParams["_reward"]) {
        return this.eth_call(addExtraReward, {_reward})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    currentRewards() {
        return this.eth_call(currentRewards, {})
    }

    donate(_amount: DonateParams["_amount"]) {
        return this.eth_call(donate, {_amount})
    }

    duration() {
        return this.eth_call(duration, {})
    }

    earned(account: EarnedParams["account"]) {
        return this.eth_call(earned, {account})
    }

    extraRewards(_0: ExtraRewardsParams["_0"]) {
        return this.eth_call(extraRewards, {_0})
    }

    extraRewardsLength() {
        return this.eth_call(extraRewardsLength, {})
    }

    getReward() {
        return this.eth_call(getReward, {})
    }

    getReward_1(_account: GetRewardParams_1["_account"], _claimExtras: GetRewardParams_1["_claimExtras"]) {
        return this.eth_call(getReward_1, {_account, _claimExtras})
    }

    historicalRewards() {
        return this.eth_call(historicalRewards, {})
    }

    lastTimeRewardApplicable() {
        return this.eth_call(lastTimeRewardApplicable, {})
    }

    lastUpdateTime() {
        return this.eth_call(lastUpdateTime, {})
    }

    newRewardRatio() {
        return this.eth_call(newRewardRatio, {})
    }

    operator() {
        return this.eth_call(operator, {})
    }

    periodFinish() {
        return this.eth_call(periodFinish, {})
    }

    pid() {
        return this.eth_call(pid, {})
    }

    queueNewRewards(_rewards: QueueNewRewardsParams["_rewards"]) {
        return this.eth_call(queueNewRewards, {_rewards})
    }

    queuedRewards() {
        return this.eth_call(queuedRewards, {})
    }

    rewardManager() {
        return this.eth_call(rewardManager, {})
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

    rewardToken() {
        return this.eth_call(rewardToken, {})
    }

    rewards(_0: RewardsParams["_0"]) {
        return this.eth_call(rewards, {_0})
    }

    stake(_amount: StakeParams["_amount"]) {
        return this.eth_call(stake, {_amount})
    }

    stakeAll() {
        return this.eth_call(stakeAll, {})
    }

    stakeFor(_for: StakeForParams["_for"], _amount: StakeForParams["_amount"]) {
        return this.eth_call(stakeFor, {_for, _amount})
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

    withdraw(amount: WithdrawParams["amount"], claim: WithdrawParams["claim"]) {
        return this.eth_call(withdraw, {amount, claim})
    }

    withdrawAndUnwrap(amount: WithdrawAndUnwrapParams["amount"], claim: WithdrawAndUnwrapParams["claim"]) {
        return this.eth_call(withdrawAndUnwrap, {amount, claim})
    }
}
