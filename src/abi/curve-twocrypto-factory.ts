import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    TwocryptoPoolDeployed: event("0x8152a3037e3dc54154ad0d2cadb1cf7e1d1b9e2b625faa3dfb4fe03d609102ca", "TwocryptoPoolDeployed(address,string,string,address[2],address,bytes32,uint256[2],uint256,uint256,uint256,uint256,address)", {"pool": p.address, "name": p.string, "symbol": p.string, "coins": p.fixedSizeArray(p.address, 2), "math": p.address, "salt": p.bytes32, "precisions": p.fixedSizeArray(p.uint256, 2), "packed_A_gamma": p.uint256, "packed_fee_params": p.uint256, "packed_rebalancing_params": p.uint256, "packed_prices": p.uint256, "deployer": p.address}),
    LiquidityGaugeDeployed: event("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b", "LiquidityGaugeDeployed(address,address)", {"pool": p.address, "gauge": p.address}),
    UpdateFeeReceiver: event("0x2861448678f0be67f11bfb5481b3e3b4cfeb3acc6126ad60a05f95bfc6530666", "UpdateFeeReceiver(address,address)", {"_old_fee_receiver": p.address, "_new_fee_receiver": p.address}),
    UpdatePoolImplementation: event("0x6a42ef9605e135afaf6ae4f3683b161a3b7369d07c9d52c701ab69553e04c3b6", "UpdatePoolImplementation(uint256,address,address)", {"_implemention_id": p.uint256, "_old_pool_implementation": p.address, "_new_pool_implementation": p.address}),
    UpdateGaugeImplementation: event("0x1fd705f9c77053962a503f2f2f57f0862b4c3af687c25615c13817a86946c359", "UpdateGaugeImplementation(address,address)", {"_old_gauge_implementation": p.address, "_new_gauge_implementation": p.address}),
    UpdateMathImplementation: event("0x68fe8fc3ac76ec17e21117df5e854c8c25b7b5f776aad2adc927fdd156bcd6de", "UpdateMathImplementation(address,address)", {"_old_math_implementation": p.address, "_new_math_implementation": p.address}),
    UpdateViewsImplementation: event("0xd84eb1ea70cda40a6bfaa11f4f69efa10cbc5eb82760b3058f440512ec1d6d1f", "UpdateViewsImplementation(address,address)", {"_old_views_implementation": p.address, "_new_views_implementation": p.address}),
    TransferOwnership: event("0x5c486528ec3e3f0ea91181cff8116f02bfa350e03b8b6f12e00765adbb5af85c", "TransferOwnership(address,address)", {"_old_owner": p.address, "_new_owner": p.address}),
}

export const functions = {
    initialise_ownership: fun("0x45e62f85", "initialise_ownership(address,address)", {"_fee_receiver": p.address, "_admin": p.address}, ),
    deploy_pool: fun("0xc955fa04", "deploy_pool(string,string,address[2],uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)", {"_name": p.string, "_symbol": p.string, "_coins": p.fixedSizeArray(p.address, 2), "implementation_id": p.uint256, "A": p.uint256, "gamma": p.uint256, "mid_fee": p.uint256, "out_fee": p.uint256, "fee_gamma": p.uint256, "allowed_extra_profit": p.uint256, "adjustment_step": p.uint256, "ma_exp_time": p.uint256, "initial_price": p.uint256}, p.address),
    deploy_gauge: fun("0x96bebb34", "deploy_gauge(address)", {"_pool": p.address}, p.address),
    set_fee_receiver: fun("0xe41ab771", "set_fee_receiver(address)", {"_fee_receiver": p.address}, ),
    set_pool_implementation: fun("0x6f385ff6", "set_pool_implementation(address,uint256)", {"_pool_implementation": p.address, "_implementation_index": p.uint256}, ),
    set_gauge_implementation: fun("0x8f03182c", "set_gauge_implementation(address)", {"_gauge_implementation": p.address}, ),
    set_views_implementation: fun("0xf6fa937f", "set_views_implementation(address)", {"_views_implementation": p.address}, ),
    set_math_implementation: fun("0xb07426f4", "set_math_implementation(address)", {"_math_implementation": p.address}, ),
    commit_transfer_ownership: fun("0x6b441a40", "commit_transfer_ownership(address)", {"_addr": p.address}, ),
    accept_transfer_ownership: fun("0xe5ea47b8", "accept_transfer_ownership()", {}, ),
    'find_pool_for_coins(address,address)': viewFun("0xa87df06c", "find_pool_for_coins(address,address)", {"_from": p.address, "_to": p.address}, p.address),
    'find_pool_for_coins(address,address,uint256)': viewFun("0x6982eb0b", "find_pool_for_coins(address,address,uint256)", {"_from": p.address, "_to": p.address, "i": p.uint256}, p.address),
    pool_count: viewFun("0x956aae3a", "pool_count()", {}, p.uint256),
    get_coins: viewFun("0x9ac90d3d", "get_coins(address)", {"_pool": p.address}, p.fixedSizeArray(p.address, 2)),
    get_decimals: viewFun("0x52b51555", "get_decimals(address)", {"_pool": p.address}, p.fixedSizeArray(p.uint256, 2)),
    get_balances: viewFun("0x92e3cc2d", "get_balances(address)", {"_pool": p.address}, p.fixedSizeArray(p.uint256, 2)),
    get_coin_indices: viewFun("0xeb85226d", "get_coin_indices(address,address,address)", {"_pool": p.address, "_from": p.address, "_to": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    get_gauge: viewFun("0xdaf297b9", "get_gauge(address)", {"_pool": p.address}, p.address),
    get_market_counts: viewFun("0xc1856b52", "get_market_counts(address,address)", {"coin_a": p.address, "coin_b": p.address}, p.uint256),
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    future_admin: viewFun("0x17f7182a", "future_admin()", {}, p.address),
    fee_receiver: viewFun("0xcab4d3db", "fee_receiver()", {}, p.address),
    pool_implementations: viewFun("0x3273ff47", "pool_implementations(uint256)", {"arg0": p.uint256}, p.address),
    gauge_implementation: viewFun("0x8df24207", "gauge_implementation()", {}, p.address),
    views_implementation: viewFun("0xe31593d8", "views_implementation()", {}, p.address),
    math_implementation: viewFun("0xa13c8f81", "math_implementation()", {}, p.address),
    pool_list: viewFun("0x3a1d5d8e", "pool_list(uint256)", {"arg0": p.uint256}, p.address),
}

export class Contract extends ContractBase {

    'find_pool_for_coins(address,address)'(_from: Find_pool_for_coinsParams_0["_from"], _to: Find_pool_for_coinsParams_0["_to"]) {
        return this.eth_call(functions['find_pool_for_coins(address,address)'], {_from, _to})
    }

    'find_pool_for_coins(address,address,uint256)'(_from: Find_pool_for_coinsParams_1["_from"], _to: Find_pool_for_coinsParams_1["_to"], i: Find_pool_for_coinsParams_1["i"]) {
        return this.eth_call(functions['find_pool_for_coins(address,address,uint256)'], {_from, _to, i})
    }

    pool_count() {
        return this.eth_call(functions.pool_count, {})
    }

    get_coins(_pool: Get_coinsParams["_pool"]) {
        return this.eth_call(functions.get_coins, {_pool})
    }

    get_decimals(_pool: Get_decimalsParams["_pool"]) {
        return this.eth_call(functions.get_decimals, {_pool})
    }

    get_balances(_pool: Get_balancesParams["_pool"]) {
        return this.eth_call(functions.get_balances, {_pool})
    }

    get_coin_indices(_pool: Get_coin_indicesParams["_pool"], _from: Get_coin_indicesParams["_from"], _to: Get_coin_indicesParams["_to"]) {
        return this.eth_call(functions.get_coin_indices, {_pool, _from, _to})
    }

    get_gauge(_pool: Get_gaugeParams["_pool"]) {
        return this.eth_call(functions.get_gauge, {_pool})
    }

    get_market_counts(coin_a: Get_market_countsParams["coin_a"], coin_b: Get_market_countsParams["coin_b"]) {
        return this.eth_call(functions.get_market_counts, {coin_a, coin_b})
    }

    admin() {
        return this.eth_call(functions.admin, {})
    }

    future_admin() {
        return this.eth_call(functions.future_admin, {})
    }

    fee_receiver() {
        return this.eth_call(functions.fee_receiver, {})
    }

    pool_implementations(arg0: Pool_implementationsParams["arg0"]) {
        return this.eth_call(functions.pool_implementations, {arg0})
    }

    gauge_implementation() {
        return this.eth_call(functions.gauge_implementation, {})
    }

    views_implementation() {
        return this.eth_call(functions.views_implementation, {})
    }

    math_implementation() {
        return this.eth_call(functions.math_implementation, {})
    }

    pool_list(arg0: Pool_listParams["arg0"]) {
        return this.eth_call(functions.pool_list, {arg0})
    }
}

/// Event types
export type TwocryptoPoolDeployedEventArgs = EParams<typeof events.TwocryptoPoolDeployed>
export type LiquidityGaugeDeployedEventArgs = EParams<typeof events.LiquidityGaugeDeployed>
export type UpdateFeeReceiverEventArgs = EParams<typeof events.UpdateFeeReceiver>
export type UpdatePoolImplementationEventArgs = EParams<typeof events.UpdatePoolImplementation>
export type UpdateGaugeImplementationEventArgs = EParams<typeof events.UpdateGaugeImplementation>
export type UpdateMathImplementationEventArgs = EParams<typeof events.UpdateMathImplementation>
export type UpdateViewsImplementationEventArgs = EParams<typeof events.UpdateViewsImplementation>
export type TransferOwnershipEventArgs = EParams<typeof events.TransferOwnership>

/// Function types
export type Initialise_ownershipParams = FunctionArguments<typeof functions.initialise_ownership>
export type Initialise_ownershipReturn = FunctionReturn<typeof functions.initialise_ownership>

export type Deploy_poolParams = FunctionArguments<typeof functions.deploy_pool>
export type Deploy_poolReturn = FunctionReturn<typeof functions.deploy_pool>

export type Deploy_gaugeParams = FunctionArguments<typeof functions.deploy_gauge>
export type Deploy_gaugeReturn = FunctionReturn<typeof functions.deploy_gauge>

export type Set_fee_receiverParams = FunctionArguments<typeof functions.set_fee_receiver>
export type Set_fee_receiverReturn = FunctionReturn<typeof functions.set_fee_receiver>

export type Set_pool_implementationParams = FunctionArguments<typeof functions.set_pool_implementation>
export type Set_pool_implementationReturn = FunctionReturn<typeof functions.set_pool_implementation>

export type Set_gauge_implementationParams = FunctionArguments<typeof functions.set_gauge_implementation>
export type Set_gauge_implementationReturn = FunctionReturn<typeof functions.set_gauge_implementation>

export type Set_views_implementationParams = FunctionArguments<typeof functions.set_views_implementation>
export type Set_views_implementationReturn = FunctionReturn<typeof functions.set_views_implementation>

export type Set_math_implementationParams = FunctionArguments<typeof functions.set_math_implementation>
export type Set_math_implementationReturn = FunctionReturn<typeof functions.set_math_implementation>

export type Commit_transfer_ownershipParams = FunctionArguments<typeof functions.commit_transfer_ownership>
export type Commit_transfer_ownershipReturn = FunctionReturn<typeof functions.commit_transfer_ownership>

export type Accept_transfer_ownershipParams = FunctionArguments<typeof functions.accept_transfer_ownership>
export type Accept_transfer_ownershipReturn = FunctionReturn<typeof functions.accept_transfer_ownership>

export type Find_pool_for_coinsParams_0 = FunctionArguments<typeof functions['find_pool_for_coins(address,address)']>
export type Find_pool_for_coinsReturn_0 = FunctionReturn<typeof functions['find_pool_for_coins(address,address)']>

export type Find_pool_for_coinsParams_1 = FunctionArguments<typeof functions['find_pool_for_coins(address,address,uint256)']>
export type Find_pool_for_coinsReturn_1 = FunctionReturn<typeof functions['find_pool_for_coins(address,address,uint256)']>

export type Pool_countParams = FunctionArguments<typeof functions.pool_count>
export type Pool_countReturn = FunctionReturn<typeof functions.pool_count>

export type Get_coinsParams = FunctionArguments<typeof functions.get_coins>
export type Get_coinsReturn = FunctionReturn<typeof functions.get_coins>

export type Get_decimalsParams = FunctionArguments<typeof functions.get_decimals>
export type Get_decimalsReturn = FunctionReturn<typeof functions.get_decimals>

export type Get_balancesParams = FunctionArguments<typeof functions.get_balances>
export type Get_balancesReturn = FunctionReturn<typeof functions.get_balances>

export type Get_coin_indicesParams = FunctionArguments<typeof functions.get_coin_indices>
export type Get_coin_indicesReturn = FunctionReturn<typeof functions.get_coin_indices>

export type Get_gaugeParams = FunctionArguments<typeof functions.get_gauge>
export type Get_gaugeReturn = FunctionReturn<typeof functions.get_gauge>

export type Get_market_countsParams = FunctionArguments<typeof functions.get_market_counts>
export type Get_market_countsReturn = FunctionReturn<typeof functions.get_market_counts>

export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type Future_adminParams = FunctionArguments<typeof functions.future_admin>
export type Future_adminReturn = FunctionReturn<typeof functions.future_admin>

export type Fee_receiverParams = FunctionArguments<typeof functions.fee_receiver>
export type Fee_receiverReturn = FunctionReturn<typeof functions.fee_receiver>

export type Pool_implementationsParams = FunctionArguments<typeof functions.pool_implementations>
export type Pool_implementationsReturn = FunctionReturn<typeof functions.pool_implementations>

export type Gauge_implementationParams = FunctionArguments<typeof functions.gauge_implementation>
export type Gauge_implementationReturn = FunctionReturn<typeof functions.gauge_implementation>

export type Views_implementationParams = FunctionArguments<typeof functions.views_implementation>
export type Views_implementationReturn = FunctionReturn<typeof functions.views_implementation>

export type Math_implementationParams = FunctionArguments<typeof functions.math_implementation>
export type Math_implementationReturn = FunctionReturn<typeof functions.math_implementation>

export type Pool_listParams = FunctionArguments<typeof functions.pool_list>
export type Pool_listReturn = FunctionReturn<typeof functions.pool_list>

