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
    SwapAllowedUndervalueChanged: new LogEvent<([_basis: bigint] & {_basis: bigint})>(
        abi, '0xf12c00256bee2b6facb111a88a9b1cff86e79132939b44f1353212d6f7469557'
    ),
    SwapSlippageChanged: new LogEvent<([_asset: string, _basis: bigint] & {_asset: string, _basis: bigint})>(
        abi, '0x8d22e9d2cbe8bb65a3c4412bd8970743864512a1a0e004e8d00fb96277b78b94'
    ),
    Swapped: new LogEvent<([_fromAsset: string, _toAsset: string, _fromAssetAmount: bigint, _toAssetAmount: bigint] & {_fromAsset: string, _toAsset: string, _fromAssetAmount: bigint, _toAssetAmount: bigint})>(
        abi, '0xa078c4190abe07940190effc1846be0ccf03ad6007bc9e93f9697d0b460befbb'
    ),
    SwapperChanged: new LogEvent<([_address: string] & {_address: string})>(
        abi, '0x7d7719313229e558c5a3893cad2eb86a86a049156d1d9ebd5c63a8eedefd1c03'
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
    allocate: new Func<[], {}, []>(
        abi, '0xabaa9916'
    ),
    assetDefaultStrategies: new Func<[_: string], {}, string>(
        abi, '0xa403e4d5'
    ),
    autoAllocateThreshold: new Func<[], {}, bigint>(
        abi, '0x9fa1826e'
    ),
    burnForStrategy: new Func<[_amount: bigint], {_amount: bigint}, []>(
        abi, '0x6217f3ea'
    ),
    calculateRedeemOutputs: new Func<[_amount: bigint], {_amount: bigint}, Array<bigint>>(
        abi, '0x67bd7ba3'
    ),
    capitalPaused: new Func<[], {}, boolean>(
        abi, '0xe6cc5432'
    ),
    checkBalance: new Func<[_asset: string], {_asset: string}, bigint>(
        abi, '0x5f515226'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
    ),
    getAllAssets: new Func<[], {}, Array<string>>(
        abi, '0x2acada4d'
    ),
    getAllStrategies: new Func<[], {}, Array<string>>(
        abi, '0xc3b28864'
    ),
    getAssetConfig: new Func<[_asset: string], {_asset: string}, ([isSupported: boolean, unitConversion: number, decimals: number, allowedOracleSlippageBps: number] & {isSupported: boolean, unitConversion: number, decimals: number, allowedOracleSlippageBps: number})>(
        abi, '0x6ec3ab67'
    ),
    getAssetCount: new Func<[], {}, bigint>(
        abi, '0xa0aead4d'
    ),
    getStrategyCount: new Func<[], {}, bigint>(
        abi, '0x31e19cfa'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
    ),
    isSupportedAsset: new Func<[_asset: string], {_asset: string}, boolean>(
        abi, '0x9be918e6'
    ),
    maxSupplyDiff: new Func<[], {}, bigint>(
        abi, '0x8e510b52'
    ),
    mint: new Func<[_asset: string, _amount: bigint, _minimumOusdAmount: bigint], {_asset: string, _amount: bigint, _minimumOusdAmount: bigint}, []>(
        abi, '0x156e29f6'
    ),
    mintForStrategy: new Func<[_amount: bigint], {_amount: bigint}, []>(
        abi, '0xab80dafb'
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
    priceProvider: new Func<[], {}, string>(
        abi, '0xb888879e'
    ),
    priceUnitMint: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x3b8fe28d'
    ),
    priceUnitRedeem: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x5b60f9fc'
    ),
    rebase: new Func<[], {}, []>(
        abi, '0xaf14052c'
    ),
    rebasePaused: new Func<[], {}, boolean>(
        abi, '0x53ca9f24'
    ),
    rebaseThreshold: new Func<[], {}, bigint>(
        abi, '0x52d38e5d'
    ),
    redeem: new Func<[_amount: bigint, _minimumUnitAmount: bigint], {_amount: bigint, _minimumUnitAmount: bigint}, []>(
        abi, '0x7cbc2373'
    ),
    redeemAll: new Func<[_minimumUnitAmount: bigint], {_minimumUnitAmount: bigint}, []>(
        abi, '0x7136a7a6'
    ),
    redeemFeeBps: new Func<[], {}, bigint>(
        abi, '0x09f6442c'
    ),
    setAdminImpl: new Func<[newImpl: string], {newImpl: string}, []>(
        abi, '0xfc0cfeee'
    ),
    strategistAddr: new Func<[], {}, string>(
        abi, '0x570d8e1d'
    ),
    totalValue: new Func<[], {}, bigint>(
        abi, '0xd4c3eea0'
    ),
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    trusteeAddress: new Func<[], {}, string>(
        abi, '0x49c1d54d'
    ),
    trusteeFeeBps: new Func<[], {}, bigint>(
        abi, '0x207134b0'
    ),
    vaultBuffer: new Func<[], {}, bigint>(
        abi, '0x1edfe3da'
    ),
}

export class Contract extends ContractBase {

    assetDefaultStrategies(arg0: string): Promise<string> {
        return this.eth_call(functions.assetDefaultStrategies, [arg0])
    }

    autoAllocateThreshold(): Promise<bigint> {
        return this.eth_call(functions.autoAllocateThreshold, [])
    }

    calculateRedeemOutputs(_amount: bigint): Promise<Array<bigint>> {
        return this.eth_call(functions.calculateRedeemOutputs, [_amount])
    }

    capitalPaused(): Promise<boolean> {
        return this.eth_call(functions.capitalPaused, [])
    }

    checkBalance(_asset: string): Promise<bigint> {
        return this.eth_call(functions.checkBalance, [_asset])
    }

    getAllAssets(): Promise<Array<string>> {
        return this.eth_call(functions.getAllAssets, [])
    }

    getAllStrategies(): Promise<Array<string>> {
        return this.eth_call(functions.getAllStrategies, [])
    }

    getAssetConfig(_asset: string): Promise<([isSupported: boolean, unitConversion: number, decimals: number, allowedOracleSlippageBps: number] & {isSupported: boolean, unitConversion: number, decimals: number, allowedOracleSlippageBps: number})> {
        return this.eth_call(functions.getAssetConfig, [_asset])
    }

    getAssetCount(): Promise<bigint> {
        return this.eth_call(functions.getAssetCount, [])
    }

    getStrategyCount(): Promise<bigint> {
        return this.eth_call(functions.getStrategyCount, [])
    }

    governor(): Promise<string> {
        return this.eth_call(functions.governor, [])
    }

    isGovernor(): Promise<boolean> {
        return this.eth_call(functions.isGovernor, [])
    }

    isSupportedAsset(_asset: string): Promise<boolean> {
        return this.eth_call(functions.isSupportedAsset, [_asset])
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

    priceUnitMint(asset: string): Promise<bigint> {
        return this.eth_call(functions.priceUnitMint, [asset])
    }

    priceUnitRedeem(asset: string): Promise<bigint> {
        return this.eth_call(functions.priceUnitRedeem, [asset])
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

    totalValue(): Promise<bigint> {
        return this.eth_call(functions.totalValue, [])
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
