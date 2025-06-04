import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AllocateThresholdUpdated: event("0x2ec5fb5a3d2703edc461252d92ccd2799c3c74f01d97212b20388207fa17ae45", "AllocateThresholdUpdated(uint256)", {"_threshold": p.uint256}),
    AssetAllocated: event("0x41b99659f6ba0803f444aff29e5bf6e26dd86a3219aff92119d69710a956ba8d", "AssetAllocated(address,address,uint256)", {"_asset": p.address, "_strategy": p.address, "_amount": p.uint256}),
    AssetDefaultStrategyUpdated: event("0xba58ce12801c949fa65f41c46ed108671c219baf945fa48d21026cea99ff252a", "AssetDefaultStrategyUpdated(address,address)", {"_asset": p.address, "_strategy": p.address}),
    AssetRemoved: event("0x37803e2125c48ee96c38ddf04e826daf335b0e1603579040fd275aba6d06b6fc", "AssetRemoved(address)", {"_asset": p.address}),
    AssetSupported: event("0x4f1ac48525e50059cc1cc6e0e1940ece0dd653a4db4841538d6aef036be2fb7b", "AssetSupported(address)", {"_asset": p.address}),
    CapitalPaused: event("0x71f0e5b62f846a22e0b4d159e516e62fa9c2b8eb570be15f83e67d98a2ee51e0", "CapitalPaused()", {}),
    CapitalUnpaused: event("0x891ebab18da80ebeeea06b1b1cede098329c4c008906a98370c2ac7a80b571cb", "CapitalUnpaused()", {}),
    DripDurationChanged: event("0x406e15fbca1d8ded2dbb06765fea3a54f18395c54125a4c9916dd00ea14ee15e", "DripDurationChanged(uint256)", {"dripDuration": p.uint256}),
    DripperChanged: event("0xaf2910d9759321733de15af1827a49830692912adeb2b3646334861f2cd2eed4", "DripperChanged(address)", {"_dripper": indexed(p.address)}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    MaxSupplyDiffChanged: event("0x95201f9c21f26877223b1ff4073936a6484c35495649e60e55730497aeb60d93", "MaxSupplyDiffChanged(uint256)", {"maxSupplyDiff": p.uint256}),
    Mint: event("0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885", "Mint(address,uint256)", {"_addr": p.address, "_value": p.uint256}),
    NetOusdMintForStrategyThresholdChanged: event("0xc29d6fedbc6bdf267a08166c2b976fbd72aca5d6a769528616f8b9224c8f197f", "NetOusdMintForStrategyThresholdChanged(uint256)", {"_threshold": p.uint256}),
    OusdMetaStrategyUpdated: event("0xa12850fb726e0b2b7b3c9a9342031e1268a8148d0eb06b4bea8613204ffcd2b8", "OusdMetaStrategyUpdated(address)", {"_ousdMetaStrategy": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PriceProviderUpdated: event("0xb266add5f3044b17d27db796af992cecbe413921b4e8aaaee03c719e16b9806a", "PriceProviderUpdated(address)", {"_priceProvider": p.address}),
    RebasePaused: event("0x8cff26a5985614b3d30629cc4ab83824bf115aec971b718d8f2f99562032e972", "RebasePaused()", {}),
    RebasePerSecondMaxChanged: event("0xef46f143af5fead0010484fe7d6ec2e2972420faa76157f5a6075aa72e614cb5", "RebasePerSecondMaxChanged(uint256)", {"rebaseRatePerSecond": p.uint256}),
    RebaseThresholdUpdated: event("0x39367850377ac04920a9a670f2180e7a94d83b15ad302e59875ec58fd10bd37d", "RebaseThresholdUpdated(uint256)", {"_threshold": p.uint256}),
    RebaseUnpaused: event("0xbc044409505c95b6b851433df96e1beae715c909d8e7c1d6d7ab783300d4e3b9", "RebaseUnpaused()", {}),
    Redeem: event("0x222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a6", "Redeem(address,uint256)", {"_addr": p.address, "_value": p.uint256}),
    RedeemFeeUpdated: event("0xd6c7508d6658ccee36b7b7d7fd72e5cbaeefb40c64eff24e9ae7470e846304ee", "RedeemFeeUpdated(uint256)", {"_redeemFeeBps": p.uint256}),
    StrategistUpdated: event("0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee", "StrategistUpdated(address)", {"_address": p.address}),
    StrategyAddedToMintWhitelist: event("0x47c8c96a5942f094264111c5fe7f6a4fe86efe63254a6fa7afa5fc84f07d58e8", "StrategyAddedToMintWhitelist(address)", {"strategy": indexed(p.address)}),
    StrategyApproved: event("0x960dd94cbb79169f09a4e445d58b895df2d9bffa5b31055d0932d801724a20d1", "StrategyApproved(address)", {"_addr": p.address}),
    StrategyRemoved: event("0x09a1db4b80c32706328728508c941a6b954f31eb5affd32f236c1fd405f8fea4", "StrategyRemoved(address)", {"_addr": p.address}),
    StrategyRemovedFromMintWhitelist: event("0x0ec40967a61509853550658e51d0e4297f7cba244fe4adc8ba18b5631ac20e2f", "StrategyRemovedFromMintWhitelist(address)", {"strategy": indexed(p.address)}),
    SwapAllowedUndervalueChanged: event("0xf12c00256bee2b6facb111a88a9b1cff86e79132939b44f1353212d6f7469557", "SwapAllowedUndervalueChanged(uint256)", {"_basis": p.uint256}),
    SwapSlippageChanged: event("0x8d22e9d2cbe8bb65a3c4412bd8970743864512a1a0e004e8d00fb96277b78b94", "SwapSlippageChanged(address,uint256)", {"_asset": p.address, "_basis": p.uint256}),
    Swapped: event("0xa078c4190abe07940190effc1846be0ccf03ad6007bc9e93f9697d0b460befbb", "Swapped(address,address,uint256,uint256)", {"_fromAsset": indexed(p.address), "_toAsset": indexed(p.address), "_fromAssetAmount": p.uint256, "_toAssetAmount": p.uint256}),
    SwapperChanged: event("0x7d7719313229e558c5a3893cad2eb86a86a049156d1d9ebd5c63a8eedefd1c03", "SwapperChanged(address)", {"_address": p.address}),
    TrusteeAddressChanged: event("0x1e4af5ac389e8cde1bdaa6830881b6c987c62a45cfb3b33d27d805cde3b57750", "TrusteeAddressChanged(address)", {"_address": p.address}),
    TrusteeFeeBpsChanged: event("0x56287a45051933ea374811b3d5d165033047be5572cac676f7c28b8be4f746c7", "TrusteeFeeBpsChanged(uint256)", {"_basis": p.uint256}),
    VaultBufferUpdated: event("0x41ecb23a0e7865b25f38c268b7c3012220d822929e9edff07326e89d5bb822b5", "VaultBufferUpdated(uint256)", {"_vaultBuffer": p.uint256}),
    WithdrawalClaimDelayUpdated: event("0xc59f5e32049abab44ddea11021f5abb89422a2f550837afcf25df9fc8d0db6b0", "WithdrawalClaimDelayUpdated(uint256)", {"_newDelay": p.uint256}),
    WithdrawalClaimable: event("0xee79a0c43d3993055690b54e074b5153e8bae8d1a872b656dedb64aa8f463333", "WithdrawalClaimable(uint256,uint256)", {"_claimable": p.uint256, "_newClaimable": p.uint256}),
    WithdrawalClaimed: event("0x2d43eb174787155132b52ddb6b346e2dca99302eac3df4466dbeff953d3c84d1", "WithdrawalClaimed(address,uint256,uint256)", {"_withdrawer": indexed(p.address), "_requestId": indexed(p.uint256), "_amount": p.uint256}),
    WithdrawalRequested: event("0x38e3d972947cfef94205163d483d6287ef27eb312e20cb8e0b13a49989db232e", "WithdrawalRequested(address,uint256,uint256,uint256)", {"_withdrawer": indexed(p.address), "_requestId": indexed(p.uint256), "_amount": p.uint256, "_queued": p.uint256}),
    YieldDistribution: event("0x09516ecf4a8a86e59780a9befc6dee948bc9e60a36e3be68d31ea817ee8d2c80", "YieldDistribution(address,uint256,uint256)", {"_to": p.address, "_yield": p.uint256, "_fee": p.uint256}),
}

export const functions = {
    ADMIN_IMPLEMENTATION: viewFun("0xcc2fe94b", "ADMIN_IMPLEMENTATION()", {}, p.address),
    adminImplPosition: viewFun("0xef08edc2", "adminImplPosition()", {}, p.bytes32),
    allocate: fun("0xabaa9916", "allocate()", {}, ),
    assetDefaultStrategies: viewFun("0xa403e4d5", "assetDefaultStrategies(address)", {"_0": p.address}, p.address),
    autoAllocateThreshold: viewFun("0x9fa1826e", "autoAllocateThreshold()", {}, p.uint256),
    burnForStrategy: fun("0x6217f3ea", "burnForStrategy(uint256)", {"_amount": p.uint256}, ),
    calculateRedeemOutputs: viewFun("0x67bd7ba3", "calculateRedeemOutputs(uint256)", {"_amount": p.uint256}, p.array(p.uint256)),
    capitalPaused: viewFun("0xe6cc5432", "capitalPaused()", {}, p.bool),
    checkBalance: viewFun("0x5f515226", "checkBalance(address)", {"_asset": p.address}, p.uint256),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    dripDuration: viewFun("0xbb7a632e", "dripDuration()", {}, p.uint64),
    dripper: viewFun("0x603ea03b", "dripper()", {}, p.address),
    getAllAssets: viewFun("0x2acada4d", "getAllAssets()", {}, p.array(p.address)),
    getAllStrategies: viewFun("0xc3b28864", "getAllStrategies()", {}, p.array(p.address)),
    getAssetConfig: viewFun("0x6ec3ab67", "getAssetConfig(address)", {"_asset": p.address}, p.struct({"isSupported": p.bool, "unitConversion": p.uint8, "decimals": p.uint8, "allowedOracleSlippageBps": p.uint16})),
    getAssetCount: viewFun("0xa0aead4d", "getAssetCount()", {}, p.uint256),
    getStrategyCount: viewFun("0x31e19cfa", "getStrategyCount()", {}, p.uint256),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    initialize: fun("0x485cc955", "initialize(address,address)", {"_priceProvider": p.address, "_oToken": p.address}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    isMintWhitelistedStrategy: viewFun("0x4530820a", "isMintWhitelistedStrategy(address)", {"_0": p.address}, p.bool),
    isSupportedAsset: viewFun("0x9be918e6", "isSupportedAsset(address)", {"_asset": p.address}, p.bool),
    lastRebase: viewFun("0x78f353a1", "lastRebase()", {}, p.uint64),
    maxSupplyDiff: viewFun("0x8e510b52", "maxSupplyDiff()", {}, p.uint256),
    mint: fun("0x156e29f6", "mint(address,uint256,uint256)", {"_asset": p.address, "_amount": p.uint256, "_minimumOusdAmount": p.uint256}, ),
    mintForStrategy: fun("0xab80dafb", "mintForStrategy(uint256)", {"_amount": p.uint256}, ),
    netOusdMintForStrategyThreshold: viewFun("0x7a2202f3", "netOusdMintForStrategyThreshold()", {}, p.uint256),
    netOusdMintedForStrategy: viewFun("0xe45cc9f0", "netOusdMintedForStrategy()", {}, p.int256),
    oUSD: viewFun("0x5802a172", "oUSD()", {}, p.address),
    ousdMetaStrategy: viewFun("0x18ce56bd", "ousdMetaStrategy()", {}, p.address),
    previewYield: viewFun("0xea33b8e4", "previewYield()", {}, p.uint256),
    priceProvider: viewFun("0xb888879e", "priceProvider()", {}, p.address),
    priceUnitMint: viewFun("0x3b8fe28d", "priceUnitMint(address)", {"asset": p.address}, p.uint256),
    priceUnitRedeem: viewFun("0x5b60f9fc", "priceUnitRedeem(address)", {"asset": p.address}, p.uint256),
    rebase: fun("0xaf14052c", "rebase()", {}, ),
    rebasePaused: viewFun("0x53ca9f24", "rebasePaused()", {}, p.bool),
    rebasePerSecondMax: viewFun("0x527e83a8", "rebasePerSecondMax()", {}, p.uint64),
    rebasePerSecondTarget: viewFun("0x4d5f4629", "rebasePerSecondTarget()", {}, p.uint64),
    rebaseThreshold: viewFun("0x52d38e5d", "rebaseThreshold()", {}, p.uint256),
    redeem: fun("0x7cbc2373", "redeem(uint256,uint256)", {"_amount": p.uint256, "_minimumUnitAmount": p.uint256}, ),
    redeemFeeBps: viewFun("0x09f6442c", "redeemFeeBps()", {}, p.uint256),
    setAdminImpl: fun("0xfc0cfeee", "setAdminImpl(address)", {"newImpl": p.address}, ),
    strategies: viewFun("0x39ebf823", "strategies(address)", {"_0": p.address}, {"isSupported": p.bool, "_deprecated": p.uint256}),
    strategistAddr: viewFun("0x570d8e1d", "strategistAddr()", {}, p.address),
    totalValue: viewFun("0xd4c3eea0", "totalValue()", {}, p.uint256),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    trusteeAddress: viewFun("0x49c1d54d", "trusteeAddress()", {}, p.address),
    trusteeFeeBps: viewFun("0x207134b0", "trusteeFeeBps()", {}, p.uint256),
    vaultBuffer: viewFun("0x1edfe3da", "vaultBuffer()", {}, p.uint256),
    withdrawalClaimDelay: viewFun("0x45e4213b", "withdrawalClaimDelay()", {}, p.uint256),
    withdrawalQueueMetadata: viewFun("0x362bd1a3", "withdrawalQueueMetadata()", {}, {"queued": p.uint128, "claimable": p.uint128, "claimed": p.uint128, "nextWithdrawalIndex": p.uint128}),
    withdrawalRequests: viewFun("0x937b2581", "withdrawalRequests(uint256)", {"_0": p.uint256}, {"withdrawer": p.address, "claimed": p.bool, "timestamp": p.uint40, "amount": p.uint128, "queued": p.uint128}),
}

export class Contract extends ContractBase {

    ADMIN_IMPLEMENTATION() {
        return this.eth_call(functions.ADMIN_IMPLEMENTATION, {})
    }

    adminImplPosition() {
        return this.eth_call(functions.adminImplPosition, {})
    }

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

    dripDuration() {
        return this.eth_call(functions.dripDuration, {})
    }

    dripper() {
        return this.eth_call(functions.dripper, {})
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

    isMintWhitelistedStrategy(_0: IsMintWhitelistedStrategyParams["_0"]) {
        return this.eth_call(functions.isMintWhitelistedStrategy, {_0})
    }

    isSupportedAsset(_asset: IsSupportedAssetParams["_asset"]) {
        return this.eth_call(functions.isSupportedAsset, {_asset})
    }

    lastRebase() {
        return this.eth_call(functions.lastRebase, {})
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

    oUSD() {
        return this.eth_call(functions.oUSD, {})
    }

    ousdMetaStrategy() {
        return this.eth_call(functions.ousdMetaStrategy, {})
    }

    previewYield() {
        return this.eth_call(functions.previewYield, {})
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

    rebasePerSecondMax() {
        return this.eth_call(functions.rebasePerSecondMax, {})
    }

    rebasePerSecondTarget() {
        return this.eth_call(functions.rebasePerSecondTarget, {})
    }

    rebaseThreshold() {
        return this.eth_call(functions.rebaseThreshold, {})
    }

    redeemFeeBps() {
        return this.eth_call(functions.redeemFeeBps, {})
    }

    strategies(_0: StrategiesParams["_0"]) {
        return this.eth_call(functions.strategies, {_0})
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

    withdrawalClaimDelay() {
        return this.eth_call(functions.withdrawalClaimDelay, {})
    }

    withdrawalQueueMetadata() {
        return this.eth_call(functions.withdrawalQueueMetadata, {})
    }

    withdrawalRequests(_0: WithdrawalRequestsParams["_0"]) {
        return this.eth_call(functions.withdrawalRequests, {_0})
    }
}

/// Event types
export type AllocateThresholdUpdatedEventArgs = EParams<typeof events.AllocateThresholdUpdated>
export type AssetAllocatedEventArgs = EParams<typeof events.AssetAllocated>
export type AssetDefaultStrategyUpdatedEventArgs = EParams<typeof events.AssetDefaultStrategyUpdated>
export type AssetRemovedEventArgs = EParams<typeof events.AssetRemoved>
export type AssetSupportedEventArgs = EParams<typeof events.AssetSupported>
export type CapitalPausedEventArgs = EParams<typeof events.CapitalPaused>
export type CapitalUnpausedEventArgs = EParams<typeof events.CapitalUnpaused>
export type DripDurationChangedEventArgs = EParams<typeof events.DripDurationChanged>
export type DripperChangedEventArgs = EParams<typeof events.DripperChanged>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type MaxSupplyDiffChangedEventArgs = EParams<typeof events.MaxSupplyDiffChanged>
export type MintEventArgs = EParams<typeof events.Mint>
export type NetOusdMintForStrategyThresholdChangedEventArgs = EParams<typeof events.NetOusdMintForStrategyThresholdChanged>
export type OusdMetaStrategyUpdatedEventArgs = EParams<typeof events.OusdMetaStrategyUpdated>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type PriceProviderUpdatedEventArgs = EParams<typeof events.PriceProviderUpdated>
export type RebasePausedEventArgs = EParams<typeof events.RebasePaused>
export type RebasePerSecondMaxChangedEventArgs = EParams<typeof events.RebasePerSecondMaxChanged>
export type RebaseThresholdUpdatedEventArgs = EParams<typeof events.RebaseThresholdUpdated>
export type RebaseUnpausedEventArgs = EParams<typeof events.RebaseUnpaused>
export type RedeemEventArgs = EParams<typeof events.Redeem>
export type RedeemFeeUpdatedEventArgs = EParams<typeof events.RedeemFeeUpdated>
export type StrategistUpdatedEventArgs = EParams<typeof events.StrategistUpdated>
export type StrategyAddedToMintWhitelistEventArgs = EParams<typeof events.StrategyAddedToMintWhitelist>
export type StrategyApprovedEventArgs = EParams<typeof events.StrategyApproved>
export type StrategyRemovedEventArgs = EParams<typeof events.StrategyRemoved>
export type StrategyRemovedFromMintWhitelistEventArgs = EParams<typeof events.StrategyRemovedFromMintWhitelist>
export type SwapAllowedUndervalueChangedEventArgs = EParams<typeof events.SwapAllowedUndervalueChanged>
export type SwapSlippageChangedEventArgs = EParams<typeof events.SwapSlippageChanged>
export type SwappedEventArgs = EParams<typeof events.Swapped>
export type SwapperChangedEventArgs = EParams<typeof events.SwapperChanged>
export type TrusteeAddressChangedEventArgs = EParams<typeof events.TrusteeAddressChanged>
export type TrusteeFeeBpsChangedEventArgs = EParams<typeof events.TrusteeFeeBpsChanged>
export type VaultBufferUpdatedEventArgs = EParams<typeof events.VaultBufferUpdated>
export type WithdrawalClaimDelayUpdatedEventArgs = EParams<typeof events.WithdrawalClaimDelayUpdated>
export type WithdrawalClaimableEventArgs = EParams<typeof events.WithdrawalClaimable>
export type WithdrawalClaimedEventArgs = EParams<typeof events.WithdrawalClaimed>
export type WithdrawalRequestedEventArgs = EParams<typeof events.WithdrawalRequested>
export type YieldDistributionEventArgs = EParams<typeof events.YieldDistribution>

/// Function types
export type ADMIN_IMPLEMENTATIONParams = FunctionArguments<typeof functions.ADMIN_IMPLEMENTATION>
export type ADMIN_IMPLEMENTATIONReturn = FunctionReturn<typeof functions.ADMIN_IMPLEMENTATION>

export type AdminImplPositionParams = FunctionArguments<typeof functions.adminImplPosition>
export type AdminImplPositionReturn = FunctionReturn<typeof functions.adminImplPosition>

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

export type DripDurationParams = FunctionArguments<typeof functions.dripDuration>
export type DripDurationReturn = FunctionReturn<typeof functions.dripDuration>

export type DripperParams = FunctionArguments<typeof functions.dripper>
export type DripperReturn = FunctionReturn<typeof functions.dripper>

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

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type IsMintWhitelistedStrategyParams = FunctionArguments<typeof functions.isMintWhitelistedStrategy>
export type IsMintWhitelistedStrategyReturn = FunctionReturn<typeof functions.isMintWhitelistedStrategy>

export type IsSupportedAssetParams = FunctionArguments<typeof functions.isSupportedAsset>
export type IsSupportedAssetReturn = FunctionReturn<typeof functions.isSupportedAsset>

export type LastRebaseParams = FunctionArguments<typeof functions.lastRebase>
export type LastRebaseReturn = FunctionReturn<typeof functions.lastRebase>

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

export type OUSDParams = FunctionArguments<typeof functions.oUSD>
export type OUSDReturn = FunctionReturn<typeof functions.oUSD>

export type OusdMetaStrategyParams = FunctionArguments<typeof functions.ousdMetaStrategy>
export type OusdMetaStrategyReturn = FunctionReturn<typeof functions.ousdMetaStrategy>

export type PreviewYieldParams = FunctionArguments<typeof functions.previewYield>
export type PreviewYieldReturn = FunctionReturn<typeof functions.previewYield>

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

export type RebasePerSecondMaxParams = FunctionArguments<typeof functions.rebasePerSecondMax>
export type RebasePerSecondMaxReturn = FunctionReturn<typeof functions.rebasePerSecondMax>

export type RebasePerSecondTargetParams = FunctionArguments<typeof functions.rebasePerSecondTarget>
export type RebasePerSecondTargetReturn = FunctionReturn<typeof functions.rebasePerSecondTarget>

export type RebaseThresholdParams = FunctionArguments<typeof functions.rebaseThreshold>
export type RebaseThresholdReturn = FunctionReturn<typeof functions.rebaseThreshold>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RedeemFeeBpsParams = FunctionArguments<typeof functions.redeemFeeBps>
export type RedeemFeeBpsReturn = FunctionReturn<typeof functions.redeemFeeBps>

export type SetAdminImplParams = FunctionArguments<typeof functions.setAdminImpl>
export type SetAdminImplReturn = FunctionReturn<typeof functions.setAdminImpl>

export type StrategiesParams = FunctionArguments<typeof functions.strategies>
export type StrategiesReturn = FunctionReturn<typeof functions.strategies>

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

export type WithdrawalClaimDelayParams = FunctionArguments<typeof functions.withdrawalClaimDelay>
export type WithdrawalClaimDelayReturn = FunctionReturn<typeof functions.withdrawalClaimDelay>

export type WithdrawalQueueMetadataParams = FunctionArguments<typeof functions.withdrawalQueueMetadata>
export type WithdrawalQueueMetadataReturn = FunctionReturn<typeof functions.withdrawalQueueMetadata>

export type WithdrawalRequestsParams = FunctionArguments<typeof functions.withdrawalRequests>
export type WithdrawalRequestsReturn = FunctionReturn<typeof functions.withdrawalRequests>

