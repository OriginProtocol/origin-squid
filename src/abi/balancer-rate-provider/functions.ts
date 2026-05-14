import { address, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** getRate() */
export const getRate = func('0x679aefce', {}, uint256)
export type GetRateParams = FunctionArguments<typeof getRate>
export type GetRateReturn = FunctionReturn<typeof getRate>

/** rocketTokenRETH() */
export const rocketTokenRETH = func('0xdb5dacc9', {}, address)
export type RocketTokenRETHParams = FunctionArguments<typeof rocketTokenRETH>
export type RocketTokenRETHReturn = FunctionReturn<typeof rocketTokenRETH>
