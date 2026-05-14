import { address, array, bool, bytes32, int256, struct, uint128, uint16, uint256, uint40, uint64, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** ADMIN_IMPLEMENTATION() */
export const ADMIN_IMPLEMENTATION = func('0xcc2fe94b', {}, address)
export type ADMIN_IMPLEMENTATIONParams = FunctionArguments<typeof ADMIN_IMPLEMENTATION>
export type ADMIN_IMPLEMENTATIONReturn = FunctionReturn<typeof ADMIN_IMPLEMENTATION>

/** addWithdrawalQueueLiquidity() */
export const addWithdrawalQueueLiquidity = func('0xb9b17f9f', {})
export type AddWithdrawalQueueLiquidityParams = FunctionArguments<typeof addWithdrawalQueueLiquidity>
export type AddWithdrawalQueueLiquidityReturn = FunctionReturn<typeof addWithdrawalQueueLiquidity>

/** adminImplPosition() */
export const adminImplPosition = func('0xef08edc2', {}, bytes32)
export type AdminImplPositionParams = FunctionArguments<typeof adminImplPosition>
export type AdminImplPositionReturn = FunctionReturn<typeof adminImplPosition>

/** allocate() */
export const allocate = func('0xabaa9916', {})
export type AllocateParams = FunctionArguments<typeof allocate>
export type AllocateReturn = FunctionReturn<typeof allocate>

/** assetDefaultStrategies(address) */
export const assetDefaultStrategies = func('0xa403e4d5', {
    _0: address,
}, address)
export type AssetDefaultStrategiesParams = FunctionArguments<typeof assetDefaultStrategies>
export type AssetDefaultStrategiesReturn = FunctionReturn<typeof assetDefaultStrategies>

/** autoAllocateThreshold() */
export const autoAllocateThreshold = func('0x9fa1826e', {}, uint256)
export type AutoAllocateThresholdParams = FunctionArguments<typeof autoAllocateThreshold>
export type AutoAllocateThresholdReturn = FunctionReturn<typeof autoAllocateThreshold>

/** burnForStrategy(uint256) */
export const burnForStrategy = func('0x6217f3ea', {
    amount: uint256,
})
export type BurnForStrategyParams = FunctionArguments<typeof burnForStrategy>
export type BurnForStrategyReturn = FunctionReturn<typeof burnForStrategy>

/** cacheWETHAssetIndex() */
export const cacheWETHAssetIndex = func('0x44c54707', {})
export type CacheWETHAssetIndexParams = FunctionArguments<typeof cacheWETHAssetIndex>
export type CacheWETHAssetIndexReturn = FunctionReturn<typeof cacheWETHAssetIndex>

/** calculateRedeemOutputs(uint256) */
export const calculateRedeemOutputs = func('0x67bd7ba3', {
    _amount: uint256,
}, array(uint256))
export type CalculateRedeemOutputsParams = FunctionArguments<typeof calculateRedeemOutputs>
export type CalculateRedeemOutputsReturn = FunctionReturn<typeof calculateRedeemOutputs>

/** capitalPaused() */
export const capitalPaused = func('0xe6cc5432', {}, bool)
export type CapitalPausedParams = FunctionArguments<typeof capitalPaused>
export type CapitalPausedReturn = FunctionReturn<typeof capitalPaused>

/** checkBalance(address) */
export const checkBalance = func('0x5f515226', {
    _asset: address,
}, uint256)
export type CheckBalanceParams = FunctionArguments<typeof checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof checkBalance>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** claimWithdrawal(uint256) */
export const claimWithdrawal = func('0xf8444436', {
    _requestId: uint256,
}, uint256)
export type ClaimWithdrawalParams = FunctionArguments<typeof claimWithdrawal>
export type ClaimWithdrawalReturn = FunctionReturn<typeof claimWithdrawal>

/** claimWithdrawals(uint256[]) */
export const claimWithdrawals = func('0x48e30f54', {
    _requestIds: array(uint256),
}, struct({
    amounts: array(uint256),
    totalAmount: uint256,
}))
export type ClaimWithdrawalsParams = FunctionArguments<typeof claimWithdrawals>
export type ClaimWithdrawalsReturn = FunctionReturn<typeof claimWithdrawals>

/** dripDuration() */
export const dripDuration = func('0xbb7a632e', {}, uint64)
export type DripDurationParams = FunctionArguments<typeof dripDuration>
export type DripDurationReturn = FunctionReturn<typeof dripDuration>

/** dripper() */
export const dripper = func('0x603ea03b', {}, address)
export type DripperParams = FunctionArguments<typeof dripper>
export type DripperReturn = FunctionReturn<typeof dripper>

/** getAllAssets() */
export const getAllAssets = func('0x2acada4d', {}, array(address))
export type GetAllAssetsParams = FunctionArguments<typeof getAllAssets>
export type GetAllAssetsReturn = FunctionReturn<typeof getAllAssets>

/** getAllStrategies() */
export const getAllStrategies = func('0xc3b28864', {}, array(address))
export type GetAllStrategiesParams = FunctionArguments<typeof getAllStrategies>
export type GetAllStrategiesReturn = FunctionReturn<typeof getAllStrategies>

/** getAssetConfig(address) */
export const getAssetConfig = func('0x6ec3ab67', {
    _asset: address,
}, struct({
    isSupported: bool,
    unitConversion: uint8,
    decimals: uint8,
    allowedOracleSlippageBps: uint16,
}))
export type GetAssetConfigParams = FunctionArguments<typeof getAssetConfig>
export type GetAssetConfigReturn = FunctionReturn<typeof getAssetConfig>

/** getAssetCount() */
export const getAssetCount = func('0xa0aead4d', {}, uint256)
export type GetAssetCountParams = FunctionArguments<typeof getAssetCount>
export type GetAssetCountReturn = FunctionReturn<typeof getAssetCount>

/** getStrategyCount() */
export const getStrategyCount = func('0x31e19cfa', {}, uint256)
export type GetStrategyCountParams = FunctionArguments<typeof getStrategyCount>
export type GetStrategyCountReturn = FunctionReturn<typeof getStrategyCount>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** initialize(address,address) */
export const initialize = func('0x485cc955', {
    _priceProvider: address,
    _oToken: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** isMintWhitelistedStrategy(address) */
export const isMintWhitelistedStrategy = func('0x4530820a', {
    _0: address,
}, bool)
export type IsMintWhitelistedStrategyParams = FunctionArguments<typeof isMintWhitelistedStrategy>
export type IsMintWhitelistedStrategyReturn = FunctionReturn<typeof isMintWhitelistedStrategy>

/** isSupportedAsset(address) */
export const isSupportedAsset = func('0x9be918e6', {
    _asset: address,
}, bool)
export type IsSupportedAssetParams = FunctionArguments<typeof isSupportedAsset>
export type IsSupportedAssetReturn = FunctionReturn<typeof isSupportedAsset>

/** lastRebase() */
export const lastRebase = func('0x78f353a1', {}, uint64)
export type LastRebaseParams = FunctionArguments<typeof lastRebase>
export type LastRebaseReturn = FunctionReturn<typeof lastRebase>

/** maxSupplyDiff() */
export const maxSupplyDiff = func('0x8e510b52', {}, uint256)
export type MaxSupplyDiffParams = FunctionArguments<typeof maxSupplyDiff>
export type MaxSupplyDiffReturn = FunctionReturn<typeof maxSupplyDiff>

/** mint(address,uint256,uint256) */
export const mint = func('0x156e29f6', {
    _asset: address,
    _amount: uint256,
    _minimumOusdAmount: uint256,
})
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

/** mintForStrategy(uint256) */
export const mintForStrategy = func('0xab80dafb', {
    amount: uint256,
})
export type MintForStrategyParams = FunctionArguments<typeof mintForStrategy>
export type MintForStrategyReturn = FunctionReturn<typeof mintForStrategy>

/** netOusdMintForStrategyThreshold() */
export const netOusdMintForStrategyThreshold = func('0x7a2202f3', {}, uint256)
export type NetOusdMintForStrategyThresholdParams = FunctionArguments<typeof netOusdMintForStrategyThreshold>
export type NetOusdMintForStrategyThresholdReturn = FunctionReturn<typeof netOusdMintForStrategyThreshold>

/** netOusdMintedForStrategy() */
export const netOusdMintedForStrategy = func('0xe45cc9f0', {}, int256)
export type NetOusdMintedForStrategyParams = FunctionArguments<typeof netOusdMintedForStrategy>
export type NetOusdMintedForStrategyReturn = FunctionReturn<typeof netOusdMintedForStrategy>

/** oUSD() */
export const oUSD = func('0x5802a172', {}, address)
export type OUSDParams = FunctionArguments<typeof oUSD>
export type OUSDReturn = FunctionReturn<typeof oUSD>

/** ousdMetaStrategy() */
export const ousdMetaStrategy = func('0x18ce56bd', {}, address)
export type OusdMetaStrategyParams = FunctionArguments<typeof ousdMetaStrategy>
export type OusdMetaStrategyReturn = FunctionReturn<typeof ousdMetaStrategy>

/** previewYield() */
export const previewYield = func('0xea33b8e4', {}, uint256)
export type PreviewYieldParams = FunctionArguments<typeof previewYield>
export type PreviewYieldReturn = FunctionReturn<typeof previewYield>

/** priceProvider() */
export const priceProvider = func('0xb888879e', {}, address)
export type PriceProviderParams = FunctionArguments<typeof priceProvider>
export type PriceProviderReturn = FunctionReturn<typeof priceProvider>

/** priceUnitMint(address) */
export const priceUnitMint = func('0x3b8fe28d', {
    asset: address,
}, uint256)
export type PriceUnitMintParams = FunctionArguments<typeof priceUnitMint>
export type PriceUnitMintReturn = FunctionReturn<typeof priceUnitMint>

/** priceUnitRedeem(address) */
export const priceUnitRedeem = func('0x5b60f9fc', {
    asset: address,
}, uint256)
export type PriceUnitRedeemParams = FunctionArguments<typeof priceUnitRedeem>
export type PriceUnitRedeemReturn = FunctionReturn<typeof priceUnitRedeem>

/** rebase() */
export const rebase = func('0xaf14052c', {})
export type RebaseParams = FunctionArguments<typeof rebase>
export type RebaseReturn = FunctionReturn<typeof rebase>

/** rebasePaused() */
export const rebasePaused = func('0x53ca9f24', {}, bool)
export type RebasePausedParams = FunctionArguments<typeof rebasePaused>
export type RebasePausedReturn = FunctionReturn<typeof rebasePaused>

/** rebasePerSecondMax() */
export const rebasePerSecondMax = func('0x527e83a8', {}, uint64)
export type RebasePerSecondMaxParams = FunctionArguments<typeof rebasePerSecondMax>
export type RebasePerSecondMaxReturn = FunctionReturn<typeof rebasePerSecondMax>

/** rebasePerSecondTarget() */
export const rebasePerSecondTarget = func('0x4d5f4629', {}, uint64)
export type RebasePerSecondTargetParams = FunctionArguments<typeof rebasePerSecondTarget>
export type RebasePerSecondTargetReturn = FunctionReturn<typeof rebasePerSecondTarget>

/** rebaseThreshold() */
export const rebaseThreshold = func('0x52d38e5d', {}, uint256)
export type RebaseThresholdParams = FunctionArguments<typeof rebaseThreshold>
export type RebaseThresholdReturn = FunctionReturn<typeof rebaseThreshold>

/** redeem(uint256,uint256) */
export const redeem = func('0x7cbc2373', {
    _amount: uint256,
    _minimumUnitAmount: uint256,
})
export type RedeemParams = FunctionArguments<typeof redeem>
export type RedeemReturn = FunctionReturn<typeof redeem>

/** redeemFeeBps() */
export const redeemFeeBps = func('0x09f6442c', {}, uint256)
export type RedeemFeeBpsParams = FunctionArguments<typeof redeemFeeBps>
export type RedeemFeeBpsReturn = FunctionReturn<typeof redeemFeeBps>

/** requestWithdrawal(uint256) */
export const requestWithdrawal = func('0x9ee679e8', {
    _amount: uint256,
}, struct({
    requestId: uint256,
    queued: uint256,
}))
export type RequestWithdrawalParams = FunctionArguments<typeof requestWithdrawal>
export type RequestWithdrawalReturn = FunctionReturn<typeof requestWithdrawal>

/** setAdminImpl(address) */
export const setAdminImpl = func('0xfc0cfeee', {
    newImpl: address,
})
export type SetAdminImplParams = FunctionArguments<typeof setAdminImpl>
export type SetAdminImplReturn = FunctionReturn<typeof setAdminImpl>

/** strategies(address) */
export const strategies = func('0x39ebf823', {
    _0: address,
}, struct({
    isSupported: bool,
    _deprecated: uint256,
}))
export type StrategiesParams = FunctionArguments<typeof strategies>
export type StrategiesReturn = FunctionReturn<typeof strategies>

/** strategistAddr() */
export const strategistAddr = func('0x570d8e1d', {}, address)
export type StrategistAddrParams = FunctionArguments<typeof strategistAddr>
export type StrategistAddrReturn = FunctionReturn<typeof strategistAddr>

/** totalValue() */
export const totalValue = func('0xd4c3eea0', {}, uint256)
export type TotalValueParams = FunctionArguments<typeof totalValue>
export type TotalValueReturn = FunctionReturn<typeof totalValue>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** trusteeAddress() */
export const trusteeAddress = func('0x49c1d54d', {}, address)
export type TrusteeAddressParams = FunctionArguments<typeof trusteeAddress>
export type TrusteeAddressReturn = FunctionReturn<typeof trusteeAddress>

/** trusteeFeeBps() */
export const trusteeFeeBps = func('0x207134b0', {}, uint256)
export type TrusteeFeeBpsParams = FunctionArguments<typeof trusteeFeeBps>
export type TrusteeFeeBpsReturn = FunctionReturn<typeof trusteeFeeBps>

/** vaultBuffer() */
export const vaultBuffer = func('0x1edfe3da', {}, uint256)
export type VaultBufferParams = FunctionArguments<typeof vaultBuffer>
export type VaultBufferReturn = FunctionReturn<typeof vaultBuffer>

/** weth() */
export const weth = func('0x3fc8cef3', {}, address)
export type WethParams = FunctionArguments<typeof weth>
export type WethReturn = FunctionReturn<typeof weth>

/** wethAssetIndex() */
export const wethAssetIndex = func('0x54c6d858', {}, uint256)
export type WethAssetIndexParams = FunctionArguments<typeof wethAssetIndex>
export type WethAssetIndexReturn = FunctionReturn<typeof wethAssetIndex>

/** withdrawalClaimDelay() */
export const withdrawalClaimDelay = func('0x45e4213b', {}, uint256)
export type WithdrawalClaimDelayParams = FunctionArguments<typeof withdrawalClaimDelay>
export type WithdrawalClaimDelayReturn = FunctionReturn<typeof withdrawalClaimDelay>

/** withdrawalQueueMetadata() */
export const withdrawalQueueMetadata = func('0x362bd1a3', {}, struct({
    queued: uint128,
    claimable: uint128,
    claimed: uint128,
    nextWithdrawalIndex: uint128,
}))
export type WithdrawalQueueMetadataParams = FunctionArguments<typeof withdrawalQueueMetadata>
export type WithdrawalQueueMetadataReturn = FunctionReturn<typeof withdrawalQueueMetadata>

/** withdrawalRequests(uint256) */
export const withdrawalRequests = func('0x937b2581', {
    _0: uint256,
}, struct({
    withdrawer: address,
    claimed: bool,
    timestamp: uint40,
    amount: uint128,
    queued: uint128,
}))
export type WithdrawalRequestsParams = FunctionArguments<typeof withdrawalRequests>
export type WithdrawalRequestsReturn = FunctionReturn<typeof withdrawalRequests>
