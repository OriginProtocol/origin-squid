import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    MessageExecuted: event("0x9b877de93ea9895756e337442c657f95a34fc68e7eb988bdfa693d5be83016b6", "MessageExecuted(bytes32,uint64,address,bytes32)", {"messageId": p.bytes32, "sourceChainSelector": p.uint64, "offRamp": p.address, "calldataHash": p.bytes32}),
    OffRampAdded: event("0xa4bdf64ebdf3316320601a081916a75aa144bcef6c4beeb0e9fb1982cacc6b94", "OffRampAdded(uint64,address)", {"sourceChainSelector": indexed(p.uint64), "offRamp": p.address}),
    OffRampRemoved: event("0xa823809efda3ba66c873364eec120fa0923d9fabda73bc97dd5663341e2d9bcb", "OffRampRemoved(uint64,address)", {"sourceChainSelector": indexed(p.uint64), "offRamp": p.address}),
    OnRampSet: event("0x1f7d0ec248b80e5c0dde0ee531c4fc8fdb6ce9a2b3d90f560c74acd6a7202f23", "OnRampSet(uint64,address)", {"destChainSelector": indexed(p.uint64), "onRamp": p.address}),
    OwnershipTransferRequested: event("0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278", "OwnershipTransferRequested(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
}

export const functions = {
    MAX_RET_BYTES: viewFun("0x787350e3", "MAX_RET_BYTES()", {}, p.uint16),
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    applyRampUpdates: fun("0xda5fcac8", "applyRampUpdates((uint64,address)[],(uint64,address)[],(uint64,address)[])", {"onRampUpdates": p.array(p.struct({"destChainSelector": p.uint64, "onRamp": p.address})), "offRampRemoves": p.array(p.struct({"sourceChainSelector": p.uint64, "offRamp": p.address})), "offRampAdds": p.array(p.struct({"sourceChainSelector": p.uint64, "offRamp": p.address}))}, ),
    ccipSend: fun("0x96f4e9f9", "ccipSend(uint64,(bytes,bytes,(address,uint256)[],address,bytes))", {"destinationChainSelector": p.uint64, "message": p.struct({"receiver": p.bytes, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "feeToken": p.address, "extraArgs": p.bytes})}, p.bytes32),
    getArmProxy: viewFun("0x5246492f", "getArmProxy()", {}, p.address),
    getFee: viewFun("0x20487ded", "getFee(uint64,(bytes,bytes,(address,uint256)[],address,bytes))", {"destinationChainSelector": p.uint64, "message": p.struct({"receiver": p.bytes, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "feeToken": p.address, "extraArgs": p.bytes})}, p.uint256),
    getOffRamps: viewFun("0xa40e69c7", "getOffRamps()", {}, p.array(p.struct({"sourceChainSelector": p.uint64, "offRamp": p.address}))),
    getOnRamp: viewFun("0xa8d87a3b", "getOnRamp(uint64)", {"destChainSelector": p.uint64}, p.address),
    getSupportedTokens: viewFun("0xfbca3b74", "getSupportedTokens(uint64)", {"chainSelector": p.uint64}, p.array(p.address)),
    getWrappedNative: viewFun("0xe861e907", "getWrappedNative()", {}, p.address),
    isChainSupported: viewFun("0xa48a9058", "isChainSupported(uint64)", {"chainSelector": p.uint64}, p.bool),
    isOffRamp: viewFun("0x83826b2b", "isOffRamp(uint64,address)", {"sourceChainSelector": p.uint64, "offRamp": p.address}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    recoverTokens: fun("0x5f3e849f", "recoverTokens(address,address,uint256)", {"tokenAddress": p.address, "to": p.address, "amount": p.uint256}, ),
    routeMessage: fun("0x3cf97983", "routeMessage((bytes32,uint64,bytes,bytes,(address,uint256)[]),uint16,uint256,address)", {"message": p.struct({"messageId": p.bytes32, "sourceChainSelector": p.uint64, "sender": p.bytes, "data": p.bytes, "destTokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256}))}), "gasForCallExactCheck": p.uint16, "gasLimit": p.uint256, "receiver": p.address}, {"success": p.bool, "retData": p.bytes, "gasUsed": p.uint256}),
    setWrappedNative: fun("0x52cb60ca", "setWrappedNative(address)", {"wrappedNative": p.address}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"to": p.address}, ),
    typeAndVersion: viewFun("0x181f5a77", "typeAndVersion()", {}, p.string),
}

export class Contract extends ContractBase {

    MAX_RET_BYTES() {
        return this.eth_call(functions.MAX_RET_BYTES, {})
    }

    getArmProxy() {
        return this.eth_call(functions.getArmProxy, {})
    }

    getFee(destinationChainSelector: GetFeeParams["destinationChainSelector"], message: GetFeeParams["message"]) {
        return this.eth_call(functions.getFee, {destinationChainSelector, message})
    }

    getOffRamps() {
        return this.eth_call(functions.getOffRamps, {})
    }

    getOnRamp(destChainSelector: GetOnRampParams["destChainSelector"]) {
        return this.eth_call(functions.getOnRamp, {destChainSelector})
    }

    getSupportedTokens(chainSelector: GetSupportedTokensParams["chainSelector"]) {
        return this.eth_call(functions.getSupportedTokens, {chainSelector})
    }

    getWrappedNative() {
        return this.eth_call(functions.getWrappedNative, {})
    }

    isChainSupported(chainSelector: IsChainSupportedParams["chainSelector"]) {
        return this.eth_call(functions.isChainSupported, {chainSelector})
    }

    isOffRamp(sourceChainSelector: IsOffRampParams["sourceChainSelector"], offRamp: IsOffRampParams["offRamp"]) {
        return this.eth_call(functions.isOffRamp, {sourceChainSelector, offRamp})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    typeAndVersion() {
        return this.eth_call(functions.typeAndVersion, {})
    }
}

/// Event types
export type MessageExecutedEventArgs = EParams<typeof events.MessageExecuted>
export type OffRampAddedEventArgs = EParams<typeof events.OffRampAdded>
export type OffRampRemovedEventArgs = EParams<typeof events.OffRampRemoved>
export type OnRampSetEventArgs = EParams<typeof events.OnRampSet>
export type OwnershipTransferRequestedEventArgs = EParams<typeof events.OwnershipTransferRequested>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type MAX_RET_BYTESParams = FunctionArguments<typeof functions.MAX_RET_BYTES>
export type MAX_RET_BYTESReturn = FunctionReturn<typeof functions.MAX_RET_BYTES>

export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type ApplyRampUpdatesParams = FunctionArguments<typeof functions.applyRampUpdates>
export type ApplyRampUpdatesReturn = FunctionReturn<typeof functions.applyRampUpdates>

export type CcipSendParams = FunctionArguments<typeof functions.ccipSend>
export type CcipSendReturn = FunctionReturn<typeof functions.ccipSend>

export type GetArmProxyParams = FunctionArguments<typeof functions.getArmProxy>
export type GetArmProxyReturn = FunctionReturn<typeof functions.getArmProxy>

export type GetFeeParams = FunctionArguments<typeof functions.getFee>
export type GetFeeReturn = FunctionReturn<typeof functions.getFee>

export type GetOffRampsParams = FunctionArguments<typeof functions.getOffRamps>
export type GetOffRampsReturn = FunctionReturn<typeof functions.getOffRamps>

export type GetOnRampParams = FunctionArguments<typeof functions.getOnRamp>
export type GetOnRampReturn = FunctionReturn<typeof functions.getOnRamp>

export type GetSupportedTokensParams = FunctionArguments<typeof functions.getSupportedTokens>
export type GetSupportedTokensReturn = FunctionReturn<typeof functions.getSupportedTokens>

export type GetWrappedNativeParams = FunctionArguments<typeof functions.getWrappedNative>
export type GetWrappedNativeReturn = FunctionReturn<typeof functions.getWrappedNative>

export type IsChainSupportedParams = FunctionArguments<typeof functions.isChainSupported>
export type IsChainSupportedReturn = FunctionReturn<typeof functions.isChainSupported>

export type IsOffRampParams = FunctionArguments<typeof functions.isOffRamp>
export type IsOffRampReturn = FunctionReturn<typeof functions.isOffRamp>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RecoverTokensParams = FunctionArguments<typeof functions.recoverTokens>
export type RecoverTokensReturn = FunctionReturn<typeof functions.recoverTokens>

export type RouteMessageParams = FunctionArguments<typeof functions.routeMessage>
export type RouteMessageReturn = FunctionReturn<typeof functions.routeMessage>

export type SetWrappedNativeParams = FunctionArguments<typeof functions.setWrappedNative>
export type SetWrappedNativeReturn = FunctionReturn<typeof functions.setWrappedNative>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TypeAndVersionParams = FunctionArguments<typeof functions.typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof functions.typeAndVersion>

