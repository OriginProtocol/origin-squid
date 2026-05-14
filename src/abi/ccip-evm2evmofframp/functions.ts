import { address, array, bool, bytes, bytes32, fixedSizeArray, string, struct, uint128, uint16, uint256, uint32, uint64, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** applyPoolUpdates((address,address)[],(address,address)[]) */
export const applyPoolUpdates = func('0x3a87ac53', {
    removes: array(struct({
        token: address,
        pool: address,
    })),
    adds: array(struct({
        token: address,
        pool: address,
    })),
})
export type ApplyPoolUpdatesParams = FunctionArguments<typeof applyPoolUpdates>
export type ApplyPoolUpdatesReturn = FunctionReturn<typeof applyPoolUpdates>

/** ccipReceive((bytes32,uint64,bytes,bytes,(address,uint256)[])) */
export const ccipReceive = func('0x85572ffb', {
    _0: struct({
        messageId: bytes32,
        sourceChainSelector: uint64,
        sender: bytes,
        data: bytes,
        destTokenAmounts: array(struct({
            token: address,
            amount: uint256,
        })),
    }),
})
export type CcipReceiveParams = FunctionArguments<typeof ccipReceive>
export type CcipReceiveReturn = FunctionReturn<typeof ccipReceive>

/** currentRateLimiterState() */
export const currentRateLimiterState = func('0x546719cd', {}, struct({
    tokens: uint128,
    lastUpdated: uint32,
    isEnabled: bool,
    capacity: uint128,
    rate: uint128,
}))
export type CurrentRateLimiterStateParams = FunctionArguments<typeof currentRateLimiterState>
export type CurrentRateLimiterStateReturn = FunctionReturn<typeof currentRateLimiterState>

/** executeSingleMessage((uint64,address,address,uint64,uint256,bool,uint64,address,uint256,bytes,(address,uint256)[],bytes[],bytes32),bytes[]) */
export const executeSingleMessage = func('0xf52121a5', {
    message: struct({
        sourceChainSelector: uint64,
        sender: address,
        receiver: address,
        sequenceNumber: uint64,
        gasLimit: uint256,
        strict: bool,
        nonce: uint64,
        feeToken: address,
        feeTokenAmount: uint256,
        data: bytes,
        tokenAmounts: array(struct({
            token: address,
            amount: uint256,
        })),
        sourceTokenData: array(bytes),
        messageId: bytes32,
    }),
    offchainTokenData: array(bytes),
})
export type ExecuteSingleMessageParams = FunctionArguments<typeof executeSingleMessage>
export type ExecuteSingleMessageReturn = FunctionReturn<typeof executeSingleMessage>

/** getDestinationToken(address) */
export const getDestinationToken = func('0xb4069b31', {
    sourceToken: address,
}, address)
export type GetDestinationTokenParams = FunctionArguments<typeof getDestinationToken>
export type GetDestinationTokenReturn = FunctionReturn<typeof getDestinationToken>

/** getDestinationTokens() */
export const getDestinationTokens = func('0x681fba16', {}, array(address))
export type GetDestinationTokensParams = FunctionArguments<typeof getDestinationTokens>
export type GetDestinationTokensReturn = FunctionReturn<typeof getDestinationTokens>

/** getDynamicConfig() */
export const getDynamicConfig = func('0x7437ff9f', {}, struct({
    permissionLessExecutionThresholdSeconds: uint32,
    router: address,
    priceRegistry: address,
    maxNumberOfTokensPerMsg: uint16,
    maxDataBytes: uint32,
    maxPoolReleaseOrMintGas: uint32,
}))
export type GetDynamicConfigParams = FunctionArguments<typeof getDynamicConfig>
export type GetDynamicConfigReturn = FunctionReturn<typeof getDynamicConfig>

/** getExecutionState(uint64) */
export const getExecutionState = func('0x142a98fc', {
    sequenceNumber: uint64,
}, uint8)
export type GetExecutionStateParams = FunctionArguments<typeof getExecutionState>
export type GetExecutionStateReturn = FunctionReturn<typeof getExecutionState>

/** getPoolByDestToken(address) */
export const getPoolByDestToken = func('0xd7e2bb50', {
    destToken: address,
}, address)
export type GetPoolByDestTokenParams = FunctionArguments<typeof getPoolByDestToken>
export type GetPoolByDestTokenReturn = FunctionReturn<typeof getPoolByDestToken>

/** getPoolBySourceToken(address) */
export const getPoolBySourceToken = func('0x5d86f141', {
    sourceToken: address,
}, address)
export type GetPoolBySourceTokenParams = FunctionArguments<typeof getPoolBySourceToken>
export type GetPoolBySourceTokenReturn = FunctionReturn<typeof getPoolBySourceToken>

/** getSenderNonce(address) */
export const getSenderNonce = func('0x856c8247', {
    sender: address,
}, uint64)
export type GetSenderNonceParams = FunctionArguments<typeof getSenderNonce>
export type GetSenderNonceReturn = FunctionReturn<typeof getSenderNonce>

/** getStaticConfig() */
export const getStaticConfig = func('0x06285c69', {}, struct({
    commitStore: address,
    chainSelector: uint64,
    sourceChainSelector: uint64,
    onRamp: address,
    prevOffRamp: address,
    armProxy: address,
}))
export type GetStaticConfigParams = FunctionArguments<typeof getStaticConfig>
export type GetStaticConfigReturn = FunctionReturn<typeof getStaticConfig>

/** getSupportedTokens() */
export const getSupportedTokens = func('0xd3c7c2c7', {}, array(address))
export type GetSupportedTokensParams = FunctionArguments<typeof getSupportedTokens>
export type GetSupportedTokensReturn = FunctionReturn<typeof getSupportedTokens>

/** getTokenLimitAdmin() */
export const getTokenLimitAdmin = func('0x599f6431', {}, address)
export type GetTokenLimitAdminParams = FunctionArguments<typeof getTokenLimitAdmin>
export type GetTokenLimitAdminReturn = FunctionReturn<typeof getTokenLimitAdmin>

/** getTransmitters() */
export const getTransmitters = func('0x666cab8d', {}, array(address))
export type GetTransmittersParams = FunctionArguments<typeof getTransmitters>
export type GetTransmittersReturn = FunctionReturn<typeof getTransmitters>

/** latestConfigDetails() */
export const latestConfigDetails = func('0x81ff7048', {}, struct({
    configCount: uint32,
    blockNumber: uint32,
    configDigest: bytes32,
}))
export type LatestConfigDetailsParams = FunctionArguments<typeof latestConfigDetails>
export type LatestConfigDetailsReturn = FunctionReturn<typeof latestConfigDetails>

/** latestConfigDigestAndEpoch() */
export const latestConfigDigestAndEpoch = func('0xafcb95d7', {}, struct({
    scanLogs: bool,
    configDigest: bytes32,
    epoch: uint32,
}))
export type LatestConfigDigestAndEpochParams = FunctionArguments<typeof latestConfigDigestAndEpoch>
export type LatestConfigDigestAndEpochReturn = FunctionReturn<typeof latestConfigDigestAndEpoch>

/** manuallyExecute(((uint64,address,address,uint64,uint256,bool,uint64,address,uint256,bytes,(address,uint256)[],bytes[],bytes32)[],bytes[][],bytes32[],uint256),uint256[]) */
export const manuallyExecute = func('0x740f4150', {
    report: struct({
        messages: array(struct({
            sourceChainSelector: uint64,
            sender: address,
            receiver: address,
            sequenceNumber: uint64,
            gasLimit: uint256,
            strict: bool,
            nonce: uint64,
            feeToken: address,
            feeTokenAmount: uint256,
            data: bytes,
            tokenAmounts: array(struct({
                token: address,
                amount: uint256,
            })),
            sourceTokenData: array(bytes),
            messageId: bytes32,
        })),
        offchainTokenData: array(array(bytes)),
        proofs: array(bytes32),
        proofFlagBits: uint256,
    }),
    gasLimitOverrides: array(uint256),
})
export type ManuallyExecuteParams = FunctionArguments<typeof manuallyExecute>
export type ManuallyExecuteReturn = FunctionReturn<typeof manuallyExecute>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** setAdmin(address) */
export const setAdmin = func('0x704b6c02', {
    newAdmin: address,
})
export type SetAdminParams = FunctionArguments<typeof setAdmin>
export type SetAdminReturn = FunctionReturn<typeof setAdmin>

/** setOCR2Config(address[],address[],uint8,bytes,uint64,bytes) */
export const setOCR2Config = func('0x1ef38174', {
    signers: array(address),
    transmitters: array(address),
    f: uint8,
    onchainConfig: bytes,
    offchainConfigVersion: uint64,
    offchainConfig: bytes,
})
export type SetOCR2ConfigParams = FunctionArguments<typeof setOCR2Config>
export type SetOCR2ConfigReturn = FunctionReturn<typeof setOCR2Config>

/** setRateLimiterConfig((bool,uint128,uint128)) */
export const setRateLimiterConfig = func('0xc92b2832', {
    config: struct({
        isEnabled: bool,
        capacity: uint128,
        rate: uint128,
    }),
})
export type SetRateLimiterConfigParams = FunctionArguments<typeof setRateLimiterConfig>
export type SetRateLimiterConfigReturn = FunctionReturn<typeof setRateLimiterConfig>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    to: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** transmit(bytes32[3],bytes,bytes32[],bytes32[],bytes32) */
export const transmit = func('0xb1dc65a4', {
    reportContext: fixedSizeArray(bytes32, 3),
    report: bytes,
    rs: array(bytes32),
    ss: array(bytes32),
    _4: bytes32,
})
export type TransmitParams = FunctionArguments<typeof transmit>
export type TransmitReturn = FunctionReturn<typeof transmit>

/** typeAndVersion() */
export const typeAndVersion = func('0x181f5a77', {}, string)
export type TypeAndVersionParams = FunctionArguments<typeof typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof typeAndVersion>
