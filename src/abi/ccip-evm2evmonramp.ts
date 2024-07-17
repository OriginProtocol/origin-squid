import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AdminSet: event("0x8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c", "AdminSet(address)", {"newAdmin": p.address}),
    CCIPSendRequested: event("0xd0c3c799bf9e2639de44391e7f524d229b2b55f5b1ea94b2bf7da42f7243dddd", "CCIPSendRequested((uint64,address,address,uint64,uint256,bool,uint64,address,uint256,bytes,(address,uint256)[],bytes[],bytes32))", {"message": p.struct({"sourceChainSelector": p.uint64, "sender": p.address, "receiver": p.address, "sequenceNumber": p.uint64, "gasLimit": p.uint256, "strict": p.bool, "nonce": p.uint64, "feeToken": p.address, "feeTokenAmount": p.uint256, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "sourceTokenData": p.array(p.bytes), "messageId": p.bytes32})}),
    ConfigSet: event("0x2a57f7c2027cf032c78b77d4d8d2fbd20ad22e5d5e5b5fb23ac7d7820d44adc6", "ConfigSet((address,uint64,uint64,uint64,uint96,address,address),(address,uint16,uint32,uint16,uint32,uint16,uint16,address,uint32,uint32))", {"staticConfig": p.struct({"linkToken": p.address, "chainSelector": p.uint64, "destChainSelector": p.uint64, "defaultTxGasLimit": p.uint64, "maxNopFeesJuels": p.uint96, "prevOnRamp": p.address, "armProxy": p.address}), "dynamicConfig": p.struct({"router": p.address, "maxNumberOfTokensPerMsg": p.uint16, "destGasOverhead": p.uint32, "destGasPerPayloadByte": p.uint16, "destDataAvailabilityOverheadGas": p.uint32, "destGasPerDataAvailabilityByte": p.uint16, "destDataAvailabilityMultiplierBps": p.uint16, "priceRegistry": p.address, "maxDataBytes": p.uint32, "maxPerMsgGasLimit": p.uint32})}),
    FeeConfigSet: event("0x067924bf9277d905a9a4631a06d959bc032ace86b3caa835ae7e403d4f39010e", "FeeConfigSet((address,uint32,uint64,uint64,bool)[])", {"feeConfig": p.array(p.struct({"token": p.address, "networkFeeUSDCents": p.uint32, "gasMultiplierWeiPerEth": p.uint64, "premiumMultiplierWeiPerEth": p.uint64, "enabled": p.bool}))}),
    NopPaid: event("0x55fdec2aab60a41fa5abb106670eb1006f5aeaee1ba7afea2bc89b5b3ec7678f", "NopPaid(address,uint256)", {"nop": indexed(p.address), "amount": p.uint256}),
    NopsSet: event("0x8c337bff38141c507abd25c547606bdde78fe8c12e941ab613f3a565fea6cd24", "NopsSet(uint256,(address,uint16)[])", {"nopWeightsTotal": p.uint256, "nopsAndWeights": p.array(p.struct({"nop": p.address, "weight": p.uint16}))}),
    OwnershipTransferRequested: event("0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278", "OwnershipTransferRequested(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    PoolAdded: event("0x95f865c2808f8b2a85eea2611db7843150ee7835ef1403f9755918a97d76933c", "PoolAdded(address,address)", {"token": p.address, "pool": p.address}),
    PoolRemoved: event("0x987eb3c2f78454541205f72f34839b434c306c9eaf4922efd7c0c3060fdb2e4c", "PoolRemoved(address,address)", {"token": p.address, "pool": p.address}),
    TokenTransferFeeConfigSet: event("0x555c74101f7a15746d31c6731170310e667bcc607996b2fc0b981a7b26a416e9", "TokenTransferFeeConfigSet((address,uint32,uint32,uint16,uint32,uint32)[])", {"transferFeeConfig": p.array(p.struct({"token": p.address, "minFeeUSDCents": p.uint32, "maxFeeUSDCents": p.uint32, "deciBps": p.uint16, "destGasOverhead": p.uint32, "destBytesOverhead": p.uint32}))}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    applyPoolUpdates: fun("0x3a87ac53", "applyPoolUpdates((address,address)[],(address,address)[])", {"removes": p.array(p.struct({"token": p.address, "pool": p.address})), "adds": p.array(p.struct({"token": p.address, "pool": p.address}))}, ),
    currentRateLimiterState: viewFun("0x546719cd", "currentRateLimiterState()", {}, p.struct({"tokens": p.uint128, "lastUpdated": p.uint32, "isEnabled": p.bool, "capacity": p.uint128, "rate": p.uint128})),
    forwardFromRouter: fun("0xdf0aa9e9", "forwardFromRouter(uint64,(bytes,bytes,(address,uint256)[],address,bytes),uint256,address)", {"destChainSelector": p.uint64, "message": p.struct({"receiver": p.bytes, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "feeToken": p.address, "extraArgs": p.bytes}), "feeTokenAmount": p.uint256, "originalSender": p.address}, p.bytes32),
    getDynamicConfig: viewFun("0x7437ff9f", "getDynamicConfig()", {}, p.struct({"router": p.address, "maxNumberOfTokensPerMsg": p.uint16, "destGasOverhead": p.uint32, "destGasPerPayloadByte": p.uint16, "destDataAvailabilityOverheadGas": p.uint32, "destGasPerDataAvailabilityByte": p.uint16, "destDataAvailabilityMultiplierBps": p.uint16, "priceRegistry": p.address, "maxDataBytes": p.uint32, "maxPerMsgGasLimit": p.uint32})),
    getExpectedNextSequenceNumber: viewFun("0x4120fccd", "getExpectedNextSequenceNumber()", {}, p.uint64),
    getFee: viewFun("0x20487ded", "getFee(uint64,(bytes,bytes,(address,uint256)[],address,bytes))", {"destChainSelector": p.uint64, "message": p.struct({"receiver": p.bytes, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "feeToken": p.address, "extraArgs": p.bytes})}, p.uint256),
    getFeeTokenConfig: viewFun("0x9a113c36", "getFeeTokenConfig(address)", {"token": p.address}, p.struct({"networkFeeUSDCents": p.uint32, "gasMultiplierWeiPerEth": p.uint64, "premiumMultiplierWeiPerEth": p.uint64, "enabled": p.bool})),
    getNopFeesJuels: viewFun("0x54b71468", "getNopFeesJuels()", {}, p.uint96),
    getNops: viewFun("0xb06d41bc", "getNops()", {}, {"nopsAndWeights": p.array(p.struct({"nop": p.address, "weight": p.uint16})), "weightsTotal": p.uint256}),
    getPoolBySourceToken: viewFun("0x48a98aa4", "getPoolBySourceToken(uint64,address)", {"_0": p.uint64, "sourceToken": p.address}, p.address),
    getSenderNonce: viewFun("0x856c8247", "getSenderNonce(address)", {"sender": p.address}, p.uint64),
    getStaticConfig: viewFun("0x06285c69", "getStaticConfig()", {}, p.struct({"linkToken": p.address, "chainSelector": p.uint64, "destChainSelector": p.uint64, "defaultTxGasLimit": p.uint64, "maxNopFeesJuels": p.uint96, "prevOnRamp": p.address, "armProxy": p.address})),
    getSupportedTokens: viewFun("0xfbca3b74", "getSupportedTokens(uint64)", {"_0": p.uint64}, p.array(p.address)),
    getTokenLimitAdmin: viewFun("0x599f6431", "getTokenLimitAdmin()", {}, p.address),
    getTokenTransferFeeConfig: viewFun("0x1772047e", "getTokenTransferFeeConfig(address)", {"token": p.address}, p.struct({"minFeeUSDCents": p.uint32, "maxFeeUSDCents": p.uint32, "deciBps": p.uint16, "destGasOverhead": p.uint32, "destBytesOverhead": p.uint32})),
    linkAvailableForPayment: viewFun("0xd09dc339", "linkAvailableForPayment()", {}, p.int256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    payNops: fun("0xeff7cc48", "payNops()", {}, ),
    setAdmin: fun("0x704b6c02", "setAdmin(address)", {"newAdmin": p.address}, ),
    setDynamicConfig: fun("0xe687b40a", "setDynamicConfig((address,uint16,uint32,uint16,uint32,uint16,uint16,address,uint32,uint32))", {"dynamicConfig": p.struct({"router": p.address, "maxNumberOfTokensPerMsg": p.uint16, "destGasOverhead": p.uint32, "destGasPerPayloadByte": p.uint16, "destDataAvailabilityOverheadGas": p.uint32, "destGasPerDataAvailabilityByte": p.uint16, "destDataAvailabilityMultiplierBps": p.uint16, "priceRegistry": p.address, "maxDataBytes": p.uint32, "maxPerMsgGasLimit": p.uint32})}, ),
    setFeeTokenConfig: fun("0xf25561fd", "setFeeTokenConfig((address,uint32,uint64,uint64,bool)[])", {"feeTokenConfigArgs": p.array(p.struct({"token": p.address, "networkFeeUSDCents": p.uint32, "gasMultiplierWeiPerEth": p.uint64, "premiumMultiplierWeiPerEth": p.uint64, "enabled": p.bool}))}, ),
    setNops: fun("0x76f6ae76", "setNops((address,uint16)[])", {"nopsAndWeights": p.array(p.struct({"nop": p.address, "weight": p.uint16}))}, ),
    setRateLimiterConfig: fun("0xc92b2832", "setRateLimiterConfig((bool,uint128,uint128))", {"config": p.struct({"isEnabled": p.bool, "capacity": p.uint128, "rate": p.uint128})}, ),
    setTokenTransferFeeConfig: fun("0x7ec75751", "setTokenTransferFeeConfig((address,uint32,uint32,uint16,uint32,uint32)[])", {"tokenTransferFeeConfigArgs": p.array(p.struct({"token": p.address, "minFeeUSDCents": p.uint32, "maxFeeUSDCents": p.uint32, "deciBps": p.uint16, "destGasOverhead": p.uint32, "destBytesOverhead": p.uint32}))}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"to": p.address}, ),
    typeAndVersion: viewFun("0x181f5a77", "typeAndVersion()", {}, p.string),
    withdrawNonLinkFees: fun("0x549e946f", "withdrawNonLinkFees(address,address)", {"feeToken": p.address, "to": p.address}, ),
}

export class Contract extends ContractBase {

    currentRateLimiterState() {
        return this.eth_call(functions.currentRateLimiterState, {})
    }

    getDynamicConfig() {
        return this.eth_call(functions.getDynamicConfig, {})
    }

    getExpectedNextSequenceNumber() {
        return this.eth_call(functions.getExpectedNextSequenceNumber, {})
    }

    getFee(destChainSelector: GetFeeParams["destChainSelector"], message: GetFeeParams["message"]) {
        return this.eth_call(functions.getFee, {destChainSelector, message})
    }

    getFeeTokenConfig(token: GetFeeTokenConfigParams["token"]) {
        return this.eth_call(functions.getFeeTokenConfig, {token})
    }

    getNopFeesJuels() {
        return this.eth_call(functions.getNopFeesJuels, {})
    }

    getNops() {
        return this.eth_call(functions.getNops, {})
    }

    getPoolBySourceToken(_0: GetPoolBySourceTokenParams["_0"], sourceToken: GetPoolBySourceTokenParams["sourceToken"]) {
        return this.eth_call(functions.getPoolBySourceToken, {_0, sourceToken})
    }

    getSenderNonce(sender: GetSenderNonceParams["sender"]) {
        return this.eth_call(functions.getSenderNonce, {sender})
    }

    getStaticConfig() {
        return this.eth_call(functions.getStaticConfig, {})
    }

    getSupportedTokens(_0: GetSupportedTokensParams["_0"]) {
        return this.eth_call(functions.getSupportedTokens, {_0})
    }

    getTokenLimitAdmin() {
        return this.eth_call(functions.getTokenLimitAdmin, {})
    }

    getTokenTransferFeeConfig(token: GetTokenTransferFeeConfigParams["token"]) {
        return this.eth_call(functions.getTokenTransferFeeConfig, {token})
    }

    linkAvailableForPayment() {
        return this.eth_call(functions.linkAvailableForPayment, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    typeAndVersion() {
        return this.eth_call(functions.typeAndVersion, {})
    }
}

/// Event types
export type AdminSetEventArgs = EParams<typeof events.AdminSet>
export type CCIPSendRequestedEventArgs = EParams<typeof events.CCIPSendRequested>
export type ConfigSetEventArgs = EParams<typeof events.ConfigSet>
export type FeeConfigSetEventArgs = EParams<typeof events.FeeConfigSet>
export type NopPaidEventArgs = EParams<typeof events.NopPaid>
export type NopsSetEventArgs = EParams<typeof events.NopsSet>
export type OwnershipTransferRequestedEventArgs = EParams<typeof events.OwnershipTransferRequested>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PoolAddedEventArgs = EParams<typeof events.PoolAdded>
export type PoolRemovedEventArgs = EParams<typeof events.PoolRemoved>
export type TokenTransferFeeConfigSetEventArgs = EParams<typeof events.TokenTransferFeeConfigSet>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type ApplyPoolUpdatesParams = FunctionArguments<typeof functions.applyPoolUpdates>
export type ApplyPoolUpdatesReturn = FunctionReturn<typeof functions.applyPoolUpdates>

export type CurrentRateLimiterStateParams = FunctionArguments<typeof functions.currentRateLimiterState>
export type CurrentRateLimiterStateReturn = FunctionReturn<typeof functions.currentRateLimiterState>

export type ForwardFromRouterParams = FunctionArguments<typeof functions.forwardFromRouter>
export type ForwardFromRouterReturn = FunctionReturn<typeof functions.forwardFromRouter>

export type GetDynamicConfigParams = FunctionArguments<typeof functions.getDynamicConfig>
export type GetDynamicConfigReturn = FunctionReturn<typeof functions.getDynamicConfig>

export type GetExpectedNextSequenceNumberParams = FunctionArguments<typeof functions.getExpectedNextSequenceNumber>
export type GetExpectedNextSequenceNumberReturn = FunctionReturn<typeof functions.getExpectedNextSequenceNumber>

export type GetFeeParams = FunctionArguments<typeof functions.getFee>
export type GetFeeReturn = FunctionReturn<typeof functions.getFee>

export type GetFeeTokenConfigParams = FunctionArguments<typeof functions.getFeeTokenConfig>
export type GetFeeTokenConfigReturn = FunctionReturn<typeof functions.getFeeTokenConfig>

export type GetNopFeesJuelsParams = FunctionArguments<typeof functions.getNopFeesJuels>
export type GetNopFeesJuelsReturn = FunctionReturn<typeof functions.getNopFeesJuels>

export type GetNopsParams = FunctionArguments<typeof functions.getNops>
export type GetNopsReturn = FunctionReturn<typeof functions.getNops>

export type GetPoolBySourceTokenParams = FunctionArguments<typeof functions.getPoolBySourceToken>
export type GetPoolBySourceTokenReturn = FunctionReturn<typeof functions.getPoolBySourceToken>

export type GetSenderNonceParams = FunctionArguments<typeof functions.getSenderNonce>
export type GetSenderNonceReturn = FunctionReturn<typeof functions.getSenderNonce>

export type GetStaticConfigParams = FunctionArguments<typeof functions.getStaticConfig>
export type GetStaticConfigReturn = FunctionReturn<typeof functions.getStaticConfig>

export type GetSupportedTokensParams = FunctionArguments<typeof functions.getSupportedTokens>
export type GetSupportedTokensReturn = FunctionReturn<typeof functions.getSupportedTokens>

export type GetTokenLimitAdminParams = FunctionArguments<typeof functions.getTokenLimitAdmin>
export type GetTokenLimitAdminReturn = FunctionReturn<typeof functions.getTokenLimitAdmin>

export type GetTokenTransferFeeConfigParams = FunctionArguments<typeof functions.getTokenTransferFeeConfig>
export type GetTokenTransferFeeConfigReturn = FunctionReturn<typeof functions.getTokenTransferFeeConfig>

export type LinkAvailableForPaymentParams = FunctionArguments<typeof functions.linkAvailableForPayment>
export type LinkAvailableForPaymentReturn = FunctionReturn<typeof functions.linkAvailableForPayment>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PayNopsParams = FunctionArguments<typeof functions.payNops>
export type PayNopsReturn = FunctionReturn<typeof functions.payNops>

export type SetAdminParams = FunctionArguments<typeof functions.setAdmin>
export type SetAdminReturn = FunctionReturn<typeof functions.setAdmin>

export type SetDynamicConfigParams = FunctionArguments<typeof functions.setDynamicConfig>
export type SetDynamicConfigReturn = FunctionReturn<typeof functions.setDynamicConfig>

export type SetFeeTokenConfigParams = FunctionArguments<typeof functions.setFeeTokenConfig>
export type SetFeeTokenConfigReturn = FunctionReturn<typeof functions.setFeeTokenConfig>

export type SetNopsParams = FunctionArguments<typeof functions.setNops>
export type SetNopsReturn = FunctionReturn<typeof functions.setNops>

export type SetRateLimiterConfigParams = FunctionArguments<typeof functions.setRateLimiterConfig>
export type SetRateLimiterConfigReturn = FunctionReturn<typeof functions.setRateLimiterConfig>

export type SetTokenTransferFeeConfigParams = FunctionArguments<typeof functions.setTokenTransferFeeConfig>
export type SetTokenTransferFeeConfigReturn = FunctionReturn<typeof functions.setTokenTransferFeeConfig>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TypeAndVersionParams = FunctionArguments<typeof functions.typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof functions.typeAndVersion>

export type WithdrawNonLinkFeesParams = FunctionArguments<typeof functions.withdrawNonLinkFees>
export type WithdrawNonLinkFeesReturn = FunctionReturn<typeof functions.withdrawNonLinkFees>

