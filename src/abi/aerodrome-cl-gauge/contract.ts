import { ContractBase } from '../abi.support.js'
import { WETH9, earned, fees0, fees1, feesVotingReward, gaugeFactory, isPool, lastUpdateTime, left, nft, onERC721Received, periodFinish, pool, rewardGrowthInside, rewardRate, rewardRateByEpoch, rewardToken, rewards, stakedByIndex, stakedContains, stakedLength, stakedValues, supportsPayable, tickSpacing, token0, token1, voter } from './functions.js'
import type { EarnedParams, LastUpdateTimeParams, OnERC721ReceivedParams, RewardGrowthInsideParams, RewardRateByEpochParams, RewardsParams, StakedByIndexParams, StakedContainsParams, StakedLengthParams, StakedValuesParams } from './functions.js'

export class Contract extends ContractBase {
    WETH9() {
        return this.eth_call(WETH9, {})
    }

    earned(account: EarnedParams["account"], tokenId: EarnedParams["tokenId"]) {
        return this.eth_call(earned, {account, tokenId})
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

    gaugeFactory() {
        return this.eth_call(gaugeFactory, {})
    }

    isPool() {
        return this.eth_call(isPool, {})
    }

    lastUpdateTime(_0: LastUpdateTimeParams["_0"]) {
        return this.eth_call(lastUpdateTime, {_0})
    }

    left() {
        return this.eth_call(left, {})
    }

    nft() {
        return this.eth_call(nft, {})
    }

    onERC721Received(_0: OnERC721ReceivedParams["_0"], _1: OnERC721ReceivedParams["_1"], _2: OnERC721ReceivedParams["_2"], _3: OnERC721ReceivedParams["_3"]) {
        return this.eth_call(onERC721Received, {_0, _1, _2, _3})
    }

    periodFinish() {
        return this.eth_call(periodFinish, {})
    }

    pool() {
        return this.eth_call(pool, {})
    }

    rewardGrowthInside(_0: RewardGrowthInsideParams["_0"]) {
        return this.eth_call(rewardGrowthInside, {_0})
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

    stakedByIndex(depositor: StakedByIndexParams["depositor"], index: StakedByIndexParams["index"]) {
        return this.eth_call(stakedByIndex, {depositor, index})
    }

    stakedContains(depositor: StakedContainsParams["depositor"], tokenId: StakedContainsParams["tokenId"]) {
        return this.eth_call(stakedContains, {depositor, tokenId})
    }

    stakedLength(depositor: StakedLengthParams["depositor"]) {
        return this.eth_call(stakedLength, {depositor})
    }

    stakedValues(depositor: StakedValuesParams["depositor"]) {
        return this.eth_call(stakedValues, {depositor})
    }

    supportsPayable() {
        return this.eth_call(supportsPayable, {})
    }

    tickSpacing() {
        return this.eth_call(tickSpacing, {})
    }

    token0() {
        return this.eth_call(token0, {})
    }

    token1() {
        return this.eth_call(token1, {})
    }

    voter() {
        return this.eth_call(voter, {})
    }
}
