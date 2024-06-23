import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccessControllerSet: event("0x953e92b1a6442e9c3242531154a3f6f6eb00b4e9c719ba8118fa6235e4ce89b6", "AccessControllerSet(address,address)", {"accessController": indexed(p.address), "sender": indexed(p.address)}),
    FeedConfirmed: event("0x27a180c70f2642f63d1694eb252b7df52e7ab2565e3f67adf7748acb7d82b9bc", "FeedConfirmed(address,address,address,address,uint16,address)", {"asset": indexed(p.address), "denomination": indexed(p.address), "latestAggregator": indexed(p.address), "previousAggregator": p.address, "nextPhaseId": p.uint16, "sender": p.address}),
    FeedProposed: event("0xb56c4f88c3e344891ef92e51f036d7116e886f4ea57f5ba93e28b5f44925b9ce", "FeedProposed(address,address,address,address,address)", {"asset": indexed(p.address), "denomination": indexed(p.address), "proposedAggregator": indexed(p.address), "currentAggregator": p.address, "sender": p.address}),
    OwnershipTransferRequested: event("0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278", "OwnershipTransferRequested(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    confirmFeed: fun("0x045abf4b", "confirmFeed(address,address,address)", {"base": p.address, "quote": p.address, "aggregator": p.address}, ),
    decimals: viewFun("0x58e2d3a8", "decimals(address,address)", {"base": p.address, "quote": p.address}, p.uint8),
    description: viewFun("0xfa820de9", "description(address,address)", {"base": p.address, "quote": p.address}, p.string),
    getAccessController: viewFun("0x16d6b5f6", "getAccessController()", {}, p.address),
    getAnswer: viewFun("0x15cd4ad2", "getAnswer(address,address,uint256)", {"base": p.address, "quote": p.address, "roundId": p.uint256}, p.int256),
    getCurrentPhaseId: viewFun("0x30322818", "getCurrentPhaseId(address,address)", {"base": p.address, "quote": p.address}, p.uint16),
    getFeed: viewFun("0xd2edb6dd", "getFeed(address,address)", {"base": p.address, "quote": p.address}, p.address),
    getNextRoundId: viewFun("0xa051538e", "getNextRoundId(address,address,uint80)", {"base": p.address, "quote": p.address, "roundId": p.uint80}, p.uint80),
    getPhase: viewFun("0xff0601c0", "getPhase(address,address,uint16)", {"base": p.address, "quote": p.address, "phaseId": p.uint16}, p.struct({"phaseId": p.uint16, "startingAggregatorRoundId": p.uint80, "endingAggregatorRoundId": p.uint80})),
    getPhaseFeed: viewFun("0x52dbeb8b", "getPhaseFeed(address,address,uint16)", {"base": p.address, "quote": p.address, "phaseId": p.uint16}, p.address),
    getPhaseRange: viewFun("0xc1ce86fc", "getPhaseRange(address,address,uint16)", {"base": p.address, "quote": p.address, "phaseId": p.uint16}, {"startingRoundId": p.uint80, "endingRoundId": p.uint80}),
    getPreviousRoundId: viewFun("0x9e3ff6fd", "getPreviousRoundId(address,address,uint80)", {"base": p.address, "quote": p.address, "roundId": p.uint80}, p.uint80),
    getProposedFeed: viewFun("0x5ad9d9df", "getProposedFeed(address,address)", {"base": p.address, "quote": p.address}, p.address),
    getRoundData: viewFun("0xfc58749e", "getRoundData(address,address,uint80)", {"base": p.address, "quote": p.address, "_roundId": p.uint80}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    getRoundFeed: viewFun("0xc639cd91", "getRoundFeed(address,address,uint80)", {"base": p.address, "quote": p.address, "roundId": p.uint80}, p.address),
    getTimestamp: viewFun("0x91624c95", "getTimestamp(address,address,uint256)", {"base": p.address, "quote": p.address, "roundId": p.uint256}, p.uint256),
    isFeedEnabled: viewFun("0xb099d43b", "isFeedEnabled(address)", {"aggregator": p.address}, p.bool),
    latestAnswer: viewFun("0xd4c282a3", "latestAnswer(address,address)", {"base": p.address, "quote": p.address}, p.int256),
    latestRound: viewFun("0xec62f44b", "latestRound(address,address)", {"base": p.address, "quote": p.address}, p.uint256),
    latestRoundData: viewFun("0xbcfd032d", "latestRoundData(address,address)", {"base": p.address, "quote": p.address}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    latestTimestamp: viewFun("0x672ff44f", "latestTimestamp(address,address)", {"base": p.address, "quote": p.address}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    proposeFeed: fun("0x9eed82b0", "proposeFeed(address,address,address)", {"base": p.address, "quote": p.address, "aggregator": p.address}, ),
    proposedGetRoundData: viewFun("0x8916524a", "proposedGetRoundData(address,address,uint80)", {"base": p.address, "quote": p.address, "roundId": p.uint80}, {"id": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    proposedLatestRoundData: viewFun("0xd0188fc6", "proposedLatestRoundData(address,address)", {"base": p.address, "quote": p.address}, {"id": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    setAccessController: fun("0xf08391d8", "setAccessController(address)", {"_accessController": p.address}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"to": p.address}, ),
    typeAndVersion: viewFun("0x181f5a77", "typeAndVersion()", {}, p.string),
    version: viewFun("0xaf34b03a", "version(address,address)", {"base": p.address, "quote": p.address}, p.uint256),
}

export class Contract extends ContractBase {

    decimals(base: DecimalsParams["base"], quote: DecimalsParams["quote"]) {
        return this.eth_call(functions.decimals, {base, quote})
    }

    description(base: DescriptionParams["base"], quote: DescriptionParams["quote"]) {
        return this.eth_call(functions.description, {base, quote})
    }

    getAccessController() {
        return this.eth_call(functions.getAccessController, {})
    }

    getAnswer(base: GetAnswerParams["base"], quote: GetAnswerParams["quote"], roundId: GetAnswerParams["roundId"]) {
        return this.eth_call(functions.getAnswer, {base, quote, roundId})
    }

    getCurrentPhaseId(base: GetCurrentPhaseIdParams["base"], quote: GetCurrentPhaseIdParams["quote"]) {
        return this.eth_call(functions.getCurrentPhaseId, {base, quote})
    }

    getFeed(base: GetFeedParams["base"], quote: GetFeedParams["quote"]) {
        return this.eth_call(functions.getFeed, {base, quote})
    }

    getNextRoundId(base: GetNextRoundIdParams["base"], quote: GetNextRoundIdParams["quote"], roundId: GetNextRoundIdParams["roundId"]) {
        return this.eth_call(functions.getNextRoundId, {base, quote, roundId})
    }

    getPhase(base: GetPhaseParams["base"], quote: GetPhaseParams["quote"], phaseId: GetPhaseParams["phaseId"]) {
        return this.eth_call(functions.getPhase, {base, quote, phaseId})
    }

    getPhaseFeed(base: GetPhaseFeedParams["base"], quote: GetPhaseFeedParams["quote"], phaseId: GetPhaseFeedParams["phaseId"]) {
        return this.eth_call(functions.getPhaseFeed, {base, quote, phaseId})
    }

    getPhaseRange(base: GetPhaseRangeParams["base"], quote: GetPhaseRangeParams["quote"], phaseId: GetPhaseRangeParams["phaseId"]) {
        return this.eth_call(functions.getPhaseRange, {base, quote, phaseId})
    }

    getPreviousRoundId(base: GetPreviousRoundIdParams["base"], quote: GetPreviousRoundIdParams["quote"], roundId: GetPreviousRoundIdParams["roundId"]) {
        return this.eth_call(functions.getPreviousRoundId, {base, quote, roundId})
    }

    getProposedFeed(base: GetProposedFeedParams["base"], quote: GetProposedFeedParams["quote"]) {
        return this.eth_call(functions.getProposedFeed, {base, quote})
    }

    getRoundData(base: GetRoundDataParams["base"], quote: GetRoundDataParams["quote"], _roundId: GetRoundDataParams["_roundId"]) {
        return this.eth_call(functions.getRoundData, {base, quote, _roundId})
    }

    getRoundFeed(base: GetRoundFeedParams["base"], quote: GetRoundFeedParams["quote"], roundId: GetRoundFeedParams["roundId"]) {
        return this.eth_call(functions.getRoundFeed, {base, quote, roundId})
    }

    getTimestamp(base: GetTimestampParams["base"], quote: GetTimestampParams["quote"], roundId: GetTimestampParams["roundId"]) {
        return this.eth_call(functions.getTimestamp, {base, quote, roundId})
    }

    isFeedEnabled(aggregator: IsFeedEnabledParams["aggregator"]) {
        return this.eth_call(functions.isFeedEnabled, {aggregator})
    }

    latestAnswer(base: LatestAnswerParams["base"], quote: LatestAnswerParams["quote"]) {
        return this.eth_call(functions.latestAnswer, {base, quote})
    }

    latestRound(base: LatestRoundParams["base"], quote: LatestRoundParams["quote"]) {
        return this.eth_call(functions.latestRound, {base, quote})
    }

    latestRoundData(base: LatestRoundDataParams["base"], quote: LatestRoundDataParams["quote"]) {
        return this.eth_call(functions.latestRoundData, {base, quote})
    }

    latestTimestamp(base: LatestTimestampParams["base"], quote: LatestTimestampParams["quote"]) {
        return this.eth_call(functions.latestTimestamp, {base, quote})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    proposedGetRoundData(base: ProposedGetRoundDataParams["base"], quote: ProposedGetRoundDataParams["quote"], roundId: ProposedGetRoundDataParams["roundId"]) {
        return this.eth_call(functions.proposedGetRoundData, {base, quote, roundId})
    }

    proposedLatestRoundData(base: ProposedLatestRoundDataParams["base"], quote: ProposedLatestRoundDataParams["quote"]) {
        return this.eth_call(functions.proposedLatestRoundData, {base, quote})
    }

    typeAndVersion() {
        return this.eth_call(functions.typeAndVersion, {})
    }

    version(base: VersionParams["base"], quote: VersionParams["quote"]) {
        return this.eth_call(functions.version, {base, quote})
    }
}

/// Event types
export type AccessControllerSetEventArgs = EParams<typeof events.AccessControllerSet>
export type FeedConfirmedEventArgs = EParams<typeof events.FeedConfirmed>
export type FeedProposedEventArgs = EParams<typeof events.FeedProposed>
export type OwnershipTransferRequestedEventArgs = EParams<typeof events.OwnershipTransferRequested>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type ConfirmFeedParams = FunctionArguments<typeof functions.confirmFeed>
export type ConfirmFeedReturn = FunctionReturn<typeof functions.confirmFeed>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DescriptionParams = FunctionArguments<typeof functions.description>
export type DescriptionReturn = FunctionReturn<typeof functions.description>

export type GetAccessControllerParams = FunctionArguments<typeof functions.getAccessController>
export type GetAccessControllerReturn = FunctionReturn<typeof functions.getAccessController>

export type GetAnswerParams = FunctionArguments<typeof functions.getAnswer>
export type GetAnswerReturn = FunctionReturn<typeof functions.getAnswer>

export type GetCurrentPhaseIdParams = FunctionArguments<typeof functions.getCurrentPhaseId>
export type GetCurrentPhaseIdReturn = FunctionReturn<typeof functions.getCurrentPhaseId>

export type GetFeedParams = FunctionArguments<typeof functions.getFeed>
export type GetFeedReturn = FunctionReturn<typeof functions.getFeed>

export type GetNextRoundIdParams = FunctionArguments<typeof functions.getNextRoundId>
export type GetNextRoundIdReturn = FunctionReturn<typeof functions.getNextRoundId>

export type GetPhaseParams = FunctionArguments<typeof functions.getPhase>
export type GetPhaseReturn = FunctionReturn<typeof functions.getPhase>

export type GetPhaseFeedParams = FunctionArguments<typeof functions.getPhaseFeed>
export type GetPhaseFeedReturn = FunctionReturn<typeof functions.getPhaseFeed>

export type GetPhaseRangeParams = FunctionArguments<typeof functions.getPhaseRange>
export type GetPhaseRangeReturn = FunctionReturn<typeof functions.getPhaseRange>

export type GetPreviousRoundIdParams = FunctionArguments<typeof functions.getPreviousRoundId>
export type GetPreviousRoundIdReturn = FunctionReturn<typeof functions.getPreviousRoundId>

export type GetProposedFeedParams = FunctionArguments<typeof functions.getProposedFeed>
export type GetProposedFeedReturn = FunctionReturn<typeof functions.getProposedFeed>

export type GetRoundDataParams = FunctionArguments<typeof functions.getRoundData>
export type GetRoundDataReturn = FunctionReturn<typeof functions.getRoundData>

export type GetRoundFeedParams = FunctionArguments<typeof functions.getRoundFeed>
export type GetRoundFeedReturn = FunctionReturn<typeof functions.getRoundFeed>

export type GetTimestampParams = FunctionArguments<typeof functions.getTimestamp>
export type GetTimestampReturn = FunctionReturn<typeof functions.getTimestamp>

export type IsFeedEnabledParams = FunctionArguments<typeof functions.isFeedEnabled>
export type IsFeedEnabledReturn = FunctionReturn<typeof functions.isFeedEnabled>

export type LatestAnswerParams = FunctionArguments<typeof functions.latestAnswer>
export type LatestAnswerReturn = FunctionReturn<typeof functions.latestAnswer>

export type LatestRoundParams = FunctionArguments<typeof functions.latestRound>
export type LatestRoundReturn = FunctionReturn<typeof functions.latestRound>

export type LatestRoundDataParams = FunctionArguments<typeof functions.latestRoundData>
export type LatestRoundDataReturn = FunctionReturn<typeof functions.latestRoundData>

export type LatestTimestampParams = FunctionArguments<typeof functions.latestTimestamp>
export type LatestTimestampReturn = FunctionReturn<typeof functions.latestTimestamp>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type ProposeFeedParams = FunctionArguments<typeof functions.proposeFeed>
export type ProposeFeedReturn = FunctionReturn<typeof functions.proposeFeed>

export type ProposedGetRoundDataParams = FunctionArguments<typeof functions.proposedGetRoundData>
export type ProposedGetRoundDataReturn = FunctionReturn<typeof functions.proposedGetRoundData>

export type ProposedLatestRoundDataParams = FunctionArguments<typeof functions.proposedLatestRoundData>
export type ProposedLatestRoundDataReturn = FunctionReturn<typeof functions.proposedLatestRoundData>

export type SetAccessControllerParams = FunctionArguments<typeof functions.setAccessController>
export type SetAccessControllerReturn = FunctionReturn<typeof functions.setAccessController>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TypeAndVersionParams = FunctionArguments<typeof functions.typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof functions.typeAndVersion>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

