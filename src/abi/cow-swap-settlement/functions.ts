import { address, array, bool, bytes, bytes32, fixedSizeArray, struct, uint256, uint32 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** authenticator() */
export const authenticator = func('0x2335c76b', {}, address)
export type AuthenticatorParams = FunctionArguments<typeof authenticator>
export type AuthenticatorReturn = FunctionReturn<typeof authenticator>

/** domainSeparator() */
export const domainSeparator = func('0xf698da25', {}, bytes32)
export type DomainSeparatorParams = FunctionArguments<typeof domainSeparator>
export type DomainSeparatorReturn = FunctionReturn<typeof domainSeparator>

/** filledAmount(bytes) */
export const filledAmount = func('0x2479fb6e', {
    _0: bytes,
}, uint256)
export type FilledAmountParams = FunctionArguments<typeof filledAmount>
export type FilledAmountReturn = FunctionReturn<typeof filledAmount>

/** freeFilledAmountStorage(bytes[]) */
export const freeFilledAmountStorage = func('0xed9f35ce', {
    orderUids: array(bytes),
})
export type FreeFilledAmountStorageParams = FunctionArguments<typeof freeFilledAmountStorage>
export type FreeFilledAmountStorageReturn = FunctionReturn<typeof freeFilledAmountStorage>

/** freePreSignatureStorage(bytes[]) */
export const freePreSignatureStorage = func('0xa2a7d51b', {
    orderUids: array(bytes),
})
export type FreePreSignatureStorageParams = FunctionArguments<typeof freePreSignatureStorage>
export type FreePreSignatureStorageReturn = FunctionReturn<typeof freePreSignatureStorage>

/** getStorageAt(uint256,uint256) */
export const getStorageAt = func('0x5624b25b', {
    offset: uint256,
    length: uint256,
}, bytes)
export type GetStorageAtParams = FunctionArguments<typeof getStorageAt>
export type GetStorageAtReturn = FunctionReturn<typeof getStorageAt>

/** invalidateOrder(bytes) */
export const invalidateOrder = func('0x15337bc0', {
    orderUid: bytes,
})
export type InvalidateOrderParams = FunctionArguments<typeof invalidateOrder>
export type InvalidateOrderReturn = FunctionReturn<typeof invalidateOrder>

/** preSignature(bytes) */
export const preSignature = func('0xd08d33d1', {
    _0: bytes,
}, uint256)
export type PreSignatureParams = FunctionArguments<typeof preSignature>
export type PreSignatureReturn = FunctionReturn<typeof preSignature>

/** setPreSignature(bytes,bool) */
export const setPreSignature = func('0xec6cb13f', {
    orderUid: bytes,
    signed: bool,
})
export type SetPreSignatureParams = FunctionArguments<typeof setPreSignature>
export type SetPreSignatureReturn = FunctionReturn<typeof setPreSignature>

/** settle(address[],uint256[],(uint256,uint256,address,uint256,uint256,uint32,bytes32,uint256,uint256,uint256,bytes)[],(address,uint256,bytes)[][3]) */
export const settle = func('0x13d79a0b', {
    tokens: array(address),
    clearingPrices: array(uint256),
    trades: array(struct({
        sellTokenIndex: uint256,
        buyTokenIndex: uint256,
        receiver: address,
        sellAmount: uint256,
        buyAmount: uint256,
        validTo: uint32,
        appData: bytes32,
        feeAmount: uint256,
        flags: uint256,
        executedAmount: uint256,
        signature: bytes,
    })),
    interactions: fixedSizeArray(array(struct({
        target: address,
        value: uint256,
        callData: bytes,
    })), 3),
})
export type SettleParams = FunctionArguments<typeof settle>
export type SettleReturn = FunctionReturn<typeof settle>

/** simulateDelegatecall(address,bytes) */
export const simulateDelegatecall = func('0xf84436bd', {
    targetContract: address,
    calldataPayload: bytes,
}, bytes)
export type SimulateDelegatecallParams = FunctionArguments<typeof simulateDelegatecall>
export type SimulateDelegatecallReturn = FunctionReturn<typeof simulateDelegatecall>

/** simulateDelegatecallInternal(address,bytes) */
export const simulateDelegatecallInternal = func('0x43218e19', {
    targetContract: address,
    calldataPayload: bytes,
}, bytes)
export type SimulateDelegatecallInternalParams = FunctionArguments<typeof simulateDelegatecallInternal>
export type SimulateDelegatecallInternalReturn = FunctionReturn<typeof simulateDelegatecallInternal>

/** swap((bytes32,uint256,uint256,uint256,bytes)[],address[],(uint256,uint256,address,uint256,uint256,uint32,bytes32,uint256,uint256,uint256,bytes)) */
export const swap = func('0x845a101f', {
    swaps: array(struct({
        poolId: bytes32,
        assetInIndex: uint256,
        assetOutIndex: uint256,
        amount: uint256,
        userData: bytes,
    })),
    tokens: array(address),
    trade: struct({
        sellTokenIndex: uint256,
        buyTokenIndex: uint256,
        receiver: address,
        sellAmount: uint256,
        buyAmount: uint256,
        validTo: uint32,
        appData: bytes32,
        feeAmount: uint256,
        flags: uint256,
        executedAmount: uint256,
        signature: bytes,
    }),
})
export type SwapParams = FunctionArguments<typeof swap>
export type SwapReturn = FunctionReturn<typeof swap>

/** vault() */
export const vault = func('0xfbfa77cf', {}, address)
export type VaultParams = FunctionArguments<typeof vault>
export type VaultReturn = FunctionReturn<typeof vault>

/** vaultRelayer() */
export const vaultRelayer = func('0x9b552cc2', {}, address)
export type VaultRelayerParams = FunctionArguments<typeof vaultRelayer>
export type VaultRelayerReturn = FunctionReturn<typeof vaultRelayer>
