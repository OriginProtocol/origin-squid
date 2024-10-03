import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    NonceIncreased: event("0xfc69110dd11eb791755e4abd6b7d281bae236de95736d38a23782814be5e10db", "NonceIncreased(address,uint256)", {"maker": indexed(p.address), "newNonce": p.uint256}),
    OrderCanceled: event("0xcbfa7d191838ece7ba4783ca3a30afd316619b7f368094b57ee7ffde9a923db1", "OrderCanceled(address,bytes32,uint256)", {"maker": indexed(p.address), "orderHash": p.bytes32, "remainingRaw": p.uint256}),
    OrderFilled: event("0xb9ed0243fdf00f0545c63a0af8850c090d86bb46682baec4bf3c496814fe4f02", "OrderFilled(address,bytes32,uint256)", {"maker": indexed(p.address), "orderHash": p.bytes32, "remaining": p.uint256}),
    OrderFilledRFQ: event("0xc3b639f02b125bfa160e50739b8c44eb2d1b6908e2b6d5925c6d770f2ca78127", "OrderFilledRFQ(bytes32,uint256)", {"orderHash": p.bytes32, "makingAmount": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
}

export const functions = {
    advanceNonce: fun("0x72c244a8", "advanceNonce(uint8)", {"amount": p.uint8}, ),
    and: viewFun("0xbfa75143", "and(uint256,bytes)", {"offsets": p.uint256, "data": p.bytes}, p.bool),
    arbitraryStaticCall: viewFun("0xbf15fcd8", "arbitraryStaticCall(address,bytes)", {"target": p.address, "data": p.bytes}, p.uint256),
    cancelOrder: fun("0x2d9a56f6", "cancelOrder((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes))", {"order": p.struct({"salt": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "receiver": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256, "offsets": p.uint256, "interactions": p.bytes})}, {"orderRemaining": p.uint256, "orderHash": p.bytes32}),
    'cancelOrderRFQ(uint256)': fun("0x825caba1", "cancelOrderRFQ(uint256)", {"orderInfo": p.uint256}, ),
    'cancelOrderRFQ(uint256,uint256)': fun("0xbddccd35", "cancelOrderRFQ(uint256,uint256)", {"orderInfo": p.uint256, "additionalMask": p.uint256}, ),
    checkPredicate: viewFun("0x6c838250", "checkPredicate((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes))", {"order": p.struct({"salt": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "receiver": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256, "offsets": p.uint256, "interactions": p.bytes})}, p.bool),
    clipperSwap: fun("0x84bd6d29", "clipperSwap(address,address,address,uint256,uint256,uint256,bytes32,bytes32)", {"clipperExchange": p.address, "srcToken": p.address, "dstToken": p.address, "inputAmount": p.uint256, "outputAmount": p.uint256, "goodUntil": p.uint256, "r": p.bytes32, "vs": p.bytes32}, p.uint256),
    clipperSwapTo: fun("0x093d4fa5", "clipperSwapTo(address,address,address,address,uint256,uint256,uint256,bytes32,bytes32)", {"clipperExchange": p.address, "recipient": p.address, "srcToken": p.address, "dstToken": p.address, "inputAmount": p.uint256, "outputAmount": p.uint256, "goodUntil": p.uint256, "r": p.bytes32, "vs": p.bytes32}, p.uint256),
    clipperSwapToWithPermit: fun("0xc805a666", "clipperSwapToWithPermit(address,address,address,address,uint256,uint256,uint256,bytes32,bytes32,bytes)", {"clipperExchange": p.address, "recipient": p.address, "srcToken": p.address, "dstToken": p.address, "inputAmount": p.uint256, "outputAmount": p.uint256, "goodUntil": p.uint256, "r": p.bytes32, "vs": p.bytes32, "permit": p.bytes}, p.uint256),
    destroy: fun("0x83197ef0", "destroy()", {}, ),
    eq: viewFun("0x6fe7b0ba", "eq(uint256,bytes)", {"value": p.uint256, "data": p.bytes}, p.bool),
    fillOrder: fun("0x62e238bb", "fillOrder((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes),bytes,bytes,uint256,uint256,uint256)", {"order": p.struct({"salt": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "receiver": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256, "offsets": p.uint256, "interactions": p.bytes}), "signature": p.bytes, "interaction": p.bytes, "makingAmount": p.uint256, "takingAmount": p.uint256, "skipPermitAndThresholdAmount": p.uint256}, {"_0": p.uint256, "_1": p.uint256, "_2": p.bytes32}),
    fillOrderRFQ: fun("0x3eca9c0a", "fillOrderRFQ((uint256,address,address,address,address,uint256,uint256),bytes,uint256)", {"order": p.struct({"info": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256}), "signature": p.bytes, "flagsAndAmount": p.uint256}, {"_0": p.uint256, "_1": p.uint256, "_2": p.bytes32}),
    fillOrderRFQCompact: fun("0x9570eeee", "fillOrderRFQCompact((uint256,address,address,address,address,uint256,uint256),bytes32,bytes32,uint256)", {"order": p.struct({"info": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256}), "r": p.bytes32, "vs": p.bytes32, "flagsAndAmount": p.uint256}, {"filledMakingAmount": p.uint256, "filledTakingAmount": p.uint256, "orderHash": p.bytes32}),
    fillOrderRFQTo: fun("0x5a099843", "fillOrderRFQTo((uint256,address,address,address,address,uint256,uint256),bytes,uint256,address)", {"order": p.struct({"info": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256}), "signature": p.bytes, "flagsAndAmount": p.uint256, "target": p.address}, {"filledMakingAmount": p.uint256, "filledTakingAmount": p.uint256, "orderHash": p.bytes32}),
    fillOrderRFQToWithPermit: fun("0x70ccbd31", "fillOrderRFQToWithPermit((uint256,address,address,address,address,uint256,uint256),bytes,uint256,address,bytes)", {"order": p.struct({"info": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256}), "signature": p.bytes, "flagsAndAmount": p.uint256, "target": p.address, "permit": p.bytes}, {"_0": p.uint256, "_1": p.uint256, "_2": p.bytes32}),
    fillOrderTo: fun("0xe5d7bde6", "fillOrderTo((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes),bytes,bytes,uint256,uint256,uint256,address)", {"order_": p.struct({"salt": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "receiver": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256, "offsets": p.uint256, "interactions": p.bytes}), "signature": p.bytes, "interaction": p.bytes, "makingAmount": p.uint256, "takingAmount": p.uint256, "skipPermitAndThresholdAmount": p.uint256, "target": p.address}, {"actualMakingAmount": p.uint256, "actualTakingAmount": p.uint256, "orderHash": p.bytes32}),
    fillOrderToWithPermit: fun("0xd365c695", "fillOrderToWithPermit((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes),bytes,bytes,uint256,uint256,uint256,address,bytes)", {"order": p.struct({"salt": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "receiver": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256, "offsets": p.uint256, "interactions": p.bytes}), "signature": p.bytes, "interaction": p.bytes, "makingAmount": p.uint256, "takingAmount": p.uint256, "skipPermitAndThresholdAmount": p.uint256, "target": p.address, "permit": p.bytes}, {"_0": p.uint256, "_1": p.uint256, "_2": p.bytes32}),
    gt: viewFun("0x4f38e2b8", "gt(uint256,bytes)", {"value": p.uint256, "data": p.bytes}, p.bool),
    hashOrder: viewFun("0x37e7316f", "hashOrder((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes))", {"order": p.struct({"salt": p.uint256, "makerAsset": p.address, "takerAsset": p.address, "maker": p.address, "receiver": p.address, "allowedSender": p.address, "makingAmount": p.uint256, "takingAmount": p.uint256, "offsets": p.uint256, "interactions": p.bytes})}, p.bytes32),
    increaseNonce: fun("0xc53a0292", "increaseNonce()", {}, ),
    invalidatorForOrderRFQ: viewFun("0x56f16124", "invalidatorForOrderRFQ(address,uint256)", {"maker": p.address, "slot": p.uint256}, p.uint256),
    lt: viewFun("0xca4ece22", "lt(uint256,bytes)", {"value": p.uint256, "data": p.bytes}, p.bool),
    nonce: viewFun("0x70ae92d2", "nonce(address)", {"_0": p.address}, p.uint256),
    nonceEquals: viewFun("0xcf6fc6e3", "nonceEquals(address,uint256)", {"makerAddress": p.address, "makerNonce": p.uint256}, p.bool),
    or: viewFun("0x74261145", "or(uint256,bytes)", {"offsets": p.uint256, "data": p.bytes}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    remaining: viewFun("0xbc1ed74c", "remaining(bytes32)", {"orderHash": p.bytes32}, p.uint256),
    remainingRaw: viewFun("0x7e54f092", "remainingRaw(bytes32)", {"orderHash": p.bytes32}, p.uint256),
    remainingsRaw: viewFun("0x942461bb", "remainingsRaw(bytes32[])", {"orderHashes": p.array(p.bytes32)}, p.array(p.uint256)),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    rescueFunds: fun("0x78e3214f", "rescueFunds(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    simulate: fun("0xbd61951d", "simulate(address,bytes)", {"target": p.address, "data": p.bytes}, ),
    swap: fun("0x12aa3caf", "swap(address,(address,address,address,address,uint256,uint256,uint256),bytes,bytes)", {"executor": p.address, "desc": p.struct({"srcToken": p.address, "dstToken": p.address, "srcReceiver": p.address, "dstReceiver": p.address, "amount": p.uint256, "minReturnAmount": p.uint256, "flags": p.uint256}), "permit": p.bytes, "data": p.bytes}, {"returnAmount": p.uint256, "spentAmount": p.uint256}),
    timestampBelow: viewFun("0x63592c2b", "timestampBelow(uint256)", {"time": p.uint256}, p.bool),
    timestampBelowAndNonceEquals: viewFun("0x2cc2878d", "timestampBelowAndNonceEquals(uint256)", {"timeNonceAccount": p.uint256}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    uniswapV3Swap: fun("0xe449022e", "uniswapV3Swap(uint256,uint256,uint256[])", {"amount": p.uint256, "minReturn": p.uint256, "pools": p.array(p.uint256)}, p.uint256),
    uniswapV3SwapCallback: fun("0xfa461e33", "uniswapV3SwapCallback(int256,int256,bytes)", {"amount0Delta": p.int256, "amount1Delta": p.int256, "_2": p.bytes}, ),
    uniswapV3SwapTo: fun("0xbc80f1a8", "uniswapV3SwapTo(address,uint256,uint256,uint256[])", {"recipient": p.address, "amount": p.uint256, "minReturn": p.uint256, "pools": p.array(p.uint256)}, p.uint256),
    uniswapV3SwapToWithPermit: fun("0x2521b930", "uniswapV3SwapToWithPermit(address,address,uint256,uint256,uint256[],bytes)", {"recipient": p.address, "srcToken": p.address, "amount": p.uint256, "minReturn": p.uint256, "pools": p.array(p.uint256), "permit": p.bytes}, p.uint256),
    unoswap: fun("0x0502b1c5", "unoswap(address,uint256,uint256,uint256[])", {"srcToken": p.address, "amount": p.uint256, "minReturn": p.uint256, "pools": p.array(p.uint256)}, p.uint256),
    unoswapTo: fun("0xf78dc253", "unoswapTo(address,address,uint256,uint256,uint256[])", {"recipient": p.address, "srcToken": p.address, "amount": p.uint256, "minReturn": p.uint256, "pools": p.array(p.uint256)}, p.uint256),
    unoswapToWithPermit: fun("0x3c15fd91", "unoswapToWithPermit(address,address,uint256,uint256,uint256[],bytes)", {"recipient": p.address, "srcToken": p.address, "amount": p.uint256, "minReturn": p.uint256, "pools": p.array(p.uint256), "permit": p.bytes}, p.uint256),
}

export class Contract extends ContractBase {

    and(offsets: AndParams["offsets"], data: AndParams["data"]) {
        return this.eth_call(functions.and, {offsets, data})
    }

    arbitraryStaticCall(target: ArbitraryStaticCallParams["target"], data: ArbitraryStaticCallParams["data"]) {
        return this.eth_call(functions.arbitraryStaticCall, {target, data})
    }

    checkPredicate(order: CheckPredicateParams["order"]) {
        return this.eth_call(functions.checkPredicate, {order})
    }

    eq(value: EqParams["value"], data: EqParams["data"]) {
        return this.eth_call(functions.eq, {value, data})
    }

    gt(value: GtParams["value"], data: GtParams["data"]) {
        return this.eth_call(functions.gt, {value, data})
    }

    hashOrder(order: HashOrderParams["order"]) {
        return this.eth_call(functions.hashOrder, {order})
    }

    invalidatorForOrderRFQ(maker: InvalidatorForOrderRFQParams["maker"], slot: InvalidatorForOrderRFQParams["slot"]) {
        return this.eth_call(functions.invalidatorForOrderRFQ, {maker, slot})
    }

    lt(value: LtParams["value"], data: LtParams["data"]) {
        return this.eth_call(functions.lt, {value, data})
    }

    nonce(_0: NonceParams["_0"]) {
        return this.eth_call(functions.nonce, {_0})
    }

    nonceEquals(makerAddress: NonceEqualsParams["makerAddress"], makerNonce: NonceEqualsParams["makerNonce"]) {
        return this.eth_call(functions.nonceEquals, {makerAddress, makerNonce})
    }

    or(offsets: OrParams["offsets"], data: OrParams["data"]) {
        return this.eth_call(functions.or, {offsets, data})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    remaining(orderHash: RemainingParams["orderHash"]) {
        return this.eth_call(functions.remaining, {orderHash})
    }

    remainingRaw(orderHash: RemainingRawParams["orderHash"]) {
        return this.eth_call(functions.remainingRaw, {orderHash})
    }

    remainingsRaw(orderHashes: RemainingsRawParams["orderHashes"]) {
        return this.eth_call(functions.remainingsRaw, {orderHashes})
    }

    timestampBelow(time: TimestampBelowParams["time"]) {
        return this.eth_call(functions.timestampBelow, {time})
    }

    timestampBelowAndNonceEquals(timeNonceAccount: TimestampBelowAndNonceEqualsParams["timeNonceAccount"]) {
        return this.eth_call(functions.timestampBelowAndNonceEquals, {timeNonceAccount})
    }
}

/// Event types
export type NonceIncreasedEventArgs = EParams<typeof events.NonceIncreased>
export type OrderCanceledEventArgs = EParams<typeof events.OrderCanceled>
export type OrderFilledEventArgs = EParams<typeof events.OrderFilled>
export type OrderFilledRFQEventArgs = EParams<typeof events.OrderFilledRFQ>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type AdvanceNonceParams = FunctionArguments<typeof functions.advanceNonce>
export type AdvanceNonceReturn = FunctionReturn<typeof functions.advanceNonce>

export type AndParams = FunctionArguments<typeof functions.and>
export type AndReturn = FunctionReturn<typeof functions.and>

export type ArbitraryStaticCallParams = FunctionArguments<typeof functions.arbitraryStaticCall>
export type ArbitraryStaticCallReturn = FunctionReturn<typeof functions.arbitraryStaticCall>

export type CancelOrderParams = FunctionArguments<typeof functions.cancelOrder>
export type CancelOrderReturn = FunctionReturn<typeof functions.cancelOrder>

export type CancelOrderRFQParams_0 = FunctionArguments<typeof functions['cancelOrderRFQ(uint256)']>
export type CancelOrderRFQReturn_0 = FunctionReturn<typeof functions['cancelOrderRFQ(uint256)']>

export type CancelOrderRFQParams_1 = FunctionArguments<typeof functions['cancelOrderRFQ(uint256,uint256)']>
export type CancelOrderRFQReturn_1 = FunctionReturn<typeof functions['cancelOrderRFQ(uint256,uint256)']>

export type CheckPredicateParams = FunctionArguments<typeof functions.checkPredicate>
export type CheckPredicateReturn = FunctionReturn<typeof functions.checkPredicate>

export type ClipperSwapParams = FunctionArguments<typeof functions.clipperSwap>
export type ClipperSwapReturn = FunctionReturn<typeof functions.clipperSwap>

export type ClipperSwapToParams = FunctionArguments<typeof functions.clipperSwapTo>
export type ClipperSwapToReturn = FunctionReturn<typeof functions.clipperSwapTo>

export type ClipperSwapToWithPermitParams = FunctionArguments<typeof functions.clipperSwapToWithPermit>
export type ClipperSwapToWithPermitReturn = FunctionReturn<typeof functions.clipperSwapToWithPermit>

export type DestroyParams = FunctionArguments<typeof functions.destroy>
export type DestroyReturn = FunctionReturn<typeof functions.destroy>

export type EqParams = FunctionArguments<typeof functions.eq>
export type EqReturn = FunctionReturn<typeof functions.eq>

export type FillOrderParams = FunctionArguments<typeof functions.fillOrder>
export type FillOrderReturn = FunctionReturn<typeof functions.fillOrder>

export type FillOrderRFQParams = FunctionArguments<typeof functions.fillOrderRFQ>
export type FillOrderRFQReturn = FunctionReturn<typeof functions.fillOrderRFQ>

export type FillOrderRFQCompactParams = FunctionArguments<typeof functions.fillOrderRFQCompact>
export type FillOrderRFQCompactReturn = FunctionReturn<typeof functions.fillOrderRFQCompact>

export type FillOrderRFQToParams = FunctionArguments<typeof functions.fillOrderRFQTo>
export type FillOrderRFQToReturn = FunctionReturn<typeof functions.fillOrderRFQTo>

export type FillOrderRFQToWithPermitParams = FunctionArguments<typeof functions.fillOrderRFQToWithPermit>
export type FillOrderRFQToWithPermitReturn = FunctionReturn<typeof functions.fillOrderRFQToWithPermit>

export type FillOrderToParams = FunctionArguments<typeof functions.fillOrderTo>
export type FillOrderToReturn = FunctionReturn<typeof functions.fillOrderTo>

export type FillOrderToWithPermitParams = FunctionArguments<typeof functions.fillOrderToWithPermit>
export type FillOrderToWithPermitReturn = FunctionReturn<typeof functions.fillOrderToWithPermit>

export type GtParams = FunctionArguments<typeof functions.gt>
export type GtReturn = FunctionReturn<typeof functions.gt>

export type HashOrderParams = FunctionArguments<typeof functions.hashOrder>
export type HashOrderReturn = FunctionReturn<typeof functions.hashOrder>

export type IncreaseNonceParams = FunctionArguments<typeof functions.increaseNonce>
export type IncreaseNonceReturn = FunctionReturn<typeof functions.increaseNonce>

export type InvalidatorForOrderRFQParams = FunctionArguments<typeof functions.invalidatorForOrderRFQ>
export type InvalidatorForOrderRFQReturn = FunctionReturn<typeof functions.invalidatorForOrderRFQ>

export type LtParams = FunctionArguments<typeof functions.lt>
export type LtReturn = FunctionReturn<typeof functions.lt>

export type NonceParams = FunctionArguments<typeof functions.nonce>
export type NonceReturn = FunctionReturn<typeof functions.nonce>

export type NonceEqualsParams = FunctionArguments<typeof functions.nonceEquals>
export type NonceEqualsReturn = FunctionReturn<typeof functions.nonceEquals>

export type OrParams = FunctionArguments<typeof functions.or>
export type OrReturn = FunctionReturn<typeof functions.or>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RemainingParams = FunctionArguments<typeof functions.remaining>
export type RemainingReturn = FunctionReturn<typeof functions.remaining>

export type RemainingRawParams = FunctionArguments<typeof functions.remainingRaw>
export type RemainingRawReturn = FunctionReturn<typeof functions.remainingRaw>

export type RemainingsRawParams = FunctionArguments<typeof functions.remainingsRaw>
export type RemainingsRawReturn = FunctionReturn<typeof functions.remainingsRaw>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RescueFundsParams = FunctionArguments<typeof functions.rescueFunds>
export type RescueFundsReturn = FunctionReturn<typeof functions.rescueFunds>

export type SimulateParams = FunctionArguments<typeof functions.simulate>
export type SimulateReturn = FunctionReturn<typeof functions.simulate>

export type SwapParams = FunctionArguments<typeof functions.swap>
export type SwapReturn = FunctionReturn<typeof functions.swap>

export type TimestampBelowParams = FunctionArguments<typeof functions.timestampBelow>
export type TimestampBelowReturn = FunctionReturn<typeof functions.timestampBelow>

export type TimestampBelowAndNonceEqualsParams = FunctionArguments<typeof functions.timestampBelowAndNonceEquals>
export type TimestampBelowAndNonceEqualsReturn = FunctionReturn<typeof functions.timestampBelowAndNonceEquals>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UniswapV3SwapParams = FunctionArguments<typeof functions.uniswapV3Swap>
export type UniswapV3SwapReturn = FunctionReturn<typeof functions.uniswapV3Swap>

export type UniswapV3SwapCallbackParams = FunctionArguments<typeof functions.uniswapV3SwapCallback>
export type UniswapV3SwapCallbackReturn = FunctionReturn<typeof functions.uniswapV3SwapCallback>

export type UniswapV3SwapToParams = FunctionArguments<typeof functions.uniswapV3SwapTo>
export type UniswapV3SwapToReturn = FunctionReturn<typeof functions.uniswapV3SwapTo>

export type UniswapV3SwapToWithPermitParams = FunctionArguments<typeof functions.uniswapV3SwapToWithPermit>
export type UniswapV3SwapToWithPermitReturn = FunctionReturn<typeof functions.uniswapV3SwapToWithPermit>

export type UnoswapParams = FunctionArguments<typeof functions.unoswap>
export type UnoswapReturn = FunctionReturn<typeof functions.unoswap>

export type UnoswapToParams = FunctionArguments<typeof functions.unoswapTo>
export type UnoswapToReturn = FunctionReturn<typeof functions.unoswapTo>

export type UnoswapToWithPermitParams = FunctionArguments<typeof functions.unoswapToWithPermit>
export type UnoswapToWithPermitReturn = FunctionReturn<typeof functions.unoswapToWithPermit>

