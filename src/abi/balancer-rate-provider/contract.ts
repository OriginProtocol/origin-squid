import { ContractBase } from '../abi.support.js'
import { getRate, rocketTokenRETH } from './functions.js'

export class Contract extends ContractBase {
    getRate() {
        return this.eth_call(getRate, {})
    }

    rocketTokenRETH() {
        return this.eth_call(rocketTokenRETH, {})
    }
}
