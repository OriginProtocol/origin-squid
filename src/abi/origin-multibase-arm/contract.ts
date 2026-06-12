import { ContractBase } from '../abi.support.js'
import { activeMarket, allocate, allocateThreshold, allowance, approve, armBuffer, asset, balanceOf, baseAssetConfigs, capManager, claimBaseAssetRedeem, claimDelay, claimRedeem, claimable, collectFees, convertToAssets, convertToShares, decimals, deposit, deposit_1, fee, feeCollector, feesAccrued, getReserves, liquidityAsset, minSharesToRedeem, name, nextWithdrawalIndex, operator, owner, previewDeposit, previewRedeem, requestBaseAssetRedeem, requestRedeem, reservedWithdrawLiquidity, supportedMarkets, swapExactTokensForTokens, swapExactTokensForTokens_1, swapTokensForExactTokens, swapTokensForExactTokens_1, symbol, totalAssets, totalSupply, transfer, transferFrom, withdrawalRequests, withdrawsClaimedShares, withdrawsQueuedShares } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, BaseAssetConfigsParams, ClaimBaseAssetRedeemParams, ClaimRedeemParams, ConvertToAssetsParams, ConvertToSharesParams, DepositParams, DepositParams_1, GetReservesParams, PreviewDepositParams, PreviewRedeemParams, RequestBaseAssetRedeemParams, RequestRedeemParams, SupportedMarketsParams, SwapExactTokensForTokensParams, SwapExactTokensForTokensParams_1, SwapTokensForExactTokensParams, SwapTokensForExactTokensParams_1, TransferFromParams, TransferParams, WithdrawalRequestsParams } from './functions.js'

export class Contract extends ContractBase {
    activeMarket() {
        return this.eth_call(activeMarket, {})
    }

    allocate() {
        return this.eth_call(allocate, {})
    }

    allocateThreshold() {
        return this.eth_call(allocateThreshold, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(allowance, {owner, spender})
    }

    approve(spender: ApproveParams["spender"], value: ApproveParams["value"]) {
        return this.eth_call(approve, {spender, value})
    }

    armBuffer() {
        return this.eth_call(armBuffer, {})
    }

    asset() {
        return this.eth_call(asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    baseAssetConfigs(asset: BaseAssetConfigsParams["asset"]) {
        return this.eth_call(baseAssetConfigs, {asset})
    }

    capManager() {
        return this.eth_call(capManager, {})
    }

    claimBaseAssetRedeem(redeemBaseAsset: ClaimBaseAssetRedeemParams["redeemBaseAsset"], shares: ClaimBaseAssetRedeemParams["shares"]) {
        return this.eth_call(claimBaseAssetRedeem, {redeemBaseAsset, shares})
    }

    claimDelay() {
        return this.eth_call(claimDelay, {})
    }

    claimRedeem(requestId: ClaimRedeemParams["requestId"]) {
        return this.eth_call(claimRedeem, {requestId})
    }

    claimable() {
        return this.eth_call(claimable, {})
    }

    collectFees() {
        return this.eth_call(collectFees, {})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(convertToShares, {assets})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    deposit(assets: DepositParams["assets"], receiver: DepositParams["receiver"]) {
        return this.eth_call(deposit, {assets, receiver})
    }

    deposit_1(assets: DepositParams_1["assets"]) {
        return this.eth_call(deposit_1, {assets})
    }

    fee() {
        return this.eth_call(fee, {})
    }

    feeCollector() {
        return this.eth_call(feeCollector, {})
    }

    feesAccrued() {
        return this.eth_call(feesAccrued, {})
    }

    getReserves(reserveBaseAsset: GetReservesParams["reserveBaseAsset"]) {
        return this.eth_call(getReserves, {reserveBaseAsset})
    }

    liquidityAsset() {
        return this.eth_call(liquidityAsset, {})
    }

    minSharesToRedeem() {
        return this.eth_call(minSharesToRedeem, {})
    }

    name() {
        return this.eth_call(name, {})
    }

    nextWithdrawalIndex() {
        return this.eth_call(nextWithdrawalIndex, {})
    }

    operator() {
        return this.eth_call(operator, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(previewDeposit, {assets})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(previewRedeem, {shares})
    }

    requestBaseAssetRedeem(redeemBaseAsset: RequestBaseAssetRedeemParams["redeemBaseAsset"], shares: RequestBaseAssetRedeemParams["shares"]) {
        return this.eth_call(requestBaseAssetRedeem, {redeemBaseAsset, shares})
    }

    requestRedeem(shares: RequestRedeemParams["shares"]) {
        return this.eth_call(requestRedeem, {shares})
    }

    reservedWithdrawLiquidity() {
        return this.eth_call(reservedWithdrawLiquidity, {})
    }

    supportedMarkets(market: SupportedMarketsParams["market"]) {
        return this.eth_call(supportedMarkets, {market})
    }

    swapExactTokensForTokens(amountIn: SwapExactTokensForTokensParams["amountIn"], amountOutMin: SwapExactTokensForTokensParams["amountOutMin"], path: SwapExactTokensForTokensParams["path"], to: SwapExactTokensForTokensParams["to"], deadline: SwapExactTokensForTokensParams["deadline"]) {
        return this.eth_call(swapExactTokensForTokens, {amountIn, amountOutMin, path, to, deadline})
    }

    swapExactTokensForTokens_1(inToken: SwapExactTokensForTokensParams_1["inToken"], outToken: SwapExactTokensForTokensParams_1["outToken"], amountIn: SwapExactTokensForTokensParams_1["amountIn"], amountOutMin: SwapExactTokensForTokensParams_1["amountOutMin"], to: SwapExactTokensForTokensParams_1["to"]) {
        return this.eth_call(swapExactTokensForTokens_1, {inToken, outToken, amountIn, amountOutMin, to})
    }

    swapTokensForExactTokens(amountOut: SwapTokensForExactTokensParams["amountOut"], amountInMax: SwapTokensForExactTokensParams["amountInMax"], path: SwapTokensForExactTokensParams["path"], to: SwapTokensForExactTokensParams["to"], deadline: SwapTokensForExactTokensParams["deadline"]) {
        return this.eth_call(swapTokensForExactTokens, {amountOut, amountInMax, path, to, deadline})
    }

    swapTokensForExactTokens_1(inToken: SwapTokensForExactTokensParams_1["inToken"], outToken: SwapTokensForExactTokensParams_1["outToken"], amountOut: SwapTokensForExactTokensParams_1["amountOut"], amountInMax: SwapTokensForExactTokensParams_1["amountInMax"], to: SwapTokensForExactTokensParams_1["to"]) {
        return this.eth_call(swapTokensForExactTokens_1, {inToken, outToken, amountOut, amountInMax, to})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    totalAssets() {
        return this.eth_call(totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    transfer(to: TransferParams["to"], value: TransferParams["value"]) {
        return this.eth_call(transfer, {to, value})
    }

    transferFrom(from: TransferFromParams["from"], to: TransferFromParams["to"], value: TransferFromParams["value"]) {
        return this.eth_call(transferFrom, {from, to, value})
    }

    withdrawalRequests(requestId: WithdrawalRequestsParams["requestId"]) {
        return this.eth_call(withdrawalRequests, {requestId})
    }

    withdrawsClaimedShares() {
        return this.eth_call(withdrawsClaimedShares, {})
    }

    withdrawsQueuedShares() {
        return this.eth_call(withdrawsQueuedShares, {})
    }
}
