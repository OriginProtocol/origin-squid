import { ContractBase } from '../abi.support.js'
import { FEE_SCALE, MAX_CROSS_PRICE_DEVIATION, PRICE_SCALE, activeMarket, allocate, allocateThreshold, allowance, approve, armBuffer, asset, balanceOf, baseAsset, capManager, claimDelay, claimRedeem, claimable, collectFees, convertToAssets, convertToShares, crossPrice, decimals, deposit, deposit_1, eeth, etherfiRedemptionManager, etherfiWithdrawalNFT, etherfiWithdrawalQueue, etherfiWithdrawalQueueAmount, etherfiWithdrawalRequests, fee, feeCollector, feesAccrued, getReserves, lastAvailableAssets, liquidityAsset, minSharesToRedeem, name, nextWithdrawalIndex, onERC721Received, operator, owner, previewDeposit, previewRedeem, requestEtherFiWithdrawal, requestRedeem, supportedMarkets, swapExactTokensForTokens, swapTokensForExactTokens, symbol, token0, token1, totalAssets, totalSupply, traderate0, traderate1, transfer, transferFrom, weth, withdrawalRequests, withdrawsClaimed, withdrawsQueued } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, ClaimRedeemParams, ConvertToAssetsParams, ConvertToSharesParams, DepositParams, DepositParams_1, EtherfiWithdrawalRequestsParams, OnERC721ReceivedParams, PreviewDepositParams, PreviewRedeemParams, RequestEtherFiWithdrawalParams, RequestRedeemParams, SupportedMarketsParams, SwapExactTokensForTokensParams, SwapTokensForExactTokensParams, TransferFromParams, TransferParams, WithdrawalRequestsParams } from './functions.js'

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

    eeth() {
        return this.eth_call(eeth, {})
    }

    etherfiRedemptionManager() {
        return this.eth_call(etherfiRedemptionManager, {})
    }

    etherfiWithdrawalNFT() {
        return this.eth_call(etherfiWithdrawalNFT, {})
    }

    etherfiWithdrawalQueue() {
        return this.eth_call(etherfiWithdrawalQueue, {})
    }

    etherfiWithdrawalQueueAmount() {
        return this.eth_call(etherfiWithdrawalQueueAmount, {})
    }

    etherfiWithdrawalRequests(id: EtherfiWithdrawalRequestsParams["id"]) {
        return this.eth_call(etherfiWithdrawalRequests, {id})
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

    onERC721Received(operator: OnERC721ReceivedParams["operator"], from: OnERC721ReceivedParams["from"], tokenId: OnERC721ReceivedParams["tokenId"], data: OnERC721ReceivedParams["data"]) {
        return this.eth_call(onERC721Received, {operator, from, tokenId, data})
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

    requestEtherFiWithdrawal(amount: RequestEtherFiWithdrawalParams["amount"]) {
        return this.eth_call(requestEtherFiWithdrawal, {amount})
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

    weth() {
        return this.eth_call(weth, {})
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
