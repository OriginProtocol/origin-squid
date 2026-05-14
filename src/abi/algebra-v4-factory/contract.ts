import { ContractBase } from '../abi.support.js'
import { DEFAULT_ADMIN_ROLE, POOLS_ADMINISTRATOR_ROLE, POOL_INIT_CODE_HASH, computePoolAddress, createPool, defaultCommunityFee, defaultConfigurationForPool, defaultFee, defaultPluginFactory, defaultTickspacing, getRoleAdmin, getRoleMember, getRoleMemberCount, hasRole, hasRoleOrOwner, owner, pendingOwner, poolByPair, poolDeployer, renounceOwnershipStartTimestamp, supportsInterface, vaultFactory } from './functions.js'
import type { ComputePoolAddressParams, CreatePoolParams, DefaultConfigurationForPoolParams, GetRoleAdminParams, GetRoleMemberCountParams, GetRoleMemberParams, HasRoleOrOwnerParams, HasRoleParams, PoolByPairParams, SupportsInterfaceParams } from './functions.js'

export class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(DEFAULT_ADMIN_ROLE, {})
    }

    POOLS_ADMINISTRATOR_ROLE() {
        return this.eth_call(POOLS_ADMINISTRATOR_ROLE, {})
    }

    POOL_INIT_CODE_HASH() {
        return this.eth_call(POOL_INIT_CODE_HASH, {})
    }

    computePoolAddress(token0: ComputePoolAddressParams["token0"], token1: ComputePoolAddressParams["token1"]) {
        return this.eth_call(computePoolAddress, {token0, token1})
    }

    createPool(tokenA: CreatePoolParams["tokenA"], tokenB: CreatePoolParams["tokenB"]) {
        return this.eth_call(createPool, {tokenA, tokenB})
    }

    defaultCommunityFee() {
        return this.eth_call(defaultCommunityFee, {})
    }

    defaultConfigurationForPool(pool: DefaultConfigurationForPoolParams["pool"]) {
        return this.eth_call(defaultConfigurationForPool, {pool})
    }

    defaultFee() {
        return this.eth_call(defaultFee, {})
    }

    defaultPluginFactory() {
        return this.eth_call(defaultPluginFactory, {})
    }

    defaultTickspacing() {
        return this.eth_call(defaultTickspacing, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(getRoleAdmin, {role})
    }

    getRoleMember(role: GetRoleMemberParams["role"], index: GetRoleMemberParams["index"]) {
        return this.eth_call(getRoleMember, {role, index})
    }

    getRoleMemberCount(role: GetRoleMemberCountParams["role"]) {
        return this.eth_call(getRoleMemberCount, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(hasRole, {role, account})
    }

    hasRoleOrOwner(role: HasRoleOrOwnerParams["role"], account: HasRoleOrOwnerParams["account"]) {
        return this.eth_call(hasRoleOrOwner, {role, account})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    pendingOwner() {
        return this.eth_call(pendingOwner, {})
    }

    poolByPair(_0: PoolByPairParams["_0"], _1: PoolByPairParams["_1"]) {
        return this.eth_call(poolByPair, {_0, _1})
    }

    poolDeployer() {
        return this.eth_call(poolDeployer, {})
    }

    renounceOwnershipStartTimestamp() {
        return this.eth_call(renounceOwnershipStartTimestamp, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(supportsInterface, {interfaceId})
    }

    vaultFactory() {
        return this.eth_call(vaultFactory, {})
    }
}
