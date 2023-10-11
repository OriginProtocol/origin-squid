import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './chainlink-feed-registry.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AccessControllerSet: new LogEvent<([accessController: string, sender: string] & {accessController: string, sender: string})>(
        abi, '0x953e92b1a6442e9c3242531154a3f6f6eb00b4e9c719ba8118fa6235e4ce89b6'
    ),
    FeedConfirmed: new LogEvent<([asset: string, denomination: string, latestAggregator: string, previousAggregator: string, nextPhaseId: number, sender: string] & {asset: string, denomination: string, latestAggregator: string, previousAggregator: string, nextPhaseId: number, sender: string})>(
        abi, '0x27a180c70f2642f63d1694eb252b7df52e7ab2565e3f67adf7748acb7d82b9bc'
    ),
    FeedProposed: new LogEvent<([asset: string, denomination: string, proposedAggregator: string, currentAggregator: string, sender: string] & {asset: string, denomination: string, proposedAggregator: string, currentAggregator: string, sender: string})>(
        abi, '0xb56c4f88c3e344891ef92e51f036d7116e886f4ea57f5ba93e28b5f44925b9ce'
    ),
    OwnershipTransferRequested: new LogEvent<([from: string, to: string] & {from: string, to: string})>(
        abi, '0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278'
    ),
    OwnershipTransferred: new LogEvent<([from: string, to: string] & {from: string, to: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
}

export const functions = {
    acceptOwnership: new Func<[], {}, []>(
        abi, '0x79ba5097'
    ),
    confirmFeed: new Func<[base: string, quote: string, aggregator: string], {base: string, quote: string, aggregator: string}, []>(
        abi, '0x045abf4b'
    ),
    decimals: new Func<[base: string, quote: string], {base: string, quote: string}, number>(
        abi, '0x58e2d3a8'
    ),
    description: new Func<[base: string, quote: string], {base: string, quote: string}, string>(
        abi, '0xfa820de9'
    ),
    getAccessController: new Func<[], {}, string>(
        abi, '0x16d6b5f6'
    ),
    getAnswer: new Func<[base: string, quote: string, roundId: bigint], {base: string, quote: string, roundId: bigint}, bigint>(
        abi, '0x15cd4ad2'
    ),
    getCurrentPhaseId: new Func<[base: string, quote: string], {base: string, quote: string}, number>(
        abi, '0x30322818'
    ),
    getFeed: new Func<[base: string, quote: string], {base: string, quote: string}, string>(
        abi, '0xd2edb6dd'
    ),
    getNextRoundId: new Func<[base: string, quote: string, roundId: bigint], {base: string, quote: string, roundId: bigint}, bigint>(
        abi, '0xa051538e'
    ),
    getPhase: new Func<[base: string, quote: string, phaseId: number], {base: string, quote: string, phaseId: number}, ([phaseId: number, startingAggregatorRoundId: bigint, endingAggregatorRoundId: bigint] & {phaseId: number, startingAggregatorRoundId: bigint, endingAggregatorRoundId: bigint})>(
        abi, '0xff0601c0'
    ),
    getPhaseFeed: new Func<[base: string, quote: string, phaseId: number], {base: string, quote: string, phaseId: number}, string>(
        abi, '0x52dbeb8b'
    ),
    getPhaseRange: new Func<[base: string, quote: string, phaseId: number], {base: string, quote: string, phaseId: number}, ([startingRoundId: bigint, endingRoundId: bigint] & {startingRoundId: bigint, endingRoundId: bigint})>(
        abi, '0xc1ce86fc'
    ),
    getPreviousRoundId: new Func<[base: string, quote: string, roundId: bigint], {base: string, quote: string, roundId: bigint}, bigint>(
        abi, '0x9e3ff6fd'
    ),
    getProposedFeed: new Func<[base: string, quote: string], {base: string, quote: string}, string>(
        abi, '0x5ad9d9df'
    ),
    getRoundData: new Func<[base: string, quote: string, _roundId: bigint], {base: string, quote: string, _roundId: bigint}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0xfc58749e'
    ),
    getRoundFeed: new Func<[base: string, quote: string, roundId: bigint], {base: string, quote: string, roundId: bigint}, string>(
        abi, '0xc639cd91'
    ),
    getTimestamp: new Func<[base: string, quote: string, roundId: bigint], {base: string, quote: string, roundId: bigint}, bigint>(
        abi, '0x91624c95'
    ),
    isFeedEnabled: new Func<[aggregator: string], {aggregator: string}, boolean>(
        abi, '0xb099d43b'
    ),
    latestAnswer: new Func<[base: string, quote: string], {base: string, quote: string}, bigint>(
        abi, '0xd4c282a3'
    ),
    latestRound: new Func<[base: string, quote: string], {base: string, quote: string}, bigint>(
        abi, '0xec62f44b'
    ),
    latestRoundData: new Func<[base: string, quote: string], {base: string, quote: string}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0xbcfd032d'
    ),
    latestTimestamp: new Func<[base: string, quote: string], {base: string, quote: string}, bigint>(
        abi, '0x672ff44f'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    proposeFeed: new Func<[base: string, quote: string, aggregator: string], {base: string, quote: string, aggregator: string}, []>(
        abi, '0x9eed82b0'
    ),
    proposedGetRoundData: new Func<[base: string, quote: string, roundId: bigint], {base: string, quote: string, roundId: bigint}, ([id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0x8916524a'
    ),
    proposedLatestRoundData: new Func<[base: string, quote: string], {base: string, quote: string}, ([id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0xd0188fc6'
    ),
    setAccessController: new Func<[_accessController: string], {_accessController: string}, []>(
        abi, '0xf08391d8'
    ),
    transferOwnership: new Func<[to: string], {to: string}, []>(
        abi, '0xf2fde38b'
    ),
    typeAndVersion: new Func<[], {}, string>(
        abi, '0x181f5a77'
    ),
    version: new Func<[base: string, quote: string], {base: string, quote: string}, bigint>(
        abi, '0xaf34b03a'
    ),
}

export class Contract extends ContractBase {

    decimals(base: string, quote: string): Promise<number> {
        return this.eth_call(functions.decimals, [base, quote])
    }

    description(base: string, quote: string): Promise<string> {
        return this.eth_call(functions.description, [base, quote])
    }

    getAccessController(): Promise<string> {
        return this.eth_call(functions.getAccessController, [])
    }

    getAnswer(base: string, quote: string, roundId: bigint): Promise<bigint> {
        return this.eth_call(functions.getAnswer, [base, quote, roundId])
    }

    getCurrentPhaseId(base: string, quote: string): Promise<number> {
        return this.eth_call(functions.getCurrentPhaseId, [base, quote])
    }

    getFeed(base: string, quote: string): Promise<string> {
        return this.eth_call(functions.getFeed, [base, quote])
    }

    getNextRoundId(base: string, quote: string, roundId: bigint): Promise<bigint> {
        return this.eth_call(functions.getNextRoundId, [base, quote, roundId])
    }

    getPhase(base: string, quote: string, phaseId: number): Promise<([phaseId: number, startingAggregatorRoundId: bigint, endingAggregatorRoundId: bigint] & {phaseId: number, startingAggregatorRoundId: bigint, endingAggregatorRoundId: bigint})> {
        return this.eth_call(functions.getPhase, [base, quote, phaseId])
    }

    getPhaseFeed(base: string, quote: string, phaseId: number): Promise<string> {
        return this.eth_call(functions.getPhaseFeed, [base, quote, phaseId])
    }

    getPhaseRange(base: string, quote: string, phaseId: number): Promise<([startingRoundId: bigint, endingRoundId: bigint] & {startingRoundId: bigint, endingRoundId: bigint})> {
        return this.eth_call(functions.getPhaseRange, [base, quote, phaseId])
    }

    getPreviousRoundId(base: string, quote: string, roundId: bigint): Promise<bigint> {
        return this.eth_call(functions.getPreviousRoundId, [base, quote, roundId])
    }

    getProposedFeed(base: string, quote: string): Promise<string> {
        return this.eth_call(functions.getProposedFeed, [base, quote])
    }

    getRoundData(base: string, quote: string, _roundId: bigint): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.getRoundData, [base, quote, _roundId])
    }

    getRoundFeed(base: string, quote: string, roundId: bigint): Promise<string> {
        return this.eth_call(functions.getRoundFeed, [base, quote, roundId])
    }

    getTimestamp(base: string, quote: string, roundId: bigint): Promise<bigint> {
        return this.eth_call(functions.getTimestamp, [base, quote, roundId])
    }

    isFeedEnabled(aggregator: string): Promise<boolean> {
        return this.eth_call(functions.isFeedEnabled, [aggregator])
    }

    latestAnswer(base: string, quote: string): Promise<bigint> {
        return this.eth_call(functions.latestAnswer, [base, quote])
    }

    latestRound(base: string, quote: string): Promise<bigint> {
        return this.eth_call(functions.latestRound, [base, quote])
    }

    latestRoundData(base: string, quote: string): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.latestRoundData, [base, quote])
    }

    latestTimestamp(base: string, quote: string): Promise<bigint> {
        return this.eth_call(functions.latestTimestamp, [base, quote])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    proposedGetRoundData(base: string, quote: string, roundId: bigint): Promise<([id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.proposedGetRoundData, [base, quote, roundId])
    }

    proposedLatestRoundData(base: string, quote: string): Promise<([id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {id: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.proposedLatestRoundData, [base, quote])
    }

    typeAndVersion(): Promise<string> {
        return this.eth_call(functions.typeAndVersion, [])
    }

    version(base: string, quote: string): Promise<bigint> {
        return this.eth_call(functions.version, [base, quote])
    }
}
