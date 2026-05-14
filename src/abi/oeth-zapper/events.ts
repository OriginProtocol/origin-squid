import { address, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Zap(address,address,uint256) */
export const Zap = event('0x9d0b99c299bdb5656c0c9db6e1886c612db5c2881760ea54ab244f6338b4ebd6', {
    minter: indexed(address),
    asset: indexed(address),
    amount: uint256,
})
export type ZapEventArgs = EParams<typeof Zap>
