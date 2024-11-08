import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    DefaultUnstakedFeeChanged: event("0xcbca61144322b913ada4febfb591864cad7617559d7ee0d3e29b48eb93fcc78e", "DefaultUnstakedFeeChanged(uint24,uint24)", {"oldUnstakedFee": indexed(p.uint24), "newUnstakedFee": indexed(p.uint24)}),
    OwnerChanged: event("0xb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c", "OwnerChanged(address,address)", {"oldOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PoolCreated: event("0xab0d57f0df537bb25e80245ef7748fa62353808c54d6e528a9dd20887aed9ac2", "PoolCreated(address,address,int24,address)", {"token0": indexed(p.address), "token1": indexed(p.address), "tickSpacing": indexed(p.int24), "pool": p.address}),
    SwapFeeManagerChanged: event("0x7ae0007229b3333719d97e8ef5829c888f560776012974f87409c158e5b7eb91", "SwapFeeManagerChanged(address,address)", {"oldFeeManager": indexed(p.address), "newFeeManager": indexed(p.address)}),
    SwapFeeModuleChanged: event("0xdf24ed64a7bcd761cf1132e79f94ea269a1d570e7a6ca0ab99a8f5ccd6f5022f", "SwapFeeModuleChanged(address,address)", {"oldFeeModule": indexed(p.address), "newFeeModule": indexed(p.address)}),
    TickSpacingEnabled: event("0xebafae466a4a780a1d87f5fab2f52fad33be9151a7f69d099e8934c8de85b747", "TickSpacingEnabled(int24,uint24)", {"tickSpacing": indexed(p.int24), "fee": indexed(p.uint24)}),
    UnstakedFeeManagerChanged: event("0x3d7ebe96182c99643ca0c997a416a2a3409baab225f85f50c29fcf0591c820c1", "UnstakedFeeManagerChanged(address,address)", {"oldFeeManager": indexed(p.address), "newFeeManager": indexed(p.address)}),
    UnstakedFeeModuleChanged: event("0x6520f404f3831947cee8673060459cdfb181b7332aa7580bcce9bf90ef1f0e20", "UnstakedFeeModuleChanged(address,address)", {"oldFeeModule": indexed(p.address), "newFeeModule": indexed(p.address)}),
}

export const functions = {
    allPools: viewFun("0x41d1de97", "allPools(uint256)", {"_0": p.uint256}, p.address),
    allPoolsLength: viewFun("0xefde4e64", "allPoolsLength()", {}, p.uint256),
    createPool: fun("0x232aa5ac", "createPool(address,address,int24,uint160)", {"tokenA": p.address, "tokenB": p.address, "tickSpacing": p.int24, "sqrtPriceX96": p.uint160}, p.address),
    defaultUnstakedFee: viewFun("0xe2824832", "defaultUnstakedFee()", {}, p.uint24),
    enableTickSpacing: fun("0xeee0fdb4", "enableTickSpacing(int24,uint24)", {"tickSpacing": p.int24, "fee": p.uint24}, ),
    factoryRegistry: viewFun("0x3bf0c9fb", "factoryRegistry()", {}, p.address),
    getPool: viewFun("0x28af8d0b", "getPool(address,address,int24)", {"_0": p.address, "_1": p.address, "_2": p.int24}, p.address),
    getSwapFee: viewFun("0x35458dcc", "getSwapFee(address)", {"pool": p.address}, p.uint24),
    getUnstakedFee: viewFun("0x48cf7a43", "getUnstakedFee(address)", {"pool": p.address}, p.uint24),
    isPool: viewFun("0x5b16ebb7", "isPool(address)", {"pool": p.address}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    poolImplementation: viewFun("0xcefa7799", "poolImplementation()", {}, p.address),
    setDefaultUnstakedFee: fun("0xa2f97f42", "setDefaultUnstakedFee(uint24)", {"_defaultUnstakedFee": p.uint24}, ),
    setOwner: fun("0x13af4035", "setOwner(address)", {"_owner": p.address}, ),
    setSwapFeeManager: fun("0xffb4d9d1", "setSwapFeeManager(address)", {"_swapFeeManager": p.address}, ),
    setSwapFeeModule: fun("0x61b9c3ec", "setSwapFeeModule(address)", {"_swapFeeModule": p.address}, ),
    setUnstakedFeeManager: fun("0x93ce8627", "setUnstakedFeeManager(address)", {"_unstakedFeeManager": p.address}, ),
    setUnstakedFeeModule: fun("0x1b31d878", "setUnstakedFeeModule(address)", {"_unstakedFeeModule": p.address}, ),
    swapFeeManager: viewFun("0xd574afa9", "swapFeeManager()", {}, p.address),
    swapFeeModule: viewFun("0x23c43a51", "swapFeeModule()", {}, p.address),
    tickSpacingToFee: viewFun("0x380dc1c2", "tickSpacingToFee(int24)", {"_0": p.int24}, p.uint24),
    tickSpacings: viewFun("0x9cbbbe86", "tickSpacings()", {}, p.array(p.int24)),
    unstakedFeeManager: viewFun("0x82e189e0", "unstakedFeeManager()", {}, p.address),
    unstakedFeeModule: viewFun("0x7693bc11", "unstakedFeeModule()", {}, p.address),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
}

export class Contract extends ContractBase {

    allPools(_0: AllPoolsParams["_0"]) {
        return this.eth_call(functions.allPools, {_0})
    }

    allPoolsLength() {
        return this.eth_call(functions.allPoolsLength, {})
    }

    defaultUnstakedFee() {
        return this.eth_call(functions.defaultUnstakedFee, {})
    }

    factoryRegistry() {
        return this.eth_call(functions.factoryRegistry, {})
    }

    getPool(_0: GetPoolParams["_0"], _1: GetPoolParams["_1"], _2: GetPoolParams["_2"]) {
        return this.eth_call(functions.getPool, {_0, _1, _2})
    }

    getSwapFee(pool: GetSwapFeeParams["pool"]) {
        return this.eth_call(functions.getSwapFee, {pool})
    }

    getUnstakedFee(pool: GetUnstakedFeeParams["pool"]) {
        return this.eth_call(functions.getUnstakedFee, {pool})
    }

    isPool(pool: IsPoolParams["pool"]) {
        return this.eth_call(functions.isPool, {pool})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    poolImplementation() {
        return this.eth_call(functions.poolImplementation, {})
    }

    swapFeeManager() {
        return this.eth_call(functions.swapFeeManager, {})
    }

    swapFeeModule() {
        return this.eth_call(functions.swapFeeModule, {})
    }

    tickSpacingToFee(_0: TickSpacingToFeeParams["_0"]) {
        return this.eth_call(functions.tickSpacingToFee, {_0})
    }

    tickSpacings() {
        return this.eth_call(functions.tickSpacings, {})
    }

    unstakedFeeManager() {
        return this.eth_call(functions.unstakedFeeManager, {})
    }

    unstakedFeeModule() {
        return this.eth_call(functions.unstakedFeeModule, {})
    }

    voter() {
        return this.eth_call(functions.voter, {})
    }
}

/// Event types
export type DefaultUnstakedFeeChangedEventArgs = EParams<typeof events.DefaultUnstakedFeeChanged>
export type OwnerChangedEventArgs = EParams<typeof events.OwnerChanged>
export type PoolCreatedEventArgs = EParams<typeof events.PoolCreated>
export type SwapFeeManagerChangedEventArgs = EParams<typeof events.SwapFeeManagerChanged>
export type SwapFeeModuleChangedEventArgs = EParams<typeof events.SwapFeeModuleChanged>
export type TickSpacingEnabledEventArgs = EParams<typeof events.TickSpacingEnabled>
export type UnstakedFeeManagerChangedEventArgs = EParams<typeof events.UnstakedFeeManagerChanged>
export type UnstakedFeeModuleChangedEventArgs = EParams<typeof events.UnstakedFeeModuleChanged>

/// Function types
export type AllPoolsParams = FunctionArguments<typeof functions.allPools>
export type AllPoolsReturn = FunctionReturn<typeof functions.allPools>

export type AllPoolsLengthParams = FunctionArguments<typeof functions.allPoolsLength>
export type AllPoolsLengthReturn = FunctionReturn<typeof functions.allPoolsLength>

export type CreatePoolParams = FunctionArguments<typeof functions.createPool>
export type CreatePoolReturn = FunctionReturn<typeof functions.createPool>

export type DefaultUnstakedFeeParams = FunctionArguments<typeof functions.defaultUnstakedFee>
export type DefaultUnstakedFeeReturn = FunctionReturn<typeof functions.defaultUnstakedFee>

export type EnableTickSpacingParams = FunctionArguments<typeof functions.enableTickSpacing>
export type EnableTickSpacingReturn = FunctionReturn<typeof functions.enableTickSpacing>

export type FactoryRegistryParams = FunctionArguments<typeof functions.factoryRegistry>
export type FactoryRegistryReturn = FunctionReturn<typeof functions.factoryRegistry>

export type GetPoolParams = FunctionArguments<typeof functions.getPool>
export type GetPoolReturn = FunctionReturn<typeof functions.getPool>

export type GetSwapFeeParams = FunctionArguments<typeof functions.getSwapFee>
export type GetSwapFeeReturn = FunctionReturn<typeof functions.getSwapFee>

export type GetUnstakedFeeParams = FunctionArguments<typeof functions.getUnstakedFee>
export type GetUnstakedFeeReturn = FunctionReturn<typeof functions.getUnstakedFee>

export type IsPoolParams = FunctionArguments<typeof functions.isPool>
export type IsPoolReturn = FunctionReturn<typeof functions.isPool>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PoolImplementationParams = FunctionArguments<typeof functions.poolImplementation>
export type PoolImplementationReturn = FunctionReturn<typeof functions.poolImplementation>

export type SetDefaultUnstakedFeeParams = FunctionArguments<typeof functions.setDefaultUnstakedFee>
export type SetDefaultUnstakedFeeReturn = FunctionReturn<typeof functions.setDefaultUnstakedFee>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type SetSwapFeeManagerParams = FunctionArguments<typeof functions.setSwapFeeManager>
export type SetSwapFeeManagerReturn = FunctionReturn<typeof functions.setSwapFeeManager>

export type SetSwapFeeModuleParams = FunctionArguments<typeof functions.setSwapFeeModule>
export type SetSwapFeeModuleReturn = FunctionReturn<typeof functions.setSwapFeeModule>

export type SetUnstakedFeeManagerParams = FunctionArguments<typeof functions.setUnstakedFeeManager>
export type SetUnstakedFeeManagerReturn = FunctionReturn<typeof functions.setUnstakedFeeManager>

export type SetUnstakedFeeModuleParams = FunctionArguments<typeof functions.setUnstakedFeeModule>
export type SetUnstakedFeeModuleReturn = FunctionReturn<typeof functions.setUnstakedFeeModule>

export type SwapFeeManagerParams = FunctionArguments<typeof functions.swapFeeManager>
export type SwapFeeManagerReturn = FunctionReturn<typeof functions.swapFeeManager>

export type SwapFeeModuleParams = FunctionArguments<typeof functions.swapFeeModule>
export type SwapFeeModuleReturn = FunctionReturn<typeof functions.swapFeeModule>

export type TickSpacingToFeeParams = FunctionArguments<typeof functions.tickSpacingToFee>
export type TickSpacingToFeeReturn = FunctionReturn<typeof functions.tickSpacingToFee>

export type TickSpacingsParams = FunctionArguments<typeof functions.tickSpacings>
export type TickSpacingsReturn = FunctionReturn<typeof functions.tickSpacings>

export type UnstakedFeeManagerParams = FunctionArguments<typeof functions.unstakedFeeManager>
export type UnstakedFeeManagerReturn = FunctionReturn<typeof functions.unstakedFeeManager>

export type UnstakedFeeModuleParams = FunctionArguments<typeof functions.unstakedFeeModule>
export type UnstakedFeeModuleReturn = FunctionReturn<typeof functions.unstakedFeeModule>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

