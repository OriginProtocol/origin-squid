import { ContractBase } from '../abi.support.js'
import { DECIMALS_OFFSET, DOMAIN_SEPARATOR, MORPHO, allowance, approve, asset, balanceOf, config, convertToAssets, convertToShares, curator, decimals, deposit, eip712Domain, fee, feeRecipient, guardian, isAllocator, lastTotalAssets, maxDeposit, maxMint, maxRedeem, maxWithdraw, mint, multicall, name, nonces, owner, pendingCap, pendingGuardian, pendingOwner, pendingTimelock, previewDeposit, previewMint, previewRedeem, previewWithdraw, redeem, skimRecipient, supplyQueue, supplyQueueLength, symbol, timelock, totalAssets, totalSupply, transfer, transferFrom, withdraw, withdrawQueue, withdrawQueueLength } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, ConfigParams, ConvertToAssetsParams, ConvertToSharesParams, DepositParams, IsAllocatorParams, MaxDepositParams, MaxMintParams, MaxRedeemParams, MaxWithdrawParams, MintParams, MulticallParams, NoncesParams, PendingCapParams, PreviewDepositParams, PreviewMintParams, PreviewRedeemParams, PreviewWithdrawParams, RedeemParams, SupplyQueueParams, TransferFromParams, TransferParams, WithdrawParams, WithdrawQueueParams } from './functions.js'

export class Contract extends ContractBase {
    DECIMALS_OFFSET() {
        return this.eth_call(DECIMALS_OFFSET, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    MORPHO() {
        return this.eth_call(MORPHO, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(allowance, {owner, spender})
    }

    approve(spender: ApproveParams["spender"], value: ApproveParams["value"]) {
        return this.eth_call(approve, {spender, value})
    }

    asset() {
        return this.eth_call(asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    config(_0: ConfigParams["_0"]) {
        return this.eth_call(config, {_0})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(convertToShares, {assets})
    }

    curator() {
        return this.eth_call(curator, {})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    deposit(assets: DepositParams["assets"], receiver: DepositParams["receiver"]) {
        return this.eth_call(deposit, {assets, receiver})
    }

    eip712Domain() {
        return this.eth_call(eip712Domain, {})
    }

    fee() {
        return this.eth_call(fee, {})
    }

    feeRecipient() {
        return this.eth_call(feeRecipient, {})
    }

    guardian() {
        return this.eth_call(guardian, {})
    }

    isAllocator(_0: IsAllocatorParams["_0"]) {
        return this.eth_call(isAllocator, {_0})
    }

    lastTotalAssets() {
        return this.eth_call(lastTotalAssets, {})
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

    multicall(data: MulticallParams["data"]) {
        return this.eth_call(multicall, {data})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(nonces, {owner})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    pendingCap(_0: PendingCapParams["_0"]) {
        return this.eth_call(pendingCap, {_0})
    }

    pendingGuardian() {
        return this.eth_call(pendingGuardian, {})
    }

    pendingOwner() {
        return this.eth_call(pendingOwner, {})
    }

    pendingTimelock() {
        return this.eth_call(pendingTimelock, {})
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

    skimRecipient() {
        return this.eth_call(skimRecipient, {})
    }

    supplyQueue(_0: SupplyQueueParams["_0"]) {
        return this.eth_call(supplyQueue, {_0})
    }

    supplyQueueLength() {
        return this.eth_call(supplyQueueLength, {})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    timelock() {
        return this.eth_call(timelock, {})
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

    withdraw(assets: WithdrawParams["assets"], receiver: WithdrawParams["receiver"], owner: WithdrawParams["owner"]) {
        return this.eth_call(withdraw, {assets, receiver, owner})
    }

    withdrawQueue(_0: WithdrawQueueParams["_0"]) {
        return this.eth_call(withdrawQueue, {_0})
    }

    withdrawQueueLength() {
        return this.eth_call(withdrawQueueLength, {})
    }
}
