import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AllocateThresholdUpdated(uint256) */
export const AllocateThresholdUpdated = event('0x2ec5fb5a3d2703edc461252d92ccd2799c3c74f01d97212b20388207fa17ae45', {
    _threshold: uint256,
})
export type AllocateThresholdUpdatedEventArgs = EParams<typeof AllocateThresholdUpdated>

/** AssetAllocated(address,address,uint256) */
export const AssetAllocated = event('0x41b99659f6ba0803f444aff29e5bf6e26dd86a3219aff92119d69710a956ba8d', {
    _asset: address,
    _strategy: address,
    _amount: uint256,
})
export type AssetAllocatedEventArgs = EParams<typeof AssetAllocated>

/** AssetDefaultStrategyUpdated(address,address) */
export const AssetDefaultStrategyUpdated = event('0xba58ce12801c949fa65f41c46ed108671c219baf945fa48d21026cea99ff252a', {
    _asset: address,
    _strategy: address,
})
export type AssetDefaultStrategyUpdatedEventArgs = EParams<typeof AssetDefaultStrategyUpdated>

/** AssetRemoved(address) */
export const AssetRemoved = event('0x37803e2125c48ee96c38ddf04e826daf335b0e1603579040fd275aba6d06b6fc', {
    _asset: address,
})
export type AssetRemovedEventArgs = EParams<typeof AssetRemoved>

/** AssetSupported(address) */
export const AssetSupported = event('0x4f1ac48525e50059cc1cc6e0e1940ece0dd653a4db4841538d6aef036be2fb7b', {
    _asset: address,
})
export type AssetSupportedEventArgs = EParams<typeof AssetSupported>

/** CapitalPaused() */
export const CapitalPaused = event('0x71f0e5b62f846a22e0b4d159e516e62fa9c2b8eb570be15f83e67d98a2ee51e0', {})
export type CapitalPausedEventArgs = EParams<typeof CapitalPaused>

/** CapitalUnpaused() */
export const CapitalUnpaused = event('0x891ebab18da80ebeeea06b1b1cede098329c4c008906a98370c2ac7a80b571cb', {})
export type CapitalUnpausedEventArgs = EParams<typeof CapitalUnpaused>

/** DripDurationChanged(uint256) */
export const DripDurationChanged = event('0x406e15fbca1d8ded2dbb06765fea3a54f18395c54125a4c9916dd00ea14ee15e', {
    dripDuration: uint256,
})
export type DripDurationChangedEventArgs = EParams<typeof DripDurationChanged>

/** DripperChanged(address) */
export const DripperChanged = event('0xaf2910d9759321733de15af1827a49830692912adeb2b3646334861f2cd2eed4', {
    _dripper: indexed(address),
})
export type DripperChangedEventArgs = EParams<typeof DripperChanged>

/** GovernorshipTransferred(address,address) */
export const GovernorshipTransferred = event('0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type GovernorshipTransferredEventArgs = EParams<typeof GovernorshipTransferred>

/** MaxSupplyDiffChanged(uint256) */
export const MaxSupplyDiffChanged = event('0x95201f9c21f26877223b1ff4073936a6484c35495649e60e55730497aeb60d93', {
    maxSupplyDiff: uint256,
})
export type MaxSupplyDiffChangedEventArgs = EParams<typeof MaxSupplyDiffChanged>

/** Mint(address,uint256) */
export const Mint = event('0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885', {
    _addr: address,
    _value: uint256,
})
export type MintEventArgs = EParams<typeof Mint>

/** NetOusdMintForStrategyThresholdChanged(uint256) */
export const NetOusdMintForStrategyThresholdChanged = event('0xc29d6fedbc6bdf267a08166c2b976fbd72aca5d6a769528616f8b9224c8f197f', {
    _threshold: uint256,
})
export type NetOusdMintForStrategyThresholdChangedEventArgs = EParams<typeof NetOusdMintForStrategyThresholdChanged>

/** OusdMetaStrategyUpdated(address) */
export const OusdMetaStrategyUpdated = event('0xa12850fb726e0b2b7b3c9a9342031e1268a8148d0eb06b4bea8613204ffcd2b8', {
    _ousdMetaStrategy: address,
})
export type OusdMetaStrategyUpdatedEventArgs = EParams<typeof OusdMetaStrategyUpdated>

/** PendingGovernorshipTransfer(address,address) */
export const PendingGovernorshipTransfer = event('0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d', {
    previousGovernor: indexed(address),
    newGovernor: indexed(address),
})
export type PendingGovernorshipTransferEventArgs = EParams<typeof PendingGovernorshipTransfer>

/** PriceProviderUpdated(address) */
export const PriceProviderUpdated = event('0xb266add5f3044b17d27db796af992cecbe413921b4e8aaaee03c719e16b9806a', {
    _priceProvider: address,
})
export type PriceProviderUpdatedEventArgs = EParams<typeof PriceProviderUpdated>

/** RebasePaused() */
export const RebasePaused = event('0x8cff26a5985614b3d30629cc4ab83824bf115aec971b718d8f2f99562032e972', {})
export type RebasePausedEventArgs = EParams<typeof RebasePaused>

/** RebasePerSecondMaxChanged(uint256) */
export const RebasePerSecondMaxChanged = event('0xef46f143af5fead0010484fe7d6ec2e2972420faa76157f5a6075aa72e614cb5', {
    rebaseRatePerSecond: uint256,
})
export type RebasePerSecondMaxChangedEventArgs = EParams<typeof RebasePerSecondMaxChanged>

/** RebaseThresholdUpdated(uint256) */
export const RebaseThresholdUpdated = event('0x39367850377ac04920a9a670f2180e7a94d83b15ad302e59875ec58fd10bd37d', {
    _threshold: uint256,
})
export type RebaseThresholdUpdatedEventArgs = EParams<typeof RebaseThresholdUpdated>

/** RebaseUnpaused() */
export const RebaseUnpaused = event('0xbc044409505c95b6b851433df96e1beae715c909d8e7c1d6d7ab783300d4e3b9', {})
export type RebaseUnpausedEventArgs = EParams<typeof RebaseUnpaused>

/** Redeem(address,uint256) */
export const Redeem = event('0x222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a6', {
    _addr: address,
    _value: uint256,
})
export type RedeemEventArgs = EParams<typeof Redeem>

/** RedeemFeeUpdated(uint256) */
export const RedeemFeeUpdated = event('0xd6c7508d6658ccee36b7b7d7fd72e5cbaeefb40c64eff24e9ae7470e846304ee', {
    _redeemFeeBps: uint256,
})
export type RedeemFeeUpdatedEventArgs = EParams<typeof RedeemFeeUpdated>

/** StrategistUpdated(address) */
export const StrategistUpdated = event('0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee', {
    _address: address,
})
export type StrategistUpdatedEventArgs = EParams<typeof StrategistUpdated>

/** StrategyAddedToMintWhitelist(address) */
export const StrategyAddedToMintWhitelist = event('0x47c8c96a5942f094264111c5fe7f6a4fe86efe63254a6fa7afa5fc84f07d58e8', {
    strategy: indexed(address),
})
export type StrategyAddedToMintWhitelistEventArgs = EParams<typeof StrategyAddedToMintWhitelist>

/** StrategyApproved(address) */
export const StrategyApproved = event('0x960dd94cbb79169f09a4e445d58b895df2d9bffa5b31055d0932d801724a20d1', {
    _addr: address,
})
export type StrategyApprovedEventArgs = EParams<typeof StrategyApproved>

/** StrategyRemoved(address) */
export const StrategyRemoved = event('0x09a1db4b80c32706328728508c941a6b954f31eb5affd32f236c1fd405f8fea4', {
    _addr: address,
})
export type StrategyRemovedEventArgs = EParams<typeof StrategyRemoved>

/** StrategyRemovedFromMintWhitelist(address) */
export const StrategyRemovedFromMintWhitelist = event('0x0ec40967a61509853550658e51d0e4297f7cba244fe4adc8ba18b5631ac20e2f', {
    strategy: indexed(address),
})
export type StrategyRemovedFromMintWhitelistEventArgs = EParams<typeof StrategyRemovedFromMintWhitelist>

/** SwapAllowedUndervalueChanged(uint256) */
export const SwapAllowedUndervalueChanged = event('0xf12c00256bee2b6facb111a88a9b1cff86e79132939b44f1353212d6f7469557', {
    _basis: uint256,
})
export type SwapAllowedUndervalueChangedEventArgs = EParams<typeof SwapAllowedUndervalueChanged>

/** SwapSlippageChanged(address,uint256) */
export const SwapSlippageChanged = event('0x8d22e9d2cbe8bb65a3c4412bd8970743864512a1a0e004e8d00fb96277b78b94', {
    _asset: address,
    _basis: uint256,
})
export type SwapSlippageChangedEventArgs = EParams<typeof SwapSlippageChanged>

/** Swapped(address,address,uint256,uint256) */
export const Swapped = event('0xa078c4190abe07940190effc1846be0ccf03ad6007bc9e93f9697d0b460befbb', {
    _fromAsset: indexed(address),
    _toAsset: indexed(address),
    _fromAssetAmount: uint256,
    _toAssetAmount: uint256,
})
export type SwappedEventArgs = EParams<typeof Swapped>

/** SwapperChanged(address) */
export const SwapperChanged = event('0x7d7719313229e558c5a3893cad2eb86a86a049156d1d9ebd5c63a8eedefd1c03', {
    _address: address,
})
export type SwapperChangedEventArgs = EParams<typeof SwapperChanged>

/** TrusteeAddressChanged(address) */
export const TrusteeAddressChanged = event('0x1e4af5ac389e8cde1bdaa6830881b6c987c62a45cfb3b33d27d805cde3b57750', {
    _address: address,
})
export type TrusteeAddressChangedEventArgs = EParams<typeof TrusteeAddressChanged>

/** TrusteeFeeBpsChanged(uint256) */
export const TrusteeFeeBpsChanged = event('0x56287a45051933ea374811b3d5d165033047be5572cac676f7c28b8be4f746c7', {
    _basis: uint256,
})
export type TrusteeFeeBpsChangedEventArgs = EParams<typeof TrusteeFeeBpsChanged>

/** VaultBufferUpdated(uint256) */
export const VaultBufferUpdated = event('0x41ecb23a0e7865b25f38c268b7c3012220d822929e9edff07326e89d5bb822b5', {
    _vaultBuffer: uint256,
})
export type VaultBufferUpdatedEventArgs = EParams<typeof VaultBufferUpdated>

/** WithdrawalClaimDelayUpdated(uint256) */
export const WithdrawalClaimDelayUpdated = event('0xc59f5e32049abab44ddea11021f5abb89422a2f550837afcf25df9fc8d0db6b0', {
    _newDelay: uint256,
})
export type WithdrawalClaimDelayUpdatedEventArgs = EParams<typeof WithdrawalClaimDelayUpdated>

/** WithdrawalClaimable(uint256,uint256) */
export const WithdrawalClaimable = event('0xee79a0c43d3993055690b54e074b5153e8bae8d1a872b656dedb64aa8f463333', {
    _claimable: uint256,
    _newClaimable: uint256,
})
export type WithdrawalClaimableEventArgs = EParams<typeof WithdrawalClaimable>

/** WithdrawalClaimed(address,uint256,uint256) */
export const WithdrawalClaimed = event('0x2d43eb174787155132b52ddb6b346e2dca99302eac3df4466dbeff953d3c84d1', {
    _withdrawer: indexed(address),
    _requestId: indexed(uint256),
    _amount: uint256,
})
export type WithdrawalClaimedEventArgs = EParams<typeof WithdrawalClaimed>

/** WithdrawalRequested(address,uint256,uint256,uint256) */
export const WithdrawalRequested = event('0x38e3d972947cfef94205163d483d6287ef27eb312e20cb8e0b13a49989db232e', {
    _withdrawer: indexed(address),
    _requestId: indexed(uint256),
    _amount: uint256,
    _queued: uint256,
})
export type WithdrawalRequestedEventArgs = EParams<typeof WithdrawalRequested>

/** YieldDistribution(address,uint256,uint256) */
export const YieldDistribution = event('0x09516ecf4a8a86e59780a9befc6dee948bc9e60a36e3be68d31ea817ee8d2c80', {
    _to: address,
    _yield: uint256,
    _fee: uint256,
})
export type YieldDistributionEventArgs = EParams<typeof YieldDistribution>
