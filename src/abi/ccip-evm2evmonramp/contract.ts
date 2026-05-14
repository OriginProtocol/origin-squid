import { ContractBase } from '../abi.support.js'
import { currentRateLimiterState, forwardFromRouter, getDynamicConfig, getExpectedNextSequenceNumber, getFee, getFeeTokenConfig, getNopFeesJuels, getNops, getPoolBySourceToken, getSenderNonce, getStaticConfig, getSupportedTokens, getTokenLimitAdmin, getTokenTransferFeeConfig, linkAvailableForPayment, owner, typeAndVersion } from './functions.js'
import type { ForwardFromRouterParams, GetFeeParams, GetFeeTokenConfigParams, GetPoolBySourceTokenParams, GetSenderNonceParams, GetSupportedTokensParams, GetTokenTransferFeeConfigParams } from './functions.js'

export class Contract extends ContractBase {
    currentRateLimiterState() {
        return this.eth_call(currentRateLimiterState, {})
    }

    forwardFromRouter(destChainSelector: ForwardFromRouterParams["destChainSelector"], message: ForwardFromRouterParams["message"], feeTokenAmount: ForwardFromRouterParams["feeTokenAmount"], originalSender: ForwardFromRouterParams["originalSender"]) {
        return this.eth_call(forwardFromRouter, {destChainSelector, message, feeTokenAmount, originalSender})
    }

    getDynamicConfig() {
        return this.eth_call(getDynamicConfig, {})
    }

    getExpectedNextSequenceNumber() {
        return this.eth_call(getExpectedNextSequenceNumber, {})
    }

    getFee(destChainSelector: GetFeeParams["destChainSelector"], message: GetFeeParams["message"]) {
        return this.eth_call(getFee, {destChainSelector, message})
    }

    getFeeTokenConfig(token: GetFeeTokenConfigParams["token"]) {
        return this.eth_call(getFeeTokenConfig, {token})
    }

    getNopFeesJuels() {
        return this.eth_call(getNopFeesJuels, {})
    }

    getNops() {
        return this.eth_call(getNops, {})
    }

    getPoolBySourceToken(_0: GetPoolBySourceTokenParams["_0"], sourceToken: GetPoolBySourceTokenParams["sourceToken"]) {
        return this.eth_call(getPoolBySourceToken, {_0, sourceToken})
    }

    getSenderNonce(sender: GetSenderNonceParams["sender"]) {
        return this.eth_call(getSenderNonce, {sender})
    }

    getStaticConfig() {
        return this.eth_call(getStaticConfig, {})
    }

    getSupportedTokens(_0: GetSupportedTokensParams["_0"]) {
        return this.eth_call(getSupportedTokens, {_0})
    }

    getTokenLimitAdmin() {
        return this.eth_call(getTokenLimitAdmin, {})
    }

    getTokenTransferFeeConfig(token: GetTokenTransferFeeConfigParams["token"]) {
        return this.eth_call(getTokenTransferFeeConfig, {token})
    }

    linkAvailableForPayment() {
        return this.eth_call(linkAvailableForPayment, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    typeAndVersion() {
        return this.eth_call(typeAndVersion, {})
    }
}
