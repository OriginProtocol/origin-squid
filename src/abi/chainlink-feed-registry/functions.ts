import { address, bool, int256, string, struct, uint16, uint256, uint8, uint80 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** confirmFeed(address,address,address) */
export const confirmFeed = func('0x045abf4b', {
    base: address,
    quote: address,
    aggregator: address,
})
export type ConfirmFeedParams = FunctionArguments<typeof confirmFeed>
export type ConfirmFeedReturn = FunctionReturn<typeof confirmFeed>

/** decimals(address,address) */
export const decimals = func('0x58e2d3a8', {
    base: address,
    quote: address,
}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** description(address,address) */
export const description = func('0xfa820de9', {
    base: address,
    quote: address,
}, string)
export type DescriptionParams = FunctionArguments<typeof description>
export type DescriptionReturn = FunctionReturn<typeof description>

/** getAccessController() */
export const getAccessController = func('0x16d6b5f6', {}, address)
export type GetAccessControllerParams = FunctionArguments<typeof getAccessController>
export type GetAccessControllerReturn = FunctionReturn<typeof getAccessController>

/** getAnswer(address,address,uint256) */
export const getAnswer = func('0x15cd4ad2', {
    base: address,
    quote: address,
    roundId: uint256,
}, int256)
export type GetAnswerParams = FunctionArguments<typeof getAnswer>
export type GetAnswerReturn = FunctionReturn<typeof getAnswer>

/** getCurrentPhaseId(address,address) */
export const getCurrentPhaseId = func('0x30322818', {
    base: address,
    quote: address,
}, uint16)
export type GetCurrentPhaseIdParams = FunctionArguments<typeof getCurrentPhaseId>
export type GetCurrentPhaseIdReturn = FunctionReturn<typeof getCurrentPhaseId>

/** getFeed(address,address) */
export const getFeed = func('0xd2edb6dd', {
    base: address,
    quote: address,
}, address)
export type GetFeedParams = FunctionArguments<typeof getFeed>
export type GetFeedReturn = FunctionReturn<typeof getFeed>

/** getNextRoundId(address,address,uint80) */
export const getNextRoundId = func('0xa051538e', {
    base: address,
    quote: address,
    roundId: uint80,
}, uint80)
export type GetNextRoundIdParams = FunctionArguments<typeof getNextRoundId>
export type GetNextRoundIdReturn = FunctionReturn<typeof getNextRoundId>

/** getPhase(address,address,uint16) */
export const getPhase = func('0xff0601c0', {
    base: address,
    quote: address,
    phaseId: uint16,
}, struct({
    phaseId: uint16,
    startingAggregatorRoundId: uint80,
    endingAggregatorRoundId: uint80,
}))
export type GetPhaseParams = FunctionArguments<typeof getPhase>
export type GetPhaseReturn = FunctionReturn<typeof getPhase>

/** getPhaseFeed(address,address,uint16) */
export const getPhaseFeed = func('0x52dbeb8b', {
    base: address,
    quote: address,
    phaseId: uint16,
}, address)
export type GetPhaseFeedParams = FunctionArguments<typeof getPhaseFeed>
export type GetPhaseFeedReturn = FunctionReturn<typeof getPhaseFeed>

/** getPhaseRange(address,address,uint16) */
export const getPhaseRange = func('0xc1ce86fc', {
    base: address,
    quote: address,
    phaseId: uint16,
}, struct({
    startingRoundId: uint80,
    endingRoundId: uint80,
}))
export type GetPhaseRangeParams = FunctionArguments<typeof getPhaseRange>
export type GetPhaseRangeReturn = FunctionReturn<typeof getPhaseRange>

/** getPreviousRoundId(address,address,uint80) */
export const getPreviousRoundId = func('0x9e3ff6fd', {
    base: address,
    quote: address,
    roundId: uint80,
}, uint80)
export type GetPreviousRoundIdParams = FunctionArguments<typeof getPreviousRoundId>
export type GetPreviousRoundIdReturn = FunctionReturn<typeof getPreviousRoundId>

/** getProposedFeed(address,address) */
export const getProposedFeed = func('0x5ad9d9df', {
    base: address,
    quote: address,
}, address)
export type GetProposedFeedParams = FunctionArguments<typeof getProposedFeed>
export type GetProposedFeedReturn = FunctionReturn<typeof getProposedFeed>

/** getRoundData(address,address,uint80) */
export const getRoundData = func('0xfc58749e', {
    base: address,
    quote: address,
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

/** getRoundFeed(address,address,uint80) */
export const getRoundFeed = func('0xc639cd91', {
    base: address,
    quote: address,
    roundId: uint80,
}, address)
export type GetRoundFeedParams = FunctionArguments<typeof getRoundFeed>
export type GetRoundFeedReturn = FunctionReturn<typeof getRoundFeed>

/** getTimestamp(address,address,uint256) */
export const getTimestamp = func('0x91624c95', {
    base: address,
    quote: address,
    roundId: uint256,
}, uint256)
export type GetTimestampParams = FunctionArguments<typeof getTimestamp>
export type GetTimestampReturn = FunctionReturn<typeof getTimestamp>

/** isFeedEnabled(address) */
export const isFeedEnabled = func('0xb099d43b', {
    aggregator: address,
}, bool)
export type IsFeedEnabledParams = FunctionArguments<typeof isFeedEnabled>
export type IsFeedEnabledReturn = FunctionReturn<typeof isFeedEnabled>

/** latestAnswer(address,address) */
export const latestAnswer = func('0xd4c282a3', {
    base: address,
    quote: address,
}, int256)
export type LatestAnswerParams = FunctionArguments<typeof latestAnswer>
export type LatestAnswerReturn = FunctionReturn<typeof latestAnswer>

/** latestRound(address,address) */
export const latestRound = func('0xec62f44b', {
    base: address,
    quote: address,
}, uint256)
export type LatestRoundParams = FunctionArguments<typeof latestRound>
export type LatestRoundReturn = FunctionReturn<typeof latestRound>

/** latestRoundData(address,address) */
export const latestRoundData = func('0xbcfd032d', {
    base: address,
    quote: address,
}, struct({
    roundId: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type LatestRoundDataParams = FunctionArguments<typeof latestRoundData>
export type LatestRoundDataReturn = FunctionReturn<typeof latestRoundData>

/** latestTimestamp(address,address) */
export const latestTimestamp = func('0x672ff44f', {
    base: address,
    quote: address,
}, uint256)
export type LatestTimestampParams = FunctionArguments<typeof latestTimestamp>
export type LatestTimestampReturn = FunctionReturn<typeof latestTimestamp>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** proposeFeed(address,address,address) */
export const proposeFeed = func('0x9eed82b0', {
    base: address,
    quote: address,
    aggregator: address,
})
export type ProposeFeedParams = FunctionArguments<typeof proposeFeed>
export type ProposeFeedReturn = FunctionReturn<typeof proposeFeed>

/** proposedGetRoundData(address,address,uint80) */
export const proposedGetRoundData = func('0x8916524a', {
    base: address,
    quote: address,
    roundId: uint80,
}, struct({
    id: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type ProposedGetRoundDataParams = FunctionArguments<typeof proposedGetRoundData>
export type ProposedGetRoundDataReturn = FunctionReturn<typeof proposedGetRoundData>

/** proposedLatestRoundData(address,address) */
export const proposedLatestRoundData = func('0xd0188fc6', {
    base: address,
    quote: address,
}, struct({
    id: uint80,
    answer: int256,
    startedAt: uint256,
    updatedAt: uint256,
    answeredInRound: uint80,
}))
export type ProposedLatestRoundDataParams = FunctionArguments<typeof proposedLatestRoundData>
export type ProposedLatestRoundDataReturn = FunctionReturn<typeof proposedLatestRoundData>

/** setAccessController(address) */
export const setAccessController = func('0xf08391d8', {
    _accessController: address,
})
export type SetAccessControllerParams = FunctionArguments<typeof setAccessController>
export type SetAccessControllerReturn = FunctionReturn<typeof setAccessController>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    to: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** typeAndVersion() */
export const typeAndVersion = func('0x181f5a77', {}, string)
export type TypeAndVersionParams = FunctionArguments<typeof typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof typeAndVersion>

/** version(address,address) */
export const version = func('0xaf34b03a', {
    base: address,
    quote: address,
}, uint256)
export type VersionParams = FunctionArguments<typeof version>
export type VersionReturn = FunctionReturn<typeof version>
