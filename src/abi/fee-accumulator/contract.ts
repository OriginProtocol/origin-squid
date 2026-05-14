import { ContractBase } from '../abi.support.js'
import { STRATEGY, collect } from './functions.js'

export class Contract extends ContractBase {
    STRATEGY() {
        return this.eth_call(STRATEGY, {})
    }

    collect() {
        return this.eth_call(collect, {})
    }
}
