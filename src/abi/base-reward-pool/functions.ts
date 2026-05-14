import { address, bool, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** addExtraReward(address) */
export const addExtraReward = func('0x5e43c47b', {
    _reward: address,
}, bool)
export type AddExtraRewardParams = FunctionArguments<typeof addExtraReward>
export type AddExtraRewardReturn = FunctionReturn<typeof addExtraReward>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** clearExtraRewards() */
export const clearExtraRewards = func('0x0569d388', {})
export type ClearExtraRewardsParams = FunctionArguments<typeof clearExtraRewards>
export type ClearExtraRewardsReturn = FunctionReturn<typeof clearExtraRewards>

/** currentRewards() */
export const currentRewards = func('0x901a7d53', {}, uint256)
export type CurrentRewardsParams = FunctionArguments<typeof currentRewards>
export type CurrentRewardsReturn = FunctionReturn<typeof currentRewards>

/** donate(uint256) */
export const donate = func('0xf14faf6f', {
    _amount: uint256,
}, bool)
export type DonateParams = FunctionArguments<typeof donate>
export type DonateReturn = FunctionReturn<typeof donate>

/** duration() */
export const duration = func('0x0fb5a6b4', {}, uint256)
export type DurationParams = FunctionArguments<typeof duration>
export type DurationReturn = FunctionReturn<typeof duration>

/** earned(address) */
export const earned = func('0x008cc262', {
    account: address,
}, uint256)
export type EarnedParams = FunctionArguments<typeof earned>
export type EarnedReturn = FunctionReturn<typeof earned>

/** extraRewards(uint256) */
export const extraRewards = func('0x40c35446', {
    _0: uint256,
}, address)
export type ExtraRewardsParams = FunctionArguments<typeof extraRewards>
export type ExtraRewardsReturn = FunctionReturn<typeof extraRewards>

/** extraRewardsLength() */
export const extraRewardsLength = func('0xd55a23f4', {}, uint256)
export type ExtraRewardsLengthParams = FunctionArguments<typeof extraRewardsLength>
export type ExtraRewardsLengthReturn = FunctionReturn<typeof extraRewardsLength>

/** getReward() */
export const getReward = func('0x3d18b912', {}, bool)
export type GetRewardParams = FunctionArguments<typeof getReward>
export type GetRewardReturn = FunctionReturn<typeof getReward>

/** getReward(address,bool) */
export const getReward_1 = func('0x7050ccd9', {
    _account: address,
    _claimExtras: bool,
}, bool)
export type GetRewardParams_1 = FunctionArguments<typeof getReward_1>
export type GetRewardReturn_1 = FunctionReturn<typeof getReward_1>

/** historicalRewards() */
export const historicalRewards = func('0x262d3d6d', {}, uint256)
export type HistoricalRewardsParams = FunctionArguments<typeof historicalRewards>
export type HistoricalRewardsReturn = FunctionReturn<typeof historicalRewards>

/** lastTimeRewardApplicable() */
export const lastTimeRewardApplicable = func('0x80faa57d', {}, uint256)
export type LastTimeRewardApplicableParams = FunctionArguments<typeof lastTimeRewardApplicable>
export type LastTimeRewardApplicableReturn = FunctionReturn<typeof lastTimeRewardApplicable>

/** lastUpdateTime() */
export const lastUpdateTime = func('0xc8f33c91', {}, uint256)
export type LastUpdateTimeParams = FunctionArguments<typeof lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof lastUpdateTime>

/** newRewardRatio() */
export const newRewardRatio = func('0x6c8bcee8', {}, uint256)
export type NewRewardRatioParams = FunctionArguments<typeof newRewardRatio>
export type NewRewardRatioReturn = FunctionReturn<typeof newRewardRatio>

/** operator() */
export const operator = func('0x570ca735', {}, address)
export type OperatorParams = FunctionArguments<typeof operator>
export type OperatorReturn = FunctionReturn<typeof operator>

/** periodFinish() */
export const periodFinish = func('0xebe2b12b', {}, uint256)
export type PeriodFinishParams = FunctionArguments<typeof periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof periodFinish>

/** pid() */
export const pid = func('0xf1068454', {}, uint256)
export type PidParams = FunctionArguments<typeof pid>
export type PidReturn = FunctionReturn<typeof pid>

/** queueNewRewards(uint256) */
export const queueNewRewards = func('0x590a41f5', {
    _rewards: uint256,
}, bool)
export type QueueNewRewardsParams = FunctionArguments<typeof queueNewRewards>
export type QueueNewRewardsReturn = FunctionReturn<typeof queueNewRewards>

/** queuedRewards() */
export const queuedRewards = func('0x63d38c3b', {}, uint256)
export type QueuedRewardsParams = FunctionArguments<typeof queuedRewards>
export type QueuedRewardsReturn = FunctionReturn<typeof queuedRewards>

/** rewardManager() */
export const rewardManager = func('0x0f4ef8a6', {}, address)
export type RewardManagerParams = FunctionArguments<typeof rewardManager>
export type RewardManagerReturn = FunctionReturn<typeof rewardManager>

/** rewardPerToken() */
export const rewardPerToken = func('0xcd3daf9d', {}, uint256)
export type RewardPerTokenParams = FunctionArguments<typeof rewardPerToken>
export type RewardPerTokenReturn = FunctionReturn<typeof rewardPerToken>

/** rewardPerTokenStored() */
export const rewardPerTokenStored = func('0xdf136d65', {}, uint256)
export type RewardPerTokenStoredParams = FunctionArguments<typeof rewardPerTokenStored>
export type RewardPerTokenStoredReturn = FunctionReturn<typeof rewardPerTokenStored>

/** rewardRate() */
export const rewardRate = func('0x7b0a47ee', {}, uint256)
export type RewardRateParams = FunctionArguments<typeof rewardRate>
export type RewardRateReturn = FunctionReturn<typeof rewardRate>

/** rewardToken() */
export const rewardToken = func('0xf7c618c1', {}, address)
export type RewardTokenParams = FunctionArguments<typeof rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof rewardToken>

/** rewards(address) */
export const rewards = func('0x0700037d', {
    _0: address,
}, uint256)
export type RewardsParams = FunctionArguments<typeof rewards>
export type RewardsReturn = FunctionReturn<typeof rewards>

/** stake(uint256) */
export const stake = func('0xa694fc3a', {
    _amount: uint256,
}, bool)
export type StakeParams = FunctionArguments<typeof stake>
export type StakeReturn = FunctionReturn<typeof stake>

/** stakeAll() */
export const stakeAll = func('0x8dcb4061', {}, bool)
export type StakeAllParams = FunctionArguments<typeof stakeAll>
export type StakeAllReturn = FunctionReturn<typeof stakeAll>

/** stakeFor(address,uint256) */
export const stakeFor = func('0x2ee40908', {
    _for: address,
    _amount: uint256,
}, bool)
export type StakeForParams = FunctionArguments<typeof stakeFor>
export type StakeForReturn = FunctionReturn<typeof stakeFor>

/** stakingToken() */
export const stakingToken = func('0x72f702f3', {}, address)
export type StakingTokenParams = FunctionArguments<typeof stakingToken>
export type StakingTokenReturn = FunctionReturn<typeof stakingToken>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** userRewardPerTokenPaid(address) */
export const userRewardPerTokenPaid = func('0x8b876347', {
    _0: address,
}, uint256)
export type UserRewardPerTokenPaidParams = FunctionArguments<typeof userRewardPerTokenPaid>
export type UserRewardPerTokenPaidReturn = FunctionReturn<typeof userRewardPerTokenPaid>

/** withdraw(uint256,bool) */
export const withdraw = func('0x38d07436', {
    amount: uint256,
    claim: bool,
}, bool)
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>

/** withdrawAll(bool) */
export const withdrawAll = func('0x1c1c6fe5', {
    claim: bool,
})
export type WithdrawAllParams = FunctionArguments<typeof withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof withdrawAll>

/** withdrawAllAndUnwrap(bool) */
export const withdrawAllAndUnwrap = func('0x49f039a2', {
    claim: bool,
})
export type WithdrawAllAndUnwrapParams = FunctionArguments<typeof withdrawAllAndUnwrap>
export type WithdrawAllAndUnwrapReturn = FunctionReturn<typeof withdrawAllAndUnwrap>

/** withdrawAndUnwrap(uint256,bool) */
export const withdrawAndUnwrap = func('0xc32e7202', {
    amount: uint256,
    claim: bool,
}, bool)
export type WithdrawAndUnwrapParams = FunctionArguments<typeof withdrawAndUnwrap>
export type WithdrawAndUnwrapReturn = FunctionReturn<typeof withdrawAndUnwrap>
