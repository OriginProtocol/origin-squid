import { address, array, uint256, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AdminChanged(address,address) */
export const AdminChanged = event('0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f', {
    previousAdmin: address,
    newAdmin: address,
})
export type AdminChangedEventArgs = EParams<typeof AdminChanged>

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** CapManagerUpdated(address) */
export const CapManagerUpdated = event('0xb8fd9afc34c38fcd13b9a3b7646482eb1fddcefb40af2c70609972816eba3208', {
    capManager: indexed(address),
})
export type CapManagerUpdatedEventArgs = EParams<typeof CapManagerUpdated>

/** ClaimLidoWithdrawals(uint256[]) */
export const ClaimLidoWithdrawals = event('0xb7700a52345bff1ce6201d84f55fe81f2ea203b1b1bdc56a42571819aab2337a', {
    requestIds: array(uint256),
})
export type ClaimLidoWithdrawalsEventArgs = EParams<typeof ClaimLidoWithdrawals>

/** CrossPriceUpdated(uint256) */
export const CrossPriceUpdated = event('0x6f938e86fbdbe7829d0289b348cd9e528f2f17c705f469f4a17a0a2796e007d0', {
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

/** OperatorChanged(address) */
export const OperatorChanged = event('0x4721129e0e676ed6a92909bb24e853ccdd63ad72280cc2e974e38e480e0e6e54', {
    newAdmin: address,
})
export type OperatorChangedEventArgs = EParams<typeof OperatorChanged>

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

/** RequestLidoWithdrawals(uint256[],uint256[]) */
export const RequestLidoWithdrawals = event('0x3fdbeb02a84d41ebaf1c8edce1b73f1617e0d3675168dfeb8d86759c18782da4', {
    amounts: array(uint256),
    requestIds: array(uint256),
})
export type RequestLidoWithdrawalsEventArgs = EParams<typeof RequestLidoWithdrawals>

/** TraderateChanged(uint256,uint256) */
export const TraderateChanged = event('0xa2136948fd1e5333c2ee27c9e48848a560b693e6bbd18082623a738179ff2952', {
    traderate0: uint256,
    traderate1: uint256,
})
export type TraderateChangedEventArgs = EParams<typeof TraderateChanged>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>
