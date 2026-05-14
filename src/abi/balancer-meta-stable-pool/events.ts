import { address, bool, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AmpUpdateStarted(uint256,uint256,uint256,uint256) */
export const AmpUpdateStarted = event('0x1835882ee7a34ac194f717a35e09bb1d24c82a3b9d854ab6c9749525b714cdf2', {
    startValue: uint256,
    endValue: uint256,
    startTime: uint256,
    endTime: uint256,
})
export type AmpUpdateStartedEventArgs = EParams<typeof AmpUpdateStarted>

/** AmpUpdateStopped(uint256) */
export const AmpUpdateStopped = event('0xa0d01593e47e69d07e0ccd87bece09411e07dd1ed40ca8f2e7af2976542a0233', {
    currentValue: uint256,
})
export type AmpUpdateStoppedEventArgs = EParams<typeof AmpUpdateStopped>

/** Approval(address,address,uint256) */
export const Approval = event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(address),
    spender: indexed(address),
    value: uint256,
})
export type ApprovalEventArgs = EParams<typeof Approval>

/** OracleEnabledChanged(bool) */
export const OracleEnabledChanged = event('0x3e350b41e86a8e10f804ade6d35340d620be35569cc75ac943e8bb14ab80ead1', {
    enabled: bool,
})
export type OracleEnabledChangedEventArgs = EParams<typeof OracleEnabledChanged>

/** PausedStateChanged(bool) */
export const PausedStateChanged = event('0x9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be64', {
    paused: bool,
})
export type PausedStateChangedEventArgs = EParams<typeof PausedStateChanged>

/** PriceRateCacheUpdated(address,uint256) */
export const PriceRateCacheUpdated = event('0xc1a224b14823b63c7711127f125fbf592434682f38881ebb61408747a303affc', {
    token: indexed(address),
    rate: uint256,
})
export type PriceRateCacheUpdatedEventArgs = EParams<typeof PriceRateCacheUpdated>

/** PriceRateProviderSet(address,address,uint256) */
export const PriceRateProviderSet = event('0xca6c2c5b6b44b5f3f0c08f0e28e5b6deda1cb38c3fe1113e8031d926c1e8c6d0', {
    token: indexed(address),
    provider: indexed(address),
    cacheDuration: uint256,
})
export type PriceRateProviderSetEventArgs = EParams<typeof PriceRateProviderSet>

/** SwapFeePercentageChanged(uint256) */
export const SwapFeePercentageChanged = event('0xa9ba3ffe0b6c366b81232caab38605a0699ad5398d6cce76f91ee809e322dafc', {
    swapFeePercentage: uint256,
})
export type SwapFeePercentageChangedEventArgs = EParams<typeof SwapFeePercentageChanged>

/** Transfer(address,address,uint256) */
export const Transfer = event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(address),
    to: indexed(address),
    value: uint256,
})
export type TransferEventArgs = EParams<typeof Transfer>
