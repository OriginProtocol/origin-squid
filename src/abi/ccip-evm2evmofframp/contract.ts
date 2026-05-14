import { ContractBase } from '../abi.support.js'
import { currentRateLimiterState, getDestinationToken, getDestinationTokens, getDynamicConfig, getExecutionState, getPoolByDestToken, getPoolBySourceToken, getSenderNonce, getStaticConfig, getSupportedTokens, getTokenLimitAdmin, getTransmitters, latestConfigDetails, latestConfigDigestAndEpoch, owner, typeAndVersion } from './functions.js'
import type { GetDestinationTokenParams, GetExecutionStateParams, GetPoolByDestTokenParams, GetPoolBySourceTokenParams, GetSenderNonceParams } from './functions.js'

export class Contract extends ContractBase {
    currentRateLimiterState() {
        return this.eth_call(currentRateLimiterState, {})
    }

    getDestinationToken(sourceToken: GetDestinationTokenParams["sourceToken"]) {
        return this.eth_call(getDestinationToken, {sourceToken})
    }

    getDestinationTokens() {
        return this.eth_call(getDestinationTokens, {})
    }

    getDynamicConfig() {
        return this.eth_call(getDynamicConfig, {})
    }

    getExecutionState(sequenceNumber: GetExecutionStateParams["sequenceNumber"]) {
        return this.eth_call(getExecutionState, {sequenceNumber})
    }

    getPoolByDestToken(destToken: GetPoolByDestTokenParams["destToken"]) {
        return this.eth_call(getPoolByDestToken, {destToken})
    }

    getPoolBySourceToken(sourceToken: GetPoolBySourceTokenParams["sourceToken"]) {
        return this.eth_call(getPoolBySourceToken, {sourceToken})
    }

    getSenderNonce(sender: GetSenderNonceParams["sender"]) {
        return this.eth_call(getSenderNonce, {sender})
    }

    getStaticConfig() {
        return this.eth_call(getStaticConfig, {})
    }

    getSupportedTokens() {
        return this.eth_call(getSupportedTokens, {})
    }

    getTokenLimitAdmin() {
        return this.eth_call(getTokenLimitAdmin, {})
    }

    getTransmitters() {
        return this.eth_call(getTransmitters, {})
    }

    latestConfigDetails() {
        return this.eth_call(latestConfigDetails, {})
    }

    latestConfigDigestAndEpoch() {
        return this.eth_call(latestConfigDigestAndEpoch, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    typeAndVersion() {
        return this.eth_call(typeAndVersion, {})
    }
}
