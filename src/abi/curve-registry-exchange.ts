import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    TokenExchange: event("0xbd3eb7bcfdd1721a4eb4f00d0df3ed91bd6f17222f82b2d7bce519d8cab3fe46", "TokenExchange(address,address,address,address,address,uint256,uint256)", {"buyer": indexed(p.address), "receiver": indexed(p.address), "pool": indexed(p.address), "token_sold": p.address, "token_bought": p.address, "amount_sold": p.uint256, "amount_bought": p.uint256}),
    ExchangeMultiple: event("0x14b561178ae0f368f40fafd0485c4f7129ea71cdc00b4ce1e5940f9bc659c8b2", "ExchangeMultiple(address,address,address[9],uint256[3][4],address[4],uint256,uint256)", {"buyer": indexed(p.address), "receiver": indexed(p.address), "route": p.fixedSizeArray(p.address, 9), "swap_params": p.fixedSizeArray(p.fixedSizeArray(p.uint256, 3), 4), "pools": p.fixedSizeArray(p.address, 4), "amount_sold": p.uint256, "amount_bought": p.uint256}),
}

export const functions = {
    'exchange_with_best_rate(address,address,uint256,uint256)': fun("0x10e5e303", "exchange_with_best_rate(address,address,uint256,uint256)", {"_from": p.address, "_to": p.address, "_amount": p.uint256, "_expected": p.uint256}, p.uint256),
    'exchange_with_best_rate(address,address,uint256,uint256,address)': fun("0x9f69a6a6", "exchange_with_best_rate(address,address,uint256,uint256,address)", {"_from": p.address, "_to": p.address, "_amount": p.uint256, "_expected": p.uint256, "_receiver": p.address}, p.uint256),
    'exchange(address,address,address,uint256,uint256)': fun("0x4798ce5b", "exchange(address,address,address,uint256,uint256)", {"_pool": p.address, "_from": p.address, "_to": p.address, "_amount": p.uint256, "_expected": p.uint256}, p.uint256),
    'exchange(address,address,address,uint256,uint256,address)': fun("0x1a4c1ca3", "exchange(address,address,address,uint256,uint256,address)", {"_pool": p.address, "_from": p.address, "_to": p.address, "_amount": p.uint256, "_expected": p.uint256, "_receiver": p.address}, p.uint256),
    'exchange_multiple(address[9],uint256[3][4],uint256,uint256)': fun("0x353ca424", "exchange_multiple(address[9],uint256[3][4],uint256,uint256)", {"_route": p.fixedSizeArray(p.address, 9), "_swap_params": p.fixedSizeArray(p.fixedSizeArray(p.uint256, 3), 4), "_amount": p.uint256, "_expected": p.uint256}, p.uint256),
    'exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4])': fun("0x9db4f7aa", "exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4])", {"_route": p.fixedSizeArray(p.address, 9), "_swap_params": p.fixedSizeArray(p.fixedSizeArray(p.uint256, 3), 4), "_amount": p.uint256, "_expected": p.uint256, "_pools": p.fixedSizeArray(p.address, 4)}, p.uint256),
    'exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4],address)': fun("0x0651cb35", "exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4],address)", {"_route": p.fixedSizeArray(p.address, 9), "_swap_params": p.fixedSizeArray(p.fixedSizeArray(p.uint256, 3), 4), "_amount": p.uint256, "_expected": p.uint256, "_pools": p.fixedSizeArray(p.address, 4), "_receiver": p.address}, p.uint256),
    'get_best_rate(address,address,uint256)': viewFun("0x4e21df75", "get_best_rate(address,address,uint256)", {"_from": p.address, "_to": p.address, "_amount": p.uint256}, {"_0": p.address, "_1": p.uint256}),
    'get_best_rate(address,address,uint256,address[8])': viewFun("0x488de9af", "get_best_rate(address,address,uint256,address[8])", {"_from": p.address, "_to": p.address, "_amount": p.uint256, "_exclude_pools": p.fixedSizeArray(p.address, 8)}, {"_0": p.address, "_1": p.uint256}),
    get_exchange_amount: viewFun("0x3973e834", "get_exchange_amount(address,address,address,uint256)", {"_pool": p.address, "_from": p.address, "_to": p.address, "_amount": p.uint256}, p.uint256),
    get_input_amount: viewFun("0x7fa5a654", "get_input_amount(address,address,address,uint256)", {"_pool": p.address, "_from": p.address, "_to": p.address, "_amount": p.uint256}, p.uint256),
    get_exchange_amounts: viewFun("0x4be9ae42", "get_exchange_amounts(address,address,address,uint256[100])", {"_pool": p.address, "_from": p.address, "_to": p.address, "_amounts": p.fixedSizeArray(p.uint256, 100)}, p.fixedSizeArray(p.uint256, 100)),
    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256)': viewFun("0x7b3d22cf", "get_exchange_multiple_amount(address[9],uint256[3][4],uint256)", {"_route": p.fixedSizeArray(p.address, 9), "_swap_params": p.fixedSizeArray(p.fixedSizeArray(p.uint256, 3), 4), "_amount": p.uint256}, p.uint256),
    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])': viewFun("0xe6eabf23", "get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])", {"_route": p.fixedSizeArray(p.address, 9), "_swap_params": p.fixedSizeArray(p.fixedSizeArray(p.uint256, 3), 4), "_amount": p.uint256, "_pools": p.fixedSizeArray(p.address, 4)}, p.uint256),
    get_calculator: viewFun("0x5d7dc825", "get_calculator(address)", {"_pool": p.address}, p.address),
    update_registry_address: fun("0x4bbc5b1f", "update_registry_address()", {}, p.bool),
    set_calculator: fun("0x188c7ee5", "set_calculator(address,address)", {"_pool": p.address, "_calculator": p.address}, p.bool),
    set_default_calculator: fun("0xda3fb2ab", "set_default_calculator(address)", {"_calculator": p.address}, p.bool),
    claim_balance: fun("0x752d53c6", "claim_balance(address)", {"_token": p.address}, p.bool),
    set_killed: fun("0x90b22997", "set_killed(bool)", {"_is_killed": p.bool}, p.bool),
    registry: viewFun("0x7b103999", "registry()", {}, p.address),
    factory_registry: viewFun("0xf7cbf4c6", "factory_registry()", {}, p.address),
    crypto_registry: viewFun("0xf3b8f829", "crypto_registry()", {}, p.address),
    default_calculator: viewFun("0x3b359fc8", "default_calculator()", {}, p.address),
    is_killed: viewFun("0x9c868ac0", "is_killed()", {}, p.bool),
}

export class Contract extends ContractBase {

    'get_best_rate(address,address,uint256)'(_from: Get_best_rateParams_0["_from"], _to: Get_best_rateParams_0["_to"], _amount: Get_best_rateParams_0["_amount"]) {
        return this.eth_call(functions['get_best_rate(address,address,uint256)'], {_from, _to, _amount})
    }

    'get_best_rate(address,address,uint256,address[8])'(_from: Get_best_rateParams_1["_from"], _to: Get_best_rateParams_1["_to"], _amount: Get_best_rateParams_1["_amount"], _exclude_pools: Get_best_rateParams_1["_exclude_pools"]) {
        return this.eth_call(functions['get_best_rate(address,address,uint256,address[8])'], {_from, _to, _amount, _exclude_pools})
    }

    get_exchange_amount(_pool: Get_exchange_amountParams["_pool"], _from: Get_exchange_amountParams["_from"], _to: Get_exchange_amountParams["_to"], _amount: Get_exchange_amountParams["_amount"]) {
        return this.eth_call(functions.get_exchange_amount, {_pool, _from, _to, _amount})
    }

    get_input_amount(_pool: Get_input_amountParams["_pool"], _from: Get_input_amountParams["_from"], _to: Get_input_amountParams["_to"], _amount: Get_input_amountParams["_amount"]) {
        return this.eth_call(functions.get_input_amount, {_pool, _from, _to, _amount})
    }

    get_exchange_amounts(_pool: Get_exchange_amountsParams["_pool"], _from: Get_exchange_amountsParams["_from"], _to: Get_exchange_amountsParams["_to"], _amounts: Get_exchange_amountsParams["_amounts"]) {
        return this.eth_call(functions.get_exchange_amounts, {_pool, _from, _to, _amounts})
    }

    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256)'(_route: Get_exchange_multiple_amountParams_0["_route"], _swap_params: Get_exchange_multiple_amountParams_0["_swap_params"], _amount: Get_exchange_multiple_amountParams_0["_amount"]) {
        return this.eth_call(functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256)'], {_route, _swap_params, _amount})
    }

    'get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])'(_route: Get_exchange_multiple_amountParams_1["_route"], _swap_params: Get_exchange_multiple_amountParams_1["_swap_params"], _amount: Get_exchange_multiple_amountParams_1["_amount"], _pools: Get_exchange_multiple_amountParams_1["_pools"]) {
        return this.eth_call(functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])'], {_route, _swap_params, _amount, _pools})
    }

    get_calculator(_pool: Get_calculatorParams["_pool"]) {
        return this.eth_call(functions.get_calculator, {_pool})
    }

    registry() {
        return this.eth_call(functions.registry, {})
    }

    factory_registry() {
        return this.eth_call(functions.factory_registry, {})
    }

    crypto_registry() {
        return this.eth_call(functions.crypto_registry, {})
    }

    default_calculator() {
        return this.eth_call(functions.default_calculator, {})
    }

    is_killed() {
        return this.eth_call(functions.is_killed, {})
    }
}

/// Event types
export type TokenExchangeEventArgs = EParams<typeof events.TokenExchange>
export type ExchangeMultipleEventArgs = EParams<typeof events.ExchangeMultiple>

/// Function types
export type Exchange_with_best_rateParams_0 = FunctionArguments<typeof functions['exchange_with_best_rate(address,address,uint256,uint256)']>
export type Exchange_with_best_rateReturn_0 = FunctionReturn<typeof functions['exchange_with_best_rate(address,address,uint256,uint256)']>

export type Exchange_with_best_rateParams_1 = FunctionArguments<typeof functions['exchange_with_best_rate(address,address,uint256,uint256,address)']>
export type Exchange_with_best_rateReturn_1 = FunctionReturn<typeof functions['exchange_with_best_rate(address,address,uint256,uint256,address)']>

export type ExchangeParams_0 = FunctionArguments<typeof functions['exchange(address,address,address,uint256,uint256)']>
export type ExchangeReturn_0 = FunctionReturn<typeof functions['exchange(address,address,address,uint256,uint256)']>

export type ExchangeParams_1 = FunctionArguments<typeof functions['exchange(address,address,address,uint256,uint256,address)']>
export type ExchangeReturn_1 = FunctionReturn<typeof functions['exchange(address,address,address,uint256,uint256,address)']>

export type Exchange_multipleParams_0 = FunctionArguments<typeof functions['exchange_multiple(address[9],uint256[3][4],uint256,uint256)']>
export type Exchange_multipleReturn_0 = FunctionReturn<typeof functions['exchange_multiple(address[9],uint256[3][4],uint256,uint256)']>

export type Exchange_multipleParams_1 = FunctionArguments<typeof functions['exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4])']>
export type Exchange_multipleReturn_1 = FunctionReturn<typeof functions['exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4])']>

export type Exchange_multipleParams_2 = FunctionArguments<typeof functions['exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4],address)']>
export type Exchange_multipleReturn_2 = FunctionReturn<typeof functions['exchange_multiple(address[9],uint256[3][4],uint256,uint256,address[4],address)']>

export type Get_best_rateParams_0 = FunctionArguments<typeof functions['get_best_rate(address,address,uint256)']>
export type Get_best_rateReturn_0 = FunctionReturn<typeof functions['get_best_rate(address,address,uint256)']>

export type Get_best_rateParams_1 = FunctionArguments<typeof functions['get_best_rate(address,address,uint256,address[8])']>
export type Get_best_rateReturn_1 = FunctionReturn<typeof functions['get_best_rate(address,address,uint256,address[8])']>

export type Get_exchange_amountParams = FunctionArguments<typeof functions.get_exchange_amount>
export type Get_exchange_amountReturn = FunctionReturn<typeof functions.get_exchange_amount>

export type Get_input_amountParams = FunctionArguments<typeof functions.get_input_amount>
export type Get_input_amountReturn = FunctionReturn<typeof functions.get_input_amount>

export type Get_exchange_amountsParams = FunctionArguments<typeof functions.get_exchange_amounts>
export type Get_exchange_amountsReturn = FunctionReturn<typeof functions.get_exchange_amounts>

export type Get_exchange_multiple_amountParams_0 = FunctionArguments<typeof functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256)']>
export type Get_exchange_multiple_amountReturn_0 = FunctionReturn<typeof functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256)']>

export type Get_exchange_multiple_amountParams_1 = FunctionArguments<typeof functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])']>
export type Get_exchange_multiple_amountReturn_1 = FunctionReturn<typeof functions['get_exchange_multiple_amount(address[9],uint256[3][4],uint256,address[4])']>

export type Get_calculatorParams = FunctionArguments<typeof functions.get_calculator>
export type Get_calculatorReturn = FunctionReturn<typeof functions.get_calculator>

export type Update_registry_addressParams = FunctionArguments<typeof functions.update_registry_address>
export type Update_registry_addressReturn = FunctionReturn<typeof functions.update_registry_address>

export type Set_calculatorParams = FunctionArguments<typeof functions.set_calculator>
export type Set_calculatorReturn = FunctionReturn<typeof functions.set_calculator>

export type Set_default_calculatorParams = FunctionArguments<typeof functions.set_default_calculator>
export type Set_default_calculatorReturn = FunctionReturn<typeof functions.set_default_calculator>

export type Claim_balanceParams = FunctionArguments<typeof functions.claim_balance>
export type Claim_balanceReturn = FunctionReturn<typeof functions.claim_balance>

export type Set_killedParams = FunctionArguments<typeof functions.set_killed>
export type Set_killedReturn = FunctionReturn<typeof functions.set_killed>

export type RegistryParams = FunctionArguments<typeof functions.registry>
export type RegistryReturn = FunctionReturn<typeof functions.registry>

export type Factory_registryParams = FunctionArguments<typeof functions.factory_registry>
export type Factory_registryReturn = FunctionReturn<typeof functions.factory_registry>

export type Crypto_registryParams = FunctionArguments<typeof functions.crypto_registry>
export type Crypto_registryReturn = FunctionReturn<typeof functions.crypto_registry>

export type Default_calculatorParams = FunctionArguments<typeof functions.default_calculator>
export type Default_calculatorReturn = FunctionReturn<typeof functions.default_calculator>

export type Is_killedParams = FunctionArguments<typeof functions.is_killed>
export type Is_killedReturn = FunctionReturn<typeof functions.is_killed>

