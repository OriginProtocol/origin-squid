import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuthorizerChanged: event("0x94b979b6831a51293e2641426f97747feed46f17779fed9cd18d1ecefcfe92ef", {"newAuthorizer": indexed(p.address)}),
    ExternalBalanceTransfer: event("0x540a1a3f28340caec336c81d8d7b3df139ee5cdc1839a4f283d7ebb7eaae2d5c", {"token": indexed(p.address), "sender": indexed(p.address), "recipient": p.address, "amount": p.uint256}),
    FlashLoan: event("0x0d7d75e01ab95780d3cd1c8ec0dd6c2ce19e3a20427eec8bf53283b6fb8e95f0", {"recipient": indexed(p.address), "token": indexed(p.address), "amount": p.uint256, "feeAmount": p.uint256}),
    InternalBalanceChanged: event("0x18e1ea4139e68413d7d08aa752e71568e36b2c5bf940893314c2c5b01eaa0c42", {"user": indexed(p.address), "token": indexed(p.address), "delta": p.int256}),
    PausedStateChanged: event("0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64", {"paused": p.bool}),
    PoolBalanceChanged: event("0xe5ce249087ce04f05a957192435400fd97868dba0e6a4b4c049abf8af80dae78", {"poolId": indexed(p.bytes32), "liquidityProvider": indexed(p.address), "tokens": p.array(p.address), "deltas": p.array(p.int256), "protocolFeeAmounts": p.array(p.uint256)}),
    PoolBalanceManaged: event("0x6edcaf6241105b4c94c2efdbf3a6b12458eb3d07be3a0e81d24b13c44045fe7a", {"poolId": indexed(p.bytes32), "assetManager": indexed(p.address), "token": indexed(p.address), "cashDelta": p.int256, "managedDelta": p.int256}),
    PoolRegistered: event("0x3c13bc30b8e878c53fd2a36b679409c073afd75950be43d8858768e956fbc20e", {"poolId": indexed(p.bytes32), "poolAddress": indexed(p.address), "specialization": p.uint8}),
    RelayerApprovalChanged: event("0x46961fdb4502b646d5095fba7600486a8ac05041d55cdf0f16ed677180b5cad8", {"relayer": indexed(p.address), "sender": indexed(p.address), "approved": p.bool}),
    Swap: event("0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b", {"poolId": indexed(p.bytes32), "tokenIn": indexed(p.address), "tokenOut": indexed(p.address), "amountIn": p.uint256, "amountOut": p.uint256}),
    TokensDeregistered: event("0x7dcdc6d02ef40c7c1a7046a011b058bd7f988fa14e20a66344f9d4e60657d610", {"poolId": indexed(p.bytes32), "tokens": p.array(p.address)}),
    TokensRegistered: event("0xf5847d3f2197b16cdcd2098ec95d0905cd1abdaf415f07bb7cef2bba8ac5dec4", {"poolId": indexed(p.bytes32), "tokens": p.array(p.address), "assetManagers": p.array(p.address)}),
}

export const functions = {
    WETH: fun("0xad5c4648", {}, p.address),
    batchSwap: fun("0x945bcec9", {"kind": p.uint8, "swaps": p.array(p.struct({"poolId": p.bytes32, "assetInIndex": p.uint256, "assetOutIndex": p.uint256, "amount": p.uint256, "userData": p.bytes})), "assets": p.array(p.address), "funds": p.struct({"sender": p.address, "fromInternalBalance": p.bool, "recipient": p.address, "toInternalBalance": p.bool}), "limits": p.array(p.int256), "deadline": p.uint256}, p.array(p.int256)),
    deregisterTokens: fun("0x7d3aeb96", {"poolId": p.bytes32, "tokens": p.array(p.address)}, ),
    exitPool: fun("0x8bdb3913", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "request": p.struct({"assets": p.array(p.address), "minAmountsOut": p.array(p.uint256), "userData": p.bytes, "toInternalBalance": p.bool})}, ),
    flashLoan: fun("0x5c38449e", {"recipient": p.address, "tokens": p.array(p.address), "amounts": p.array(p.uint256), "userData": p.bytes}, ),
    getActionId: fun("0x851c1bb3", {"selector": p.bytes4}, p.bytes32),
    getAuthorizer: fun("0xaaabadc5", {}, p.address),
    getDomainSeparator: fun("0xed24911d", {}, p.bytes32),
    getInternalBalance: fun("0x0f5a6efa", {"user": p.address, "tokens": p.array(p.address)}, p.array(p.uint256)),
    getNextNonce: fun("0x90193b7c", {"user": p.address}, p.uint256),
    getPausedState: fun("0x1c0de051", {}, {"paused": p.bool, "pauseWindowEndTime": p.uint256, "bufferPeriodEndTime": p.uint256}),
    getPool: fun("0xf6c00927", {"poolId": p.bytes32}, {"_0": p.address, "_1": p.uint8}),
    getPoolTokenInfo: fun("0xb05f8e48", {"poolId": p.bytes32, "token": p.address}, {"cash": p.uint256, "managed": p.uint256, "lastChangeBlock": p.uint256, "assetManager": p.address}),
    getPoolTokens: fun("0xf94d4668", {"poolId": p.bytes32}, {"tokens": p.array(p.address), "balances": p.array(p.uint256), "lastChangeBlock": p.uint256}),
    getProtocolFeesCollector: fun("0xd2946c2b", {}, p.address),
    hasApprovedRelayer: fun("0xfec90d72", {"user": p.address, "relayer": p.address}, p.bool),
    joinPool: fun("0xb95cac28", {"poolId": p.bytes32, "sender": p.address, "recipient": p.address, "request": p.struct({"assets": p.array(p.address), "maxAmountsIn": p.array(p.uint256), "userData": p.bytes, "fromInternalBalance": p.bool})}, ),
    managePoolBalance: fun("0xe6c46092", {"ops": p.array(p.struct({"kind": p.uint8, "poolId": p.bytes32, "token": p.address, "amount": p.uint256}))}, ),
    manageUserBalance: fun("0x0e8e3e84", {"ops": p.array(p.struct({"kind": p.uint8, "asset": p.address, "amount": p.uint256, "sender": p.address, "recipient": p.address}))}, ),
    queryBatchSwap: fun("0xf84d066e", {"kind": p.uint8, "swaps": p.array(p.struct({"poolId": p.bytes32, "assetInIndex": p.uint256, "assetOutIndex": p.uint256, "amount": p.uint256, "userData": p.bytes})), "assets": p.array(p.address), "funds": p.struct({"sender": p.address, "fromInternalBalance": p.bool, "recipient": p.address, "toInternalBalance": p.bool})}, p.array(p.int256)),
    registerPool: fun("0x09b2760f", {"specialization": p.uint8}, p.bytes32),
    registerTokens: fun("0x66a9c7d2", {"poolId": p.bytes32, "tokens": p.array(p.address), "assetManagers": p.array(p.address)}, ),
    setAuthorizer: fun("0x058a628f", {"newAuthorizer": p.address}, ),
    setPaused: fun("0x16c38b3c", {"paused": p.bool}, ),
    setRelayerApproval: fun("0xfa6e671d", {"sender": p.address, "relayer": p.address, "approved": p.bool}, ),
    swap: fun("0x52bbbe29", {"singleSwap": p.struct({"poolId": p.bytes32, "kind": p.uint8, "assetIn": p.address, "assetOut": p.address, "amount": p.uint256, "userData": p.bytes}), "funds": p.struct({"sender": p.address, "fromInternalBalance": p.bool, "recipient": p.address, "toInternalBalance": p.bool}), "limit": p.uint256, "deadline": p.uint256}, p.uint256),
}

export class Contract extends ContractBase {

    WETH() {
        return this.eth_call(functions.WETH, {})
    }

    getActionId(selector: GetActionIdParams["selector"]) {
        return this.eth_call(functions.getActionId, {selector})
    }

    getAuthorizer() {
        return this.eth_call(functions.getAuthorizer, {})
    }

    getDomainSeparator() {
        return this.eth_call(functions.getDomainSeparator, {})
    }

    getInternalBalance(user: GetInternalBalanceParams["user"], tokens: GetInternalBalanceParams["tokens"]) {
        return this.eth_call(functions.getInternalBalance, {user, tokens})
    }

    getNextNonce(user: GetNextNonceParams["user"]) {
        return this.eth_call(functions.getNextNonce, {user})
    }

    getPausedState() {
        return this.eth_call(functions.getPausedState, {})
    }

    getPool(poolId: GetPoolParams["poolId"]) {
        return this.eth_call(functions.getPool, {poolId})
    }

    getPoolTokenInfo(poolId: GetPoolTokenInfoParams["poolId"], token: GetPoolTokenInfoParams["token"]) {
        return this.eth_call(functions.getPoolTokenInfo, {poolId, token})
    }

    getPoolTokens(poolId: GetPoolTokensParams["poolId"]) {
        return this.eth_call(functions.getPoolTokens, {poolId})
    }

    getProtocolFeesCollector() {
        return this.eth_call(functions.getProtocolFeesCollector, {})
    }

    hasApprovedRelayer(user: HasApprovedRelayerParams["user"], relayer: HasApprovedRelayerParams["relayer"]) {
        return this.eth_call(functions.hasApprovedRelayer, {user, relayer})
    }
}

/// Event types
export type AuthorizerChangedEventArgs = EParams<typeof events.AuthorizerChanged>
export type ExternalBalanceTransferEventArgs = EParams<typeof events.ExternalBalanceTransfer>
export type FlashLoanEventArgs = EParams<typeof events.FlashLoan>
export type InternalBalanceChangedEventArgs = EParams<typeof events.InternalBalanceChanged>
export type PausedStateChangedEventArgs = EParams<typeof events.PausedStateChanged>
export type PoolBalanceChangedEventArgs = EParams<typeof events.PoolBalanceChanged>
export type PoolBalanceManagedEventArgs = EParams<typeof events.PoolBalanceManaged>
export type PoolRegisteredEventArgs = EParams<typeof events.PoolRegistered>
export type RelayerApprovalChangedEventArgs = EParams<typeof events.RelayerApprovalChanged>
export type SwapEventArgs = EParams<typeof events.Swap>
export type TokensDeregisteredEventArgs = EParams<typeof events.TokensDeregistered>
export type TokensRegisteredEventArgs = EParams<typeof events.TokensRegistered>

/// Function types
export type WETHParams = FunctionArguments<typeof functions.WETH>
export type WETHReturn = FunctionReturn<typeof functions.WETH>

export type BatchSwapParams = FunctionArguments<typeof functions.batchSwap>
export type BatchSwapReturn = FunctionReturn<typeof functions.batchSwap>

export type DeregisterTokensParams = FunctionArguments<typeof functions.deregisterTokens>
export type DeregisterTokensReturn = FunctionReturn<typeof functions.deregisterTokens>

export type ExitPoolParams = FunctionArguments<typeof functions.exitPool>
export type ExitPoolReturn = FunctionReturn<typeof functions.exitPool>

export type FlashLoanParams = FunctionArguments<typeof functions.flashLoan>
export type FlashLoanReturn = FunctionReturn<typeof functions.flashLoan>

export type GetActionIdParams = FunctionArguments<typeof functions.getActionId>
export type GetActionIdReturn = FunctionReturn<typeof functions.getActionId>

export type GetAuthorizerParams = FunctionArguments<typeof functions.getAuthorizer>
export type GetAuthorizerReturn = FunctionReturn<typeof functions.getAuthorizer>

export type GetDomainSeparatorParams = FunctionArguments<typeof functions.getDomainSeparator>
export type GetDomainSeparatorReturn = FunctionReturn<typeof functions.getDomainSeparator>

export type GetInternalBalanceParams = FunctionArguments<typeof functions.getInternalBalance>
export type GetInternalBalanceReturn = FunctionReturn<typeof functions.getInternalBalance>

export type GetNextNonceParams = FunctionArguments<typeof functions.getNextNonce>
export type GetNextNonceReturn = FunctionReturn<typeof functions.getNextNonce>

export type GetPausedStateParams = FunctionArguments<typeof functions.getPausedState>
export type GetPausedStateReturn = FunctionReturn<typeof functions.getPausedState>

export type GetPoolParams = FunctionArguments<typeof functions.getPool>
export type GetPoolReturn = FunctionReturn<typeof functions.getPool>

export type GetPoolTokenInfoParams = FunctionArguments<typeof functions.getPoolTokenInfo>
export type GetPoolTokenInfoReturn = FunctionReturn<typeof functions.getPoolTokenInfo>

export type GetPoolTokensParams = FunctionArguments<typeof functions.getPoolTokens>
export type GetPoolTokensReturn = FunctionReturn<typeof functions.getPoolTokens>

export type GetProtocolFeesCollectorParams = FunctionArguments<typeof functions.getProtocolFeesCollector>
export type GetProtocolFeesCollectorReturn = FunctionReturn<typeof functions.getProtocolFeesCollector>

export type HasApprovedRelayerParams = FunctionArguments<typeof functions.hasApprovedRelayer>
export type HasApprovedRelayerReturn = FunctionReturn<typeof functions.hasApprovedRelayer>

export type JoinPoolParams = FunctionArguments<typeof functions.joinPool>
export type JoinPoolReturn = FunctionReturn<typeof functions.joinPool>

export type ManagePoolBalanceParams = FunctionArguments<typeof functions.managePoolBalance>
export type ManagePoolBalanceReturn = FunctionReturn<typeof functions.managePoolBalance>

export type ManageUserBalanceParams = FunctionArguments<typeof functions.manageUserBalance>
export type ManageUserBalanceReturn = FunctionReturn<typeof functions.manageUserBalance>

export type QueryBatchSwapParams = FunctionArguments<typeof functions.queryBatchSwap>
export type QueryBatchSwapReturn = FunctionReturn<typeof functions.queryBatchSwap>

export type RegisterPoolParams = FunctionArguments<typeof functions.registerPool>
export type RegisterPoolReturn = FunctionReturn<typeof functions.registerPool>

export type RegisterTokensParams = FunctionArguments<typeof functions.registerTokens>
export type RegisterTokensReturn = FunctionReturn<typeof functions.registerTokens>

export type SetAuthorizerParams = FunctionArguments<typeof functions.setAuthorizer>
export type SetAuthorizerReturn = FunctionReturn<typeof functions.setAuthorizer>

export type SetPausedParams = FunctionArguments<typeof functions.setPaused>
export type SetPausedReturn = FunctionReturn<typeof functions.setPaused>

export type SetRelayerApprovalParams = FunctionArguments<typeof functions.setRelayerApproval>
export type SetRelayerApprovalReturn = FunctionReturn<typeof functions.setRelayerApproval>

export type SwapParams = FunctionArguments<typeof functions.swap>
export type SwapReturn = FunctionReturn<typeof functions.swap>

