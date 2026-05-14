import { address, array, bool, bytes, bytes32, string, struct, uint16, uint256, uint64 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** MAX_RET_BYTES() */
export const MAX_RET_BYTES = func('0x787350e3', {}, uint16)
export type MAX_RET_BYTESParams = FunctionArguments<typeof MAX_RET_BYTES>
export type MAX_RET_BYTESReturn = FunctionReturn<typeof MAX_RET_BYTES>

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** applyRampUpdates((uint64,address)[],(uint64,address)[],(uint64,address)[]) */
export const applyRampUpdates = func('0xda5fcac8', {
    onRampUpdates: array(struct({
        destChainSelector: uint64,
        onRamp: address,
    })),
    offRampRemoves: array(struct({
        sourceChainSelector: uint64,
        offRamp: address,
    })),
    offRampAdds: array(struct({
        sourceChainSelector: uint64,
        offRamp: address,
    })),
})
export type ApplyRampUpdatesParams = FunctionArguments<typeof applyRampUpdates>
export type ApplyRampUpdatesReturn = FunctionReturn<typeof applyRampUpdates>

/** ccipSend(uint64,(bytes,bytes,(address,uint256)[],address,bytes)) */
export const ccipSend = func('0x96f4e9f9', {
    destinationChainSelector: uint64,
    message: struct({
        receiver: bytes,
        data: bytes,
        tokenAmounts: array(struct({
            token: address,
            amount: uint256,
        })),
        feeToken: address,
        extraArgs: bytes,
    }),
}, bytes32)
export type CcipSendParams = FunctionArguments<typeof ccipSend>
export type CcipSendReturn = FunctionReturn<typeof ccipSend>

/** getArmProxy() */
export const getArmProxy = func('0x5246492f', {}, address)
export type GetArmProxyParams = FunctionArguments<typeof getArmProxy>
export type GetArmProxyReturn = FunctionReturn<typeof getArmProxy>

/** getFee(uint64,(bytes,bytes,(address,uint256)[],address,bytes)) */
export const getFee = func('0x20487ded', {
    destinationChainSelector: uint64,
    message: struct({
        receiver: bytes,
        data: bytes,
        tokenAmounts: array(struct({
            token: address,
            amount: uint256,
        })),
        feeToken: address,
        extraArgs: bytes,
    }),
}, uint256)
export type GetFeeParams = FunctionArguments<typeof getFee>
export type GetFeeReturn = FunctionReturn<typeof getFee>

/** getOffRamps() */
export const getOffRamps = func('0xa40e69c7', {}, array(struct({
    sourceChainSelector: uint64,
    offRamp: address,
})))
export type GetOffRampsParams = FunctionArguments<typeof getOffRamps>
export type GetOffRampsReturn = FunctionReturn<typeof getOffRamps>

/** getOnRamp(uint64) */
export const getOnRamp = func('0xa8d87a3b', {
    destChainSelector: uint64,
}, address)
export type GetOnRampParams = FunctionArguments<typeof getOnRamp>
export type GetOnRampReturn = FunctionReturn<typeof getOnRamp>

/** getSupportedTokens(uint64) */
export const getSupportedTokens = func('0xfbca3b74', {
    chainSelector: uint64,
}, array(address))
export type GetSupportedTokensParams = FunctionArguments<typeof getSupportedTokens>
export type GetSupportedTokensReturn = FunctionReturn<typeof getSupportedTokens>

/** getWrappedNative() */
export const getWrappedNative = func('0xe861e907', {}, address)
export type GetWrappedNativeParams = FunctionArguments<typeof getWrappedNative>
export type GetWrappedNativeReturn = FunctionReturn<typeof getWrappedNative>

/** isChainSupported(uint64) */
export const isChainSupported = func('0xa48a9058', {
    chainSelector: uint64,
}, bool)
export type IsChainSupportedParams = FunctionArguments<typeof isChainSupported>
export type IsChainSupportedReturn = FunctionReturn<typeof isChainSupported>

/** isOffRamp(uint64,address) */
export const isOffRamp = func('0x83826b2b', {
    sourceChainSelector: uint64,
    offRamp: address,
}, bool)
export type IsOffRampParams = FunctionArguments<typeof isOffRamp>
export type IsOffRampReturn = FunctionReturn<typeof isOffRamp>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** recoverTokens(address,address,uint256) */
export const recoverTokens = func('0x5f3e849f', {
    tokenAddress: address,
    to: address,
    amount: uint256,
})
export type RecoverTokensParams = FunctionArguments<typeof recoverTokens>
export type RecoverTokensReturn = FunctionReturn<typeof recoverTokens>

/** routeMessage((bytes32,uint64,bytes,bytes,(address,uint256)[]),uint16,uint256,address) */
export const routeMessage = func('0x3cf97983', {
    message: struct({
        messageId: bytes32,
        sourceChainSelector: uint64,
        sender: bytes,
        data: bytes,
        destTokenAmounts: array(struct({
            token: address,
            amount: uint256,
        })),
    }),
    gasForCallExactCheck: uint16,
    gasLimit: uint256,
    receiver: address,
}, struct({
    success: bool,
    retData: bytes,
    gasUsed: uint256,
}))
export type RouteMessageParams = FunctionArguments<typeof routeMessage>
export type RouteMessageReturn = FunctionReturn<typeof routeMessage>

/** setWrappedNative(address) */
export const setWrappedNative = func('0x52cb60ca', {
    wrappedNative: address,
})
export type SetWrappedNativeParams = FunctionArguments<typeof setWrappedNative>
export type SetWrappedNativeReturn = FunctionReturn<typeof setWrappedNative>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    to: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** typeAndVersion() */
export const typeAndVersion = func('0x181f5a77', {}, string)
export type TypeAndVersionParams = FunctionArguments<typeof typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof typeAndVersion>
