import { ContractBase } from '../abi.support.js'
import { assetToPToken, auraRewardPoolAddress, balancerPoolId, balancerVault, checkBalance, checkBalance_1, frxETH, getRewardTokenAddresses, governor, harvesterAddress, isGovernor, maxDepositDeviation, maxWithdrawalDeviation, platformAddress, rETH, rewardTokenAddresses, sfrxETH, stETH, supportsAsset, vaultAddress, wstETH } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, RewardTokenAddressesParams, SupportsAssetParams } from './functions.js'

export class Contract extends ContractBase {
    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    auraRewardPoolAddress() {
        return this.eth_call(auraRewardPoolAddress, {})
    }

    balancerPoolId() {
        return this.eth_call(balancerPoolId, {})
    }

    balancerVault() {
        return this.eth_call(balancerVault, {})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
    }

    checkBalance_1() {
        return this.eth_call(checkBalance_1, {})
    }

    frxETH() {
        return this.eth_call(frxETH, {})
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

    maxDepositDeviation() {
        return this.eth_call(maxDepositDeviation, {})
    }

    maxWithdrawalDeviation() {
        return this.eth_call(maxWithdrawalDeviation, {})
    }

    platformAddress() {
        return this.eth_call(platformAddress, {})
    }

    rETH() {
        return this.eth_call(rETH, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(rewardTokenAddresses, {_0})
    }

    sfrxETH() {
        return this.eth_call(sfrxETH, {})
    }

    stETH() {
        return this.eth_call(stETH, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(supportsAsset, {_asset})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }

    wstETH() {
        return this.eth_call(wstETH, {})
    }
}
