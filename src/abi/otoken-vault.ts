import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AllocateThresholdUpdated: event("0x2ec5fb5a3d2703edc461252d92ccd2799c3c74f01d97212b20388207fa17ae45", {"_threshold": p.uint256}),
    AssetAllocated: event("0x41b99659f6ba0803f444aff29e5bf6e26dd86a3219aff92119d69710a956ba8d", {"_asset": p.address, "_strategy": p.address, "_amount": p.uint256}),
    AssetDefaultStrategyUpdated: event("0xba58ce12801c949fa65f41c46ed108671c219baf945fa48d21026cea99ff252a", {"_asset": p.address, "_strategy": p.address}),
    AssetSupported: event("0x4f1ac48525e50059cc1cc6e0e1940ece0dd653a4db4841538d6aef036be2fb7b", {"_asset": p.address}),
    CapitalPaused: event("0x71f0e5b62f846a22e0b4d159e516e62fa9c2b8eb570be15f83e67d98a2ee51e0", {}),
    CapitalUnpaused: event("0x891ebab18da80ebeeea06b1b1cede098329c4c008906a98370c2ac7a80b571cb", {}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    MaxSupplyDiffChanged: event("0x95201f9c21f26877223b1ff4073936a6484c35495649e60e55730497aeb60d93", {"maxSupplyDiff": p.uint256}),
    Mint: event("0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885", {"_addr": p.address, "_value": p.uint256}),
    NetOusdMintForStrategyThresholdChanged: event("0xc29d6fedbc6bdf267a08166c2b976fbd72aca5d6a769528616f8b9224c8f197f", {"_threshold": p.uint256}),
    OusdMetaStrategyUpdated: event("0xa12850fb726e0b2b7b3c9a9342031e1268a8148d0eb06b4bea8613204ffcd2b8", {"_ousdMetaStrategy": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PriceProviderUpdated: event("0xb266add5f3044b17d27db796af992cecbe413921b4e8aaaee03c719e16b9806a", {"_priceProvider": p.address}),
    RebasePaused: event("0x8cff26a5985614b3d30629cc4ab83824bf115aec971b718d8f2f99562032e972", {}),
    RebaseThresholdUpdated: event("0x39367850377ac04920a9a670f2180e7a94d83b15ad302e59875ec58fd10bd37d", {"_threshold": p.uint256}),
    RebaseUnpaused: event("0xbc044409505c95b6b851433df96e1beae715c909d8e7c1d6d7ab783300d4e3b9", {}),
    Redeem: event("0x222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a6", {"_addr": p.address, "_value": p.uint256}),
    RedeemFeeUpdated: event("0xd6c7508d6658ccee36b7b7d7fd72e5cbaeefb40c64eff24e9ae7470e846304ee", {"_redeemFeeBps": p.uint256}),
    StrategistUpdated: event("0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee", {"_address": p.address}),
    StrategyApproved: event("0x960dd94cbb79169f09a4e445d58b895df2d9bffa5b31055d0932d801724a20d1", {"_addr": p.address}),
    StrategyRemoved: event("0x09a1db4b80c32706328728508c941a6b954f31eb5affd32f236c1fd405f8fea4", {"_addr": p.address}),
    SwapAllowedUndervalueChanged: event("0xf12c00256bee2b6facb111a88a9b1cff86e79132939b44f1353212d6f7469557", {"_basis": p.uint256}),
    SwapSlippageChanged: event("0x8d22e9d2cbe8bb65a3c4412bd8970743864512a1a0e004e8d00fb96277b78b94", {"_asset": p.address, "_basis": p.uint256}),
    Swapped: event("0xa078c4190abe07940190effc1846be0ccf03ad6007bc9e93f9697d0b460befbb", {"_fromAsset": indexed(p.address), "_toAsset": indexed(p.address), "_fromAssetAmount": p.uint256, "_toAssetAmount": p.uint256}),
    SwapperChanged: event("0x7d7719313229e558c5a3893cad2eb86a86a049156d1d9ebd5c63a8eedefd1c03", {"_address": p.address}),
    TrusteeAddressChanged: event("0x1e4af5ac389e8cde1bdaa6830881b6c987c62a45cfb3b33d27d805cde3b57750", {"_address": p.address}),
    TrusteeFeeBpsChanged: event("0x56287a45051933ea374811b3d5d165033047be5572cac676f7c28b8be4f746c7", {"_basis": p.uint256}),
    VaultBufferUpdated: event("0x41ecb23a0e7865b25f38c268b7c3012220d822929e9edff07326e89d5bb822b5", {"_vaultBuffer": p.uint256}),
    YieldDistribution: event("0x09516ecf4a8a86e59780a9befc6dee948bc9e60a36e3be68d31ea817ee8d2c80", {"_to": p.address, "_yield": p.uint256, "_fee": p.uint256}),
}

export const functions = {
    allocate: fun("0xabaa9916", {}, ),
    assetDefaultStrategies: fun("0xa403e4d5", {"_0": p.address}, p.address),
    autoAllocateThreshold: fun("0x9fa1826e", {}, p.uint256),
    burnForStrategy: fun("0x6217f3ea", {"_amount": p.uint256}, ),
    calculateRedeemOutputs: fun("0x67bd7ba3", {"_amount": p.uint256}, p.array(p.uint256)),
    capitalPaused: fun("0xe6cc5432", {}, p.bool),
    checkBalance: fun("0x5f515226", {"_asset": p.address}, p.uint256),
    claimGovernance: fun("0x5d36b190", {}, ),
    getAllAssets: fun("0x2acada4d", {}, p.array(p.address)),
    getAllStrategies: fun("0xc3b28864", {}, p.array(p.address)),
    getAssetConfig: fun("0x6ec3ab67", {"_asset": p.address}, p.struct({"isSupported": p.bool, "unitConversion": p.uint8, "decimals": p.uint8, "allowedOracleSlippageBps": p.uint16})),
    getAssetCount: fun("0xa0aead4d", {}, p.uint256),
    getStrategyCount: fun("0x31e19cfa", {}, p.uint256),
    governor: fun("0x0c340a24", {}, p.address),
    isGovernor: fun("0xc7af3352", {}, p.bool),
    isSupportedAsset: fun("0x9be918e6", {"_asset": p.address}, p.bool),
    maxSupplyDiff: fun("0x8e510b52", {}, p.uint256),
    mint: fun("0x156e29f6", {"_asset": p.address, "_amount": p.uint256, "_minimumOusdAmount": p.uint256}, ),
    mintForStrategy: fun("0xab80dafb", {"_amount": p.uint256}, ),
    netOusdMintForStrategyThreshold: fun("0x7a2202f3", {}, p.uint256),
    netOusdMintedForStrategy: fun("0xe45cc9f0", {}, p.int256),
    ousdMetaStrategy: fun("0x18ce56bd", {}, p.address),
    priceProvider: fun("0xb888879e", {}, p.address),
    priceUnitMint: fun("0x3b8fe28d", {"asset": p.address}, p.uint256),
    priceUnitRedeem: fun("0x5b60f9fc", {"asset": p.address}, p.uint256),
    rebase: fun("0xaf14052c", {}, ),
    rebasePaused: fun("0x53ca9f24", {}, p.bool),
    rebaseThreshold: fun("0x52d38e5d", {}, p.uint256),
    redeem: fun("0x7cbc2373", {"_amount": p.uint256, "_minimumUnitAmount": p.uint256}, ),
    redeemAll: fun("0x7136a7a6", {"_minimumUnitAmount": p.uint256}, ),
    redeemFeeBps: fun("0x09f6442c", {}, p.uint256),
    setAdminImpl: fun("0xfc0cfeee", {"newImpl": p.address}, ),
    strategistAddr: fun("0x570d8e1d", {}, p.address),
    totalValue: fun("0xd4c3eea0", {}, p.uint256),
    transferGovernance: fun("0xd38bfff4", {"_newGovernor": p.address}, ),
    trusteeAddress: fun("0x49c1d54d", {}, p.address),
    trusteeFeeBps: fun("0x207134b0", {}, p.uint256),
    vaultBuffer: fun("0x1edfe3da", {}, p.uint256),
}

export class Contract extends ContractBase {

    assetDefaultStrategies(_0: AssetDefaultStrategiesParams["_0"]) {
        return this.eth_call(functions.assetDefaultStrategies, {_0})
    }

    autoAllocateThreshold() {
        return this.eth_call(functions.autoAllocateThreshold, {})
    }

    calculateRedeemOutputs(_amount: CalculateRedeemOutputsParams["_amount"]) {
        return this.eth_call(functions.calculateRedeemOutputs, {_amount})
    }

    capitalPaused() {
        return this.eth_call(functions.capitalPaused, {})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(functions.checkBalance, {_asset})
    }

    getAllAssets() {
        return this.eth_call(functions.getAllAssets, {})
    }

    getAllStrategies() {
        return this.eth_call(functions.getAllStrategies, {})
    }

    getAssetConfig(_asset: GetAssetConfigParams["_asset"]) {
        return this.eth_call(functions.getAssetConfig, {_asset})
    }

    getAssetCount() {
        return this.eth_call(functions.getAssetCount, {})
    }

    getStrategyCount() {
        return this.eth_call(functions.getStrategyCount, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    isSupportedAsset(_asset: IsSupportedAssetParams["_asset"]) {
        return this.eth_call(functions.isSupportedAsset, {_asset})
    }

    maxSupplyDiff() {
        return this.eth_call(functions.maxSupplyDiff, {})
    }

    netOusdMintForStrategyThreshold() {
        return this.eth_call(functions.netOusdMintForStrategyThreshold, {})
    }

    netOusdMintedForStrategy() {
        return this.eth_call(functions.netOusdMintedForStrategy, {})
    }

    ousdMetaStrategy() {
        return this.eth_call(functions.ousdMetaStrategy, {})
    }

    priceProvider() {
        return this.eth_call(functions.priceProvider, {})
    }

    priceUnitMint(asset: PriceUnitMintParams["asset"]) {
        return this.eth_call(functions.priceUnitMint, {asset})
    }

    priceUnitRedeem(asset: PriceUnitRedeemParams["asset"]) {
        return this.eth_call(functions.priceUnitRedeem, {asset})
    }

    rebasePaused() {
        return this.eth_call(functions.rebasePaused, {})
    }

    rebaseThreshold() {
        return this.eth_call(functions.rebaseThreshold, {})
    }

    redeemFeeBps() {
        return this.eth_call(functions.redeemFeeBps, {})
    }

    strategistAddr() {
        return this.eth_call(functions.strategistAddr, {})
    }

    totalValue() {
        return this.eth_call(functions.totalValue, {})
    }

    trusteeAddress() {
        return this.eth_call(functions.trusteeAddress, {})
    }

    trusteeFeeBps() {
        return this.eth_call(functions.trusteeFeeBps, {})
    }

    vaultBuffer() {
        return this.eth_call(functions.vaultBuffer, {})
    }
}

/// Event types
export type AllocateThresholdUpdatedEventArgs = EParams<typeof events.AllocateThresholdUpdated>
export type AssetAllocatedEventArgs = EParams<typeof events.AssetAllocated>
export type AssetDefaultStrategyUpdatedEventArgs = EParams<typeof events.AssetDefaultStrategyUpdated>
export type AssetSupportedEventArgs = EParams<typeof events.AssetSupported>
export type CapitalPausedEventArgs = EParams<typeof events.CapitalPaused>
export type CapitalUnpausedEventArgs = EParams<typeof events.CapitalUnpaused>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type MaxSupplyDiffChangedEventArgs = EParams<typeof events.MaxSupplyDiffChanged>
export type MintEventArgs = EParams<typeof events.Mint>
export type NetOusdMintForStrategyThresholdChangedEventArgs = EParams<typeof events.NetOusdMintForStrategyThresholdChanged>
export type OusdMetaStrategyUpdatedEventArgs = EParams<typeof events.OusdMetaStrategyUpdated>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type PriceProviderUpdatedEventArgs = EParams<typeof events.PriceProviderUpdated>
export type RebasePausedEventArgs = EParams<typeof events.RebasePaused>
export type RebaseThresholdUpdatedEventArgs = EParams<typeof events.RebaseThresholdUpdated>
export type RebaseUnpausedEventArgs = EParams<typeof events.RebaseUnpaused>
export type RedeemEventArgs = EParams<typeof events.Redeem>
export type RedeemFeeUpdatedEventArgs = EParams<typeof events.RedeemFeeUpdated>
export type StrategistUpdatedEventArgs = EParams<typeof events.StrategistUpdated>
export type StrategyApprovedEventArgs = EParams<typeof events.StrategyApproved>
export type StrategyRemovedEventArgs = EParams<typeof events.StrategyRemoved>
export type SwapAllowedUndervalueChangedEventArgs = EParams<typeof events.SwapAllowedUndervalueChanged>
export type SwapSlippageChangedEventArgs = EParams<typeof events.SwapSlippageChanged>
export type SwappedEventArgs = EParams<typeof events.Swapped>
export type SwapperChangedEventArgs = EParams<typeof events.SwapperChanged>
export type TrusteeAddressChangedEventArgs = EParams<typeof events.TrusteeAddressChanged>
export type TrusteeFeeBpsChangedEventArgs = EParams<typeof events.TrusteeFeeBpsChanged>
export type VaultBufferUpdatedEventArgs = EParams<typeof events.VaultBufferUpdated>
export type YieldDistributionEventArgs = EParams<typeof events.YieldDistribution>

/// Function types
export type AllocateParams = FunctionArguments<typeof functions.allocate>
export type AllocateReturn = FunctionReturn<typeof functions.allocate>

export type AssetDefaultStrategiesParams = FunctionArguments<typeof functions.assetDefaultStrategies>
export type AssetDefaultStrategiesReturn = FunctionReturn<typeof functions.assetDefaultStrategies>

export type AutoAllocateThresholdParams = FunctionArguments<typeof functions.autoAllocateThreshold>
export type AutoAllocateThresholdReturn = FunctionReturn<typeof functions.autoAllocateThreshold>

export type BurnForStrategyParams = FunctionArguments<typeof functions.burnForStrategy>
export type BurnForStrategyReturn = FunctionReturn<typeof functions.burnForStrategy>

export type CalculateRedeemOutputsParams = FunctionArguments<typeof functions.calculateRedeemOutputs>
export type CalculateRedeemOutputsReturn = FunctionReturn<typeof functions.calculateRedeemOutputs>

export type CapitalPausedParams = FunctionArguments<typeof functions.capitalPaused>
export type CapitalPausedReturn = FunctionReturn<typeof functions.capitalPaused>

export type CheckBalanceParams = FunctionArguments<typeof functions.checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof functions.checkBalance>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type GetAllAssetsParams = FunctionArguments<typeof functions.getAllAssets>
export type GetAllAssetsReturn = FunctionReturn<typeof functions.getAllAssets>

export type GetAllStrategiesParams = FunctionArguments<typeof functions.getAllStrategies>
export type GetAllStrategiesReturn = FunctionReturn<typeof functions.getAllStrategies>

export type GetAssetConfigParams = FunctionArguments<typeof functions.getAssetConfig>
export type GetAssetConfigReturn = FunctionReturn<typeof functions.getAssetConfig>

export type GetAssetCountParams = FunctionArguments<typeof functions.getAssetCount>
export type GetAssetCountReturn = FunctionReturn<typeof functions.getAssetCount>

export type GetStrategyCountParams = FunctionArguments<typeof functions.getStrategyCount>
export type GetStrategyCountReturn = FunctionReturn<typeof functions.getStrategyCount>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type IsSupportedAssetParams = FunctionArguments<typeof functions.isSupportedAsset>
export type IsSupportedAssetReturn = FunctionReturn<typeof functions.isSupportedAsset>

export type MaxSupplyDiffParams = FunctionArguments<typeof functions.maxSupplyDiff>
export type MaxSupplyDiffReturn = FunctionReturn<typeof functions.maxSupplyDiff>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type MintForStrategyParams = FunctionArguments<typeof functions.mintForStrategy>
export type MintForStrategyReturn = FunctionReturn<typeof functions.mintForStrategy>

export type NetOusdMintForStrategyThresholdParams = FunctionArguments<typeof functions.netOusdMintForStrategyThreshold>
export type NetOusdMintForStrategyThresholdReturn = FunctionReturn<typeof functions.netOusdMintForStrategyThreshold>

export type NetOusdMintedForStrategyParams = FunctionArguments<typeof functions.netOusdMintedForStrategy>
export type NetOusdMintedForStrategyReturn = FunctionReturn<typeof functions.netOusdMintedForStrategy>

export type OusdMetaStrategyParams = FunctionArguments<typeof functions.ousdMetaStrategy>
export type OusdMetaStrategyReturn = FunctionReturn<typeof functions.ousdMetaStrategy>

export type PriceProviderParams = FunctionArguments<typeof functions.priceProvider>
export type PriceProviderReturn = FunctionReturn<typeof functions.priceProvider>

export type PriceUnitMintParams = FunctionArguments<typeof functions.priceUnitMint>
export type PriceUnitMintReturn = FunctionReturn<typeof functions.priceUnitMint>

export type PriceUnitRedeemParams = FunctionArguments<typeof functions.priceUnitRedeem>
export type PriceUnitRedeemReturn = FunctionReturn<typeof functions.priceUnitRedeem>

export type RebaseParams = FunctionArguments<typeof functions.rebase>
export type RebaseReturn = FunctionReturn<typeof functions.rebase>

export type RebasePausedParams = FunctionArguments<typeof functions.rebasePaused>
export type RebasePausedReturn = FunctionReturn<typeof functions.rebasePaused>

export type RebaseThresholdParams = FunctionArguments<typeof functions.rebaseThreshold>
export type RebaseThresholdReturn = FunctionReturn<typeof functions.rebaseThreshold>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RedeemAllParams = FunctionArguments<typeof functions.redeemAll>
export type RedeemAllReturn = FunctionReturn<typeof functions.redeemAll>

export type RedeemFeeBpsParams = FunctionArguments<typeof functions.redeemFeeBps>
export type RedeemFeeBpsReturn = FunctionReturn<typeof functions.redeemFeeBps>

export type SetAdminImplParams = FunctionArguments<typeof functions.setAdminImpl>
export type SetAdminImplReturn = FunctionReturn<typeof functions.setAdminImpl>

export type StrategistAddrParams = FunctionArguments<typeof functions.strategistAddr>
export type StrategistAddrReturn = FunctionReturn<typeof functions.strategistAddr>

export type TotalValueParams = FunctionArguments<typeof functions.totalValue>
export type TotalValueReturn = FunctionReturn<typeof functions.totalValue>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TrusteeAddressParams = FunctionArguments<typeof functions.trusteeAddress>
export type TrusteeAddressReturn = FunctionReturn<typeof functions.trusteeAddress>

export type TrusteeFeeBpsParams = FunctionArguments<typeof functions.trusteeFeeBps>
export type TrusteeFeeBpsReturn = FunctionReturn<typeof functions.trusteeFeeBps>

export type VaultBufferParams = FunctionArguments<typeof functions.vaultBuffer>
export type VaultBufferReturn = FunctionReturn<typeof functions.vaultBuffer>

