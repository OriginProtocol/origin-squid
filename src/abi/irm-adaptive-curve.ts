import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    rateAtTarget: viewFun("0x01977b57", "rateAtTarget(bytes32)", {"id": p.bytes32}, p.int256),
}

export class Contract extends ContractBase {

    rateAtTarget(id: RateAtTargetParams["id"]) {
        return this.eth_call(functions.rateAtTarget, {id})
    }
}

/// Function types
export type RateAtTargetParams = FunctionArguments<typeof functions.rateAtTarget>
export type RateAtTargetReturn = FunctionReturn<typeof functions.rateAtTarget>

