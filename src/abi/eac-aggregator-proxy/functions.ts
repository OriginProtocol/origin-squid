import { address, int256, string, struct, uint16, uint256, uint8, uint80 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** accessController() */
export const accessController = func('0xbc43cbaf', {}, address)
export type AccessControllerParams = FunctionArguments<typeof accessController>
export type AccessControllerReturn = FunctionReturn<typeof accessController>

/** aggregator() */
export const aggregator = func('0x245a7bfc', {}, address)
export type AggregatorParams = FunctionArguments<typeof aggregator>
export type AggregatorReturn = FunctionReturn<typeof aggregator>

/** confirmAggregator(address) */
export const confirmAggregator = func('0xa928c096', {
    _aggregator: address,
})
export type ConfirmAggregatorParams = FunctionArguments<typeof confirmAggregator>
export type ConfirmAggregatorReturn = FunctionReturn<typeof confirmAggregator>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** description() */
export const description = func('0x7284e416', {}, string)
export type DescriptionParams = FunctionArguments<typeof description>
export type DescriptionReturn = FunctionReturn<typeof description>

/** getAnswer(uint256) */
export const getAnswer = func('0xb5ab58dc', {
    _roundId: uint256,
}, int256)
export type GetAnswerParams = FunctionArguments<typeof getAnswer>
export type GetAnswerReturn = FunctionReturn<typeof getAnswer>

/** getRoundData(uint80) */
export const getRoundData = func('0x9a6fc8f5', {
    _roundId: uint80,
}, struct({
    roundId: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type GetRoundDataParams = FunctionArguments<typeof getRoundData>
export type GetRoundDataReturn = FunctionReturn<typeof getRoundData>

/** getTimestamp(uint256) */
export const getTimestamp = func('0xb633620c', {
    _roundId: uint256,
}, uint256)
export type GetTimestampParams = FunctionArguments<typeof getTimestamp>
export type GetTimestampReturn = FunctionReturn<typeof getTimestamp>

/** latestAnswer() */
export const latestAnswer = func('0x50d25bcd', {}, int256)
export type LatestAnswerParams = FunctionArguments<typeof latestAnswer>
export type LatestAnswerReturn = FunctionReturn<typeof latestAnswer>

/** latestRound() */
export const latestRound = func('0x668a0f02', {}, uint256)
export type LatestRoundParams = FunctionArguments<typeof latestRound>
export type LatestRoundReturn = FunctionReturn<typeof latestRound>

/** latestRoundData() */
export const latestRoundData = func('0xfeaf968c', {}, struct({
    roundId: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type LatestRoundDataParams = FunctionArguments<typeof latestRoundData>
export type LatestRoundDataReturn = FunctionReturn<typeof latestRoundData>

/** latestTimestamp() */
export const latestTimestamp = func('0x8205bf6a', {}, uint256)
export type LatestTimestampParams = FunctionArguments<typeof latestTimestamp>
export type LatestTimestampReturn = FunctionReturn<typeof latestTimestamp>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** phaseAggregators(uint16) */
export const phaseAggregators = func('0xc1597304', {
    _0: uint16,
}, address)
export type PhaseAggregatorsParams = FunctionArguments<typeof phaseAggregators>
export type PhaseAggregatorsReturn = FunctionReturn<typeof phaseAggregators>

/** phaseId() */
export const phaseId = func('0x58303b10', {}, uint16)
export type PhaseIdParams = FunctionArguments<typeof phaseId>
export type PhaseIdReturn = FunctionReturn<typeof phaseId>

/** proposeAggregator(address) */
export const proposeAggregator = func('0xf8a2abd3', {
    _aggregator: address,
})
export type ProposeAggregatorParams = FunctionArguments<typeof proposeAggregator>
export type ProposeAggregatorReturn = FunctionReturn<typeof proposeAggregator>

/** proposedAggregator() */
export const proposedAggregator = func('0xe8c4be30', {}, address)
export type ProposedAggregatorParams = FunctionArguments<typeof proposedAggregator>
export type ProposedAggregatorReturn = FunctionReturn<typeof proposedAggregator>

/** proposedGetRoundData(uint80) */
export const proposedGetRoundData = func('0x6001ac53', {
    _roundId: uint80,
}, struct({
    roundId: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type ProposedGetRoundDataParams = FunctionArguments<typeof proposedGetRoundData>
export type ProposedGetRoundDataReturn = FunctionReturn<typeof proposedGetRoundData>

/** proposedLatestRoundData() */
export const proposedLatestRoundData = func('0x8f6b4d91', {}, struct({
    roundId: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type ProposedLatestRoundDataParams = FunctionArguments<typeof proposedLatestRoundData>
export type ProposedLatestRoundDataReturn = FunctionReturn<typeof proposedLatestRoundData>

/** setController(address) */
export const setController = func('0x92eefe9b', {
    _accessController: address,
})
export type SetControllerParams = FunctionArguments<typeof setController>
export type SetControllerReturn = FunctionReturn<typeof setController>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    _to: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** version() */
export const version = func('0x54fd4d50', {}, uint256)
export type VersionParams = FunctionArguments<typeof version>
export type VersionReturn = FunctionReturn<typeof version>
