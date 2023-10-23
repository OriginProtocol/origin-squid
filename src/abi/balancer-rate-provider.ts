import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './balancer-rate-provider.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const functions = {
    getRate: new Func<[], {}, bigint>(
        abi, '0x679aefce'
    ),
    rocketTokenRETH: new Func<[], {}, string>(
        abi, '0xdb5dacc9'
    ),
}

export class Contract extends ContractBase {

    getRate(): Promise<bigint> {
        return this.eth_call(functions.getRate, [])
    }

    rocketTokenRETH(): Promise<string> {
        return this.eth_call(functions.rocketTokenRETH, [])
    }
}
