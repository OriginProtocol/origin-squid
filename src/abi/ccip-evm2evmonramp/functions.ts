import { address, array, bool, bytes, bytes32, int256, string, struct, uint128, uint16, uint256, uint32, uint64, uint96 } from '@subsquid/evm-codec'
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

/** forwardFromRouter(uint64,(bytes,bytes,(address,uint256)[],address,bytes),uint256,address) */
export const forwardFromRouter = func('0xdf0aa9e9', {
    destChainSelector: uint64,
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
    feeTokenAmount: uint256,
    originalSender: address,
}, bytes32)
export type ForwardFromRouterParams = FunctionArguments<typeof forwardFromRouter>
export type ForwardFromRouterReturn = FunctionReturn<typeof forwardFromRouter>

/** getDynamicConfig() */
export const getDynamicConfig = func('0x7437ff9f', {}, struct({
    router: address,
    maxNumberOfTokensPerMsg: uint16,
    destGasOverhead: uint32,
    destGasPerPayloadByte: uint16,
    destDataAvailabilityOverheadGas: uint32,
    destGasPerDataAvailabilityByte: uint16,
    destDataAvailabilityMultiplierBps: uint16,
    priceRegistry: address,
    maxDataBytes: uint32,
    maxPerMsgGasLimit: uint32,
}))
export type GetDynamicConfigParams = FunctionArguments<typeof getDynamicConfig>
export type GetDynamicConfigReturn = FunctionReturn<typeof getDynamicConfig>

/** getExpectedNextSequenceNumber() */
export const getExpectedNextSequenceNumber = func('0x4120fccd', {}, uint64)
export type GetExpectedNextSequenceNumberParams = FunctionArguments<typeof getExpectedNextSequenceNumber>
export type GetExpectedNextSequenceNumberReturn = FunctionReturn<typeof getExpectedNextSequenceNumber>

/** getFee(uint64,(bytes,bytes,(address,uint256)[],address,bytes)) */
export const getFee = func('0x20487ded', {
    destChainSelector: uint64,
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

/** getFeeTokenConfig(address) */
export const getFeeTokenConfig = func('0x9a113c36', {
    token: address,
}, struct({
    networkFeeUSDCents: uint32,
    gasMultiplierWeiPerEth: uint64,
    premiumMultiplierWeiPerEth: uint64,
    enabled: bool,
}))
export type GetFeeTokenConfigParams = FunctionArguments<typeof getFeeTokenConfig>
export type GetFeeTokenConfigReturn = FunctionReturn<typeof getFeeTokenConfig>

/** getNopFeesJuels() */
export const getNopFeesJuels = func('0x54b71468', {}, uint96)
export type GetNopFeesJuelsParams = FunctionArguments<typeof getNopFeesJuels>
export type GetNopFeesJuelsReturn = FunctionReturn<typeof getNopFeesJuels>

/** getNops() */
export const getNops = func('0xb06d41bc', {}, struct({
    nopsAndWeights: array(struct({
        nop: address,
        weight: uint16,
    })),
    weightsTotal: uint256,
}))
export type GetNopsParams = FunctionArguments<typeof getNops>
export type GetNopsReturn = FunctionReturn<typeof getNops>

/** getPoolBySourceToken(uint64,address) */
export const getPoolBySourceToken = func('0x48a98aa4', {
    _0: uint64,
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
    linkToken: address,
    chainSelector: uint64,
    destChainSelector: uint64,
    defaultTxGasLimit: uint64,
    maxNopFeesJuels: uint96,
    prevOnRamp: address,
    armProxy: address,
}))
export type GetStaticConfigParams = FunctionArguments<typeof getStaticConfig>
export type GetStaticConfigReturn = FunctionReturn<typeof getStaticConfig>

/** getSupportedTokens(uint64) */
export const getSupportedTokens = func('0xfbca3b74', {
    _0: uint64,
}, array(address))
export type GetSupportedTokensParams = FunctionArguments<typeof getSupportedTokens>
export type GetSupportedTokensReturn = FunctionReturn<typeof getSupportedTokens>

/** getTokenLimitAdmin() */
export const getTokenLimitAdmin = func('0x599f6431', {}, address)
export type GetTokenLimitAdminParams = FunctionArguments<typeof getTokenLimitAdmin>
export type GetTokenLimitAdminReturn = FunctionReturn<typeof getTokenLimitAdmin>

/** getTokenTransferFeeConfig(address) */
export const getTokenTransferFeeConfig = func('0x1772047e', {
    token: address,
}, struct({
    minFeeUSDCents: uint32,
    maxFeeUSDCents: uint32,
    deciBps: uint16,
    destGasOverhead: uint32,
    destBytesOverhead: uint32,
}))
export type GetTokenTransferFeeConfigParams = FunctionArguments<typeof getTokenTransferFeeConfig>
export type GetTokenTransferFeeConfigReturn = FunctionReturn<typeof getTokenTransferFeeConfig>

/** linkAvailableForPayment() */
export const linkAvailableForPayment = func('0xd09dc339', {}, int256)
export type LinkAvailableForPaymentParams = FunctionArguments<typeof linkAvailableForPayment>
export type LinkAvailableForPaymentReturn = FunctionReturn<typeof linkAvailableForPayment>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** payNops() */
export const payNops = func('0xeff7cc48', {})
export type PayNopsParams = FunctionArguments<typeof payNops>
export type PayNopsReturn = FunctionReturn<typeof payNops>

/** setAdmin(address) */
export const setAdmin = func('0x704b6c02', {
    newAdmin: address,
})
export type SetAdminParams = FunctionArguments<typeof setAdmin>
export type SetAdminReturn = FunctionReturn<typeof setAdmin>

/** setDynamicConfig((address,uint16,uint32,uint16,uint32,uint16,uint16,address,uint32,uint32)) */
export const setDynamicConfig = func('0xe687b40a', {
    dynamicConfig: struct({
        router: address,
        maxNumberOfTokensPerMsg: uint16,
        destGasOverhead: uint32,
        destGasPerPayloadByte: uint16,
        destDataAvailabilityOverheadGas: uint32,
        destGasPerDataAvailabilityByte: uint16,
        destDataAvailabilityMultiplierBps: uint16,
        priceRegistry: address,
        maxDataBytes: uint32,
        maxPerMsgGasLimit: uint32,
    }),
})
export type SetDynamicConfigParams = FunctionArguments<typeof setDynamicConfig>
export type SetDynamicConfigReturn = FunctionReturn<typeof setDynamicConfig>

/** setFeeTokenConfig((address,uint32,uint64,uint64,bool)[]) */
export const setFeeTokenConfig = func('0xf25561fd', {
    feeTokenConfigArgs: array(struct({
        token: address,
        networkFeeUSDCents: uint32,
        gasMultiplierWeiPerEth: uint64,
        premiumMultiplierWeiPerEth: uint64,
        enabled: bool,
    })),
})
export type SetFeeTokenConfigParams = FunctionArguments<typeof setFeeTokenConfig>
export type SetFeeTokenConfigReturn = FunctionReturn<typeof setFeeTokenConfig>

/** setNops((address,uint16)[]) */
export const setNops = func('0x76f6ae76', {
    nopsAndWeights: array(struct({
        nop: address,
        weight: uint16,
    })),
})
export type SetNopsParams = FunctionArguments<typeof setNops>
export type SetNopsReturn = FunctionReturn<typeof setNops>

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

/** setTokenTransferFeeConfig((address,uint32,uint32,uint16,uint32,uint32)[]) */
export const setTokenTransferFeeConfig = func('0x7ec75751', {
    tokenTransferFeeConfigArgs: array(struct({
        token: address,
        minFeeUSDCents: uint32,
        maxFeeUSDCents: uint32,
        deciBps: uint16,
        destGasOverhead: uint32,
        destBytesOverhead: uint32,
    })),
})
export type SetTokenTransferFeeConfigParams = FunctionArguments<typeof setTokenTransferFeeConfig>
export type SetTokenTransferFeeConfigReturn = FunctionReturn<typeof setTokenTransferFeeConfig>

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

/** withdrawNonLinkFees(address,address) */
export const withdrawNonLinkFees = func('0x549e946f', {
    feeToken: address,
    to: address,
})
export type WithdrawNonLinkFeesParams = FunctionArguments<typeof withdrawNonLinkFees>
export type WithdrawNonLinkFeesReturn = FunctionReturn<typeof withdrawNonLinkFees>
