import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    FactoryApproved: event("0x4378f1462a48772813c3eb384aaee78cca44eb9a24b228a0118c8f4a8e5e3fd5", "FactoryApproved(address)", {"factoryAddress": p.address}),
    FactoryRemoved: event("0xafa2737b2090fa39c66b7348625f0c03726240f724defbc6216d679506f94441", "FactoryRemoved(address)", {"factoryAddress": p.address}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PoolBoosterCreated: event("0x815a468ae1c240cd4e701cd11d7b89454db9d1c3e96c3ddda0b075e7612d5d68", "PoolBoosterCreated(address,address,uint8,address)", {"poolBoosterAddress": p.address, "ammPoolAddress": p.address, "poolBoosterType": p.uint8, "factoryAddress": p.address}),
    PoolBoosterRemoved: event("0xa6267ed4a9ecad83a4813a850e7214f9a7fdf6995314c1c5efa359123d99b67b", "PoolBoosterRemoved(address)", {"poolBoosterAddress": p.address}),
}

export const functions = {
    approveFactory: fun("0xadda33c5", "approveFactory(address)", {"_factoryAddress": p.address}, ),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    emitPoolBoosterCreated: fun("0x591290e8", "emitPoolBoosterCreated(address,address,uint8)", {"_poolBoosterAddress": p.address, "_ammPoolAddress": p.address, "_boosterType": p.uint8}, ),
    emitPoolBoosterRemoved: fun("0x07025229", "emitPoolBoosterRemoved(address)", {"_poolBoosterAddress": p.address}, ),
    factories: viewFun("0x672383c4", "factories(uint256)", {"_0": p.uint256}, p.address),
    getAllFactories: viewFun("0xa0750598", "getAllFactories()", {}, p.array(p.address)),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    isApprovedFactory: viewFun("0x26cf3739", "isApprovedFactory(address)", {"_factoryAddress": p.address}, p.bool),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    removeFactory: fun("0x4b37c73f", "removeFactory(address)", {"_factoryAddress": p.address}, ),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
}

export class Contract extends ContractBase {

    factories(_0: FactoriesParams["_0"]) {
        return this.eth_call(functions.factories, {_0})
    }

    getAllFactories() {
        return this.eth_call(functions.getAllFactories, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isApprovedFactory(_factoryAddress: IsApprovedFactoryParams["_factoryAddress"]) {
        return this.eth_call(functions.isApprovedFactory, {_factoryAddress})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }
}

/// Event types
export type FactoryApprovedEventArgs = EParams<typeof events.FactoryApproved>
export type FactoryRemovedEventArgs = EParams<typeof events.FactoryRemoved>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type PoolBoosterCreatedEventArgs = EParams<typeof events.PoolBoosterCreated>
export type PoolBoosterRemovedEventArgs = EParams<typeof events.PoolBoosterRemoved>

/// Function types
export type ApproveFactoryParams = FunctionArguments<typeof functions.approveFactory>
export type ApproveFactoryReturn = FunctionReturn<typeof functions.approveFactory>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type EmitPoolBoosterCreatedParams = FunctionArguments<typeof functions.emitPoolBoosterCreated>
export type EmitPoolBoosterCreatedReturn = FunctionReturn<typeof functions.emitPoolBoosterCreated>

export type EmitPoolBoosterRemovedParams = FunctionArguments<typeof functions.emitPoolBoosterRemoved>
export type EmitPoolBoosterRemovedReturn = FunctionReturn<typeof functions.emitPoolBoosterRemoved>

export type FactoriesParams = FunctionArguments<typeof functions.factories>
export type FactoriesReturn = FunctionReturn<typeof functions.factories>

export type GetAllFactoriesParams = FunctionArguments<typeof functions.getAllFactories>
export type GetAllFactoriesReturn = FunctionReturn<typeof functions.getAllFactories>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type IsApprovedFactoryParams = FunctionArguments<typeof functions.isApprovedFactory>
export type IsApprovedFactoryReturn = FunctionReturn<typeof functions.isApprovedFactory>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type RemoveFactoryParams = FunctionArguments<typeof functions.removeFactory>
export type RemoveFactoryReturn = FunctionReturn<typeof functions.removeFactory>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

