import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './ccip-evm2evmofframp.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AdminSet: new LogEvent<([newAdmin: string] & {newAdmin: string})>(
        abi, '0x8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c'
    ),
    'ConfigSet((address,uint64,uint64,address,address,address),(uint32,address,address,uint16,uint32,uint32))': new LogEvent<([staticConfig: ([commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string] & {commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string}), dynamicConfig: ([permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number] & {permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number})] & {staticConfig: ([commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string] & {commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string}), dynamicConfig: ([permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number] & {permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number})})>(
        abi, '0xe668e1a4644c1a030b909bbfd837f5cfa914994ed5e0bb2e9c34a5c37753128a'
    ),
    'ConfigSet(uint32,bytes32,uint64,address[],address[],uint8,bytes,uint64,bytes)': new LogEvent<([previousConfigBlockNumber: number, configDigest: string, configCount: bigint, signers: Array<string>, transmitters: Array<string>, f: number, onchainConfig: string, offchainConfigVersion: bigint, offchainConfig: string] & {previousConfigBlockNumber: number, configDigest: string, configCount: bigint, signers: Array<string>, transmitters: Array<string>, f: number, onchainConfig: string, offchainConfigVersion: bigint, offchainConfig: string})>(
        abi, '0x1591690b8638f5fb2dbec82ac741805ac5da8b45dc5263f4875b0496fdce4e05'
    ),
    ExecutionStateChanged: new LogEvent<([sequenceNumber: bigint, messageId: string, state: number, returnData: string] & {sequenceNumber: bigint, messageId: string, state: number, returnData: string})>(
        abi, '0xd4f851956a5d67c3997d1c9205045fef79bae2947fdee7e9e2641abc7391ef65'
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
    SkippedIncorrectNonce: new LogEvent<([nonce: bigint, sender: string] & {nonce: bigint, sender: string})>(
        abi, '0xd32ddb11d71e3d63411d37b09f9a8b28664f1cb1338bfd1413c173b0ebf41237'
    ),
    SkippedSenderWithPreviousRampMessageInflight: new LogEvent<([nonce: bigint, sender: string] & {nonce: bigint, sender: string})>(
        abi, '0xe44a20935573a783dd0d5991c92d7b6a0eb3173566530364db3ec10e9a990b5d'
    ),
    Transmitted: new LogEvent<([configDigest: string, epoch: number] & {configDigest: string, epoch: number})>(
        abi, '0xb04e63db38c49950639fa09d29872f21f5d49d614f3a969d8adf3d4b52e41a62'
    ),
}

export const functions = {
    acceptOwnership: new Func<[], {}, []>(
        abi, '0x79ba5097'
    ),
    applyPoolUpdates: new Func<[removes: Array<([token: string, pool: string] & {token: string, pool: string})>, adds: Array<([token: string, pool: string] & {token: string, pool: string})>], {removes: Array<([token: string, pool: string] & {token: string, pool: string})>, adds: Array<([token: string, pool: string] & {token: string, pool: string})>}, []>(
        abi, '0x3a87ac53'
    ),
    ccipReceive: new Func<[_: ([messageId: string, sourceChainSelector: bigint, sender: string, data: string, destTokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>] & {messageId: string, sourceChainSelector: bigint, sender: string, data: string, destTokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>})], {}, []>(
        abi, '0x85572ffb'
    ),
    currentRateLimiterState: new Func<[], {}, ([tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint] & {tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint})>(
        abi, '0x546719cd'
    ),
    executeSingleMessage: new Func<[message: ([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string}), offchainTokenData: Array<string>], {message: ([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string}), offchainTokenData: Array<string>}, []>(
        abi, '0xf52121a5'
    ),
    getDestinationToken: new Func<[sourceToken: string], {sourceToken: string}, string>(
        abi, '0xb4069b31'
    ),
    getDestinationTokens: new Func<[], {}, Array<string>>(
        abi, '0x681fba16'
    ),
    getDynamicConfig: new Func<[], {}, ([permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number] & {permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number})>(
        abi, '0x7437ff9f'
    ),
    getExecutionState: new Func<[sequenceNumber: bigint], {sequenceNumber: bigint}, number>(
        abi, '0x142a98fc'
    ),
    getPoolByDestToken: new Func<[destToken: string], {destToken: string}, string>(
        abi, '0xd7e2bb50'
    ),
    getPoolBySourceToken: new Func<[sourceToken: string], {sourceToken: string}, string>(
        abi, '0x5d86f141'
    ),
    getSenderNonce: new Func<[sender: string], {sender: string}, bigint>(
        abi, '0x856c8247'
    ),
    getStaticConfig: new Func<[], {}, ([commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string] & {commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string})>(
        abi, '0x06285c69'
    ),
    getSupportedTokens: new Func<[], {}, Array<string>>(
        abi, '0xd3c7c2c7'
    ),
    getTokenLimitAdmin: new Func<[], {}, string>(
        abi, '0x599f6431'
    ),
    getTransmitters: new Func<[], {}, Array<string>>(
        abi, '0x666cab8d'
    ),
    latestConfigDetails: new Func<[], {}, ([configCount: number, blockNumber: number, configDigest: string] & {configCount: number, blockNumber: number, configDigest: string})>(
        abi, '0x81ff7048'
    ),
    latestConfigDigestAndEpoch: new Func<[], {}, ([scanLogs: boolean, configDigest: string, epoch: number] & {scanLogs: boolean, configDigest: string, epoch: number})>(
        abi, '0xafcb95d7'
    ),
    manuallyExecute: new Func<[report: ([messages: Array<([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string})>, offchainTokenData: Array<Array<string>>, proofs: Array<string>, proofFlagBits: bigint] & {messages: Array<([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string})>, offchainTokenData: Array<Array<string>>, proofs: Array<string>, proofFlagBits: bigint}), gasLimitOverrides: Array<bigint>], {report: ([messages: Array<([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string})>, offchainTokenData: Array<Array<string>>, proofs: Array<string>, proofFlagBits: bigint] & {messages: Array<([sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string] & {sourceChainSelector: bigint, sender: string, receiver: string, sequenceNumber: bigint, gasLimit: bigint, strict: boolean, nonce: bigint, feeToken: string, feeTokenAmount: bigint, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, sourceTokenData: Array<string>, messageId: string})>, offchainTokenData: Array<Array<string>>, proofs: Array<string>, proofFlagBits: bigint}), gasLimitOverrides: Array<bigint>}, []>(
        abi, '0x740f4150'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    setAdmin: new Func<[newAdmin: string], {newAdmin: string}, []>(
        abi, '0x704b6c02'
    ),
    setOCR2Config: new Func<[signers: Array<string>, transmitters: Array<string>, f: number, onchainConfig: string, offchainConfigVersion: bigint, offchainConfig: string], {signers: Array<string>, transmitters: Array<string>, f: number, onchainConfig: string, offchainConfigVersion: bigint, offchainConfig: string}, []>(
        abi, '0x1ef38174'
    ),
    setRateLimiterConfig: new Func<[config: ([isEnabled: boolean, capacity: bigint, rate: bigint] & {isEnabled: boolean, capacity: bigint, rate: bigint})], {config: ([isEnabled: boolean, capacity: bigint, rate: bigint] & {isEnabled: boolean, capacity: bigint, rate: bigint})}, []>(
        abi, '0xc92b2832'
    ),
    transferOwnership: new Func<[to: string], {to: string}, []>(
        abi, '0xf2fde38b'
    ),
    transmit: new Func<[reportContext: Array<string>, report: string, rs: Array<string>, ss: Array<string>, _: string], {reportContext: Array<string>, report: string, rs: Array<string>, ss: Array<string>}, []>(
        abi, '0xb1dc65a4'
    ),
    typeAndVersion: new Func<[], {}, string>(
        abi, '0x181f5a77'
    ),
}

export class Contract extends ContractBase {

    currentRateLimiterState(): Promise<([tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint] & {tokens: bigint, lastUpdated: number, isEnabled: boolean, capacity: bigint, rate: bigint})> {
        return this.eth_call(functions.currentRateLimiterState, [])
    }

    getDestinationToken(sourceToken: string): Promise<string> {
        return this.eth_call(functions.getDestinationToken, [sourceToken])
    }

    getDestinationTokens(): Promise<Array<string>> {
        return this.eth_call(functions.getDestinationTokens, [])
    }

    getDynamicConfig(): Promise<([permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number] & {permissionLessExecutionThresholdSeconds: number, router: string, priceRegistry: string, maxNumberOfTokensPerMsg: number, maxDataBytes: number, maxPoolReleaseOrMintGas: number})> {
        return this.eth_call(functions.getDynamicConfig, [])
    }

    getExecutionState(sequenceNumber: bigint): Promise<number> {
        return this.eth_call(functions.getExecutionState, [sequenceNumber])
    }

    getPoolByDestToken(destToken: string): Promise<string> {
        return this.eth_call(functions.getPoolByDestToken, [destToken])
    }

    getPoolBySourceToken(sourceToken: string): Promise<string> {
        return this.eth_call(functions.getPoolBySourceToken, [sourceToken])
    }

    getSenderNonce(sender: string): Promise<bigint> {
        return this.eth_call(functions.getSenderNonce, [sender])
    }

    getStaticConfig(): Promise<([commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string] & {commitStore: string, chainSelector: bigint, sourceChainSelector: bigint, onRamp: string, prevOffRamp: string, armProxy: string})> {
        return this.eth_call(functions.getStaticConfig, [])
    }

    getSupportedTokens(): Promise<Array<string>> {
        return this.eth_call(functions.getSupportedTokens, [])
    }

    getTokenLimitAdmin(): Promise<string> {
        return this.eth_call(functions.getTokenLimitAdmin, [])
    }

    getTransmitters(): Promise<Array<string>> {
        return this.eth_call(functions.getTransmitters, [])
    }

    latestConfigDetails(): Promise<([configCount: number, blockNumber: number, configDigest: string] & {configCount: number, blockNumber: number, configDigest: string})> {
        return this.eth_call(functions.latestConfigDetails, [])
    }

    latestConfigDigestAndEpoch(): Promise<([scanLogs: boolean, configDigest: string, epoch: number] & {scanLogs: boolean, configDigest: string, epoch: number})> {
        return this.eth_call(functions.latestConfigDigestAndEpoch, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    typeAndVersion(): Promise<string> {
        return this.eth_call(functions.typeAndVersion, [])
    }
}
