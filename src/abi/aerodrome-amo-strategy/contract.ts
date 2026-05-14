import { ContractBase } from '../abi.support.js'
import { OETHb, SOLVENCY_THRESHOLD, WETH, allowedWethShareEnd, allowedWethShareStart, assetToPToken, checkBalance, clGauge, clPool, getCurrentTradingTick, getPoolX96Price, getPositionPrincipal, getRewardTokenAddresses, getWETHShare, governor, harvesterAddress, helper, isGovernor, lowerTick, onERC721Received, platformAddress, positionManager, rewardTokenAddresses, sqrtRatioX96TickClosestToParity, sqrtRatioX96TickHigher, sqrtRatioX96TickLower, supportsAsset, swapRouter, tickSpacing, tokenId, underlyingAssets, upperTick, vaultAddress } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, OnERC721ReceivedParams, RewardTokenAddressesParams, SupportsAssetParams } from './functions.js'

export class Contract extends ContractBase {
    OETHb() {
        return this.eth_call(OETHb, {})
    }

    SOLVENCY_THRESHOLD() {
        return this.eth_call(SOLVENCY_THRESHOLD, {})
    }

    WETH() {
        return this.eth_call(WETH, {})
    }

    allowedWethShareEnd() {
        return this.eth_call(allowedWethShareEnd, {})
    }

    allowedWethShareStart() {
        return this.eth_call(allowedWethShareStart, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
    }

    clGauge() {
        return this.eth_call(clGauge, {})
    }

    clPool() {
        return this.eth_call(clPool, {})
    }

    getCurrentTradingTick() {
        return this.eth_call(getCurrentTradingTick, {})
    }

    getPoolX96Price() {
        return this.eth_call(getPoolX96Price, {})
    }

    getPositionPrincipal() {
        return this.eth_call(getPositionPrincipal, {})
    }

    getRewardTokenAddresses() {
        return this.eth_call(getRewardTokenAddresses, {})
    }

    getWETHShare() {
        return this.eth_call(getWETHShare, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    harvesterAddress() {
        return this.eth_call(harvesterAddress, {})
    }

    helper() {
        return this.eth_call(helper, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    lowerTick() {
        return this.eth_call(lowerTick, {})
    }

    onERC721Received(_0: OnERC721ReceivedParams["_0"], _1: OnERC721ReceivedParams["_1"], _2: OnERC721ReceivedParams["_2"], _3: OnERC721ReceivedParams["_3"]) {
        return this.eth_call(onERC721Received, {_0, _1, _2, _3})
    }

    platformAddress() {
        return this.eth_call(platformAddress, {})
    }

    positionManager() {
        return this.eth_call(positionManager, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(rewardTokenAddresses, {_0})
    }

    sqrtRatioX96TickClosestToParity() {
        return this.eth_call(sqrtRatioX96TickClosestToParity, {})
    }

    sqrtRatioX96TickHigher() {
        return this.eth_call(sqrtRatioX96TickHigher, {})
    }

    sqrtRatioX96TickLower() {
        return this.eth_call(sqrtRatioX96TickLower, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(supportsAsset, {_asset})
    }

    swapRouter() {
        return this.eth_call(swapRouter, {})
    }

    tickSpacing() {
        return this.eth_call(tickSpacing, {})
    }

    tokenId() {
        return this.eth_call(tokenId, {})
    }

    underlyingAssets() {
        return this.eth_call(underlyingAssets, {})
    }

    upperTick() {
        return this.eth_call(upperTick, {})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }
}
