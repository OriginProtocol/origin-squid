import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './curve-registry-exchange.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    TokenExchange: new LogEvent<([buyer: string, receiver: string, pool: string, token_sold: string, token_bought: string, amount_sold: bigint, amount_bought: bigint] & {buyer: string, receiver: string, pool: string, token_sold: string, token_bought: string, amount_sold: bigint, amount_bought: bigint})>(
        abi, '0xbd3eb7bcfdd1721a4eb4f00d0df3ed91bd6f17222f82b2d7bce519d8cab3fe46'
    ),
    ExchangeMultiple: new LogEvent<([buyer: string, receiver: string, route: Array<string>, swap_params: Array<Array<bigint>>, pools: Array<string>, amount_sold: bigint, amount_bought: bigint] & {buyer: string, receiver: string, route: Array<string>, swap_params: Array<Array<bigint>>, pools: Array<string>, amount_sold: bigint, amount_bought: bigint})>(
        abi, '0x14b561178ae0f368f40fafd0485c4f7129ea71cdc00b4ce1e5940f9bc659c8b2'
    ),
}

export const functions = {
    'exchange_with_best_rate(address,address,uint256,uint256)': new Func<[_from: string, _to: string, _amount: bigint, _expected: bigint], {_from: string, _to: string, _amount: bigint, _expected: bigint}, bigint>(
        abi, '0x10e5e303'
    ),
    'exchange_with_best_rate(address,address,uint256,uint256,address)': new Func<[_from: string, _to: string, _amount: bigint, _expected: bigint, _receiver: string], {_from: string, _to: string, _amount: bigint, _expected: bigint, _receiver: string}, bigint>(
        abi, '0x9f69a6a6'
    ),
    'exchange(address,address,address,uint256,uint256)': new Func<[_pool: string, _from: string, _to: string, _amount: bigint, _expected: bigint], {_pool: string, _from: string, _to: string, _amount: bigint, _expected: bigint}, bigint>(
        abi, '0x4798ce5b'
    ),
    'exchange(address,address,address,uint256,uint256,address)': new Func<[_pool: string, _from: string, _to: string, _amount: bigint, _expected: bigint, _receiver: string], {_pool: string, _from: string, _to: string, _amount: bigint, _expected: bigint, _receiver: string}, bigint>(
        abi, '0x1a4c1ca3'
    ),
    'exchange_multiple(address[9],uint256[3][4],uint256,uint256)': new Func<[_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _expected: bigint], {_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _expected: bigint}, bigint>(
        abi, '0x353ca424'
    ),
    'exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4])': new Func<[_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _expected: bigint, _pools: Array<string>], {_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _expected: bigint, _pools: Array<string>}, bigint>(
        abi, '0x9db4f7aa'
    ),
    'exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4],address)': new Func<[_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _expected: bigint, _pools: Array<string>, _receiver: string], {_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _expected: bigint, _pools: Array<string>, _receiver: string}, bigint>(
        abi, '0x0651cb35'
    ),
    'get_best_rate(address,address,uint256)': new Func<[_from: string, _to: string, _amount: bigint], {_from: string, _to: string, _amount: bigint}, [_: string, _: bigint]>(
        abi, '0x4e21df75'
    ),
    'get_best_rate(address,address,uint256,address[8])': new Func<[_from: string, _to: string, _amount: bigint, _exclude_pools: Array<string>], {_from: string, _to: string, _amount: bigint, _exclude_pools: Array<string>}, [_: string, _: bigint]>(
        abi, '0x488de9af'
    ),
    get_exchange_amount: new Func<[_pool: string, _from: string, _to: string, _amount: bigint], {_pool: string, _from: string, _to: string, _amount: bigint}, bigint>(
        abi, '0x3973e834'
    ),
    get_input_amount: new Func<[_pool: string, _from: string, _to: string, _amount: bigint], {_pool: string, _from: string, _to: string, _amount: bigint}, bigint>(
        abi, '0x7fa5a654'
    ),
    get_exchange_amounts: new Func<[_pool: string, _from: string, _to: string, _amounts: Array<bigint>], {_pool: string, _from: string, _to: string, _amounts: Array<bigint>}, Array<bigint>>(
        abi, '0x4be9ae42'
    ),
    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256)': new Func<[_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint], {_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint}, bigint>(
        abi, '0x7b3d22cf'
    ),
    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])': new Func<[_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _pools: Array<string>], {_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _pools: Array<string>}, bigint>(
        abi, '0xe6eabf23'
    ),
    get_calculator: new Func<[_pool: string], {_pool: string}, string>(
        abi, '0x5d7dc825'
    ),
    update_registry_address: new Func<[], {}, boolean>(
        abi, '0x4bbc5b1f'
    ),
    set_calculator: new Func<[_pool: string, _calculator: string], {_pool: string, _calculator: string}, boolean>(
        abi, '0x188c7ee5'
    ),
    set_default_calculator: new Func<[_calculator: string], {_calculator: string}, boolean>(
        abi, '0xda3fb2ab'
    ),
    claim_balance: new Func<[_token: string], {_token: string}, boolean>(
        abi, '0x752d53c6'
    ),
    set_killed: new Func<[_is_killed: boolean], {_is_killed: boolean}, boolean>(
        abi, '0x90b22997'
    ),
    registry: new Func<[], {}, string>(
        abi, '0x7b103999'
    ),
    factory_registry: new Func<[], {}, string>(
        abi, '0xf7cbf4c6'
    ),
    crypto_registry: new Func<[], {}, string>(
        abi, '0xf3b8f829'
    ),
    default_calculator: new Func<[], {}, string>(
        abi, '0x3b359fc8'
    ),
    is_killed: new Func<[], {}, boolean>(
        abi, '0x9c868ac0'
    ),
}

export class Contract extends ContractBase {

    'get_best_rate(address,address,uint256)'(_from: string, _to: string, _amount: bigint): Promise<[_: string, _: bigint]> {
        return this.eth_call(functions['get_best_rate(address,address,uint256)'], [_from, _to, _amount])
    }

    'get_best_rate(address,address,uint256,address[8])'(_from: string, _to: string, _amount: bigint, _exclude_pools: Array<string>): Promise<[_: string, _: bigint]> {
        return this.eth_call(functions['get_best_rate(address,address,uint256,address[8])'], [_from, _to, _amount, _exclude_pools])
    }

    get_exchange_amount(_pool: string, _from: string, _to: string, _amount: bigint): Promise<bigint> {
        return this.eth_call(functions.get_exchange_amount, [_pool, _from, _to, _amount])
    }

    get_input_amount(_pool: string, _from: string, _to: string, _amount: bigint): Promise<bigint> {
        return this.eth_call(functions.get_input_amount, [_pool, _from, _to, _amount])
    }

    get_exchange_amounts(_pool: string, _from: string, _to: string, _amounts: Array<bigint>): Promise<Array<bigint>> {
        return this.eth_call(functions.get_exchange_amounts, [_pool, _from, _to, _amounts])
    }

    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256)'(_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint): Promise<bigint> {
        return this.eth_call(functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256)'], [_route, _swap_params, _amount])
    }

    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])'(_route: Array<string>, _swap_params: Array<Array<bigint>>, _amount: bigint, _pools: Array<string>): Promise<bigint> {
        return this.eth_call(functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])'], [_route, _swap_params, _amount, _pools])
    }

    get_calculator(_pool: string): Promise<string> {
        return this.eth_call(functions.get_calculator, [_pool])
    }

    registry(): Promise<string> {
        return this.eth_call(functions.registry, [])
    }

    factory_registry(): Promise<string> {
        return this.eth_call(functions.factory_registry, [])
    }

    crypto_registry(): Promise<string> {
        return this.eth_call(functions.crypto_registry, [])
    }

    default_calculator(): Promise<string> {
        return this.eth_call(functions.default_calculator, [])
    }

    is_killed(): Promise<boolean> {
        return this.eth_call(functions.is_killed, [])
    }
}
