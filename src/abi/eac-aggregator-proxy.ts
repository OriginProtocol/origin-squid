import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AnswerUpdated: event("0x0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f", "AnswerUpdated(int256,uint256,uint256)", {"current": indexed(p.int256), "roundId": indexed(p.uint256), "updatedAt": p.uint256}),
    NewRound: event("0x0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac60271", "NewRound(uint256,address,uint256)", {"roundId": indexed(p.uint256), "startedBy": indexed(p.address), "startedAt": p.uint256}),
    OwnershipTransferRequested: event("0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278", "OwnershipTransferRequested(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    accessController: viewFun("0xbc43cbaf", "accessController()", {}, p.address),
    aggregator: viewFun("0x245a7bfc", "aggregator()", {}, p.address),
    confirmAggregator: fun("0xa928c096", "confirmAggregator(address)", {"_aggregator": p.address}, ),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    description: viewFun("0x7284e416", "description()", {}, p.string),
    getAnswer: viewFun("0xb5ab58dc", "getAnswer(uint256)", {"_roundId": p.uint256}, p.int256),
    getRoundData: viewFun("0x9a6fc8f5", "getRoundData(uint80)", {"_roundId": p.uint80}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    getTimestamp: viewFun("0xb633620c", "getTimestamp(uint256)", {"_roundId": p.uint256}, p.uint256),
    latestAnswer: viewFun("0x50d25bcd", "latestAnswer()", {}, p.int256),
    latestRound: viewFun("0x668a0f02", "latestRound()", {}, p.uint256),
    latestRoundData: viewFun("0xfeaf968c", "latestRoundData()", {}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    latestTimestamp: viewFun("0x8205bf6a", "latestTimestamp()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    phaseAggregators: viewFun("0xc1597304", "phaseAggregators(uint16)", {"_0": p.uint16}, p.address),
    phaseId: viewFun("0x58303b10", "phaseId()", {}, p.uint16),
    proposeAggregator: fun("0xf8a2abd3", "proposeAggregator(address)", {"_aggregator": p.address}, ),
    proposedAggregator: viewFun("0xe8c4be30", "proposedAggregator()", {}, p.address),
    proposedGetRoundData: viewFun("0x6001ac53", "proposedGetRoundData(uint80)", {"_roundId": p.uint80}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    proposedLatestRoundData: viewFun("0x8f6b4d91", "proposedLatestRoundData()", {}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    setController: fun("0x92eefe9b", "setController(address)", {"_accessController": p.address}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"_to": p.address}, ),
    version: viewFun("0x54fd4d50", "version()", {}, p.uint256),
}

export class Contract extends ContractBase {

    accessController() {
        return this.eth_call(functions.accessController, {})
    }

    aggregator() {
        return this.eth_call(functions.aggregator, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    description() {
        return this.eth_call(functions.description, {})
    }

    getAnswer(_roundId: GetAnswerParams["_roundId"]) {
        return this.eth_call(functions.getAnswer, {_roundId})
    }

    getRoundData(_roundId: GetRoundDataParams["_roundId"]) {
        return this.eth_call(functions.getRoundData, {_roundId})
    }

    getTimestamp(_roundId: GetTimestampParams["_roundId"]) {
        return this.eth_call(functions.getTimestamp, {_roundId})
    }

    latestAnswer() {
        return this.eth_call(functions.latestAnswer, {})
    }

    latestRound() {
        return this.eth_call(functions.latestRound, {})
    }

    latestRoundData() {
        return this.eth_call(functions.latestRoundData, {})
    }

    latestTimestamp() {
        return this.eth_call(functions.latestTimestamp, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    phaseAggregators(_0: PhaseAggregatorsParams["_0"]) {
        return this.eth_call(functions.phaseAggregators, {_0})
    }

    phaseId() {
        return this.eth_call(functions.phaseId, {})
    }

    proposedAggregator() {
        return this.eth_call(functions.proposedAggregator, {})
    }

    proposedGetRoundData(_roundId: ProposedGetRoundDataParams["_roundId"]) {
        return this.eth_call(functions.proposedGetRoundData, {_roundId})
    }

    proposedLatestRoundData() {
        return this.eth_call(functions.proposedLatestRoundData, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }
}

/// Event types
export type AnswerUpdatedEventArgs = EParams<typeof events.AnswerUpdated>
export type NewRoundEventArgs = EParams<typeof events.NewRound>
export type OwnershipTransferRequestedEventArgs = EParams<typeof events.OwnershipTransferRequested>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type AccessControllerParams = FunctionArguments<typeof functions.accessController>
export type AccessControllerReturn = FunctionReturn<typeof functions.accessController>

export type AggregatorParams = FunctionArguments<typeof functions.aggregator>
export type AggregatorReturn = FunctionReturn<typeof functions.aggregator>

export type ConfirmAggregatorParams = FunctionArguments<typeof functions.confirmAggregator>
export type ConfirmAggregatorReturn = FunctionReturn<typeof functions.confirmAggregator>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DescriptionParams = FunctionArguments<typeof functions.description>
export type DescriptionReturn = FunctionReturn<typeof functions.description>

export type GetAnswerParams = FunctionArguments<typeof functions.getAnswer>
export type GetAnswerReturn = FunctionReturn<typeof functions.getAnswer>

export type GetRoundDataParams = FunctionArguments<typeof functions.getRoundData>
export type GetRoundDataReturn = FunctionReturn<typeof functions.getRoundData>

export type GetTimestampParams = FunctionArguments<typeof functions.getTimestamp>
export type GetTimestampReturn = FunctionReturn<typeof functions.getTimestamp>

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

export type PhaseAggregatorsParams = FunctionArguments<typeof functions.phaseAggregators>
export type PhaseAggregatorsReturn = FunctionReturn<typeof functions.phaseAggregators>

export type PhaseIdParams = FunctionArguments<typeof functions.phaseId>
export type PhaseIdReturn = FunctionReturn<typeof functions.phaseId>

export type ProposeAggregatorParams = FunctionArguments<typeof functions.proposeAggregator>
export type ProposeAggregatorReturn = FunctionReturn<typeof functions.proposeAggregator>

export type ProposedAggregatorParams = FunctionArguments<typeof functions.proposedAggregator>
export type ProposedAggregatorReturn = FunctionReturn<typeof functions.proposedAggregator>

export type ProposedGetRoundDataParams = FunctionArguments<typeof functions.proposedGetRoundData>
export type ProposedGetRoundDataReturn = FunctionReturn<typeof functions.proposedGetRoundData>

export type ProposedLatestRoundDataParams = FunctionArguments<typeof functions.proposedLatestRoundData>
export type ProposedLatestRoundDataReturn = FunctionReturn<typeof functions.proposedLatestRoundData>

export type SetControllerParams = FunctionArguments<typeof functions.setController>
export type SetControllerReturn = FunctionReturn<typeof functions.setController>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

