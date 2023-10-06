import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './balancer-vault.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AuthorizerChanged: new LogEvent<([newAuthorizer: string] & {newAuthorizer: string})>(
        abi, '0x94b979b6831a51293e2641426f97747feed46f17779fed9cd18d1ecefcfe92ef'
    ),
    ExternalBalanceTransfer: new LogEvent<([token: string, sender: string, recipient: string, amount: bigint] & {token: string, sender: string, recipient: string, amount: bigint})>(
        abi, '0x540a1a3f28340caec336c81d8d7b3df139ee5cdc1839a4f283d7ebb7eaae2d5c'
    ),
    FlashLoan: new LogEvent<([recipient: string, token: string, amount: bigint, feeAmount: bigint] & {recipient: string, token: string, amount: bigint, feeAmount: bigint})>(
        abi, '0x0d7d75e01ab95780d3cd1c8ec0dd6c2ce19e3a20427eec8bf53283b6fb8e95f0'
    ),
    InternalBalanceChanged: new LogEvent<([user: string, token: string, delta: bigint] & {user: string, token: string, delta: bigint})>(
        abi, '0x18e1ea4139e68413d7d08aa752e71568e36b2c5bf940893314c2c5b01eaa0c42'
    ),
    PausedStateChanged: new LogEvent<([paused: boolean] & {paused: boolean})>(
        abi, '0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64'
    ),
    PoolBalanceChanged: new LogEvent<([poolId: string, liquidityProvider: string, tokens: Array<string>, deltas: Array<bigint>, protocolFeeAmounts: Array<bigint>] & {poolId: string, liquidityProvider: string, tokens: Array<string>, deltas: Array<bigint>, protocolFeeAmounts: Array<bigint>})>(
        abi, '0xe5ce249087ce04f05a957192435400fd97868dba0e6a4b4c049abf8af80dae78'
    ),
    PoolBalanceManaged: new LogEvent<([poolId: string, assetManager: string, token: string, cashDelta: bigint, managedDelta: bigint] & {poolId: string, assetManager: string, token: string, cashDelta: bigint, managedDelta: bigint})>(
        abi, '0x6edcaf6241105b4c94c2efdbf3a6b12458eb3d07be3a0e81d24b13c44045fe7a'
    ),
    PoolRegistered: new LogEvent<([poolId: string, poolAddress: string, specialization: number] & {poolId: string, poolAddress: string, specialization: number})>(
        abi, '0x3c13bc30b8e878c53fd2a36b679409c073afd75950be43d8858768e956fbc20e'
    ),
    RelayerApprovalChanged: new LogEvent<([relayer: string, sender: string, approved: boolean] & {relayer: string, sender: string, approved: boolean})>(
        abi, '0x46961fdb4502b646d5095fba7600486a8ac05041d55cdf0f16ed677180b5cad8'
    ),
    Swap: new LogEvent<([poolId: string, tokenIn: string, tokenOut: string, amountIn: bigint, amountOut: bigint] & {poolId: string, tokenIn: string, tokenOut: string, amountIn: bigint, amountOut: bigint})>(
        abi, '0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b'
    ),
    TokensDeregistered: new LogEvent<([poolId: string, tokens: Array<string>] & {poolId: string, tokens: Array<string>})>(
        abi, '0x7dcdc6d02ef40c7c1a7046a011b058bd7f988fa14e20a66344f9d4e60657d610'
    ),
    TokensRegistered: new LogEvent<([poolId: string, tokens: Array<string>, assetManagers: Array<string>] & {poolId: string, tokens: Array<string>, assetManagers: Array<string>})>(
        abi, '0xf5847d3f2197b16cdcd2098ec95d0905cd1abdaf415f07bb7cef2bba8ac5dec4'
    ),
}

export const functions = {
    WETH: new Func<[], {}, string>(
        abi, '0xad5c4648'
    ),
    batchSwap: new Func<[kind: number, swaps: Array<([poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string] & {poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string})>, assets: Array<string>, funds: ([sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean] & {sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean}), limits: Array<bigint>, deadline: bigint], {kind: number, swaps: Array<([poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string] & {poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string})>, assets: Array<string>, funds: ([sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean] & {sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean}), limits: Array<bigint>, deadline: bigint}, Array<bigint>>(
        abi, '0x945bcec9'
    ),
    deregisterTokens: new Func<[poolId: string, tokens: Array<string>], {poolId: string, tokens: Array<string>}, []>(
        abi, '0x7d3aeb96'
    ),
    exitPool: new Func<[poolId: string, sender: string, recipient: string, request: ([assets: Array<string>, minAmountsOut: Array<bigint>, userData: string, toInternalBalance: boolean] & {assets: Array<string>, minAmountsOut: Array<bigint>, userData: string, toInternalBalance: boolean})], {poolId: string, sender: string, recipient: string, request: ([assets: Array<string>, minAmountsOut: Array<bigint>, userData: string, toInternalBalance: boolean] & {assets: Array<string>, minAmountsOut: Array<bigint>, userData: string, toInternalBalance: boolean})}, []>(
        abi, '0x8bdb3913'
    ),
    flashLoan: new Func<[recipient: string, tokens: Array<string>, amounts: Array<bigint>, userData: string], {recipient: string, tokens: Array<string>, amounts: Array<bigint>, userData: string}, []>(
        abi, '0x5c38449e'
    ),
    getActionId: new Func<[selector: string], {selector: string}, string>(
        abi, '0x851c1bb3'
    ),
    getAuthorizer: new Func<[], {}, string>(
        abi, '0xaaabadc5'
    ),
    getDomainSeparator: new Func<[], {}, string>(
        abi, '0xed24911d'
    ),
    getInternalBalance: new Func<[user: string, tokens: Array<string>], {user: string, tokens: Array<string>}, Array<bigint>>(
        abi, '0x0f5a6efa'
    ),
    getNextNonce: new Func<[user: string], {user: string}, bigint>(
        abi, '0x90193b7c'
    ),
    getPausedState: new Func<[], {}, ([paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint] & {paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint})>(
        abi, '0x1c0de051'
    ),
    getPool: new Func<[poolId: string], {poolId: string}, [_: string, _: number]>(
        abi, '0xf6c00927'
    ),
    getPoolTokenInfo: new Func<[poolId: string, token: string], {poolId: string, token: string}, ([cash: bigint, managed: bigint, lastChangeBlock: bigint, assetManager: string] & {cash: bigint, managed: bigint, lastChangeBlock: bigint, assetManager: string})>(
        abi, '0xb05f8e48'
    ),
    getPoolTokens: new Func<[poolId: string], {poolId: string}, ([tokens: Array<string>, balances: Array<bigint>, lastChangeBlock: bigint] & {tokens: Array<string>, balances: Array<bigint>, lastChangeBlock: bigint})>(
        abi, '0xf94d4668'
    ),
    getProtocolFeesCollector: new Func<[], {}, string>(
        abi, '0xd2946c2b'
    ),
    hasApprovedRelayer: new Func<[user: string, relayer: string], {user: string, relayer: string}, boolean>(
        abi, '0xfec90d72'
    ),
    joinPool: new Func<[poolId: string, sender: string, recipient: string, request: ([assets: Array<string>, maxAmountsIn: Array<bigint>, userData: string, fromInternalBalance: boolean] & {assets: Array<string>, maxAmountsIn: Array<bigint>, userData: string, fromInternalBalance: boolean})], {poolId: string, sender: string, recipient: string, request: ([assets: Array<string>, maxAmountsIn: Array<bigint>, userData: string, fromInternalBalance: boolean] & {assets: Array<string>, maxAmountsIn: Array<bigint>, userData: string, fromInternalBalance: boolean})}, []>(
        abi, '0xb95cac28'
    ),
    managePoolBalance: new Func<[ops: Array<([kind: number, poolId: string, token: string, amount: bigint] & {kind: number, poolId: string, token: string, amount: bigint})>], {ops: Array<([kind: number, poolId: string, token: string, amount: bigint] & {kind: number, poolId: string, token: string, amount: bigint})>}, []>(
        abi, '0xe6c46092'
    ),
    manageUserBalance: new Func<[ops: Array<([kind: number, asset: string, amount: bigint, sender: string, recipient: string] & {kind: number, asset: string, amount: bigint, sender: string, recipient: string})>], {ops: Array<([kind: number, asset: string, amount: bigint, sender: string, recipient: string] & {kind: number, asset: string, amount: bigint, sender: string, recipient: string})>}, []>(
        abi, '0x0e8e3e84'
    ),
    queryBatchSwap: new Func<[kind: number, swaps: Array<([poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string] & {poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string})>, assets: Array<string>, funds: ([sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean] & {sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean})], {kind: number, swaps: Array<([poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string] & {poolId: string, assetInIndex: bigint, assetOutIndex: bigint, amount: bigint, userData: string})>, assets: Array<string>, funds: ([sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean] & {sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean})}, Array<bigint>>(
        abi, '0xf84d066e'
    ),
    registerPool: new Func<[specialization: number], {specialization: number}, string>(
        abi, '0x09b2760f'
    ),
    registerTokens: new Func<[poolId: string, tokens: Array<string>, assetManagers: Array<string>], {poolId: string, tokens: Array<string>, assetManagers: Array<string>}, []>(
        abi, '0x66a9c7d2'
    ),
    setAuthorizer: new Func<[newAuthorizer: string], {newAuthorizer: string}, []>(
        abi, '0x058a628f'
    ),
    setPaused: new Func<[paused: boolean], {paused: boolean}, []>(
        abi, '0x16c38b3c'
    ),
    setRelayerApproval: new Func<[sender: string, relayer: string, approved: boolean], {sender: string, relayer: string, approved: boolean}, []>(
        abi, '0xfa6e671d'
    ),
    swap: new Func<[singleSwap: ([poolId: string, kind: number, assetIn: string, assetOut: string, amount: bigint, userData: string] & {poolId: string, kind: number, assetIn: string, assetOut: string, amount: bigint, userData: string}), funds: ([sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean] & {sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean}), limit: bigint, deadline: bigint], {singleSwap: ([poolId: string, kind: number, assetIn: string, assetOut: string, amount: bigint, userData: string] & {poolId: string, kind: number, assetIn: string, assetOut: string, amount: bigint, userData: string}), funds: ([sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean] & {sender: string, fromInternalBalance: boolean, recipient: string, toInternalBalance: boolean}), limit: bigint, deadline: bigint}, bigint>(
        abi, '0x52bbbe29'
    ),
}

export class Contract extends ContractBase {

    WETH(): Promise<string> {
        return this.eth_call(functions.WETH, [])
    }

    getActionId(selector: string): Promise<string> {
        return this.eth_call(functions.getActionId, [selector])
    }

    getAuthorizer(): Promise<string> {
        return this.eth_call(functions.getAuthorizer, [])
    }

    getDomainSeparator(): Promise<string> {
        return this.eth_call(functions.getDomainSeparator, [])
    }

    getInternalBalance(user: string, tokens: Array<string>): Promise<Array<bigint>> {
        return this.eth_call(functions.getInternalBalance, [user, tokens])
    }

    getNextNonce(user: string): Promise<bigint> {
        return this.eth_call(functions.getNextNonce, [user])
    }

    getPausedState(): Promise<([paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint] & {paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint})> {
        return this.eth_call(functions.getPausedState, [])
    }

    getPool(poolId: string): Promise<[_: string, _: number]> {
        return this.eth_call(functions.getPool, [poolId])
    }

    getPoolTokenInfo(poolId: string, token: string): Promise<([cash: bigint, managed: bigint, lastChangeBlock: bigint, assetManager: string] & {cash: bigint, managed: bigint, lastChangeBlock: bigint, assetManager: string})> {
        return this.eth_call(functions.getPoolTokenInfo, [poolId, token])
    }

    getPoolTokens(poolId: string): Promise<([tokens: Array<string>, balances: Array<bigint>, lastChangeBlock: bigint] & {tokens: Array<string>, balances: Array<bigint>, lastChangeBlock: bigint})> {
        return this.eth_call(functions.getPoolTokens, [poolId])
    }

    getProtocolFeesCollector(): Promise<string> {
        return this.eth_call(functions.getProtocolFeesCollector, [])
    }

    hasApprovedRelayer(user: string, relayer: string): Promise<boolean> {
        return this.eth_call(functions.hasApprovedRelayer, [user, relayer])
    }
}
