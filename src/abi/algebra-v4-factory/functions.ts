import { address, bool, bytes32, bytes4, int24, struct, uint16, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DEFAULT_ADMIN_ROLE() */
export const DEFAULT_ADMIN_ROLE = func('0xa217fddf', {}, bytes32)
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof DEFAULT_ADMIN_ROLE>

/** POOLS_ADMINISTRATOR_ROLE() */
export const POOLS_ADMINISTRATOR_ROLE = func('0xb500a48b', {}, bytes32)
export type POOLS_ADMINISTRATOR_ROLEParams = FunctionArguments<typeof POOLS_ADMINISTRATOR_ROLE>
export type POOLS_ADMINISTRATOR_ROLEReturn = FunctionReturn<typeof POOLS_ADMINISTRATOR_ROLE>

/** POOL_INIT_CODE_HASH() */
export const POOL_INIT_CODE_HASH = func('0xdc6fd8ab', {}, bytes32)
export type POOL_INIT_CODE_HASHParams = FunctionArguments<typeof POOL_INIT_CODE_HASH>
export type POOL_INIT_CODE_HASHReturn = FunctionReturn<typeof POOL_INIT_CODE_HASH>

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** computePoolAddress(address,address) */
export const computePoolAddress = func('0xd8ed2241', {
    token0: address,
    token1: address,
}, address)
export type ComputePoolAddressParams = FunctionArguments<typeof computePoolAddress>
export type ComputePoolAddressReturn = FunctionReturn<typeof computePoolAddress>

/** createPool(address,address) */
export const createPool = func('0xe3433615', {
    tokenA: address,
    tokenB: address,
}, address)
export type CreatePoolParams = FunctionArguments<typeof createPool>
export type CreatePoolReturn = FunctionReturn<typeof createPool>

/** defaultCommunityFee() */
export const defaultCommunityFee = func('0x2f8a39dd', {}, uint16)
export type DefaultCommunityFeeParams = FunctionArguments<typeof defaultCommunityFee>
export type DefaultCommunityFeeReturn = FunctionReturn<typeof defaultCommunityFee>

/** defaultConfigurationForPool(address) */
export const defaultConfigurationForPool = func('0x82b13d8d', {
    pool: address,
}, struct({
    communityFee: uint16,
    tickSpacing: int24,
    fee: uint16,
    communityVault: address,
}))
export type DefaultConfigurationForPoolParams = FunctionArguments<typeof defaultConfigurationForPool>
export type DefaultConfigurationForPoolReturn = FunctionReturn<typeof defaultConfigurationForPool>

/** defaultFee() */
export const defaultFee = func('0x5a6c72d0', {}, uint16)
export type DefaultFeeParams = FunctionArguments<typeof defaultFee>
export type DefaultFeeReturn = FunctionReturn<typeof defaultFee>

/** defaultPluginFactory() */
export const defaultPluginFactory = func('0xd0ad2792', {}, address)
export type DefaultPluginFactoryParams = FunctionArguments<typeof defaultPluginFactory>
export type DefaultPluginFactoryReturn = FunctionReturn<typeof defaultPluginFactory>

/** defaultTickspacing() */
export const defaultTickspacing = func('0x29bc3446', {}, int24)
export type DefaultTickspacingParams = FunctionArguments<typeof defaultTickspacing>
export type DefaultTickspacingReturn = FunctionReturn<typeof defaultTickspacing>

/** getRoleAdmin(bytes32) */
export const getRoleAdmin = func('0x248a9ca3', {
    role: bytes32,
}, bytes32)
export type GetRoleAdminParams = FunctionArguments<typeof getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof getRoleAdmin>

/** getRoleMember(bytes32,uint256) */
export const getRoleMember = func('0x9010d07c', {
    role: bytes32,
    index: uint256,
}, address)
export type GetRoleMemberParams = FunctionArguments<typeof getRoleMember>
export type GetRoleMemberReturn = FunctionReturn<typeof getRoleMember>

/** getRoleMemberCount(bytes32) */
export const getRoleMemberCount = func('0xca15c873', {
    role: bytes32,
}, uint256)
export type GetRoleMemberCountParams = FunctionArguments<typeof getRoleMemberCount>
export type GetRoleMemberCountReturn = FunctionReturn<typeof getRoleMemberCount>

/** grantRole(bytes32,address) */
export const grantRole = func('0x2f2ff15d', {
    role: bytes32,
    account: address,
})
export type GrantRoleParams = FunctionArguments<typeof grantRole>
export type GrantRoleReturn = FunctionReturn<typeof grantRole>

/** hasRole(bytes32,address) */
export const hasRole = func('0x91d14854', {
    role: bytes32,
    account: address,
}, bool)
export type HasRoleParams = FunctionArguments<typeof hasRole>
export type HasRoleReturn = FunctionReturn<typeof hasRole>

/** hasRoleOrOwner(bytes32,address) */
export const hasRoleOrOwner = func('0xe8ae2b69', {
    role: bytes32,
    account: address,
}, bool)
export type HasRoleOrOwnerParams = FunctionArguments<typeof hasRoleOrOwner>
export type HasRoleOrOwnerReturn = FunctionReturn<typeof hasRoleOrOwner>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** pendingOwner() */
export const pendingOwner = func('0xe30c3978', {}, address)
export type PendingOwnerParams = FunctionArguments<typeof pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof pendingOwner>

/** poolByPair(address,address) */
export const poolByPair = func('0xd9a641e1', {
    _0: address,
    _1: address,
}, address)
export type PoolByPairParams = FunctionArguments<typeof poolByPair>
export type PoolByPairReturn = FunctionReturn<typeof poolByPair>

/** poolDeployer() */
export const poolDeployer = func('0x3119049a', {}, address)
export type PoolDeployerParams = FunctionArguments<typeof poolDeployer>
export type PoolDeployerReturn = FunctionReturn<typeof poolDeployer>

/** renounceOwnership() */
export const renounceOwnership = func('0x715018a6', {})
export type RenounceOwnershipParams = FunctionArguments<typeof renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof renounceOwnership>

/** renounceOwnershipStartTimestamp() */
export const renounceOwnershipStartTimestamp = func('0x084bfff9', {}, uint256)
export type RenounceOwnershipStartTimestampParams = FunctionArguments<typeof renounceOwnershipStartTimestamp>
export type RenounceOwnershipStartTimestampReturn = FunctionReturn<typeof renounceOwnershipStartTimestamp>

/** renounceRole(bytes32,address) */
export const renounceRole = func('0x36568abe', {
    role: bytes32,
    account: address,
})
export type RenounceRoleParams = FunctionArguments<typeof renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof renounceRole>

/** revokeRole(bytes32,address) */
export const revokeRole = func('0xd547741f', {
    role: bytes32,
    account: address,
})
export type RevokeRoleParams = FunctionArguments<typeof revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof revokeRole>

/** setDefaultCommunityFee(uint16) */
export const setDefaultCommunityFee = func('0x8d5a8711', {
    newDefaultCommunityFee: uint16,
})
export type SetDefaultCommunityFeeParams = FunctionArguments<typeof setDefaultCommunityFee>
export type SetDefaultCommunityFeeReturn = FunctionReturn<typeof setDefaultCommunityFee>

/** setDefaultFee(uint16) */
export const setDefaultFee = func('0x77326584', {
    newDefaultFee: uint16,
})
export type SetDefaultFeeParams = FunctionArguments<typeof setDefaultFee>
export type SetDefaultFeeReturn = FunctionReturn<typeof setDefaultFee>

/** setDefaultPluginFactory(address) */
export const setDefaultPluginFactory = func('0x2939dd97', {
    newDefaultPluginFactory: address,
})
export type SetDefaultPluginFactoryParams = FunctionArguments<typeof setDefaultPluginFactory>
export type SetDefaultPluginFactoryReturn = FunctionReturn<typeof setDefaultPluginFactory>

/** setDefaultTickspacing(int24) */
export const setDefaultTickspacing = func('0xf09489ac', {
    newDefaultTickspacing: int24,
})
export type SetDefaultTickspacingParams = FunctionArguments<typeof setDefaultTickspacing>
export type SetDefaultTickspacingReturn = FunctionReturn<typeof setDefaultTickspacing>

/** setVaultFactory(address) */
export const setVaultFactory = func('0x3ea7fbdb', {
    newVaultFactory: address,
})
export type SetVaultFactoryParams = FunctionArguments<typeof setVaultFactory>
export type SetVaultFactoryReturn = FunctionReturn<typeof setVaultFactory>

/** startRenounceOwnership() */
export const startRenounceOwnership = func('0x469388c4', {})
export type StartRenounceOwnershipParams = FunctionArguments<typeof startRenounceOwnership>
export type StartRenounceOwnershipReturn = FunctionReturn<typeof startRenounceOwnership>

/** stopRenounceOwnership() */
export const stopRenounceOwnership = func('0x238a1d74', {})
export type StopRenounceOwnershipParams = FunctionArguments<typeof stopRenounceOwnership>
export type StopRenounceOwnershipReturn = FunctionReturn<typeof stopRenounceOwnership>

/** supportsInterface(bytes4) */
export const supportsInterface = func('0x01ffc9a7', {
    interfaceId: bytes4,
}, bool)
export type SupportsInterfaceParams = FunctionArguments<typeof supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof supportsInterface>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    newOwner: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** vaultFactory() */
export const vaultFactory = func('0xd8a06f73', {}, address)
export type VaultFactoryParams = FunctionArguments<typeof vaultFactory>
export type VaultFactoryReturn = FunctionReturn<typeof vaultFactory>
