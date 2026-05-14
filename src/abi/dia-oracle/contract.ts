import { ContractBase } from '../abi.support.js'
import { getValue, values } from './functions.js'
import type { GetValueParams, ValuesParams } from './functions.js'

export class Contract extends ContractBase {
    getValue(key: GetValueParams["key"]) {
        return this.eth_call(getValue, {key})
    }

    values(_0: ValuesParams["_0"]) {
        return this.eth_call(values, {_0})
    }
}
