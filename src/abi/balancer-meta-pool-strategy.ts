import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Deposit: event("0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62", "Deposit(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    HarvesterAddressesUpdated: event("0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796", "HarvesterAddressesUpdated(address,address)", {"_oldHarvesterAddress": p.address, "_newHarvesterAddress": p.address}),
    MaxDepositDeviationUpdated: event("0x42ef8699937e03e56ce59a64b430e1a18719693244c594c7884f9cb7c1c98e5c", "MaxDepositDeviationUpdated(uint256,uint256)", {"_prevMaxDeviationPercentage": p.uint256, "_newMaxDeviationPercentage": p.uint256}),
    MaxWithdrawalDeviationUpdated: event("0xdea5bd7251b6797372e2785ac437c2b046149b71216727e0d33ab3140b11d6f7", "MaxWithdrawalDeviationUpdated(uint256,uint256)", {"_prevMaxDeviationPercentage": p.uint256, "_newMaxDeviationPercentage": p.uint256}),
    PTokenAdded: event("0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765", "PTokenAdded(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PTokenRemoved: event("0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c", "PTokenRemoved(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RewardTokenAddressesUpdated: event("0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc", "RewardTokenAddressesUpdated(address[],address[])", {"_oldAddresses": p.array(p.address), "_newAddresses": p.array(p.address)}),
    RewardTokenCollected: event("0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353", "RewardTokenCollected(address,address,uint256)", {"recipient": p.address, "rewardToken": p.address, "amount": p.uint256}),
    Withdrawal: event("0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "Withdrawal(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
}

export const functions = {
    assetToPToken: viewFun("0x0fc3b4c4", "assetToPToken(address)", {"_0": p.address}, p.address),
    auraRewardPoolAddress: viewFun("0x3132a21d", "auraRewardPoolAddress()", {}, p.address),
    balancerPoolId: viewFun("0xdbbb64b9", "balancerPoolId()", {}, p.bytes32),
    balancerVault: viewFun("0x158274a5", "balancerVault()", {}, p.address),
    "checkBalance(address)": viewFun("0x5f515226", "checkBalance(address)", {"_asset": p.address}, p.uint256),
    "checkBalance()": viewFun("0xc71daccb", "checkBalance()", {}, p.uint256),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    collectRewardTokens: fun("0x5a063f63", "collectRewardTokens()", {}, ),
    "deposit(address,uint256)": fun("0x47e7ef24", "deposit(address,uint256)", {"_0": p.address, "_1": p.uint256}, ),
    "deposit(address[],uint256[])": fun("0xefc908a1", "deposit(address[],uint256[])", {"_0": p.array(p.address), "_1": p.array(p.uint256)}, ),
    depositAll: fun("0xde5f6268", "depositAll()", {}, ),
    frxETH: viewFun("0x565d3e6e", "frxETH()", {}, p.address),
    getRewardTokenAddresses: viewFun("0xf6ca71b0", "getRewardTokenAddresses()", {}, p.array(p.address)),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    harvesterAddress: viewFun("0x67c7066c", "harvesterAddress()", {}, p.address),
    initialize: fun("0x435356d1", "initialize(address[],address[],address[])", {"_rewardTokenAddresses": p.array(p.address), "_assets": p.array(p.address), "_pTokens": p.array(p.address)}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    maxDepositDeviation: viewFun("0x3f6f7a14", "maxDepositDeviation()", {}, p.uint256),
    maxWithdrawalDeviation: viewFun("0x14f0747e", "maxWithdrawalDeviation()", {}, p.uint256),
    platformAddress: viewFun("0xdbe55e56", "platformAddress()", {}, p.address),
    rETH: viewFun("0xca8aa0e4", "rETH()", {}, p.address),
    removePToken: fun("0x9136616a", "removePToken(uint256)", {"_assetIndex": p.uint256}, ),
    rewardTokenAddresses: viewFun("0x7b2d9b2c", "rewardTokenAddresses(uint256)", {"_0": p.uint256}, p.address),
    safeApproveAllTokens: fun("0xad1728cb", "safeApproveAllTokens()", {}, ),
    setHarvesterAddress: fun("0xc2e1e3f4", "setHarvesterAddress(address)", {"_harvesterAddress": p.address}, ),
    setMaxDepositDeviation: fun("0x683c1ef9", "setMaxDepositDeviation(uint256)", {"_maxDepositDeviation": p.uint256}, ),
    setMaxWithdrawalDeviation: fun("0x79e66fcc", "setMaxWithdrawalDeviation(uint256)", {"_maxWithdrawalDeviation": p.uint256}, ),
    setPTokenAddress: fun("0x0ed57b3a", "setPTokenAddress(address,address)", {"_asset": p.address, "_pToken": p.address}, ),
    setRewardTokenAddresses: fun("0x96d538bb", "setRewardTokenAddresses(address[])", {"_rewardTokenAddresses": p.array(p.address)}, ),
    sfrxETH: viewFun("0xc9ac8c8e", "sfrxETH()", {}, p.address),
    stETH: viewFun("0xc1fe3e48", "stETH()", {}, p.address),
    supportsAsset: viewFun("0xaa388af6", "supportsAsset(address)", {"_asset": p.address}, p.bool),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", "transferToken(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    vaultAddress: viewFun("0x430bf08a", "vaultAddress()", {}, p.address),
    "withdraw(address,address,uint256)": fun("0xd9caed12", "withdraw(address,address,uint256)", {"_recipient": p.address, "_strategyAsset": p.address, "_strategyAmount": p.uint256}, ),
    "withdraw(address,address[],uint256[])": fun("0xedbd7668", "withdraw(address,address[],uint256[])", {"_recipient": p.address, "_strategyAssets": p.array(p.address), "_strategyAmounts": p.array(p.uint256)}, ),
    withdrawAll: fun("0x853828b6", "withdrawAll()", {}, ),
    wstETH: viewFun("0x4aa07e64", "wstETH()", {}, p.address),
}

export class Contract extends ContractBase {

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(functions.assetToPToken, {_0})
    }

    auraRewardPoolAddress() {
        return this.eth_call(functions.auraRewardPoolAddress, {})
    }

    balancerPoolId() {
        return this.eth_call(functions.balancerPoolId, {})
    }

    balancerVault() {
        return this.eth_call(functions.balancerVault, {})
    }

    "checkBalance(address)"(_asset: CheckBalanceParams_0["_asset"]) {
        return this.eth_call(functions["checkBalance(address)"], {_asset})
    }

    "checkBalance()"() {
        return this.eth_call(functions["checkBalance()"], {})
    }

    frxETH() {
        return this.eth_call(functions.frxETH, {})
    }

    getRewardTokenAddresses() {
        return this.eth_call(functions.getRewardTokenAddresses, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    harvesterAddress() {
        return this.eth_call(functions.harvesterAddress, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    maxDepositDeviation() {
        return this.eth_call(functions.maxDepositDeviation, {})
    }

    maxWithdrawalDeviation() {
        return this.eth_call(functions.maxWithdrawalDeviation, {})
    }

    platformAddress() {
        return this.eth_call(functions.platformAddress, {})
    }

    rETH() {
        return this.eth_call(functions.rETH, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(functions.rewardTokenAddresses, {_0})
    }

    sfrxETH() {
        return this.eth_call(functions.sfrxETH, {})
    }

    stETH() {
        return this.eth_call(functions.stETH, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(functions.supportsAsset, {_asset})
    }

    vaultAddress() {
        return this.eth_call(functions.vaultAddress, {})
    }

    wstETH() {
        return this.eth_call(functions.wstETH, {})
    }
}

/// Event types
export type DepositEventArgs = EParams<typeof events.Deposit>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type HarvesterAddressesUpdatedEventArgs = EParams<typeof events.HarvesterAddressesUpdated>
export type MaxDepositDeviationUpdatedEventArgs = EParams<typeof events.MaxDepositDeviationUpdated>
export type MaxWithdrawalDeviationUpdatedEventArgs = EParams<typeof events.MaxWithdrawalDeviationUpdated>
export type PTokenAddedEventArgs = EParams<typeof events.PTokenAdded>
export type PTokenRemovedEventArgs = EParams<typeof events.PTokenRemoved>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RewardTokenAddressesUpdatedEventArgs = EParams<typeof events.RewardTokenAddressesUpdated>
export type RewardTokenCollectedEventArgs = EParams<typeof events.RewardTokenCollected>
export type WithdrawalEventArgs = EParams<typeof events.Withdrawal>

/// Function types
export type AssetToPTokenParams = FunctionArguments<typeof functions.assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof functions.assetToPToken>

export type AuraRewardPoolAddressParams = FunctionArguments<typeof functions.auraRewardPoolAddress>
export type AuraRewardPoolAddressReturn = FunctionReturn<typeof functions.auraRewardPoolAddress>

export type BalancerPoolIdParams = FunctionArguments<typeof functions.balancerPoolId>
export type BalancerPoolIdReturn = FunctionReturn<typeof functions.balancerPoolId>

export type BalancerVaultParams = FunctionArguments<typeof functions.balancerVault>
export type BalancerVaultReturn = FunctionReturn<typeof functions.balancerVault>

export type CheckBalanceParams_0 = FunctionArguments<typeof functions["checkBalance(address)"]>
export type CheckBalanceReturn_0 = FunctionReturn<typeof functions["checkBalance(address)"]>

export type CheckBalanceParams_1 = FunctionArguments<typeof functions["checkBalance()"]>
export type CheckBalanceReturn_1 = FunctionReturn<typeof functions["checkBalance()"]>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectRewardTokensParams = FunctionArguments<typeof functions.collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof functions.collectRewardTokens>

export type DepositParams_0 = FunctionArguments<typeof functions["deposit(address,uint256)"]>
export type DepositReturn_0 = FunctionReturn<typeof functions["deposit(address,uint256)"]>

export type DepositParams_1 = FunctionArguments<typeof functions["deposit(address[],uint256[])"]>
export type DepositReturn_1 = FunctionReturn<typeof functions["deposit(address[],uint256[])"]>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type FrxETHParams = FunctionArguments<typeof functions.frxETH>
export type FrxETHReturn = FunctionReturn<typeof functions.frxETH>

export type GetRewardTokenAddressesParams = FunctionArguments<typeof functions.getRewardTokenAddresses>
export type GetRewardTokenAddressesReturn = FunctionReturn<typeof functions.getRewardTokenAddresses>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type HarvesterAddressParams = FunctionArguments<typeof functions.harvesterAddress>
export type HarvesterAddressReturn = FunctionReturn<typeof functions.harvesterAddress>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type MaxDepositDeviationParams = FunctionArguments<typeof functions.maxDepositDeviation>
export type MaxDepositDeviationReturn = FunctionReturn<typeof functions.maxDepositDeviation>

export type MaxWithdrawalDeviationParams = FunctionArguments<typeof functions.maxWithdrawalDeviation>
export type MaxWithdrawalDeviationReturn = FunctionReturn<typeof functions.maxWithdrawalDeviation>

export type PlatformAddressParams = FunctionArguments<typeof functions.platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof functions.platformAddress>

export type RETHParams = FunctionArguments<typeof functions.rETH>
export type RETHReturn = FunctionReturn<typeof functions.rETH>

export type RemovePTokenParams = FunctionArguments<typeof functions.removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof functions.removePToken>

export type RewardTokenAddressesParams = FunctionArguments<typeof functions.rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof functions.rewardTokenAddresses>

export type SafeApproveAllTokensParams = FunctionArguments<typeof functions.safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof functions.safeApproveAllTokens>

export type SetHarvesterAddressParams = FunctionArguments<typeof functions.setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof functions.setHarvesterAddress>

export type SetMaxDepositDeviationParams = FunctionArguments<typeof functions.setMaxDepositDeviation>
export type SetMaxDepositDeviationReturn = FunctionReturn<typeof functions.setMaxDepositDeviation>

export type SetMaxWithdrawalDeviationParams = FunctionArguments<typeof functions.setMaxWithdrawalDeviation>
export type SetMaxWithdrawalDeviationReturn = FunctionReturn<typeof functions.setMaxWithdrawalDeviation>

export type SetPTokenAddressParams = FunctionArguments<typeof functions.setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof functions.setPTokenAddress>

export type SetRewardTokenAddressesParams = FunctionArguments<typeof functions.setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof functions.setRewardTokenAddresses>

export type SfrxETHParams = FunctionArguments<typeof functions.sfrxETH>
export type SfrxETHReturn = FunctionReturn<typeof functions.sfrxETH>

export type StETHParams = FunctionArguments<typeof functions.stETH>
export type StETHReturn = FunctionReturn<typeof functions.stETH>

export type SupportsAssetParams = FunctionArguments<typeof functions.supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof functions.supportsAsset>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

export type VaultAddressParams = FunctionArguments<typeof functions.vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof functions.vaultAddress>

export type WithdrawParams_0 = FunctionArguments<typeof functions["withdraw(address,address,uint256)"]>
export type WithdrawReturn_0 = FunctionReturn<typeof functions["withdraw(address,address,uint256)"]>

export type WithdrawParams_1 = FunctionArguments<typeof functions["withdraw(address,address[],uint256[])"]>
export type WithdrawReturn_1 = FunctionReturn<typeof functions["withdraw(address,address[],uint256[])"]>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

export type WstETHParams = FunctionArguments<typeof functions.wstETH>
export type WstETHReturn = FunctionReturn<typeof functions.wstETH>

