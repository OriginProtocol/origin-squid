import { address, array, bool, bytes, bytes32, int128, int16, int24, int256, int56, struct, uint128, uint16, uint160, uint24, uint256, uint32 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** burn(int24,int24,uint128,address) */
export const burn = func('0x6f89244c', {
    tickLower: int24,
    tickUpper: int24,
    amount: uint128,
    owner: address,
}, struct({
    amount0: uint256,
    amount1: uint256,
}))
export type BurnParams = FunctionArguments<typeof burn>
export type BurnReturn = FunctionReturn<typeof burn>

/** burn(int24,int24,uint128) */
export const burn_1 = func('0xa34123a7', {
    tickLower: int24,
    tickUpper: int24,
    amount: uint128,
}, struct({
    amount0: uint256,
    amount1: uint256,
}))
export type BurnParams_1 = FunctionArguments<typeof burn_1>
export type BurnReturn_1 = FunctionReturn<typeof burn_1>

/** collect(address,int24,int24,uint128,uint128,address) */
export const collect = func('0x31338374', {
    recipient: address,
    tickLower: int24,
    tickUpper: int24,
    amount0Requested: uint128,
    amount1Requested: uint128,
    owner: address,
}, struct({
    amount0: uint128,
    amount1: uint128,
}))
export type CollectParams = FunctionArguments<typeof collect>
export type CollectReturn = FunctionReturn<typeof collect>

/** collect(address,int24,int24,uint128,uint128) */
export const collect_1 = func('0x4f1eb3d8', {
    recipient: address,
    tickLower: int24,
    tickUpper: int24,
    amount0Requested: uint128,
    amount1Requested: uint128,
}, struct({
    amount0: uint128,
    amount1: uint128,
}))
export type CollectParams_1 = FunctionArguments<typeof collect_1>
export type CollectReturn_1 = FunctionReturn<typeof collect_1>

/** collectFees() */
export const collectFees = func('0xc8796572', {}, struct({
    amount0: uint128,
    amount1: uint128,
}))
export type CollectFeesParams = FunctionArguments<typeof collectFees>
export type CollectFeesReturn = FunctionReturn<typeof collectFees>

/** factory() */
export const factory = func('0xc45a0155', {}, address)
export type FactoryParams = FunctionArguments<typeof factory>
export type FactoryReturn = FunctionReturn<typeof factory>

/** factoryRegistry() */
export const factoryRegistry = func('0x3bf0c9fb', {}, address)
export type FactoryRegistryParams = FunctionArguments<typeof factoryRegistry>
export type FactoryRegistryReturn = FunctionReturn<typeof factoryRegistry>

/** fee() */
export const fee = func('0xddca3f43', {}, uint24)
export type FeeParams = FunctionArguments<typeof fee>
export type FeeReturn = FunctionReturn<typeof fee>

/** feeGrowthGlobal0X128() */
export const feeGrowthGlobal0X128 = func('0xf3058399', {}, uint256)
export type FeeGrowthGlobal0X128Params = FunctionArguments<typeof feeGrowthGlobal0X128>
export type FeeGrowthGlobal0X128Return = FunctionReturn<typeof feeGrowthGlobal0X128>

/** feeGrowthGlobal1X128() */
export const feeGrowthGlobal1X128 = func('0x46141319', {}, uint256)
export type FeeGrowthGlobal1X128Params = FunctionArguments<typeof feeGrowthGlobal1X128>
export type FeeGrowthGlobal1X128Return = FunctionReturn<typeof feeGrowthGlobal1X128>

/** flash(address,uint256,uint256,bytes) */
export const flash = func('0x490e6cbc', {
    recipient: address,
    amount0: uint256,
    amount1: uint256,
    data: bytes,
})
export type FlashParams = FunctionArguments<typeof flash>
export type FlashReturn = FunctionReturn<typeof flash>

/** gauge() */
export const gauge = func('0xa6f19c84', {}, address)
export type GaugeParams = FunctionArguments<typeof gauge>
export type GaugeReturn = FunctionReturn<typeof gauge>

/** gaugeFees() */
export const gaugeFees = func('0x293833ba', {}, struct({
    token0: uint128,
    token1: uint128,
}))
export type GaugeFeesParams = FunctionArguments<typeof gaugeFees>
export type GaugeFeesReturn = FunctionReturn<typeof gaugeFees>

/** getRewardGrowthInside(int24,int24,uint256) */
export const getRewardGrowthInside = func('0xa16368c9', {
    tickLower: int24,
    tickUpper: int24,
    _rewardGrowthGlobalX128: uint256,
}, uint256)
export type GetRewardGrowthInsideParams = FunctionArguments<typeof getRewardGrowthInside>
export type GetRewardGrowthInsideReturn = FunctionReturn<typeof getRewardGrowthInside>

/** increaseObservationCardinalityNext(uint16) */
export const increaseObservationCardinalityNext = func('0x32148f67', {
    observationCardinalityNext: uint16,
})
export type IncreaseObservationCardinalityNextParams = FunctionArguments<typeof increaseObservationCardinalityNext>
export type IncreaseObservationCardinalityNextReturn = FunctionReturn<typeof increaseObservationCardinalityNext>

/** initialize(address,address,address,int24,address,uint160) */
export const initialize = func('0x2071d884', {
    _factory: address,
    _token0: address,
    _token1: address,
    _tickSpacing: int24,
    _factoryRegistry: address,
    _sqrtPriceX96: uint160,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** lastUpdated() */
export const lastUpdated = func('0xd0b06f5d', {}, uint32)
export type LastUpdatedParams = FunctionArguments<typeof lastUpdated>
export type LastUpdatedReturn = FunctionReturn<typeof lastUpdated>

/** liquidity() */
export const liquidity = func('0x1a686502', {}, uint128)
export type LiquidityParams = FunctionArguments<typeof liquidity>
export type LiquidityReturn = FunctionReturn<typeof liquidity>

/** maxLiquidityPerTick() */
export const maxLiquidityPerTick = func('0x70cf754a', {}, uint128)
export type MaxLiquidityPerTickParams = FunctionArguments<typeof maxLiquidityPerTick>
export type MaxLiquidityPerTickReturn = FunctionReturn<typeof maxLiquidityPerTick>

/** mint(address,int24,int24,uint128,bytes) */
export const mint = func('0x3c8a7d8d', {
    recipient: address,
    tickLower: int24,
    tickUpper: int24,
    amount: uint128,
    data: bytes,
}, struct({
    amount0: uint256,
    amount1: uint256,
}))
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

/** nft() */
export const nft = func('0x47ccca02', {}, address)
export type NftParams = FunctionArguments<typeof nft>
export type NftReturn = FunctionReturn<typeof nft>

/** observations(uint256) */
export const observations = func('0x252c09d7', {
    _0: uint256,
}, struct({
    blockTimestamp: uint32,
    tickCumulative: int56,
    secondsPerLiquidityCumulativeX128: uint160,
    initialized: bool,
}))
export type ObservationsParams = FunctionArguments<typeof observations>
export type ObservationsReturn = FunctionReturn<typeof observations>

/** observe(uint32[]) */
export const observe = func('0x883bdbfd', {
    secondsAgos: array(uint32),
}, struct({
    tickCumulatives: array(int56),
    secondsPerLiquidityCumulativeX128s: array(uint160),
}))
export type ObserveParams = FunctionArguments<typeof observe>
export type ObserveReturn = FunctionReturn<typeof observe>

/** periodFinish() */
export const periodFinish = func('0xebe2b12b', {}, uint256)
export type PeriodFinishParams = FunctionArguments<typeof periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof periodFinish>

/** positions(bytes32) */
export const positions = func('0x514ea4bf', {
    _0: bytes32,
}, struct({
    liquidity: uint128,
    feeGrowthInside0LastX128: uint256,
    feeGrowthInside1LastX128: uint256,
    tokensOwed0: uint128,
    tokensOwed1: uint128,
}))
export type PositionsParams = FunctionArguments<typeof positions>
export type PositionsReturn = FunctionReturn<typeof positions>

/** rewardGrowthGlobalX128() */
export const rewardGrowthGlobalX128 = func('0x57806ada', {}, uint256)
export type RewardGrowthGlobalX128Params = FunctionArguments<typeof rewardGrowthGlobalX128>
export type RewardGrowthGlobalX128Return = FunctionReturn<typeof rewardGrowthGlobalX128>

/** rewardRate() */
export const rewardRate = func('0x7b0a47ee', {}, uint256)
export type RewardRateParams = FunctionArguments<typeof rewardRate>
export type RewardRateReturn = FunctionReturn<typeof rewardRate>

/** rewardReserve() */
export const rewardReserve = func('0xcab64bcd', {}, uint256)
export type RewardReserveParams = FunctionArguments<typeof rewardReserve>
export type RewardReserveReturn = FunctionReturn<typeof rewardReserve>

/** rollover() */
export const rollover = func('0xb056b49a', {}, uint256)
export type RolloverParams = FunctionArguments<typeof rollover>
export type RolloverReturn = FunctionReturn<typeof rollover>

/** setGaugeAndPositionManager(address,address) */
export const setGaugeAndPositionManager = func('0x1f7c3568', {
    _gauge: address,
    _nft: address,
})
export type SetGaugeAndPositionManagerParams = FunctionArguments<typeof setGaugeAndPositionManager>
export type SetGaugeAndPositionManagerReturn = FunctionReturn<typeof setGaugeAndPositionManager>

/** slot0() */
export const slot0 = func('0x3850c7bd', {}, struct({
    sqrtPriceX96: uint160,
    tick: int24,
    observationIndex: uint16,
    observationCardinality: uint16,
    observationCardinalityNext: uint16,
    unlocked: bool,
}))
export type Slot0Params = FunctionArguments<typeof slot0>
export type Slot0Return = FunctionReturn<typeof slot0>

/** snapshotCumulativesInside(int24,int24) */
export const snapshotCumulativesInside = func('0xa38807f2', {
    tickLower: int24,
    tickUpper: int24,
}, struct({
    tickCumulativeInside: int56,
    secondsPerLiquidityInsideX128: uint160,
    secondsInside: uint32,
}))
export type SnapshotCumulativesInsideParams = FunctionArguments<typeof snapshotCumulativesInside>
export type SnapshotCumulativesInsideReturn = FunctionReturn<typeof snapshotCumulativesInside>

/** stake(int128,int24,int24,bool) */
export const stake = func('0x4ed6210f', {
    stakedLiquidityDelta: int128,
    tickLower: int24,
    tickUpper: int24,
    positionUpdate: bool,
})
export type StakeParams = FunctionArguments<typeof stake>
export type StakeReturn = FunctionReturn<typeof stake>

/** stakedLiquidity() */
export const stakedLiquidity = func('0x3ab04b20', {}, uint128)
export type StakedLiquidityParams = FunctionArguments<typeof stakedLiquidity>
export type StakedLiquidityReturn = FunctionReturn<typeof stakedLiquidity>

/** swap(address,bool,int256,uint160,bytes) */
export const swap = func('0x128acb08', {
    recipient: address,
    zeroForOne: bool,
    amountSpecified: int256,
    sqrtPriceLimitX96: uint160,
    data: bytes,
}, struct({
    amount0: int256,
    amount1: int256,
}))
export type SwapParams = FunctionArguments<typeof swap>
export type SwapReturn = FunctionReturn<typeof swap>

/** syncReward(uint256,uint256,uint256) */
export const syncReward = func('0x60a73f9b', {
    _rewardRate: uint256,
    _rewardReserve: uint256,
    _periodFinish: uint256,
})
export type SyncRewardParams = FunctionArguments<typeof syncReward>
export type SyncRewardReturn = FunctionReturn<typeof syncReward>

/** tickBitmap(int16) */
export const tickBitmap = func('0x5339c296', {
    _0: int16,
}, uint256)
export type TickBitmapParams = FunctionArguments<typeof tickBitmap>
export type TickBitmapReturn = FunctionReturn<typeof tickBitmap>

/** tickSpacing() */
export const tickSpacing = func('0xd0c93a7c', {}, int24)
export type TickSpacingParams = FunctionArguments<typeof tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof tickSpacing>

/** ticks(int24) */
export const ticks = func('0xf30dba93', {
    _0: int24,
}, struct({
    liquidityGross: uint128,
    liquidityNet: int128,
    stakedLiquidityNet: int128,
    feeGrowthOutside0X128: uint256,
    feeGrowthOutside1X128: uint256,
    rewardGrowthOutsideX128: uint256,
    tickCumulativeOutside: int56,
    secondsPerLiquidityOutsideX128: uint160,
    secondsOutside: uint32,
    initialized: bool,
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

/** unstakedFee() */
export const unstakedFee = func('0xb64cc67b', {}, uint24)
export type UnstakedFeeParams = FunctionArguments<typeof unstakedFee>
export type UnstakedFeeReturn = FunctionReturn<typeof unstakedFee>

/** updateRewardsGrowthGlobal() */
export const updateRewardsGrowthGlobal = func('0x1b410960', {})
export type UpdateRewardsGrowthGlobalParams = FunctionArguments<typeof updateRewardsGrowthGlobal>
export type UpdateRewardsGrowthGlobalReturn = FunctionReturn<typeof updateRewardsGrowthGlobal>
