import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    FeeAdjustment: event("0xe4accbaee82fb833ac207d4c4454c5a04e85f5e1e9a20a9e2c98e54e8706ff2b", "FeeAdjustment(address,uint24)", {"pool": p.address, "newFee": p.uint24}),
    FeeCollectorChanged: event("0x649c5e3d0ed183894196148e193af316452b0037e77d2ff0fef23b7dc722bed0", "FeeCollectorChanged(address,address)", {"oldFeeCollector": indexed(p.address), "newFeeCollector": indexed(p.address)}),
    PoolCreated: event("0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118", "PoolCreated(address,address,uint24,int24,address)", {"token0": indexed(p.address), "token1": indexed(p.address), "fee": indexed(p.uint24), "tickSpacing": p.int24, "pool": p.address}),
    SetFeeProtocol: event("0x7a8f5b6a3fe6312faf94330e829a331301dbd2ce6947e915be63bf67b473ed5f", "SetFeeProtocol(uint8,uint8)", {"feeProtocolOld": p.uint8, "feeProtocolNew": p.uint8}),
    SetPoolFeeProtocol: event("0xa667945ce175575f1ba112f8598cad43210716077bdcabd4d73f2397a81e59bd", "SetPoolFeeProtocol(address,uint8,uint8)", {"pool": p.address, "feeProtocolOld": p.uint8, "feeProtocolNew": p.uint8}),
    TickSpacingEnabled: event("0xebafae466a4a780a1d87f5fab2f52fad33be9151a7f69d099e8934c8de85b747", "TickSpacingEnabled(int24,uint24)", {"tickSpacing": indexed(p.int24), "fee": indexed(p.uint24)}),
}

export const functions = {
    accessHub: viewFun("0xe7589b39", "accessHub()", {}, p.address),
    createPool: fun("0x232aa5ac", "createPool(address,address,int24,uint160)", {"tokenA": p.address, "tokenB": p.address, "tickSpacing": p.int24, "sqrtPriceX96": p.uint160}, p.address),
    enableTickSpacing: fun("0xeee0fdb4", "enableTickSpacing(int24,uint24)", {"tickSpacing": p.int24, "initialFee": p.uint24}, ),
    feeCollector: viewFun("0xc415b95c", "feeCollector()", {}, p.address),
    feeProtocol: viewFun("0x527eb4bc", "feeProtocol()", {}, p.uint8),
    gaugeFeeSplitEnable: fun("0x3cb08b53", "gaugeFeeSplitEnable(address)", {"pool": p.address}, ),
    getPool: viewFun("0x28af8d0b", "getPool(address,address,int24)", {"tokenA": p.address, "tokenB": p.address, "tickSpacing": p.int24}, p.address),
    initialize: fun("0xc4d66de8", "initialize(address)", {"_ramsesV3PoolDeployer": p.address}, ),
    parameters: viewFun("0x89035730", "parameters()", {}, {"factory": p.address, "token0": p.address, "token1": p.address, "fee": p.uint24, "tickSpacing": p.int24}),
    poolFeeProtocol: viewFun("0xebb0d9f7", "poolFeeProtocol(address)", {"pool": p.address}, p.uint8),
    ramsesV3PoolDeployer: viewFun("0xbf49a292", "ramsesV3PoolDeployer()", {}, p.address),
    setFee: fun("0xba364c3d", "setFee(address,uint24)", {"_pool": p.address, "_fee": p.uint24}, ),
    setFeeCollector: fun("0xa42dce80", "setFeeCollector(address)", {"_feeCollector": p.address}, ),
    setFeeProtocol: fun("0xb613a141", "setFeeProtocol(uint8)", {"_feeProtocol": p.uint8}, ),
    setPoolFeeProtocol: fun("0x76734e3e", "setPoolFeeProtocol(address,uint8)", {"pool": p.address, "_feeProtocol": p.uint8}, ),
    setVoter: fun("0x4bc2a657", "setVoter(address)", {"_voter": p.address}, ),
    tickSpacingInitialFee: viewFun("0xcf3a52a6", "tickSpacingInitialFee(int24)", {"tickSpacing": p.int24}, p.uint24),
    voter: viewFun("0x46c96aac", "voter()", {}, p.address),
}

export class Contract extends ContractBase {

    accessHub() {
        return this.eth_call(functions.accessHub, {})
    }

    feeCollector() {
        return this.eth_call(functions.feeCollector, {})
    }

    feeProtocol() {
        return this.eth_call(functions.feeProtocol, {})
    }

    getPool(tokenA: GetPoolParams["tokenA"], tokenB: GetPoolParams["tokenB"], tickSpacing: GetPoolParams["tickSpacing"]) {
        return this.eth_call(functions.getPool, {tokenA, tokenB, tickSpacing})
    }

    parameters() {
        return this.eth_call(functions.parameters, {})
    }

    poolFeeProtocol(pool: PoolFeeProtocolParams["pool"]) {
        return this.eth_call(functions.poolFeeProtocol, {pool})
    }

    ramsesV3PoolDeployer() {
        return this.eth_call(functions.ramsesV3PoolDeployer, {})
    }

    tickSpacingInitialFee(tickSpacing: TickSpacingInitialFeeParams["tickSpacing"]) {
        return this.eth_call(functions.tickSpacingInitialFee, {tickSpacing})
    }

    voter() {
        return this.eth_call(functions.voter, {})
    }
}

/// Event types
export type FeeAdjustmentEventArgs = EParams<typeof events.FeeAdjustment>
export type FeeCollectorChangedEventArgs = EParams<typeof events.FeeCollectorChanged>
export type PoolCreatedEventArgs = EParams<typeof events.PoolCreated>
export type SetFeeProtocolEventArgs = EParams<typeof events.SetFeeProtocol>
export type SetPoolFeeProtocolEventArgs = EParams<typeof events.SetPoolFeeProtocol>
export type TickSpacingEnabledEventArgs = EParams<typeof events.TickSpacingEnabled>

/// Function types
export type AccessHubParams = FunctionArguments<typeof functions.accessHub>
export type AccessHubReturn = FunctionReturn<typeof functions.accessHub>

export type CreatePoolParams = FunctionArguments<typeof functions.createPool>
export type CreatePoolReturn = FunctionReturn<typeof functions.createPool>

export type EnableTickSpacingParams = FunctionArguments<typeof functions.enableTickSpacing>
export type EnableTickSpacingReturn = FunctionReturn<typeof functions.enableTickSpacing>

export type FeeCollectorParams = FunctionArguments<typeof functions.feeCollector>
export type FeeCollectorReturn = FunctionReturn<typeof functions.feeCollector>

export type FeeProtocolParams = FunctionArguments<typeof functions.feeProtocol>
export type FeeProtocolReturn = FunctionReturn<typeof functions.feeProtocol>

export type GaugeFeeSplitEnableParams = FunctionArguments<typeof functions.gaugeFeeSplitEnable>
export type GaugeFeeSplitEnableReturn = FunctionReturn<typeof functions.gaugeFeeSplitEnable>

export type GetPoolParams = FunctionArguments<typeof functions.getPool>
export type GetPoolReturn = FunctionReturn<typeof functions.getPool>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type ParametersParams = FunctionArguments<typeof functions.parameters>
export type ParametersReturn = FunctionReturn<typeof functions.parameters>

export type PoolFeeProtocolParams = FunctionArguments<typeof functions.poolFeeProtocol>
export type PoolFeeProtocolReturn = FunctionReturn<typeof functions.poolFeeProtocol>

export type RamsesV3PoolDeployerParams = FunctionArguments<typeof functions.ramsesV3PoolDeployer>
export type RamsesV3PoolDeployerReturn = FunctionReturn<typeof functions.ramsesV3PoolDeployer>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetFeeCollectorParams = FunctionArguments<typeof functions.setFeeCollector>
export type SetFeeCollectorReturn = FunctionReturn<typeof functions.setFeeCollector>

export type SetFeeProtocolParams = FunctionArguments<typeof functions.setFeeProtocol>
export type SetFeeProtocolReturn = FunctionReturn<typeof functions.setFeeProtocol>

export type SetPoolFeeProtocolParams = FunctionArguments<typeof functions.setPoolFeeProtocol>
export type SetPoolFeeProtocolReturn = FunctionReturn<typeof functions.setPoolFeeProtocol>

export type SetVoterParams = FunctionArguments<typeof functions.setVoter>
export type SetVoterReturn = FunctionReturn<typeof functions.setVoter>

export type TickSpacingInitialFeeParams = FunctionArguments<typeof functions.tickSpacingInitialFee>
export type TickSpacingInitialFeeReturn = FunctionReturn<typeof functions.tickSpacingInitialFee>

export type VoterParams = FunctionArguments<typeof functions.voter>
export type VoterReturn = FunctionReturn<typeof functions.voter>

