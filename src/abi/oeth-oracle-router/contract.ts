import { ContractBase } from '../abi.support.js'
import { cacheDecimals, price } from './functions.js'
import type { CacheDecimalsParams, PriceParams } from './functions.js'

export class Contract extends ContractBase {
    cacheDecimals(asset: CacheDecimalsParams["asset"]) {
        return this.eth_call(cacheDecimals, {asset})
    }

    price(asset: PriceParams["asset"]) {
        return this.eth_call(price, {asset})
    }
}
