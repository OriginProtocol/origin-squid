import { address, int24, struct, uint160, uint24, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** accessHub() */
export const accessHub = func('0xe7589b39', {}, address)
export type AccessHubParams = FunctionArguments<typeof accessHub>
export type AccessHubReturn = FunctionReturn<typeof accessHub>

/** createPool(address,address,int24,uint160) */
export const createPool = func('0x232aa5ac', {
    tokenA: address,
    tokenB: address,
    tickSpacing: int24,
    sqrtPriceX96: uint160,
}, address)
export type CreatePoolParams = FunctionArguments<typeof createPool>
export type CreatePoolReturn = FunctionReturn<typeof createPool>

/** enableTickSpacing(int24,uint24) */
export const enableTickSpacing = func('0xeee0fdb4', {
    tickSpacing: int24,
    initialFee: uint24,
})
export type EnableTickSpacingParams = FunctionArguments<typeof enableTickSpacing>
export type EnableTickSpacingReturn = FunctionReturn<typeof enableTickSpacing>

/** feeCollector() */
export const feeCollector = func('0xc415b95c', {}, address)
export type FeeCollectorParams = FunctionArguments<typeof feeCollector>
export type FeeCollectorReturn = FunctionReturn<typeof feeCollector>

/** feeProtocol() */
export const feeProtocol = func('0x527eb4bc', {}, uint8)
export type FeeProtocolParams = FunctionArguments<typeof feeProtocol>
export type FeeProtocolReturn = FunctionReturn<typeof feeProtocol>

/** gaugeFeeSplitEnable(address) */
export const gaugeFeeSplitEnable = func('0x3cb08b53', {
    pool: address,
})
export type GaugeFeeSplitEnableParams = FunctionArguments<typeof gaugeFeeSplitEnable>
export type GaugeFeeSplitEnableReturn = FunctionReturn<typeof gaugeFeeSplitEnable>

/** getPool(address,address,int24) */
export const getPool = func('0x28af8d0b', {
    tokenA: address,
    tokenB: address,
    tickSpacing: int24,
}, address)
export type GetPoolParams = FunctionArguments<typeof getPool>
export type GetPoolReturn = FunctionReturn<typeof getPool>

/** initialize(address) */
export const initialize = func('0xc4d66de8', {
    _ramsesV3PoolDeployer: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** parameters() */
export const parameters = func('0x89035730', {}, struct({
    factory: address,
    token0: address,
    token1: address,
    fee: uint24,
    tickSpacing: int24,
}))
export type ParametersParams = FunctionArguments<typeof parameters>
export type ParametersReturn = FunctionReturn<typeof parameters>

/** poolFeeProtocol(address) */
export const poolFeeProtocol = func('0xebb0d9f7', {
    pool: address,
}, uint8)
export type PoolFeeProtocolParams = FunctionArguments<typeof poolFeeProtocol>
export type PoolFeeProtocolReturn = FunctionReturn<typeof poolFeeProtocol>

/** ramsesV3PoolDeployer() */
export const ramsesV3PoolDeployer = func('0xbf49a292', {}, address)
export type RamsesV3PoolDeployerParams = FunctionArguments<typeof ramsesV3PoolDeployer>
export type RamsesV3PoolDeployerReturn = FunctionReturn<typeof ramsesV3PoolDeployer>

/** setFee(address,uint24) */
export const setFee = func('0xba364c3d', {
    _pool: address,
    _fee: uint24,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setFeeCollector(address) */
export const setFeeCollector = func('0xa42dce80', {
    _feeCollector: address,
})
export type SetFeeCollectorParams = FunctionArguments<typeof setFeeCollector>
export type SetFeeCollectorReturn = FunctionReturn<typeof setFeeCollector>

/** setFeeProtocol(uint8) */
export const setFeeProtocol = func('0xb613a141', {
    _feeProtocol: uint8,
})
export type SetFeeProtocolParams = FunctionArguments<typeof setFeeProtocol>
export type SetFeeProtocolReturn = FunctionReturn<typeof setFeeProtocol>

/** setPoolFeeProtocol(address,uint8) */
export const setPoolFeeProtocol = func('0x76734e3e', {
    pool: address,
    _feeProtocol: uint8,
})
export type SetPoolFeeProtocolParams = FunctionArguments<typeof setPoolFeeProtocol>
export type SetPoolFeeProtocolReturn = FunctionReturn<typeof setPoolFeeProtocol>

/** setVoter(address) */
export const setVoter = func('0x4bc2a657', {
    _voter: address,
})
export type SetVoterParams = FunctionArguments<typeof setVoter>
export type SetVoterReturn = FunctionReturn<typeof setVoter>

/** tickSpacingInitialFee(int24) */
export const tickSpacingInitialFee = func('0xcf3a52a6', {
    tickSpacing: int24,
}, uint24)
export type TickSpacingInitialFeeParams = FunctionArguments<typeof tickSpacingInitialFee>
export type TickSpacingInitialFeeReturn = FunctionReturn<typeof tickSpacingInitialFee>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>
