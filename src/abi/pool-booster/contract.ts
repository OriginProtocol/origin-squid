import { ContractBase } from '../abi.support.js'
import { MIN_BRIBE_AMOUNT, bribeContractOS, bribeContractOther, osToken, split } from './functions.js'

export class Contract extends ContractBase {
    MIN_BRIBE_AMOUNT() {
        return this.eth_call(MIN_BRIBE_AMOUNT, {})
    }

    bribeContractOS() {
        return this.eth_call(bribeContractOS, {})
    }

    bribeContractOther() {
        return this.eth_call(bribeContractOther, {})
    }

    osToken() {
        return this.eth_call(osToken, {})
    }

    split() {
        return this.eth_call(split, {})
    }
}
