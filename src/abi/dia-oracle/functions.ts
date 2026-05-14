import { address, array, string, struct, uint128, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** getValue(string) */
export const getValue = func('0x960384a0', {
    key: string,
}, struct({
    _0: uint128,
    _1: uint128,
}))
export type GetValueParams = FunctionArguments<typeof getValue>
export type GetValueReturn = FunctionReturn<typeof getValue>

/** setMultipleValues(string[],uint256[]) */
export const setMultipleValues = func('0x8d241526', {
    keys: array(string),
    compressedValues: array(uint256),
})
export type SetMultipleValuesParams = FunctionArguments<typeof setMultipleValues>
export type SetMultipleValuesReturn = FunctionReturn<typeof setMultipleValues>

/** setValue(string,uint128,uint128) */
export const setValue = func('0x7898e0c2', {
    key: string,
    value: uint128,
    timestamp: uint128,
})
export type SetValueParams = FunctionArguments<typeof setValue>
export type SetValueReturn = FunctionReturn<typeof setValue>

/** updateOracleUpdaterAddress(address) */
export const updateOracleUpdaterAddress = func('0x6aa45efc', {
    newOracleUpdaterAddress: address,
})
export type UpdateOracleUpdaterAddressParams = FunctionArguments<typeof updateOracleUpdaterAddress>
export type UpdateOracleUpdaterAddressReturn = FunctionReturn<typeof updateOracleUpdaterAddress>

/** values(string) */
export const values = func('0x5a9ade8b', {
    _0: string,
}, uint256)
export type ValuesParams = FunctionArguments<typeof values>
export type ValuesReturn = FunctionReturn<typeof values>
