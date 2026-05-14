import { ContractBase } from '../abi.support.js'
import { DOMAIN_SEPARATOR, allowance, approve, asset, balanceOf, convertToAssets, convertToShares, decimals, deposit, depositWithSignature, lastRewardAmount, lastSync, maxDeposit, maxMint, maxRedeem, maxWithdraw, mint, name, nonces, previewDeposit, previewMint, previewRedeem, previewWithdraw, pricePerShare, redeem, rewardsCycleEnd, rewardsCycleLength, symbol, totalAssets, totalSupply, transfer, transferFrom, withdraw } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, ConvertToAssetsParams, ConvertToSharesParams, DepositParams, DepositWithSignatureParams, MaxDepositParams, MaxMintParams, MaxRedeemParams, MaxWithdrawParams, MintParams, NoncesParams, PreviewDepositParams, PreviewMintParams, PreviewRedeemParams, PreviewWithdrawParams, RedeemParams, TransferFromParams, TransferParams, WithdrawParams } from './functions.js'

export class Contract extends ContractBase {
    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    allowance(_0: AllowanceParams["_0"], _1: AllowanceParams["_1"]) {
        return this.eth_call(allowance, {_0, _1})
    }

    approve(spender: ApproveParams["spender"], amount: ApproveParams["amount"]) {
        return this.eth_call(approve, {spender, amount})
    }

    asset() {
        return this.eth_call(asset, {})
    }

    balanceOf(_0: BalanceOfParams["_0"]) {
        return this.eth_call(balanceOf, {_0})
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

    depositWithSignature(assets: DepositWithSignatureParams["assets"], receiver: DepositWithSignatureParams["receiver"], deadline: DepositWithSignatureParams["deadline"], approveMax: DepositWithSignatureParams["approveMax"], v: DepositWithSignatureParams["v"], r: DepositWithSignatureParams["r"], s: DepositWithSignatureParams["s"]) {
        return this.eth_call(depositWithSignature, {assets, receiver, deadline, approveMax, v, r, s})
    }

    lastRewardAmount() {
        return this.eth_call(lastRewardAmount, {})
    }

    lastSync() {
        return this.eth_call(lastSync, {})
    }

    maxDeposit(_0: MaxDepositParams["_0"]) {
        return this.eth_call(maxDeposit, {_0})
    }

    maxMint(_0: MaxMintParams["_0"]) {
        return this.eth_call(maxMint, {_0})
    }

    maxRedeem(owner: MaxRedeemParams["owner"]) {
        return this.eth_call(maxRedeem, {owner})
    }

    maxWithdraw(owner: MaxWithdrawParams["owner"]) {
        return this.eth_call(maxWithdraw, {owner})
    }

    mint(shares: MintParams["shares"], receiver: MintParams["receiver"]) {
        return this.eth_call(mint, {shares, receiver})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonces(_0: NoncesParams["_0"]) {
        return this.eth_call(nonces, {_0})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(previewDeposit, {assets})
    }

    previewMint(shares: PreviewMintParams["shares"]) {
        return this.eth_call(previewMint, {shares})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(previewRedeem, {shares})
    }

    previewWithdraw(assets: PreviewWithdrawParams["assets"]) {
        return this.eth_call(previewWithdraw, {assets})
    }

    pricePerShare() {
        return this.eth_call(pricePerShare, {})
    }

    redeem(shares: RedeemParams["shares"], receiver: RedeemParams["receiver"], owner: RedeemParams["owner"]) {
        return this.eth_call(redeem, {shares, receiver, owner})
    }

    rewardsCycleEnd() {
        return this.eth_call(rewardsCycleEnd, {})
    }

    rewardsCycleLength() {
        return this.eth_call(rewardsCycleLength, {})
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

    transfer(to: TransferParams["to"], amount: TransferParams["amount"]) {
        return this.eth_call(transfer, {to, amount})
    }

    transferFrom(from: TransferFromParams["from"], to: TransferFromParams["to"], amount: TransferFromParams["amount"]) {
        return this.eth_call(transferFrom, {from, to, amount})
    }

    withdraw(assets: WithdrawParams["assets"], receiver: WithdrawParams["receiver"], owner: WithdrawParams["owner"]) {
        return this.eth_call(withdraw, {assets, receiver, owner})
    }
}
