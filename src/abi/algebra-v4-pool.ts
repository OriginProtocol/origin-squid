import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Burn: event("0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c", "Burn(address,int24,int24,uint128,uint256,uint256)", {"owner": indexed(p.address), "bottomTick": indexed(p.int24), "topTick": indexed(p.int24), "liquidityAmount": p.uint128, "amount0": p.uint256, "amount1": p.uint256}),
    Collect: event("0x70935338e69775456a85ddef226c395fb668b63fa0115f5f20610b388e6ca9c0", "Collect(address,address,int24,int24,uint128,uint128)", {"owner": indexed(p.address), "recipient": p.address, "bottomTick": indexed(p.int24), "topTick": indexed(p.int24), "amount0": p.uint128, "amount1": p.uint128}),
    CommunityFee: event("0x3647dccc990d4941b0b05b32527ef493a98d6187b20639ca2f9743f3b55ca5e1", "CommunityFee(uint16)", {"communityFeeNew": p.uint16}),
    CommunityVault: event("0xb0b573c1f636e1f8bd9b415ba6c04d6dd49100bc25493fc6305b65ec0e581df3", "CommunityVault(address)", {"newCommunityVault": p.address}),
    Fee: event("0x598b9f043c813aa6be3426ca60d1c65d17256312890be5118dab55b0775ebe2a", "Fee(uint16)", {"fee": p.uint16}),
    Flash: event("0xbdbdb71d7860376ba52b25a5028beea23581364a40522f6bcfb86bb1f2dca633", "Flash(address,address,uint256,uint256,uint256,uint256)", {"sender": indexed(p.address), "recipient": indexed(p.address), "amount0": p.uint256, "amount1": p.uint256, "paid0": p.uint256, "paid1": p.uint256}),
    Initialize: event("0x98636036cb66a9c19a37435efc1e90142190214e8abeb821bdba3f2990dd4c95", "Initialize(uint160,int24)", {"price": p.uint160, "tick": p.int24}),
    Mint: event("0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde", "Mint(address,address,int24,int24,uint128,uint256,uint256)", {"sender": p.address, "owner": indexed(p.address), "bottomTick": indexed(p.int24), "topTick": indexed(p.int24), "liquidityAmount": p.uint128, "amount0": p.uint256, "amount1": p.uint256}),
    Plugin: event("0x27a3944eff2135a57675f17e72501038982b73620d01f794c72e93d61a3932a2", "Plugin(address)", {"newPluginAddress": p.address}),
    PluginConfig: event("0x3a6271b36c1b44bd6a0a0d56230602dc6919b7c17af57254306fadf5fee69dc3", "PluginConfig(uint8)", {"newPluginConfig": p.uint8}),
    Swap: event("0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67", "Swap(address,address,int256,int256,uint160,uint128,int24)", {"sender": indexed(p.address), "recipient": indexed(p.address), "amount0": p.int256, "amount1": p.int256, "price": p.uint160, "liquidity": p.uint128, "tick": p.int24}),
    TickSpacing: event("0x01413b1d5d4c359e9a0daa7909ecda165f6e8c51fe2ff529d74b22a5a7c02645", "TickSpacing(int24)", {"newTickSpacing": p.int24}),
}

export const functions = {
    burn: fun("0x3b3bc70e", "burn(int24,int24,uint128,bytes)", {"bottomTick": p.int24, "topTick": p.int24, "amount": p.uint128, "data": p.bytes}, {"amount0": p.uint256, "amount1": p.uint256}),
    collect: fun("0x4f1eb3d8", "collect(address,int24,int24,uint128,uint128)", {"recipient": p.address, "bottomTick": p.int24, "topTick": p.int24, "amount0Requested": p.uint128, "amount1Requested": p.uint128}, {"amount0": p.uint128, "amount1": p.uint128}),
    communityFeeLastTimestamp: viewFun("0x1131b110", "communityFeeLastTimestamp()", {}, p.uint32),
    communityVault: viewFun("0x53e97868", "communityVault()", {}, p.address),
    factory: viewFun("0xc45a0155", "factory()", {}, p.address),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint16),
    flash: fun("0x490e6cbc", "flash(address,uint256,uint256,bytes)", {"recipient": p.address, "amount0": p.uint256, "amount1": p.uint256, "data": p.bytes}, ),
    getCommunityFeePending: viewFun("0x7bd78025", "getCommunityFeePending()", {}, {"_0": p.uint128, "_1": p.uint128}),
    getReserves: viewFun("0x0902f1ac", "getReserves()", {}, {"_0": p.uint128, "_1": p.uint128}),
    globalState: viewFun("0xe76c01e4", "globalState()", {}, {"price": p.uint160, "tick": p.int24, "lastFee": p.uint16, "pluginConfig": p.uint8, "communityFee": p.uint16, "unlocked": p.bool}),
    initialize: fun("0xf637731d", "initialize(uint160)", {"initialPrice": p.uint160}, ),
    isUnlocked: viewFun("0x8380edb7", "isUnlocked()", {}, p.bool),
    liquidity: viewFun("0x1a686502", "liquidity()", {}, p.uint128),
    maxLiquidityPerTick: viewFun("0x70cf754a", "maxLiquidityPerTick()", {}, p.uint128),
    mint: fun("0xaafe29c0", "mint(address,address,int24,int24,uint128,bytes)", {"leftoversRecipient": p.address, "recipient": p.address, "bottomTick": p.int24, "topTick": p.int24, "liquidityDesired": p.uint128, "data": p.bytes}, {"amount0": p.uint256, "amount1": p.uint256, "liquidityActual": p.uint128}),
    nextTickGlobal: viewFun("0xd5c35a7e", "nextTickGlobal()", {}, p.int24),
    plugin: viewFun("0xef01df4f", "plugin()", {}, p.address),
    positions: viewFun("0x514ea4bf", "positions(bytes32)", {"_0": p.bytes32}, {"liquidity": p.uint256, "innerFeeGrowth0Token": p.uint256, "innerFeeGrowth1Token": p.uint256, "fees0": p.uint128, "fees1": p.uint128}),
    prevTickGlobal: viewFun("0x050a4d21", "prevTickGlobal()", {}, p.int24),
    safelyGetStateOfAMM: viewFun("0x97ce1c51", "safelyGetStateOfAMM()", {}, {"sqrtPrice": p.uint160, "tick": p.int24, "lastFee": p.uint16, "pluginConfig": p.uint8, "activeLiquidity": p.uint128, "nextTick": p.int24, "previousTick": p.int24}),
    setCommunityFee: fun("0x240a875a", "setCommunityFee(uint16)", {"newCommunityFee": p.uint16}, ),
    setCommunityVault: fun("0xd8544cf3", "setCommunityVault(address)", {"newCommunityVault": p.address}, ),
    setFee: fun("0x8e005553", "setFee(uint16)", {"newFee": p.uint16}, ),
    setPlugin: fun("0xcc1f97cf", "setPlugin(address)", {"newPluginAddress": p.address}, ),
    setPluginConfig: fun("0xbca57f81", "setPluginConfig(uint8)", {"newConfig": p.uint8}, ),
    setTickSpacing: fun("0xf085a610", "setTickSpacing(int24)", {"newTickSpacing": p.int24}, ),
    swap: fun("0x128acb08", "swap(address,bool,int256,uint160,bytes)", {"recipient": p.address, "zeroToOne": p.bool, "amountRequired": p.int256, "limitSqrtPrice": p.uint160, "data": p.bytes}, {"amount0": p.int256, "amount1": p.int256}),
    swapWithPaymentInAdvance: fun("0x9e4e0227", "swapWithPaymentInAdvance(address,address,bool,int256,uint160,bytes)", {"leftoversRecipient": p.address, "recipient": p.address, "zeroToOne": p.bool, "amountToSell": p.int256, "limitSqrtPrice": p.uint160, "data": p.bytes}, {"amount0": p.int256, "amount1": p.int256}),
    tickSpacing: viewFun("0xd0c93a7c", "tickSpacing()", {}, p.int24),
    tickTable: viewFun("0xc677e3e0", "tickTable(int16)", {"_0": p.int16}, p.uint256),
    tickTreeRoot: viewFun("0x578b9a36", "tickTreeRoot()", {}, p.uint32),
    tickTreeSecondLayer: viewFun("0xd8619037", "tickTreeSecondLayer(int16)", {"_0": p.int16}, p.uint256),
    ticks: viewFun("0xf30dba93", "ticks(int24)", {"_0": p.int24}, {"liquidityTotal": p.uint256, "liquidityDelta": p.int128, "prevTick": p.int24, "nextTick": p.int24, "outerFeeGrowth0Token": p.uint256, "outerFeeGrowth1Token": p.uint256}),
    token0: viewFun("0x0dfe1681", "token0()", {}, p.address),
    token1: viewFun("0xd21220a7", "token1()", {}, p.address),
    totalFeeGrowth0Token: viewFun("0x6378ae44", "totalFeeGrowth0Token()", {}, p.uint256),
    totalFeeGrowth1Token: viewFun("0xecdecf42", "totalFeeGrowth1Token()", {}, p.uint256),
}

export class Contract extends ContractBase {

    communityFeeLastTimestamp() {
        return this.eth_call(functions.communityFeeLastTimestamp, {})
    }

    communityVault() {
        return this.eth_call(functions.communityVault, {})
    }

    factory() {
        return this.eth_call(functions.factory, {})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    getCommunityFeePending() {
        return this.eth_call(functions.getCommunityFeePending, {})
    }

    getReserves() {
        return this.eth_call(functions.getReserves, {})
    }

    globalState() {
        return this.eth_call(functions.globalState, {})
    }

    isUnlocked() {
        return this.eth_call(functions.isUnlocked, {})
    }

    liquidity() {
        return this.eth_call(functions.liquidity, {})
    }

    maxLiquidityPerTick() {
        return this.eth_call(functions.maxLiquidityPerTick, {})
    }

    nextTickGlobal() {
        return this.eth_call(functions.nextTickGlobal, {})
    }

    plugin() {
        return this.eth_call(functions.plugin, {})
    }

    positions(_0: PositionsParams["_0"]) {
        return this.eth_call(functions.positions, {_0})
    }

    prevTickGlobal() {
        return this.eth_call(functions.prevTickGlobal, {})
    }

    safelyGetStateOfAMM() {
        return this.eth_call(functions.safelyGetStateOfAMM, {})
    }

    tickSpacing() {
        return this.eth_call(functions.tickSpacing, {})
    }

    tickTable(_0: TickTableParams["_0"]) {
        return this.eth_call(functions.tickTable, {_0})
    }

    tickTreeRoot() {
        return this.eth_call(functions.tickTreeRoot, {})
    }

    tickTreeSecondLayer(_0: TickTreeSecondLayerParams["_0"]) {
        return this.eth_call(functions.tickTreeSecondLayer, {_0})
    }

    ticks(_0: TicksParams["_0"]) {
        return this.eth_call(functions.ticks, {_0})
    }

    token0() {
        return this.eth_call(functions.token0, {})
    }

    token1() {
        return this.eth_call(functions.token1, {})
    }

    totalFeeGrowth0Token() {
        return this.eth_call(functions.totalFeeGrowth0Token, {})
    }

    totalFeeGrowth1Token() {
        return this.eth_call(functions.totalFeeGrowth1Token, {})
    }
}

/// Event types
export type BurnEventArgs = EParams<typeof events.Burn>
export type CollectEventArgs = EParams<typeof events.Collect>
export type CommunityFeeEventArgs = EParams<typeof events.CommunityFee>
export type CommunityVaultEventArgs = EParams<typeof events.CommunityVault>
export type FeeEventArgs = EParams<typeof events.Fee>
export type FlashEventArgs = EParams<typeof events.Flash>
export type InitializeEventArgs = EParams<typeof events.Initialize>
export type MintEventArgs = EParams<typeof events.Mint>
export type PluginEventArgs = EParams<typeof events.Plugin>
export type PluginConfigEventArgs = EParams<typeof events.PluginConfig>
export type SwapEventArgs = EParams<typeof events.Swap>
export type TickSpacingEventArgs = EParams<typeof events.TickSpacing>

/// Function types
export type BurnParams = FunctionArguments<typeof functions.burn>
export type BurnReturn = FunctionReturn<typeof functions.burn>

export type CollectParams = FunctionArguments<typeof functions.collect>
export type CollectReturn = FunctionReturn<typeof functions.collect>

export type CommunityFeeLastTimestampParams = FunctionArguments<typeof functions.communityFeeLastTimestamp>
export type CommunityFeeLastTimestampReturn = FunctionReturn<typeof functions.communityFeeLastTimestamp>

export type CommunityVaultParams = FunctionArguments<typeof functions.communityVault>
export type CommunityVaultReturn = FunctionReturn<typeof functions.communityVault>

export type FactoryParams = FunctionArguments<typeof functions.factory>
export type FactoryReturn = FunctionReturn<typeof functions.factory>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type FlashParams = FunctionArguments<typeof functions.flash>
export type FlashReturn = FunctionReturn<typeof functions.flash>

export type GetCommunityFeePendingParams = FunctionArguments<typeof functions.getCommunityFeePending>
export type GetCommunityFeePendingReturn = FunctionReturn<typeof functions.getCommunityFeePending>

export type GetReservesParams = FunctionArguments<typeof functions.getReserves>
export type GetReservesReturn = FunctionReturn<typeof functions.getReserves>

export type GlobalStateParams = FunctionArguments<typeof functions.globalState>
export type GlobalStateReturn = FunctionReturn<typeof functions.globalState>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsUnlockedParams = FunctionArguments<typeof functions.isUnlocked>
export type IsUnlockedReturn = FunctionReturn<typeof functions.isUnlocked>

export type LiquidityParams = FunctionArguments<typeof functions.liquidity>
export type LiquidityReturn = FunctionReturn<typeof functions.liquidity>

export type MaxLiquidityPerTickParams = FunctionArguments<typeof functions.maxLiquidityPerTick>
export type MaxLiquidityPerTickReturn = FunctionReturn<typeof functions.maxLiquidityPerTick>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NextTickGlobalParams = FunctionArguments<typeof functions.nextTickGlobal>
export type NextTickGlobalReturn = FunctionReturn<typeof functions.nextTickGlobal>

export type PluginParams = FunctionArguments<typeof functions.plugin>
export type PluginReturn = FunctionReturn<typeof functions.plugin>

export type PositionsParams = FunctionArguments<typeof functions.positions>
export type PositionsReturn = FunctionReturn<typeof functions.positions>

export type PrevTickGlobalParams = FunctionArguments<typeof functions.prevTickGlobal>
export type PrevTickGlobalReturn = FunctionReturn<typeof functions.prevTickGlobal>

export type SafelyGetStateOfAMMParams = FunctionArguments<typeof functions.safelyGetStateOfAMM>
export type SafelyGetStateOfAMMReturn = FunctionReturn<typeof functions.safelyGetStateOfAMM>

export type SetCommunityFeeParams = FunctionArguments<typeof functions.setCommunityFee>
export type SetCommunityFeeReturn = FunctionReturn<typeof functions.setCommunityFee>

export type SetCommunityVaultParams = FunctionArguments<typeof functions.setCommunityVault>
export type SetCommunityVaultReturn = FunctionReturn<typeof functions.setCommunityVault>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetPluginParams = FunctionArguments<typeof functions.setPlugin>
export type SetPluginReturn = FunctionReturn<typeof functions.setPlugin>

export type SetPluginConfigParams = FunctionArguments<typeof functions.setPluginConfig>
export type SetPluginConfigReturn = FunctionReturn<typeof functions.setPluginConfig>

export type SetTickSpacingParams = FunctionArguments<typeof functions.setTickSpacing>
export type SetTickSpacingReturn = FunctionReturn<typeof functions.setTickSpacing>

export type SwapParams = FunctionArguments<typeof functions.swap>
export type SwapReturn = FunctionReturn<typeof functions.swap>

export type SwapWithPaymentInAdvanceParams = FunctionArguments<typeof functions.swapWithPaymentInAdvance>
export type SwapWithPaymentInAdvanceReturn = FunctionReturn<typeof functions.swapWithPaymentInAdvance>

export type TickSpacingParams = FunctionArguments<typeof functions.tickSpacing>
export type TickSpacingReturn = FunctionReturn<typeof functions.tickSpacing>

export type TickTableParams = FunctionArguments<typeof functions.tickTable>
export type TickTableReturn = FunctionReturn<typeof functions.tickTable>

export type TickTreeRootParams = FunctionArguments<typeof functions.tickTreeRoot>
export type TickTreeRootReturn = FunctionReturn<typeof functions.tickTreeRoot>

export type TickTreeSecondLayerParams = FunctionArguments<typeof functions.tickTreeSecondLayer>
export type TickTreeSecondLayerReturn = FunctionReturn<typeof functions.tickTreeSecondLayer>

export type TicksParams = FunctionArguments<typeof functions.ticks>
export type TicksReturn = FunctionReturn<typeof functions.ticks>

export type Token0Params = FunctionArguments<typeof functions.token0>
export type Token0Return = FunctionReturn<typeof functions.token0>

export type Token1Params = FunctionArguments<typeof functions.token1>
export type Token1Return = FunctionReturn<typeof functions.token1>

export type TotalFeeGrowth0TokenParams = FunctionArguments<typeof functions.totalFeeGrowth0Token>
export type TotalFeeGrowth0TokenReturn = FunctionReturn<typeof functions.totalFeeGrowth0Token>

export type TotalFeeGrowth1TokenParams = FunctionArguments<typeof functions.totalFeeGrowth1Token>
export type TotalFeeGrowth1TokenReturn = FunctionReturn<typeof functions.totalFeeGrowth1Token>

