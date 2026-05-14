import { address, bool, bytes } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** admin() */
export const admin = func('0xf851a440', {}, address)
export type AdminParams = FunctionArguments<typeof admin>
export type AdminReturn = FunctionReturn<typeof admin>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** implementation() */
export const implementation = func('0x5c60da1b', {}, address)
export type ImplementationParams = FunctionArguments<typeof implementation>
export type ImplementationReturn = FunctionReturn<typeof implementation>

/** initialize(address,address,bytes) */
export const initialize = func('0xcf7a1d77', {
    _logic: address,
    _initGovernor: address,
    _data: bytes,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** upgradeTo(address) */
export const upgradeTo = func('0x3659cfe6', {
    newImplementation: address,
})
export type UpgradeToParams = FunctionArguments<typeof upgradeTo>
export type UpgradeToReturn = FunctionReturn<typeof upgradeTo>

/** upgradeToAndCall(address,bytes) */
export const upgradeToAndCall = func('0x4f1ef286', {
    newImplementation: address,
    data: bytes,
})
export type UpgradeToAndCallParams = FunctionArguments<typeof upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof upgradeToAndCall>
