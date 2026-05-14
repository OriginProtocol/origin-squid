import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** Deposit(address,address,uint256,uint256) */
export const Deposit = event('0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7', {
    caller: indexed(address),
    owner: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

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

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>

/** Withdraw(address,address,address,uint256,uint256) */
export const Withdraw = event('0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db', {
    caller: indexed(address),
    receiver: indexed(address),
    owner: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type WithdrawEventArgs = EParams<typeof Withdraw>
