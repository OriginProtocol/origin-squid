import { ContractBase } from '../abi.support.js'
import { allowance, approve, asset, balanceOf, convertToAssets, convertToShares, decimals, decreaseAllowance, deposit, governor, increaseAllowance, isGovernor, maxDeposit, maxMint, maxRedeem, maxWithdraw, mint, name, previewDeposit, previewMint, previewRedeem, previewWithdraw, redeem, symbol, totalAssets, totalSupply, transfer, transferFrom, withdraw } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, ConvertToAssetsParams, ConvertToSharesParams, DecreaseAllowanceParams, DepositParams, IncreaseAllowanceParams, MaxDepositParams, MaxMintParams, MaxRedeemParams, MaxWithdrawParams, MintParams, PreviewDepositParams, PreviewMintParams, PreviewRedeemParams, PreviewWithdrawParams, RedeemParams, TransferFromParams, TransferParams, WithdrawParams } from './functions.js'

export class Contract extends ContractBase {
    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(allowance, {owner, spender})
    }

    approve(spender: ApproveParams["spender"], amount: ApproveParams["amount"]) {
        return this.eth_call(approve, {spender, amount})
    }

    asset() {
        return this.eth_call(asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
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

    decreaseAllowance(spender: DecreaseAllowanceParams["spender"], subtractedValue: DecreaseAllowanceParams["subtractedValue"]) {
        return this.eth_call(decreaseAllowance, {spender, subtractedValue})
    }

    deposit(assets: DepositParams["assets"], receiver: DepositParams["receiver"]) {
        return this.eth_call(deposit, {assets, receiver})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    increaseAllowance(spender: IncreaseAllowanceParams["spender"], addedValue: IncreaseAllowanceParams["addedValue"]) {
        return this.eth_call(increaseAllowance, {spender, addedValue})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
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

    redeem(shares: RedeemParams["shares"], receiver: RedeemParams["receiver"], owner: RedeemParams["owner"]) {
        return this.eth_call(redeem, {shares, receiver, owner})
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

    transfer(recipient: TransferParams["recipient"], amount: TransferParams["amount"]) {
        return this.eth_call(transfer, {recipient, amount})
    }

    transferFrom(sender: TransferFromParams["sender"], recipient: TransferFromParams["recipient"], amount: TransferFromParams["amount"]) {
        return this.eth_call(transferFrom, {sender, recipient, amount})
    }

    withdraw(assets: WithdrawParams["assets"], receiver: WithdrawParams["receiver"], owner: WithdrawParams["owner"]) {
        return this.eth_call(withdraw, {assets, receiver, owner})
    }
}
