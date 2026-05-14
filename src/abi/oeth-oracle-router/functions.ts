import { address, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** cacheDecimals(address) */
export const cacheDecimals = func('0x36b6d944', {
    asset: address,
}, uint8)
export type CacheDecimalsParams = FunctionArguments<typeof cacheDecimals>
export type CacheDecimalsReturn = FunctionReturn<typeof cacheDecimals>

/** price(address) */
export const price = func('0xaea91078', {
    asset: address,
}, uint256)
export type PriceParams = FunctionArguments<typeof price>
export type PriceReturn = FunctionReturn<typeof price>
