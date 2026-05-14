import { address, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** STRATEGY() */
export const STRATEGY = func('0x185025ef', {}, address)
export type STRATEGYParams = FunctionArguments<typeof STRATEGY>
export type STRATEGYReturn = FunctionReturn<typeof STRATEGY>

/** collect() */
export const collect = func('0xe5225381', {}, uint256)
export type CollectParams = FunctionArguments<typeof collect>
export type CollectReturn = FunctionReturn<typeof collect>
