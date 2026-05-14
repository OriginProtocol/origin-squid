import { address, bool, struct, uint192, uint256, uint64 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** collectRewards() */
export const collectRewards = func('0x70bb45b3', {}, uint256)
export type CollectRewardsParams = FunctionArguments<typeof collectRewards>
export type CollectRewardsReturn = FunctionReturn<typeof collectRewards>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** initialize(address,address) */
export const initialize = func('0x485cc955', {
    _strategistAddr: address,
    _rewardsTarget: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** previewRewards() */
export const previewRewards = func('0xe0d801dd', {}, uint256)
export type PreviewRewardsParams = FunctionArguments<typeof previewRewards>
export type PreviewRewardsReturn = FunctionReturn<typeof previewRewards>

/** rewardConfig() */
export const rewardConfig = func('0x4e94c285', {}, struct({
    lastCollect: uint64,
    rewardsPerSecond: uint192,
}))
export type RewardConfigParams = FunctionArguments<typeof rewardConfig>
export type RewardConfigReturn = FunctionReturn<typeof rewardConfig>

/** rewardToken() */
export const rewardToken = func('0xf7c618c1', {}, address)
export type RewardTokenParams = FunctionArguments<typeof rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof rewardToken>

/** rewardsTarget() */
export const rewardsTarget = func('0x82487844', {}, address)
export type RewardsTargetParams = FunctionArguments<typeof rewardsTarget>
export type RewardsTargetReturn = FunctionReturn<typeof rewardsTarget>

/** setRewardsPerSecond(uint192) */
export const setRewardsPerSecond = func('0xdc9ec152', {
    _rewardsPerSecond: uint192,
})
export type SetRewardsPerSecondParams = FunctionArguments<typeof setRewardsPerSecond>
export type SetRewardsPerSecondReturn = FunctionReturn<typeof setRewardsPerSecond>

/** setRewardsTarget(address) */
export const setRewardsTarget = func('0x6411466f', {
    _rewardsTarget: address,
})
export type SetRewardsTargetParams = FunctionArguments<typeof setRewardsTarget>
export type SetRewardsTargetReturn = FunctionReturn<typeof setRewardsTarget>

/** setStrategistAddr(address) */
export const setStrategistAddr = func('0x773540b3', {
    _address: address,
})
export type SetStrategistAddrParams = FunctionArguments<typeof setStrategistAddr>
export type SetStrategistAddrReturn = FunctionReturn<typeof setStrategistAddr>

/** strategistAddr() */
export const strategistAddr = func('0x570d8e1d', {}, address)
export type StrategistAddrParams = FunctionArguments<typeof strategistAddr>
export type StrategistAddrReturn = FunctionReturn<typeof strategistAddr>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>
