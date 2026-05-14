import { ContractBase } from '../abi.support.js'
import { burn, collect, communityFeeLastTimestamp, communityVault, factory, fee, getCommunityFeePending, getReserves, globalState, isUnlocked, liquidity, maxLiquidityPerTick, mint, nextTickGlobal, plugin, positions, prevTickGlobal, safelyGetStateOfAMM, swap, swapWithPaymentInAdvance, tickSpacing, tickTable, tickTreeRoot, tickTreeSecondLayer, ticks, token0, token1, totalFeeGrowth0Token, totalFeeGrowth1Token } from './functions.js'
import type { BurnParams, CollectParams, MintParams, PositionsParams, SwapParams, SwapWithPaymentInAdvanceParams, TickTableParams, TickTreeSecondLayerParams, TicksParams } from './functions.js'

export class Contract extends ContractBase {
    burn(bottomTick: BurnParams["bottomTick"], topTick: BurnParams["topTick"], amount: BurnParams["amount"], data: BurnParams["data"]) {
        return this.eth_call(burn, {bottomTick, topTick, amount, data})
    }

    collect(recipient: CollectParams["recipient"], bottomTick: CollectParams["bottomTick"], topTick: CollectParams["topTick"], amount0Requested: CollectParams["amount0Requested"], amount1Requested: CollectParams["amount1Requested"]) {
        return this.eth_call(collect, {recipient, bottomTick, topTick, amount0Requested, amount1Requested})
    }

    communityFeeLastTimestamp() {
        return this.eth_call(communityFeeLastTimestamp, {})
    }

    communityVault() {
        return this.eth_call(communityVault, {})
    }

    factory() {
        return this.eth_call(factory, {})
    }

    fee() {
        return this.eth_call(fee, {})
    }

    getCommunityFeePending() {
        return this.eth_call(getCommunityFeePending, {})
    }

    getReserves() {
        return this.eth_call(getReserves, {})
    }

    globalState() {
        return this.eth_call(globalState, {})
    }

    isUnlocked() {
        return this.eth_call(isUnlocked, {})
    }

    liquidity() {
        return this.eth_call(liquidity, {})
    }

    maxLiquidityPerTick() {
        return this.eth_call(maxLiquidityPerTick, {})
    }

    mint(leftoversRecipient: MintParams["leftoversRecipient"], recipient: MintParams["recipient"], bottomTick: MintParams["bottomTick"], topTick: MintParams["topTick"], liquidityDesired: MintParams["liquidityDesired"], data: MintParams["data"]) {
        return this.eth_call(mint, {leftoversRecipient, recipient, bottomTick, topTick, liquidityDesired, data})
    }

    nextTickGlobal() {
        return this.eth_call(nextTickGlobal, {})
    }

    plugin() {
        return this.eth_call(plugin, {})
    }

    positions(_0: PositionsParams["_0"]) {
        return this.eth_call(positions, {_0})
    }

    prevTickGlobal() {
        return this.eth_call(prevTickGlobal, {})
    }

    safelyGetStateOfAMM() {
        return this.eth_call(safelyGetStateOfAMM, {})
    }

    swap(recipient: SwapParams["recipient"], zeroToOne: SwapParams["zeroToOne"], amountRequired: SwapParams["amountRequired"], limitSqrtPrice: SwapParams["limitSqrtPrice"], data: SwapParams["data"]) {
        return this.eth_call(swap, {recipient, zeroToOne, amountRequired, limitSqrtPrice, data})
    }

    swapWithPaymentInAdvance(leftoversRecipient: SwapWithPaymentInAdvanceParams["leftoversRecipient"], recipient: SwapWithPaymentInAdvanceParams["recipient"], zeroToOne: SwapWithPaymentInAdvanceParams["zeroToOne"], amountToSell: SwapWithPaymentInAdvanceParams["amountToSell"], limitSqrtPrice: SwapWithPaymentInAdvanceParams["limitSqrtPrice"], data: SwapWithPaymentInAdvanceParams["data"]) {
        return this.eth_call(swapWithPaymentInAdvance, {leftoversRecipient, recipient, zeroToOne, amountToSell, limitSqrtPrice, data})
    }

    tickSpacing() {
        return this.eth_call(tickSpacing, {})
    }

    tickTable(_0: TickTableParams["_0"]) {
        return this.eth_call(tickTable, {_0})
    }

    tickTreeRoot() {
        return this.eth_call(tickTreeRoot, {})
    }

    tickTreeSecondLayer(_0: TickTreeSecondLayerParams["_0"]) {
        return this.eth_call(tickTreeSecondLayer, {_0})
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

    totalFeeGrowth0Token() {
        return this.eth_call(totalFeeGrowth0Token, {})
    }

    totalFeeGrowth1Token() {
        return this.eth_call(totalFeeGrowth1Token, {})
    }
}
