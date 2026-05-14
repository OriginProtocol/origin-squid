import { address, array, bool, bytes, bytes4, int24, struct, uint160, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** OETHb() */
export const OETHb = func('0x7b3b6068', {}, address)
export type OETHbParams = FunctionArguments<typeof OETHb>
export type OETHbReturn = FunctionReturn<typeof OETHb>

/** SOLVENCY_THRESHOLD() */
export const SOLVENCY_THRESHOLD = func('0x1b91d0cc', {}, uint256)
export type SOLVENCY_THRESHOLDParams = FunctionArguments<typeof SOLVENCY_THRESHOLD>
export type SOLVENCY_THRESHOLDReturn = FunctionReturn<typeof SOLVENCY_THRESHOLD>

/** WETH() */
export const WETH = func('0xad5c4648', {}, address)
export type WETHParams = FunctionArguments<typeof WETH>
export type WETHReturn = FunctionReturn<typeof WETH>

/** allowedWethShareEnd() */
export const allowedWethShareEnd = func('0x042e586e', {}, uint256)
export type AllowedWethShareEndParams = FunctionArguments<typeof allowedWethShareEnd>
export type AllowedWethShareEndReturn = FunctionReturn<typeof allowedWethShareEnd>

/** allowedWethShareStart() */
export const allowedWethShareStart = func('0x571fbf60', {}, uint256)
export type AllowedWethShareStartParams = FunctionArguments<typeof allowedWethShareStart>
export type AllowedWethShareStartReturn = FunctionReturn<typeof allowedWethShareStart>

/** assetToPToken(address) */
export const assetToPToken = func('0x0fc3b4c4', {
    _0: address,
}, address)
export type AssetToPTokenParams = FunctionArguments<typeof assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof assetToPToken>

/** checkBalance(address) */
export const checkBalance = func('0x5f515226', {
    _asset: address,
}, uint256)
export type CheckBalanceParams = FunctionArguments<typeof checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof checkBalance>

/** clGauge() */
export const clGauge = func('0x3d6953d7', {}, address)
export type ClGaugeParams = FunctionArguments<typeof clGauge>
export type ClGaugeReturn = FunctionReturn<typeof clGauge>

/** clPool() */
export const clPool = func('0x4c0339b4', {}, address)
export type ClPoolParams = FunctionArguments<typeof clPool>
export type ClPoolReturn = FunctionReturn<typeof clPool>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** collectRewardTokens() */
export const collectRewardTokens = func('0x5a063f63', {})
export type CollectRewardTokensParams = FunctionArguments<typeof collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof collectRewardTokens>

/** deposit(address,uint256) */
export const deposit = func('0x47e7ef24', {
    _asset: address,
    _amount: uint256,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** depositAll() */
export const depositAll = func('0xde5f6268', {})
export type DepositAllParams = FunctionArguments<typeof depositAll>
export type DepositAllReturn = FunctionReturn<typeof depositAll>

/** getCurrentTradingTick() */
export const getCurrentTradingTick = func('0x30dbda18', {}, int24)
export type GetCurrentTradingTickParams = FunctionArguments<typeof getCurrentTradingTick>
export type GetCurrentTradingTickReturn = FunctionReturn<typeof getCurrentTradingTick>

/** getPoolX96Price() */
export const getPoolX96Price = func('0x30c83576', {}, uint160)
export type GetPoolX96PriceParams = FunctionArguments<typeof getPoolX96Price>
export type GetPoolX96PriceReturn = FunctionReturn<typeof getPoolX96Price>

/** getPositionPrincipal() */
export const getPositionPrincipal = func('0x45557c1f', {}, struct({
    _amountWeth: uint256,
    _amountOethb: uint256,
}))
export type GetPositionPrincipalParams = FunctionArguments<typeof getPositionPrincipal>
export type GetPositionPrincipalReturn = FunctionReturn<typeof getPositionPrincipal>

/** getRewardTokenAddresses() */
export const getRewardTokenAddresses = func('0xf6ca71b0', {}, array(address))
export type GetRewardTokenAddressesParams = FunctionArguments<typeof getRewardTokenAddresses>
export type GetRewardTokenAddressesReturn = FunctionReturn<typeof getRewardTokenAddresses>

/** getWETHShare() */
export const getWETHShare = func('0xcd8b36c7', {}, uint256)
export type GetWETHShareParams = FunctionArguments<typeof getWETHShare>
export type GetWETHShareReturn = FunctionReturn<typeof getWETHShare>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** harvesterAddress() */
export const harvesterAddress = func('0x67c7066c', {}, address)
export type HarvesterAddressParams = FunctionArguments<typeof harvesterAddress>
export type HarvesterAddressReturn = FunctionReturn<typeof harvesterAddress>

/** helper() */
export const helper = func('0x63b0e66a', {}, address)
export type HelperParams = FunctionArguments<typeof helper>
export type HelperReturn = FunctionReturn<typeof helper>

/** initialize(address[]) */
export const initialize = func('0xa224cee7', {
    _rewardTokenAddresses: array(address),
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** lowerTick() */
export const lowerTick = func('0x9b1344ac', {}, int24)
export type LowerTickParams = FunctionArguments<typeof lowerTick>
export type LowerTickReturn = FunctionReturn<typeof lowerTick>

/** onERC721Received(address,address,uint256,bytes) */
export const onERC721Received = func('0x150b7a02', {
    _0: address,
    _1: address,
    _2: uint256,
    _3: bytes,
}, bytes4)
export type OnERC721ReceivedParams = FunctionArguments<typeof onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof onERC721Received>

/** platformAddress() */
export const platformAddress = func('0xdbe55e56', {}, address)
export type PlatformAddressParams = FunctionArguments<typeof platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof platformAddress>

/** positionManager() */
export const positionManager = func('0x791b98bc', {}, address)
export type PositionManagerParams = FunctionArguments<typeof positionManager>
export type PositionManagerReturn = FunctionReturn<typeof positionManager>

/** rebalance(uint256,bool,uint256) */
export const rebalance = func('0x7f1a327c', {
    _amountToSwap: uint256,
    _swapWeth: bool,
    _minTokenReceived: uint256,
})
export type RebalanceParams = FunctionArguments<typeof rebalance>
export type RebalanceReturn = FunctionReturn<typeof rebalance>

/** removePToken(uint256) */
export const removePToken = func('0x9136616a', {
    _0: uint256,
})
export type RemovePTokenParams = FunctionArguments<typeof removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof removePToken>

/** rewardTokenAddresses(uint256) */
export const rewardTokenAddresses = func('0x7b2d9b2c', {
    _0: uint256,
}, address)
export type RewardTokenAddressesParams = FunctionArguments<typeof rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof rewardTokenAddresses>

/** safeApproveAllTokens() */
export const safeApproveAllTokens = func('0xad1728cb', {})
export type SafeApproveAllTokensParams = FunctionArguments<typeof safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof safeApproveAllTokens>

/** setAllowedPoolWethShareInterval(uint256,uint256) */
export const setAllowedPoolWethShareInterval = func('0x01701fe9', {
    _allowedWethShareStart: uint256,
    _allowedWethShareEnd: uint256,
})
export type SetAllowedPoolWethShareIntervalParams = FunctionArguments<typeof setAllowedPoolWethShareInterval>
export type SetAllowedPoolWethShareIntervalReturn = FunctionReturn<typeof setAllowedPoolWethShareInterval>

/** setHarvesterAddress(address) */
export const setHarvesterAddress = func('0xc2e1e3f4', {
    _harvesterAddress: address,
})
export type SetHarvesterAddressParams = FunctionArguments<typeof setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof setHarvesterAddress>

/** setPTokenAddress(address,address) */
export const setPTokenAddress = func('0x0ed57b3a', {
    _0: address,
    _1: address,
})
export type SetPTokenAddressParams = FunctionArguments<typeof setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof setPTokenAddress>

/** setRewardTokenAddresses(address[]) */
export const setRewardTokenAddresses = func('0x96d538bb', {
    _rewardTokenAddresses: array(address),
})
export type SetRewardTokenAddressesParams = FunctionArguments<typeof setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof setRewardTokenAddresses>

/** sqrtRatioX96TickClosestToParity() */
export const sqrtRatioX96TickClosestToParity = func('0x4bc9c477', {}, uint160)
export type SqrtRatioX96TickClosestToParityParams = FunctionArguments<typeof sqrtRatioX96TickClosestToParity>
export type SqrtRatioX96TickClosestToParityReturn = FunctionReturn<typeof sqrtRatioX96TickClosestToParity>

/** sqrtRatioX96TickHigher() */
export const sqrtRatioX96TickHigher = func('0x65f1389d', {}, uint160)
export type SqrtRatioX96TickHigherParams = FunctionArguments<typeof sqrtRatioX96TickHigher>
export type SqrtRatioX96TickHigherReturn = FunctionReturn<typeof sqrtRatioX96TickHigher>

/** sqrtRatioX96TickLower() */
export const sqrtRatioX96TickLower = func('0x153eb6d1', {}, uint160)
export type SqrtRatioX96TickLowerParams = FunctionArguments<typeof sqrtRatioX96TickLower>
export type SqrtRatioX96TickLowerReturn = FunctionReturn<typeof sqrtRatioX96TickLower>

/** supportsAsset(address) */
export const supportsAsset = func('0xaa388af6', {
    _asset: address,
}, bool)
export type SupportsAssetParams = FunctionArguments<typeof supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof supportsAsset>

/** swapRouter() */
export const swapRouter = func('0xc31c9c07', {}, address)
export type SwapRouterParams = FunctionArguments<typeof swapRouter>
export type SwapRouterReturn = FunctionReturn<typeof swapRouter>

/** tickSpacing() */
export const tickSpacing = func('0xd0c93a7c', {}, int24)
export type TickSpacingParams = FunctionArguments<typeof tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof tickSpacing>

/** tokenId() */
export const tokenId = func('0x17d70f7c', {}, uint256)
export type TokenIdParams = FunctionArguments<typeof tokenId>
export type TokenIdReturn = FunctionReturn<typeof tokenId>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** transferToken(address,uint256) */
export const transferToken = func('0x1072cbea', {
    _asset: address,
    _amount: uint256,
})
export type TransferTokenParams = FunctionArguments<typeof transferToken>
export type TransferTokenReturn = FunctionReturn<typeof transferToken>

/** underlyingAssets() */
export const underlyingAssets = func('0x9c1eb3da', {}, uint256)
export type UnderlyingAssetsParams = FunctionArguments<typeof underlyingAssets>
export type UnderlyingAssetsReturn = FunctionReturn<typeof underlyingAssets>

/** upperTick() */
export const upperTick = func('0x727dd228', {}, int24)
export type UpperTickParams = FunctionArguments<typeof upperTick>
export type UpperTickReturn = FunctionReturn<typeof upperTick>

/** vaultAddress() */
export const vaultAddress = func('0x430bf08a', {}, address)
export type VaultAddressParams = FunctionArguments<typeof vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof vaultAddress>

/** withdraw(address,address,uint256) */
export const withdraw = func('0xd9caed12', {
    _recipient: address,
    _asset: address,
    _amount: uint256,
})
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>

/** withdrawAll() */
export const withdrawAll = func('0x853828b6', {})
export type WithdrawAllParams = FunctionArguments<typeof withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof withdrawAll>
