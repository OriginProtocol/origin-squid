import { ContractBase } from '../abi.support.js'
import { assetToPToken, bridgeAsset, checkBalance, getRewardTokenAddresses, governor, harvesterAddress, inboundAdapter, isGovernor, isYieldOpInFlight, lastBalanceCheckTimestamp, lastYieldNonce, nonceProcessed, operator, outboundAdapter, pendingDepositAmount, pendingWithdrawalAmount, platformAddress, remoteStrategyBalance, rewardTokenAddresses, supportsAsset, vaultAddress } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, NonceProcessedParams, RewardTokenAddressesParams, SupportsAssetParams } from './functions.js'

export class Contract extends ContractBase {
    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    bridgeAsset() {
        return this.eth_call(bridgeAsset, {})
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

    inboundAdapter() {
        return this.eth_call(inboundAdapter, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    isYieldOpInFlight() {
        return this.eth_call(isYieldOpInFlight, {})
    }

    lastBalanceCheckTimestamp() {
        return this.eth_call(lastBalanceCheckTimestamp, {})
    }

    lastYieldNonce() {
        return this.eth_call(lastYieldNonce, {})
    }

    nonceProcessed(_0: NonceProcessedParams["_0"]) {
        return this.eth_call(nonceProcessed, {_0})
    }

    operator() {
        return this.eth_call(operator, {})
    }

    outboundAdapter() {
        return this.eth_call(outboundAdapter, {})
    }

    pendingDepositAmount() {
        return this.eth_call(pendingDepositAmount, {})
    }

    pendingWithdrawalAmount() {
        return this.eth_call(pendingWithdrawalAmount, {})
    }

    platformAddress() {
        return this.eth_call(platformAddress, {})
    }

    remoteStrategyBalance() {
        return this.eth_call(remoteStrategyBalance, {})
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
