import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    RewardAdded: event("0xde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d", {"reward": p.uint256}),
    RewardPaid: event("0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486", {"user": indexed(p.address), "reward": p.uint256}),
    Staked: event("0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d", {"user": indexed(p.address), "amount": p.uint256}),
    Withdrawn: event("0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5", {"user": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    addExtraReward: fun("0x5e43c47b", {"_reward": p.address}, p.bool),
    balanceOf: fun("0x70a08231", {"account": p.address}, p.uint256),
    clearExtraRewards: fun("0x0569d388", {}, ),
    currentRewards: fun("0x901a7d53", {}, p.uint256),
    donate: fun("0xf14faf6f", {"_amount": p.uint256}, p.bool),
    duration: fun("0x0fb5a6b4", {}, p.uint256),
    earned: fun("0x008cc262", {"account": p.address}, p.uint256),
    extraRewards: fun("0x40c35446", {"_0": p.uint256}, p.address),
    extraRewardsLength: fun("0xd55a23f4", {}, p.uint256),
    "getReward()": fun("0x3d18b912", {}, p.bool),
    "getReward(address,bool)": fun("0x7050ccd9", {"_account": p.address, "_claimExtras": p.bool}, p.bool),
    historicalRewards: fun("0x262d3d6d", {}, p.uint256),
    lastTimeRewardApplicable: fun("0x80faa57d", {}, p.uint256),
    lastUpdateTime: fun("0xc8f33c91", {}, p.uint256),
    newRewardRatio: fun("0x6c8bcee8", {}, p.uint256),
    operator: fun("0x570ca735", {}, p.address),
    periodFinish: fun("0xebe2b12b", {}, p.uint256),
    pid: fun("0xf1068454", {}, p.uint256),
    queueNewRewards: fun("0x590a41f5", {"_rewards": p.uint256}, p.bool),
    queuedRewards: fun("0x63d38c3b", {}, p.uint256),
    rewardManager: fun("0x0f4ef8a6", {}, p.address),
    rewardPerToken: fun("0xcd3daf9d", {}, p.uint256),
    rewardPerTokenStored: fun("0xdf136d65", {}, p.uint256),
    rewardRate: fun("0x7b0a47ee", {}, p.uint256),
    rewardToken: fun("0xf7c618c1", {}, p.address),
    rewards: fun("0x0700037d", {"_0": p.address}, p.uint256),
    stake: fun("0xa694fc3a", {"_amount": p.uint256}, p.bool),
    stakeAll: fun("0x8dcb4061", {}, p.bool),
    stakeFor: fun("0x2ee40908", {"_for": p.address, "_amount": p.uint256}, p.bool),
    stakingToken: fun("0x72f702f3", {}, p.address),
    totalSupply: fun("0x18160ddd", {}, p.uint256),
    userRewardPerTokenPaid: fun("0x8b876347", {"_0": p.address}, p.uint256),
    withdraw: fun("0x38d07436", {"amount": p.uint256, "claim": p.bool}, p.bool),
    withdrawAll: fun("0x1c1c6fe5", {"claim": p.bool}, ),
    withdrawAllAndUnwrap: fun("0x49f039a2", {"claim": p.bool}, ),
    withdrawAndUnwrap: fun("0xc32e7202", {"amount": p.uint256, "claim": p.bool}, p.bool),
}

export class Contract extends ContractBase {

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    currentRewards() {
        return this.eth_call(functions.currentRewards, {})
    }

    duration() {
        return this.eth_call(functions.duration, {})
    }

    earned(account: EarnedParams["account"]) {
        return this.eth_call(functions.earned, {account})
    }

    extraRewards(_0: ExtraRewardsParams["_0"]) {
        return this.eth_call(functions.extraRewards, {_0})
    }

    extraRewardsLength() {
        return this.eth_call(functions.extraRewardsLength, {})
    }

    historicalRewards() {
        return this.eth_call(functions.historicalRewards, {})
    }

    lastTimeRewardApplicable() {
        return this.eth_call(functions.lastTimeRewardApplicable, {})
    }

    lastUpdateTime() {
        return this.eth_call(functions.lastUpdateTime, {})
    }

    newRewardRatio() {
        return this.eth_call(functions.newRewardRatio, {})
    }

    operator() {
        return this.eth_call(functions.operator, {})
    }

    periodFinish() {
        return this.eth_call(functions.periodFinish, {})
    }

    pid() {
        return this.eth_call(functions.pid, {})
    }

    queuedRewards() {
        return this.eth_call(functions.queuedRewards, {})
    }

    rewardManager() {
        return this.eth_call(functions.rewardManager, {})
    }

    rewardPerToken() {
        return this.eth_call(functions.rewardPerToken, {})
    }

    rewardPerTokenStored() {
        return this.eth_call(functions.rewardPerTokenStored, {})
    }

    rewardRate() {
        return this.eth_call(functions.rewardRate, {})
    }

    rewardToken() {
        return this.eth_call(functions.rewardToken, {})
    }

    rewards(_0: RewardsParams["_0"]) {
        return this.eth_call(functions.rewards, {_0})
    }

    stakingToken() {
        return this.eth_call(functions.stakingToken, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    userRewardPerTokenPaid(_0: UserRewardPerTokenPaidParams["_0"]) {
        return this.eth_call(functions.userRewardPerTokenPaid, {_0})
    }
}

/// Event types
export type RewardAddedEventArgs = EParams<typeof events.RewardAdded>
export type RewardPaidEventArgs = EParams<typeof events.RewardPaid>
export type StakedEventArgs = EParams<typeof events.Staked>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type AddExtraRewardParams = FunctionArguments<typeof functions.addExtraReward>
export type AddExtraRewardReturn = FunctionReturn<typeof functions.addExtraReward>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ClearExtraRewardsParams = FunctionArguments<typeof functions.clearExtraRewards>
export type ClearExtraRewardsReturn = FunctionReturn<typeof functions.clearExtraRewards>

export type CurrentRewardsParams = FunctionArguments<typeof functions.currentRewards>
export type CurrentRewardsReturn = FunctionReturn<typeof functions.currentRewards>

export type DonateParams = FunctionArguments<typeof functions.donate>
export type DonateReturn = FunctionReturn<typeof functions.donate>

export type DurationParams = FunctionArguments<typeof functions.duration>
export type DurationReturn = FunctionReturn<typeof functions.duration>

export type EarnedParams = FunctionArguments<typeof functions.earned>
export type EarnedReturn = FunctionReturn<typeof functions.earned>

export type ExtraRewardsParams = FunctionArguments<typeof functions.extraRewards>
export type ExtraRewardsReturn = FunctionReturn<typeof functions.extraRewards>

export type ExtraRewardsLengthParams = FunctionArguments<typeof functions.extraRewardsLength>
export type ExtraRewardsLengthReturn = FunctionReturn<typeof functions.extraRewardsLength>

export type GetRewardParams_0 = FunctionArguments<typeof functions["getReward()"]>
export type GetRewardReturn_0 = FunctionReturn<typeof functions["getReward()"]>

export type GetRewardParams_1 = FunctionArguments<typeof functions["getReward(address,bool)"]>
export type GetRewardReturn_1 = FunctionReturn<typeof functions["getReward(address,bool)"]>

export type HistoricalRewardsParams = FunctionArguments<typeof functions.historicalRewards>
export type HistoricalRewardsReturn = FunctionReturn<typeof functions.historicalRewards>

export type LastTimeRewardApplicableParams = FunctionArguments<typeof functions.lastTimeRewardApplicable>
export type LastTimeRewardApplicableReturn = FunctionReturn<typeof functions.lastTimeRewardApplicable>

export type LastUpdateTimeParams = FunctionArguments<typeof functions.lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof functions.lastUpdateTime>

export type NewRewardRatioParams = FunctionArguments<typeof functions.newRewardRatio>
export type NewRewardRatioReturn = FunctionReturn<typeof functions.newRewardRatio>

export type OperatorParams = FunctionArguments<typeof functions.operator>
export type OperatorReturn = FunctionReturn<typeof functions.operator>

export type PeriodFinishParams = FunctionArguments<typeof functions.periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof functions.periodFinish>

export type PidParams = FunctionArguments<typeof functions.pid>
export type PidReturn = FunctionReturn<typeof functions.pid>

export type QueueNewRewardsParams = FunctionArguments<typeof functions.queueNewRewards>
export type QueueNewRewardsReturn = FunctionReturn<typeof functions.queueNewRewards>

export type QueuedRewardsParams = FunctionArguments<typeof functions.queuedRewards>
export type QueuedRewardsReturn = FunctionReturn<typeof functions.queuedRewards>

export type RewardManagerParams = FunctionArguments<typeof functions.rewardManager>
export type RewardManagerReturn = FunctionReturn<typeof functions.rewardManager>

export type RewardPerTokenParams = FunctionArguments<typeof functions.rewardPerToken>
export type RewardPerTokenReturn = FunctionReturn<typeof functions.rewardPerToken>

export type RewardPerTokenStoredParams = FunctionArguments<typeof functions.rewardPerTokenStored>
export type RewardPerTokenStoredReturn = FunctionReturn<typeof functions.rewardPerTokenStored>

export type RewardRateParams = FunctionArguments<typeof functions.rewardRate>
export type RewardRateReturn = FunctionReturn<typeof functions.rewardRate>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type StakeParams = FunctionArguments<typeof functions.stake>
export type StakeReturn = FunctionReturn<typeof functions.stake>

export type StakeAllParams = FunctionArguments<typeof functions.stakeAll>
export type StakeAllReturn = FunctionReturn<typeof functions.stakeAll>

export type StakeForParams = FunctionArguments<typeof functions.stakeFor>
export type StakeForReturn = FunctionReturn<typeof functions.stakeFor>

export type StakingTokenParams = FunctionArguments<typeof functions.stakingToken>
export type StakingTokenReturn = FunctionReturn<typeof functions.stakingToken>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type UserRewardPerTokenPaidParams = FunctionArguments<typeof functions.userRewardPerTokenPaid>
export type UserRewardPerTokenPaidReturn = FunctionReturn<typeof functions.userRewardPerTokenPaid>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

export type WithdrawAllAndUnwrapParams = FunctionArguments<typeof functions.withdrawAllAndUnwrap>
export type WithdrawAllAndUnwrapReturn = FunctionReturn<typeof functions.withdrawAllAndUnwrap>

export type WithdrawAndUnwrapParams = FunctionArguments<typeof functions.withdrawAndUnwrap>
export type WithdrawAndUnwrapReturn = FunctionReturn<typeof functions.withdrawAndUnwrap>

