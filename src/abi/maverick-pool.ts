import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AddLiquidity: event("0x133a027327582be2089f6ca47137e3d337be4ca2cd921e5f0b178c9c2d5b8364", "AddLiquidity(address,uint256,(uint128,uint128,uint256,uint128,uint8,int32,bool)[])", {"sender": indexed(p.address), "tokenId": indexed(p.uint256), "binDeltas": p.array(p.struct({"deltaA": p.uint128, "deltaB": p.uint128, "deltaLpBalance": p.uint256, "binId": p.uint128, "kind": p.uint8, "lowerTick": p.int32, "isActive": p.bool}))}),
    BinMerged: event("0x8ecf1f9da718dc4c174482cdb4e334113856b46a85e5694deeec06d512e8f772", "BinMerged(uint128,uint128,uint128,uint128)", {"binId": indexed(p.uint128), "reserveA": p.uint128, "reserveB": p.uint128, "mergeId": p.uint128}),
    BinMoved: event("0x42e51620e75096344ac889cc1d899ab619aedbe89a4f6b230ee3cecb849c7e2f", "BinMoved(uint128,int128,int128)", {"binId": indexed(p.uint128), "previousTick": p.int128, "newTick": p.int128}),
    MigrateBinsUpStack: event("0x6deceb91de75f84acd021df8c6410377aa442257495a79a9e3bfc7eba745853e", "MigrateBinsUpStack(address,uint128,uint32)", {"sender": indexed(p.address), "binId": p.uint128, "maxRecursion": p.uint32}),
    ProtocolFeeCollected: event("0x292394e5b7a6b75d01122bb2dc85341cefec10b852325db9d3658a452f5eb211", "ProtocolFeeCollected(uint256,bool)", {"protocolFee": p.uint256, "isTokenA": p.bool}),
    RemoveLiquidity: event("0x65da280c1e973a1c5884c38d63e2c2b3c2a3158a0761e76545b64035e2489dfe", "RemoveLiquidity(address,address,uint256,(uint128,uint128,uint256,uint128,uint8,int32,bool)[])", {"sender": indexed(p.address), "recipient": indexed(p.address), "tokenId": indexed(p.uint256), "binDeltas": p.array(p.struct({"deltaA": p.uint128, "deltaB": p.uint128, "deltaLpBalance": p.uint256, "binId": p.uint128, "kind": p.uint8, "lowerTick": p.int32, "isActive": p.bool}))}),
    SetProtocolFeeRatio: event("0x06e6ba2b10970ecae3ab2c29feb60ab2503358820756ef14a9827b0fa5add30f", "SetProtocolFeeRatio(uint256)", {"protocolFee": p.uint256}),
    Swap: event("0x3b841dc9ab51e3104bda4f61b41e4271192d22cd19da5ee6e292dc8e2744f713", "Swap(address,address,bool,bool,uint256,uint256,int32)", {"sender": p.address, "recipient": p.address, "tokenAIn": p.bool, "exactOutput": p.bool, "amountIn": p.uint256, "amountOut": p.uint256, "activeTick": p.int32}),
    TransferLiquidity: event("0xd384edefdfebd0bb45d82f94aed5ff327fd6510cc6c53ddc78a3ef4a0e7c715c", "TransferLiquidity(uint256,uint256,(uint128,uint128)[])", {"fromTokenId": p.uint256, "toTokenId": p.uint256, "params": p.array(p.struct({"binId": p.uint128, "amount": p.uint128}))}),
}

export const functions = {
    addLiquidity: fun("0x9d5f20bb", "addLiquidity(uint256,(uint8,int32,bool,uint128,uint128)[],bytes)", {"tokenId": p.uint256, "params": p.array(p.struct({"kind": p.uint8, "pos": p.int32, "isDelta": p.bool, "deltaA": p.uint128, "deltaB": p.uint128})), "data": p.bytes}, {"tokenAAmount": p.uint256, "tokenBAmount": p.uint256, "binDeltas": p.array(p.struct({"deltaA": p.uint128, "deltaB": p.uint128, "deltaLpBalance": p.uint256, "binId": p.uint128, "kind": p.uint8, "lowerTick": p.int32, "isActive": p.bool}))}),
    balanceOf: viewFun("0x6da3bf8b", "balanceOf(uint256,uint128)", {"tokenId": p.uint256, "binId": p.uint128}, p.uint256),
    binBalanceA: viewFun("0x75bbbd73", "binBalanceA()", {}, p.uint128),
    binBalanceB: viewFun("0xfa158509", "binBalanceB()", {}, p.uint128),
    binMap: viewFun("0xa2ba172f", "binMap(int32)", {"tick": p.int32}, p.uint256),
    binPositions: viewFun("0x83f9c632", "binPositions(int32,uint256)", {"tick": p.int32, "kind": p.uint256}, p.uint128),
    factory: viewFun("0xc45a0155", "factory()", {}, p.address),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint256),
    lookback: viewFun("0xebcbd281", "lookback()", {}, p.int256),
    getBin: viewFun("0x44a185bb", "getBin(uint128)", {"binId": p.uint128}, p.struct({"reserveA": p.uint128, "reserveB": p.uint128, "mergeBinBalance": p.uint128, "mergeId": p.uint128, "totalSupply": p.uint128, "kind": p.uint8, "lowerTick": p.int32})),
    getCurrentTwa: viewFun("0xd3d3861a", "getCurrentTwa()", {}, p.int256),
    getState: viewFun("0x1865c57d", "getState()", {}, p.struct({"activeTick": p.int32, "status": p.uint8, "binCounter": p.uint128, "protocolFeeRatio": p.uint64})),
    getTwa: viewFun("0xa4ed496a", "getTwa()", {}, p.struct({"twa": p.int96, "value": p.int96, "lastTimestamp": p.uint64})),
    migrateBinUpStack: fun("0xc0c5d7fb", "migrateBinUpStack(uint128,uint32)", {"binId": p.uint128, "maxRecursion": p.uint32}, ),
    removeLiquidity: fun("0x57c8c7b0", "removeLiquidity(address,uint256,(uint128,uint128)[])", {"recipient": p.address, "tokenId": p.uint256, "params": p.array(p.struct({"binId": p.uint128, "amount": p.uint128}))}, {"tokenAOut": p.uint256, "tokenBOut": p.uint256, "binDeltas": p.array(p.struct({"deltaA": p.uint128, "deltaB": p.uint128, "deltaLpBalance": p.uint256, "binId": p.uint128, "kind": p.uint8, "lowerTick": p.int32, "isActive": p.bool}))}),
    swap: fun("0xc51c9029", "swap(address,uint256,bool,bool,uint256,bytes)", {"recipient": p.address, "amount": p.uint256, "tokenAIn": p.bool, "exactOutput": p.bool, "sqrtPriceLimit": p.uint256, "data": p.bytes}, {"amountIn": p.uint256, "amountOut": p.uint256}),
    tickSpacing: viewFun("0xd0c93a7c", "tickSpacing()", {}, p.uint256),
    tokenA: viewFun("0x0fc63d10", "tokenA()", {}, p.address),
    tokenAScale: viewFun("0x3ab72c10", "tokenAScale()", {}, p.uint256),
    tokenB: viewFun("0x5f64b55b", "tokenB()", {}, p.address),
    tokenBScale: viewFun("0x21272d4c", "tokenBScale()", {}, p.uint256),
    transferLiquidity: fun("0xd279735f", "transferLiquidity(uint256,uint256,(uint128,uint128)[])", {"fromTokenId": p.uint256, "toTokenId": p.uint256, "params": p.array(p.struct({"binId": p.uint128, "amount": p.uint128}))}, ),
}

export class Contract extends ContractBase {

    balanceOf(tokenId: BalanceOfParams["tokenId"], binId: BalanceOfParams["binId"]) {
        return this.eth_call(functions.balanceOf, {tokenId, binId})
    }

    binBalanceA() {
        return this.eth_call(functions.binBalanceA, {})
    }

    binBalanceB() {
        return this.eth_call(functions.binBalanceB, {})
    }

    binMap(tick: BinMapParams["tick"]) {
        return this.eth_call(functions.binMap, {tick})
    }

    binPositions(tick: BinPositionsParams["tick"], kind: BinPositionsParams["kind"]) {
        return this.eth_call(functions.binPositions, {tick, kind})
    }

    factory() {
        return this.eth_call(functions.factory, {})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    lookback() {
        return this.eth_call(functions.lookback, {})
    }

    getBin(binId: GetBinParams["binId"]) {
        return this.eth_call(functions.getBin, {binId})
    }

    getCurrentTwa() {
        return this.eth_call(functions.getCurrentTwa, {})
    }

    getState() {
        return this.eth_call(functions.getState, {})
    }

    getTwa() {
        return this.eth_call(functions.getTwa, {})
    }

    tickSpacing() {
        return this.eth_call(functions.tickSpacing, {})
    }

    tokenA() {
        return this.eth_call(functions.tokenA, {})
    }

    tokenAScale() {
        return this.eth_call(functions.tokenAScale, {})
    }

    tokenB() {
        return this.eth_call(functions.tokenB, {})
    }

    tokenBScale() {
        return this.eth_call(functions.tokenBScale, {})
    }
}

/// Event types
export type AddLiquidityEventArgs = EParams<typeof events.AddLiquidity>
export type BinMergedEventArgs = EParams<typeof events.BinMerged>
export type BinMovedEventArgs = EParams<typeof events.BinMoved>
export type MigrateBinsUpStackEventArgs = EParams<typeof events.MigrateBinsUpStack>
export type ProtocolFeeCollectedEventArgs = EParams<typeof events.ProtocolFeeCollected>
export type RemoveLiquidityEventArgs = EParams<typeof events.RemoveLiquidity>
export type SetProtocolFeeRatioEventArgs = EParams<typeof events.SetProtocolFeeRatio>
export type SwapEventArgs = EParams<typeof events.Swap>
export type TransferLiquidityEventArgs = EParams<typeof events.TransferLiquidity>

/// Function types
export type AddLiquidityParams = FunctionArguments<typeof functions.addLiquidity>
export type AddLiquidityReturn = FunctionReturn<typeof functions.addLiquidity>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BinBalanceAParams = FunctionArguments<typeof functions.binBalanceA>
export type BinBalanceAReturn = FunctionReturn<typeof functions.binBalanceA>

export type BinBalanceBParams = FunctionArguments<typeof functions.binBalanceB>
export type BinBalanceBReturn = FunctionReturn<typeof functions.binBalanceB>

export type BinMapParams = FunctionArguments<typeof functions.binMap>
export type BinMapReturn = FunctionReturn<typeof functions.binMap>

export type BinPositionsParams = FunctionArguments<typeof functions.binPositions>
export type BinPositionsReturn = FunctionReturn<typeof functions.binPositions>

export type FactoryParams = FunctionArguments<typeof functions.factory>
export type FactoryReturn = FunctionReturn<typeof functions.factory>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type LookbackParams = FunctionArguments<typeof functions.lookback>
export type LookbackReturn = FunctionReturn<typeof functions.lookback>

export type GetBinParams = FunctionArguments<typeof functions.getBin>
export type GetBinReturn = FunctionReturn<typeof functions.getBin>

export type GetCurrentTwaParams = FunctionArguments<typeof functions.getCurrentTwa>
export type GetCurrentTwaReturn = FunctionReturn<typeof functions.getCurrentTwa>

export type GetStateParams = FunctionArguments<typeof functions.getState>
export type GetStateReturn = FunctionReturn<typeof functions.getState>

export type GetTwaParams = FunctionArguments<typeof functions.getTwa>
export type GetTwaReturn = FunctionReturn<typeof functions.getTwa>

export type MigrateBinUpStackParams = FunctionArguments<typeof functions.migrateBinUpStack>
export type MigrateBinUpStackReturn = FunctionReturn<typeof functions.migrateBinUpStack>

export type RemoveLiquidityParams = FunctionArguments<typeof functions.removeLiquidity>
export type RemoveLiquidityReturn = FunctionReturn<typeof functions.removeLiquidity>

export type SwapParams = FunctionArguments<typeof functions.swap>
export type SwapReturn = FunctionReturn<typeof functions.swap>

export type TickSpacingParams = FunctionArguments<typeof functions.tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof functions.tickSpacing>

export type TokenAParams = FunctionArguments<typeof functions.tokenA>
export type TokenAReturn = FunctionReturn<typeof functions.tokenA>

export type TokenAScaleParams = FunctionArguments<typeof functions.tokenAScale>
export type TokenAScaleReturn = FunctionReturn<typeof functions.tokenAScale>

export type TokenBParams = FunctionArguments<typeof functions.tokenB>
export type TokenBReturn = FunctionReturn<typeof functions.tokenB>

export type TokenBScaleParams = FunctionArguments<typeof functions.tokenBScale>
export type TokenBScaleReturn = FunctionReturn<typeof functions.tokenBScale>

export type TransferLiquidityParams = FunctionArguments<typeof functions.transferLiquidity>
export type TransferLiquidityReturn = FunctionReturn<typeof functions.transferLiquidity>

