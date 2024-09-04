import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    OracleUpdate: event("0xa7fc99ed7617309ee23f63ae90196a1e490d362e6f6a547a59bc809ee2291782", "OracleUpdate(string,uint128,uint128)", {"key": p.string, "value": p.uint128, "timestamp": p.uint128}),
    UpdaterAddressChange: event("0x121e958a4cadf7f8dadefa22cc019700365240223668418faebed197da07089f", "UpdaterAddressChange(address)", {"newUpdater": p.address}),
}

export const functions = {
    getValue: viewFun("0x960384a0", "getValue(string)", {"key": p.string}, {"_0": p.uint128, "_1": p.uint128}),
    setMultipleValues: fun("0x8d241526", "setMultipleValues(string[],uint256[])", {"keys": p.array(p.string), "compressedValues": p.array(p.uint256)}, ),
    setValue: fun("0x7898e0c2", "setValue(string,uint128,uint128)", {"key": p.string, "value": p.uint128, "timestamp": p.uint128}, ),
    updateOracleUpdaterAddress: fun("0x6aa45efc", "updateOracleUpdaterAddress(address)", {"newOracleUpdaterAddress": p.address}, ),
    values: viewFun("0x5a9ade8b", "values(string)", {"_0": p.string}, p.uint256),
}

export class Contract extends ContractBase {

    getValue(key: GetValueParams["key"]) {
        return this.eth_call(functions.getValue, {key})
    }

    values(_0: ValuesParams["_0"]) {
        return this.eth_call(functions.values, {_0})
    }
}

/// Event types
export type OracleUpdateEventArgs = EParams<typeof events.OracleUpdate>
export type UpdaterAddressChangeEventArgs = EParams<typeof events.UpdaterAddressChange>

/// Function types
export type GetValueParams = FunctionArguments<typeof functions.getValue>
export type GetValueReturn = FunctionReturn<typeof functions.getValue>

export type SetMultipleValuesParams = FunctionArguments<typeof functions.setMultipleValues>
export type SetMultipleValuesReturn = FunctionReturn<typeof functions.setMultipleValues>

export type SetValueParams = FunctionArguments<typeof functions.setValue>
export type SetValueReturn = FunctionReturn<typeof functions.setValue>

export type UpdateOracleUpdaterAddressParams = FunctionArguments<typeof functions.updateOracleUpdaterAddress>
export type UpdateOracleUpdaterAddressReturn = FunctionReturn<typeof functions.updateOracleUpdaterAddress>

export type ValuesParams = FunctionArguments<typeof functions.values>
export type ValuesReturn = FunctionReturn<typeof functions.values>

