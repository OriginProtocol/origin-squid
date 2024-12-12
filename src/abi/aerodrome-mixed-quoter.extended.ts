import type { FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'
import { ContractBase, fun, viewFun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const functions = {
    WETH9: viewFun("0x4aa4a4fc", "WETH9()", {}, p.address),
    factory: viewFun("0xc45a0155", "factory()", {}, p.address),
    factoryV2: viewFun("0x68e0d4e1", "factoryV2()", {}, p.address),
    quoteExactInput: fun("0xcdca1753", "quoteExactInput(bytes,uint256)", {"path": p.bytes, "amountIn": p.uint256}, {"amountOut": p.uint256, "v3SqrtPriceX96AfterList": p.array(p.uint160), "v3InitializedTicksCrossedList": p.array(p.uint32), "v3SwapGasEstimate": p.uint256}),
    quoteExactInputSingleV2: viewFun("0xc550b186", "quoteExactInputSingleV2((address,address,bool,uint256))", {"params": p.struct({"tokenIn": p.address, "tokenOut": p.address, "stable": p.bool, "amountIn": p.uint256})}, p.uint256),
    quoteExactInputSingleV3: fun("0x891e50c6", "quoteExactInputSingleV3((address,address,uint256,int24,uint160))", {"params": p.struct({"tokenIn": p.address, "tokenOut": p.address, "amountIn": p.uint256, "tickSpacing": p.int24, "sqrtPriceLimitX96": p.uint160})}, {"amountOut": p.uint256, "sqrtPriceX96After": p.uint160, "initializedTicksCrossed": p.uint32, "gasEstimate": p.uint256}),
    uniswapV3SwapCallback: viewFun("0xfa461e33", "uniswapV3SwapCallback(int256,int256,bytes)", {"amount0Delta": p.int256, "amount1Delta": p.int256, "path": p.bytes}, ),
}

export class Contract extends ContractBase {

    WETH9() {
        return this.eth_call(functions.WETH9, {})
    }

    factory() {
        return this.eth_call(functions.factory, {})
    }

    factoryV2() {
        return this.eth_call(functions.factoryV2, {})
    }

    quoteExactInputSingleV2(params: QuoteExactInputSingleV2Params["params"]) {
        return this.eth_call(functions.quoteExactInputSingleV2, {params})
    }

    quoteExactInputSingleV3(params: QuoteExactInputSingleV3Params["params"]) {
        return this.eth_call(functions.quoteExactInputSingleV3, {params})
    }
}

/// Function types
export type WETH9Params = FunctionArguments<typeof functions.WETH9>
export type WETH9Return = FunctionReturn<typeof functions.WETH9>

export type FactoryParams = FunctionArguments<typeof functions.factory>
export type FactoryReturn = FunctionReturn<typeof functions.factory>

export type FactoryV2Params = FunctionArguments<typeof functions.factoryV2>
export type FactoryV2Return = FunctionReturn<typeof functions.factoryV2>

export type QuoteExactInputParams = FunctionArguments<typeof functions.quoteExactInput>
export type QuoteExactInputReturn = FunctionReturn<typeof functions.quoteExactInput>

export type QuoteExactInputSingleV2Params = FunctionArguments<typeof functions.quoteExactInputSingleV2>
export type QuoteExactInputSingleV2Return = FunctionReturn<typeof functions.quoteExactInputSingleV2>

export type QuoteExactInputSingleV3Params = FunctionArguments<typeof functions.quoteExactInputSingleV3>
export type QuoteExactInputSingleV3Return = FunctionReturn<typeof functions.quoteExactInputSingleV3>

export type UniswapV3SwapCallbackParams = FunctionArguments<typeof functions.uniswapV3SwapCallback>
export type UniswapV3SwapCallbackReturn = FunctionReturn<typeof functions.uniswapV3SwapCallback>

