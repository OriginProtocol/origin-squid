import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    StrategistUpdated: event("0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee", {"_address": p.address}),
    StrategyTypeChanged: event("0x7fab7e3127613cf3a72eafc4bfcb3e179d35d1c69e1d0217c1dd029dc23690bd", {"strategyAddr": indexed(p.address), "kind": p.uint8}),
}

export const functions = {
    ETH_ADDR: fun("0x7753f47b", {}, p.address),
    WETH_ADDR: fun("0x82dfc5f7", {}, p.address),
    assetCount: fun("0xeafe7a74", {}, p.uint256),
    assets: fun("0xcf35bdd0", {"_0": p.uint256}, p.address),
    cacheStrategies: fun("0x44f98829", {}, ),
    claimGovernance: fun("0x5d36b190", {}, ),
    curvePoolCoinCount: fun("0xdd6640c3", {"_0": p.address}, p.uint256),
    getStrategyAssetBalance: fun("0x3a1d532b", {"strategyAddr": p.address, "asset": p.address}, p.uint256),
    getStrategyBalances: fun("0xe50bf68f", {"strategyAddr": p.address}, {"supportedAssets": p.array(p.address), "assetBalances": p.array(p.uint256)}),
    governor: fun("0x0c340a24", {}, p.address),
    initialize: fun("0xe336f8c5", {"_strategistAddr": p.address, "_strategies": p.array(p.address), "strategyKinds": p.array(p.uint8)}, ),
    isGovernor: fun("0xc7af3352", {}, p.bool),
    oToken: fun("0x1a32aad6", {}, p.address),
    oracleRouter: fun("0x55a29e91", {}, p.address),
    setStrategistAddr: fun("0x773540b3", {"_address": p.address}, ),
    setStrategyKind: fun("0xaefc61e0", {"strategy": p.address, "kind": p.uint8}, ),
    strategies: fun("0xd574ea3d", {"_0": p.uint256}, p.address),
    strategistAddr: fun("0x570d8e1d", {}, p.address),
    strategyConfig: fun("0x91450e63", {"_0": p.address}, {"supported": p.bool, "kind": p.uint8}),
    transferGovernance: fun("0xd38bfff4", {"_newGovernor": p.address}, ),
    vault: fun("0xfbfa77cf", {}, p.address),
}

export class Contract extends ContractBase {

    ETH_ADDR() {
        return this.eth_call(functions.ETH_ADDR, {})
    }

    WETH_ADDR() {
        return this.eth_call(functions.WETH_ADDR, {})
    }

    assetCount() {
        return this.eth_call(functions.assetCount, {})
    }

    assets(_0: AssetsParams["_0"]) {
        return this.eth_call(functions.assets, {_0})
    }

    curvePoolCoinCount(_0: CurvePoolCoinCountParams["_0"]) {
        return this.eth_call(functions.curvePoolCoinCount, {_0})
    }

    getStrategyAssetBalance(strategyAddr: GetStrategyAssetBalanceParams["strategyAddr"], asset: GetStrategyAssetBalanceParams["asset"]) {
        return this.eth_call(functions.getStrategyAssetBalance, {strategyAddr, asset})
    }

    getStrategyBalances(strategyAddr: GetStrategyBalancesParams["strategyAddr"]) {
        return this.eth_call(functions.getStrategyBalances, {strategyAddr})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    oToken() {
        return this.eth_call(functions.oToken, {})
    }

    oracleRouter() {
        return this.eth_call(functions.oracleRouter, {})
    }

    strategies(_0: StrategiesParams["_0"]) {
        return this.eth_call(functions.strategies, {_0})
    }

    strategistAddr() {
        return this.eth_call(functions.strategistAddr, {})
    }

    strategyConfig(_0: StrategyConfigParams["_0"]) {
        return this.eth_call(functions.strategyConfig, {_0})
    }

    vault() {
        return this.eth_call(functions.vault, {})
    }
}

/// Event types
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type StrategistUpdatedEventArgs = EParams<typeof events.StrategistUpdated>
export type StrategyTypeChangedEventArgs = EParams<typeof events.StrategyTypeChanged>

/// Function types
export type ETH_ADDRParams = FunctionArguments<typeof functions.ETH_ADDR>
export type ETH_ADDRReturn = FunctionReturn<typeof functions.ETH_ADDR>

export type WETH_ADDRParams = FunctionArguments<typeof functions.WETH_ADDR>
export type WETH_ADDRReturn = FunctionReturn<typeof functions.WETH_ADDR>

export type AssetCountParams = FunctionArguments<typeof functions.assetCount>
export type AssetCountReturn = FunctionReturn<typeof functions.assetCount>

export type AssetsParams = FunctionArguments<typeof functions.assets>
export type AssetsReturn = FunctionReturn<typeof functions.assets>

export type CacheStrategiesParams = FunctionArguments<typeof functions.cacheStrategies>
export type CacheStrategiesReturn = FunctionReturn<typeof functions.cacheStrategies>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CurvePoolCoinCountParams = FunctionArguments<typeof functions.curvePoolCoinCount>
export type CurvePoolCoinCountReturn = FunctionReturn<typeof functions.curvePoolCoinCount>

export type GetStrategyAssetBalanceParams = FunctionArguments<typeof functions.getStrategyAssetBalance>
export type GetStrategyAssetBalanceReturn = FunctionReturn<typeof functions.getStrategyAssetBalance>

export type GetStrategyBalancesParams = FunctionArguments<typeof functions.getStrategyBalances>
export type GetStrategyBalancesReturn = FunctionReturn<typeof functions.getStrategyBalances>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type OTokenParams = FunctionArguments<typeof functions.oToken>
export type OTokenReturn = FunctionReturn<typeof functions.oToken>

export type OracleRouterParams = FunctionArguments<typeof functions.oracleRouter>
export type OracleRouterReturn = FunctionReturn<typeof functions.oracleRouter>

export type SetStrategistAddrParams = FunctionArguments<typeof functions.setStrategistAddr>
export type SetStrategistAddrReturn = FunctionReturn<typeof functions.setStrategistAddr>

export type SetStrategyKindParams = FunctionArguments<typeof functions.setStrategyKind>
export type SetStrategyKindReturn = FunctionReturn<typeof functions.setStrategyKind>

export type StrategiesParams = FunctionArguments<typeof functions.strategies>
export type StrategiesReturn = FunctionReturn<typeof functions.strategies>

export type StrategistAddrParams = FunctionArguments<typeof functions.strategistAddr>
export type StrategistAddrReturn = FunctionReturn<typeof functions.strategistAddr>

export type StrategyConfigParams = FunctionArguments<typeof functions.strategyConfig>
export type StrategyConfigReturn = FunctionReturn<typeof functions.strategyConfig>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type VaultParams = FunctionArguments<typeof functions.vault>
export type VaultReturn = FunctionReturn<typeof functions.vault>

