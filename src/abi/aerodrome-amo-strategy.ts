import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Deposit: event("0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62", "Deposit(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    HarvesterAddressesUpdated: event("0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796", "HarvesterAddressesUpdated(address,address)", {"_oldHarvesterAddress": p.address, "_newHarvesterAddress": p.address}),
    LiquidityAdded: event("0x1530ec748a27514ffab0987654233a80256393e127bdf02d94e32ff3c7148ec6", "LiquidityAdded(uint256,uint256,uint256,uint256,uint256,uint256)", {"wethAmountDesired": p.uint256, "oethbAmountDesired": p.uint256, "wethAmountSupplied": p.uint256, "oethbAmountSupplied": p.uint256, "tokenId": p.uint256, "underlyingAssets": p.uint256}),
    LiquidityRemoved: event("0xede5d7a610050b00dde41dd385fe2d91a558dde29318267aa4e011678b58cfc5", "LiquidityRemoved(uint256,uint256,uint256,uint256,uint256,uint256)", {"withdrawLiquidityShare": p.uint256, "removedWETHAmount": p.uint256, "removedOETHbAmount": p.uint256, "wethAmountCollected": p.uint256, "oethbAmountCollected": p.uint256, "underlyingAssets": p.uint256}),
    PTokenAdded: event("0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765", "PTokenAdded(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PTokenRemoved: event("0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c", "PTokenRemoved(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PoolRebalanced: event("0x0d0d42e29eda809becae4f120dfbc3799e17df829fa338f8035c724579423b89", "PoolRebalanced(uint256)", {"currentPoolWethShare": p.uint256}),
    PoolWethShareIntervalUpdated: event("0xfb25072e740f40f37c0adb21abfa08b090c754a216aa3dce33b68fab089eff91", "PoolWethShareIntervalUpdated(uint256,uint256)", {"allowedWethShareStart": p.uint256, "allowedWethShareEnd": p.uint256}),
    RewardTokenAddressesUpdated: event("0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc", "RewardTokenAddressesUpdated(address[],address[])", {"_oldAddresses": p.array(p.address), "_newAddresses": p.array(p.address)}),
    RewardTokenCollected: event("0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353", "RewardTokenCollected(address,address,uint256)", {"recipient": p.address, "rewardToken": p.address, "amount": p.uint256}),
    UnderlyingAssetsUpdated: event("0xab1ece054738c773b84a8a32f5f969323c50dc7e28634302f91c7b75cb838782", "UnderlyingAssetsUpdated(uint256)", {"underlyingAssets": p.uint256}),
    Withdrawal: event("0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "Withdrawal(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
}

export const functions = {
    OETHb: viewFun("0x7b3b6068", "OETHb()", {}, p.address),
    SOLVENCY_THRESHOLD: viewFun("0x1b91d0cc", "SOLVENCY_THRESHOLD()", {}, p.uint256),
    WETH: viewFun("0xad5c4648", "WETH()", {}, p.address),
    allowedWethShareEnd: viewFun("0x042e586e", "allowedWethShareEnd()", {}, p.uint256),
    allowedWethShareStart: viewFun("0x571fbf60", "allowedWethShareStart()", {}, p.uint256),
    assetToPToken: viewFun("0x0fc3b4c4", "assetToPToken(address)", {"_0": p.address}, p.address),
    checkBalance: viewFun("0x5f515226", "checkBalance(address)", {"_asset": p.address}, p.uint256),
    clGauge: viewFun("0x3d6953d7", "clGauge()", {}, p.address),
    clPool: viewFun("0x4c0339b4", "clPool()", {}, p.address),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    collectRewardTokens: fun("0x5a063f63", "collectRewardTokens()", {}, ),
    deposit: fun("0x47e7ef24", "deposit(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    depositAll: fun("0xde5f6268", "depositAll()", {}, ),
    getCurrentTradingTick: viewFun("0x30dbda18", "getCurrentTradingTick()", {}, p.int24),
    getPoolX96Price: viewFun("0x30c83576", "getPoolX96Price()", {}, p.uint160),
    getPositionPrincipal: viewFun("0x45557c1f", "getPositionPrincipal()", {}, {"_amountWeth": p.uint256, "_amountOethb": p.uint256}),
    getRewardTokenAddresses: viewFun("0xf6ca71b0", "getRewardTokenAddresses()", {}, p.array(p.address)),
    getWETHShare: viewFun("0xcd8b36c7", "getWETHShare()", {}, p.uint256),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    harvesterAddress: viewFun("0x67c7066c", "harvesterAddress()", {}, p.address),
    helper: viewFun("0x63b0e66a", "helper()", {}, p.address),
    initialize: fun("0xa224cee7", "initialize(address[])", {"_rewardTokenAddresses": p.array(p.address)}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    lowerTick: viewFun("0x9b1344ac", "lowerTick()", {}, p.int24),
    onERC721Received: fun("0x150b7a02", "onERC721Received(address,address,uint256,bytes)", {"_0": p.address, "_1": p.address, "_2": p.uint256, "_3": p.bytes}, p.bytes4),
    platformAddress: viewFun("0xdbe55e56", "platformAddress()", {}, p.address),
    positionManager: viewFun("0x791b98bc", "positionManager()", {}, p.address),
    rebalance: fun("0x7f1a327c", "rebalance(uint256,bool,uint256)", {"_amountToSwap": p.uint256, "_swapWeth": p.bool, "_minTokenReceived": p.uint256}, ),
    removePToken: fun("0x9136616a", "removePToken(uint256)", {"_0": p.uint256}, ),
    rewardTokenAddresses: viewFun("0x7b2d9b2c", "rewardTokenAddresses(uint256)", {"_0": p.uint256}, p.address),
    safeApproveAllTokens: fun("0xad1728cb", "safeApproveAllTokens()", {}, ),
    setAllowedPoolWethShareInterval: fun("0x01701fe9", "setAllowedPoolWethShareInterval(uint256,uint256)", {"_allowedWethShareStart": p.uint256, "_allowedWethShareEnd": p.uint256}, ),
    setHarvesterAddress: fun("0xc2e1e3f4", "setHarvesterAddress(address)", {"_harvesterAddress": p.address}, ),
    setPTokenAddress: fun("0x0ed57b3a", "setPTokenAddress(address,address)", {"_0": p.address, "_1": p.address}, ),
    setRewardTokenAddresses: fun("0x96d538bb", "setRewardTokenAddresses(address[])", {"_rewardTokenAddresses": p.array(p.address)}, ),
    sqrtRatioX96TickClosestToParity: viewFun("0x4bc9c477", "sqrtRatioX96TickClosestToParity()", {}, p.uint160),
    sqrtRatioX96TickHigher: viewFun("0x65f1389d", "sqrtRatioX96TickHigher()", {}, p.uint160),
    sqrtRatioX96TickLower: viewFun("0x153eb6d1", "sqrtRatioX96TickLower()", {}, p.uint160),
    supportsAsset: viewFun("0xaa388af6", "supportsAsset(address)", {"_asset": p.address}, p.bool),
    swapRouter: viewFun("0xc31c9c07", "swapRouter()", {}, p.address),
    tickSpacing: viewFun("0xd0c93a7c", "tickSpacing()", {}, p.int24),
    tokenId: viewFun("0x17d70f7c", "tokenId()", {}, p.uint256),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", "transferToken(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    underlyingAssets: viewFun("0x9c1eb3da", "underlyingAssets()", {}, p.uint256),
    upperTick: viewFun("0x727dd228", "upperTick()", {}, p.int24),
    vaultAddress: viewFun("0x430bf08a", "vaultAddress()", {}, p.address),
    withdraw: fun("0xd9caed12", "withdraw(address,address,uint256)", {"_recipient": p.address, "_asset": p.address, "_amount": p.uint256}, ),
    withdrawAll: fun("0x853828b6", "withdrawAll()", {}, ),
}

export class Contract extends ContractBase {

    OETHb() {
        return this.eth_call(functions.OETHb, {})
    }

    SOLVENCY_THRESHOLD() {
        return this.eth_call(functions.SOLVENCY_THRESHOLD, {})
    }

    WETH() {
        return this.eth_call(functions.WETH, {})
    }

    allowedWethShareEnd() {
        return this.eth_call(functions.allowedWethShareEnd, {})
    }

    allowedWethShareStart() {
        return this.eth_call(functions.allowedWethShareStart, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(functions.assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(functions.checkBalance, {_asset})
    }

    clGauge() {
        return this.eth_call(functions.clGauge, {})
    }

    clPool() {
        return this.eth_call(functions.clPool, {})
    }

    getCurrentTradingTick() {
        return this.eth_call(functions.getCurrentTradingTick, {})
    }

    getPoolX96Price() {
        return this.eth_call(functions.getPoolX96Price, {})
    }

    getPositionPrincipal() {
        return this.eth_call(functions.getPositionPrincipal, {})
    }

    getRewardTokenAddresses() {
        return this.eth_call(functions.getRewardTokenAddresses, {})
    }

    getWETHShare() {
        return this.eth_call(functions.getWETHShare, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    harvesterAddress() {
        return this.eth_call(functions.harvesterAddress, {})
    }

    helper() {
        return this.eth_call(functions.helper, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    lowerTick() {
        return this.eth_call(functions.lowerTick, {})
    }

    platformAddress() {
        return this.eth_call(functions.platformAddress, {})
    }

    positionManager() {
        return this.eth_call(functions.positionManager, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(functions.rewardTokenAddresses, {_0})
    }

    sqrtRatioX96TickClosestToParity() {
        return this.eth_call(functions.sqrtRatioX96TickClosestToParity, {})
    }

    sqrtRatioX96TickHigher() {
        return this.eth_call(functions.sqrtRatioX96TickHigher, {})
    }

    sqrtRatioX96TickLower() {
        return this.eth_call(functions.sqrtRatioX96TickLower, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(functions.supportsAsset, {_asset})
    }

    swapRouter() {
        return this.eth_call(functions.swapRouter, {})
    }

    tickSpacing() {
        return this.eth_call(functions.tickSpacing, {})
    }

    tokenId() {
        return this.eth_call(functions.tokenId, {})
    }

    underlyingAssets() {
        return this.eth_call(functions.underlyingAssets, {})
    }

    upperTick() {
        return this.eth_call(functions.upperTick, {})
    }

    vaultAddress() {
        return this.eth_call(functions.vaultAddress, {})
    }
}

/// Event types
export type DepositEventArgs = EParams<typeof events.Deposit>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type HarvesterAddressesUpdatedEventArgs = EParams<typeof events.HarvesterAddressesUpdated>
export type LiquidityAddedEventArgs = EParams<typeof events.LiquidityAdded>
export type LiquidityRemovedEventArgs = EParams<typeof events.LiquidityRemoved>
export type PTokenAddedEventArgs = EParams<typeof events.PTokenAdded>
export type PTokenRemovedEventArgs = EParams<typeof events.PTokenRemoved>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type PoolRebalancedEventArgs = EParams<typeof events.PoolRebalanced>
export type PoolWethShareIntervalUpdatedEventArgs = EParams<typeof events.PoolWethShareIntervalUpdated>
export type RewardTokenAddressesUpdatedEventArgs = EParams<typeof events.RewardTokenAddressesUpdated>
export type RewardTokenCollectedEventArgs = EParams<typeof events.RewardTokenCollected>
export type UnderlyingAssetsUpdatedEventArgs = EParams<typeof events.UnderlyingAssetsUpdated>
export type WithdrawalEventArgs = EParams<typeof events.Withdrawal>

/// Function types
export type OETHbParams = FunctionArguments<typeof functions.OETHb>
export type OETHbReturn = FunctionReturn<typeof functions.OETHb>

export type SOLVENCY_THRESHOLDParams = FunctionArguments<typeof functions.SOLVENCY_THRESHOLD>
export type SOLVENCY_THRESHOLDReturn = FunctionReturn<typeof functions.SOLVENCY_THRESHOLD>

export type WETHParams = FunctionArguments<typeof functions.WETH>
export type WETHReturn = FunctionReturn<typeof functions.WETH>

export type AllowedWethShareEndParams = FunctionArguments<typeof functions.allowedWethShareEnd>
export type AllowedWethShareEndReturn = FunctionReturn<typeof functions.allowedWethShareEnd>

export type AllowedWethShareStartParams = FunctionArguments<typeof functions.allowedWethShareStart>
export type AllowedWethShareStartReturn = FunctionReturn<typeof functions.allowedWethShareStart>

export type AssetToPTokenParams = FunctionArguments<typeof functions.assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof functions.assetToPToken>

export type CheckBalanceParams = FunctionArguments<typeof functions.checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof functions.checkBalance>

export type ClGaugeParams = FunctionArguments<typeof functions.clGauge>
export type ClGaugeReturn = FunctionReturn<typeof functions.clGauge>

export type ClPoolParams = FunctionArguments<typeof functions.clPool>
export type ClPoolReturn = FunctionReturn<typeof functions.clPool>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectRewardTokensParams = FunctionArguments<typeof functions.collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof functions.collectRewardTokens>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type GetCurrentTradingTickParams = FunctionArguments<typeof functions.getCurrentTradingTick>
export type GetCurrentTradingTickReturn = FunctionReturn<typeof functions.getCurrentTradingTick>

export type GetPoolX96PriceParams = FunctionArguments<typeof functions.getPoolX96Price>
export type GetPoolX96PriceReturn = FunctionReturn<typeof functions.getPoolX96Price>

export type GetPositionPrincipalParams = FunctionArguments<typeof functions.getPositionPrincipal>
export type GetPositionPrincipalReturn = FunctionReturn<typeof functions.getPositionPrincipal>

export type GetRewardTokenAddressesParams = FunctionArguments<typeof functions.getRewardTokenAddresses>
export type GetRewardTokenAddressesReturn = FunctionReturn<typeof functions.getRewardTokenAddresses>

export type GetWETHShareParams = FunctionArguments<typeof functions.getWETHShare>
export type GetWETHShareReturn = FunctionReturn<typeof functions.getWETHShare>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type HarvesterAddressParams = FunctionArguments<typeof functions.harvesterAddress>
export type HarvesterAddressReturn = FunctionReturn<typeof functions.harvesterAddress>

export type HelperParams = FunctionArguments<typeof functions.helper>
export type HelperReturn = FunctionReturn<typeof functions.helper>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type LowerTickParams = FunctionArguments<typeof functions.lowerTick>
export type LowerTickReturn = FunctionReturn<typeof functions.lowerTick>

export type OnERC721ReceivedParams = FunctionArguments<typeof functions.onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof functions.onERC721Received>

export type PlatformAddressParams = FunctionArguments<typeof functions.platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof functions.platformAddress>

export type PositionManagerParams = FunctionArguments<typeof functions.positionManager>
export type PositionManagerReturn = FunctionReturn<typeof functions.positionManager>

export type RebalanceParams = FunctionArguments<typeof functions.rebalance>
export type RebalanceReturn = FunctionReturn<typeof functions.rebalance>

export type RemovePTokenParams = FunctionArguments<typeof functions.removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof functions.removePToken>

export type RewardTokenAddressesParams = FunctionArguments<typeof functions.rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof functions.rewardTokenAddresses>

export type SafeApproveAllTokensParams = FunctionArguments<typeof functions.safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof functions.safeApproveAllTokens>

export type SetAllowedPoolWethShareIntervalParams = FunctionArguments<typeof functions.setAllowedPoolWethShareInterval>
export type SetAllowedPoolWethShareIntervalReturn = FunctionReturn<typeof functions.setAllowedPoolWethShareInterval>

export type SetHarvesterAddressParams = FunctionArguments<typeof functions.setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof functions.setHarvesterAddress>

export type SetPTokenAddressParams = FunctionArguments<typeof functions.setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof functions.setPTokenAddress>

export type SetRewardTokenAddressesParams = FunctionArguments<typeof functions.setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof functions.setRewardTokenAddresses>

export type SqrtRatioX96TickClosestToParityParams = FunctionArguments<typeof functions.sqrtRatioX96TickClosestToParity>
export type SqrtRatioX96TickClosestToParityReturn = FunctionReturn<typeof functions.sqrtRatioX96TickClosestToParity>

export type SqrtRatioX96TickHigherParams = FunctionArguments<typeof functions.sqrtRatioX96TickHigher>
export type SqrtRatioX96TickHigherReturn = FunctionReturn<typeof functions.sqrtRatioX96TickHigher>

export type SqrtRatioX96TickLowerParams = FunctionArguments<typeof functions.sqrtRatioX96TickLower>
export type SqrtRatioX96TickLowerReturn = FunctionReturn<typeof functions.sqrtRatioX96TickLower>

export type SupportsAssetParams = FunctionArguments<typeof functions.supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof functions.supportsAsset>

export type SwapRouterParams = FunctionArguments<typeof functions.swapRouter>
export type SwapRouterReturn = FunctionReturn<typeof functions.swapRouter>

export type TickSpacingParams = FunctionArguments<typeof functions.tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof functions.tickSpacing>

export type TokenIdParams = FunctionArguments<typeof functions.tokenId>
export type TokenIdReturn = FunctionReturn<typeof functions.tokenId>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

export type UnderlyingAssetsParams = FunctionArguments<typeof functions.underlyingAssets>
export type UnderlyingAssetsReturn = FunctionReturn<typeof functions.underlyingAssets>

export type UpperTickParams = FunctionArguments<typeof functions.upperTick>
export type UpperTickReturn = FunctionReturn<typeof functions.upperTick>

export type VaultAddressParams = FunctionArguments<typeof functions.vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof functions.vaultAddress>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

