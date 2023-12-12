import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './balancer-weighted-pool-2-token.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    OracleEnabledChanged: new LogEvent<([enabled: boolean] & {enabled: boolean})>(
        abi, '0x3e350b41e86a8e10f804ade6d35340d620be35569cc75ac943e8bb14ab80ead1'
    ),
    PausedStateChanged: new LogEvent<([paused: boolean] & {paused: boolean})>(
        abi, '0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64'
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
    decreaseApproval: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x66188463'
    ),
    enableOracle: new Func<[], {}, []>(
        abi, '0x292c914a'
    ),
    getActionId: new Func<[selector: string], {selector: string}, string>(
        abi, '0x851c1bb3'
    ),
    getAuthorizer: new Func<[], {}, string>(
        abi, '0xaaabadc5'
    ),
    getInvariant: new Func<[], {}, bigint>(
        abi, '0xc0ff1a15'
    ),
    getLargestSafeQueryWindow: new Func<[], {}, bigint>(
        abi, '0xffd088eb'
    ),
    getLastInvariant: new Func<[], {}, bigint>(
        abi, '0x9b02cdde'
    ),
    getLatest: new Func<[variable: number], {variable: number}, bigint>(
        abi, '0xb10be739'
    ),
    getMiscData: new Func<[], {}, ([logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean, swapFeePercentage: bigint] & {logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean, swapFeePercentage: bigint})>(
        abi, '0x4a6b0b15'
    ),
    getNormalizedWeights: new Func<[], {}, Array<bigint>>(
        abi, '0xf89f27ed'
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
    getRate: new Func<[], {}, bigint>(
        abi, '0x679aefce'
    ),
    getSample: new Func<[index: bigint], {index: bigint}, ([logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint] & {logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint})>(
        abi, '0x60d1507c'
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
    increaseApproval: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0xd73dd623'
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
    onJoinPool: new Func<[poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string], {poolId: string, sender: string, recipient: string, balances: Array<bigint>, lastChangeBlock: bigint, protocolSwapFeePercentage: bigint, userData: string}, ([amountsIn: Array<bigint>, dueProtocolFeeAmounts: Array<bigint>] & {amountsIn: Array<bigint>, dueProtocolFeeAmounts: Array<bigint>})>(
        abi, '0xd5c096c4'
    ),
    onSwap: new Func<[request: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balanceTokenIn: bigint, balanceTokenOut: bigint], {request: ([kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string] & {kind: number, tokenIn: string, tokenOut: string, amount: bigint, poolId: string, lastChangeBlock: bigint, from: string, to: string, userData: string}), balanceTokenIn: bigint, balanceTokenOut: bigint}, bigint>(
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
    setPaused: new Func<[paused: boolean], {paused: boolean}, []>(
        abi, '0x16c38b3c'
    ),
    setSwapFeePercentage: new Func<[swapFeePercentage: bigint], {swapFeePercentage: bigint}, []>(
        abi, '0x38e9922e'
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

    getAuthorizer(): Promise<string> {
        return this.eth_call(functions.getAuthorizer, [])
    }

    getInvariant(): Promise<bigint> {
        return this.eth_call(functions.getInvariant, [])
    }

    getLargestSafeQueryWindow(): Promise<bigint> {
        return this.eth_call(functions.getLargestSafeQueryWindow, [])
    }

    getLastInvariant(): Promise<bigint> {
        return this.eth_call(functions.getLastInvariant, [])
    }

    getLatest(variable: number): Promise<bigint> {
        return this.eth_call(functions.getLatest, [variable])
    }

    getMiscData(): Promise<([logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean, swapFeePercentage: bigint] & {logInvariant: bigint, logTotalSupply: bigint, oracleSampleCreationTimestamp: bigint, oracleIndex: bigint, oracleEnabled: boolean, swapFeePercentage: bigint})> {
        return this.eth_call(functions.getMiscData, [])
    }

    getNormalizedWeights(): Promise<Array<bigint>> {
        return this.eth_call(functions.getNormalizedWeights, [])
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

    getRate(): Promise<bigint> {
        return this.eth_call(functions.getRate, [])
    }

    getSample(index: bigint): Promise<([logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint] & {logPairPrice: bigint, accLogPairPrice: bigint, logBptPrice: bigint, accLogBptPrice: bigint, logInvariant: bigint, accLogInvariant: bigint, timestamp: bigint})> {
        return this.eth_call(functions.getSample, [index])
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
