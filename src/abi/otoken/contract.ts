import { ContractBase } from '../abi.support.js'
import { allowance, approve, balanceOf, creditsBalanceOf, creditsBalanceOfHighres, decimals, governor, isGovernor, name, nonRebasingCreditsPerToken, nonRebasingSupply, rebaseState, rebasingCredits, rebasingCreditsHighres, rebasingCreditsPerToken, rebasingCreditsPerTokenHighres, symbol, totalSupply, transfer, transferFrom, vaultAddress, yieldFrom, yieldTo } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, CreditsBalanceOfHighresParams, CreditsBalanceOfParams, NonRebasingCreditsPerTokenParams, RebaseStateParams, TransferFromParams, TransferParams, YieldFromParams, YieldToParams } from './functions.js'

export class Contract extends ContractBase {
    allowance(_owner: AllowanceParams["_owner"], _spender: AllowanceParams["_spender"]) {
        return this.eth_call(allowance, {_owner, _spender})
    }

    approve(_spender: ApproveParams["_spender"], _value: ApproveParams["_value"]) {
        return this.eth_call(approve, {_spender, _value})
    }

    balanceOf(_account: BalanceOfParams["_account"]) {
        return this.eth_call(balanceOf, {_account})
    }

    creditsBalanceOf(_account: CreditsBalanceOfParams["_account"]) {
        return this.eth_call(creditsBalanceOf, {_account})
    }

    creditsBalanceOfHighres(_account: CreditsBalanceOfHighresParams["_account"]) {
        return this.eth_call(creditsBalanceOfHighres, {_account})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonRebasingCreditsPerToken(_account: NonRebasingCreditsPerTokenParams["_account"]) {
        return this.eth_call(nonRebasingCreditsPerToken, {_account})
    }

    nonRebasingSupply() {
        return this.eth_call(nonRebasingSupply, {})
    }

    rebaseState(_0: RebaseStateParams["_0"]) {
        return this.eth_call(rebaseState, {_0})
    }

    rebasingCredits() {
        return this.eth_call(rebasingCredits, {})
    }

    rebasingCreditsHighres() {
        return this.eth_call(rebasingCreditsHighres, {})
    }

    rebasingCreditsPerToken() {
        return this.eth_call(rebasingCreditsPerToken, {})
    }

    rebasingCreditsPerTokenHighres() {
        return this.eth_call(rebasingCreditsPerTokenHighres, {})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    transfer(_to: TransferParams["_to"], _value: TransferParams["_value"]) {
        return this.eth_call(transfer, {_to, _value})
    }

    transferFrom(_from: TransferFromParams["_from"], _to: TransferFromParams["_to"], _value: TransferFromParams["_value"]) {
        return this.eth_call(transferFrom, {_from, _to, _value})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }

    yieldFrom(_0: YieldFromParams["_0"]) {
        return this.eth_call(yieldFrom, {_0})
    }

    yieldTo(_0: YieldToParams["_0"]) {
        return this.eth_call(yieldTo, {_0})
    }
}
