import { address, uint256, uint32 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    amount: uint256,
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

/** NewRewardsCycle(uint32,uint256) */
export const NewRewardsCycle = event('0x2fa39aac60d1c94cda4ab0e86ae9c0ffab5b926e5b827a4ccba1d9b5b2ef596e', {
    cycleEnd: indexed(uint32),
    rewardAmount: uint256,
})
export type NewRewardsCycleEventArgs = EParams<typeof NewRewardsCycle>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    amount: uint256,
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
