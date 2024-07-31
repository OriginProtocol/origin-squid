import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ClaimFees: event("0xbc567d6cbad26368064baa0ab5a757be46aae4d70f707f9203d9d9b6c8ccbfa3", "ClaimFees(address,uint256,uint256)", {"from": indexed(p.address), "claimed0": p.uint256, "claimed1": p.uint256}),
    ClaimRewards: event("0x1f89f96333d3133000ee447473151fa9606543368f02271c9d95ae14f13bcc67", "ClaimRewards(address,uint256)", {"from": indexed(p.address), "amount": p.uint256}),
    Deposit: event("0x1c8ab8c7f45390d58f58f1d655213a82cca5d12179761a87c16f098813b8f211", "Deposit(address,uint256,uint128)", {"user": indexed(p.address), "tokenId": indexed(p.uint256), "liquidityToStake": indexed(p.uint128)}),
    NotifyReward: event("0x095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c1", "NotifyReward(address,uint256)", {"from": indexed(p.address), "amount": p.uint256}),
    Withdraw: event("0x8903a5b5d08a841e7f68438387f1da20c84dea756379ed37e633ff3854b99b84", "Withdraw(address,uint256,uint128)", {"user": indexed(p.address), "tokenId": indexed(p.uint256), "liquidityToStake": indexed(p.uint128)}),
}

export const functions = {
    WETH9: viewFun("0x4aa4a4fc", "WETH9()", {}, p.address),
    deposit: fun("0xb6b55f25", "deposit(uint256)", {"tokenId": p.uint256}, ),
    earned: viewFun("0x3e491d47", "earned(address,uint256)", {"account": p.address, "tokenId": p.uint256}, p.uint256),
    fees0: viewFun("0x93f1c442", "fees0()", {}, p.uint256),
    fees1: viewFun("0x4c02a21c", "fees1()", {}, p.uint256),
    feesVotingReward: viewFun("0x0fe2f711", "feesVotingReward()", {}, p.address),
    gaugeFactory: viewFun("0x0d52333c", "gaugeFactory()", {}, p.address),
    'getReward(uint256)': fun("0x1c4b774b", "getReward(uint256)", {"tokenId": p.uint256}, ),
    'getReward(address)': fun("0xc00007b0", "getReward(address)", {"account": p.address}, ),
    initialize: fun("0x391ffff8", "initialize(address,address,address,address,address,address,address,int24,bool)", {"_pool": p.address, "_feesVotingReward": p.address, "_rewardToken": p.address, "_voter": p.address, "_nft": p.address, "_token0": p.address, "_token1": p.address, "_tickSpacing": p.int24, "_isPool": p.bool}, ),
    isPool: viewFun("0xe2e1c6db", "isPool()", {}, p.bool),
    lastUpdateTime: viewFun("0x4bcddb1f", "lastUpdateTime(uint256)", {"_0": p.uint256}, p.uint256),
    left: viewFun("0x16e64048", "left()", {}, p.uint256),
    nft: viewFun("0x47ccca02", "nft()", {}, p.address),
    notifyRewardAmount: fun("0x3c6b16ab", "notifyRewardAmount(uint256)", {"_amount": p.uint256}, ),
    notifyRewardWithoutClaim: fun("0xdcdc18dc", "notifyRewardWithoutClaim(uint256)", {"_amount": p.uint256}, ),
    onERC721Received: fun("0x150b7a02", "onERC721Received(address,address,uint256,bytes)", {"_0": p.address, "_1": p.address, "_2": p.uint256, "_3": p.bytes}, p.bytes4),
    periodFinish: viewFun("0xebe2b12b", "periodFinish()", {}, p.uint256),
    pool: viewFun("0x16f0115b", "pool()", {}, p.address),
    rewardGrowthInside: viewFun("0xac789c08", "rewardGrowthInside(uint256)", {"_0": p.uint256}, p.uint256),
    rewardRate: viewFun("0x7b0a47ee", "rewardRate()", {}, p.uint256),
    rewardRateByEpoch: viewFun("0x94af5b63", "rewardRateByEpoch(uint256)", {"_0": p.uint256}, p.uint256),
    rewardToken: viewFun("0xf7c618c1", "rewardToken()", {}, p.address),
    rewards: viewFun("0xf301af42", "rewards(uint256)", {"_0": p.uint256}, p.uint256),
    stakedByIndex: viewFun("0x38463937", "stakedByIndex(address,uint256)", {"depositor": p.address, "index": p.uint256}, p.uint256),
    stakedContains: viewFun("0xc69deec5", "stakedContains(address,uint256)", {"depositor": p.address, "tokenId": p.uint256}, p.bool),
    stakedLength: viewFun("0xae775c32", "stakedLength(address)", {"depositor": p.address}, p.uint256),
    stakedValues: viewFun("0x4b937763", "stakedValues(address)", {"depositor": p.address}, p.array(p.uint256)),
    supportsPayable: viewFun("0x55b29a0e", "supportsPayable()", {}, p.bool),
    tickSpacing: viewFun("0xd0c93a7c", "tickSpacing()", {}, p.int24),
    token0: viewFun("0x0dfe1681", "token0()", {}, p.address),
    token1: viewFun("0xd21220a7", "token1()", {}, p.address),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
    withdraw: fun("0x2e1a7d4d", "withdraw(uint256)", {"tokenId": p.uint256}, ),
}

export class Contract extends ContractBase {

    WETH9() {
        return this.eth_call(functions.WETH9, {})
    }

    earned(account: EarnedParams["account"], tokenId: EarnedParams["tokenId"]) {
        return this.eth_call(functions.earned, {account, tokenId})
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

    gaugeFactory() {
        return this.eth_call(functions.gaugeFactory, {})
    }

    isPool() {
        return this.eth_call(functions.isPool, {})
    }

    lastUpdateTime(_0: LastUpdateTimeParams["_0"]) {
        return this.eth_call(functions.lastUpdateTime, {_0})
    }

    left() {
        return this.eth_call(functions.left, {})
    }

    nft() {
        return this.eth_call(functions.nft, {})
    }

    periodFinish() {
        return this.eth_call(functions.periodFinish, {})
    }

    pool() {
        return this.eth_call(functions.pool, {})
    }

    rewardGrowthInside(_0: RewardGrowthInsideParams["_0"]) {
        return this.eth_call(functions.rewardGrowthInside, {_0})
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

    stakedByIndex(depositor: StakedByIndexParams["depositor"], index: StakedByIndexParams["index"]) {
        return this.eth_call(functions.stakedByIndex, {depositor, index})
    }

    stakedContains(depositor: StakedContainsParams["depositor"], tokenId: StakedContainsParams["tokenId"]) {
        return this.eth_call(functions.stakedContains, {depositor, tokenId})
    }

    stakedLength(depositor: StakedLengthParams["depositor"]) {
        return this.eth_call(functions.stakedLength, {depositor})
    }

    stakedValues(depositor: StakedValuesParams["depositor"]) {
        return this.eth_call(functions.stakedValues, {depositor})
    }

    supportsPayable() {
        return this.eth_call(functions.supportsPayable, {})
    }

    tickSpacing() {
        return this.eth_call(functions.tickSpacing, {})
    }

    token0() {
        return this.eth_call(functions.token0, {})
    }

    token1() {
        return this.eth_call(functions.token1, {})
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
export type WETH9Params = FunctionArguments<typeof functions.WETH9>
export type WETH9Return = FunctionReturn<typeof functions.WETH9>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type EarnedParams = FunctionArguments<typeof functions.earned>
export type EarnedReturn = FunctionReturn<typeof functions.earned>

export type Fees0Params = FunctionArguments<typeof functions.fees0>
export type Fees0Return = FunctionReturn<typeof functions.fees0>

export type Fees1Params = FunctionArguments<typeof functions.fees1>
export type Fees1Return = FunctionReturn<typeof functions.fees1>

export type FeesVotingRewardParams = FunctionArguments<typeof functions.feesVotingReward>
export type FeesVotingRewardReturn = FunctionReturn<typeof functions.feesVotingReward>

export type GaugeFactoryParams = FunctionArguments<typeof functions.gaugeFactory>
export type GaugeFactoryReturn = FunctionReturn<typeof functions.gaugeFactory>

export type GetRewardParams_0 = FunctionArguments<typeof functions['getReward(uint256)']>
export type GetRewardReturn_0 = FunctionReturn<typeof functions['getReward(uint256)']>

export type GetRewardParams_1 = FunctionArguments<typeof functions['getReward(address)']>
export type GetRewardReturn_1 = FunctionReturn<typeof functions['getReward(address)']>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsPoolParams = FunctionArguments<typeof functions.isPool>
export type IsPoolReturn = FunctionReturn<typeof functions.isPool>

export type LastUpdateTimeParams = FunctionArguments<typeof functions.lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof functions.lastUpdateTime>

export type LeftParams = FunctionArguments<typeof functions.left>
export type LeftReturn = FunctionReturn<typeof functions.left>

export type NftParams = FunctionArguments<typeof functions.nft>
export type NftReturn = FunctionReturn<typeof functions.nft>

export type NotifyRewardAmountParams = FunctionArguments<typeof functions.notifyRewardAmount>
export type NotifyRewardAmountReturn = FunctionReturn<typeof functions.notifyRewardAmount>

export type NotifyRewardWithoutClaimParams = FunctionArguments<typeof functions.notifyRewardWithoutClaim>
export type NotifyRewardWithoutClaimReturn = FunctionReturn<typeof functions.notifyRewardWithoutClaim>

export type OnERC721ReceivedParams = FunctionArguments<typeof functions.onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof functions.onERC721Received>

export type PeriodFinishParams = FunctionArguments<typeof functions.periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof functions.periodFinish>

export type PoolParams = FunctionArguments<typeof functions.pool>
export type PoolReturn = FunctionReturn<typeof functions.pool>

export type RewardGrowthInsideParams = FunctionArguments<typeof functions.rewardGrowthInside>
export type RewardGrowthInsideReturn = FunctionReturn<typeof functions.rewardGrowthInside>

export type RewardRateParams = FunctionArguments<typeof functions.rewardRate>
export type RewardRateReturn = FunctionReturn<typeof functions.rewardRate>

export type RewardRateByEpochParams = FunctionArguments<typeof functions.rewardRateByEpoch>
export type RewardRateByEpochReturn = FunctionReturn<typeof functions.rewardRateByEpoch>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type StakedByIndexParams = FunctionArguments<typeof functions.stakedByIndex>
export type StakedByIndexReturn = FunctionReturn<typeof functions.stakedByIndex>

export type StakedContainsParams = FunctionArguments<typeof functions.stakedContains>
export type StakedContainsReturn = FunctionReturn<typeof functions.stakedContains>

export type StakedLengthParams = FunctionArguments<typeof functions.stakedLength>
export type StakedLengthReturn = FunctionReturn<typeof functions.stakedLength>

export type StakedValuesParams = FunctionArguments<typeof functions.stakedValues>
export type StakedValuesReturn = FunctionReturn<typeof functions.stakedValues>

export type SupportsPayableParams = FunctionArguments<typeof functions.supportsPayable>
export type SupportsPayableReturn = FunctionReturn<typeof functions.supportsPayable>

export type TickSpacingParams = FunctionArguments<typeof functions.tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof functions.tickSpacing>

export type Token0Params = FunctionArguments<typeof functions.token0>
export type Token0Return = FunctionReturn<typeof functions.token0>

export type Token1Params = FunctionArguments<typeof functions.token1>
export type Token1Return = FunctionReturn<typeof functions.token1>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

