import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    getRate: viewFun("0x679aefce", "getRate()", {}, p.uint256),
    rocketTokenRETH: viewFun("0xdb5dacc9", "rocketTokenRETH()", {}, p.address),
}

export class Contract extends ContractBase {

    getRate() {
        return this.eth_call(functions.getRate, {})
    }

    rocketTokenRETH() {
        return this.eth_call(functions.rocketTokenRETH, {})
    }
}

/// Function types
export type GetRateParams = FunctionArguments<typeof functions.getRate>
export type GetRateReturn = FunctionReturn<typeof functions.getRate>

export type RocketTokenRETHParams = FunctionArguments<typeof functions.rocketTokenRETH>
export type RocketTokenRETHReturn = FunctionReturn<typeof functions.rocketTokenRETH>

