import { ContractBase } from '../abi.support.js'
import { WETH9, factory, factoryV2, quoteExactInput, quoteExactInputSingleV2, quoteExactInputSingleV3 } from './functions.js'
import type { QuoteExactInputParams, QuoteExactInputSingleV2Params, QuoteExactInputSingleV3Params } from './functions.js'

export class Contract extends ContractBase {
    WETH9() {
        return this.eth_call(WETH9, {})
    }

    factory() {
        return this.eth_call(factory, {})
    }

    factoryV2() {
        return this.eth_call(factoryV2, {})
    }

    quoteExactInput(path: QuoteExactInputParams["path"], amountIn: QuoteExactInputParams["amountIn"]) {
        return this.eth_call(quoteExactInput, {path, amountIn})
    }

    quoteExactInputSingleV2(params: QuoteExactInputSingleV2Params["params"]) {
        return this.eth_call(quoteExactInputSingleV2, {params})
    }

    quoteExactInputSingleV3(params: QuoteExactInputSingleV3Params["params"]) {
        return this.eth_call(quoteExactInputSingleV3, {params})
    }
}
