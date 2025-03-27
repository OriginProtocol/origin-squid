import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    DefaultCommunityFee: event("0x6b5c342391f543846fce47a925e7eba910f7bec232b08633308ca93fdd0fdf0d", "DefaultCommunityFee(uint16)", {"newDefaultCommunityFee": p.uint16}),
    DefaultFee: event("0xddc0c6f0b581e0d51bfe90ff138e4a548f94515c4dbcb12f5e98fdf0f7503983", "DefaultFee(uint16)", {"newDefaultFee": p.uint16}),
    DefaultPluginFactory: event("0x5e38e259ec1f8a38b98fc65a27e266bb9cc87c76eb8c96c957450d1cff4591ef", "DefaultPluginFactory(address)", {"defaultPluginFactoryAddress": p.address}),
    DefaultTickspacing: event("0x7d7979096f943139ebee59f01c077a0f0766d06c40c86d596f23ed2561547cce", "DefaultTickspacing(int24)", {"newDefaultTickspacing": p.int24}),
    OwnershipTransferStarted: event("0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700", "OwnershipTransferStarted(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Pool: event("0x91ccaa7a278130b65168c3a0c8d3bcae84cf5e43704342bd3ec0b59e59c036db", "Pool(address,address,address)", {"token0": indexed(p.address), "token1": indexed(p.address), "pool": p.address}),
    RenounceOwnershipFinish: event("0xa24203c457ce43a097fa0c491fc9cf5e0a893af87a5e0a9785f29491deb11e23", "RenounceOwnershipFinish(uint256)", {"timestamp": p.uint256}),
    RenounceOwnershipStart: event("0xcd60f5d54996130c21c3f063279b39230bcbafc12f763a1ac1dfaec2e9b61d29", "RenounceOwnershipStart(uint256,uint256)", {"timestamp": p.uint256, "finishTimestamp": p.uint256}),
    RenounceOwnershipStop: event("0xa2492902a0a1d28dc73e6ab22e473239ef077bb7bc8174dc7dab9fc0818e7135", "RenounceOwnershipStop(uint256)", {"timestamp": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    VaultFactory: event("0xa006ea05a14783821b0248e75d2342cd1681b07509e10a0f08487b080c29dea8", "VaultFactory(address)", {"newVaultFactory": p.address}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    POOLS_ADMINISTRATOR_ROLE: viewFun("0xb500a48b", "POOLS_ADMINISTRATOR_ROLE()", {}, p.bytes32),
    POOL_INIT_CODE_HASH: viewFun("0xdc6fd8ab", "POOL_INIT_CODE_HASH()", {}, p.bytes32),
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    computePoolAddress: viewFun("0xd8ed2241", "computePoolAddress(address,address)", {"token0": p.address, "token1": p.address}, p.address),
    createPool: fun("0xe3433615", "createPool(address,address)", {"tokenA": p.address, "tokenB": p.address}, p.address),
    defaultCommunityFee: viewFun("0x2f8a39dd", "defaultCommunityFee()", {}, p.uint16),
    defaultConfigurationForPool: viewFun("0x82b13d8d", "defaultConfigurationForPool(address)", {"pool": p.address}, {"communityFee": p.uint16, "tickSpacing": p.int24, "fee": p.uint16, "communityVault": p.address}),
    defaultFee: viewFun("0x5a6c72d0", "defaultFee()", {}, p.uint16),
    defaultPluginFactory: viewFun("0xd0ad2792", "defaultPluginFactory()", {}, p.address),
    defaultTickspacing: viewFun("0x29bc3446", "defaultTickspacing()", {}, p.int24),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    getRoleMember: viewFun("0x9010d07c", "getRoleMember(bytes32,uint256)", {"role": p.bytes32, "index": p.uint256}, p.address),
    getRoleMemberCount: viewFun("0xca15c873", "getRoleMemberCount(bytes32)", {"role": p.bytes32}, p.uint256),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    hasRoleOrOwner: viewFun("0xe8ae2b69", "hasRoleOrOwner(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pendingOwner: viewFun("0xe30c3978", "pendingOwner()", {}, p.address),
    poolByPair: viewFun("0xd9a641e1", "poolByPair(address,address)", {"_0": p.address, "_1": p.address}, p.address),
    poolDeployer: viewFun("0x3119049a", "poolDeployer()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    renounceOwnershipStartTimestamp: viewFun("0x084bfff9", "renounceOwnershipStartTimestamp()", {}, p.uint256),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setDefaultCommunityFee: fun("0x8d5a8711", "setDefaultCommunityFee(uint16)", {"newDefaultCommunityFee": p.uint16}, ),
    setDefaultFee: fun("0x77326584", "setDefaultFee(uint16)", {"newDefaultFee": p.uint16}, ),
    setDefaultPluginFactory: fun("0x2939dd97", "setDefaultPluginFactory(address)", {"newDefaultPluginFactory": p.address}, ),
    setDefaultTickspacing: fun("0xf09489ac", "setDefaultTickspacing(int24)", {"newDefaultTickspacing": p.int24}, ),
    setVaultFactory: fun("0x3ea7fbdb", "setVaultFactory(address)", {"newVaultFactory": p.address}, ),
    startRenounceOwnership: fun("0x469388c4", "startRenounceOwnership()", {}, ),
    stopRenounceOwnership: fun("0x238a1d74", "stopRenounceOwnership()", {}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    vaultFactory: viewFun("0xd8a06f73", "vaultFactory()", {}, p.address),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    POOLS_ADMINISTRATOR_ROLE() {
        return this.eth_call(functions.POOLS_ADMINISTRATOR_ROLE, {})
    }

    POOL_INIT_CODE_HASH() {
        return this.eth_call(functions.POOL_INIT_CODE_HASH, {})
    }

    computePoolAddress(token0: ComputePoolAddressParams["token0"], token1: ComputePoolAddressParams["token1"]) {
        return this.eth_call(functions.computePoolAddress, {token0, token1})
    }

    defaultCommunityFee() {
        return this.eth_call(functions.defaultCommunityFee, {})
    }

    defaultConfigurationForPool(pool: DefaultConfigurationForPoolParams["pool"]) {
        return this.eth_call(functions.defaultConfigurationForPool, {pool})
    }

    defaultFee() {
        return this.eth_call(functions.defaultFee, {})
    }

    defaultPluginFactory() {
        return this.eth_call(functions.defaultPluginFactory, {})
    }

    defaultTickspacing() {
        return this.eth_call(functions.defaultTickspacing, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    getRoleMember(role: GetRoleMemberParams["role"], index: GetRoleMemberParams["index"]) {
        return this.eth_call(functions.getRoleMember, {role, index})
    }

    getRoleMemberCount(role: GetRoleMemberCountParams["role"]) {
        return this.eth_call(functions.getRoleMemberCount, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    hasRoleOrOwner(role: HasRoleOrOwnerParams["role"], account: HasRoleOrOwnerParams["account"]) {
        return this.eth_call(functions.hasRoleOrOwner, {role, account})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingOwner() {
        return this.eth_call(functions.pendingOwner, {})
    }

    poolByPair(_0: PoolByPairParams["_0"], _1: PoolByPairParams["_1"]) {
        return this.eth_call(functions.poolByPair, {_0, _1})
    }

    poolDeployer() {
        return this.eth_call(functions.poolDeployer, {})
    }

    renounceOwnershipStartTimestamp() {
        return this.eth_call(functions.renounceOwnershipStartTimestamp, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    vaultFactory() {
        return this.eth_call(functions.vaultFactory, {})
    }
}

/// Event types
export type DefaultCommunityFeeEventArgs = EParams<typeof events.DefaultCommunityFee>
export type DefaultFeeEventArgs = EParams<typeof events.DefaultFee>
export type DefaultPluginFactoryEventArgs = EParams<typeof events.DefaultPluginFactory>
export type DefaultTickspacingEventArgs = EParams<typeof events.DefaultTickspacing>
export type OwnershipTransferStartedEventArgs = EParams<typeof events.OwnershipTransferStarted>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PoolEventArgs = EParams<typeof events.Pool>
export type RenounceOwnershipFinishEventArgs = EParams<typeof events.RenounceOwnershipFinish>
export type RenounceOwnershipStartEventArgs = EParams<typeof events.RenounceOwnershipStart>
export type RenounceOwnershipStopEventArgs = EParams<typeof events.RenounceOwnershipStop>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type VaultFactoryEventArgs = EParams<typeof events.VaultFactory>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type POOLS_ADMINISTRATOR_ROLEParams = FunctionArguments<typeof functions.POOLS_ADMINISTRATOR_ROLE>
export type POOLS_ADMINISTRATOR_ROLEReturn = FunctionReturn<typeof functions.POOLS_ADMINISTRATOR_ROLE>

export type POOL_INIT_CODE_HASHParams = FunctionArguments<typeof functions.POOL_INIT_CODE_HASH>
export type POOL_INIT_CODE_HASHReturn = FunctionReturn<typeof functions.POOL_INIT_CODE_HASH>

export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type ComputePoolAddressParams = FunctionArguments<typeof functions.computePoolAddress>
export type ComputePoolAddressReturn = FunctionReturn<typeof functions.computePoolAddress>

export type CreatePoolParams = FunctionArguments<typeof functions.createPool>
export type CreatePoolReturn = FunctionReturn<typeof functions.createPool>

export type DefaultCommunityFeeParams = FunctionArguments<typeof functions.defaultCommunityFee>
export type DefaultCommunityFeeReturn = FunctionReturn<typeof functions.defaultCommunityFee>

export type DefaultConfigurationForPoolParams = FunctionArguments<typeof functions.defaultConfigurationForPool>
export type DefaultConfigurationForPoolReturn = FunctionReturn<typeof functions.defaultConfigurationForPool>

export type DefaultFeeParams = FunctionArguments<typeof functions.defaultFee>
export type DefaultFeeReturn = FunctionReturn<typeof functions.defaultFee>

export type DefaultPluginFactoryParams = FunctionArguments<typeof functions.defaultPluginFactory>
export type DefaultPluginFactoryReturn = FunctionReturn<typeof functions.defaultPluginFactory>

export type DefaultTickspacingParams = FunctionArguments<typeof functions.defaultTickspacing>
export type DefaultTickspacingReturn = FunctionReturn<typeof functions.defaultTickspacing>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetRoleMemberParams = FunctionArguments<typeof functions.getRoleMember>
export type GetRoleMemberReturn = FunctionReturn<typeof functions.getRoleMember>

export type GetRoleMemberCountParams = FunctionArguments<typeof functions.getRoleMemberCount>
export type GetRoleMemberCountReturn = FunctionReturn<typeof functions.getRoleMemberCount>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type HasRoleOrOwnerParams = FunctionArguments<typeof functions.hasRoleOrOwner>
export type HasRoleOrOwnerReturn = FunctionReturn<typeof functions.hasRoleOrOwner>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingOwnerParams = FunctionArguments<typeof functions.pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof functions.pendingOwner>

export type PoolByPairParams = FunctionArguments<typeof functions.poolByPair>
export type PoolByPairReturn = FunctionReturn<typeof functions.poolByPair>

export type PoolDeployerParams = FunctionArguments<typeof functions.poolDeployer>
export type PoolDeployerReturn = FunctionReturn<typeof functions.poolDeployer>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RenounceOwnershipStartTimestampParams = FunctionArguments<typeof functions.renounceOwnershipStartTimestamp>
export type RenounceOwnershipStartTimestampReturn = FunctionReturn<typeof functions.renounceOwnershipStartTimestamp>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetDefaultCommunityFeeParams = FunctionArguments<typeof functions.setDefaultCommunityFee>
export type SetDefaultCommunityFeeReturn = FunctionReturn<typeof functions.setDefaultCommunityFee>

export type SetDefaultFeeParams = FunctionArguments<typeof functions.setDefaultFee>
export type SetDefaultFeeReturn = FunctionReturn<typeof functions.setDefaultFee>

export type SetDefaultPluginFactoryParams = FunctionArguments<typeof functions.setDefaultPluginFactory>
export type SetDefaultPluginFactoryReturn = FunctionReturn<typeof functions.setDefaultPluginFactory>

export type SetDefaultTickspacingParams = FunctionArguments<typeof functions.setDefaultTickspacing>
export type SetDefaultTickspacingReturn = FunctionReturn<typeof functions.setDefaultTickspacing>

export type SetVaultFactoryParams = FunctionArguments<typeof functions.setVaultFactory>
export type SetVaultFactoryReturn = FunctionReturn<typeof functions.setVaultFactory>

export type StartRenounceOwnershipParams = FunctionArguments<typeof functions.startRenounceOwnership>
export type StartRenounceOwnershipReturn = FunctionReturn<typeof functions.startRenounceOwnership>

export type StopRenounceOwnershipParams = FunctionArguments<typeof functions.stopRenounceOwnership>
export type StopRenounceOwnershipReturn = FunctionReturn<typeof functions.stopRenounceOwnership>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type VaultFactoryParams = FunctionArguments<typeof functions.vaultFactory>
export type VaultFactoryReturn = FunctionReturn<typeof functions.vaultFactory>

