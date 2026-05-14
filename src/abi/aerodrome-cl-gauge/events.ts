import { address, uint128, uint256 } from '@subsquid/evm-codec'
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

/** Deposit(address,uint256,uint128) */
export const Deposit = event('0x1c8ab8c7f45390d58f58f1d655213a82cca5d12179761a87c16f098813b8f211', {
    user: indexed(address),
    tokenId: indexed(uint256),
    liquidityToStake: indexed(uint128),
})
export type DepositEventArgs = EParams<typeof Deposit>

/** NotifyReward(address,uint256) */
export const NotifyReward = event('0x095667752957714306e1a6ad83495404412df6fdb932fca6dc849a7ee910d4c1', {
    from: indexed(address),
    amount: uint256,
})
export type NotifyRewardEventArgs = EParams<typeof NotifyReward>

/** Withdraw(address,uint256,uint128) */
export const Withdraw = event('0x8903a5b5d08a841e7f68438387f1da20c84dea756379ed37e633ff3854b99b84', {
    user: indexed(address),
    tokenId: indexed(uint256),
    liquidityToStake: indexed(uint128),
})
export type WithdrawEventArgs = EParams<typeof Withdraw>
