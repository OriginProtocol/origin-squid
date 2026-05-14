import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** ClaimFees(address,uint256,uint256) */
export const ClaimFees = event('0xbc567d6cbad26368064baa0ab5a757be46aae4d70f707f9203d9d9b6c8ccbfa3', {
    from: indexed(address),
    claimed0: uint256,
    claimed1: uint256,
})
export type ClaimFeesEventArgs = EParams<typeof ClaimFees>

/** ClaimRewards(address,uint256) */
export const ClaimRewards = event('0x1f89f96333d3133000ee447473151fa9606543368f02271c9d95ae14f13bcc67', {
    from: indexed(address),
    amount: uint256,
})
export type ClaimRewardsEventArgs = EParams<typeof ClaimRewards>

/** Deposit(address,address,uint256) */
export const Deposit = event('0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62', {
    from: indexed(address),
    to: indexed(address),
    amount: uint256,
})
export type DepositEventArgs = EParams<typeof Deposit>

/** NotifyReward(address,uint256) */
export const NotifyReward = event('0x095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c1', {
    from: indexed(address),
    amount: uint256,
})
export type NotifyRewardEventArgs = EParams<typeof NotifyReward>

/** Withdraw(address,uint256) */
export const Withdraw = event('0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364', {
    from: indexed(address),
    amount: uint256,
})
export type WithdrawEventArgs = EParams<typeof Withdraw>
