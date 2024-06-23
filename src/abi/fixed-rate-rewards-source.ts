import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RewardCollected: event("0x9026b1dc1bd4688af8f4998f8cacc713a53fba753294da0efe4849a25c26023e", "RewardCollected(uint256)", {"amountCollected": p.uint256}),
    RewardsPerSecondChanged: event("0xe261f91b5c3d9f16ed2268171bcd375f4aa1fe4b244cfe2e54a7d21be4735d46", "RewardsPerSecondChanged(uint256,uint256)", {"newRPS": p.uint256, "oldRPS": p.uint256}),
    RewardsTargetChange: event("0x41ad0a33748dcbf4495041d0518e1204c1d5f0d65e7dccb51877235361e75f4a", "RewardsTargetChange(address,address)", {"target": p.address, "previousTarget": p.address}),
    StrategistUpdated: event("0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee", "StrategistUpdated(address)", {"_address": p.address}),
}

export const functions = {
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    collectRewards: fun("0x70bb45b3", "collectRewards()", {}, p.uint256),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    initialize: fun("0x485cc955", "initialize(address,address)", {"_strategistAddr": p.address, "_rewardsTarget": p.address}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    previewRewards: viewFun("0xe0d801dd", "previewRewards()", {}, p.uint256),
    rewardConfig: viewFun("0x4e94c285", "rewardConfig()", {}, {"lastCollect": p.uint64, "rewardsPerSecond": p.uint192}),
    rewardToken: viewFun("0xf7c618c1", "rewardToken()", {}, p.address),
    rewardsTarget: viewFun("0x82487844", "rewardsTarget()", {}, p.address),
    setRewardsPerSecond: fun("0xdc9ec152", "setRewardsPerSecond(uint192)", {"_rewardsPerSecond": p.uint192}, ),
    setRewardsTarget: fun("0x6411466f", "setRewardsTarget(address)", {"_rewardsTarget": p.address}, ),
    setStrategistAddr: fun("0x773540b3", "setStrategistAddr(address)", {"_address": p.address}, ),
    strategistAddr: viewFun("0x570d8e1d", "strategistAddr()", {}, p.address),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
}

export class Contract extends ContractBase {

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    previewRewards() {
        return this.eth_call(functions.previewRewards, {})
    }

    rewardConfig() {
        return this.eth_call(functions.rewardConfig, {})
    }

    rewardToken() {
        return this.eth_call(functions.rewardToken, {})
    }

    rewardsTarget() {
        return this.eth_call(functions.rewardsTarget, {})
    }

    strategistAddr() {
        return this.eth_call(functions.strategistAddr, {})
    }
}

/// Event types
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RewardCollectedEventArgs = EParams<typeof events.RewardCollected>
export type RewardsPerSecondChangedEventArgs = EParams<typeof events.RewardsPerSecondChanged>
export type RewardsTargetChangeEventArgs = EParams<typeof events.RewardsTargetChange>
export type StrategistUpdatedEventArgs = EParams<typeof events.StrategistUpdated>

/// Function types
export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectRewardsParams = FunctionArguments<typeof functions.collectRewards>
export type CollectRewardsReturn = FunctionReturn<typeof functions.collectRewards>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type PreviewRewardsParams = FunctionArguments<typeof functions.previewRewards>
export type PreviewRewardsReturn = FunctionReturn<typeof functions.previewRewards>

export type RewardConfigParams = FunctionArguments<typeof functions.rewardConfig>
export type RewardConfigReturn = FunctionReturn<typeof functions.rewardConfig>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type RewardsTargetParams = FunctionArguments<typeof functions.rewardsTarget>
export type RewardsTargetReturn = FunctionReturn<typeof functions.rewardsTarget>

export type SetRewardsPerSecondParams = FunctionArguments<typeof functions.setRewardsPerSecond>
export type SetRewardsPerSecondReturn = FunctionReturn<typeof functions.setRewardsPerSecond>

export type SetRewardsTargetParams = FunctionArguments<typeof functions.setRewardsTarget>
export type SetRewardsTargetReturn = FunctionReturn<typeof functions.setRewardsTarget>

export type SetStrategistAddrParams = FunctionArguments<typeof functions.setStrategistAddr>
export type SetStrategistAddrReturn = FunctionReturn<typeof functions.setStrategistAddr>

export type StrategistAddrParams = FunctionArguments<typeof functions.strategistAddr>
export type StrategistAddrReturn = FunctionReturn<typeof functions.strategistAddr>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

