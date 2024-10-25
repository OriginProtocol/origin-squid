import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ExecutionRewardsCollected: event("0xc2acb502a0dc166a61cd83b914b480d76050e91a6797d7a833be84c4eace1dfe", "ExecutionRewardsCollected(address,uint256)", {"strategy": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    STRATEGY: viewFun("0x185025ef", "STRATEGY()", {}, p.address),
    collect: fun("0xe5225381", "collect()", {}, p.uint256),
}

export class Contract extends ContractBase {

    STRATEGY() {
        return this.eth_call(functions.STRATEGY, {})
    }
}

/// Event types
export type ExecutionRewardsCollectedEventArgs = EParams<typeof events.ExecutionRewardsCollected>

/// Function types
export type STRATEGYParams = FunctionArguments<typeof functions.STRATEGY>
export type STRATEGYReturn = FunctionReturn<typeof functions.STRATEGY>

export type CollectParams = FunctionArguments<typeof functions.collect>
export type CollectReturn = FunctionReturn<typeof functions.collect>

