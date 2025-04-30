import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    PoolCreated: event("0x848331e408557f4b7eb6561ca1c18a3ac43004fbe64b8b5bce613855cfdf22d2", "PoolCreated(address,uint8,uint256,uint256,uint256,uint256,int32,address,address,uint8,address)", {"poolAddress": p.address, "protocolFeeRatio": p.uint8, "feeAIn": p.uint256, "feeBIn": p.uint256, "tickSpacing": p.uint256, "lookback": p.uint256, "activeTick": p.int32, "tokenA": p.address, "tokenB": p.address, "kinds": p.uint8, "accessor": p.address}),
}

export class Contract extends ContractBase {
}

/// Event types
export type PoolCreatedEventArgs = EParams<typeof events.PoolCreated>
