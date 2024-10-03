import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ClaimFees: event("0xbc567d6cbad26368064baa0ab5a757be46aae4d70f707f9203d9d9b6c8ccbfa3", "ClaimFees(address,uint256,uint256)", {"from": indexed(p.address), "claimed0": p.uint256, "claimed1": p.uint256}),
    ClaimRewards: event("0x1f89f96333d3133000ee447473151fa9606543368f02271c9d95ae14f13bcc67", "ClaimRewards(address,uint256)", {"from": indexed(p.address), "amount": p.uint256}),
    Deposit: event("0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62", "Deposit(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "amount": p.uint256}),
    NotifyReward: event("0x095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c1", "NotifyReward(address,uint256)", {"from": indexed(p.address), "amount": p.uint256}),
    Withdraw: event("0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364", "Withdraw(address,uint256)", {"from": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"_0": p.address}, p.uint256),
    'deposit(uint256,address)': fun("0x6e553f65", "deposit(uint256,address)", {"_amount": p.uint256, "_recipient": p.address}, ),
    'deposit(uint256)': fun("0xb6b55f25", "deposit(uint256)", {"_amount": p.uint256}, ),
    earned: viewFun("0x008cc262", "earned(address)", {"_account": p.address}, p.uint256),
    fees0: viewFun("0x93f1c442", "fees0()", {}, p.uint256),
    fees1: viewFun("0x4c02a21c", "fees1()", {}, p.uint256),
    feesVotingReward: viewFun("0x0fe2f711", "feesVotingReward()", {}, p.address),
    getReward: fun("0xc00007b0", "getReward(address)", {"_account": p.address}, ),
    isPool: viewFun("0xe2e1c6db", "isPool()", {}, p.bool),
    isTrustedForwarder: viewFun("0x572b6c05", "isTrustedForwarder(address)", {"forwarder": p.address}, p.bool),
    lastTimeRewardApplicable: viewFun("0x80faa57d", "lastTimeRewardApplicable()", {}, p.uint256),
    lastUpdateTime: viewFun("0xc8f33c91", "lastUpdateTime()", {}, p.uint256),
    left: viewFun("0x16e64048", "left()", {}, p.uint256),
    notifyRewardAmount: fun("0x3c6b16ab", "notifyRewardAmount(uint256)", {"_amount": p.uint256}, ),
    notifyRewardWithoutClaim: fun("0xdcdc18dc", "notifyRewardWithoutClaim(uint256)", {"_amount": p.uint256}, ),
    periodFinish: viewFun("0xebe2b12b", "periodFinish()", {}, p.uint256),
    rewardPerToken: viewFun("0xcd3daf9d", "rewardPerToken()", {}, p.uint256),
    rewardPerTokenStored: viewFun("0xdf136d65", "rewardPerTokenStored()", {}, p.uint256),
    rewardRate: viewFun("0x7b0a47ee", "rewardRate()", {}, p.uint256),
    rewardRateByEpoch: viewFun("0x94af5b63", "rewardRateByEpoch(uint256)", {"_0": p.uint256}, p.uint256),
    rewardToken: viewFun("0xf7c618c1", "rewardToken()", {}, p.address),
    rewards: viewFun("0x0700037d", "rewards(address)", {"_0": p.address}, p.uint256),
    stakingToken: viewFun("0x72f702f3", "stakingToken()", {}, p.address),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    userRewardPerTokenPaid: viewFun("0x8b876347", "userRewardPerTokenPaid(address)", {"_0": p.address}, p.uint256),
    ve: viewFun("0x1f850716", "ve()", {}, p.address),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
    withdraw: fun("0x2e1a7d4d", "withdraw(uint256)", {"_amount": p.uint256}, ),
}

export class Contract extends ContractBase {

    balanceOf(_0: BalanceOfParams["_0"]) {
        return this.eth_call(functions.balanceOf, {_0})
    }

    earned(_account: EarnedParams["_account"]) {
        return this.eth_call(functions.earned, {_account})
    }

    fees0() {
        return this.eth_call(functions.fees0, {})
    }

    fees1() {
        return this.eth_call(functions.fees1, {})
    }

    feesVotingReward() {
        return this.eth_call(functions.feesVotingReward, {})
    }

    isPool() {
        return this.eth_call(functions.isPool, {})
    }

    isTrustedForwarder(forwarder: IsTrustedForwarderParams["forwarder"]) {
        return this.eth_call(functions.isTrustedForwarder, {forwarder})
    }

    lastTimeRewardApplicable() {
        return this.eth_call(functions.lastTimeRewardApplicable, {})
    }

    lastUpdateTime() {
        return this.eth_call(functions.lastUpdateTime, {})
    }

    left() {
        return this.eth_call(functions.left, {})
    }

    periodFinish() {
        return this.eth_call(functions.periodFinish, {})
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

    rewardRateByEpoch(_0: RewardRateByEpochParams["_0"]) {
        return this.eth_call(functions.rewardRateByEpoch, {_0})
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

    ve() {
        return this.eth_call(functions.ve, {})
    }

    voter() {
        return this.eth_call(functions.voter, {})
    }
}

/// Event types
export type ClaimFeesEventArgs = EParams<typeof events.ClaimFees>
export type ClaimRewardsEventArgs = EParams<typeof events.ClaimRewards>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type NotifyRewardEventArgs = EParams<typeof events.NotifyReward>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type DepositParams_0 = FunctionArguments<typeof functions['deposit(uint256,address)']>
export type DepositReturn_0 = FunctionReturn<typeof functions['deposit(uint256,address)']>

export type DepositParams_1 = FunctionArguments<typeof functions['deposit(uint256)']>
export type DepositReturn_1 = FunctionReturn<typeof functions['deposit(uint256)']>

export type EarnedParams = FunctionArguments<typeof functions.earned>
export type EarnedReturn = FunctionReturn<typeof functions.earned>

export type Fees0Params = FunctionArguments<typeof functions.fees0>
export type Fees0Return = FunctionReturn<typeof functions.fees0>

export type Fees1Params = FunctionArguments<typeof functions.fees1>
export type Fees1Return = FunctionReturn<typeof functions.fees1>

export type FeesVotingRewardParams = FunctionArguments<typeof functions.feesVotingReward>
export type FeesVotingRewardReturn = FunctionReturn<typeof functions.feesVotingReward>

export type GetRewardParams = FunctionArguments<typeof functions.getReward>
export type GetRewardReturn = FunctionReturn<typeof functions.getReward>

export type IsPoolParams = FunctionArguments<typeof functions.isPool>
export type IsPoolReturn = FunctionReturn<typeof functions.isPool>

export type IsTrustedForwarderParams = FunctionArguments<typeof functions.isTrustedForwarder>
export type IsTrustedForwarderReturn = FunctionReturn<typeof functions.isTrustedForwarder>

export type LastTimeRewardApplicableParams = FunctionArguments<typeof functions.lastTimeRewardApplicable>
export type LastTimeRewardApplicableReturn = FunctionReturn<typeof functions.lastTimeRewardApplicable>

export type LastUpdateTimeParams = FunctionArguments<typeof functions.lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof functions.lastUpdateTime>

export type LeftParams = FunctionArguments<typeof functions.left>
export type LeftReturn = FunctionReturn<typeof functions.left>

export type NotifyRewardAmountParams = FunctionArguments<typeof functions.notifyRewardAmount>
export type NotifyRewardAmountReturn = FunctionReturn<typeof functions.notifyRewardAmount>

export type NotifyRewardWithoutClaimParams = FunctionArguments<typeof functions.notifyRewardWithoutClaim>
export type NotifyRewardWithoutClaimReturn = FunctionReturn<typeof functions.notifyRewardWithoutClaim>

export type PeriodFinishParams = FunctionArguments<typeof functions.periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof functions.periodFinish>

export type RewardPerTokenParams = FunctionArguments<typeof functions.rewardPerToken>
export type RewardPerTokenReturn = FunctionReturn<typeof functions.rewardPerToken>

export type RewardPerTokenStoredParams = FunctionArguments<typeof functions.rewardPerTokenStored>
export type RewardPerTokenStoredReturn = FunctionReturn<typeof functions.rewardPerTokenStored>

export type RewardRateParams = FunctionArguments<typeof functions.rewardRate>
export type RewardRateReturn = FunctionReturn<typeof functions.rewardRate>

export type RewardRateByEpochParams = FunctionArguments<typeof functions.rewardRateByEpoch>
export type RewardRateByEpochReturn = FunctionReturn<typeof functions.rewardRateByEpoch>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type StakingTokenParams = FunctionArguments<typeof functions.stakingToken>
export type StakingTokenReturn = FunctionReturn<typeof functions.stakingToken>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type UserRewardPerTokenPaidParams = FunctionArguments<typeof functions.userRewardPerTokenPaid>
export type UserRewardPerTokenPaidReturn = FunctionReturn<typeof functions.userRewardPerTokenPaid>

export type VeParams = FunctionArguments<typeof functions.ve>
export type VeReturn = FunctionReturn<typeof functions.ve>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

