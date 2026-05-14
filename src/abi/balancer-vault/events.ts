import { address, array, bool, bytes32, int256, uint256, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AuthorizerChanged(address) */
export const AuthorizerChanged = event('0x94b979b6831a51293e2641426f97747feed46f17779fed9cd18d1ecefcfe92ef', {
    newAuthorizer: indexed(address),
})
export type AuthorizerChangedEventArgs = EParams<typeof AuthorizerChanged>

/** ExternalBalanceTransfer(address,address,address,uint256) */
export const ExternalBalanceTransfer = event('0x540a1a3f28340caec336c81d8d7b3df139ee5cdc1839a4f283d7ebb7eaae2d5c', {
    token: indexed(address),
    sender: indexed(address),
    recipient: address,
    amount: uint256,
})
export type ExternalBalanceTransferEventArgs = EParams<typeof ExternalBalanceTransfer>

/** FlashLoan(address,address,uint256,uint256) */
export const FlashLoan = event('0x0d7d75e01ab95780d3cd1c8ec0dd6c2ce19e3a20427eec8bf53283b6fb8e95f0', {
    recipient: indexed(address),
    token: indexed(address),
    amount: uint256,
    feeAmount: uint256,
})
export type FlashLoanEventArgs = EParams<typeof FlashLoan>

/** InternalBalanceChanged(address,address,int256) */
export const InternalBalanceChanged = event('0x18e1ea4139e68413d7d08aa752e71568e36b2c5bf940893314c2c5b01eaa0c42', {
    user: indexed(address),
    token: indexed(address),
    delta: int256,
})
export type InternalBalanceChangedEventArgs = EParams<typeof InternalBalanceChanged>

/** PausedStateChanged(bool) */
export const PausedStateChanged = event('0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64', {
    paused: bool,
})
export type PausedStateChangedEventArgs = EParams<typeof PausedStateChanged>

/** PoolBalanceChanged(bytes32,address,address[],int256[],uint256[]) */
export const PoolBalanceChanged = event('0xe5ce249087ce04f05a957192435400fd97868dba0e6a4b4c049abf8af80dae78', {
    poolId: indexed(bytes32),
    liquidityProvider: indexed(address),
    tokens: array(address),
    deltas: array(int256),
    protocolFeeAmounts: array(uint256),
})
export type PoolBalanceChangedEventArgs = EParams<typeof PoolBalanceChanged>

/** PoolBalanceManaged(bytes32,address,address,int256,int256) */
export const PoolBalanceManaged = event('0x6edcaf6241105b4c94c2efdbf3a6b12458eb3d07be3a0e81d24b13c44045fe7a', {
    poolId: indexed(bytes32),
    assetManager: indexed(address),
    token: indexed(address),
    cashDelta: int256,
    managedDelta: int256,
})
export type PoolBalanceManagedEventArgs = EParams<typeof PoolBalanceManaged>

/** PoolRegistered(bytes32,address,uint8) */
export const PoolRegistered = event('0x3c13bc30b8e878c53fd2a36b679409c073afd75950be43d8858768e956fbc20e', {
    poolId: indexed(bytes32),
    poolAddress: indexed(address),
    specialization: uint8,
})
export type PoolRegisteredEventArgs = EParams<typeof PoolRegistered>

/** RelayerApprovalChanged(address,address,bool) */
export const RelayerApprovalChanged = event('0x46961fdb4502b646d5095fba7600486a8ac05041d55cdf0f16ed677180b5cad8', {
    relayer: indexed(address),
    sender: indexed(address),
    approved: bool,
})
export type RelayerApprovalChangedEventArgs = EParams<typeof RelayerApprovalChanged>

/** Swap(bytes32,address,address,uint256,uint256) */
export const Swap = event('0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b', {
    poolId: indexed(bytes32),
    tokenIn: indexed(address),
    tokenOut: indexed(address),
    amountIn: uint256,
    amountOut: uint256,
})
export type SwapEventArgs = EParams<typeof Swap>

/** TokensDeregistered(bytes32,address[]) */
export const TokensDeregistered = event('0x7dcdc6d02ef40c7c1a7046a011b058bd7f988fa14e20a66344f9d4e60657d610', {
    poolId: indexed(bytes32),
    tokens: array(address),
})
export type TokensDeregisteredEventArgs = EParams<typeof TokensDeregistered>

/** TokensRegistered(bytes32,address[],address[]) */
export const TokensRegistered = event('0xf5847d3f2197b16cdcd2098ec95d0905cd1abdaf415f07bb7cef2bba8ac5dec4', {
    poolId: indexed(bytes32),
    tokens: array(address),
    assetManagers: array(address),
})
export type TokensRegisteredEventArgs = EParams<typeof TokensRegistered>
