import { ContractBase } from '../abi.support.js'
import { MAX_RET_BYTES, ccipSend, getArmProxy, getFee, getOffRamps, getOnRamp, getSupportedTokens, getWrappedNative, isChainSupported, isOffRamp, owner, routeMessage, typeAndVersion } from './functions.js'
import type { CcipSendParams, GetFeeParams, GetOnRampParams, GetSupportedTokensParams, IsChainSupportedParams, IsOffRampParams, RouteMessageParams } from './functions.js'

export class Contract extends ContractBase {
    MAX_RET_BYTES() {
        return this.eth_call(MAX_RET_BYTES, {})
    }

    ccipSend(destinationChainSelector: CcipSendParams["destinationChainSelector"], message: CcipSendParams["message"]) {
        return this.eth_call(ccipSend, {destinationChainSelector, message})
    }

    getArmProxy() {
        return this.eth_call(getArmProxy, {})
    }

    getFee(destinationChainSelector: GetFeeParams["destinationChainSelector"], message: GetFeeParams["message"]) {
        return this.eth_call(getFee, {destinationChainSelector, message})
    }

    getOffRamps() {
        return this.eth_call(getOffRamps, {})
    }

    getOnRamp(destChainSelector: GetOnRampParams["destChainSelector"]) {
        return this.eth_call(getOnRamp, {destChainSelector})
    }

    getSupportedTokens(chainSelector: GetSupportedTokensParams["chainSelector"]) {
        return this.eth_call(getSupportedTokens, {chainSelector})
    }

    getWrappedNative() {
        return this.eth_call(getWrappedNative, {})
    }

    isChainSupported(chainSelector: IsChainSupportedParams["chainSelector"]) {
        return this.eth_call(isChainSupported, {chainSelector})
    }

    isOffRamp(sourceChainSelector: IsOffRampParams["sourceChainSelector"], offRamp: IsOffRampParams["offRamp"]) {
        return this.eth_call(isOffRamp, {sourceChainSelector, offRamp})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    routeMessage(message: RouteMessageParams["message"], gasForCallExactCheck: RouteMessageParams["gasForCallExactCheck"], gasLimit: RouteMessageParams["gasLimit"], receiver: RouteMessageParams["receiver"]) {
        return this.eth_call(routeMessage, {message, gasForCallExactCheck, gasLimit, receiver})
    }

    typeAndVersion() {
        return this.eth_call(typeAndVersion, {})
    }
}
