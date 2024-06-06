import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    DepositEvent: event("0x649bbc62d0e31342afea4e5cd82d4049e7e1ee912fc0889aa790803be39038c5", {"pubkey": p.bytes, "withdrawal_credentials": p.bytes, "amount": p.bytes, "signature": p.bytes, "index": p.bytes}),
}

export const functions = {
    deposit: fun("0x22895118", {"pubkey": p.bytes, "withdrawal_credentials": p.bytes, "signature": p.bytes, "deposit_data_root": p.bytes32}, ),
    get_deposit_count: fun("0x621fd130", {}, p.bytes),
    get_deposit_root: fun("0xc5f2892f", {}, p.bytes32),
    supportsInterface: fun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
}

export class Contract extends ContractBase {

    get_deposit_count() {
        return this.eth_call(functions.get_deposit_count, {})
    }

    get_deposit_root() {
        return this.eth_call(functions.get_deposit_root, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }
}

/// Event types
export type DepositEventEventArgs = EParams<typeof events.DepositEvent>

/// Function types
export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type Get_deposit_countParams = FunctionArguments<typeof functions.get_deposit_count>
export type Get_deposit_countReturn = FunctionReturn<typeof functions.get_deposit_count>

export type Get_deposit_rootParams = FunctionArguments<typeof functions.get_deposit_root>
export type Get_deposit_rootReturn = FunctionReturn<typeof functions.get_deposit_root>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

