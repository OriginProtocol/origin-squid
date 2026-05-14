import { ContractBase } from '../abi.support.js'
import { accessHub, createPool, feeCollector, feeProtocol, getPool, parameters, poolFeeProtocol, ramsesV3PoolDeployer, tickSpacingInitialFee, voter } from './functions.js'
import type { CreatePoolParams, GetPoolParams, PoolFeeProtocolParams, TickSpacingInitialFeeParams } from './functions.js'

export class Contract extends ContractBase {
    accessHub() {
        return this.eth_call(accessHub, {})
    }

    createPool(tokenA: CreatePoolParams["tokenA"], tokenB: CreatePoolParams["tokenB"], tickSpacing: CreatePoolParams["tickSpacing"], sqrtPriceX96: CreatePoolParams["sqrtPriceX96"]) {
        return this.eth_call(createPool, {tokenA, tokenB, tickSpacing, sqrtPriceX96})
    }

    feeCollector() {
        return this.eth_call(feeCollector, {})
    }

    feeProtocol() {
        return this.eth_call(feeProtocol, {})
    }

    getPool(tokenA: GetPoolParams["tokenA"], tokenB: GetPoolParams["tokenB"], tickSpacing: GetPoolParams["tickSpacing"]) {
        return this.eth_call(getPool, {tokenA, tokenB, tickSpacing})
    }

    parameters() {
        return this.eth_call(parameters, {})
    }

    poolFeeProtocol(pool: PoolFeeProtocolParams["pool"]) {
        return this.eth_call(poolFeeProtocol, {pool})
    }

    ramsesV3PoolDeployer() {
        return this.eth_call(ramsesV3PoolDeployer, {})
    }

    tickSpacingInitialFee(tickSpacing: TickSpacingInitialFeeParams["tickSpacing"]) {
        return this.eth_call(tickSpacingInitialFee, {tickSpacing})
    }

    voter() {
        return this.eth_call(voter, {})
    }
}
