import { ContractBase } from '../abi.support.js'
import { assetToPToken, checkBalance, getRewardTokenAddresses, governor, harvesterAddress, isGovernor, platformAddress, rewardTokenAddresses, supportsAsset, vaultAddress } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, RewardTokenAddressesParams, SupportsAssetParams } from './functions.js'

export class Contract extends ContractBase {
    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
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

    platformAddress() {
        return this.eth_call(platformAddress, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(rewardTokenAddresses, {_0})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(supportsAsset, {_asset})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }
}
