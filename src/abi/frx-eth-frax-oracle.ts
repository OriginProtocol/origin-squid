import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    SetMaximumDeviation: event("0x7e2a21727a662d0def125b3d1237f41a099a760d472095091724cd8e56c25bf0", "SetMaximumDeviation(uint256,uint256)", {"oldMaxDeviation": p.uint256, "newMaxDeviation": p.uint256}),
    SetMaximumOracleDelay: event("0xd72ef688fa430b6a285b84371ba35e8a8e0762b32c1deb7be9d9c111ca79f5ea", "SetMaximumOracleDelay(uint256,uint256)", {"oldMaxOracleDelay": p.uint256, "newMaxOracleDelay": p.uint256}),
    SetPriceSource: event("0x964298b435edfc268e11aa89b342ef1ddac566da6759b6dd15d7aad58a1dc935", "SetPriceSource(address,address)", {"oldPriceSource": p.address, "newPriceSource": p.address}),
    TimelockTransferStarted: event("0x162998b90abc2507f3953aa797827b03a14c42dbd9a35f09feaf02e0d592773a", "TimelockTransferStarted(address,address)", {"previousTimelock": indexed(p.address), "newTimelock": indexed(p.address)}),
    TimelockTransferred: event("0x31b6c5a04b069b6ec1b3cef44c4e7c1eadd721349cda9823d0b1877b3551cdc6", "TimelockTransferred(address,address)", {"previousTimelock": indexed(p.address), "newTimelock": indexed(p.address)}),
}

export const functions = {
    BASE_TOKEN: viewFun("0x210663e4", "BASE_TOKEN()", {}, p.address),
    QUOTE_TOKEN: viewFun("0x78892cea", "QUOTE_TOKEN()", {}, p.address),
    acceptTransferTimelock: fun("0xf6ccaad4", "acceptTransferTimelock()", {}, ),
    addRoundData: fun("0x45d9f582", "addRoundData(bool,uint104,uint104,uint40)", {"_isBadData": p.bool, "_priceLow": p.uint104, "_priceHigh": p.uint104, "_timestamp": p.uint40}, ),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    description: viewFun("0x7284e416", "description()", {}, p.string),
    getPrices: viewFun("0xbd9a548b", "getPrices()", {}, {"_isBadData": p.bool, "_priceLow": p.uint256, "_priceHigh": p.uint256}),
    getRoundData: viewFun("0x9a6fc8f5", "getRoundData(uint80)", {"_roundId": p.uint80}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    lastCorrectRoundId: viewFun("0x0f4a05fb", "lastCorrectRoundId()", {}, p.uint80),
    latestRoundData: viewFun("0xfeaf968c", "latestRoundData()", {}, {"roundId": p.uint80, "answer": p.int256, "startedAt": p.uint256, "updatedAt": p.uint256, "answeredInRound": p.uint80}),
    maximumDeviation: viewFun("0x9152c29d", "maximumDeviation()", {}, p.uint256),
    maximumOracleDelay: viewFun("0xcede91a4", "maximumOracleDelay()", {}, p.uint256),
    pendingTimelockAddress: viewFun("0x090f3f50", "pendingTimelockAddress()", {}, p.address),
    priceSource: viewFun("0x20531bc9", "priceSource()", {}, p.address),
    renounceTimelock: fun("0x4f8b4ae7", "renounceTimelock()", {}, ),
    rounds: viewFun("0x8c65c81f", "rounds(uint256)", {"_0": p.uint256}, {"priceLow": p.uint104, "priceHigh": p.uint104, "timestamp": p.uint40, "isBadData": p.bool}),
    setMaximumDeviation: fun("0x2dfa4267", "setMaximumDeviation(uint256)", {"_newMaxDeviation": p.uint256}, ),
    setMaximumOracleDelay: fun("0xd2333be7", "setMaximumOracleDelay(uint256)", {"_newMaxOracleDelay": p.uint256}, ),
    setPriceSource: fun("0xbda53107", "setPriceSource(address)", {"_newPriceSource": p.address}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    timelockAddress: viewFun("0x4bc66f32", "timelockAddress()", {}, p.address),
    transferTimelock: fun("0x45014095", "transferTimelock(address)", {"_newTimelock": p.address}, ),
    version: viewFun("0x54fd4d50", "version()", {}, p.uint256),
}

export class Contract extends ContractBase {

    BASE_TOKEN() {
        return this.eth_call(functions.BASE_TOKEN, {})
    }

    QUOTE_TOKEN() {
        return this.eth_call(functions.QUOTE_TOKEN, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    description() {
        return this.eth_call(functions.description, {})
    }

    getPrices() {
        return this.eth_call(functions.getPrices, {})
    }

    getRoundData(_roundId: GetRoundDataParams["_roundId"]) {
        return this.eth_call(functions.getRoundData, {_roundId})
    }

    lastCorrectRoundId() {
        return this.eth_call(functions.lastCorrectRoundId, {})
    }

    latestRoundData() {
        return this.eth_call(functions.latestRoundData, {})
    }

    maximumDeviation() {
        return this.eth_call(functions.maximumDeviation, {})
    }

    maximumOracleDelay() {
        return this.eth_call(functions.maximumOracleDelay, {})
    }

    pendingTimelockAddress() {
        return this.eth_call(functions.pendingTimelockAddress, {})
    }

    priceSource() {
        return this.eth_call(functions.priceSource, {})
    }

    rounds(_0: RoundsParams["_0"]) {
        return this.eth_call(functions.rounds, {_0})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    timelockAddress() {
        return this.eth_call(functions.timelockAddress, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }
}

/// Event types
export type SetMaximumDeviationEventArgs = EParams<typeof events.SetMaximumDeviation>
export type SetMaximumOracleDelayEventArgs = EParams<typeof events.SetMaximumOracleDelay>
export type SetPriceSourceEventArgs = EParams<typeof events.SetPriceSource>
export type TimelockTransferStartedEventArgs = EParams<typeof events.TimelockTransferStarted>
export type TimelockTransferredEventArgs = EParams<typeof events.TimelockTransferred>

/// Function types
export type BASE_TOKENParams = FunctionArguments<typeof functions.BASE_TOKEN>
export type BASE_TOKENReturn = FunctionReturn<typeof functions.BASE_TOKEN>

export type QUOTE_TOKENParams = FunctionArguments<typeof functions.QUOTE_TOKEN>
export type QUOTE_TOKENReturn = FunctionReturn<typeof functions.QUOTE_TOKEN>

export type AcceptTransferTimelockParams = FunctionArguments<typeof functions.acceptTransferTimelock>
export type AcceptTransferTimelockReturn = FunctionReturn<typeof functions.acceptTransferTimelock>

export type AddRoundDataParams = FunctionArguments<typeof functions.addRoundData>
export type AddRoundDataReturn = FunctionReturn<typeof functions.addRoundData>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DescriptionParams = FunctionArguments<typeof functions.description>
export type DescriptionReturn = FunctionReturn<typeof functions.description>

export type GetPricesParams = FunctionArguments<typeof functions.getPrices>
export type GetPricesReturn = FunctionReturn<typeof functions.getPrices>

export type GetRoundDataParams = FunctionArguments<typeof functions.getRoundData>
export type GetRoundDataReturn = FunctionReturn<typeof functions.getRoundData>

export type LastCorrectRoundIdParams = FunctionArguments<typeof functions.lastCorrectRoundId>
export type LastCorrectRoundIdReturn = FunctionReturn<typeof functions.lastCorrectRoundId>

export type LatestRoundDataParams = FunctionArguments<typeof functions.latestRoundData>
export type LatestRoundDataReturn = FunctionReturn<typeof functions.latestRoundData>

export type MaximumDeviationParams = FunctionArguments<typeof functions.maximumDeviation>
export type MaximumDeviationReturn = FunctionReturn<typeof functions.maximumDeviation>

export type MaximumOracleDelayParams = FunctionArguments<typeof functions.maximumOracleDelay>
export type MaximumOracleDelayReturn = FunctionReturn<typeof functions.maximumOracleDelay>

export type PendingTimelockAddressParams = FunctionArguments<typeof functions.pendingTimelockAddress>
export type PendingTimelockAddressReturn = FunctionReturn<typeof functions.pendingTimelockAddress>

export type PriceSourceParams = FunctionArguments<typeof functions.priceSource>
export type PriceSourceReturn = FunctionReturn<typeof functions.priceSource>

export type RenounceTimelockParams = FunctionArguments<typeof functions.renounceTimelock>
export type RenounceTimelockReturn = FunctionReturn<typeof functions.renounceTimelock>

export type RoundsParams = FunctionArguments<typeof functions.rounds>
export type RoundsReturn = FunctionReturn<typeof functions.rounds>

export type SetMaximumDeviationParams = FunctionArguments<typeof functions.setMaximumDeviation>
export type SetMaximumDeviationReturn = FunctionReturn<typeof functions.setMaximumDeviation>

export type SetMaximumOracleDelayParams = FunctionArguments<typeof functions.setMaximumOracleDelay>
export type SetMaximumOracleDelayReturn = FunctionReturn<typeof functions.setMaximumOracleDelay>

export type SetPriceSourceParams = FunctionArguments<typeof functions.setPriceSource>
export type SetPriceSourceReturn = FunctionReturn<typeof functions.setPriceSource>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TimelockAddressParams = FunctionArguments<typeof functions.timelockAddress>
export type TimelockAddressReturn = FunctionReturn<typeof functions.timelockAddress>

export type TransferTimelockParams = FunctionArguments<typeof functions.transferTimelock>
export type TransferTimelockReturn = FunctionReturn<typeof functions.transferTimelock>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

