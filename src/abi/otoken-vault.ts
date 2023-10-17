import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './otoken-vault.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AllocateThresholdUpdated: new LogEvent<([_threshold: bigint] & {_threshold: bigint})>(
        abi, '0x2ec5fb5a3d2703edc461252d92ccd2799c3c74f01d97212b20388207fa17ae45'
    ),
    AssetAllocated: new LogEvent<([_asset: string, _strategy: string, _amount: bigint] & {_asset: string, _strategy: string, _amount: bigint})>(
        abi, '0x41b99659f6ba0803f444aff29e5bf6e26dd86a3219aff92119d69710a956ba8d'
    ),
    AssetDefaultStrategyUpdated: new LogEvent<([_asset: string, _strategy: string] & {_asset: string, _strategy: string})>(
        abi, '0xba58ce12801c949fa65f41c46ed108671c219baf945fa48d21026cea99ff252a'
    ),
    AssetSupported: new LogEvent<([_asset: string] & {_asset: string})>(
        abi, '0x4f1ac48525e50059cc1cc6e0e1940ece0dd653a4db4841538d6aef036be2fb7b'
    ),
    CapitalPaused: new LogEvent<[]>(
        abi, '0x71f0e5b62f846a22e0b4d159e516e62fa9c2b8eb570be15f83e67d98a2ee51e0'
    ),
    CapitalUnpaused: new LogEvent<[]>(
        abi, '0x891ebab18da80ebeeea06b1b1cede098329c4c008906a98370c2ac7a80b571cb'
    ),
    GovernorshipTransferred: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a'
    ),
    MaxSupplyDiffChanged: new LogEvent<([maxSupplyDiff: bigint] & {maxSupplyDiff: bigint})>(
        abi, '0x95201f9c21f26877223b1ff4073936a6484c35495649e60e55730497aeb60d93'
    ),
    Mint: new LogEvent<([_addr: string, _value: bigint] & {_addr: string, _value: bigint})>(
        abi, '0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885'
    ),
    NetOusdMintForStrategyThresholdChanged: new LogEvent<([_threshold: bigint] & {_threshold: bigint})>(
        abi, '0xc29d6fedbc6bdf267a08166c2b976fbd72aca5d6a769528616f8b9224c8f197f'
    ),
    OusdMetaStrategyUpdated: new LogEvent<([_ousdMetaStrategy: string] & {_ousdMetaStrategy: string})>(
        abi, '0xa12850fb726e0b2b7b3c9a9342031e1268a8148d0eb06b4bea8613204ffcd2b8'
    ),
    PendingGovernorshipTransfer: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d'
    ),
    PriceProviderUpdated: new LogEvent<([_priceProvider: string] & {_priceProvider: string})>(
        abi, '0xb266add5f3044b17d27db796af992cecbe413921b4e8aaaee03c719e16b9806a'
    ),
    RebasePaused: new LogEvent<[]>(
        abi, '0x8cff26a5985614b3d30629cc4ab83824bf115aec971b718d8f2f99562032e972'
    ),
    RebaseThresholdUpdated: new LogEvent<([_threshold: bigint] & {_threshold: bigint})>(
        abi, '0x39367850377ac04920a9a670f2180e7a94d83b15ad302e59875ec58fd10bd37d'
    ),
    RebaseUnpaused: new LogEvent<[]>(
        abi, '0xbc044409505c95b6b851433df96e1beae715c909d8e7c1d6d7ab783300d4e3b9'
    ),
    Redeem: new LogEvent<([_addr: string, _value: bigint] & {_addr: string, _value: bigint})>(
        abi, '0x222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a6'
    ),
    RedeemFeeUpdated: new LogEvent<([_redeemFeeBps: bigint] & {_redeemFeeBps: bigint})>(
        abi, '0xd6c7508d6658ccee36b7b7d7fd72e5cbaeefb40c64eff24e9ae7470e846304ee'
    ),
    StrategistUpdated: new LogEvent<([_address: string] & {_address: string})>(
        abi, '0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee'
    ),
    StrategyApproved: new LogEvent<([_addr: string] & {_addr: string})>(
        abi, '0x960dd94cbb79169f09a4e445d58b895df2d9bffa5b31055d0932d801724a20d1'
    ),
    StrategyRemoved: new LogEvent<([_addr: string] & {_addr: string})>(
        abi, '0x09a1db4b80c32706328728508c941a6b954f31eb5affd32f236c1fd405f8fea4'
    ),
    TrusteeAddressChanged: new LogEvent<([_address: string] & {_address: string})>(
        abi, '0x1e4af5ac389e8cde1bdaa6830881b6c987c62a45cfb3b33d27d805cde3b57750'
    ),
    TrusteeFeeBpsChanged: new LogEvent<([_basis: bigint] & {_basis: bigint})>(
        abi, '0x56287a45051933ea374811b3d5d165033047be5572cac676f7c28b8be4f746c7'
    ),
    VaultBufferUpdated: new LogEvent<([_vaultBuffer: bigint] & {_vaultBuffer: bigint})>(
        abi, '0x41ecb23a0e7865b25f38c268b7c3012220d822929e9edff07326e89d5bb822b5'
    ),
    YieldDistribution: new LogEvent<([_to: string, _yield: bigint, _fee: bigint] & {_to: string, _yield: bigint, _fee: bigint})>(
        abi, '0x09516ecf4a8a86e59780a9befc6dee948bc9e60a36e3be68d31ea817ee8d2c80'
    ),
}

export const functions = {
    approveStrategy: new Func<[_addr: string], {_addr: string}, []>(
        abi, '0x3b8ae397'
    ),
    assetDefaultStrategies: new Func<[_: string], {}, string>(
        abi, '0xa403e4d5'
    ),
    autoAllocateThreshold: new Func<[], {}, bigint>(
        abi, '0x9fa1826e'
    ),
    cacheDecimals: new Func<[_asset: string], {_asset: string}, []>(
        abi, '0x36b6d944'
    ),
    capitalPaused: new Func<[], {}, boolean>(
        abi, '0xe6cc5432'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
    ),
    depositToStrategy: new Func<[_strategyToAddress: string, _assets: Array<string>, _amounts: Array<bigint>], {_strategyToAddress: string, _assets: Array<string>, _amounts: Array<bigint>}, []>(
        abi, '0x840c4c7a'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    initialize: new Func<[_priceProvider: string, _ousd: string], {_priceProvider: string, _ousd: string}, []>(
        abi, '0x485cc955'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
    ),
    maxSupplyDiff: new Func<[], {}, bigint>(
        abi, '0x8e510b52'
    ),
    netOusdMintForStrategyThreshold: new Func<[], {}, bigint>(
        abi, '0x7a2202f3'
    ),
    netOusdMintedForStrategy: new Func<[], {}, bigint>(
        abi, '0xe45cc9f0'
    ),
    ousdMetaStrategy: new Func<[], {}, string>(
        abi, '0x18ce56bd'
    ),
    pauseCapital: new Func<[], {}, []>(
        abi, '0x3dbc911f'
    ),
    pauseRebase: new Func<[], {}, []>(
        abi, '0xc5f00841'
    ),
    priceProvider: new Func<[], {}, string>(
        abi, '0xb888879e'
    ),
    reallocate: new Func<[_strategyFromAddress: string, _strategyToAddress: string, _assets: Array<string>, _amounts: Array<bigint>], {_strategyFromAddress: string, _strategyToAddress: string, _assets: Array<string>, _amounts: Array<bigint>}, []>(
        abi, '0x7fe2d393'
    ),
    rebasePaused: new Func<[], {}, boolean>(
        abi, '0x53ca9f24'
    ),
    rebaseThreshold: new Func<[], {}, bigint>(
        abi, '0x52d38e5d'
    ),
    redeemFeeBps: new Func<[], {}, bigint>(
        abi, '0x09f6442c'
    ),
    removeStrategy: new Func<[_addr: string], {_addr: string}, []>(
        abi, '0x175188e8'
    ),
    setAdminImpl: new Func<[newImpl: string], {newImpl: string}, []>(
        abi, '0xfc0cfeee'
    ),
    setAssetDefaultStrategy: new Func<[_asset: string, _strategy: string], {_asset: string, _strategy: string}, []>(
        abi, '0xbc90106b'
    ),
    setAutoAllocateThreshold: new Func<[_threshold: bigint], {_threshold: bigint}, []>(
        abi, '0xb2c9336d'
    ),
    setMaxSupplyDiff: new Func<[_maxSupplyDiff: bigint], {_maxSupplyDiff: bigint}, []>(
        abi, '0x663e64ce'
    ),
    setNetOusdMintForStrategyThreshold: new Func<[_threshold: bigint], {_threshold: bigint}, []>(
        abi, '0x636e6c40'
    ),
    setOusdMetaStrategy: new Func<[_ousdMetaStrategy: string], {_ousdMetaStrategy: string}, []>(
        abi, '0xd58e3b3a'
    ),
    setPriceProvider: new Func<[_priceProvider: string], {_priceProvider: string}, []>(
        abi, '0x372aa224'
    ),
    setRebaseThreshold: new Func<[_threshold: bigint], {_threshold: bigint}, []>(
        abi, '0xb890ebf6'
    ),
    setRedeemFeeBps: new Func<[_redeemFeeBps: bigint], {_redeemFeeBps: bigint}, []>(
        abi, '0xeb03654b'
    ),
    setStrategistAddr: new Func<[_address: string], {_address: string}, []>(
        abi, '0x773540b3'
    ),
    setTrusteeAddress: new Func<[_address: string], {_address: string}, []>(
        abi, '0x2da845a8'
    ),
    setTrusteeFeeBps: new Func<[_basis: bigint], {_basis: bigint}, []>(
        abi, '0x0acbda75'
    ),
    setVaultBuffer: new Func<[_vaultBuffer: bigint], {_vaultBuffer: bigint}, []>(
        abi, '0x8ec489a2'
    ),
    strategistAddr: new Func<[], {}, string>(
        abi, '0x570d8e1d'
    ),
    supportAsset: new Func<[_asset: string, _unitConversion: number], {_asset: string, _unitConversion: number}, []>(
        abi, '0x6c7561e8'
    ),
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    transferToken: new Func<[_asset: string, _amount: bigint], {_asset: string, _amount: bigint}, []>(
        abi, '0x1072cbea'
    ),
    trusteeAddress: new Func<[], {}, string>(
        abi, '0x49c1d54d'
    ),
    trusteeFeeBps: new Func<[], {}, bigint>(
        abi, '0x207134b0'
    ),
    unpauseCapital: new Func<[], {}, []>(
        abi, '0x94828ffd'
    ),
    unpauseRebase: new Func<[], {}, []>(
        abi, '0x09f49bf5'
    ),
    vaultBuffer: new Func<[], {}, bigint>(
        abi, '0x1edfe3da'
    ),
    withdrawAllFromStrategies: new Func<[], {}, []>(
        abi, '0xc9919112'
    ),
    withdrawAllFromStrategy: new Func<[_strategyAddr: string], {_strategyAddr: string}, []>(
        abi, '0x597c8910'
    ),
    withdrawFromStrategy: new Func<[_strategyFromAddress: string, _assets: Array<string>, _amounts: Array<bigint>], {_strategyFromAddress: string, _assets: Array<string>, _amounts: Array<bigint>}, []>(
        abi, '0xae69f3cb'
    ),
}

export class Contract extends ContractBase {

    assetDefaultStrategies(arg0: string): Promise<string> {
        return this.eth_call(functions.assetDefaultStrategies, [arg0])
    }

    autoAllocateThreshold(): Promise<bigint> {
        return this.eth_call(functions.autoAllocateThreshold, [])
    }

    capitalPaused(): Promise<boolean> {
        return this.eth_call(functions.capitalPaused, [])
    }

    governor(): Promise<string> {
        return this.eth_call(functions.governor, [])
    }

    isGovernor(): Promise<boolean> {
        return this.eth_call(functions.isGovernor, [])
    }

    maxSupplyDiff(): Promise<bigint> {
        return this.eth_call(functions.maxSupplyDiff, [])
    }

    netOusdMintForStrategyThreshold(): Promise<bigint> {
        return this.eth_call(functions.netOusdMintForStrategyThreshold, [])
    }

    netOusdMintedForStrategy(): Promise<bigint> {
        return this.eth_call(functions.netOusdMintedForStrategy, [])
    }

    ousdMetaStrategy(): Promise<string> {
        return this.eth_call(functions.ousdMetaStrategy, [])
    }

    priceProvider(): Promise<string> {
        return this.eth_call(functions.priceProvider, [])
    }

    rebasePaused(): Promise<boolean> {
        return this.eth_call(functions.rebasePaused, [])
    }

    rebaseThreshold(): Promise<bigint> {
        return this.eth_call(functions.rebaseThreshold, [])
    }

    redeemFeeBps(): Promise<bigint> {
        return this.eth_call(functions.redeemFeeBps, [])
    }

    strategistAddr(): Promise<string> {
        return this.eth_call(functions.strategistAddr, [])
    }

    trusteeAddress(): Promise<string> {
        return this.eth_call(functions.trusteeAddress, [])
    }

    trusteeFeeBps(): Promise<bigint> {
        return this.eth_call(functions.trusteeFeeBps, [])
    }

    vaultBuffer(): Promise<bigint> {
        return this.eth_call(functions.vaultBuffer, [])
    }
}
