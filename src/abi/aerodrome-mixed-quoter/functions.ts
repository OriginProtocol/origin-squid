import { address, array, bool, bytes, int24, int256, struct, uint160, uint256, uint32 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** WETH9() */
export const WETH9 = func('0x4aa4a4fc', {}, address)
export type WETH9Params = FunctionArguments<typeof WETH9>
export type WETH9Return = FunctionReturn<typeof WETH9>

/** factory() */
export const factory = func('0xc45a0155', {}, address)
export type FactoryParams = FunctionArguments<typeof factory>
export type FactoryReturn = FunctionReturn<typeof factory>

/** factoryV2() */
export const factoryV2 = func('0x68e0d4e1', {}, address)
export type FactoryV2Params = FunctionArguments<typeof factoryV2>
export type FactoryV2Return = FunctionReturn<typeof factoryV2>

/** quoteExactInput(bytes,uint256) */
export const quoteExactInput = func('0xcdca1753', {
    path: bytes,
    amountIn: uint256,
}, struct({
    amountOut: uint256,
    v3SqrtPriceX96AfterList: array(uint160),
    v3InitializedTicksCrossedList: array(uint32),
    v3SwapGasEstimate: uint256,
}))
export type QuoteExactInputParams = FunctionArguments<typeof quoteExactInput>
export type QuoteExactInputReturn = FunctionReturn<typeof quoteExactInput>

/** quoteExactInputSingleV2((address,address,bool,uint256)) */
export const quoteExactInputSingleV2 = func('0xc550b186', {
    params: struct({
        tokenIn: address,
        tokenOut: address,
        stable: bool,
        amountIn: uint256,
    }),
}, uint256)
export type QuoteExactInputSingleV2Params = FunctionArguments<typeof quoteExactInputSingleV2>
export type QuoteExactInputSingleV2Return = FunctionReturn<typeof quoteExactInputSingleV2>

/** quoteExactInputSingleV3((address,address,uint256,int24,uint160)) */
export const quoteExactInputSingleV3 = func('0x891e50c6', {
    params: struct({
        tokenIn: address,
        tokenOut: address,
        amountIn: uint256,
        tickSpacing: int24,
        sqrtPriceLimitX96: uint160,
    }),
}, struct({
    amountOut: uint256,
    sqrtPriceX96After: uint160,
    initializedTicksCrossed: uint32,
    gasEstimate: uint256,
}))
export type QuoteExactInputSingleV3Params = FunctionArguments<typeof quoteExactInputSingleV3>
export type QuoteExactInputSingleV3Return = FunctionReturn<typeof quoteExactInputSingleV3>

/** uniswapV3SwapCallback(int256,int256,bytes) */
export const uniswapV3SwapCallback = func('0xfa461e33', {
    amount0Delta: int256,
    amount1Delta: int256,
    path: bytes,
})
export type UniswapV3SwapCallbackParams = FunctionArguments<typeof uniswapV3SwapCallback>
export type UniswapV3SwapCallbackReturn = FunctionReturn<typeof uniswapV3SwapCallback>
