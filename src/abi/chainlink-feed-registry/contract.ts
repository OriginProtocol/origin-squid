import { ContractBase } from '../abi.support.js'
import { decimals, description, getAccessController, getAnswer, getCurrentPhaseId, getFeed, getNextRoundId, getPhase, getPhaseFeed, getPhaseRange, getPreviousRoundId, getProposedFeed, getRoundData, getRoundFeed, getTimestamp, isFeedEnabled, latestAnswer, latestRound, latestRoundData, latestTimestamp, owner, proposedGetRoundData, proposedLatestRoundData, typeAndVersion, version } from './functions.js'
import type { DecimalsParams, DescriptionParams, GetAnswerParams, GetCurrentPhaseIdParams, GetFeedParams, GetNextRoundIdParams, GetPhaseFeedParams, GetPhaseParams, GetPhaseRangeParams, GetPreviousRoundIdParams, GetProposedFeedParams, GetRoundDataParams, GetRoundFeedParams, GetTimestampParams, IsFeedEnabledParams, LatestAnswerParams, LatestRoundDataParams, LatestRoundParams, LatestTimestampParams, ProposedGetRoundDataParams, ProposedLatestRoundDataParams, VersionParams } from './functions.js'

export class Contract extends ContractBase {
    decimals(base: DecimalsParams["base"], quote: DecimalsParams["quote"]) {
        return this.eth_call(decimals, {base, quote})
    }

    description(base: DescriptionParams["base"], quote: DescriptionParams["quote"]) {
        return this.eth_call(description, {base, quote})
    }

    getAccessController() {
        return this.eth_call(getAccessController, {})
    }

    getAnswer(base: GetAnswerParams["base"], quote: GetAnswerParams["quote"], roundId: GetAnswerParams["roundId"]) {
        return this.eth_call(getAnswer, {base, quote, roundId})
    }

    getCurrentPhaseId(base: GetCurrentPhaseIdParams["base"], quote: GetCurrentPhaseIdParams["quote"]) {
        return this.eth_call(getCurrentPhaseId, {base, quote})
    }

    getFeed(base: GetFeedParams["base"], quote: GetFeedParams["quote"]) {
        return this.eth_call(getFeed, {base, quote})
    }

    getNextRoundId(base: GetNextRoundIdParams["base"], quote: GetNextRoundIdParams["quote"], roundId: GetNextRoundIdParams["roundId"]) {
        return this.eth_call(getNextRoundId, {base, quote, roundId})
    }

    getPhase(base: GetPhaseParams["base"], quote: GetPhaseParams["quote"], phaseId: GetPhaseParams["phaseId"]) {
        return this.eth_call(getPhase, {base, quote, phaseId})
    }

    getPhaseFeed(base: GetPhaseFeedParams["base"], quote: GetPhaseFeedParams["quote"], phaseId: GetPhaseFeedParams["phaseId"]) {
        return this.eth_call(getPhaseFeed, {base, quote, phaseId})
    }

    getPhaseRange(base: GetPhaseRangeParams["base"], quote: GetPhaseRangeParams["quote"], phaseId: GetPhaseRangeParams["phaseId"]) {
        return this.eth_call(getPhaseRange, {base, quote, phaseId})
    }

    getPreviousRoundId(base: GetPreviousRoundIdParams["base"], quote: GetPreviousRoundIdParams["quote"], roundId: GetPreviousRoundIdParams["roundId"]) {
        return this.eth_call(getPreviousRoundId, {base, quote, roundId})
    }

    getProposedFeed(base: GetProposedFeedParams["base"], quote: GetProposedFeedParams["quote"]) {
        return this.eth_call(getProposedFeed, {base, quote})
    }

    getRoundData(base: GetRoundDataParams["base"], quote: GetRoundDataParams["quote"], _roundId: GetRoundDataParams["_roundId"]) {
        return this.eth_call(getRoundData, {base, quote, _roundId})
    }

    getRoundFeed(base: GetRoundFeedParams["base"], quote: GetRoundFeedParams["quote"], roundId: GetRoundFeedParams["roundId"]) {
        return this.eth_call(getRoundFeed, {base, quote, roundId})
    }

    getTimestamp(base: GetTimestampParams["base"], quote: GetTimestampParams["quote"], roundId: GetTimestampParams["roundId"]) {
        return this.eth_call(getTimestamp, {base, quote, roundId})
    }

    isFeedEnabled(aggregator: IsFeedEnabledParams["aggregator"]) {
        return this.eth_call(isFeedEnabled, {aggregator})
    }

    latestAnswer(base: LatestAnswerParams["base"], quote: LatestAnswerParams["quote"]) {
        return this.eth_call(latestAnswer, {base, quote})
    }

    latestRound(base: LatestRoundParams["base"], quote: LatestRoundParams["quote"]) {
        return this.eth_call(latestRound, {base, quote})
    }

    latestRoundData(base: LatestRoundDataParams["base"], quote: LatestRoundDataParams["quote"]) {
        return this.eth_call(latestRoundData, {base, quote})
    }

    latestTimestamp(base: LatestTimestampParams["base"], quote: LatestTimestampParams["quote"]) {
        return this.eth_call(latestTimestamp, {base, quote})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    proposedGetRoundData(base: ProposedGetRoundDataParams["base"], quote: ProposedGetRoundDataParams["quote"], roundId: ProposedGetRoundDataParams["roundId"]) {
        return this.eth_call(proposedGetRoundData, {base, quote, roundId})
    }

    proposedLatestRoundData(base: ProposedLatestRoundDataParams["base"], quote: ProposedLatestRoundDataParams["quote"]) {
        return this.eth_call(proposedLatestRoundData, {base, quote})
    }

    typeAndVersion() {
        return this.eth_call(typeAndVersion, {})
    }

    version(base: VersionParams["base"], quote: VersionParams["quote"]) {
        return this.eth_call(version, {base, quote})
    }
}
