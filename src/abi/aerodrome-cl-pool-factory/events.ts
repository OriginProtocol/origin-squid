import { address, int24, uint24 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** DefaultUnstakedFeeChanged(uint24,uint24) */
export const DefaultUnstakedFeeChanged = event('0xcbca61144322b913ada4febfb591864cad7617559d7ee0d3e29b48eb93fcc78e', {
    oldUnstakedFee: indexed(uint24),
    newUnstakedFee: indexed(uint24),
})
export type DefaultUnstakedFeeChangedEventArgs = EParams<typeof DefaultUnstakedFeeChanged>

/** OwnerChanged(address,address) */
export const OwnerChanged = event('0xb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c', {
    oldOwner: indexed(address),
    newOwner: indexed(address),
})
export type OwnerChangedEventArgs = EParams<typeof OwnerChanged>

/** PoolCreated(address,address,int24,address) */
export const PoolCreated = event('0xab0d57f0df537bb25e80245ef7748fa62353808c54d6e528a9dd20887aed9ac2', {
    token0: indexed(address),
    token1: indexed(address),
    tickSpacing: indexed(int24),
    pool: address,
})
export type PoolCreatedEventArgs = EParams<typeof PoolCreated>

/** SwapFeeManagerChanged(address,address) */
export const SwapFeeManagerChanged = event('0x7ae0007229b3333719d97e8ef5829c888f560776012974f87409c158e5b7eb91', {
    oldFeeManager: indexed(address),
    newFeeManager: indexed(address),
})
export type SwapFeeManagerChangedEventArgs = EParams<typeof SwapFeeManagerChanged>

/** SwapFeeModuleChanged(address,address) */
export const SwapFeeModuleChanged = event('0xdf24ed64a7bcd761cf1132e79f94ea269a1d570e7a6ca0ab99a8f5ccd6f5022f', {
    oldFeeModule: indexed(address),
    newFeeModule: indexed(address),
})
export type SwapFeeModuleChangedEventArgs = EParams<typeof SwapFeeModuleChanged>

/** TickSpacingEnabled(int24,uint24) */
export const TickSpacingEnabled = event('0xebafae466a4a780a1d87f5fab2f52fad33be9151a7f69d099e8934c8de85b747', {
    tickSpacing: indexed(int24),
    fee: indexed(uint24),
})
export type TickSpacingEnabledEventArgs = EParams<typeof TickSpacingEnabled>

/** UnstakedFeeManagerChanged(address,address) */
export const UnstakedFeeManagerChanged = event('0x3d7ebe96182c99643ca0c997a416a2a3409baab225f85f50c29fcf0591c820c1', {
    oldFeeManager: indexed(address),
    newFeeManager: indexed(address),
})
export type UnstakedFeeManagerChangedEventArgs = EParams<typeof UnstakedFeeManagerChanged>

/** UnstakedFeeModuleChanged(address,address) */
export const UnstakedFeeModuleChanged = event('0x6520f404f3831947cee8673060459cdfb181b7332aa7580bcce9bf90ef1f0e20', {
    oldFeeModule: indexed(address),
    newFeeModule: indexed(address),
})
export type UnstakedFeeModuleChangedEventArgs = EParams<typeof UnstakedFeeModuleChanged>
