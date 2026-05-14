import { ContractBase } from '../abi.support.js'
import { allPools, allPoolsLength, createPool, defaultUnstakedFee, factoryRegistry, getPool, getSwapFee, getUnstakedFee, isPool, owner, poolImplementation, swapFeeManager, swapFeeModule, tickSpacingToFee, tickSpacings, unstakedFeeManager, unstakedFeeModule, voter } from './functions.js'
import type { AllPoolsParams, CreatePoolParams, GetPoolParams, GetSwapFeeParams, GetUnstakedFeeParams, IsPoolParams, TickSpacingToFeeParams } from './functions.js'

export class Contract extends ContractBase {
    allPools(_0: AllPoolsParams["_0"]) {
        return this.eth_call(allPools, {_0})
    }

    allPoolsLength() {
        return this.eth_call(allPoolsLength, {})
    }

    createPool(tokenA: CreatePoolParams["tokenA"], tokenB: CreatePoolParams["tokenB"], tickSpacing: CreatePoolParams["tickSpacing"], sqrtPriceX96: CreatePoolParams["sqrtPriceX96"]) {
        return this.eth_call(createPool, {tokenA, tokenB, tickSpacing, sqrtPriceX96})
    }

    defaultUnstakedFee() {
        return this.eth_call(defaultUnstakedFee, {})
    }

    factoryRegistry() {
        return this.eth_call(factoryRegistry, {})
    }

    getPool(_0: GetPoolParams["_0"], _1: GetPoolParams["_1"], _2: GetPoolParams["_2"]) {
        return this.eth_call(getPool, {_0, _1, _2})
    }

    getSwapFee(pool: GetSwapFeeParams["pool"]) {
        return this.eth_call(getSwapFee, {pool})
    }

    getUnstakedFee(pool: GetUnstakedFeeParams["pool"]) {
        return this.eth_call(getUnstakedFee, {pool})
    }

    isPool(pool: IsPoolParams["pool"]) {
        return this.eth_call(isPool, {pool})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    poolImplementation() {
        return this.eth_call(poolImplementation, {})
    }

    swapFeeManager() {
        return this.eth_call(swapFeeManager, {})
    }

    swapFeeModule() {
        return this.eth_call(swapFeeModule, {})
    }

    tickSpacingToFee(_0: TickSpacingToFeeParams["_0"]) {
        return this.eth_call(tickSpacingToFee, {_0})
    }

    tickSpacings() {
        return this.eth_call(tickSpacings, {})
    }

    unstakedFeeManager() {
        return this.eth_call(unstakedFeeManager, {})
    }

    unstakedFeeModule() {
        return this.eth_call(unstakedFeeModule, {})
    }

    voter() {
        return this.eth_call(voter, {})
    }
}
