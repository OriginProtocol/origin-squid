import { address, uint256, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** GovernorshipTransferred(address,address) */
export const GovernorshipTransferred = event('0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type GovernorshipTransferredEventArgs = EParams<typeof GovernorshipTransferred>

/** OperatorChanged(address,address) */
export const OperatorChanged = event('0xd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c', {
    oldOperator: address,
    newOperator: address,
})
export type OperatorChangedEventArgs = EParams<typeof OperatorChanged>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** RewardTokenSwapped(address,address,uint8,uint256,uint256) */
export const RewardTokenSwapped = event('0xa861903141bc68b536d5048a576afcc645630e1b18a4296ef34cbd4d1407f709', {
    rewardToken: indexed(address),
    swappedInto: indexed(address),
    swapPlatform: uint8,
    amountIn: uint256,
    amountOut: uint256,
})
export type RewardTokenSwappedEventArgs = EParams<typeof RewardTokenSwapped>

/** YieldSent(address,uint256,uint256) */
export const YieldSent = event('0x4c70885488a444f9f6af8660e35d1c356100677dff981e92b57e4be32d6619d1', {
    recipient: address,
    yield: uint256,
    fee: uint256,
})
export type YieldSentEventArgs = EParams<typeof YieldSent>
