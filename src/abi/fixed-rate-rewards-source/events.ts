import { address, uint256 } from '@subsquid/evm-codec'
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

/** RewardCollected(uint256) */
export const RewardCollected = event('0x9026b1dc1bd4688af8f4998f8cacc713a53fba753294da0efe4849a25c26023e', {
    amountCollected: uint256,
})
export type RewardCollectedEventArgs = EParams<typeof RewardCollected>

/** RewardsPerSecondChanged(uint256,uint256) */
export const RewardsPerSecondChanged = event('0xe261f91b5c3d9f16ed2268171bcd375f4aa1fe4b244cfe2e54a7d21be4735d46', {
    newRPS: uint256,
    oldRPS: uint256,
})
export type RewardsPerSecondChangedEventArgs = EParams<typeof RewardsPerSecondChanged>

/** RewardsTargetChange(address,address) */
export const RewardsTargetChange = event('0x41ad0a33748dcbf4495041d0518e1204c1d5f0d65e7dccb51877235361e75f4a', {
    target: address,
    previousTarget: address,
})
export type RewardsTargetChangeEventArgs = EParams<typeof RewardsTargetChange>

/** StrategistUpdated(address) */
export const StrategistUpdated = event('0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee', {
    _address: address,
})
export type StrategistUpdatedEventArgs = EParams<typeof StrategistUpdated>
