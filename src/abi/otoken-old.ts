import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    TotalSupplyUpdated: event("0x99e56f783b536ffacf422d59183ea321dd80dcd6d23daa13023e8afea38c3df1", "TotalSupplyUpdated(uint256,uint256,uint256)", {"totalSupply": p.uint256, "rebasingCredits": p.uint256, "rebasingCreditsPerToken": p.uint256}),
}

export class Contract extends ContractBase {
}

/// Event types
export type TotalSupplyUpdatedEventArgs = EParams<typeof events.TotalSupplyUpdated>
