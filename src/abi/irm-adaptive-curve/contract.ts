import { ContractBase } from '../abi.support.js'
import { rateAtTarget } from './functions.js'
import type { RateAtTargetParams } from './functions.js'

export class Contract extends ContractBase {
    rateAtTarget(id: RateAtTargetParams["id"]) {
        return this.eth_call(rateAtTarget, {id})
    }
}
