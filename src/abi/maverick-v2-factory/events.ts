import { address, int32, uint256, uint8 } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** PoolCreated(address,uint8,uint256,uint256,uint256,uint256,int32,address,address,uint8,address) */
export const PoolCreated = event('0x848331e408557f4b7eb6561ca1c18a3ac43004fbe64b8b5bce613855cfdf22d2', {
    poolAddress: address,
    protocolFeeRatio: uint8,
    feeAIn: uint256,
    feeBIn: uint256,
    tickSpacing: uint256,
    lookback: uint256,
    activeTick: int32,
    tokenA: address,
    tokenB: address,
    kinds: uint8,
    accessor: address,
})
export type PoolCreatedEventArgs = EParams<typeof PoolCreated>
