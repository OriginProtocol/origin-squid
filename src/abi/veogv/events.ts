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

/** DelegateChanged(address,address,address) */
export const DelegateChanged = event('0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f', {
    delegator: indexed(address),
    fromDelegate: indexed(address),
    toDelegate: indexed(address),
})
export type DelegateChangedEventArgs = EParams<typeof DelegateChanged>

/** DelegateVotesChanged(address,uint256,uint256) */
export const DelegateVotesChanged = event('0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724', {
    delegate: indexed(address),
    previousBalance: uint256,
    newBalance: uint256,
})
export type DelegateVotesChangedEventArgs = EParams<typeof DelegateVotesChanged>

/** Reward(address,uint256) */
export const Reward = event('0x619caafabdd75649b302ba8419e48cccf64f37f1983ac4727cfb38b57703ffc9', {
    user: indexed(address),
    amount: uint256,
})
export type RewardEventArgs = EParams<typeof Reward>

/** Stake(address,uint256,uint256,uint256,uint256) */
export const Stake = event('0x2720efa4b2dd4f3f8a347da3cbd290a522e9432da9072c5b8e6300496fdde282', {
    user: indexed(address),
    lockupId: uint256,
    amount: uint256,
    end: uint256,
    points: uint256,
})
export type StakeEventArgs = EParams<typeof Stake>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>

/** Unstake(address,uint256,uint256,uint256,uint256) */
export const Unstake = event('0x05b744e3e9358bc00ba3cc0c6606a4d6536134dba00b2d2ee4b5de169acd6427', {
    user: indexed(address),
    lockupId: uint256,
    amount: uint256,
    end: uint256,
    points: uint256,
})
export type UnstakeEventArgs = EParams<typeof Unstake>
