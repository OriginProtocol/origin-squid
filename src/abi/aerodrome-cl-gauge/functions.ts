import { address, array, bool, bytes, bytes4, int24, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** WETH9() */
export const WETH9 = func('0x4aa4a4fc', {}, address)
export type WETH9Params = FunctionArguments<typeof WETH9>
export type WETH9Return = FunctionReturn<typeof WETH9>

/** deposit(uint256) */
export const deposit = func('0xb6b55f25', {
    tokenId: uint256,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** earned(address,uint256) */
export const earned = func('0x3e491d47', {
    account: address,
    tokenId: uint256,
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

/** gaugeFactory() */
export const gaugeFactory = func('0x0d52333c', {}, address)
export type GaugeFactoryParams = FunctionArguments<typeof gaugeFactory>
export type GaugeFactoryReturn = FunctionReturn<typeof gaugeFactory>

/** getReward(uint256) */
export const getReward = func('0x1c4b774b', {
    tokenId: uint256,
})
export type GetRewardParams = FunctionArguments<typeof getReward>
export type GetRewardReturn = FunctionReturn<typeof getReward>

/** getReward(address) */
export const getReward_1 = func('0xc00007b0', {
    account: address,
})
export type GetRewardParams_1 = FunctionArguments<typeof getReward_1>
export type GetRewardReturn_1 = FunctionReturn<typeof getReward_1>

/** initialize(address,address,address,address,address,address,address,int24,bool) */
export const initialize = func('0x391ffff8', {
    _pool: address,
    _feesVotingReward: address,
    _rewardToken: address,
    _voter: address,
    _nft: address,
    _token0: address,
    _token1: address,
    _tickSpacing: int24,
    _isPool: bool,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isPool() */
export const isPool = func('0xe2e1c6db', {}, bool)
export type IsPoolParams = FunctionArguments<typeof isPool>
export type IsPoolReturn = FunctionReturn<typeof isPool>

/** lastUpdateTime(uint256) */
export const lastUpdateTime = func('0x4bcddb1f', {
    _0: uint256,
}, uint256)
export type LastUpdateTimeParams = FunctionArguments<typeof lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof lastUpdateTime>

/** left() */
export const left = func('0x16e64048', {}, uint256)
export type LeftParams = FunctionArguments<typeof left>
export type LeftReturn = FunctionReturn<typeof left>

/** nft() */
export const nft = func('0x47ccca02', {}, address)
export type NftParams = FunctionArguments<typeof nft>
export type NftReturn = FunctionReturn<typeof nft>

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

/** onERC721Received(address,address,uint256,bytes) */
export const onERC721Received = func('0x150b7a02', {
    _0: address,
    _1: address,
    _2: uint256,
    _3: bytes,
}, bytes4)
export type OnERC721ReceivedParams = FunctionArguments<typeof onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof onERC721Received>

/** periodFinish() */
export const periodFinish = func('0xebe2b12b', {}, uint256)
export type PeriodFinishParams = FunctionArguments<typeof periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof periodFinish>

/** pool() */
export const pool = func('0x16f0115b', {}, address)
export type PoolParams = FunctionArguments<typeof pool>
export type PoolReturn = FunctionReturn<typeof pool>

/** rewardGrowthInside(uint256) */
export const rewardGrowthInside = func('0xac789c08', {
    _0: uint256,
}, uint256)
export type RewardGrowthInsideParams = FunctionArguments<typeof rewardGrowthInside>
export type RewardGrowthInsideReturn = FunctionReturn<typeof rewardGrowthInside>

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

/** rewards(uint256) */
export const rewards = func('0xf301af42', {
    _0: uint256,
}, uint256)
export type RewardsParams = FunctionArguments<typeof rewards>
export type RewardsReturn = FunctionReturn<typeof rewards>

/** stakedByIndex(address,uint256) */
export const stakedByIndex = func('0x38463937', {
    depositor: address,
    index: uint256,
}, uint256)
export type StakedByIndexParams = FunctionArguments<typeof stakedByIndex>
export type StakedByIndexReturn = FunctionReturn<typeof stakedByIndex>

/** stakedContains(address,uint256) */
export const stakedContains = func('0xc69deec5', {
    depositor: address,
    tokenId: uint256,
}, bool)
export type StakedContainsParams = FunctionArguments<typeof stakedContains>
export type StakedContainsReturn = FunctionReturn<typeof stakedContains>

/** stakedLength(address) */
export const stakedLength = func('0xae775c32', {
    depositor: address,
}, uint256)
export type StakedLengthParams = FunctionArguments<typeof stakedLength>
export type StakedLengthReturn = FunctionReturn<typeof stakedLength>

/** stakedValues(address) */
export const stakedValues = func('0x4b937763', {
    depositor: address,
}, array(uint256))
export type StakedValuesParams = FunctionArguments<typeof stakedValues>
export type StakedValuesReturn = FunctionReturn<typeof stakedValues>

/** supportsPayable() */
export const supportsPayable = func('0x55b29a0e', {}, bool)
export type SupportsPayableParams = FunctionArguments<typeof supportsPayable>
export type SupportsPayableReturn = FunctionReturn<typeof supportsPayable>

/** tickSpacing() */
export const tickSpacing = func('0xd0c93a7c', {}, int24)
export type TickSpacingParams = FunctionArguments<typeof tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof tickSpacing>

/** token0() */
export const token0 = func('0x0dfe1681', {}, address)
export type Token0Params = FunctionArguments<typeof token0>
export type Token0Return = FunctionReturn<typeof token0>

/** token1() */
export const token1 = func('0xd21220a7', {}, address)
export type Token1Params = FunctionArguments<typeof token1>
export type Token1Return = FunctionReturn<typeof token1>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>

/** withdraw(uint256) */
export const withdraw = func('0x2e1a7d4d', {
    tokenId: uint256,
})
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>
