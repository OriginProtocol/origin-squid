import { ContractBase } from '../abi.support.js'
import { DELAY_REQUEST, FEE_SCALE, MAX_CROSS_PRICE_DEVIATION, MAX_UNSTAKERS, PRICE_SCALE, activeMarket, allocate, allocateThreshold, allowance, approve, armBuffer, asset, balanceOf, baseAsset, capManager, claimDelay, claimRedeem, claimable, collectFees, convertToAssets, convertToShares, crossPrice, decimals, deposit, deposit_1, fee, feeCollector, feesAccrued, getReserves, lastAvailableAssets, lastRequestTimestamp, liquidityAmountInCooldown, liquidityAsset, minSharesToRedeem, name, nextUnstakerIndex, nextWithdrawalIndex, operator, owner, previewDeposit, previewRedeem, requestRedeem, supportedMarkets, susde, swapExactTokensForTokens, swapExactTokensForTokens_1, swapTokensForExactTokens, swapTokensForExactTokens_1, symbol, token0, token1, totalAssets, totalSupply, traderate0, traderate1, transfer, transferFrom, unstakers, usde, withdrawalRequests, withdrawsClaimed, withdrawsQueued } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, ClaimRedeemParams, ConvertToAssetsParams, ConvertToSharesParams, DepositParams, DepositParams_1, PreviewDepositParams, PreviewRedeemParams, RequestRedeemParams, SupportedMarketsParams, SwapExactTokensForTokensParams, SwapExactTokensForTokensParams_1, SwapTokensForExactTokensParams, SwapTokensForExactTokensParams_1, TransferFromParams, TransferParams, UnstakersParams, WithdrawalRequestsParams } from './functions.js'

export class Contract extends ContractBase {
    DELAY_REQUEST() {
        return this.eth_call(DELAY_REQUEST, {})
    }

    FEE_SCALE() {
        return this.eth_call(FEE_SCALE, {})
    }

    MAX_CROSS_PRICE_DEVIATION() {
        return this.eth_call(MAX_CROSS_PRICE_DEVIATION, {})
    }

    MAX_UNSTAKERS() {
        return this.eth_call(MAX_UNSTAKERS, {})
    }

    PRICE_SCALE() {
        return this.eth_call(PRICE_SCALE, {})
    }

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

    baseAsset() {
        return this.eth_call(baseAsset, {})
    }

    capManager() {
        return this.eth_call(capManager, {})
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

    getReserves() {
        return this.eth_call(getReserves, {})
    }

    lastAvailableAssets() {
        return this.eth_call(lastAvailableAssets, {})
    }

    lastRequestTimestamp() {
        return this.eth_call(lastRequestTimestamp, {})
    }

    liquidityAmountInCooldown() {
        return this.eth_call(liquidityAmountInCooldown, {})
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

    nextUnstakerIndex() {
        return this.eth_call(nextUnstakerIndex, {})
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

    requestRedeem(shares: RequestRedeemParams["shares"]) {
        return this.eth_call(requestRedeem, {shares})
    }

    supportedMarkets(market: SupportedMarketsParams["market"]) {
        return this.eth_call(supportedMarkets, {market})
    }

    susde() {
        return this.eth_call(susde, {})
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

    unstakers(_0: UnstakersParams["_0"]) {
        return this.eth_call(unstakers, {_0})
    }

    usde() {
        return this.eth_call(usde, {})
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
