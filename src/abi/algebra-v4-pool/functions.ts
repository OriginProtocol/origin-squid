import { address, bool, bytes, bytes32, int128, int16, int24, int256, struct, uint128, uint16, uint160, uint256, uint32, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** burn(int24,int24,uint128,bytes) */
export const burn = func('0x3b3bc70e', {
    bottomTick: int24,
    topTick: int24,
    amount: uint128,
    data: bytes,
}, struct({
    amount0: uint256,
    amount1: uint256,
}))
export type BurnParams = FunctionArguments<typeof burn>
export type BurnReturn = FunctionReturn<typeof burn>

/** collect(address,int24,int24,uint128,uint128) */
export const collect = func('0x4f1eb3d8', {
    recipient: address,
    bottomTick: int24,
    topTick: int24,
    amount0Requested: uint128,
    amount1Requested: uint128,
}, struct({
    amount0: uint128,
    amount1: uint128,
}))
export type CollectParams = FunctionArguments<typeof collect>
export type CollectReturn = FunctionReturn<typeof collect>

/** communityFeeLastTimestamp() */
export const communityFeeLastTimestamp = func('0x1131b110', {}, uint32)
export type CommunityFeeLastTimestampParams = FunctionArguments<typeof communityFeeLastTimestamp>
export type CommunityFeeLastTimestampReturn = FunctionReturn<typeof communityFeeLastTimestamp>

/** communityVault() */
export const communityVault = func('0x53e97868', {}, address)
export type CommunityVaultParams = FunctionArguments<typeof communityVault>
export type CommunityVaultReturn = FunctionReturn<typeof communityVault>

/** factory() */
export const factory = func('0xc45a0155', {}, address)
export type FactoryParams = FunctionArguments<typeof factory>
export type FactoryReturn = FunctionReturn<typeof factory>

/** fee() */
export const fee = func('0xddca3f43', {}, uint16)
export type FeeParams = FunctionArguments<typeof fee>
export type FeeReturn = FunctionReturn<typeof fee>

/** flash(address,uint256,uint256,bytes) */
export const flash = func('0x490e6cbc', {
    recipient: address,
    amount0: uint256,
    amount1: uint256,
    data: bytes,
})
export type FlashParams = FunctionArguments<typeof flash>
export type FlashReturn = FunctionReturn<typeof flash>

/** getCommunityFeePending() */
export const getCommunityFeePending = func('0x7bd78025', {}, struct({
    _0: uint128,
    _1: uint128,
}))
export type GetCommunityFeePendingParams = FunctionArguments<typeof getCommunityFeePending>
export type GetCommunityFeePendingReturn = FunctionReturn<typeof getCommunityFeePending>

/** getReserves() */
export const getReserves = func('0x0902f1ac', {}, struct({
    _0: uint128,
    _1: uint128,
}))
export type GetReservesParams = FunctionArguments<typeof getReserves>
export type GetReservesReturn = FunctionReturn<typeof getReserves>

/** globalState() */
export const globalState = func('0xe76c01e4', {}, struct({
    price: uint160,
    tick: int24,
    lastFee: uint16,
    pluginConfig: uint8,
    communityFee: uint16,
    unlocked: bool,
}))
export type GlobalStateParams = FunctionArguments<typeof globalState>
export type GlobalStateReturn = FunctionReturn<typeof globalState>

/** initialize(uint160) */
export const initialize = func('0xf637731d', {
    initialPrice: uint160,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isUnlocked() */
export const isUnlocked = func('0x8380edb7', {}, bool)
export type IsUnlockedParams = FunctionArguments<typeof isUnlocked>
export type IsUnlockedReturn = FunctionReturn<typeof isUnlocked>

/** liquidity() */
export const liquidity = func('0x1a686502', {}, uint128)
export type LiquidityParams = FunctionArguments<typeof liquidity>
export type LiquidityReturn = FunctionReturn<typeof liquidity>

/** maxLiquidityPerTick() */
export const maxLiquidityPerTick = func('0x70cf754a', {}, uint128)
export type MaxLiquidityPerTickParams = FunctionArguments<typeof maxLiquidityPerTick>
export type MaxLiquidityPerTickReturn = FunctionReturn<typeof maxLiquidityPerTick>

/** mint(address,address,int24,int24,uint128,bytes) */
export const mint = func('0xaafe29c0', {
    leftoversRecipient: address,
    recipient: address,
    bottomTick: int24,
    topTick: int24,
    liquidityDesired: uint128,
    data: bytes,
}, struct({
    amount0: uint256,
    amount1: uint256,
    liquidityActual: uint128,
}))
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

/** nextTickGlobal() */
export const nextTickGlobal = func('0xd5c35a7e', {}, int24)
export type NextTickGlobalParams = FunctionArguments<typeof nextTickGlobal>
export type NextTickGlobalReturn = FunctionReturn<typeof nextTickGlobal>

/** plugin() */
export const plugin = func('0xef01df4f', {}, address)
export type PluginParams = FunctionArguments<typeof plugin>
export type PluginReturn = FunctionReturn<typeof plugin>

/** positions(bytes32) */
export const positions = func('0x514ea4bf', {
    _0: bytes32,
}, struct({
    liquidity: uint256,
    innerFeeGrowth0Token: uint256,
    innerFeeGrowth1Token: uint256,
    fees0: uint128,
    fees1: uint128,
}))
export type PositionsParams = FunctionArguments<typeof positions>
export type PositionsReturn = FunctionReturn<typeof positions>

/** prevTickGlobal() */
export const prevTickGlobal = func('0x050a4d21', {}, int24)
export type PrevTickGlobalParams = FunctionArguments<typeof prevTickGlobal>
export type PrevTickGlobalReturn = FunctionReturn<typeof prevTickGlobal>

/** safelyGetStateOfAMM() */
export const safelyGetStateOfAMM = func('0x97ce1c51', {}, struct({
    sqrtPrice: uint160,
    tick: int24,
    lastFee: uint16,
    pluginConfig: uint8,
    activeLiquidity: uint128,
    nextTick: int24,
    previousTick: int24,
}))
export type SafelyGetStateOfAMMParams = FunctionArguments<typeof safelyGetStateOfAMM>
export type SafelyGetStateOfAMMReturn = FunctionReturn<typeof safelyGetStateOfAMM>

/** setCommunityFee(uint16) */
export const setCommunityFee = func('0x240a875a', {
    newCommunityFee: uint16,
})
export type SetCommunityFeeParams = FunctionArguments<typeof setCommunityFee>
export type SetCommunityFeeReturn = FunctionReturn<typeof setCommunityFee>

/** setCommunityVault(address) */
export const setCommunityVault = func('0xd8544cf3', {
    newCommunityVault: address,
})
export type SetCommunityVaultParams = FunctionArguments<typeof setCommunityVault>
export type SetCommunityVaultReturn = FunctionReturn<typeof setCommunityVault>

/** setFee(uint16) */
export const setFee = func('0x8e005553', {
    newFee: uint16,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setPlugin(address) */
export const setPlugin = func('0xcc1f97cf', {
    newPluginAddress: address,
})
export type SetPluginParams = FunctionArguments<typeof setPlugin>
export type SetPluginReturn = FunctionReturn<typeof setPlugin>

/** setPluginConfig(uint8) */
export const setPluginConfig = func('0xbca57f81', {
    newConfig: uint8,
})
export type SetPluginConfigParams = FunctionArguments<typeof setPluginConfig>
export type SetPluginConfigReturn = FunctionReturn<typeof setPluginConfig>

/** setTickSpacing(int24) */
export const setTickSpacing = func('0xf085a610', {
    newTickSpacing: int24,
})
export type SetTickSpacingParams = FunctionArguments<typeof setTickSpacing>
export type SetTickSpacingReturn = FunctionReturn<typeof setTickSpacing>

/** swap(address,bool,int256,uint160,bytes) */
export const swap = func('0x128acb08', {
    recipient: address,
    zeroToOne: bool,
    amountRequired: int256,
    limitSqrtPrice: uint160,
    data: bytes,
}, struct({
    amount0: int256,
    amount1: int256,
}))
export type SwapParams = FunctionArguments<typeof swap>
export type SwapReturn = FunctionReturn<typeof swap>

/** swapWithPaymentInAdvance(address,address,bool,int256,uint160,bytes) */
export const swapWithPaymentInAdvance = func('0x9e4e0227', {
    leftoversRecipient: address,
    recipient: address,
    zeroToOne: bool,
    amountToSell: int256,
    limitSqrtPrice: uint160,
    data: bytes,
}, struct({
    amount0: int256,
    amount1: int256,
}))
export type SwapWithPaymentInAdvanceParams = FunctionArguments<typeof swapWithPaymentInAdvance>
export type SwapWithPaymentInAdvanceReturn = FunctionReturn<typeof swapWithPaymentInAdvance>

/** tickSpacing() */
export const tickSpacing = func('0xd0c93a7c', {}, int24)
export type TickSpacingParams = FunctionArguments<typeof tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof tickSpacing>

/** tickTable(int16) */
export const tickTable = func('0xc677e3e0', {
    _0: int16,
}, uint256)
export type TickTableParams = FunctionArguments<typeof tickTable>
export type TickTableReturn = FunctionReturn<typeof tickTable>

/** tickTreeRoot() */
export const tickTreeRoot = func('0x578b9a36', {}, uint32)
export type TickTreeRootParams = FunctionArguments<typeof tickTreeRoot>
export type TickTreeRootReturn = FunctionReturn<typeof tickTreeRoot>

/** tickTreeSecondLayer(int16) */
export const tickTreeSecondLayer = func('0xd8619037', {
    _0: int16,
}, uint256)
export type TickTreeSecondLayerParams = FunctionArguments<typeof tickTreeSecondLayer>
export type TickTreeSecondLayerReturn = FunctionReturn<typeof tickTreeSecondLayer>

/** ticks(int24) */
export const ticks = func('0xf30dba93', {
    _0: int24,
}, struct({
    liquidityTotal: uint256,
    liquidityDelta: int128,
    prevTick: int24,
    nextTick: int24,
    outerFeeGrowth0Token: uint256,
    outerFeeGrowth1Token: uint256,
}))
export type TicksParams = FunctionArguments<typeof ticks>
export type TicksReturn = FunctionReturn<typeof ticks>

/** token0() */
export const token0 = func('0x0dfe1681', {}, address)
export type Token0Params = FunctionArguments<typeof token0>
export type Token0Return = FunctionReturn<typeof token0>

/** token1() */
export const token1 = func('0xd21220a7', {}, address)
export type Token1Params = FunctionArguments<typeof token1>
export type Token1Return = FunctionReturn<typeof token1>

/** totalFeeGrowth0Token() */
export const totalFeeGrowth0Token = func('0x6378ae44', {}, uint256)
export type TotalFeeGrowth0TokenParams = FunctionArguments<typeof totalFeeGrowth0Token>
export type TotalFeeGrowth0TokenReturn = FunctionReturn<typeof totalFeeGrowth0Token>

/** totalFeeGrowth1Token() */
export const totalFeeGrowth1Token = func('0xecdecf42', {}, uint256)
export type TotalFeeGrowth1TokenParams = FunctionArguments<typeof totalFeeGrowth1Token>
export type TotalFeeGrowth1TokenReturn = FunctionReturn<typeof totalFeeGrowth1Token>
