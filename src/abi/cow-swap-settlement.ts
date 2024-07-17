import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Interaction: event("0xed99827efb37016f2275f98c4bcf71c7551c75d59e9b450f79fa32e60be672c2", "Interaction(address,uint256,bytes4)", {"target": indexed(p.address), "value": p.uint256, "selector": p.bytes4}),
    OrderInvalidated: event("0x875b6cb035bbd4ac6500fabc6d1e4ca5bdc58a3e2b424ccb5c24cdbebeb009a9", "OrderInvalidated(address,bytes)", {"owner": indexed(p.address), "orderUid": p.bytes}),
    PreSignature: event("0x01bf7c8b0ca55deecbea89d7e58295b7ffbf685fd0d96801034ba8c6ffe1c68d", "PreSignature(address,bytes,bool)", {"owner": indexed(p.address), "orderUid": p.bytes, "signed": p.bool}),
    Settlement: event("0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4", "Settlement(address)", {"solver": indexed(p.address)}),
    Trade: event("0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17", "Trade(address,address,address,uint256,uint256,uint256,bytes)", {"owner": indexed(p.address), "sellToken": p.address, "buyToken": p.address, "sellAmount": p.uint256, "buyAmount": p.uint256, "feeAmount": p.uint256, "orderUid": p.bytes}),
}

export const functions = {
    authenticator: viewFun("0x2335c76b", "authenticator()", {}, p.address),
    domainSeparator: viewFun("0xf698da25", "domainSeparator()", {}, p.bytes32),
    filledAmount: viewFun("0x2479fb6e", "filledAmount(bytes)", {"_0": p.bytes}, p.uint256),
    freeFilledAmountStorage: fun("0xed9f35ce", "freeFilledAmountStorage(bytes[])", {"orderUids": p.array(p.bytes)}, ),
    freePreSignatureStorage: fun("0xa2a7d51b", "freePreSignatureStorage(bytes[])", {"orderUids": p.array(p.bytes)}, ),
    getStorageAt: viewFun("0x5624b25b", "getStorageAt(uint256,uint256)", {"offset": p.uint256, "length": p.uint256}, p.bytes),
    invalidateOrder: fun("0x15337bc0", "invalidateOrder(bytes)", {"orderUid": p.bytes}, ),
    preSignature: viewFun("0xd08d33d1", "preSignature(bytes)", {"_0": p.bytes}, p.uint256),
    setPreSignature: fun("0xec6cb13f", "setPreSignature(bytes,bool)", {"orderUid": p.bytes, "signed": p.bool}, ),
    settle: fun("0x13d79a0b", "settle(address[],uint256[],(uint256,uint256,address,uint256,uint256,uint32,bytes32,uint256,uint256,uint256,bytes)[],(address,uint256,bytes)[][3])", {"tokens": p.array(p.address), "clearingPrices": p.array(p.uint256), "trades": p.array(p.struct({"sellTokenIndex": p.uint256, "buyTokenIndex": p.uint256, "receiver": p.address, "sellAmount": p.uint256, "buyAmount": p.uint256, "validTo": p.uint32, "appData": p.bytes32, "feeAmount": p.uint256, "flags": p.uint256, "executedAmount": p.uint256, "signature": p.bytes})), "interactions": p.fixedSizeArray(p.array(p.struct({"target": p.address, "value": p.uint256, "callData": p.bytes})), 3)}, ),
    simulateDelegatecall: fun("0xf84436bd", "simulateDelegatecall(address,bytes)", {"targetContract": p.address, "calldataPayload": p.bytes}, p.bytes),
    simulateDelegatecallInternal: fun("0x43218e19", "simulateDelegatecallInternal(address,bytes)", {"targetContract": p.address, "calldataPayload": p.bytes}, p.bytes),
    swap: fun("0x845a101f", "swap((bytes32,uint256,uint256,uint256,bytes)[],address[],(uint256,uint256,address,uint256,uint256,uint32,bytes32,uint256,uint256,uint256,bytes))", {"swaps": p.array(p.struct({"poolId": p.bytes32, "assetInIndex": p.uint256, "assetOutIndex": p.uint256, "amount": p.uint256, "userData": p.bytes})), "tokens": p.array(p.address), "trade": p.struct({"sellTokenIndex": p.uint256, "buyTokenIndex": p.uint256, "receiver": p.address, "sellAmount": p.uint256, "buyAmount": p.uint256, "validTo": p.uint32, "appData": p.bytes32, "feeAmount": p.uint256, "flags": p.uint256, "executedAmount": p.uint256, "signature": p.bytes})}, ),
    vault: viewFun("0xfbfa77cf", "vault()", {}, p.address),
    vaultRelayer: viewFun("0x9b552cc2", "vaultRelayer()", {}, p.address),
}

export class Contract extends ContractBase {

    authenticator() {
        return this.eth_call(functions.authenticator, {})
    }

    domainSeparator() {
        return this.eth_call(functions.domainSeparator, {})
    }

    filledAmount(_0: FilledAmountParams["_0"]) {
        return this.eth_call(functions.filledAmount, {_0})
    }

    getStorageAt(offset: GetStorageAtParams["offset"], length: GetStorageAtParams["length"]) {
        return this.eth_call(functions.getStorageAt, {offset, length})
    }

    preSignature(_0: PreSignatureParams["_0"]) {
        return this.eth_call(functions.preSignature, {_0})
    }

    vault() {
        return this.eth_call(functions.vault, {})
    }

    vaultRelayer() {
        return this.eth_call(functions.vaultRelayer, {})
    }
}

/// Event types
export type InteractionEventArgs = EParams<typeof events.Interaction>
export type OrderInvalidatedEventArgs = EParams<typeof events.OrderInvalidated>
export type PreSignatureEventArgs = EParams<typeof events.PreSignature>
export type SettlementEventArgs = EParams<typeof events.Settlement>
export type TradeEventArgs = EParams<typeof events.Trade>

/// Function types
export type AuthenticatorParams = FunctionArguments<typeof functions.authenticator>
export type AuthenticatorReturn = FunctionReturn<typeof functions.authenticator>

export type DomainSeparatorParams = FunctionArguments<typeof functions.domainSeparator>
export type DomainSeparatorReturn = FunctionReturn<typeof functions.domainSeparator>

export type FilledAmountParams = FunctionArguments<typeof functions.filledAmount>
export type FilledAmountReturn = FunctionReturn<typeof functions.filledAmount>

export type FreeFilledAmountStorageParams = FunctionArguments<typeof functions.freeFilledAmountStorage>
export type FreeFilledAmountStorageReturn = FunctionReturn<typeof functions.freeFilledAmountStorage>

export type FreePreSignatureStorageParams = FunctionArguments<typeof functions.freePreSignatureStorage>
export type FreePreSignatureStorageReturn = FunctionReturn<typeof functions.freePreSignatureStorage>

export type GetStorageAtParams = FunctionArguments<typeof functions.getStorageAt>
export type GetStorageAtReturn = FunctionReturn<typeof functions.getStorageAt>

export type InvalidateOrderParams = FunctionArguments<typeof functions.invalidateOrder>
export type InvalidateOrderReturn = FunctionReturn<typeof functions.invalidateOrder>

export type PreSignatureParams = FunctionArguments<typeof functions.preSignature>
export type PreSignatureReturn = FunctionReturn<typeof functions.preSignature>

export type SetPreSignatureParams = FunctionArguments<typeof functions.setPreSignature>
export type SetPreSignatureReturn = FunctionReturn<typeof functions.setPreSignature>

export type SettleParams = FunctionArguments<typeof functions.settle>
export type SettleReturn = FunctionReturn<typeof functions.settle>

export type SimulateDelegatecallParams = FunctionArguments<typeof functions.simulateDelegatecall>
export type SimulateDelegatecallReturn = FunctionReturn<typeof functions.simulateDelegatecall>

export type SimulateDelegatecallInternalParams = FunctionArguments<typeof functions.simulateDelegatecallInternal>
export type SimulateDelegatecallInternalReturn = FunctionReturn<typeof functions.simulateDelegatecallInternal>

export type SwapParams = FunctionArguments<typeof functions.swap>
export type SwapReturn = FunctionReturn<typeof functions.swap>

export type VaultParams = FunctionArguments<typeof functions.vault>
export type VaultReturn = FunctionReturn<typeof functions.vault>

export type VaultRelayerParams = FunctionArguments<typeof functions.vaultRelayer>
export type VaultRelayerReturn = FunctionReturn<typeof functions.vaultRelayer>

