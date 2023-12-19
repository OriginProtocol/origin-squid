import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './maverick-pool.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AddLiquidity: new LogEvent<([sender: string, tokenId: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>] & {sender: string, tokenId: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>})>(
        abi, '0x133a027327582be2089f6ca47137e3d337be4ca2cd921e5f0b178c9c2d5b8364'
    ),
    BinMerged: new LogEvent<([binId: bigint, reserveA: bigint, reserveB: bigint, mergeId: bigint] & {binId: bigint, reserveA: bigint, reserveB: bigint, mergeId: bigint})>(
        abi, '0x8ecf1f9da718dc4c174482cdb4e334113856b46a85e5694deeec06d512e8f772'
    ),
    BinMoved: new LogEvent<([binId: bigint, previousTick: bigint, newTick: bigint] & {binId: bigint, previousTick: bigint, newTick: bigint})>(
        abi, '0x42e51620e75096344ac889cc1d899ab619aedbe89a4f6b230ee3cecb849c7e2f'
    ),
    MigrateBinsUpStack: new LogEvent<([sender: string, binId: bigint, maxRecursion: number] & {sender: string, binId: bigint, maxRecursion: number})>(
        abi, '0x6deceb91de75f84acd021df8c6410377aa442257495a79a9e3bfc7eba745853e'
    ),
    ProtocolFeeCollected: new LogEvent<([protocolFee: bigint, isTokenA: boolean] & {protocolFee: bigint, isTokenA: boolean})>(
        abi, '0x292394e5b7a6b75d01122bb2dc85341cefec10b852325db9d3658a452f5eb211'
    ),
    RemoveLiquidity: new LogEvent<([sender: string, recipient: string, tokenId: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>] & {sender: string, recipient: string, tokenId: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>})>(
        abi, '0x65da280c1e973a1c5884c38d63e2c2b3c2a3158a0761e76545b64035e2489dfe'
    ),
    SetProtocolFeeRatio: new LogEvent<([protocolFee: bigint] & {protocolFee: bigint})>(
        abi, '0x06e6ba2b10970ecae3ab2c29feb60ab2503358820756ef14a9827b0fa5add30f'
    ),
    Swap: new LogEvent<([sender: string, recipient: string, tokenAIn: boolean, exactOutput: boolean, amountIn: bigint, amountOut: bigint, activeTick: number] & {sender: string, recipient: string, tokenAIn: boolean, exactOutput: boolean, amountIn: bigint, amountOut: bigint, activeTick: number})>(
        abi, '0x3b841dc9ab51e3104bda4f61b41e4271192d22cd19da5ee6e292dc8e2744f713'
    ),
    TransferLiquidity: new LogEvent<([fromTokenId: bigint, toTokenId: bigint, params: Array<([binId: bigint, amount: bigint] & {binId: bigint, amount: bigint})>] & {fromTokenId: bigint, toTokenId: bigint, params: Array<([binId: bigint, amount: bigint] & {binId: bigint, amount: bigint})>})>(
        abi, '0xd384edefdfebd0bb45d82f94aed5ff327fd6510cc6c53ddc78a3ef4a0e7c715c'
    ),
}

export const functions = {
    addLiquidity: new Func<[tokenId: bigint, params: Array<([kind: number, pos: number, isDelta: boolean, deltaA: bigint, deltaB: bigint] & {kind: number, pos: number, isDelta: boolean, deltaA: bigint, deltaB: bigint})>, data: string], {tokenId: bigint, params: Array<([kind: number, pos: number, isDelta: boolean, deltaA: bigint, deltaB: bigint] & {kind: number, pos: number, isDelta: boolean, deltaA: bigint, deltaB: bigint})>, data: string}, ([tokenAAmount: bigint, tokenBAmount: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>] & {tokenAAmount: bigint, tokenBAmount: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>})>(
        abi, '0x9d5f20bb'
    ),
    balanceOf: new Func<[tokenId: bigint, binId: bigint], {tokenId: bigint, binId: bigint}, bigint>(
        abi, '0x6da3bf8b'
    ),
    binBalanceA: new Func<[], {}, bigint>(
        abi, '0x75bbbd73'
    ),
    binBalanceB: new Func<[], {}, bigint>(
        abi, '0xfa158509'
    ),
    binMap: new Func<[tick: number], {tick: number}, bigint>(
        abi, '0xa2ba172f'
    ),
    binPositions: new Func<[tick: number, kind: bigint], {tick: number, kind: bigint}, bigint>(
        abi, '0x83f9c632'
    ),
    factory: new Func<[], {}, string>(
        abi, '0xc45a0155'
    ),
    fee: new Func<[], {}, bigint>(
        abi, '0xddca3f43'
    ),
    lookback: new Func<[], {}, bigint>(
        abi, '0xebcbd281'
    ),
    getBin: new Func<[binId: bigint], {binId: bigint}, ([reserveA: bigint, reserveB: bigint, mergeBinBalance: bigint, mergeId: bigint, totalSupply: bigint, kind: number, lowerTick: number] & {reserveA: bigint, reserveB: bigint, mergeBinBalance: bigint, mergeId: bigint, totalSupply: bigint, kind: number, lowerTick: number})>(
        abi, '0x44a185bb'
    ),
    getCurrentTwa: new Func<[], {}, bigint>(
        abi, '0xd3d3861a'
    ),
    getState: new Func<[], {}, ([activeTick: number, status: number, binCounter: bigint, protocolFeeRatio: bigint] & {activeTick: number, status: number, binCounter: bigint, protocolFeeRatio: bigint})>(
        abi, '0x1865c57d'
    ),
    getTwa: new Func<[], {}, ([twa: bigint, value: bigint, lastTimestamp: bigint] & {twa: bigint, value: bigint, lastTimestamp: bigint})>(
        abi, '0xa4ed496a'
    ),
    migrateBinUpStack: new Func<[binId: bigint, maxRecursion: number], {binId: bigint, maxRecursion: number}, []>(
        abi, '0xc0c5d7fb'
    ),
    removeLiquidity: new Func<[recipient: string, tokenId: bigint, params: Array<([binId: bigint, amount: bigint] & {binId: bigint, amount: bigint})>], {recipient: string, tokenId: bigint, params: Array<([binId: bigint, amount: bigint] & {binId: bigint, amount: bigint})>}, ([tokenAOut: bigint, tokenBOut: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>] & {tokenAOut: bigint, tokenBOut: bigint, binDeltas: Array<([deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean] & {deltaA: bigint, deltaB: bigint, deltaLpBalance: bigint, binId: bigint, kind: number, lowerTick: number, isActive: boolean})>})>(
        abi, '0x57c8c7b0'
    ),
    swap: new Func<[recipient: string, amount: bigint, tokenAIn: boolean, exactOutput: boolean, sqrtPriceLimit: bigint, data: string], {recipient: string, amount: bigint, tokenAIn: boolean, exactOutput: boolean, sqrtPriceLimit: bigint, data: string}, ([amountIn: bigint, amountOut: bigint] & {amountIn: bigint, amountOut: bigint})>(
        abi, '0xc51c9029'
    ),
    tickSpacing: new Func<[], {}, bigint>(
        abi, '0xd0c93a7c'
    ),
    tokenA: new Func<[], {}, string>(
        abi, '0x0fc63d10'
    ),
    tokenAScale: new Func<[], {}, bigint>(
        abi, '0x3ab72c10'
    ),
    tokenB: new Func<[], {}, string>(
        abi, '0x5f64b55b'
    ),
    tokenBScale: new Func<[], {}, bigint>(
        abi, '0x21272d4c'
    ),
    transferLiquidity: new Func<[fromTokenId: bigint, toTokenId: bigint, params: Array<([binId: bigint, amount: bigint] & {binId: bigint, amount: bigint})>], {fromTokenId: bigint, toTokenId: bigint, params: Array<([binId: bigint, amount: bigint] & {binId: bigint, amount: bigint})>}, []>(
        abi, '0xd279735f'
    ),
}

export class Contract extends ContractBase {

    balanceOf(tokenId: bigint, binId: bigint): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [tokenId, binId])
    }

    binBalanceA(): Promise<bigint> {
        return this.eth_call(functions.binBalanceA, [])
    }

    binBalanceB(): Promise<bigint> {
        return this.eth_call(functions.binBalanceB, [])
    }

    binMap(tick: number): Promise<bigint> {
        return this.eth_call(functions.binMap, [tick])
    }

    binPositions(tick: number, kind: bigint): Promise<bigint> {
        return this.eth_call(functions.binPositions, [tick, kind])
    }

    factory(): Promise<string> {
        return this.eth_call(functions.factory, [])
    }

    fee(): Promise<bigint> {
        return this.eth_call(functions.fee, [])
    }

    lookback(): Promise<bigint> {
        return this.eth_call(functions.lookback, [])
    }

    getBin(binId: bigint): Promise<([reserveA: bigint, reserveB: bigint, mergeBinBalance: bigint, mergeId: bigint, totalSupply: bigint, kind: number, lowerTick: number] & {reserveA: bigint, reserveB: bigint, mergeBinBalance: bigint, mergeId: bigint, totalSupply: bigint, kind: number, lowerTick: number})> {
        return this.eth_call(functions.getBin, [binId])
    }

    getCurrentTwa(): Promise<bigint> {
        return this.eth_call(functions.getCurrentTwa, [])
    }

    getState(): Promise<([activeTick: number, status: number, binCounter: bigint, protocolFeeRatio: bigint] & {activeTick: number, status: number, binCounter: bigint, protocolFeeRatio: bigint})> {
        return this.eth_call(functions.getState, [])
    }

    getTwa(): Promise<([twa: bigint, value: bigint, lastTimestamp: bigint] & {twa: bigint, value: bigint, lastTimestamp: bigint})> {
        return this.eth_call(functions.getTwa, [])
    }

    tickSpacing(): Promise<bigint> {
        return this.eth_call(functions.tickSpacing, [])
    }

    tokenA(): Promise<string> {
        return this.eth_call(functions.tokenA, [])
    }

    tokenAScale(): Promise<bigint> {
        return this.eth_call(functions.tokenAScale, [])
    }

    tokenB(): Promise<string> {
        return this.eth_call(functions.tokenB, [])
    }

    tokenBScale(): Promise<bigint> {
        return this.eth_call(functions.tokenBScale, [])
    }
}
