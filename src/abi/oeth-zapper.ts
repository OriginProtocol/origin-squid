import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './oeth-zapper.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Zap: new LogEvent<([minter: string, asset: string, amount: bigint] & {minter: string, asset: string, amount: bigint})>(
        abi, '0x9d0b99c299bdb5656c0c9db6e1886c612db5c2881760ea54ab244f6338b4ebd6'
    ),
}

export const functions = {
    deposit: new Func<[], {}, bigint>(
        abi, '0xd0e30db0'
    ),
    depositSFRXETH: new Func<[amount: bigint, minOETH: bigint], {amount: bigint, minOETH: bigint}, bigint>(
        abi, '0xd443e97d'
    ),
    frxeth: new Func<[], {}, string>(
        abi, '0x6f708a9d'
    ),
    oeth: new Func<[], {}, string>(
        abi, '0xccfe2a69'
    ),
    sfrxeth: new Func<[], {}, string>(
        abi, '0xa07311af'
    ),
    vault: new Func<[], {}, string>(
        abi, '0xfbfa77cf'
    ),
    weth: new Func<[], {}, string>(
        abi, '0x3fc8cef3'
    ),
}

export class Contract extends ContractBase {

    frxeth(): Promise<string> {
        return this.eth_call(functions.frxeth, [])
    }

    oeth(): Promise<string> {
        return this.eth_call(functions.oeth, [])
    }

    sfrxeth(): Promise<string> {
        return this.eth_call(functions.sfrxeth, [])
    }

    vault(): Promise<string> {
        return this.eth_call(functions.vault, [])
    }

    weth(): Promise<string> {
        return this.eth_call(functions.weth, [])
    }
}
