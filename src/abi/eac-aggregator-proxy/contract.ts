import { ContractBase } from '../abi.support.js'
import { accessController, aggregator, decimals, description, getAnswer, getRoundData, getTimestamp, latestAnswer, latestRound, latestRoundData, latestTimestamp, owner, phaseAggregators, phaseId, proposedAggregator, proposedGetRoundData, proposedLatestRoundData, version } from './functions.js'
import type { GetAnswerParams, GetRoundDataParams, GetTimestampParams, PhaseAggregatorsParams, ProposedGetRoundDataParams } from './functions.js'

export class Contract extends ContractBase {
    accessController() {
        return this.eth_call(accessController, {})
    }

    aggregator() {
        return this.eth_call(aggregator, {})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    description() {
        return this.eth_call(description, {})
    }

    getAnswer(_roundId: GetAnswerParams["_roundId"]) {
        return this.eth_call(getAnswer, {_roundId})
    }

    getRoundData(_roundId: GetRoundDataParams["_roundId"]) {
        return this.eth_call(getRoundData, {_roundId})
    }

    getTimestamp(_roundId: GetTimestampParams["_roundId"]) {
        return this.eth_call(getTimestamp, {_roundId})
    }

    latestAnswer() {
        return this.eth_call(latestAnswer, {})
    }

    latestRound() {
        return this.eth_call(latestRound, {})
    }

    latestRoundData() {
        return this.eth_call(latestRoundData, {})
    }

    latestTimestamp() {
        return this.eth_call(latestTimestamp, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    phaseAggregators(_0: PhaseAggregatorsParams["_0"]) {
        return this.eth_call(phaseAggregators, {_0})
    }

    phaseId() {
        return this.eth_call(phaseId, {})
    }

    proposedAggregator() {
        return this.eth_call(proposedAggregator, {})
    }

    proposedGetRoundData(_roundId: ProposedGetRoundDataParams["_roundId"]) {
        return this.eth_call(proposedGetRoundData, {_roundId})
    }

    proposedLatestRoundData() {
        return this.eth_call(proposedLatestRoundData, {})
    }

    version() {
        return this.eth_call(version, {})
    }
}
