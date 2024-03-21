import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './ccip-evm2evmonramp.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AdminSet: new LogEvent<([newAdmin: string] & {newAdmin: string})>(
        abi, '0x8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c'
    ),
    CCIPSendRequested: new LogEvent<([message: ([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string})] & {message: ([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string})})>(
        abi, '0xd0c3c799bf9e2639de44391e7f524d229b2b55f5b1ea94b2bf7da42f7243dddd'
    ),
    ConfigSet: new LogEvent<([staticConfig: ([linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string] & {linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string}), dynamicConfig: ([router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number] & {router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number})] & {staticConfig: ([linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string] & {linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string}), dynamicConfig: ([router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number] & {router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number})})>(
        abi, '0x2a57f7c2027cf032c78b77d4d8d2fbd20ad22e5d5e5b5fb23ac7d7820d44adc6'
    ),
    FeeConfigSet: new LogEvent<([feeConfig: Array<([token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean] & {token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean})>] & {feeConfig: Array<([token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean] & {token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean})>})>(
        abi, '0x067924bf9277d905a9a4631a06d959bc032ace86b3caa835ae7e403d4f39010e'
    ),
    NopPaid: new LogEvent<([nop: string, amount: bigint] & {nop: string, amount: bigint})>(
        abi, '0x55fdec2aab60a41fa5abb106670eb1006f5aeaee1ba7afea2bc89b5b3ec7678f'
    ),
    NopsSet: new LogEvent<([nopWeightsTotal: bigint, nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>] & {nopWeightsTotal: bigint, nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>})>(
        abi, '0x8c337bff38141c507abd25c547606bdde78fe8c12e941ab613f3a565fea6cd24'
    ),
    OwnershipTransferRequested: new LogEvent<([from: string, to: string] & {from: string, to: string})>(
        abi, '0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278'
    ),
    OwnershipTransferred: new LogEvent<([from: string, to: string] & {from: string, to: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    PoolAdded: new LogEvent<([token: string, pool: string] & {token: string, pool: string})>(
        abi, '0x95f865c2808f8b2a85eea2611db7843150ee7835ef1403f9755918a97d76933c'
    ),
    PoolRemoved: new LogEvent<([token: string, pool: string] & {token: string, pool: string})>(
        abi, '0x987eb3c2f78454541205f72f34839b434c306c9eaf4922efd7c0c3060fdb2e4c'
    ),
    TokenTransferFeeConfigSet: new LogEvent<([transferFeeConfig: Array<([token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number] & {token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number})>] & {transferFeeConfig: Array<([token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number] & {token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number})>})>(
        abi, '0x555c74101f7a15746d31c6731170310e667bcc607996b2fc0b981a7b26a416e9'
    ),
}

export const functions = {
    acceptOwnership: new Func<[], {}, []>(
        abi, '0x79ba5097'
    ),
    applyPoolUpdates: new Func<[removes: Array<([token: string, pool: string] & {token: string, pool: string})>, adds: Array<([token: string, pool: string] & {token: string, pool: string})>], {removes: Array<([token: string, pool: string] & {token: string, pool: string})>, adds: Array<([token: string, pool: string] & {token: string, pool: string})>}, []>(
        abi, '0x3a87ac53'
    ),
    currentRateLimiterState: new Func<[], {}, ([tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint] & {tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint})>(
        abi, '0x546719cd'
    ),
    forwardFromRouter: new Func<[destChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string}), feeTokenAmount: bigint, originalSender: string], {destChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string}), feeTokenAmount: bigint, originalSender: string}, string>(
        abi, '0xdf0aa9e9'
    ),
    getDynamicConfig: new Func<[], {}, ([router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number] & {router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number})>(
        abi, '0x7437ff9f'
    ),
    getExpectedNextSequenceNumber: new Func<[], {}, bigint>(
        abi, '0x4120fccd'
    ),
    getFee: new Func<[destChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})], {destChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})}, bigint>(
        abi, '0x20487ded'
    ),
    getFeeTokenConfig: new Func<[token: string], {token: string}, ([networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean] & {networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean})>(
        abi, '0x9a113c36'
    ),
    getNopFeesJuels: new Func<[], {}, bigint>(
        abi, '0x54b71468'
    ),
    getNops: new Func<[], {}, ([nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>, weightsTotal: bigint] & {nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>, weightsTotal: bigint})>(
        abi, '0xb06d41bc'
    ),
    getPoolBySourceToken: new Func<[_: bigint, sourceToken: string], {sourceToken: string}, string>(
        abi, '0x48a98aa4'
    ),
    getSenderNonce: new Func<[sender: string], {sender: string}, bigint>(
        abi, '0x856c8247'
    ),
    getStaticConfig: new Func<[], {}, ([linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string] & {linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string})>(
        abi, '0x06285c69'
    ),
    getSupportedTokens: new Func<[_: bigint], {}, Array<string>>(
        abi, '0xfbca3b74'
    ),
    getTokenLimitAdmin: new Func<[], {}, string>(
        abi, '0x599f6431'
    ),
    getTokenTransferFeeConfig: new Func<[token: string], {token: string}, ([minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number] & {minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number})>(
        abi, '0x1772047e'
    ),
    linkAvailableForPayment: new Func<[], {}, bigint>(
        abi, '0xd09dc339'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    payNops: new Func<[], {}, []>(
        abi, '0xeff7cc48'
    ),
    setAdmin: new Func<[newAdmin: string], {newAdmin: string}, []>(
        abi, '0x704b6c02'
    ),
    setDynamicConfig: new Func<[dynamicConfig: ([router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number] & {router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number})], {dynamicConfig: ([router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number] & {router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number})}, []>(
        abi, '0xe687b40a'
    ),
    setFeeTokenConfig: new Func<[feeTokenConfigArgs: Array<([token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean] & {token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean})>], {feeTokenConfigArgs: Array<([token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean] & {token: string, networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean})>}, []>(
        abi, '0xf25561fd'
    ),
    setNops: new Func<[nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>], {nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>}, []>(
        abi, '0x76f6ae76'
    ),
    setRateLimiterConfig: new Func<[config: ([isEnabled: boolean, capacity: bigint, rate: bigint] & {isEnabled: boolean, capacity: bigint, rate: bigint})], {config: ([isEnabled: boolean, capacity: bigint, rate: bigint] & {isEnabled: boolean, capacity: bigint, rate: bigint})}, []>(
        abi, '0xc92b2832'
    ),
    setTokenTransferFeeConfig: new Func<[tokenTransferFeeConfigArgs: Array<([token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number] & {token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number})>], {tokenTransferFeeConfigArgs: Array<([token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number] & {token: string, minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number})>}, []>(
        abi, '0x7ec75751'
    ),
    transferOwnership: new Func<[to: string], {to: string}, []>(
        abi, '0xf2fde38b'
    ),
    typeAndVersion: new Func<[], {}, string>(
        abi, '0x181f5a77'
    ),
    withdrawNonLinkFees: new Func<[feeToken: string, to: string], {feeToken: string, to: string}, []>(
        abi, '0x549e946f'
    ),
}

export class Contract extends ContractBase {

    currentRateLimiterState(): Promise<([tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint] & {tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint})> {
        return this.eth_call(functions.currentRateLimiterState, [])
    }

    getDynamicConfig(): Promise<([router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number] & {router: string, maxNumberOfTokensPerMsg: number, destGasOverhead: number, destGasPerPayloadByte: number, destDataAvailabilityOverheadGas: number, destGasPerDataAvailabilityByte: number, destDataAvailabilityMultiplierBps: number, priceRegistry: string, maxDataBytes: number, maxPerMsgGasLimit: number})> {
        return this.eth_call(functions.getDynamicConfig, [])
    }

    getExpectedNextSequenceNumber(): Promise<bigint> {
        return this.eth_call(functions.getExpectedNextSequenceNumber, [])
    }

    getFee(destChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})): Promise<bigint> {
        return this.eth_call(functions.getFee, [destChainSelector, message])
    }

    getFeeTokenConfig(token: string): Promise<([networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean] & {networkFeeUSDCents: number, gasMultiplierWeiPerEth: bigint, premiumMultiplierWeiPerEth: bigint, enabled: boolean})> {
        return this.eth_call(functions.getFeeTokenConfig, [token])
    }

    getNopFeesJuels(): Promise<bigint> {
        return this.eth_call(functions.getNopFeesJuels, [])
    }

    getNops(): Promise<([nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>, weightsTotal: bigint] & {nopsAndWeights: Array<([nop: string, weight: number] & {nop: string, weight: number})>, weightsTotal: bigint})> {
        return this.eth_call(functions.getNops, [])
    }

    getPoolBySourceToken(arg0: bigint, sourceToken: string): Promise<string> {
        return this.eth_call(functions.getPoolBySourceToken, [arg0, sourceToken])
    }

    getSenderNonce(sender: string): Promise<bigint> {
        return this.eth_call(functions.getSenderNonce, [sender])
    }

    getStaticConfig(): Promise<([linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string] & {linkToken: string, chainSelector: bigint, destChainSelector: bigint, defaultTxGasLimit: bigint, maxNopFeesJuels: bigint, prevOnRamp: string, armProxy: string})> {
        return this.eth_call(functions.getStaticConfig, [])
    }

    getSupportedTokens(arg0: bigint): Promise<Array<string>> {
        return this.eth_call(functions.getSupportedTokens, [arg0])
    }

    getTokenLimitAdmin(): Promise<string> {
        return this.eth_call(functions.getTokenLimitAdmin, [])
    }

    getTokenTransferFeeConfig(token: string): Promise<([minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number] & {minFeeUSDCents: number, maxFeeUSDCents: number, deciBps: number, destGasOverhead: number, destBytesOverhead: number})> {
        return this.eth_call(functions.getTokenTransferFeeConfig, [token])
    }

    linkAvailableForPayment(): Promise<bigint> {
        return this.eth_call(functions.linkAvailableForPayment, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    typeAndVersion(): Promise<string> {
        return this.eth_call(functions.typeAndVersion, [])
    }
}
