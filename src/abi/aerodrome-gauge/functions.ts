import { address, bool, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    _0: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** deposit(uint256,address) */
export const deposit = func('0x6e553f65', {
    _amount: uint256,
    _recipient: address,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** deposit(uint256) */
export const deposit_1 = func('0xb6b55f25', {
    _amount: uint256,
})
export type DepositParams_1 = FunctionArguments<typeof deposit_1>
export type DepositReturn_1 = FunctionReturn<typeof deposit_1>

/** earned(address) */
export const earned = func('0x008cc262', {
    _account: address,
}, uint256)
export type EarnedParams = FunctionArguments<typeof earned>
export type EarnedReturn = FunctionReturn<typeof earned>

/** fees0() */
export const fees0 = func('0x93f1c442', {}, uint256)
export type Fees0Params = FunctionArguments<typeof fees0>
export type Fees0Return = FunctionReturn<typeof fees0>

/** fees1() */
export const fees1 = func('0x4c02a21c', {}, uint256)
export type Fees1Params = FunctionArguments<typeof fees1>
export type Fees1Return = FunctionReturn<typeof fees1>

/** feesVotingReward() */
export const feesVotingReward = func('0x0fe2f711', {}, address)
export type FeesVotingRewardParams = FunctionArguments<typeof feesVotingReward>
export type FeesVotingRewardReturn = FunctionReturn<typeof feesVotingReward>

/** getReward(address) */
export const getReward = func('0xc00007b0', {
    _account: address,
})
export type GetRewardParams = FunctionArguments<typeof getReward>
export type GetRewardReturn = FunctionReturn<typeof getReward>

/** isPool() */
export const isPool = func('0xe2e1c6db', {}, bool)
export type IsPoolParams = FunctionArguments<typeof isPool>
export type IsPoolReturn = FunctionReturn<typeof isPool>

/** isTrustedForwarder(address) */
export const isTrustedForwarder = func('0x572b6c05', {
    forwarder: address,
}, bool)
export type IsTrustedForwarderParams = FunctionArguments<typeof isTrustedForwarder>
export type IsTrustedForwarderReturn = FunctionReturn<typeof isTrustedForwarder>

/** lastTimeRewardApplicable() */
export const lastTimeRewardApplicable = func('0x80faa57d', {}, uint256)
export type LastTimeRewardApplicableParams = FunctionArguments<typeof lastTimeRewardApplicable>
export type LastTimeRewardApplicableReturn = FunctionReturn<typeof lastTimeRewardApplicable>

/** lastUpdateTime() */
export const lastUpdateTime = func('0xc8f33c91', {}, uint256)
export type LastUpdateTimeParams = FunctionArguments<typeof lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof lastUpdateTime>

/** left() */
export const left = func('0x16e64048', {}, uint256)
export type LeftParams = FunctionArguments<typeof left>
export type LeftReturn = FunctionReturn<typeof left>

/** notifyRewardAmount(uint256) */
export const notifyRewardAmount = func('0x3c6b16ab', {
    _amount: uint256,
})
export type NotifyRewardAmountParams = FunctionArguments<typeof notifyRewardAmount>
export type NotifyRewardAmountReturn = FunctionReturn<typeof notifyRewardAmount>

/** notifyRewardWithoutClaim(uint256) */
export const notifyRewardWithoutClaim = func('0xdcdc18dc', {
    _amount: uint256,
})
export type NotifyRewardWithoutClaimParams = FunctionArguments<typeof notifyRewardWithoutClaim>
export type NotifyRewardWithoutClaimReturn = FunctionReturn<typeof notifyRewardWithoutClaim>

/** periodFinish() */
export const periodFinish = func('0xebe2b12b', {}, uint256)
export type PeriodFinishParams = FunctionArguments<typeof periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof periodFinish>

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

/** rewardRateByEpoch(uint256) */
export const rewardRateByEpoch = func('0x94af5b63', {
    _0: uint256,
}, uint256)
export type RewardRateByEpochParams = FunctionArguments<typeof rewardRateByEpoch>
export type RewardRateByEpochReturn = FunctionReturn<typeof rewardRateByEpoch>

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

/** ve() */
export const ve = func('0x1f850716', {}, address)
export type VeParams = FunctionArguments<typeof ve>
export type VeReturn = FunctionReturn<typeof ve>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>

/** withdraw(uint256) */
export const withdraw = func('0x2e1a7d4d', {
    _amount: uint256,
})
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>
