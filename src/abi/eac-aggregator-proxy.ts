import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './eac-aggregator-proxy.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AnswerUpdated: new LogEvent<([current: bigint, roundId: bigint, updatedAt: bigint] & {current: bigint, roundId: bigint, updatedAt: bigint})>(
        abi, '0x0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f'
    ),
    NewRound: new LogEvent<([roundId: bigint, startedBy: string, startedAt: bigint] & {roundId: bigint, startedBy: string, startedAt: bigint})>(
        abi, '0x0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac60271'
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
    accessController: new Func<[], {}, string>(
        abi, '0xbc43cbaf'
    ),
    aggregator: new Func<[], {}, string>(
        abi, '0x245a7bfc'
    ),
    confirmAggregator: new Func<[_aggregator: string], {_aggregator: string}, []>(
        abi, '0xa928c096'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    description: new Func<[], {}, string>(
        abi, '0x7284e416'
    ),
    getAnswer: new Func<[_roundId: bigint], {_roundId: bigint}, bigint>(
        abi, '0xb5ab58dc'
    ),
    getRoundData: new Func<[_roundId: bigint], {_roundId: bigint}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0x9a6fc8f5'
    ),
    getTimestamp: new Func<[_roundId: bigint], {_roundId: bigint}, bigint>(
        abi, '0xb633620c'
    ),
    latestAnswer: new Func<[], {}, bigint>(
        abi, '0x50d25bcd'
    ),
    latestRound: new Func<[], {}, bigint>(
        abi, '0x668a0f02'
    ),
    latestRoundData: new Func<[], {}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0xfeaf968c'
    ),
    latestTimestamp: new Func<[], {}, bigint>(
        abi, '0x8205bf6a'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    phaseAggregators: new Func<[_: number], {}, string>(
        abi, '0xc1597304'
    ),
    phaseId: new Func<[], {}, number>(
        abi, '0x58303b10'
    ),
    proposeAggregator: new Func<[_aggregator: string], {_aggregator: string}, []>(
        abi, '0xf8a2abd3'
    ),
    proposedAggregator: new Func<[], {}, string>(
        abi, '0xe8c4be30'
    ),
    proposedGetRoundData: new Func<[_roundId: bigint], {_roundId: bigint}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0x6001ac53'
    ),
    proposedLatestRoundData: new Func<[], {}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0x8f6b4d91'
    ),
    setController: new Func<[_accessController: string], {_accessController: string}, []>(
        abi, '0x92eefe9b'
    ),
    transferOwnership: new Func<[_to: string], {_to: string}, []>(
        abi, '0xf2fde38b'
    ),
    version: new Func<[], {}, bigint>(
        abi, '0x54fd4d50'
    ),
}

export class Contract extends ContractBase {

    accessController(): Promise<string> {
        return this.eth_call(functions.accessController, [])
    }

    aggregator(): Promise<string> {
        return this.eth_call(functions.aggregator, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    description(): Promise<string> {
        return this.eth_call(functions.description, [])
    }

    getAnswer(_roundId: bigint): Promise<bigint> {
        return this.eth_call(functions.getAnswer, [_roundId])
    }

    getRoundData(_roundId: bigint): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.getRoundData, [_roundId])
    }

    getTimestamp(_roundId: bigint): Promise<bigint> {
        return this.eth_call(functions.getTimestamp, [_roundId])
    }

    latestAnswer(): Promise<bigint> {
        return this.eth_call(functions.latestAnswer, [])
    }

    latestRound(): Promise<bigint> {
        return this.eth_call(functions.latestRound, [])
    }

    latestRoundData(): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.latestRoundData, [])
    }

    latestTimestamp(): Promise<bigint> {
        return this.eth_call(functions.latestTimestamp, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    phaseAggregators(arg0: number): Promise<string> {
        return this.eth_call(functions.phaseAggregators, [arg0])
    }

    phaseId(): Promise<number> {
        return this.eth_call(functions.phaseId, [])
    }

    proposedAggregator(): Promise<string> {
        return this.eth_call(functions.proposedAggregator, [])
    }

    proposedGetRoundData(_roundId: bigint): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.proposedGetRoundData, [_roundId])
    }

    proposedLatestRoundData(): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.proposedLatestRoundData, [])
    }

    version(): Promise<bigint> {
        return this.eth_call(functions.version, [])
    }
}
