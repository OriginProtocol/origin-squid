import { ContractBase } from '../abi.support.js'
import { ADMIN_IMPLEMENTATION, adminImplPosition, assetDefaultStrategies, autoAllocateThreshold, calculateRedeemOutputs, capitalPaused, checkBalance, claimWithdrawal, claimWithdrawals, dripDuration, dripper, getAllAssets, getAllStrategies, getAssetConfig, getAssetCount, getStrategyCount, governor, isGovernor, isMintWhitelistedStrategy, isSupportedAsset, lastRebase, maxSupplyDiff, netOusdMintForStrategyThreshold, netOusdMintedForStrategy, oUSD, ousdMetaStrategy, previewYield, priceProvider, priceUnitMint, priceUnitRedeem, rebasePaused, rebasePerSecondMax, rebasePerSecondTarget, rebaseThreshold, redeemFeeBps, requestWithdrawal, strategies, strategistAddr, totalValue, trusteeAddress, trusteeFeeBps, vaultBuffer, weth, wethAssetIndex, withdrawalClaimDelay, withdrawalQueueMetadata, withdrawalRequests } from './functions.js'
import type { AssetDefaultStrategiesParams, CalculateRedeemOutputsParams, CheckBalanceParams, ClaimWithdrawalParams, ClaimWithdrawalsParams, GetAssetConfigParams, IsMintWhitelistedStrategyParams, IsSupportedAssetParams, PriceUnitMintParams, PriceUnitRedeemParams, RequestWithdrawalParams, StrategiesParams, WithdrawalRequestsParams } from './functions.js'

export class Contract extends ContractBase {
    ADMIN_IMPLEMENTATION() {
        return this.eth_call(ADMIN_IMPLEMENTATION, {})
    }

    adminImplPosition() {
        return this.eth_call(adminImplPosition, {})
    }

    assetDefaultStrategies(_0: AssetDefaultStrategiesParams["_0"]) {
        return this.eth_call(assetDefaultStrategies, {_0})
    }

    autoAllocateThreshold() {
        return this.eth_call(autoAllocateThreshold, {})
    }

    calculateRedeemOutputs(_amount: CalculateRedeemOutputsParams["_amount"]) {
        return this.eth_call(calculateRedeemOutputs, {_amount})
    }

    capitalPaused() {
        return this.eth_call(capitalPaused, {})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
    }

    claimWithdrawal(_requestId: ClaimWithdrawalParams["_requestId"]) {
        return this.eth_call(claimWithdrawal, {_requestId})
    }

    claimWithdrawals(_requestIds: ClaimWithdrawalsParams["_requestIds"]) {
        return this.eth_call(claimWithdrawals, {_requestIds})
    }

    dripDuration() {
        return this.eth_call(dripDuration, {})
    }

    dripper() {
        return this.eth_call(dripper, {})
    }

    getAllAssets() {
        return this.eth_call(getAllAssets, {})
    }

    getAllStrategies() {
        return this.eth_call(getAllStrategies, {})
    }

    getAssetConfig(_asset: GetAssetConfigParams["_asset"]) {
        return this.eth_call(getAssetConfig, {_asset})
    }

    getAssetCount() {
        return this.eth_call(getAssetCount, {})
    }

    getStrategyCount() {
        return this.eth_call(getStrategyCount, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    isMintWhitelistedStrategy(_0: IsMintWhitelistedStrategyParams["_0"]) {
        return this.eth_call(isMintWhitelistedStrategy, {_0})
    }

    isSupportedAsset(_asset: IsSupportedAssetParams["_asset"]) {
        return this.eth_call(isSupportedAsset, {_asset})
    }

    lastRebase() {
        return this.eth_call(lastRebase, {})
    }

    maxSupplyDiff() {
        return this.eth_call(maxSupplyDiff, {})
    }

    netOusdMintForStrategyThreshold() {
        return this.eth_call(netOusdMintForStrategyThreshold, {})
    }

    netOusdMintedForStrategy() {
        return this.eth_call(netOusdMintedForStrategy, {})
    }

    oUSD() {
        return this.eth_call(oUSD, {})
    }

    ousdMetaStrategy() {
        return this.eth_call(ousdMetaStrategy, {})
    }

    previewYield() {
        return this.eth_call(previewYield, {})
    }

    priceProvider() {
        return this.eth_call(priceProvider, {})
    }

    priceUnitMint(asset: PriceUnitMintParams["asset"]) {
        return this.eth_call(priceUnitMint, {asset})
    }

    priceUnitRedeem(asset: PriceUnitRedeemParams["asset"]) {
        return this.eth_call(priceUnitRedeem, {asset})
    }

    rebasePaused() {
        return this.eth_call(rebasePaused, {})
    }

    rebasePerSecondMax() {
        return this.eth_call(rebasePerSecondMax, {})
    }

    rebasePerSecondTarget() {
        return this.eth_call(rebasePerSecondTarget, {})
    }

    rebaseThreshold() {
        return this.eth_call(rebaseThreshold, {})
    }

    redeemFeeBps() {
        return this.eth_call(redeemFeeBps, {})
    }

    requestWithdrawal(_amount: RequestWithdrawalParams["_amount"]) {
        return this.eth_call(requestWithdrawal, {_amount})
    }

    strategies(_0: StrategiesParams["_0"]) {
        return this.eth_call(strategies, {_0})
    }

    strategistAddr() {
        return this.eth_call(strategistAddr, {})
    }

    totalValue() {
        return this.eth_call(totalValue, {})
    }

    trusteeAddress() {
        return this.eth_call(trusteeAddress, {})
    }

    trusteeFeeBps() {
        return this.eth_call(trusteeFeeBps, {})
    }

    vaultBuffer() {
        return this.eth_call(vaultBuffer, {})
    }

    weth() {
        return this.eth_call(weth, {})
    }

    wethAssetIndex() {
        return this.eth_call(wethAssetIndex, {})
    }

    withdrawalClaimDelay() {
        return this.eth_call(withdrawalClaimDelay, {})
    }

    withdrawalQueueMetadata() {
        return this.eth_call(withdrawalQueueMetadata, {})
    }

    withdrawalRequests(_0: WithdrawalRequestsParams["_0"]) {
        return this.eth_call(withdrawalRequests, {_0})
    }
}
