import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AccountRebasingDisabled(address) */
export const AccountRebasingDisabled = event('0x201ace89ad3f5ab7428b91989f6a50d1998791c7b94a0fa812fd64a57687165e', {
    account: address,
})
export type AccountRebasingDisabledEventArgs = EParams<typeof AccountRebasingDisabled>

/** AccountRebasingEnabled(address) */
export const AccountRebasingEnabled = event('0x19a249fa2050bac8314ac10e3ad420bd9825574bf750f58810c3c7adfc7b1c6f', {
    account: address,
})
export type AccountRebasingEnabledEventArgs = EParams<typeof AccountRebasingEnabled>

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** GovernorshipTransferred(address,address) */
export const GovernorshipTransferred = event('0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type GovernorshipTransferredEventArgs = EParams<typeof GovernorshipTransferred>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** TotalSupplyUpdatedHighres(uint256,uint256,uint256) */
export const TotalSupplyUpdatedHighres = event('0x41645eb819d3011b13f97696a8109d14bfcddfaca7d063ec0564d62a3e257235', {
    totalSupply: uint256,
    rebasingCredits: uint256,
    rebasingCreditsPerToken: uint256,
})
export type TotalSupplyUpdatedHighresEventArgs = EParams<typeof TotalSupplyUpdatedHighres>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>
