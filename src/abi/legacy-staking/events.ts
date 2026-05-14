import { address, array, bool, bytes32, uint256, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** GovernorshipTransferred(address,address) */
export const GovernorshipTransferred = event('0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type GovernorshipTransferredEventArgs = EParams<typeof GovernorshipTransferred>

/** NewAirDropRootHash(uint8,bytes32,uint256) */
export const NewAirDropRootHash = event('0x1ac9c006454d2d601a481473a37c95bf489c5923bd7c2a701757d4016a0f022d', {
    stakeType: uint8,
    rootHash: bytes32,
    proofDepth: uint256,
})
export type NewAirDropRootHashEventArgs = EParams<typeof NewAirDropRootHash>

/** NewDurations(address,uint256[]) */
export const NewDurations = event('0x180120279c2eb356244609197b5b64c0fbabd60f8d073b75aba771a296bb63d4', {
    user: indexed(address),
    durations: array(uint256),
})
export type NewDurationsEventArgs = EParams<typeof NewDurations>

/** NewRates(address,uint256[]) */
export const NewRates = event('0xa804368c7f1a6216d92d17d9753b923dfc3da14ae33d231e8d79e39202e249c3', {
    user: indexed(address),
    rates: array(uint256),
})
export type NewRatesEventArgs = EParams<typeof NewRates>

/** Paused(address,bool) */
export const Paused = event('0xe8699cf681560fd07de85543bd994263f4557bdc5179dd702f256d15fd083e1d', {
    user: indexed(address),
    yes: bool,
})
export type PausedEventArgs = EParams<typeof Paused>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** Staked(address,uint256,uint256,uint256) */
export const Staked = event('0xb4caaf29adda3eefee3ad552a8e85058589bf834c7466cae4ee58787f70589ed', {
    user: indexed(address),
    amount: uint256,
    duration: uint256,
    rate: uint256,
})
export type StakedEventArgs = EParams<typeof Staked>

/** StakesTransfered(address,address,uint256) */
export const StakesTransfered = event('0xd0ceb9c39a11711e51ee4b32b97b05d660d6229ecd8be94ce934fa9e77910263', {
    fromUser: indexed(address),
    toUser: address,
    numStakes: uint256,
})
export type StakesTransferedEventArgs = EParams<typeof StakesTransfered>

/** Withdrawn(address,uint256,uint256) */
export const Withdrawn = event('0x92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc6', {
    user: indexed(address),
    amount: uint256,
    stakedAmount: uint256,
})
export type WithdrawnEventArgs = EParams<typeof Withdrawn>

/** Upgraded(address) */
export const Upgraded = event('0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b', {
    implementation: indexed(address),
})
export type UpgradedEventArgs = EParams<typeof Upgraded>

/** Staked(address,uint256) */
export const Staked_1 = event('0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d', {
    user: indexed(address),
    amount: uint256,
})
export type StakedEventArgs_1 = EParams<typeof Staked_1>

/** Withdrawn(address,uint256) */
export const Withdrawn_1 = event('0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5', {
    user: indexed(address),
    amount: uint256,
})
export type WithdrawnEventArgs_1 = EParams<typeof Withdrawn_1>
