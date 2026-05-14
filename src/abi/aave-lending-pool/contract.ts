import { ContractBase } from '../abi.support.js'
import { FLASHLOAN_PREMIUM_TOTAL, LENDINGPOOL_REVISION, MAX_NUMBER_RESERVES, MAX_STABLE_RATE_BORROW_SIZE_PERCENT, getAddressesProvider, getConfiguration, getReserveData, getReserveNormalizedIncome, getReserveNormalizedVariableDebt, getReservesList, getUserAccountData, getUserConfiguration, paused, repay, withdraw } from './functions.js'
import type { GetConfigurationParams, GetReserveDataParams, GetReserveNormalizedIncomeParams, GetReserveNormalizedVariableDebtParams, GetUserAccountDataParams, GetUserConfigurationParams, RepayParams, WithdrawParams } from './functions.js'

export class Contract extends ContractBase {
    FLASHLOAN_PREMIUM_TOTAL() {
        return this.eth_call(FLASHLOAN_PREMIUM_TOTAL, {})
    }

    LENDINGPOOL_REVISION() {
        return this.eth_call(LENDINGPOOL_REVISION, {})
    }

    MAX_NUMBER_RESERVES() {
        return this.eth_call(MAX_NUMBER_RESERVES, {})
    }

    MAX_STABLE_RATE_BORROW_SIZE_PERCENT() {
        return this.eth_call(MAX_STABLE_RATE_BORROW_SIZE_PERCENT, {})
    }

    getAddressesProvider() {
        return this.eth_call(getAddressesProvider, {})
    }

    getConfiguration(asset: GetConfigurationParams["asset"]) {
        return this.eth_call(getConfiguration, {asset})
    }

    getReserveData(asset: GetReserveDataParams["asset"]) {
        return this.eth_call(getReserveData, {asset})
    }

    getReserveNormalizedIncome(asset: GetReserveNormalizedIncomeParams["asset"]) {
        return this.eth_call(getReserveNormalizedIncome, {asset})
    }

    getReserveNormalizedVariableDebt(asset: GetReserveNormalizedVariableDebtParams["asset"]) {
        return this.eth_call(getReserveNormalizedVariableDebt, {asset})
    }

    getReservesList() {
        return this.eth_call(getReservesList, {})
    }

    getUserAccountData(user: GetUserAccountDataParams["user"]) {
        return this.eth_call(getUserAccountData, {user})
    }

    getUserConfiguration(user: GetUserConfigurationParams["user"]) {
        return this.eth_call(getUserConfiguration, {user})
    }

    paused() {
        return this.eth_call(paused, {})
    }

    repay(asset: RepayParams["asset"], amount: RepayParams["amount"], rateMode: RepayParams["rateMode"], onBehalfOf: RepayParams["onBehalfOf"]) {
        return this.eth_call(repay, {asset, amount, rateMode, onBehalfOf})
    }

    withdraw(asset: WithdrawParams["asset"], amount: WithdrawParams["amount"], to: WithdrawParams["to"]) {
        return this.eth_call(withdraw, {asset, amount, to})
    }
}
