import { ContractBase } from '../abi.support.js'
import { MAX_PRICE_STALENESS, assetToPToken, bridgedWOETH, checkBalance, getBridgedWOETHValue, getRewardTokenAddresses, governor, harvesterAddress, isGovernor, lastOraclePrice, maxPriceDiffBps, oethb, platformAddress, rewardTokenAddresses, supportsAsset, updateWOETHOraclePrice, vaultAddress, weth } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, GetBridgedWOETHValueParams, RewardTokenAddressesParams, SupportsAssetParams } from './functions.js'

export class Contract extends ContractBase {
    MAX_PRICE_STALENESS() {
        return this.eth_call(MAX_PRICE_STALENESS, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    bridgedWOETH() {
        return this.eth_call(bridgedWOETH, {})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
    }

    getBridgedWOETHValue(woethAmount: GetBridgedWOETHValueParams["woethAmount"]) {
        return this.eth_call(getBridgedWOETHValue, {woethAmount})
    }

    getRewardTokenAddresses() {
        return this.eth_call(getRewardTokenAddresses, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    harvesterAddress() {
        return this.eth_call(harvesterAddress, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    lastOraclePrice() {
        return this.eth_call(lastOraclePrice, {})
    }

    maxPriceDiffBps() {
        return this.eth_call(maxPriceDiffBps, {})
    }

    oethb() {
        return this.eth_call(oethb, {})
    }

    platformAddress() {
        return this.eth_call(platformAddress, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(rewardTokenAddresses, {_0})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(supportsAsset, {_asset})
    }

    updateWOETHOraclePrice() {
        return this.eth_call(updateWOETHOraclePrice, {})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }

    weth() {
        return this.eth_call(weth, {})
    }
}
