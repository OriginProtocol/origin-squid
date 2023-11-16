import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './zero-x-exchange.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const functions = {
    FEATURE_NAME: new Func<[], {}, string>(
        abi, '0x6ae4b4f7'
    ),
    FEATURE_VERSION: new Func<[], {}, bigint>(
        abi, '0x031b905c'
    ),
    _sellHeldTokenForTokenToUniswapV3: new Func<[encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string], {encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string}, bigint>(
        abi, '0x4a931ba1'
    ),
    _sellTokenForTokenToUniswapV3: new Func<[encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string, payer: string], {encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string, payer: string}, bigint>(
        abi, '0x168a6432'
    ),
    migrate: new Func<[], {}, string>(
        abi, '0x8fd3ab80'
    ),
    sellEthForTokenToUniswapV3: new Func<[encodedPath: string, minBuyAmount: bigint, recipient: string], {encodedPath: string, minBuyAmount: bigint, recipient: string}, bigint>(
        abi, '0x3598d8ab'
    ),
    sellTokenForEthToUniswapV3: new Func<[encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string], {encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string}, bigint>(
        abi, '0x803ba26d'
    ),
    sellTokenForTokenToUniswapV3: new Func<[encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string], {encodedPath: string, sellAmount: bigint, minBuyAmount: bigint, recipient: string}, bigint>(
        abi, '0x6af479b2'
    ),
    uniswapV3SwapCallback: new Func<[amount0Delta: bigint, amount1Delta: bigint, data: string], {amount0Delta: bigint, amount1Delta: bigint, data: string}, []>(
        abi, '0xfa461e33'
    ),
}

export class Contract extends ContractBase {

    FEATURE_NAME(): Promise<string> {
        return this.eth_call(functions.FEATURE_NAME, [])
    }

    FEATURE_VERSION(): Promise<bigint> {
        return this.eth_call(functions.FEATURE_VERSION, [])
    }
}
