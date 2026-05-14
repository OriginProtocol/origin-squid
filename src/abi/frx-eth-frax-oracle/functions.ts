import { address, bool, bytes4, int256, string, struct, uint104, uint256, uint40, uint8, uint80 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** BASE_TOKEN() */
export const BASE_TOKEN = func('0x210663e4', {}, address)
export type BASE_TOKENParams = FunctionArguments<typeof BASE_TOKEN>
export type BASE_TOKENReturn = FunctionReturn<typeof BASE_TOKEN>

/** QUOTE_TOKEN() */
export const QUOTE_TOKEN = func('0x78892cea', {}, address)
export type QUOTE_TOKENParams = FunctionArguments<typeof QUOTE_TOKEN>
export type QUOTE_TOKENReturn = FunctionReturn<typeof QUOTE_TOKEN>

/** acceptTransferTimelock() */
export const acceptTransferTimelock = func('0xf6ccaad4', {})
export type AcceptTransferTimelockParams = FunctionArguments<typeof acceptTransferTimelock>
export type AcceptTransferTimelockReturn = FunctionReturn<typeof acceptTransferTimelock>

/** addRoundData(bool,uint104,uint104,uint40) */
export const addRoundData = func('0x45d9f582', {
    _isBadData: bool,
    _priceLow: uint104,
    _priceHigh: uint104,
    _timestamp: uint40,
})
export type AddRoundDataParams = FunctionArguments<typeof addRoundData>
export type AddRoundDataReturn = FunctionReturn<typeof addRoundData>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** description() */
export const description = func('0x7284e416', {}, string)
export type DescriptionParams = FunctionArguments<typeof description>
export type DescriptionReturn = FunctionReturn<typeof description>

/** getPrices() */
export const getPrices = func('0xbd9a548b', {}, struct({
    _isBadData: bool,
    _priceLow: uint256,
    _priceHigh: uint256,
}))
export type GetPricesParams = FunctionArguments<typeof getPrices>
export type GetPricesReturn = FunctionReturn<typeof getPrices>

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

/** lastCorrectRoundId() */
export const lastCorrectRoundId = func('0x0f4a05fb', {}, uint80)
export type LastCorrectRoundIdParams = FunctionArguments<typeof lastCorrectRoundId>
export type LastCorrectRoundIdReturn = FunctionReturn<typeof lastCorrectRoundId>

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

/** maximumDeviation() */
export const maximumDeviation = func('0x9152c29d', {}, uint256)
export type MaximumDeviationParams = FunctionArguments<typeof maximumDeviation>
export type MaximumDeviationReturn = FunctionReturn<typeof maximumDeviation>

/** maximumOracleDelay() */
export const maximumOracleDelay = func('0xcede91a4', {}, uint256)
export type MaximumOracleDelayParams = FunctionArguments<typeof maximumOracleDelay>
export type MaximumOracleDelayReturn = FunctionReturn<typeof maximumOracleDelay>

/** pendingTimelockAddress() */
export const pendingTimelockAddress = func('0x090f3f50', {}, address)
export type PendingTimelockAddressParams = FunctionArguments<typeof pendingTimelockAddress>
export type PendingTimelockAddressReturn = FunctionReturn<typeof pendingTimelockAddress>

/** priceSource() */
export const priceSource = func('0x20531bc9', {}, address)
export type PriceSourceParams = FunctionArguments<typeof priceSource>
export type PriceSourceReturn = FunctionReturn<typeof priceSource>

/** renounceTimelock() */
export const renounceTimelock = func('0x4f8b4ae7', {})
export type RenounceTimelockParams = FunctionArguments<typeof renounceTimelock>
export type RenounceTimelockReturn = FunctionReturn<typeof renounceTimelock>

/** rounds(uint256) */
export const rounds = func('0x8c65c81f', {
    _0: uint256,
}, struct({
    priceLow: uint104,
    priceHigh: uint104,
    timestamp: uint40,
    isBadData: bool,
}))
export type RoundsParams = FunctionArguments<typeof rounds>
export type RoundsReturn = FunctionReturn<typeof rounds>

/** setMaximumDeviation(uint256) */
export const setMaximumDeviation = func('0x2dfa4267', {
    _newMaxDeviation: uint256,
})
export type SetMaximumDeviationParams = FunctionArguments<typeof setMaximumDeviation>
export type SetMaximumDeviationReturn = FunctionReturn<typeof setMaximumDeviation>

/** setMaximumOracleDelay(uint256) */
export const setMaximumOracleDelay = func('0xd2333be7', {
    _newMaxOracleDelay: uint256,
})
export type SetMaximumOracleDelayParams = FunctionArguments<typeof setMaximumOracleDelay>
export type SetMaximumOracleDelayReturn = FunctionReturn<typeof setMaximumOracleDelay>

/** setPriceSource(address) */
export const setPriceSource = func('0xbda53107', {
    _newPriceSource: address,
})
export type SetPriceSourceParams = FunctionArguments<typeof setPriceSource>
export type SetPriceSourceReturn = FunctionReturn<typeof setPriceSource>

/** supportsInterface(bytes4) */
export const supportsInterface = func('0x01ffc9a7', {
    interfaceId: bytes4,
}, bool)
export type SupportsInterfaceParams = FunctionArguments<typeof supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof supportsInterface>

/** timelockAddress() */
export const timelockAddress = func('0x4bc66f32', {}, address)
export type TimelockAddressParams = FunctionArguments<typeof timelockAddress>
export type TimelockAddressReturn = FunctionReturn<typeof timelockAddress>

/** transferTimelock(address) */
export const transferTimelock = func('0x45014095', {
    _newTimelock: address,
})
export type TransferTimelockParams = FunctionArguments<typeof transferTimelock>
export type TransferTimelockReturn = FunctionReturn<typeof transferTimelock>

/** version() */
export const version = func('0x54fd4d50', {}, uint256)
export type VersionParams = FunctionArguments<typeof version>
export type VersionReturn = FunctionReturn<typeof version>
