import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './oeth-oracle-router.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const functions = {
    cacheDecimals: new Func<[asset: string], {asset: string}, number>(
        abi, '0x36b6d944'
    ),
    price: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0xaea91078'
    ),
}

export class Contract extends ContractBase {

    price(asset: string): Promise<bigint> {
        return this.eth_call(functions.price, [asset])
    }
}
