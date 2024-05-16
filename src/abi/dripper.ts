import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
}

export const functions = {
    availableFunds: fun("0x46fcff4c", {}, p.uint256),
    claimGovernance: fun("0x5d36b190", {}, ),
    collect: fun("0xe5225381", {}, ),
    collectAndRebase: fun("0x73796297", {}, ),
    drip: fun("0x9f678cca", {}, {"lastCollect": p.uint64, "perBlock": p.uint192}),
    dripDuration: fun("0xbb7a632e", {}, p.uint256),
    governor: fun("0x0c340a24", {}, p.address),
    isGovernor: fun("0xc7af3352", {}, p.bool),
    setDripDuration: fun("0x0493a0fa", {"_durationSeconds": p.uint256}, ),
    transferGovernance: fun("0xd38bfff4", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", {"_asset": p.address, "_amount": p.uint256}, ),
}

export class Contract extends ContractBase {

    availableFunds() {
        return this.eth_call(functions.availableFunds, {})
    }

    drip() {
        return this.eth_call(functions.drip, {})
    }

    dripDuration() {
        return this.eth_call(functions.dripDuration, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }
}

/// Event types
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>

/// Function types
export type AvailableFundsParams = FunctionArguments<typeof functions.availableFunds>
export type AvailableFundsReturn = FunctionReturn<typeof functions.availableFunds>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectParams = FunctionArguments<typeof functions.collect>
export type CollectReturn = FunctionReturn<typeof functions.collect>

export type CollectAndRebaseParams = FunctionArguments<typeof functions.collectAndRebase>
export type CollectAndRebaseReturn = FunctionReturn<typeof functions.collectAndRebase>

export type DripParams = FunctionArguments<typeof functions.drip>
export type DripReturn = FunctionReturn<typeof functions.drip>

export type DripDurationParams = FunctionArguments<typeof functions.dripDuration>
export type DripDurationReturn = FunctionReturn<typeof functions.dripDuration>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type SetDripDurationParams = FunctionArguments<typeof functions.setDripDuration>
export type SetDripDurationReturn = FunctionReturn<typeof functions.setDripDuration>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

