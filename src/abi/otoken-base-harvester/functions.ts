import { address, bool, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** aero() */
export const aero = func('0x26837eda', {}, address)
export type AeroParams = FunctionArguments<typeof aero>
export type AeroReturn = FunctionReturn<typeof aero>

/** amoStrategy() */
export const amoStrategy = func('0xf6aa085d', {}, address)
export type AmoStrategyParams = FunctionArguments<typeof amoStrategy>
export type AmoStrategyReturn = FunctionReturn<typeof amoStrategy>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** harvest() */
export const harvest = func('0x4641257d', {})
export type HarvestParams = FunctionArguments<typeof harvest>
export type HarvestReturn = FunctionReturn<typeof harvest>

/** harvestAndSwap(uint256,uint256,uint256,bool) */
export const harvestAndSwap = func('0x859e4b81', {
    aeroToSwap: uint256,
    minWETHExpected: uint256,
    feeBps: uint256,
    sendYieldToDripper: bool,
})
export type HarvestAndSwapParams = FunctionArguments<typeof harvestAndSwap>
export type HarvestAndSwapReturn = FunctionReturn<typeof harvestAndSwap>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** operatorAddr() */
export const operatorAddr = func('0xf3f18c37', {}, address)
export type OperatorAddrParams = FunctionArguments<typeof operatorAddr>
export type OperatorAddrReturn = FunctionReturn<typeof operatorAddr>

/** setOperatorAddr(address) */
export const setOperatorAddr = func('0x9e428552', {
    _operatorAddr: address,
})
export type SetOperatorAddrParams = FunctionArguments<typeof setOperatorAddr>
export type SetOperatorAddrReturn = FunctionReturn<typeof setOperatorAddr>

/** swapRouter() */
export const swapRouter = func('0xc31c9c07', {}, address)
export type SwapRouterParams = FunctionArguments<typeof swapRouter>
export type SwapRouterReturn = FunctionReturn<typeof swapRouter>

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

/** vault() */
export const vault = func('0xfbfa77cf', {}, address)
export type VaultParams = FunctionArguments<typeof vault>
export type VaultReturn = FunctionReturn<typeof vault>

/** weth() */
export const weth = func('0x3fc8cef3', {}, address)
export type WethParams = FunctionArguments<typeof weth>
export type WethReturn = FunctionReturn<typeof weth>
