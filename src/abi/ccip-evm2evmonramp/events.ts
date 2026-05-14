import { address, array, bool, bytes, bytes32, struct, uint16, uint256, uint32, uint64, uint96 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AdminSet(address) */
export const AdminSet = event('0x8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c', {
    newAdmin: address,
})
export type AdminSetEventArgs = EParams<typeof AdminSet>

/** CCIPSendRequested((uint64,address,address,uint64,uint256,bool,uint64,address,uint256,bytes,(address,uint256)[],bytes[],bytes32)) */
export const CCIPSendRequested = event('0xd0c3c799bf9e2639de44391e7f524d229b2b55f5b1ea94b2bf7da42f7243dddd', {
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
})
export type CCIPSendRequestedEventArgs = EParams<typeof CCIPSendRequested>

/** ConfigSet((address,uint64,uint64,uint64,uint96,address,address),(address,uint16,uint32,uint16,uint32,uint16,uint16,address,uint32,uint32)) */
export const ConfigSet = event('0x2a57f7c2027cf032c78b77d4d8d2fbd20ad22e5d5e5b5fb23ac7d7820d44adc6', {
    staticConfig: struct({
        linkToken: address,
        chainSelector: uint64,
        destChainSelector: uint64,
        defaultTxGasLimit: uint64,
        maxNopFeesJuels: uint96,
        prevOnRamp: address,
        armProxy: address,
    }),
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
export type ConfigSetEventArgs = EParams<typeof ConfigSet>

/** FeeConfigSet((address,uint32,uint64,uint64,bool)[]) */
export const FeeConfigSet = event('0x067924bf9277d905a9a4631a06d959bc032ace86b3caa835ae7e403d4f39010e', {
    feeConfig: array(struct({
        token: address,
        networkFeeUSDCents: uint32,
        gasMultiplierWeiPerEth: uint64,
        premiumMultiplierWeiPerEth: uint64,
        enabled: bool,
    })),
})
export type FeeConfigSetEventArgs = EParams<typeof FeeConfigSet>

/** NopPaid(address,uint256) */
export const NopPaid = event('0x55fdec2aab60a41fa5abb106670eb1006f5aeaee1ba7afea2bc89b5b3ec7678f', {
    nop: indexed(address),
    amount: uint256,
})
export type NopPaidEventArgs = EParams<typeof NopPaid>

/** NopsSet(uint256,(address,uint16)[]) */
export const NopsSet = event('0x8c337bff38141c507abd25c547606bdde78fe8c12e941ab613f3a565fea6cd24', {
    nopWeightsTotal: uint256,
    nopsAndWeights: array(struct({
        nop: address,
        weight: uint16,
    })),
})
export type NopsSetEventArgs = EParams<typeof NopsSet>

/** OwnershipTransferRequested(address,address) */
export const OwnershipTransferRequested = event('0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278', {
    from: indexed(address),
    to: indexed(address),
})
export type OwnershipTransferRequestedEventArgs = EParams<typeof OwnershipTransferRequested>

/** OwnershipTransferred(address,address) */
export const OwnershipTransferred = event('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0', {
    from: indexed(address),
    to: indexed(address),
})
export type OwnershipTransferredEventArgs = EParams<typeof OwnershipTransferred>

/** PoolAdded(address,address) */
export const PoolAdded = event('0x95f865c2808f8b2a85eea2611db7843150ee7835ef1403f9755918a97d76933c', {
    token: address,
    pool: address,
})
export type PoolAddedEventArgs = EParams<typeof PoolAdded>

/** PoolRemoved(address,address) */
export const PoolRemoved = event('0x987eb3c2f78454541205f72f34839b434c306c9eaf4922efd7c0c3060fdb2e4c', {
    token: address,
    pool: address,
})
export type PoolRemovedEventArgs = EParams<typeof PoolRemoved>

/** TokenTransferFeeConfigSet((address,uint32,uint32,uint16,uint32,uint32)[]) */
export const TokenTransferFeeConfigSet = event('0x555c74101f7a15746d31c6731170310e667bcc607996b2fc0b981a7b26a416e9', {
    transferFeeConfig: array(struct({
        token: address,
        minFeeUSDCents: uint32,
        maxFeeUSDCents: uint32,
        deciBps: uint16,
        destGasOverhead: uint32,
        destBytesOverhead: uint32,
    })),
})
export type TokenTransferFeeConfigSetEventArgs = EParams<typeof TokenTransferFeeConfigSet>
