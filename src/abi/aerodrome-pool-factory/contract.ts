import { ContractBase } from '../abi.support.js'
import { MAX_FEE, ZERO_FEE_INDICATOR, allPools, allPoolsLength, createPool, createPool_1, customFee, feeManager, getFee, getPool, getPool_1, implementation, isPaused, isPool, pauser, stableFee, volatileFee, voter } from './functions.js'
import type { AllPoolsParams, CreatePoolParams, CreatePoolParams_1, CustomFeeParams, GetFeeParams, GetPoolParams, GetPoolParams_1, IsPoolParams } from './functions.js'

export class Contract extends ContractBase {
    MAX_FEE() {
        return this.eth_call(MAX_FEE, {})
    }

    ZERO_FEE_INDICATOR() {
        return this.eth_call(ZERO_FEE_INDICATOR, {})
    }

    allPools(_0: AllPoolsParams["_0"]) {
        return this.eth_call(allPools, {_0})
    }

    allPoolsLength() {
        return this.eth_call(allPoolsLength, {})
    }

    createPool(tokenA: CreatePoolParams["tokenA"], tokenB: CreatePoolParams["tokenB"], stable: CreatePoolParams["stable"]) {
        return this.eth_call(createPool, {tokenA, tokenB, stable})
    }

    createPool_1(tokenA: CreatePoolParams_1["tokenA"], tokenB: CreatePoolParams_1["tokenB"], fee: CreatePoolParams_1["fee"]) {
        return this.eth_call(createPool_1, {tokenA, tokenB, fee})
    }

    customFee(_0: CustomFeeParams["_0"]) {
        return this.eth_call(customFee, {_0})
    }

    feeManager() {
        return this.eth_call(feeManager, {})
    }

    getFee(pool: GetFeeParams["pool"], _stable: GetFeeParams["_stable"]) {
        return this.eth_call(getFee, {pool, _stable})
    }

    getPool(tokenA: GetPoolParams["tokenA"], tokenB: GetPoolParams["tokenB"], fee: GetPoolParams["fee"]) {
        return this.eth_call(getPool, {tokenA, tokenB, fee})
    }

    getPool_1(tokenA: GetPoolParams_1["tokenA"], tokenB: GetPoolParams_1["tokenB"], stable: GetPoolParams_1["stable"]) {
        return this.eth_call(getPool_1, {tokenA, tokenB, stable})
    }

    implementation() {
        return this.eth_call(implementation, {})
    }

    isPaused() {
        return this.eth_call(isPaused, {})
    }

    isPool(pool: IsPoolParams["pool"]) {
        return this.eth_call(isPool, {pool})
    }

    pauser() {
        return this.eth_call(pauser, {})
    }

    stableFee() {
        return this.eth_call(stableFee, {})
    }

    volatileFee() {
        return this.eth_call(volatileFee, {})
    }

    voter() {
        return this.eth_call(voter, {})
    }
}
