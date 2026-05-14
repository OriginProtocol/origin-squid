import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** PairCreated(address,address,address,uint256) */
export const PairCreated = event('0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9', {
    token0: indexed(address),
    token1: indexed(address),
    pair: address,
    _3: uint256,
})
export type PairCreatedEventArgs = EParams<typeof PairCreated>
