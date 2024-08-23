import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Deposit: event("0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62", "Deposit(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    HarvesterAddressesUpdated: event("0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796", "HarvesterAddressesUpdated(address,address)", {"_oldHarvesterAddress": p.address, "_newHarvesterAddress": p.address}),
    MaxPriceDiffBpsUpdated: event("0x5066a7b9bf5907d8b921adeaade475273e40a7302cab0e838ef9fa2094b06b7f", "MaxPriceDiffBpsUpdated(uint128,uint128)", {"oldValue": p.uint128, "newValue": p.uint128}),
    PTokenAdded: event("0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765", "PTokenAdded(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PTokenRemoved: event("0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c", "PTokenRemoved(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RewardTokenAddressesUpdated: event("0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc", "RewardTokenAddressesUpdated(address[],address[])", {"_oldAddresses": p.array(p.address), "_newAddresses": p.array(p.address)}),
    RewardTokenCollected: event("0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353", "RewardTokenCollected(address,address,uint256)", {"recipient": p.address, "rewardToken": p.address, "amount": p.uint256}),
    WOETHPriceUpdated: event("0x688768fc37ada60fd073f86fafc8d5aa7fe9d86750ddf224bc0366812c086fe8", "WOETHPriceUpdated(uint128,uint128)", {"oldValue": p.uint128, "newValue": p.uint128}),
    Withdrawal: event("0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "Withdrawal(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
}

export const functions = {
    MAX_PRICE_STALENESS: viewFun("0xd6913b32", "MAX_PRICE_STALENESS()", {}, p.uint256),
    assetToPToken: viewFun("0x0fc3b4c4", "assetToPToken(address)", {"_0": p.address}, p.address),
    bridgedWOETH: viewFun("0xaeaf191b", "bridgedWOETH()", {}, p.address),
    checkBalance: viewFun("0x5f515226", "checkBalance(address)", {"_asset": p.address}, p.uint256),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    collectRewardTokens: fun("0x5a063f63", "collectRewardTokens()", {}, ),
    deposit: fun("0x47e7ef24", "deposit(address,uint256)", {"_0": p.address, "_1": p.uint256}, ),
    depositAll: fun("0xde5f6268", "depositAll()", {}, ),
    depositBridgedWOETH: fun("0xd6e772a4", "depositBridgedWOETH(uint256)", {"woethAmount": p.uint256}, ),
    getBridgedWOETHValue: viewFun("0x7e50ac3f", "getBridgedWOETHValue(uint256)", {"woethAmount": p.uint256}, p.uint256),
    getRewardTokenAddresses: viewFun("0xf6ca71b0", "getRewardTokenAddresses()", {}, p.array(p.address)),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    harvesterAddress: viewFun("0x67c7066c", "harvesterAddress()", {}, p.address),
    initialize: fun("0x56db9ef1", "initialize(uint128)", {"_maxPriceDiffBps": p.uint128}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    lastOraclePrice: viewFun("0x349f7173", "lastOraclePrice()", {}, p.uint128),
    maxPriceDiffBps: viewFun("0x951ba637", "maxPriceDiffBps()", {}, p.uint128),
    oethb: viewFun("0x6dea9b19", "oethb()", {}, p.address),
    platformAddress: viewFun("0xdbe55e56", "platformAddress()", {}, p.address),
    removePToken: fun("0x9136616a", "removePToken(uint256)", {"_0": p.uint256}, ),
    rewardTokenAddresses: viewFun("0x7b2d9b2c", "rewardTokenAddresses(uint256)", {"_0": p.uint256}, p.address),
    safeApproveAllTokens: fun("0xad1728cb", "safeApproveAllTokens()", {}, ),
    setHarvesterAddress: fun("0xc2e1e3f4", "setHarvesterAddress(address)", {"_harvesterAddress": p.address}, ),
    setMaxPriceDiffBps: fun("0x3ad12229", "setMaxPriceDiffBps(uint128)", {"_maxPriceDiffBps": p.uint128}, ),
    setPTokenAddress: fun("0x0ed57b3a", "setPTokenAddress(address,address)", {"_asset": p.address, "_pToken": p.address}, ),
    setRewardTokenAddresses: fun("0x96d538bb", "setRewardTokenAddresses(address[])", {"_rewardTokenAddresses": p.array(p.address)}, ),
    supportsAsset: viewFun("0xaa388af6", "supportsAsset(address)", {"_asset": p.address}, p.bool),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", "transferToken(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    updateWOETHOraclePrice: fun("0x6c713833", "updateWOETHOraclePrice()", {}, p.uint256),
    vaultAddress: viewFun("0x430bf08a", "vaultAddress()", {}, p.address),
    weth: viewFun("0x3fc8cef3", "weth()", {}, p.address),
    withdraw: fun("0xd9caed12", "withdraw(address,address,uint256)", {"_recipient": p.address, "_asset": p.address, "_amount": p.uint256}, ),
    withdrawAll: fun("0x853828b6", "withdrawAll()", {}, ),
    withdrawBridgedWOETH: fun("0x2579fe8a", "withdrawBridgedWOETH(uint256)", {"oethToBurn": p.uint256}, ),
}

export class Contract extends ContractBase {

    MAX_PRICE_STALENESS() {
        return this.eth_call(functions.MAX_PRICE_STALENESS, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(functions.assetToPToken, {_0})
    }

    bridgedWOETH() {
        return this.eth_call(functions.bridgedWOETH, {})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(functions.checkBalance, {_asset})
    }

    getBridgedWOETHValue(woethAmount: GetBridgedWOETHValueParams["woethAmount"]) {
        return this.eth_call(functions.getBridgedWOETHValue, {woethAmount})
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

    lastOraclePrice() {
        return this.eth_call(functions.lastOraclePrice, {})
    }

    maxPriceDiffBps() {
        return this.eth_call(functions.maxPriceDiffBps, {})
    }

    oethb() {
        return this.eth_call(functions.oethb, {})
    }

    platformAddress() {
        return this.eth_call(functions.platformAddress, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(functions.rewardTokenAddresses, {_0})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(functions.supportsAsset, {_asset})
    }

    vaultAddress() {
        return this.eth_call(functions.vaultAddress, {})
    }

    weth() {
        return this.eth_call(functions.weth, {})
    }
}

/// Event types
export type DepositEventArgs = EParams<typeof events.Deposit>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type HarvesterAddressesUpdatedEventArgs = EParams<typeof events.HarvesterAddressesUpdated>
export type MaxPriceDiffBpsUpdatedEventArgs = EParams<typeof events.MaxPriceDiffBpsUpdated>
export type PTokenAddedEventArgs = EParams<typeof events.PTokenAdded>
export type PTokenRemovedEventArgs = EParams<typeof events.PTokenRemoved>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RewardTokenAddressesUpdatedEventArgs = EParams<typeof events.RewardTokenAddressesUpdated>
export type RewardTokenCollectedEventArgs = EParams<typeof events.RewardTokenCollected>
export type WOETHPriceUpdatedEventArgs = EParams<typeof events.WOETHPriceUpdated>
export type WithdrawalEventArgs = EParams<typeof events.Withdrawal>

/// Function types
export type MAX_PRICE_STALENESSParams = FunctionArguments<typeof functions.MAX_PRICE_STALENESS>
export type MAX_PRICE_STALENESSReturn = FunctionReturn<typeof functions.MAX_PRICE_STALENESS>

export type AssetToPTokenParams = FunctionArguments<typeof functions.assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof functions.assetToPToken>

export type BridgedWOETHParams = FunctionArguments<typeof functions.bridgedWOETH>
export type BridgedWOETHReturn = FunctionReturn<typeof functions.bridgedWOETH>

export type CheckBalanceParams = FunctionArguments<typeof functions.checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof functions.checkBalance>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectRewardTokensParams = FunctionArguments<typeof functions.collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof functions.collectRewardTokens>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type DepositBridgedWOETHParams = FunctionArguments<typeof functions.depositBridgedWOETH>
export type DepositBridgedWOETHReturn = FunctionReturn<typeof functions.depositBridgedWOETH>

export type GetBridgedWOETHValueParams = FunctionArguments<typeof functions.getBridgedWOETHValue>
export type GetBridgedWOETHValueReturn = FunctionReturn<typeof functions.getBridgedWOETHValue>

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

export type LastOraclePriceParams = FunctionArguments<typeof functions.lastOraclePrice>
export type LastOraclePriceReturn = FunctionReturn<typeof functions.lastOraclePrice>

export type MaxPriceDiffBpsParams = FunctionArguments<typeof functions.maxPriceDiffBps>
export type MaxPriceDiffBpsReturn = FunctionReturn<typeof functions.maxPriceDiffBps>

export type OethbParams = FunctionArguments<typeof functions.oethb>
export type OethbReturn = FunctionReturn<typeof functions.oethb>

export type PlatformAddressParams = FunctionArguments<typeof functions.platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof functions.platformAddress>

export type RemovePTokenParams = FunctionArguments<typeof functions.removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof functions.removePToken>

export type RewardTokenAddressesParams = FunctionArguments<typeof functions.rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof functions.rewardTokenAddresses>

export type SafeApproveAllTokensParams = FunctionArguments<typeof functions.safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof functions.safeApproveAllTokens>

export type SetHarvesterAddressParams = FunctionArguments<typeof functions.setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof functions.setHarvesterAddress>

export type SetMaxPriceDiffBpsParams = FunctionArguments<typeof functions.setMaxPriceDiffBps>
export type SetMaxPriceDiffBpsReturn = FunctionReturn<typeof functions.setMaxPriceDiffBps>

export type SetPTokenAddressParams = FunctionArguments<typeof functions.setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof functions.setPTokenAddress>

export type SetRewardTokenAddressesParams = FunctionArguments<typeof functions.setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof functions.setRewardTokenAddresses>

export type SupportsAssetParams = FunctionArguments<typeof functions.supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof functions.supportsAsset>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

export type UpdateWOETHOraclePriceParams = FunctionArguments<typeof functions.updateWOETHOraclePrice>
export type UpdateWOETHOraclePriceReturn = FunctionReturn<typeof functions.updateWOETHOraclePrice>

export type VaultAddressParams = FunctionArguments<typeof functions.vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof functions.vaultAddress>

export type WethParams = FunctionArguments<typeof functions.weth>
export type WethReturn = FunctionReturn<typeof functions.weth>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

export type WithdrawBridgedWOETHParams = FunctionArguments<typeof functions.withdrawBridgedWOETH>
export type WithdrawBridgedWOETHReturn = FunctionReturn<typeof functions.withdrawBridgedWOETH>

