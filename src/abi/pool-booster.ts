import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    BribeExecuted: event("0x1424c3a24f9b1f30558ab0a7b48e07ce9f7d85b293a69a90356e1478504232eb", "BribeExecuted(uint256)", {"amount": p.uint256}),
}

export const functions = {
    MIN_BRIBE_AMOUNT: viewFun("0x3978033f", "MIN_BRIBE_AMOUNT()", {}, p.uint256),
    bribe: fun("0x37d0208c", "bribe()", {}, ),
    bribeContractOS: viewFun("0xecdb9ea1", "bribeContractOS()", {}, p.address),
    bribeContractOther: viewFun("0x840841d4", "bribeContractOther()", {}, p.address),
    osToken: viewFun("0x12c587c5", "osToken()", {}, p.address),
    split: viewFun("0xf7654176", "split()", {}, p.uint256),
}

export class Contract extends ContractBase {

    MIN_BRIBE_AMOUNT() {
        return this.eth_call(functions.MIN_BRIBE_AMOUNT, {})
    }

    bribeContractOS() {
        return this.eth_call(functions.bribeContractOS, {})
    }

    bribeContractOther() {
        return this.eth_call(functions.bribeContractOther, {})
    }

    osToken() {
        return this.eth_call(functions.osToken, {})
    }

    split() {
        return this.eth_call(functions.split, {})
    }
}

/// Event types
export type BribeExecutedEventArgs = EParams<typeof events.BribeExecuted>

/// Function types
export type MIN_BRIBE_AMOUNTParams = FunctionArguments<typeof functions.MIN_BRIBE_AMOUNT>
export type MIN_BRIBE_AMOUNTReturn = FunctionReturn<typeof functions.MIN_BRIBE_AMOUNT>

export type BribeParams = FunctionArguments<typeof functions.bribe>
export type BribeReturn = FunctionReturn<typeof functions.bribe>

export type BribeContractOSParams = FunctionArguments<typeof functions.bribeContractOS>
export type BribeContractOSReturn = FunctionReturn<typeof functions.bribeContractOS>

export type BribeContractOtherParams = FunctionArguments<typeof functions.bribeContractOther>
export type BribeContractOtherReturn = FunctionReturn<typeof functions.bribeContractOther>

export type OsTokenParams = FunctionArguments<typeof functions.osToken>
export type OsTokenReturn = FunctionReturn<typeof functions.osToken>

export type SplitParams = FunctionArguments<typeof functions.split>
export type SplitReturn = FunctionReturn<typeof functions.split>

