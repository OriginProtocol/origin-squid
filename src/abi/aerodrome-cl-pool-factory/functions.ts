import { address, array, bool, int24, uint160, uint24, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** allPools(uint256) */
export const allPools = func('0x41d1de97', {
    _0: uint256,
}, address)
export type AllPoolsParams = FunctionArguments<typeof allPools>
export type AllPoolsReturn = FunctionReturn<typeof allPools>

/** allPoolsLength() */
export const allPoolsLength = func('0xefde4e64', {}, uint256)
export type AllPoolsLengthParams = FunctionArguments<typeof allPoolsLength>
export type AllPoolsLengthReturn = FunctionReturn<typeof allPoolsLength>

/** createPool(address,address,int24,uint160) */
export const createPool = func('0x232aa5ac', {
    tokenA: address,
    tokenB: address,
    tickSpacing: int24,
    sqrtPriceX96: uint160,
}, address)
export type CreatePoolParams = FunctionArguments<typeof createPool>
export type CreatePoolReturn = FunctionReturn<typeof createPool>

/** defaultUnstakedFee() */
export const defaultUnstakedFee = func('0xe2824832', {}, uint24)
export type DefaultUnstakedFeeParams = FunctionArguments<typeof defaultUnstakedFee>
export type DefaultUnstakedFeeReturn = FunctionReturn<typeof defaultUnstakedFee>

/** enableTickSpacing(int24,uint24) */
export const enableTickSpacing = func('0xeee0fdb4', {
    tickSpacing: int24,
    fee: uint24,
})
export type EnableTickSpacingParams = FunctionArguments<typeof enableTickSpacing>
export type EnableTickSpacingReturn = FunctionReturn<typeof enableTickSpacing>

/** factoryRegistry() */
export const factoryRegistry = func('0x3bf0c9fb', {}, address)
export type FactoryRegistryParams = FunctionArguments<typeof factoryRegistry>
export type FactoryRegistryReturn = FunctionReturn<typeof factoryRegistry>

/** getPool(address,address,int24) */
export const getPool = func('0x28af8d0b', {
    _0: address,
    _1: address,
    _2: int24,
}, address)
export type GetPoolParams = FunctionArguments<typeof getPool>
export type GetPoolReturn = FunctionReturn<typeof getPool>

/** getSwapFee(address) */
export const getSwapFee = func('0x35458dcc', {
    pool: address,
}, uint24)
export type GetSwapFeeParams = FunctionArguments<typeof getSwapFee>
export type GetSwapFeeReturn = FunctionReturn<typeof getSwapFee>

/** getUnstakedFee(address) */
export const getUnstakedFee = func('0x48cf7a43', {
    pool: address,
}, uint24)
export type GetUnstakedFeeParams = FunctionArguments<typeof getUnstakedFee>
export type GetUnstakedFeeReturn = FunctionReturn<typeof getUnstakedFee>

/** isPool(address) */
export const isPool = func('0x5b16ebb7', {
    pool: address,
}, bool)
export type IsPoolParams = FunctionArguments<typeof isPool>
export type IsPoolReturn = FunctionReturn<typeof isPool>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** poolImplementation() */
export const poolImplementation = func('0xcefa7799', {}, address)
export type PoolImplementationParams = FunctionArguments<typeof poolImplementation>
export type PoolImplementationReturn = FunctionReturn<typeof poolImplementation>

/** setDefaultUnstakedFee(uint24) */
export const setDefaultUnstakedFee = func('0xa2f97f42', {
    _defaultUnstakedFee: uint24,
})
export type SetDefaultUnstakedFeeParams = FunctionArguments<typeof setDefaultUnstakedFee>
export type SetDefaultUnstakedFeeReturn = FunctionReturn<typeof setDefaultUnstakedFee>

/** setOwner(address) */
export const setOwner = func('0x13af4035', {
    _owner: address,
})
export type SetOwnerParams = FunctionArguments<typeof setOwner>
export type SetOwnerReturn = FunctionReturn<typeof setOwner>

/** setSwapFeeManager(address) */
export const setSwapFeeManager = func('0xffb4d9d1', {
    _swapFeeManager: address,
})
export type SetSwapFeeManagerParams = FunctionArguments<typeof setSwapFeeManager>
export type SetSwapFeeManagerReturn = FunctionReturn<typeof setSwapFeeManager>

/** setSwapFeeModule(address) */
export const setSwapFeeModule = func('0x61b9c3ec', {
    _swapFeeModule: address,
})
export type SetSwapFeeModuleParams = FunctionArguments<typeof setSwapFeeModule>
export type SetSwapFeeModuleReturn = FunctionReturn<typeof setSwapFeeModule>

/** setUnstakedFeeManager(address) */
export const setUnstakedFeeManager = func('0x93ce8627', {
    _unstakedFeeManager: address,
})
export type SetUnstakedFeeManagerParams = FunctionArguments<typeof setUnstakedFeeManager>
export type SetUnstakedFeeManagerReturn = FunctionReturn<typeof setUnstakedFeeManager>

/** setUnstakedFeeModule(address) */
export const setUnstakedFeeModule = func('0x1b31d878', {
    _unstakedFeeModule: address,
})
export type SetUnstakedFeeModuleParams = FunctionArguments<typeof setUnstakedFeeModule>
export type SetUnstakedFeeModuleReturn = FunctionReturn<typeof setUnstakedFeeModule>

/** swapFeeManager() */
export const swapFeeManager = func('0xd574afa9', {}, address)
export type SwapFeeManagerParams = FunctionArguments<typeof swapFeeManager>
export type SwapFeeManagerReturn = FunctionReturn<typeof swapFeeManager>

/** swapFeeModule() */
export const swapFeeModule = func('0x23c43a51', {}, address)
export type SwapFeeModuleParams = FunctionArguments<typeof swapFeeModule>
export type SwapFeeModuleReturn = FunctionReturn<typeof swapFeeModule>

/** tickSpacingToFee(int24) */
export const tickSpacingToFee = func('0x380dc1c2', {
    _0: int24,
}, uint24)
export type TickSpacingToFeeParams = FunctionArguments<typeof tickSpacingToFee>
export type TickSpacingToFeeReturn = FunctionReturn<typeof tickSpacingToFee>

/** tickSpacings() */
export const tickSpacings = func('0x9cbbbe86', {}, array(int24))
export type TickSpacingsParams = FunctionArguments<typeof tickSpacings>
export type TickSpacingsReturn = FunctionReturn<typeof tickSpacings>

/** unstakedFeeManager() */
export const unstakedFeeManager = func('0x82e189e0', {}, address)
export type UnstakedFeeManagerParams = FunctionArguments<typeof unstakedFeeManager>
export type UnstakedFeeManagerReturn = FunctionReturn<typeof unstakedFeeManager>

/** unstakedFeeModule() */
export const unstakedFeeModule = func('0x7693bc11', {}, address)
export type UnstakedFeeModuleParams = FunctionArguments<typeof unstakedFeeModule>
export type UnstakedFeeModuleReturn = FunctionReturn<typeof unstakedFeeModule>

/** voter() */
export const voter = func('0x46c96aac', {}, address)
export type VoterParams = FunctionArguments<typeof voter>
export type VoterReturn = FunctionReturn<typeof voter>
