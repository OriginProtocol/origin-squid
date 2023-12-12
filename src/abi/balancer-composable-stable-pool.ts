import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './balancer-composable-stable-pool.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AmpUpdateStarted: new LogEvent<([startValue: bigint, endValue: bigint, startTime: bigint, endTime: bigint] & {startValue: bigint, endValue: bigint, startTime: bigint, endTime: bigint})>(
        abi, '0x1835882ee7a34ac194f717a35e09bb1d24c82a3b9d854ab6c9749525b714cdf2'
    ),
    AmpUpdateStopped: new LogEvent<([currentValue: bigint] & {currentValue: bigint})>(
        abi, '0xa0d01593e47e69d07e0ccd87bece09411e07dd1ed40ca8f2e7af2976542a0233'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    PausedStateChanged: new LogEvent<([paused: boolean] & {paused: boolean})>(
        abi, '0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64'
    ),
    ProtocolFeePercentageCacheUpdated: new LogEvent<([feeType: bigint, protocolFeePercentage: bigint] & {feeType: bigint, protocolFeePercentage: bigint})>(
        abi, '0x6bfb689528fa96ec1ad670ad6d6064be1ae96bfd5d2ee35c837fd0fe0c11959a'
    ),
    RecoveryModeStateChanged: new LogEvent<([enabled: boolean] & {enabled: boolean})>(
        abi, '0xeff3d4d215b42bf0960be9c6d5e05c22cba4df6627a3a523e2acee733b5854c8'
    ),
    SwapFeePercentageChanged: new LogEvent<([swapFeePercentage: bigint] & {swapFeePercentage: bigint})>(
        abi, '0xa9ba3ffe0b6c366b81232caab38605a0699ad5398d6cce76f91ee809e322dafc'
    ),
    TokenRateCacheUpdated: new LogEvent<([tokenIndex: bigint, rate: bigint] & {tokenIndex: bigint, rate: bigint})>(
        abi, '0xb77a83204ca282e08dc3a65b0a1ca32ea4e6875c38ef0bf5bf75e52a67354fac'
    ),
    TokenRateProviderSet: new LogEvent<([tokenIndex: bigint, provider: string, cacheDuration: bigint] & {tokenIndex: bigint, provider: string, cacheDuration: bigint})>(
        abi, '0xdd6d1c9badb346de6925b358a472c937b41698d2632696759e43fd6527feeec4'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL: new Func<[], {}, bigint>(
        abi, '0xddf4627b'
    ),
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[account: string], {account: string}, bigint>(
        abi, '0x70a08231'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    decreaseAllowance: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0xa457c2d7'
    ),
    disableRecoveryMode: new Func<[], {}, []>(
        abi, '0xb7b814fc'
    ),
    enableRecoveryMode: new Func<[], {}, []>(
        abi, '0x54a844ba'
    ),
    getActionId: new Func<[selector: string], {selector: string}, string>(
        abi, '0x851c1bb3'
    ),
    getActualSupply: new Func<[], {}, bigint>(
        abi, '0x876f303b'
    ),
    getAmplificationParameter: new Func<[], {}, ([value: bigint, isUpdating: boolean, precision: bigint] & {value: bigint, isUpdating: boolean, precision: bigint})>(
        abi, '0x6daccffa'
    ),
    getAuthorizer: new Func<[], {}, string>(
        abi, '0xaaabadc5'
    ),
    getBptIndex: new Func<[], {}, bigint>(
        abi, '0x82687a56'
    ),
    getDomainSeparator: new Func<[], {}, string>(
        abi, '0xed24911d'
    ),
    getLastJoinExitData: new Func<[], {}, ([lastJoinExitAmplification: bigint, lastPostJoinExitInvariant: bigint] & {lastJoinExitAmplification: bigint, lastPostJoinExitInvariant: bigint})>(
        abi, '0x3c975d51'
    ),
    getMinimumBpt: new Func<[], {}, bigint>(
        abi, '0x04842d4c'
    ),
    getNextNonce: new Func<[account: string], {account: string}, bigint>(
        abi, '0x90193b7c'
    ),
    getOwner: new Func<[], {}, string>(
        abi, '0x893d20e8'
    ),
    getPausedState: new Func<[], {}, ([paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint] & {paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint})>(
        abi, '0x1c0de051'
    ),
    getPoolId: new Func<[], {}, string>(
        abi, '0x38fff2d0'
    ),
    getProtocolFeePercentageCache: new Func<[feeType: bigint], {feeType: bigint}, bigint>(
        abi, '0x70464016'
    ),
    getProtocolFeesCollector: new Func<[], {}, string>(
        abi, '0xd2946c2b'
    ),
    getProtocolSwapFeeDelegation: new Func<[], {}, boolean>(
        abi, '0x15b0015b'
    ),
    getRate: new Func<[], {}, bigint>(
        abi, '0x679aefce'
    ),
    getRateProviders: new Func<[], {}, Array<string>>(
        abi, '0x238a2d59'
    ),
    getScalingFactors: new Func<[], {}, Array<bigint>>(
        abi, '0x1dd746ea'
    ),
    getSwapFeePercentage: new Func<[], {}, bigint>(
        abi, '0x55c67628'
    ),
    getTokenRate: new Func<[token: string], {token: string}, bigint>(
        abi, '0x54dea00a'
    ),
    getTokenRateCache: new Func<[token: string], {token: string}, ([rate: bigint, oldRate: bigint, duration: bigint, expires: bigint] & {rate: bigint, oldRate: bigint, duration: bigint, expires: bigint})>(
        abi, '0x7f1260d1'
    ),
    getVault: new Func<[], {}, string>(
        abi, '0x8d928af8'
    ),
    inRecoveryMode: new Func<[], {}, boolean>(
        abi, '0xb35056b8'
    ),
    increaseAllowance: new Func<[spender: string, addedValue: bigint], {spender: string, addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    isExemptFromYieldProtocolFee: new Func<[], {}, boolean>(
        abi, '0x77151bee'
    ),
    isTokenExemptFromYieldProtocolFee: new Func<[token: string], {token: string}, boolean>(
        abi, '0xab7759f1'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonces: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x7ecebe00'
    ),
    onExitPool: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, [_: Array<bigint>, _: Array<bigint>]>(
        abi, '0x74f3b009'
    ),
    onJoinPool: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, [_: Array<bigint>, _: Array<bigint>]>(
        abi, '0xd5c096c4'
    ),
    onSwap: new Func<[swapRequest: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balances: Array<bigint>, indexIn: bigint, indexOut: bigint], {swapRequest: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balances: Array<bigint>, indexIn: bigint, indexOut: bigint}, bigint>(
        abi, '0x01ec954a'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    permit: new Func<[owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string], {owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0xd505accf'
    ),
    queryExit: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, ([bptIn: bigint, amountsOut: Array<bigint>] & {bptIn: bigint, amountsOut: Array<bigint>})>(
        abi, '0x6028bfd4'
    ),
    queryJoin: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, ([bptOut: bigint, amountsIn: Array<bigint>] & {bptOut: bigint, amountsIn: Array<bigint>})>(
        abi, '0x87ec6817'
    ),
    setAssetManagerPoolConfig: new Func<[token: string, poolConfig: string], {token: string, poolConfig: string}, []>(
        abi, '0x50dd6ed9'
    ),
    setSwapFeePercentage: new Func<[swapFeePercentage: bigint], {swapFeePercentage: bigint}, []>(
        abi, '0x38e9922e'
    ),
    setTokenRateCacheDuration: new Func<[token: string, duration: bigint], {token: string, duration: bigint}, []>(
        abi, '0xf4b7964d'
    ),
    startAmplificationParameterUpdate: new Func<[rawEndValue: bigint, endTime: bigint], {rawEndValue: bigint, endTime: bigint}, []>(
        abi, '0x2f1a0bc9'
    ),
    stopAmplificationParameterUpdate: new Func<[], {}, []>(
        abi, '0xeb0f24d6'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[recipient: string, amount: bigint], {recipient: string, amount: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[sender: string, recipient: string, amount: bigint], {sender: string, recipient: string, amount: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    updateProtocolFeePercentageCache: new Func<[], {}, []>(
        abi, '0x0da0669c'
    ),
    updateTokenRateCache: new Func<[token: string], {token: string}, []>(
        abi, '0x2df2c7c0'
    ),
    version: new Func<[], {}, string>(
        abi, '0x54fd4d50'
    ),
}

export class Contract extends ContractBase {

    DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL(): Promise<bigint> {
        return this.eth_call(functions.DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL, [])
    }

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    allowance(owner: string, spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    balanceOf(account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [account])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    getActionId(selector: string): Promise<string> {
        return this.eth_call(functions.getActionId, [selector])
    }

    getActualSupply(): Promise<bigint> {
        return this.eth_call(functions.getActualSupply, [])
    }

    getAmplificationParameter(): Promise<([value: bigint, isUpdating: boolean, precision: bigint] & {value: bigint, isUpdating: boolean, precision: bigint})> {
        return this.eth_call(functions.getAmplificationParameter, [])
    }

    getAuthorizer(): Promise<string> {
        return this.eth_call(functions.getAuthorizer, [])
    }

    getBptIndex(): Promise<bigint> {
        return this.eth_call(functions.getBptIndex, [])
    }

    getDomainSeparator(): Promise<string> {
        return this.eth_call(functions.getDomainSeparator, [])
    }

    getLastJoinExitData(): Promise<([lastJoinExitAmplification: bigint, lastPostJoinExitInvariant: bigint] & {lastJoinExitAmplification: bigint, lastPostJoinExitInvariant: bigint})> {
        return this.eth_call(functions.getLastJoinExitData, [])
    }

    getMinimumBpt(): Promise<bigint> {
        return this.eth_call(functions.getMinimumBpt, [])
    }

    getNextNonce(account: string): Promise<bigint> {
        return this.eth_call(functions.getNextNonce, [account])
    }

    getOwner(): Promise<string> {
        return this.eth_call(functions.getOwner, [])
    }

    getPausedState(): Promise<([paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint] & {paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint})> {
        return this.eth_call(functions.getPausedState, [])
    }

    getPoolId(): Promise<string> {
        return this.eth_call(functions.getPoolId, [])
    }

    getProtocolFeePercentageCache(feeType: bigint): Promise<bigint> {
        return this.eth_call(functions.getProtocolFeePercentageCache, [feeType])
    }

    getProtocolFeesCollector(): Promise<string> {
        return this.eth_call(functions.getProtocolFeesCollector, [])
    }

    getProtocolSwapFeeDelegation(): Promise<boolean> {
        return this.eth_call(functions.getProtocolSwapFeeDelegation, [])
    }

    getRate(): Promise<bigint> {
        return this.eth_call(functions.getRate, [])
    }

    getRateProviders(): Promise<Array<string>> {
        return this.eth_call(functions.getRateProviders, [])
    }

    getScalingFactors(): Promise<Array<bigint>> {
        return this.eth_call(functions.getScalingFactors, [])
    }

    getSwapFeePercentage(): Promise<bigint> {
        return this.eth_call(functions.getSwapFeePercentage, [])
    }

    getTokenRate(token: string): Promise<bigint> {
        return this.eth_call(functions.getTokenRate, [token])
    }

    getTokenRateCache(token: string): Promise<([rate: bigint, oldRate: bigint, duration: bigint, expires: bigint] & {rate: bigint, oldRate: bigint, duration: bigint, expires: bigint})> {
        return this.eth_call(functions.getTokenRateCache, [token])
    }

    getVault(): Promise<string> {
        return this.eth_call(functions.getVault, [])
    }

    inRecoveryMode(): Promise<boolean> {
        return this.eth_call(functions.inRecoveryMode, [])
    }

    isExemptFromYieldProtocolFee(): Promise<boolean> {
        return this.eth_call(functions.isExemptFromYieldProtocolFee, [])
    }

    isTokenExemptFromYieldProtocolFee(token: string): Promise<boolean> {
        return this.eth_call(functions.isTokenExemptFromYieldProtocolFee, [token])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    nonces(owner: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [owner])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    version(): Promise<string> {
        return this.eth_call(functions.version, [])
    }
}
