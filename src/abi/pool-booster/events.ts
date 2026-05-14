import { uint256 } from '@subsquid/evm-codec'
import { event } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** BribeExecuted(uint256) */
export const BribeExecuted = event('0x1424c3a24f9b1f30558ab0a7b48e07ce9f7d85b293a69a90356e1478504232eb', {
    amount: uint256,
})
export type BribeExecutedEventArgs = EParams<typeof BribeExecuted>
