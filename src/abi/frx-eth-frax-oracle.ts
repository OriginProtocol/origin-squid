import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './frx-eth-frax-oracle.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    SetMaximumDeviation: new LogEvent<([oldMaxDeviation: bigint, newMaxDeviation: bigint] & {oldMaxDeviation: bigint, newMaxDeviation: bigint})>(
        abi, '0x7e2a21727a662d0def125b3d1237f41a099a760d472095091724cd8e56c25bf0'
    ),
    SetMaximumOracleDelay: new LogEvent<([oldMaxOracleDelay: bigint, newMaxOracleDelay: bigint] & {oldMaxOracleDelay: bigint, newMaxOracleDelay: bigint})>(
        abi, '0xd72ef688fa430b6a285b84371ba35e8a8e0762b32c1deb7be9d9c111ca79f5ea'
    ),
    SetPriceSource: new LogEvent<([oldPriceSource: string, newPriceSource: string] & {oldPriceSource: string, newPriceSource: string})>(
        abi, '0x964298b435edfc268e11aa89b342ef1ddac566da6759b6dd15d7aad58a1dc935'
    ),
    TimelockTransferStarted: new LogEvent<([previousTimelock: string, newTimelock: string] & {previousTimelock: string, newTimelock: string})>(
        abi, '0x162998b90abc2507f3953aa797827b03a14c42dbd9a35f09feaf02e0d592773a'
    ),
    TimelockTransferred: new LogEvent<([previousTimelock: string, newTimelock: string] & {previousTimelock: string, newTimelock: string})>(
        abi, '0x31b6c5a04b069b6ec1b3cef44c4e7c1eadd721349cda9823d0b1877b3551cdc6'
    ),
}

export const functions = {
    BASE_TOKEN: new Func<[], {}, string>(
        abi, '0x210663e4'
    ),
    QUOTE_TOKEN: new Func<[], {}, string>(
        abi, '0x78892cea'
    ),
    acceptTransferTimelock: new Func<[], {}, []>(
        abi, '0xf6ccaad4'
    ),
    addRoundData: new Func<[_isBadData: boolean, _priceLow: bigint, _priceHigh: bigint, _timestamp: number], {_isBadData: boolean, _priceLow: bigint, _priceHigh: bigint, _timestamp: number}, []>(
        abi, '0x45d9f582'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    description: new Func<[], {}, string>(
        abi, '0x7284e416'
    ),
    getPrices: new Func<[], {}, ([_isBadData: boolean, _priceLow: bigint, _priceHigh: bigint] & {_isBadData: boolean, _priceLow: bigint, _priceHigh: bigint})>(
        abi, '0xbd9a548b'
    ),
    getRoundData: new Func<[_roundId: bigint], {_roundId: bigint}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0x9a6fc8f5'
    ),
    lastCorrectRoundId: new Func<[], {}, bigint>(
        abi, '0x0f4a05fb'
    ),
    latestRoundData: new Func<[], {}, ([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})>(
        abi, '0xfeaf968c'
    ),
    maximumDeviation: new Func<[], {}, bigint>(
        abi, '0x9152c29d'
    ),
    maximumOracleDelay: new Func<[], {}, bigint>(
        abi, '0xcede91a4'
    ),
    pendingTimelockAddress: new Func<[], {}, string>(
        abi, '0x090f3f50'
    ),
    priceSource: new Func<[], {}, string>(
        abi, '0x20531bc9'
    ),
    renounceTimelock: new Func<[], {}, []>(
        abi, '0x4f8b4ae7'
    ),
    rounds: new Func<[_: bigint], {}, ([priceLow: bigint, priceHigh: bigint, timestamp: number, isBadData: boolean] & {priceLow: bigint, priceHigh: bigint, timestamp: number, isBadData: boolean})>(
        abi, '0x8c65c81f'
    ),
    setMaximumDeviation: new Func<[_newMaxDeviation: bigint], {_newMaxDeviation: bigint}, []>(
        abi, '0x2dfa4267'
    ),
    setMaximumOracleDelay: new Func<[_newMaxOracleDelay: bigint], {_newMaxOracleDelay: bigint}, []>(
        abi, '0xd2333be7'
    ),
    setPriceSource: new Func<[_newPriceSource: string], {_newPriceSource: string}, []>(
        abi, '0xbda53107'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    timelockAddress: new Func<[], {}, string>(
        abi, '0x4bc66f32'
    ),
    transferTimelock: new Func<[_newTimelock: string], {_newTimelock: string}, []>(
        abi, '0x45014095'
    ),
    version: new Func<[], {}, bigint>(
        abi, '0x54fd4d50'
    ),
}

export class Contract extends ContractBase {

    BASE_TOKEN(): Promise<string> {
        return this.eth_call(functions.BASE_TOKEN, [])
    }

    QUOTE_TOKEN(): Promise<string> {
        return this.eth_call(functions.QUOTE_TOKEN, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    description(): Promise<string> {
        return this.eth_call(functions.description, [])
    }

    getPrices(): Promise<([_isBadData: boolean, _priceLow: bigint, _priceHigh: bigint] & {_isBadData: boolean, _priceLow: bigint, _priceHigh: bigint})> {
        return this.eth_call(functions.getPrices, [])
    }

    getRoundData(_roundId: bigint): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.getRoundData, [_roundId])
    }

    lastCorrectRoundId(): Promise<bigint> {
        return this.eth_call(functions.lastCorrectRoundId, [])
    }

    latestRoundData(): Promise<([roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint] & {roundId: bigint, answer: bigint, startedAt: bigint, updatedAt: bigint, answeredInRound: bigint})> {
        return this.eth_call(functions.latestRoundData, [])
    }

    maximumDeviation(): Promise<bigint> {
        return this.eth_call(functions.maximumDeviation, [])
    }

    maximumOracleDelay(): Promise<bigint> {
        return this.eth_call(functions.maximumOracleDelay, [])
    }

    pendingTimelockAddress(): Promise<string> {
        return this.eth_call(functions.pendingTimelockAddress, [])
    }

    priceSource(): Promise<string> {
        return this.eth_call(functions.priceSource, [])
    }

    rounds(arg0: bigint): Promise<([priceLow: bigint, priceHigh: bigint, timestamp: number, isBadData: boolean] & {priceLow: bigint, priceHigh: bigint, timestamp: number, isBadData: boolean})> {
        return this.eth_call(functions.rounds, [arg0])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    timelockAddress(): Promise<string> {
        return this.eth_call(functions.timelockAddress, [])
    }

    version(): Promise<bigint> {
        return this.eth_call(functions.version, [])
    }
}
