import { address, bool, bytes32, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** FeeRecipientSet(address,address) */
export const FeeRecipientSet = event('0x15d80a013f22151bc7246e3bc132e12828cde19de98870475e3fa70840152721', {
    oldRecipient: address,
    newRecipient: address,
})
export type FeeRecipientSetEventArgs = EParams<typeof FeeRecipientSet>

/** FlashLoanFeeSet(uint256,uint256) */
export const FlashLoanFeeSet = event('0x5c34e91c94c78b662a45d0bd4a25a4e32c584c54a45a76e4a4d43be27ba40e50', {
    oldFlashLoanFee: uint256,
    newFlashLoanFee: uint256,
})
export type FlashLoanFeeSetEventArgs = EParams<typeof FlashLoanFeeSet>

/** LBPairCreated(address,address,uint256,address,uint256) */
export const LBPairCreated = event('0x2c8d104b27c6b7f4492017a6f5cf3803043688934ebcaa6a03540beeaf976aff', {
    tokenX: indexed(address),
    tokenY: indexed(address),
    binStep: indexed(uint256),
    LBPair: address,
    pid: uint256,
})
export type LBPairCreatedEventArgs = EParams<typeof LBPairCreated>

/** LBPairIgnoredStateChanged(address,bool) */
export const LBPairIgnoredStateChanged = event('0x44cf35361c9ff3c8c1397ec6410d5495cc481feaef35c9af11da1a637107de4f', {
    LBPair: indexed(address),
    ignored: bool,
})
export type LBPairIgnoredStateChangedEventArgs = EParams<typeof LBPairIgnoredStateChanged>

/** LBPairImplementationSet(address,address) */
export const LBPairImplementationSet = event('0x900d0e3d359f50e4f923ecdc06b401e07dbb9f485e17b07bcfc91a13000b277e', {
    oldLBPairImplementation: address,
    LBPairImplementation: address,
})
export type LBPairImplementationSetEventArgs = EParams<typeof LBPairImplementationSet>

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

/** PresetOpenStateChanged(uint256,bool) */
export const PresetOpenStateChanged = event('0x58a8b6a02b964cca2712e5a71d7b0d564a56b4a0f573b4c47f389341ade14cfd', {
    binStep: indexed(uint256),
    isOpen: indexed(bool),
})
export type PresetOpenStateChangedEventArgs = EParams<typeof PresetOpenStateChanged>

/** PresetRemoved(uint256) */
export const PresetRemoved = event('0xdd86b848bb56ff540caa68683fa467d0e7eb5f8b2d44e4ee435742eeeae9be13', {
    binStep: indexed(uint256),
})
export type PresetRemovedEventArgs = EParams<typeof PresetRemoved>

/** PresetSet(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256) */
export const PresetSet = event('0x839844a256a87f87c9c835117d9a1c40be013954064c937072acb32d36db6a28', {
    binStep: indexed(uint256),
    baseFactor: uint256,
    filterPeriod: uint256,
    decayPeriod: uint256,
    reductionFactor: uint256,
    variableFeeControl: uint256,
    protocolShare: uint256,
    maxVolatilityAccumulator: uint256,
})
export type PresetSetEventArgs = EParams<typeof PresetSet>

/** QuoteAssetAdded(address) */
export const QuoteAssetAdded = event('0x84cc2115995684dcb0cd3d3a9565e3d32f075de81db70c8dc3a719b2a47af67e', {
    quoteAsset: indexed(address),
})
export type QuoteAssetAddedEventArgs = EParams<typeof QuoteAssetAdded>

/** QuoteAssetRemoved(address) */
export const QuoteAssetRemoved = event('0x0b767739217755d8af5a2ba75b181a19fa1750f8bb701f09311cb19a90140cb3', {
    quoteAsset: indexed(address),
})
export type QuoteAssetRemovedEventArgs = EParams<typeof QuoteAssetRemoved>

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
