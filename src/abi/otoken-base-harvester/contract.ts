import { ContractBase } from '../abi.support.js'
import { aero, amoStrategy, governor, isGovernor, operatorAddr, swapRouter, vault, weth } from './functions.js'

export class Contract extends ContractBase {
    aero() {
        return this.eth_call(aero, {})
    }

    amoStrategy() {
        return this.eth_call(amoStrategy, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    operatorAddr() {
        return this.eth_call(operatorAddr, {})
    }

    swapRouter() {
        return this.eth_call(swapRouter, {})
    }

    vault() {
        return this.eth_call(vault, {})
    }

    weth() {
        return this.eth_call(weth, {})
    }
}
