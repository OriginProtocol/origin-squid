import { ContractBase } from '../abi.support.js'
import { _totalSupply, allowance, approve, balanceOf, creditsBalanceOf, creditsBalanceOfHighres, decimals, decreaseAllowance, governor, increaseAllowance, isGovernor, isUpgraded, name, nonRebasingCreditsPerToken, nonRebasingSupply, rebaseState, rebasingCredits, rebasingCreditsHighres, rebasingCreditsPerToken, rebasingCreditsPerTokenHighres, symbol, totalSupply, transfer, transferFrom, vaultAddress } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, CreditsBalanceOfHighresParams, CreditsBalanceOfParams, DecreaseAllowanceParams, IncreaseAllowanceParams, IsUpgradedParams, NonRebasingCreditsPerTokenParams, RebaseStateParams, TransferFromParams, TransferParams } from './functions.js'

export class Contract extends ContractBase {
    _totalSupply() {
        return this.eth_call(_totalSupply, {})
    }

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

    decreaseAllowance(_spender: DecreaseAllowanceParams["_spender"], _subtractedValue: DecreaseAllowanceParams["_subtractedValue"]) {
        return this.eth_call(decreaseAllowance, {_spender, _subtractedValue})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    increaseAllowance(_spender: IncreaseAllowanceParams["_spender"], _addedValue: IncreaseAllowanceParams["_addedValue"]) {
        return this.eth_call(increaseAllowance, {_spender, _addedValue})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    isUpgraded(_0: IsUpgradedParams["_0"]) {
        return this.eth_call(isUpgraded, {_0})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonRebasingCreditsPerToken(_0: NonRebasingCreditsPerTokenParams["_0"]) {
        return this.eth_call(nonRebasingCreditsPerToken, {_0})
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
}
