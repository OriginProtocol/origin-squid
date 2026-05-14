import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** RewardAdded(uint256) */
export const RewardAdded = event('0xde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d', {
    reward: uint256,
})
export type RewardAddedEventArgs = EParams<typeof RewardAdded>

/** RewardPaid(address,uint256) */
export const RewardPaid = event('0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486', {
    user: indexed(address),
    reward: uint256,
})
export type RewardPaidEventArgs = EParams<typeof RewardPaid>

/** Staked(address,uint256) */
export const Staked = event('0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d', {
    user: indexed(address),
    amount: uint256,
})
export type StakedEventArgs = EParams<typeof Staked>

/** Withdrawn(address,uint256) */
export const Withdrawn = event('0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5', {
    user: indexed(address),
    amount: uint256,
})
export type WithdrawnEventArgs = EParams<typeof Withdrawn>
