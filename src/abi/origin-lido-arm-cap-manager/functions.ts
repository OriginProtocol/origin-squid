import { address, array, bool, uint248, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** accountCapEnabled() */
export const accountCapEnabled = func('0x475b070c', {}, bool)
export type AccountCapEnabledParams = FunctionArguments<typeof accountCapEnabled>
export type AccountCapEnabledReturn = FunctionReturn<typeof accountCapEnabled>

/** arm() */
export const arm = func('0x370419e5', {}, address)
export type ArmParams = FunctionArguments<typeof arm>
export type ArmReturn = FunctionReturn<typeof arm>

/** initialize(address) */
export const initialize = func('0xc4d66de8', {
    _operator: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** liquidityProviderCaps(address) */
export const liquidityProviderCaps = func('0xdb371e9c', {
    liquidityProvider: address,
}, uint256)
export type LiquidityProviderCapsParams = FunctionArguments<typeof liquidityProviderCaps>
export type LiquidityProviderCapsReturn = FunctionReturn<typeof liquidityProviderCaps>

/** operator() */
export const operator = func('0x570ca735', {}, address)
export type OperatorParams = FunctionArguments<typeof operator>
export type OperatorReturn = FunctionReturn<typeof operator>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** postDepositHook(address,uint256) */
export const postDepositHook = func('0x7dc46f61', {
    liquidityProvider: address,
    assets: uint256,
})
export type PostDepositHookParams = FunctionArguments<typeof postDepositHook>
export type PostDepositHookReturn = FunctionReturn<typeof postDepositHook>

/** setAccountCapEnabled(bool) */
export const setAccountCapEnabled = func('0x1a0a4d9f', {
    _accountCapEnabled: bool,
})
export type SetAccountCapEnabledParams = FunctionArguments<typeof setAccountCapEnabled>
export type SetAccountCapEnabledReturn = FunctionReturn<typeof setAccountCapEnabled>

/** setLiquidityProviderCaps(address[],uint256) */
export const setLiquidityProviderCaps = func('0xc3d97ad1', {
    _liquidityProviders: array(address),
    cap: uint256,
})
export type SetLiquidityProviderCapsParams = FunctionArguments<typeof setLiquidityProviderCaps>
export type SetLiquidityProviderCapsReturn = FunctionReturn<typeof setLiquidityProviderCaps>

/** setOperator(address) */
export const setOperator = func('0xb3ab15fb', {
    newOperator: address,
})
export type SetOperatorParams = FunctionArguments<typeof setOperator>
export type SetOperatorReturn = FunctionReturn<typeof setOperator>

/** setOwner(address) */
export const setOwner = func('0x13af4035', {
    newOwner: address,
})
export type SetOwnerParams = FunctionArguments<typeof setOwner>
export type SetOwnerReturn = FunctionReturn<typeof setOwner>

/** setTotalAssetsCap(uint248) */
export const setTotalAssetsCap = func('0xfabd48ce', {
    _totalAssetsCap: uint248,
})
export type SetTotalAssetsCapParams = FunctionArguments<typeof setTotalAssetsCap>
export type SetTotalAssetsCapReturn = FunctionReturn<typeof setTotalAssetsCap>

/** totalAssetsCap() */
export const totalAssetsCap = func('0x45f663dd', {}, uint248)
export type TotalAssetsCapParams = FunctionArguments<typeof totalAssetsCap>
export type TotalAssetsCapReturn = FunctionReturn<typeof totalAssetsCap>
