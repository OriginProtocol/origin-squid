import { ContractBase } from '../abi.support.js'
import { admin, governor, implementation, isGovernor } from './functions.js'

export class Contract extends ContractBase {
    admin() {
        return this.eth_call(admin, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    implementation() {
        return this.eth_call(implementation, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }
}
