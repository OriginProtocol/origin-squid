import { ContractBase } from '../abi.support.js'
import { claimable, createGauge, emergencyCouncil, epochGovernor, epochNext, epochStart, epochVoteEnd, epochVoteStart, factoryRegistry, forwarder, gaugeToBribe, gaugeToFees, gauges, governor, isAlive, isGauge, isTrustedForwarder, isWhitelistedNFT, isWhitelistedToken, lastVoted, length, maxVotingNum, minter, poolForGauge, poolVote, pools, totalWeight, usedWeights, ve, votes, weights } from './functions.js'
import type { ClaimableParams, CreateGaugeParams, EpochNextParams, EpochStartParams, EpochVoteEndParams, EpochVoteStartParams, GaugeToBribeParams, GaugeToFeesParams, GaugesParams, IsAliveParams, IsGaugeParams, IsTrustedForwarderParams, IsWhitelistedNFTParams, IsWhitelistedTokenParams, LastVotedParams, PoolForGaugeParams, PoolVoteParams, PoolsParams, UsedWeightsParams, VotesParams, WeightsParams } from './functions.js'

export class Contract extends ContractBase {
    claimable(_0: ClaimableParams["_0"]) {
        return this.eth_call(claimable, {_0})
    }

    createGauge(_poolFactory: CreateGaugeParams["_poolFactory"], _pool: CreateGaugeParams["_pool"]) {
        return this.eth_call(createGauge, {_poolFactory, _pool})
    }

    emergencyCouncil() {
        return this.eth_call(emergencyCouncil, {})
    }

    epochGovernor() {
        return this.eth_call(epochGovernor, {})
    }

    epochNext(_timestamp: EpochNextParams["_timestamp"]) {
        return this.eth_call(epochNext, {_timestamp})
    }

    epochStart(_timestamp: EpochStartParams["_timestamp"]) {
        return this.eth_call(epochStart, {_timestamp})
    }

    epochVoteEnd(_timestamp: EpochVoteEndParams["_timestamp"]) {
        return this.eth_call(epochVoteEnd, {_timestamp})
    }

    epochVoteStart(_timestamp: EpochVoteStartParams["_timestamp"]) {
        return this.eth_call(epochVoteStart, {_timestamp})
    }

    factoryRegistry() {
        return this.eth_call(factoryRegistry, {})
    }

    forwarder() {
        return this.eth_call(forwarder, {})
    }

    gaugeToBribe(_0: GaugeToBribeParams["_0"]) {
        return this.eth_call(gaugeToBribe, {_0})
    }

    gaugeToFees(_0: GaugeToFeesParams["_0"]) {
        return this.eth_call(gaugeToFees, {_0})
    }

    gauges(_0: GaugesParams["_0"]) {
        return this.eth_call(gauges, {_0})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isAlive(_0: IsAliveParams["_0"]) {
        return this.eth_call(isAlive, {_0})
    }

    isGauge(_0: IsGaugeParams["_0"]) {
        return this.eth_call(isGauge, {_0})
    }

    isTrustedForwarder(forwarder: IsTrustedForwarderParams["forwarder"]) {
        return this.eth_call(isTrustedForwarder, {forwarder})
    }

    isWhitelistedNFT(_0: IsWhitelistedNFTParams["_0"]) {
        return this.eth_call(isWhitelistedNFT, {_0})
    }

    isWhitelistedToken(_0: IsWhitelistedTokenParams["_0"]) {
        return this.eth_call(isWhitelistedToken, {_0})
    }

    lastVoted(_0: LastVotedParams["_0"]) {
        return this.eth_call(lastVoted, {_0})
    }

    length() {
        return this.eth_call(length, {})
    }

    maxVotingNum() {
        return this.eth_call(maxVotingNum, {})
    }

    minter() {
        return this.eth_call(minter, {})
    }

    poolForGauge(_0: PoolForGaugeParams["_0"]) {
        return this.eth_call(poolForGauge, {_0})
    }

    poolVote(_0: PoolVoteParams["_0"], _1: PoolVoteParams["_1"]) {
        return this.eth_call(poolVote, {_0, _1})
    }

    pools(_0: PoolsParams["_0"]) {
        return this.eth_call(pools, {_0})
    }

    totalWeight() {
        return this.eth_call(totalWeight, {})
    }

    usedWeights(_0: UsedWeightsParams["_0"]) {
        return this.eth_call(usedWeights, {_0})
    }

    ve() {
        return this.eth_call(ve, {})
    }

    votes(_0: VotesParams["_0"], _1: VotesParams["_1"]) {
        return this.eth_call(votes, {_0, _1})
    }

    weights(_0: WeightsParams["_0"]) {
        return this.eth_call(weights, {_0})
    }
}
