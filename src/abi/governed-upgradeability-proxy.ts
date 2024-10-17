import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
}

export const functions = {
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    implementation: viewFun("0x5c60da1b", "implementation()", {}, p.address),
    initialize: fun("0xcf7a1d77", "initialize(address,address,bytes)", {"_logic": p.address, "_initGovernor": p.address, "_data": p.bytes}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    upgradeTo: fun("0x3659cfe6", "upgradeTo(address)", {"newImplementation": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
}

export class Contract extends ContractBase {

    admin() {
        return this.eth_call(functions.admin, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    implementation() {
        return this.eth_call(functions.implementation, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }
}

/// Event types
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>

/// Function types
export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type ImplementationParams = FunctionArguments<typeof functions.implementation>
export type ImplementationReturn = FunctionReturn<typeof functions.implementation>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type UpgradeToParams = FunctionArguments<typeof functions.upgradeTo>
export type UpgradeToReturn = FunctionReturn<typeof functions.upgradeTo>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

