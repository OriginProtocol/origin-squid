import { ContractBase } from '../abi.support.js'
import { FEE_SCALE, MAX_CROSS_PRICE_DEVIATION, PRICE_SCALE, activeMarket, allowance, approve, armBuffer, balanceOf, baseAsset, capManager, claimDelay, claimOriginWithdrawals, claimRedeem, claimable, collectFees, convertToAssets, convertToShares, crossPrice, decimals, deposit, deposit_1, fee, feeCollector, feesAccrued, lastAvailableAssets, liquidityAsset, minSharesToRedeem, name, nextWithdrawalIndex, operator, owner, previewDeposit, previewRedeem, requestOriginWithdrawal, requestRedeem, supportedMarkets, swapExactTokensForTokens, swapTokensForExactTokens, symbol, token0, token1, totalAssets, totalSupply, traderate0, traderate1, transfer, transferFrom, vault, vaultWithdrawalAmount, withdrawalRequests, withdrawsClaimed, withdrawsQueued } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, ClaimOriginWithdrawalsParams, ClaimRedeemParams, ConvertToAssetsParams, ConvertToSharesParams, DepositParams, DepositParams_1, PreviewDepositParams, PreviewRedeemParams, RequestOriginWithdrawalParams, RequestRedeemParams, SupportedMarketsParams, SwapExactTokensForTokensParams, SwapTokensForExactTokensParams, TransferFromParams, TransferParams, WithdrawalRequestsParams } from './functions.js'

export class Contract extends ContractBase {
    FEE_SCALE() {
        return this.eth_call(FEE_SCALE, {})
    }

    MAX_CROSS_PRICE_DEVIATION() {
        return this.eth_call(MAX_CROSS_PRICE_DEVIATION, {})
    }

    PRICE_SCALE() {
        return this.eth_call(PRICE_SCALE, {})
    }

    activeMarket() {
        return this.eth_call(activeMarket, {})
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

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    baseAsset() {
        return this.eth_call(baseAsset, {})
    }

    capManager() {
        return this.eth_call(capManager, {})
    }

    claimDelay() {
        return this.eth_call(claimDelay, {})
    }

    claimOriginWithdrawals(requestIds: ClaimOriginWithdrawalsParams["requestIds"]) {
        return this.eth_call(claimOriginWithdrawals, {requestIds})
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

    crossPrice() {
        return this.eth_call(crossPrice, {})
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

    lastAvailableAssets() {
        return this.eth_call(lastAvailableAssets, {})
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

    requestOriginWithdrawal(amount: RequestOriginWithdrawalParams["amount"]) {
        return this.eth_call(requestOriginWithdrawal, {amount})
    }

    requestRedeem(shares: RequestRedeemParams["shares"]) {
        return this.eth_call(requestRedeem, {shares})
    }

    supportedMarkets(market: SupportedMarketsParams["market"]) {
        return this.eth_call(supportedMarkets, {market})
    }

    swapExactTokensForTokens(amountIn: SwapExactTokensForTokensParams["amountIn"], amountOutMin: SwapExactTokensForTokensParams["amountOutMin"], path: SwapExactTokensForTokensParams["path"], to: SwapExactTokensForTokensParams["to"], deadline: SwapExactTokensForTokensParams["deadline"]) {
        return this.eth_call(swapExactTokensForTokens, {amountIn, amountOutMin, path, to, deadline})
    }

    swapTokensForExactTokens(amountOut: SwapTokensForExactTokensParams["amountOut"], amountInMax: SwapTokensForExactTokensParams["amountInMax"], path: SwapTokensForExactTokensParams["path"], to: SwapTokensForExactTokensParams["to"], deadline: SwapTokensForExactTokensParams["deadline"]) {
        return this.eth_call(swapTokensForExactTokens, {amountOut, amountInMax, path, to, deadline})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    token0() {
        return this.eth_call(token0, {})
    }

    token1() {
        return this.eth_call(token1, {})
    }

    totalAssets() {
        return this.eth_call(totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    traderate0() {
        return this.eth_call(traderate0, {})
    }

    traderate1() {
        return this.eth_call(traderate1, {})
    }

    transfer(to: TransferParams["to"], value: TransferParams["value"]) {
        return this.eth_call(transfer, {to, value})
    }

    transferFrom(from: TransferFromParams["from"], to: TransferFromParams["to"], value: TransferFromParams["value"]) {
        return this.eth_call(transferFrom, {from, to, value})
    }

    vault() {
        return this.eth_call(vault, {})
    }

    vaultWithdrawalAmount() {
        return this.eth_call(vaultWithdrawalAmount, {})
    }

    withdrawalRequests(requestId: WithdrawalRequestsParams["requestId"]) {
        return this.eth_call(withdrawalRequests, {requestId})
    }

    withdrawsClaimed() {
        return this.eth_call(withdrawsClaimed, {})
    }

    withdrawsQueued() {
        return this.eth_call(withdrawsQueued, {})
    }
}
