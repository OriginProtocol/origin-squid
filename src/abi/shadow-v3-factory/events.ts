import { address, int24, uint24, uint8 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** FeeAdjustment(address,uint24) */
export const FeeAdjustment = event('0xe4accbaee82fb833ac207d4c4454c5a04e85f5e1e9a20a9e2c98e54e8706ff2b', {
    pool: address,
    newFee: uint24,
})
export type FeeAdjustmentEventArgs = EParams<typeof FeeAdjustment>

/** FeeCollectorChanged(address,address) */
export const FeeCollectorChanged = event('0x649c5e3d0ed183894196148e193af316452b0037e77d2ff0fef23b7dc722bed0', {
    oldFeeCollector: indexed(address),
    newFeeCollector: indexed(address),
})
export type FeeCollectorChangedEventArgs = EParams<typeof FeeCollectorChanged>

/** PoolCreated(address,address,uint24,int24,address) */
export const PoolCreated = event('0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118', {
    token0: indexed(address),
    token1: indexed(address),
    fee: indexed(uint24),
    tickSpacing: int24,
    pool: address,
})
export type PoolCreatedEventArgs = EParams<typeof PoolCreated>

/** SetFeeProtocol(uint8,uint8) */
export const SetFeeProtocol = event('0x7a8f5b6a3fe6312faf94330e829a331301dbd2ce6947e915be63bf67b473ed5f', {
    feeProtocolOld: uint8,
    feeProtocolNew: uint8,
})
export type SetFeeProtocolEventArgs = EParams<typeof SetFeeProtocol>

/** SetPoolFeeProtocol(address,uint8,uint8) */
export const SetPoolFeeProtocol = event('0xa667945ce175575f1ba112f8598cad43210716077bdcabd4d73f2397a81e59bd', {
    pool: address,
    feeProtocolOld: uint8,
    feeProtocolNew: uint8,
})
export type SetPoolFeeProtocolEventArgs = EParams<typeof SetPoolFeeProtocol>

/** TickSpacingEnabled(int24,uint24) */
export const TickSpacingEnabled = event('0xebafae466a4a780a1d87f5fab2f52fad33be9151a7f69d099e8934c8de85b747', {
    tickSpacing: indexed(int24),
    fee: indexed(uint24),
})
export type TickSpacingEnabledEventArgs = EParams<typeof TickSpacingEnabled>
