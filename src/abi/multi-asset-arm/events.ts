import { address, bool, int256, uint256, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** ARMBufferUpdated(uint256) */
export const ARMBufferUpdated = event('0x29128dbcf994e1ddc09cdbce01c287bb3f6b0cf4dd3c98174cadbbaf67bc22d7', {
    armBuffer: uint256,
})
export type ARMBufferUpdatedEventArgs = EParams<typeof ARMBufferUpdated>

/** ActiveMarketUpdated(address) */
export const ActiveMarketUpdated = event('0xe9f5fe520e5763f721d470ecb21b23763a3b0b9e720070111b1b935c1107b065', {
    market: indexed(address),
})
export type ActiveMarketUpdatedEventArgs = EParams<typeof ActiveMarketUpdated>

/** AdminChanged(address,address) */
export const AdminChanged = event('0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f', {
    previousAdmin: address,
    newAdmin: address,
})
export type AdminChangedEventArgs = EParams<typeof AdminChanged>

/** Allocated(address,int256,int256) */
export const Allocated = event('0x0538e1fc8a5bd2f2ae0c40c0a54b4208673263b92c883fe270768a5151346dfd', {
    market: indexed(address),
    targetLiquidityDelta: int256,
    actualLiquidityDelta: int256,
})
export type AllocatedEventArgs = EParams<typeof Allocated>

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** BaseAssetAdded(address,address,uint256,uint256,uint256,bool) */
export const BaseAssetAdded = event('0x7544a75b388eb4ab5daaa0429409163b9a80e2dd0bafa8a1c0d5ae0bda352d65', {
    asset: indexed(address),
    adapter: indexed(address),
    buyPrice: uint256,
    sellPrice: uint256,
    crossPrice: uint256,
    peggedToLiquidityAsset: bool,
})
export type BaseAssetAddedEventArgs = EParams<typeof BaseAssetAdded>

/** CapManagerUpdated(address) */
export const CapManagerUpdated = event('0xb8fd9afc34c38fcd13b9a3b7646482eb1fddcefb40af2c70609972816eba3208', {
    capManager: indexed(address),
})
export type CapManagerUpdatedEventArgs = EParams<typeof CapManagerUpdated>

/** CrossPriceUpdated(address,uint256) */
export const CrossPriceUpdated = event('0x7abb537bd346e0540bd632cc85a1ebde145775e3c31ced362761ff2fe8241cb9', {
    asset: indexed(address),
    crossPrice: uint256,
})
export type CrossPriceUpdatedEventArgs = EParams<typeof CrossPriceUpdated>

/** Deposit(address,uint256,uint256) */
export const Deposit = event('0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15', {
    owner: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** FeeCollected(address,uint256) */
export const FeeCollected = event('0x06c5efeff5c320943d265dc4e5f1af95ad523555ce0c1957e367dda5514572df', {
    feeCollector: indexed(address),
    fee: uint256,
})
export type FeeCollectedEventArgs = EParams<typeof FeeCollected>

/** FeeCollectorUpdated(address) */
export const FeeCollectorUpdated = event('0xe5693914d19c789bdee50a362998c0bc8d035a835f9871da5d51152f0582c34f', {
    newFeeCollector: indexed(address),
})
export type FeeCollectorUpdatedEventArgs = EParams<typeof FeeCollectorUpdated>

/** FeeUpdated(uint256) */
export const FeeUpdated = event('0x8c4d35e54a3f2ef1134138fd8ea3daee6a3c89e10d2665996babdf70261e2c76', {
    fee: uint256,
})
export type FeeUpdatedEventArgs = EParams<typeof FeeUpdated>

/** Initialized(uint64) */
export const Initialized = event('0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2', {
    version: uint64,
})
export type InitializedEventArgs = EParams<typeof Initialized>

/** MarketAdded(address) */
export const MarketAdded = event('0xbc600b1f03d316c479b49930c28e328809316458d5b5dacbb7419df5f6f89647', {
    market: indexed(address),
})
export type MarketAddedEventArgs = EParams<typeof MarketAdded>

/** MarketRemoved(address) */
export const MarketRemoved = event('0x59d7b1e52008dc342c9421dadfc773114b914a65682a4e4b53cf60a970df0d77', {
    market: indexed(address),
})
export type MarketRemovedEventArgs = EParams<typeof MarketRemoved>

/** OperatorChanged(address) */
export const OperatorChanged = event('0x4721129e0e676ed6a92909bb24e853ccdd63ad72280cc2e974e38e480e0e6e54', {
    newAdmin: address,
})
export type OperatorChangedEventArgs = EParams<typeof OperatorChanged>

/** Paused(address) */
export const Paused = event('0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258', {
    account: indexed(address),
})
export type PausedEventArgs = EParams<typeof Paused>

/** RedeemClaimed(address,uint256,uint256) */
export const RedeemClaimed = event('0x36dd2c9b55f12509e3b5f4f4d765ddefc2776a28018b18da2335cf2ab93bb268', {
    withdrawer: indexed(address),
    requestId: indexed(uint256),
    assets: uint256,
})
export type RedeemClaimedEventArgs = EParams<typeof RedeemClaimed>

/** RedeemRequested(address,uint256,uint256,uint256,uint256) */
export const RedeemRequested = event('0xc04c86cfd81036557541f9c68971ace59cbc9057ecab7d48874a6177ad117f4f', {
    withdrawer: indexed(address),
    requestId: indexed(uint256),
    assets: uint256,
    queued: uint256,
    claimTimestamp: uint256,
})
export type RedeemRequestedEventArgs = EParams<typeof RedeemRequested>

/** TraderateChanged(address,uint256,uint256,uint256,uint256) */
export const TraderateChanged = event('0x778ebbe9f96685bd519458d016cf8c56446b9054726f7448a2faa8ccce6ab452', {
    asset: indexed(address),
    buyPrice: uint256,
    sellPrice: uint256,
    buyLiquidityRemaining: uint256,
    sellLiquidityRemaining: uint256,
})
export type TraderateChangedEventArgs = EParams<typeof TraderateChanged>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>

/** Unpaused(address) */
export const Unpaused = event('0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa', {
    account: indexed(address),
})
export type UnpausedEventArgs = EParams<typeof Unpaused>
