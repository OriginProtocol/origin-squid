import { address, bool, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Abstained(address,address,uint256,uint256,uint256,uint256) */
export const Abstained = event('0xadab630928b1d46214641293704a312ee7ad87e03ae14a7fd95e7308b93998df', {
    voter: indexed(address),
    pool: indexed(address),
    tokenId: indexed(uint256),
    weight: uint256,
    totalWeight: uint256,
    timestamp: uint256,
})
export type AbstainedEventArgs = EParams<typeof Abstained>

/** DistributeReward(address,address,uint256) */
export const DistributeReward = event('0x4fa9693cae526341d334e2862ca2413b2e503f1266255f9e0869fb36e6d89b17', {
    sender: indexed(address),
    gauge: indexed(address),
    amount: uint256,
})
export type DistributeRewardEventArgs = EParams<typeof DistributeReward>

/** GaugeCreated(address,address,address,address,address,address,address,address) */
export const GaugeCreated = event('0xef9f7d1ffff3b249c6b9bf2528499e935f7d96bb6d6ec4e7da504d1d3c6279e1', {
    poolFactory: indexed(address),
    votingRewardsFactory: indexed(address),
    gaugeFactory: indexed(address),
    pool: address,
    bribeVotingReward: address,
    feeVotingReward: address,
    gauge: address,
    creator: address,
})
export type GaugeCreatedEventArgs = EParams<typeof GaugeCreated>

/** GaugeKilled(address) */
export const GaugeKilled = event('0x04a5d3f5d80d22d9345acc80618f4a4e7e663cf9e1aed23b57d975acec002ba7', {
    gauge: indexed(address),
})
export type GaugeKilledEventArgs = EParams<typeof GaugeKilled>

/** GaugeRevived(address) */
export const GaugeRevived = event('0xed18e9faa3dccfd8aa45f69c4de40546b2ca9cccc4538a2323531656516db1aa', {
    gauge: indexed(address),
})
export type GaugeRevivedEventArgs = EParams<typeof GaugeRevived>

/** NotifyReward(address,address,uint256) */
export const NotifyReward = event('0xf70d5c697de7ea828df48e5c4573cb2194c659f1901f70110c52b066dcf50826', {
    sender: indexed(address),
    reward: indexed(address),
    amount: uint256,
})
export type NotifyRewardEventArgs = EParams<typeof NotifyReward>

/** Voted(address,address,uint256,uint256,uint256,uint256) */
export const Voted = event('0x452d440efc30dfa14a0ef803ccb55936af860ec6a6960ed27f129bef913f296a', {
    voter: indexed(address),
    pool: indexed(address),
    tokenId: indexed(uint256),
    weight: uint256,
    totalWeight: uint256,
    timestamp: uint256,
})
export type VotedEventArgs = EParams<typeof Voted>

/** WhitelistNFT(address,uint256,bool) */
export const WhitelistNFT = event('0x8a6ff732c8641e1e34d771e1f8b1673e988c1abdfb694ebdf6c910a5e3d0d853', {
    whitelister: indexed(address),
    tokenId: indexed(uint256),
    _bool: indexed(bool),
})
export type WhitelistNFTEventArgs = EParams<typeof WhitelistNFT>

/** WhitelistToken(address,address,bool) */
export const WhitelistToken = event('0x44948130cf88523dbc150908a47dd6332c33a01a3869d7f2fa78e51d5a5f9c57', {
    whitelister: indexed(address),
    token: indexed(address),
    _bool: indexed(bool),
})
export type WhitelistTokenEventArgs = EParams<typeof WhitelistToken>
