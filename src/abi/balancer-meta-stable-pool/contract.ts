import { ContractBase } from '../abi.support.js'
import { DOMAIN_SEPARATOR, allowance, approve, balanceOf, decimals, decreaseAllowance, getActionId, getAmplificationParameter, getAuthorizer, getLargestSafeQueryWindow, getLastInvariant, getLatest, getOracleMiscData, getOwner, getPastAccumulators, getPausedState, getPoolId, getPriceRateCache, getRate, getRateProviders, getSample, getScalingFactors, getSwapFeePercentage, getTimeWeightedAverage, getTotalSamples, getVault, increaseAllowance, name, nonces, onExitPool, onJoinPool, onSwap, onSwap_1, queryExit, queryJoin, symbol, totalSupply, transfer, transferFrom } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, DecreaseAllowanceParams, GetActionIdParams, GetLatestParams, GetPastAccumulatorsParams, GetPriceRateCacheParams, GetSampleParams, GetTimeWeightedAverageParams, IncreaseAllowanceParams, NoncesParams, OnExitPoolParams, OnJoinPoolParams, OnSwapParams, OnSwapParams_1, QueryExitParams, QueryJoinParams, TransferFromParams, TransferParams } from './functions.js'

export class Contract extends ContractBase {
    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(allowance, {owner, spender})
    }

    approve(spender: ApproveParams["spender"], amount: ApproveParams["amount"]) {
        return this.eth_call(approve, {spender, amount})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    decreaseAllowance(spender: DecreaseAllowanceParams["spender"], amount: DecreaseAllowanceParams["amount"]) {
        return this.eth_call(decreaseAllowance, {spender, amount})
    }

    getActionId(selector: GetActionIdParams["selector"]) {
        return this.eth_call(getActionId, {selector})
    }

    getAmplificationParameter() {
        return this.eth_call(getAmplificationParameter, {})
    }

    getAuthorizer() {
        return this.eth_call(getAuthorizer, {})
    }

    getLargestSafeQueryWindow() {
        return this.eth_call(getLargestSafeQueryWindow, {})
    }

    getLastInvariant() {
        return this.eth_call(getLastInvariant, {})
    }

    getLatest(variable: GetLatestParams["variable"]) {
        return this.eth_call(getLatest, {variable})
    }

    getOracleMiscData() {
        return this.eth_call(getOracleMiscData, {})
    }

    getOwner() {
        return this.eth_call(getOwner, {})
    }

    getPastAccumulators(queries: GetPastAccumulatorsParams["queries"]) {
        return this.eth_call(getPastAccumulators, {queries})
    }

    getPausedState() {
        return this.eth_call(getPausedState, {})
    }

    getPoolId() {
        return this.eth_call(getPoolId, {})
    }

    getPriceRateCache(token: GetPriceRateCacheParams["token"]) {
        return this.eth_call(getPriceRateCache, {token})
    }

    getRate() {
        return this.eth_call(getRate, {})
    }

    getRateProviders() {
        return this.eth_call(getRateProviders, {})
    }

    getSample(index: GetSampleParams["index"]) {
        return this.eth_call(getSample, {index})
    }

    getScalingFactors() {
        return this.eth_call(getScalingFactors, {})
    }

    getSwapFeePercentage() {
        return this.eth_call(getSwapFeePercentage, {})
    }

    getTimeWeightedAverage(queries: GetTimeWeightedAverageParams["queries"]) {
        return this.eth_call(getTimeWeightedAverage, {queries})
    }

    getTotalSamples() {
        return this.eth_call(getTotalSamples, {})
    }

    getVault() {
        return this.eth_call(getVault, {})
    }

    increaseAllowance(spender: IncreaseAllowanceParams["spender"], addedValue: IncreaseAllowanceParams["addedValue"]) {
        return this.eth_call(increaseAllowance, {spender, addedValue})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(nonces, {owner})
    }

    onExitPool(poolId: OnExitPoolParams["poolId"], sender: OnExitPoolParams["sender"], recipient: OnExitPoolParams["recipient"], balances: OnExitPoolParams["balances"], lastChangeBlock: OnExitPoolParams["lastChangeBlock"], protocolSwapFeePercentage: OnExitPoolParams["protocolSwapFeePercentage"], userData: OnExitPoolParams["userData"]) {
        return this.eth_call(onExitPool, {poolId, sender, recipient, balances, lastChangeBlock, protocolSwapFeePercentage, userData})
    }

    onJoinPool(poolId: OnJoinPoolParams["poolId"], sender: OnJoinPoolParams["sender"], recipient: OnJoinPoolParams["recipient"], balances: OnJoinPoolParams["balances"], lastChangeBlock: OnJoinPoolParams["lastChangeBlock"], protocolSwapFeePercentage: OnJoinPoolParams["protocolSwapFeePercentage"], userData: OnJoinPoolParams["userData"]) {
        return this.eth_call(onJoinPool, {poolId, sender, recipient, balances, lastChangeBlock, protocolSwapFeePercentage, userData})
    }

    onSwap(request: OnSwapParams["request"], balances: OnSwapParams["balances"], indexIn: OnSwapParams["indexIn"], indexOut: OnSwapParams["indexOut"]) {
        return this.eth_call(onSwap, {request, balances, indexIn, indexOut})
    }

    onSwap_1(request: OnSwapParams_1["request"], balanceTokenIn: OnSwapParams_1["balanceTokenIn"], balanceTokenOut: OnSwapParams_1["balanceTokenOut"]) {
        return this.eth_call(onSwap_1, {request, balanceTokenIn, balanceTokenOut})
    }

    queryExit(poolId: QueryExitParams["poolId"], sender: QueryExitParams["sender"], recipient: QueryExitParams["recipient"], balances: QueryExitParams["balances"], lastChangeBlock: QueryExitParams["lastChangeBlock"], protocolSwapFeePercentage: QueryExitParams["protocolSwapFeePercentage"], userData: QueryExitParams["userData"]) {
        return this.eth_call(queryExit, {poolId, sender, recipient, balances, lastChangeBlock, protocolSwapFeePercentage, userData})
    }

    queryJoin(poolId: QueryJoinParams["poolId"], sender: QueryJoinParams["sender"], recipient: QueryJoinParams["recipient"], balances: QueryJoinParams["balances"], lastChangeBlock: QueryJoinParams["lastChangeBlock"], protocolSwapFeePercentage: QueryJoinParams["protocolSwapFeePercentage"], userData: QueryJoinParams["userData"]) {
        return this.eth_call(queryJoin, {poolId, sender, recipient, balances, lastChangeBlock, protocolSwapFeePercentage, userData})
    }

    symbol() {
        return this.eth_call(symbol, {})
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
}
