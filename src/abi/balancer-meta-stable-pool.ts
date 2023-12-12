import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './balancer-meta-stable-pool.abi'

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
    OracleEnabledChanged: new LogEvent<([enabled: boolean] & {enabled: boolean})>(
        abi, '0x3e350b41e86a8e10f804ade6d35340d620be35569cc75ac943e8bb14ab80ead1'
    ),
    PausedStateChanged: new LogEvent<([paused: boolean] & {paused: boolean})>(
        abi, '0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64'
    ),
    PriceRateCacheUpdated: new LogEvent<([token: string, rate: bigint] & {token: string, rate: bigint})>(
        abi, '0xc1a224b14823b63c7711127f125fbf592434682f38881ebb61408747a303affc'
    ),
    PriceRateProviderSet: new LogEvent<([token: string, provider: string, cacheDuration: bigint] & {token: string, provider: string, cacheDuration: bigint})>(
        abi, '0xca6c2c5b6b44b5f3f0c08f0e28e5b6deda1cb38c3fe1113e8031d926c1e8c6d0'
    ),
    SwapFeePercentageChanged: new LogEvent<([swapFeePercentage: bigint] & {swapFeePercentage: bigint})>(
        abi, '0xa9ba3ffe0b6c366b81232caab38605a0699ad5398d6cce76f91ee809e322dafc'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
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
    enableOracle: new Func<[], {}, []>(
        abi, '0x292c914a'
    ),
    getActionId: new Func<[selector: string], {selector: string}, string>(
        abi, '0x851c1bb3'
    ),
    getAmplificationParameter: new Func<[], {}, ([value: bigint, isUpdating: boolean, precision: bigint] & {value: bigint, isUpdating: boolean, precision: bigint})>(
        abi, '0x6daccffa'
    ),
    getAuthorizer: new Func<[], {}, string>(
        abi, '0xaaabadc5'
    ),
    getLargestSafeQueryWindow: new Func<[], {}, bigint>(
        abi, '0xffd088eb'
    ),
    getLastInvariant: new Func<[], {}, ([lastInvariant: bigint, lastInvariantAmp: bigint] & {lastInvariant: bigint, lastInvariantAmp: bigint})>(
        abi, '0x9b02cdde'
    ),
    getLatest: new Func<[variable: number], {variable: number}, bigint>(
        abi, '0xb10be739'
    ),
    getOracleMiscData: new Func<[], {}, ([logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean] & {logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean})>(
        abi, '0x1ed4eddc'
    ),
    getOwner: new Func<[], {}, string>(
        abi, '0x893d20e8'
    ),
    getPastAccumulators: new Func<[queries: Array<([variable: number, ago: bigint] & {variable: number, ago: bigint})>], {queries: Array<([variable: number, ago: bigint] & {variable: number, ago: bigint})>}, Array<bigint>>(
        abi, '0x6b843239'
    ),
    getPausedState: new Func<[], {}, ([paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint] & {paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint})>(
        abi, '0x1c0de051'
    ),
    getPoolId: new Func<[], {}, string>(
        abi, '0x38fff2d0'
    ),
    getPriceRateCache: new Func<[token: string], {token: string}, ([rate: bigint, duration: bigint, expires: bigint] & {rate: bigint, duration: bigint, expires: bigint})>(
        abi, '0xb867ee5a'
    ),
    getRate: new Func<[], {}, bigint>(
        abi, '0x679aefce'
    ),
    getRateProviders: new Func<[], {}, Array<string>>(
        abi, '0x238a2d59'
    ),
    getSample: new Func<[index: bigint], {index: bigint}, ([logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint] & {logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint})>(
        abi, '0x60d1507c'
    ),
    getScalingFactors: new Func<[], {}, Array<bigint>>(
        abi, '0x1dd746ea'
    ),
    getSwapFeePercentage: new Func<[], {}, bigint>(
        abi, '0x55c67628'
    ),
    getTimeWeightedAverage: new Func<[queries: Array<([variable: number, secs: bigint, ago: bigint] & {variable: number, secs: bigint, ago: bigint})>], {queries: Array<([variable: number, secs: bigint, ago: bigint] & {variable: number, secs: bigint, ago: bigint})>}, Array<bigint>>(
        abi, '0x1dccd830'
    ),
    getTotalSamples: new Func<[], {}, bigint>(
        abi, '0xb48b5b40'
    ),
    getVault: new Func<[], {}, string>(
        abi, '0x8d928af8'
    ),
    increaseAllowance: new Func<[spender: string, addedValue: bigint], {spender: string, addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonces: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x7ecebe00'
    ),
    onExitPool: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, ([amountsOut: Array<bigint>, dueProtocolFeeAmounts: Array<bigint>] & {amountsOut: Array<bigint>, dueProtocolFeeAmounts: Array<bigint>})>(
        abi, '0x74f3b009'
    ),
    onJoinPool: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, ([amountsIn: Array<bigint>, dueProtocolFeeAmounts: Array<bigint>] & {amountsIn: Array<bigint>, dueProtocolFeeAmounts: Array<bigint>})>(
        abi, '0xd5c096c4'
    ),
    'onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256[],uint256,uint256)': new Func<[request: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balances: Array<bigint>, indexIn: bigint, indexOut: bigint], {request: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balances: Array<bigint>, indexIn: bigint, indexOut: bigint}, bigint>(
        abi, '0x01ec954a'
    ),
    'onSwap((uint8,address,address,uint256,bytes32,uint256,address,address,bytes),uint256,uint256)': new Func<[request: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balanceTokenIn: bigint, balanceTokenOut: bigint], {request: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balanceTokenIn: bigint, balanceTokenOut: bigint}, bigint>(
        abi, '0x9d2c110c'
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
    setPaused: new Func<[paused: boolean], {paused: boolean}, []>(
        abi, '0x16c38b3c'
    ),
    setPriceRateCacheDuration: new Func<[token: string, duration: bigint], {token: string, duration: bigint}, []>(
        abi, '0xb7710251'
    ),
    setSwapFeePercentage: new Func<[swapFeePercentage: bigint], {swapFeePercentage: bigint}, []>(
        abi, '0x38e9922e'
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
    updatePriceRateCache: new Func<[token: string], {token: string}, []>(
        abi, '0xa0daaed0'
    ),
}

export class Contract extends ContractBase {

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

    getAmplificationParameter(): Promise<([value: bigint, isUpdating: boolean, precision: bigint] & {value: bigint, isUpdating: boolean, precision: bigint})> {
        return this.eth_call(functions.getAmplificationParameter, [])
    }

    getAuthorizer(): Promise<string> {
        return this.eth_call(functions.getAuthorizer, [])
    }

    getLargestSafeQueryWindow(): Promise<bigint> {
        return this.eth_call(functions.getLargestSafeQueryWindow, [])
    }

    getLastInvariant(): Promise<([lastInvariant: bigint, lastInvariantAmp: bigint] & {lastInvariant: bigint, lastInvariantAmp: bigint})> {
        return this.eth_call(functions.getLastInvariant, [])
    }

    getLatest(variable: number): Promise<bigint> {
        return this.eth_call(functions.getLatest, [variable])
    }

    getOracleMiscData(): Promise<([logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean] & {logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean})> {
        return this.eth_call(functions.getOracleMiscData, [])
    }

    getOwner(): Promise<string> {
        return this.eth_call(functions.getOwner, [])
    }

    getPastAccumulators(queries: Array<([variable: number, ago: bigint] & {variable: number, ago: bigint})>): Promise<Array<bigint>> {
        return this.eth_call(functions.getPastAccumulators, [queries])
    }

    getPausedState(): Promise<([paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint] & {paused: boolean, pauseWindowEndTime: bigint, bufferPeriodEndTime: bigint})> {
        return this.eth_call(functions.getPausedState, [])
    }

    getPoolId(): Promise<string> {
        return this.eth_call(functions.getPoolId, [])
    }

    getPriceRateCache(token: string): Promise<([rate: bigint, duration: bigint, expires: bigint] & {rate: bigint, duration: bigint, expires: bigint})> {
        return this.eth_call(functions.getPriceRateCache, [token])
    }

    getRate(): Promise<bigint> {
        return this.eth_call(functions.getRate, [])
    }

    getRateProviders(): Promise<Array<string>> {
        return this.eth_call(functions.getRateProviders, [])
    }

    getSample(index: bigint): Promise<([logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint] & {logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint})> {
        return this.eth_call(functions.getSample, [index])
    }

    getScalingFactors(): Promise<Array<bigint>> {
        return this.eth_call(functions.getScalingFactors, [])
    }

    getSwapFeePercentage(): Promise<bigint> {
        return this.eth_call(functions.getSwapFeePercentage, [])
    }

    getTimeWeightedAverage(queries: Array<([variable: number, secs: bigint, ago: bigint] & {variable: number, secs: bigint, ago: bigint})>): Promise<Array<bigint>> {
        return this.eth_call(functions.getTimeWeightedAverage, [queries])
    }

    getTotalSamples(): Promise<bigint> {
        return this.eth_call(functions.getTotalSamples, [])
    }

    getVault(): Promise<string> {
        return this.eth_call(functions.getVault, [])
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
}
