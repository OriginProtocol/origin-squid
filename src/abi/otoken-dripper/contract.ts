import { ContractBase } from '../abi.support.js'
import { availableFunds, drip, dripDuration, governor, isGovernor } from './functions.js'

export class Contract extends ContractBase {
    availableFunds() {
        return this.eth_call(availableFunds, {})
    }

    drip() {
        return this.eth_call(drip, {})
    }

    dripDuration() {
        return this.eth_call(dripDuration, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }
}
