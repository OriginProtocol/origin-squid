import { address, array, bool, bytes, bytes32, bytes4, int256, struct, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** WETH() */
export const WETH = func('0xad5c4648', {}, address)
export type WETHParams = FunctionArguments<typeof WETH>
export type WETHReturn = FunctionReturn<typeof WETH>

/** batchSwap(uint8,(bytes32,uint256,uint256,uint256,bytes)[],address[],(address,bool,address,bool),int256[],uint256) */
export const batchSwap = func('0x945bcec9', {
    kind: uint8,
    swaps: array(struct({
        poolId: bytes32,
        assetInIndex: uint256,
        assetOutIndex: uint256,
        amount: uint256,
        userData: bytes,
    })),
    assets: array(address),
    funds: struct({
        sender: address,
        fromInternalBalance: bool,
        recipient: address,
        toInternalBalance: bool,
    }),
    limits: array(int256),
    deadline: uint256,
}, array(int256))
export type BatchSwapParams = FunctionArguments<typeof batchSwap>
export type BatchSwapReturn = FunctionReturn<typeof batchSwap>

/** deregisterTokens(bytes32,address[]) */
export const deregisterTokens = func('0x7d3aeb96', {
    poolId: bytes32,
    tokens: array(address),
})
export type DeregisterTokensParams = FunctionArguments<typeof deregisterTokens>
export type DeregisterTokensReturn = FunctionReturn<typeof deregisterTokens>

/** exitPool(bytes32,address,address,(address[],uint256[],bytes,bool)) */
export const exitPool = func('0x8bdb3913', {
    poolId: bytes32,
    sender: address,
    recipient: address,
    request: struct({
        assets: array(address),
        minAmountsOut: array(uint256),
        userData: bytes,
        toInternalBalance: bool,
    }),
})
export type ExitPoolParams = FunctionArguments<typeof exitPool>
export type ExitPoolReturn = FunctionReturn<typeof exitPool>

/** flashLoan(address,address[],uint256[],bytes) */
export const flashLoan = func('0x5c38449e', {
    recipient: address,
    tokens: array(address),
    amounts: array(uint256),
    userData: bytes,
})
export type FlashLoanParams = FunctionArguments<typeof flashLoan>
export type FlashLoanReturn = FunctionReturn<typeof flashLoan>

/** getActionId(bytes4) */
export const getActionId = func('0x851c1bb3', {
    selector: bytes4,
}, bytes32)
export type GetActionIdParams = FunctionArguments<typeof getActionId>
export type GetActionIdReturn = FunctionReturn<typeof getActionId>

/** getAuthorizer() */
export const getAuthorizer = func('0xaaabadc5', {}, address)
export type GetAuthorizerParams = FunctionArguments<typeof getAuthorizer>
export type GetAuthorizerReturn = FunctionReturn<typeof getAuthorizer>

/** getDomainSeparator() */
export const getDomainSeparator = func('0xed24911d', {}, bytes32)
export type GetDomainSeparatorParams = FunctionArguments<typeof getDomainSeparator>
export type GetDomainSeparatorReturn = FunctionReturn<typeof getDomainSeparator>

/** getInternalBalance(address,address[]) */
export const getInternalBalance = func('0x0f5a6efa', {
    user: address,
    tokens: array(address),
}, array(uint256))
export type GetInternalBalanceParams = FunctionArguments<typeof getInternalBalance>
export type GetInternalBalanceReturn = FunctionReturn<typeof getInternalBalance>

/** getNextNonce(address) */
export const getNextNonce = func('0x90193b7c', {
    user: address,
}, uint256)
export type GetNextNonceParams = FunctionArguments<typeof getNextNonce>
export type GetNextNonceReturn = FunctionReturn<typeof getNextNonce>

/** getPausedState() */
export const getPausedState = func('0x1c0de051', {}, struct({
    paused: bool,
    pauseWindowEndTime: uint256,
    bufferPeriodEndTime: uint256,
}))
export type GetPausedStateParams = FunctionArguments<typeof getPausedState>
export type GetPausedStateReturn = FunctionReturn<typeof getPausedState>

/** getPool(bytes32) */
export const getPool = func('0xf6c00927', {
    poolId: bytes32,
}, struct({
    _0: address,
    _1: uint8,
}))
export type GetPoolParams = FunctionArguments<typeof getPool>
export type GetPoolReturn = FunctionReturn<typeof getPool>

/** getPoolTokenInfo(bytes32,address) */
export const getPoolTokenInfo = func('0xb05f8e48', {
    poolId: bytes32,
    token: address,
}, struct({
    cash: uint256,
    managed: uint256,
    lastChangeBlock: uint256,
    assetManager: address,
}))
export type GetPoolTokenInfoParams = FunctionArguments<typeof getPoolTokenInfo>
export type GetPoolTokenInfoReturn = FunctionReturn<typeof getPoolTokenInfo>

/** getPoolTokens(bytes32) */
export const getPoolTokens = func('0xf94d4668', {
    poolId: bytes32,
}, struct({
    tokens: array(address),
    balances: array(uint256),
    lastChangeBlock: uint256,
}))
export type GetPoolTokensParams = FunctionArguments<typeof getPoolTokens>
export type GetPoolTokensReturn = FunctionReturn<typeof getPoolTokens>

/** getProtocolFeesCollector() */
export const getProtocolFeesCollector = func('0xd2946c2b', {}, address)
export type GetProtocolFeesCollectorParams = FunctionArguments<typeof getProtocolFeesCollector>
export type GetProtocolFeesCollectorReturn = FunctionReturn<typeof getProtocolFeesCollector>

/** hasApprovedRelayer(address,address) */
export const hasApprovedRelayer = func('0xfec90d72', {
    user: address,
    relayer: address,
}, bool)
export type HasApprovedRelayerParams = FunctionArguments<typeof hasApprovedRelayer>
export type HasApprovedRelayerReturn = FunctionReturn<typeof hasApprovedRelayer>

/** joinPool(bytes32,address,address,(address[],uint256[],bytes,bool)) */
export const joinPool = func('0xb95cac28', {
    poolId: bytes32,
    sender: address,
    recipient: address,
    request: struct({
        assets: array(address),
        maxAmountsIn: array(uint256),
        userData: bytes,
        fromInternalBalance: bool,
    }),
})
export type JoinPoolParams = FunctionArguments<typeof joinPool>
export type JoinPoolReturn = FunctionReturn<typeof joinPool>

/** managePoolBalance((uint8,bytes32,address,uint256)[]) */
export const managePoolBalance = func('0xe6c46092', {
    ops: array(struct({
        kind: uint8,
        poolId: bytes32,
        token: address,
        amount: uint256,
    })),
})
export type ManagePoolBalanceParams = FunctionArguments<typeof managePoolBalance>
export type ManagePoolBalanceReturn = FunctionReturn<typeof managePoolBalance>

/** manageUserBalance((uint8,address,uint256,address,address)[]) */
export const manageUserBalance = func('0x0e8e3e84', {
    ops: array(struct({
        kind: uint8,
        asset: address,
        amount: uint256,
        sender: address,
        recipient: address,
    })),
})
export type ManageUserBalanceParams = FunctionArguments<typeof manageUserBalance>
export type ManageUserBalanceReturn = FunctionReturn<typeof manageUserBalance>

/** queryBatchSwap(uint8,(bytes32,uint256,uint256,uint256,bytes)[],address[],(address,bool,address,bool)) */
export const queryBatchSwap = func('0xf84d066e', {
    kind: uint8,
    swaps: array(struct({
        poolId: bytes32,
        assetInIndex: uint256,
        assetOutIndex: uint256,
        amount: uint256,
        userData: bytes,
    })),
    assets: array(address),
    funds: struct({
        sender: address,
        fromInternalBalance: bool,
        recipient: address,
        toInternalBalance: bool,
    }),
}, array(int256))
export type QueryBatchSwapParams = FunctionArguments<typeof queryBatchSwap>
export type QueryBatchSwapReturn = FunctionReturn<typeof queryBatchSwap>

/** registerPool(uint8) */
export const registerPool = func('0x09b2760f', {
    specialization: uint8,
}, bytes32)
export type RegisterPoolParams = FunctionArguments<typeof registerPool>
export type RegisterPoolReturn = FunctionReturn<typeof registerPool>

/** registerTokens(bytes32,address[],address[]) */
export const registerTokens = func('0x66a9c7d2', {
    poolId: bytes32,
    tokens: array(address),
    assetManagers: array(address),
})
export type RegisterTokensParams = FunctionArguments<typeof registerTokens>
export type RegisterTokensReturn = FunctionReturn<typeof registerTokens>

/** setAuthorizer(address) */
export const setAuthorizer = func('0x058a628f', {
    newAuthorizer: address,
})
export type SetAuthorizerParams = FunctionArguments<typeof setAuthorizer>
export type SetAuthorizerReturn = FunctionReturn<typeof setAuthorizer>

/** setPaused(bool) */
export const setPaused = func('0x16c38b3c', {
    paused: bool,
})
export type SetPausedParams = FunctionArguments<typeof setPaused>
export type SetPausedReturn = FunctionReturn<typeof setPaused>

/** setRelayerApproval(address,address,bool) */
export const setRelayerApproval = func('0xfa6e671d', {
    sender: address,
    relayer: address,
    approved: bool,
})
export type SetRelayerApprovalParams = FunctionArguments<typeof setRelayerApproval>
export type SetRelayerApprovalReturn = FunctionReturn<typeof setRelayerApproval>

/** swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256) */
export const swap = func('0x52bbbe29', {
    singleSwap: struct({
        poolId: bytes32,
        kind: uint8,
        assetIn: address,
        assetOut: address,
        amount: uint256,
        userData: bytes,
    }),
    funds: struct({
        sender: address,
        fromInternalBalance: bool,
        recipient: address,
        toInternalBalance: bool,
    }),
    limit: uint256,
    deadline: uint256,
}, uint256)
export type SwapParams = FunctionArguments<typeof swap>
export type SwapReturn = FunctionReturn<typeof swap>
