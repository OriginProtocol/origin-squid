import { address, array, bool, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** approveFactory(address) */
export const approveFactory = func('0xadda33c5', {
    _factoryAddress: address,
})
export type ApproveFactoryParams = FunctionArguments<typeof approveFactory>
export type ApproveFactoryReturn = FunctionReturn<typeof approveFactory>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** emitPoolBoosterCreated(address,address,uint8) */
export const emitPoolBoosterCreated = func('0x591290e8', {
    _poolBoosterAddress: address,
    _ammPoolAddress: address,
    _boosterType: uint8,
})
export type EmitPoolBoosterCreatedParams = FunctionArguments<typeof emitPoolBoosterCreated>
export type EmitPoolBoosterCreatedReturn = FunctionReturn<typeof emitPoolBoosterCreated>

/** emitPoolBoosterRemoved(address) */
export const emitPoolBoosterRemoved = func('0x07025229', {
    _poolBoosterAddress: address,
})
export type EmitPoolBoosterRemovedParams = FunctionArguments<typeof emitPoolBoosterRemoved>
export type EmitPoolBoosterRemovedReturn = FunctionReturn<typeof emitPoolBoosterRemoved>

/** factories(uint256) */
export const factories = func('0x672383c4', {
    _0: uint256,
}, address)
export type FactoriesParams = FunctionArguments<typeof factories>
export type FactoriesReturn = FunctionReturn<typeof factories>

/** getAllFactories() */
export const getAllFactories = func('0xa0750598', {}, array(address))
export type GetAllFactoriesParams = FunctionArguments<typeof getAllFactories>
export type GetAllFactoriesReturn = FunctionReturn<typeof getAllFactories>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** isApprovedFactory(address) */
export const isApprovedFactory = func('0x26cf3739', {
    _factoryAddress: address,
}, bool)
export type IsApprovedFactoryParams = FunctionArguments<typeof isApprovedFactory>
export type IsApprovedFactoryReturn = FunctionReturn<typeof isApprovedFactory>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** removeFactory(address) */
export const removeFactory = func('0x4b37c73f', {
    _factoryAddress: address,
})
export type RemoveFactoryParams = FunctionArguments<typeof removeFactory>
export type RemoveFactoryReturn = FunctionReturn<typeof removeFactory>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>
