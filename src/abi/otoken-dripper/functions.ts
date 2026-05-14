import { address, bool, struct, uint192, uint256, uint64 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** availableFunds() */
export const availableFunds = func('0x46fcff4c', {}, uint256)
export type AvailableFundsParams = FunctionArguments<typeof availableFunds>
export type AvailableFundsReturn = FunctionReturn<typeof availableFunds>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** collect() */
export const collect = func('0xe5225381', {})
export type CollectParams = FunctionArguments<typeof collect>
export type CollectReturn = FunctionReturn<typeof collect>

/** collectAndRebase() */
export const collectAndRebase = func('0x73796297', {})
export type CollectAndRebaseParams = FunctionArguments<typeof collectAndRebase>
export type CollectAndRebaseReturn = FunctionReturn<typeof collectAndRebase>

/** drip() */
export const drip = func('0x9f678cca', {}, struct({
    lastCollect: uint64,
    perSecond: uint192,
}))
export type DripParams = FunctionArguments<typeof drip>
export type DripReturn = FunctionReturn<typeof drip>

/** dripDuration() */
export const dripDuration = func('0xbb7a632e', {}, uint256)
export type DripDurationParams = FunctionArguments<typeof dripDuration>
export type DripDurationReturn = FunctionReturn<typeof dripDuration>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** setDripDuration(uint256) */
export const setDripDuration = func('0x0493a0fa', {
    _durationSeconds: uint256,
})
export type SetDripDurationParams = FunctionArguments<typeof setDripDuration>
export type SetDripDurationReturn = FunctionReturn<typeof setDripDuration>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** transferToken(address,uint256) */
export const transferToken = func('0x1072cbea', {
    _asset: address,
    _amount: uint256,
})
export type TransferTokenParams = FunctionArguments<typeof transferToken>
export type TransferTokenReturn = FunctionReturn<typeof transferToken>
