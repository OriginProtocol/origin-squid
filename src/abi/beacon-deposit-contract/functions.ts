import { bool, bytes, bytes32, bytes4 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** deposit(bytes,bytes,bytes,bytes32) */
export const deposit = func('0x22895118', {
    pubkey: bytes,
    withdrawal_credentials: bytes,
    signature: bytes,
    deposit_data_root: bytes32,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** get_deposit_count() */
export const get_deposit_count = func('0x621fd130', {}, bytes)
export type Get_deposit_countParams = FunctionArguments<typeof get_deposit_count>
export type Get_deposit_countReturn = FunctionReturn<typeof get_deposit_count>

/** get_deposit_root() */
export const get_deposit_root = func('0xc5f2892f', {}, bytes32)
export type Get_deposit_rootParams = FunctionArguments<typeof get_deposit_root>
export type Get_deposit_rootReturn = FunctionReturn<typeof get_deposit_root>

/** supportsInterface(bytes4) */
export const supportsInterface = func('0x01ffc9a7', {
    interfaceId: bytes4,
}, bool)
export type SupportsInterfaceParams = FunctionArguments<typeof supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof supportsInterface>
