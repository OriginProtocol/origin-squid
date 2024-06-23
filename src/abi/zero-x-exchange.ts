import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const functions = {
    FEATURE_NAME: viewFun("0x6ae4b4f7", "FEATURE_NAME()", {}, p.string),
    FEATURE_VERSION: viewFun("0x031b905c", "FEATURE_VERSION()", {}, p.uint256),
    _sellHeldTokenForTokenToUniswapV3: fun("0x4a931ba1", "_sellHeldTokenForTokenToUniswapV3(bytes,uint256,uint256,address)", {"encodedPath": p.bytes, "sellAmount": p.uint256, "minBuyAmount": p.uint256, "recipient": p.address}, p.uint256),
    _sellTokenForTokenToUniswapV3: fun("0x168a6432", "_sellTokenForTokenToUniswapV3(bytes,uint256,uint256,address,address)", {"encodedPath": p.bytes, "sellAmount": p.uint256, "minBuyAmount": p.uint256, "recipient": p.address, "payer": p.address}, p.uint256),
    migrate: fun("0x8fd3ab80", "migrate()", {}, p.bytes4),
    sellEthForTokenToUniswapV3: fun("0x3598d8ab", "sellEthForTokenToUniswapV3(bytes,uint256,address)", {"encodedPath": p.bytes, "minBuyAmount": p.uint256, "recipient": p.address}, p.uint256),
    sellTokenForEthToUniswapV3: fun("0x803ba26d", "sellTokenForEthToUniswapV3(bytes,uint256,uint256,address)", {"encodedPath": p.bytes, "sellAmount": p.uint256, "minBuyAmount": p.uint256, "recipient": p.address}, p.uint256),
    sellTokenForTokenToUniswapV3: fun("0x6af479b2", "sellTokenForTokenToUniswapV3(bytes,uint256,uint256,address)", {"encodedPath": p.bytes, "sellAmount": p.uint256, "minBuyAmount": p.uint256, "recipient": p.address}, p.uint256),
    uniswapV3SwapCallback: fun("0xfa461e33", "uniswapV3SwapCallback(int256,int256,bytes)", {"amount0Delta": p.int256, "amount1Delta": p.int256, "data": p.bytes}, ),
}

export class Contract extends ContractBase {

    FEATURE_NAME() {
        return this.eth_call(functions.FEATURE_NAME, {})
    }

    FEATURE_VERSION() {
        return this.eth_call(functions.FEATURE_VERSION, {})
    }
}

/// Function types
export type FEATURE_NAMEParams = FunctionArguments<typeof functions.FEATURE_NAME>
export type FEATURE_NAMEReturn = FunctionReturn<typeof functions.FEATURE_NAME>

export type FEATURE_VERSIONParams = FunctionArguments<typeof functions.FEATURE_VERSION>
export type FEATURE_VERSIONReturn = FunctionReturn<typeof functions.FEATURE_VERSION>

export type _sellHeldTokenForTokenToUniswapV3Params = FunctionArguments<typeof functions._sellHeldTokenForTokenToUniswapV3>
export type _sellHeldTokenForTokenToUniswapV3Return = FunctionReturn<typeof functions._sellHeldTokenForTokenToUniswapV3>

export type _sellTokenForTokenToUniswapV3Params = FunctionArguments<typeof functions._sellTokenForTokenToUniswapV3>
export type _sellTokenForTokenToUniswapV3Return = FunctionReturn<typeof functions._sellTokenForTokenToUniswapV3>

export type MigrateParams = FunctionArguments<typeof functions.migrate>
export type MigrateReturn = FunctionReturn<typeof functions.migrate>

export type SellEthForTokenToUniswapV3Params = FunctionArguments<typeof functions.sellEthForTokenToUniswapV3>
export type SellEthForTokenToUniswapV3Return = FunctionReturn<typeof functions.sellEthForTokenToUniswapV3>

export type SellTokenForEthToUniswapV3Params = FunctionArguments<typeof functions.sellTokenForEthToUniswapV3>
export type SellTokenForEthToUniswapV3Return = FunctionReturn<typeof functions.sellTokenForEthToUniswapV3>

export type SellTokenForTokenToUniswapV3Params = FunctionArguments<typeof functions.sellTokenForTokenToUniswapV3>
export type SellTokenForTokenToUniswapV3Return = FunctionReturn<typeof functions.sellTokenForTokenToUniswapV3>

export type UniswapV3SwapCallbackParams = FunctionArguments<typeof functions.uniswapV3SwapCallback>
export type UniswapV3SwapCallbackReturn = FunctionReturn<typeof functions.uniswapV3SwapCallback>

