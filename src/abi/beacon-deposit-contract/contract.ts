import { ContractBase } from '../abi.support.js'
import { get_deposit_count, get_deposit_root, supportsInterface } from './functions.js'
import type { SupportsInterfaceParams } from './functions.js'

export class Contract extends ContractBase {
    get_deposit_count() {
        return this.eth_call(get_deposit_count, {})
    }

    get_deposit_root() {
        return this.eth_call(get_deposit_root, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(supportsInterface, {interfaceId})
    }
}
