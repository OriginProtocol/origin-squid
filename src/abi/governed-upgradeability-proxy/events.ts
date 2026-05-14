import { address } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

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

/** Upgraded(address) */
export const Upgraded = event('0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b', {
    implementation: indexed(address),
})
export type UpgradedEventArgs = EParams<typeof Upgraded>
