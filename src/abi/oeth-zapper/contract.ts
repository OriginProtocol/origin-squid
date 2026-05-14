import { ContractBase } from '../abi.support.js'
import { deposit, depositSFRXETH, frxeth, oeth, sfrxeth, vault, weth } from './functions.js'
import type { DepositSFRXETHParams } from './functions.js'

export class Contract extends ContractBase {
    deposit() {
        return this.eth_call(deposit, {})
    }

    depositSFRXETH(amount: DepositSFRXETHParams["amount"], minOETH: DepositSFRXETHParams["minOETH"]) {
        return this.eth_call(depositSFRXETH, {amount, minOETH})
    }

    frxeth() {
        return this.eth_call(frxeth, {})
    }

    oeth() {
        return this.eth_call(oeth, {})
    }

    sfrxeth() {
        return this.eth_call(sfrxeth, {})
    }

    vault() {
        return this.eth_call(vault, {})
    }

    weth() {
        return this.eth_call(weth, {})
    }
}
