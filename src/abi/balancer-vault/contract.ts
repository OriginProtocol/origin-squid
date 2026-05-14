import { ContractBase } from '../abi.support.js'
import { WETH, batchSwap, getActionId, getAuthorizer, getDomainSeparator, getInternalBalance, getNextNonce, getPausedState, getPool, getPoolTokenInfo, getPoolTokens, getProtocolFeesCollector, hasApprovedRelayer, queryBatchSwap, registerPool, swap } from './functions.js'
import type { BatchSwapParams, GetActionIdParams, GetInternalBalanceParams, GetNextNonceParams, GetPoolParams, GetPoolTokenInfoParams, GetPoolTokensParams, HasApprovedRelayerParams, QueryBatchSwapParams, RegisterPoolParams, SwapParams } from './functions.js'

export class Contract extends ContractBase {
    WETH() {
        return this.eth_call(WETH, {})
    }

    batchSwap(kind: BatchSwapParams["kind"], swaps: BatchSwapParams["swaps"], assets: BatchSwapParams["assets"], funds: BatchSwapParams["funds"], limits: BatchSwapParams["limits"], deadline: BatchSwapParams["deadline"]) {
        return this.eth_call(batchSwap, {kind, swaps, assets, funds, limits, deadline})
    }

    getActionId(selector: GetActionIdParams["selector"]) {
        return this.eth_call(getActionId, {selector})
    }

    getAuthorizer() {
        return this.eth_call(getAuthorizer, {})
    }

    getDomainSeparator() {
        return this.eth_call(getDomainSeparator, {})
    }

    getInternalBalance(user: GetInternalBalanceParams["user"], tokens: GetInternalBalanceParams["tokens"]) {
        return this.eth_call(getInternalBalance, {user, tokens})
    }

    getNextNonce(user: GetNextNonceParams["user"]) {
        return this.eth_call(getNextNonce, {user})
    }

    getPausedState() {
        return this.eth_call(getPausedState, {})
    }

    getPool(poolId: GetPoolParams["poolId"]) {
        return this.eth_call(getPool, {poolId})
    }

    getPoolTokenInfo(poolId: GetPoolTokenInfoParams["poolId"], token: GetPoolTokenInfoParams["token"]) {
        return this.eth_call(getPoolTokenInfo, {poolId, token})
    }

    getPoolTokens(poolId: GetPoolTokensParams["poolId"]) {
        return this.eth_call(getPoolTokens, {poolId})
    }

    getProtocolFeesCollector() {
        return this.eth_call(getProtocolFeesCollector, {})
    }

    hasApprovedRelayer(user: HasApprovedRelayerParams["user"], relayer: HasApprovedRelayerParams["relayer"]) {
        return this.eth_call(hasApprovedRelayer, {user, relayer})
    }

    queryBatchSwap(kind: QueryBatchSwapParams["kind"], swaps: QueryBatchSwapParams["swaps"], assets: QueryBatchSwapParams["assets"], funds: QueryBatchSwapParams["funds"]) {
        return this.eth_call(queryBatchSwap, {kind, swaps, assets, funds})
    }

    registerPool(specialization: RegisterPoolParams["specialization"]) {
        return this.eth_call(registerPool, {specialization})
    }

    swap(singleSwap: SwapParams["singleSwap"], funds: SwapParams["funds"], limit: SwapParams["limit"], deadline: SwapParams["deadline"]) {
        return this.eth_call(swap, {singleSwap, funds, limit, deadline})
    }
}
