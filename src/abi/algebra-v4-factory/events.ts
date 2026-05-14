import { address, bytes32, int24, uint16, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** DefaultCommunityFee(uint16) */
export const DefaultCommunityFee = event('0x6b5c342391f543846fce47a925e7eba910f7bec232b08633308ca93fdd0fdf0d', {
    newDefaultCommunityFee: uint16,
})
export type DefaultCommunityFeeEventArgs = EParams<typeof DefaultCommunityFee>

/** DefaultFee(uint16) */
export const DefaultFee = event('0xddc0c6f0b581e0d51bfe90ff138e4a548f94515c4dbcb12f5e98fdf0f7503983', {
    newDefaultFee: uint16,
})
export type DefaultFeeEventArgs = EParams<typeof DefaultFee>

/** DefaultPluginFactory(address) */
export const DefaultPluginFactory = event('0x5e38e259ec1f8a38b98fc65a27e266bb9cc87c76eb8c96c957450d1cff4591ef', {
    defaultPluginFactoryAddress: address,
})
export type DefaultPluginFactoryEventArgs = EParams<typeof DefaultPluginFactory>

/** DefaultTickspacing(int24) */
export const DefaultTickspacing = event('0x7d7979096f943139ebee59f01c077a0f0766d06c40c86d596f23ed2561547cce', {
    newDefaultTickspacing: int24,
})
export type DefaultTickspacingEventArgs = EParams<typeof DefaultTickspacing>

/** OwnershipTransferStarted(address,address) */
export const OwnershipTransferStarted = event('0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700', {
    previousOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnershipTransferStartedEventArgs = EParams<typeof OwnershipTransferStarted>

/** OwnershipTransferred(address,address) */
export const OwnershipTransferred = event('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0', {
    previousOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnershipTransferredEventArgs = EParams<typeof OwnershipTransferred>

/** Pool(address,address,address) */
export const Pool = event('0x91ccaa7a278130b65168c3a0c8d3bcae84cf5e43704342bd3ec0b59e59c036db', {
    token0: indexed(address),
    token1: indexed(address),
    pool: address,
})
export type PoolEventArgs = EParams<typeof Pool>

/** RenounceOwnershipFinish(uint256) */
export const RenounceOwnershipFinish = event('0xa24203c457ce43a097fa0c491fc9cf5e0a893af87a5e0a9785f29491deb11e23', {
    timestamp: uint256,
})
export type RenounceOwnershipFinishEventArgs = EParams<typeof RenounceOwnershipFinish>

/** RenounceOwnershipStart(uint256,uint256) */
export const RenounceOwnershipStart = event('0xcd60f5d54996130c21c3f063279b39230bcbafc12f763a1ac1dfaec2e9b61d29', {
    timestamp: uint256,
    finishTimestamp: uint256,
})
export type RenounceOwnershipStartEventArgs = EParams<typeof RenounceOwnershipStart>

/** RenounceOwnershipStop(uint256) */
export const RenounceOwnershipStop = event('0xa2492902a0a1d28dc73e6ab22e473239ef077bb7bc8174dc7dab9fc0818e7135', {
    timestamp: uint256,
})
export type RenounceOwnershipStopEventArgs = EParams<typeof RenounceOwnershipStop>

/** RoleAdminChanged(bytes32,bytes32,bytes32) */
export const RoleAdminChanged = event('0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff', {
    role: indexed(bytes32),
    previousAdminRole: indexed(bytes32),
    newAdminRole: indexed(bytes32),
})
export type RoleAdminChangedEventArgs = EParams<typeof RoleAdminChanged>

/** RoleGranted(bytes32,address,address) */
export const RoleGranted = event('0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d', {
    role: indexed(bytes32),
    account: indexed(address),
    sender: indexed(address),
})
export type RoleGrantedEventArgs = EParams<typeof RoleGranted>

/** RoleRevoked(bytes32,address,address) */
export const RoleRevoked = event('0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b', {
    role: indexed(bytes32),
    account: indexed(address),
    sender: indexed(address),
})
export type RoleRevokedEventArgs = EParams<typeof RoleRevoked>

/** VaultFactory(address) */
export const VaultFactory = event('0xa006ea05a14783821b0248e75d2342cd1681b07509e10a0f08487b080c29dea8', {
    newVaultFactory: address,
})
export type VaultFactoryEventArgs = EParams<typeof VaultFactory>
