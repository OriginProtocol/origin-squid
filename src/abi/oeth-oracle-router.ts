import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    cacheDecimals: fun("0x36b6d944", "cacheDecimals(address)", {"asset": p.address}, p.uint8),
    price: viewFun("0xaea91078", "price(address)", {"asset": p.address}, p.uint256),
}

export class Contract extends ContractBase {

    price(asset: PriceParams["asset"]) {
        return this.eth_call(functions.price, {asset})
    }
}

/// Function types
export type CacheDecimalsParams = FunctionArguments<typeof functions.cacheDecimals>
export type CacheDecimalsReturn = FunctionReturn<typeof functions.cacheDecimals>

export type PriceParams = FunctionArguments<typeof functions.price>
export type PriceReturn = FunctionReturn<typeof functions.price>

