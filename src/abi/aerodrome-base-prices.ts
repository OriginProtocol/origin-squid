import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    factoryV2: viewFun("0x68e0d4e1", "factoryV2()", {}, p.address),
    getManyRatesWithConnectors: viewFun("0xfe6b9b4c", "getManyRatesWithConnectors(uint8,address[])", {"src_len": p.uint8, "connectors": p.array(p.address)}, p.array(p.uint256)),
}

export class Contract extends ContractBase {

    factoryV2() {
        return this.eth_call(functions.factoryV2, {})
    }

    getManyRatesWithConnectors(src_len: GetManyRatesWithConnectorsParams["src_len"], connectors: GetManyRatesWithConnectorsParams["connectors"]) {
        return this.eth_call(functions.getManyRatesWithConnectors, {src_len, connectors})
    }
}

/// Function types
export type FactoryV2Params = FunctionArguments<typeof functions.factoryV2>
export type FactoryV2Return = FunctionReturn<typeof functions.factoryV2>

export type GetManyRatesWithConnectorsParams = FunctionArguments<typeof functions.getManyRatesWithConnectors>
export type GetManyRatesWithConnectorsReturn = FunctionReturn<typeof functions.getManyRatesWithConnectors>

