import { ContractBase } from '../abi.support.js'
import { burn, burn_1, collect, collectFees, collect_1, factory, factoryRegistry, fee, feeGrowthGlobal0X128, feeGrowthGlobal1X128, gauge, gaugeFees, getRewardGrowthInside, lastUpdated, liquidity, maxLiquidityPerTick, mint, nft, observations, observe, periodFinish, positions, rewardGrowthGlobalX128, rewardRate, rewardReserve, rollover, slot0, snapshotCumulativesInside, stakedLiquidity, swap, tickBitmap, tickSpacing, ticks, token0, token1, unstakedFee } from './functions.js'
import type { BurnParams, BurnParams_1, CollectParams, CollectParams_1, GetRewardGrowthInsideParams, MintParams, ObservationsParams, ObserveParams, PositionsParams, SnapshotCumulativesInsideParams, SwapParams, TickBitmapParams, TicksParams } from './functions.js'

export class Contract extends ContractBase {
    burn(tickLower: BurnParams["tickLower"], tickUpper: BurnParams["tickUpper"], amount: BurnParams["amount"], owner: BurnParams["owner"]) {
        return this.eth_call(burn, {tickLower, tickUpper, amount, owner})
    }

    burn_1(tickLower: BurnParams_1["tickLower"], tickUpper: BurnParams_1["tickUpper"], amount: BurnParams_1["amount"]) {
        return this.eth_call(burn_1, {tickLower, tickUpper, amount})
    }

    collect(recipient: CollectParams["recipient"], tickLower: CollectParams["tickLower"], tickUpper: CollectParams["tickUpper"], amount0Requested: CollectParams["amount0Requested"], amount1Requested: CollectParams["amount1Requested"], owner: CollectParams["owner"]) {
        return this.eth_call(collect, {recipient, tickLower, tickUpper, amount0Requested, amount1Requested, owner})
    }

    collect_1(recipient: CollectParams_1["recipient"], tickLower: CollectParams_1["tickLower"], tickUpper: CollectParams_1["tickUpper"], amount0Requested: CollectParams_1["amount0Requested"], amount1Requested: CollectParams_1["amount1Requested"]) {
        return this.eth_call(collect_1, {recipient, tickLower, tickUpper, amount0Requested, amount1Requested})
    }

    collectFees() {
        return this.eth_call(collectFees, {})
    }

    factory() {
        return this.eth_call(factory, {})
    }

    factoryRegistry() {
        return this.eth_call(factoryRegistry, {})
    }

    fee() {
        return this.eth_call(fee, {})
    }

    feeGrowthGlobal0X128() {
        return this.eth_call(feeGrowthGlobal0X128, {})
    }

    feeGrowthGlobal1X128() {
        return this.eth_call(feeGrowthGlobal1X128, {})
    }

    gauge() {
        return this.eth_call(gauge, {})
    }

    gaugeFees() {
        return this.eth_call(gaugeFees, {})
    }

    getRewardGrowthInside(tickLower: GetRewardGrowthInsideParams["tickLower"], tickUpper: GetRewardGrowthInsideParams["tickUpper"], _rewardGrowthGlobalX128: GetRewardGrowthInsideParams["_rewardGrowthGlobalX128"]) {
        return this.eth_call(getRewardGrowthInside, {tickLower, tickUpper, _rewardGrowthGlobalX128})
    }

    lastUpdated() {
        return this.eth_call(lastUpdated, {})
    }

    liquidity() {
        return this.eth_call(liquidity, {})
    }

    maxLiquidityPerTick() {
        return this.eth_call(maxLiquidityPerTick, {})
    }

    mint(recipient: MintParams["recipient"], tickLower: MintParams["tickLower"], tickUpper: MintParams["tickUpper"], amount: MintParams["amount"], data: MintParams["data"]) {
        return this.eth_call(mint, {recipient, tickLower, tickUpper, amount, data})
    }

    nft() {
        return this.eth_call(nft, {})
    }

    observations(_0: ObservationsParams["_0"]) {
        return this.eth_call(observations, {_0})
    }

    observe(secondsAgos: ObserveParams["secondsAgos"]) {
        return this.eth_call(observe, {secondsAgos})
    }

    periodFinish() {
        return this.eth_call(periodFinish, {})
    }

    positions(_0: PositionsParams["_0"]) {
        return this.eth_call(positions, {_0})
    }

    rewardGrowthGlobalX128() {
        return this.eth_call(rewardGrowthGlobalX128, {})
    }

    rewardRate() {
        return this.eth_call(rewardRate, {})
    }

    rewardReserve() {
        return this.eth_call(rewardReserve, {})
    }

    rollover() {
        return this.eth_call(rollover, {})
    }

    slot0() {
        return this.eth_call(slot0, {})
    }

    snapshotCumulativesInside(tickLower: SnapshotCumulativesInsideParams["tickLower"], tickUpper: SnapshotCumulativesInsideParams["tickUpper"]) {
        return this.eth_call(snapshotCumulativesInside, {tickLower, tickUpper})
    }

    stakedLiquidity() {
        return this.eth_call(stakedLiquidity, {})
    }

    swap(recipient: SwapParams["recipient"], zeroForOne: SwapParams["zeroForOne"], amountSpecified: SwapParams["amountSpecified"], sqrtPriceLimitX96: SwapParams["sqrtPriceLimitX96"], data: SwapParams["data"]) {
        return this.eth_call(swap, {recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data})
    }

    tickBitmap(_0: TickBitmapParams["_0"]) {
        return this.eth_call(tickBitmap, {_0})
    }

    tickSpacing() {
        return this.eth_call(tickSpacing, {})
    }

    ticks(_0: TicksParams["_0"]) {
        return this.eth_call(ticks, {_0})
    }

    token0() {
        return this.eth_call(token0, {})
    }

    token1() {
        return this.eth_call(token1, {})
    }

    unstakedFee() {
        return this.eth_call(unstakedFee, {})
    }
}
