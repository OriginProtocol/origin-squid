import { address, bool, uint256, uint64 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AccountCapEnabled(bool) */
export const AccountCapEnabled = event('0x4c563c575a56d9737f009e7e9c600134eb839aea992e7e6cae26a025f8c5574d', {
    enabled: bool,
})
export type AccountCapEnabledEventArgs = EParams<typeof AccountCapEnabled>

/** AdminChanged(address,address) */
export const AdminChanged = event('0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f', {
    previousAdmin: address,
    newAdmin: address,
})
export type AdminChangedEventArgs = EParams<typeof AdminChanged>

/** Initialized(uint64) */
export const Initialized = event('0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2', {
    version: uint64,
})
export type InitializedEventArgs = EParams<typeof Initialized>

/** LiquidityProviderCap(address,uint256) */
export const LiquidityProviderCap = event('0xd5641199fd66ba2e0225ec23448f19db5a5524b3133b8c21c462f32d61e29603', {
    liquidityProvider: indexed(address),
    cap: uint256,
})
export type LiquidityProviderCapEventArgs = EParams<typeof LiquidityProviderCap>

/** OperatorChanged(address) */
export const OperatorChanged = event('0x4721129e0e676ed6a92909bb24e853ccdd63ad72280cc2e974e38e480e0e6e54', {
    newAdmin: address,
})
export type OperatorChangedEventArgs = EParams<typeof OperatorChanged>

/** TotalAssetsCap(uint256) */
export const TotalAssetsCap = event('0xb237111e0971b3cc8dc65f6164aeb3bf03eabde0c4466dd4ce9e6973ee1a5354', {
    cap: uint256,
})
export type TotalAssetsCapEventArgs = EParams<typeof TotalAssetsCap>
