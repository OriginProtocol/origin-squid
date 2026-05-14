import { bytes32, int256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** rateAtTarget(bytes32) */
export const rateAtTarget = func('0x01977b57', {
    id: bytes32,
}, int256)
export type RateAtTargetParams = FunctionArguments<typeof rateAtTarget>
export type RateAtTargetReturn = FunctionReturn<typeof rateAtTarget>
