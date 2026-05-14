import { ContractBase } from '../abi.support.js'
import { factories, getAllFactories, governor, isApprovedFactory, isGovernor } from './functions.js'
import type { FactoriesParams, IsApprovedFactoryParams } from './functions.js'

export class Contract extends ContractBase {
    factories(_0: FactoriesParams["_0"]) {
        return this.eth_call(factories, {_0})
    }

    getAllFactories() {
        return this.eth_call(getAllFactories, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    isApprovedFactory(_factoryAddress: IsApprovedFactoryParams["_factoryAddress"]) {
        return this.eth_call(isApprovedFactory, {_factoryAddress})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }
}
