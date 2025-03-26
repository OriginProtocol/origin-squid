import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    BasePoolAdded: event("0xcc6afdfec79da6be08142ecee25cf14b665961e25d30d8eba45959be9547635f", "BasePoolAdded(address)", {"base_pool": p.address}),
    PlainPoolDeployed: event("0xd1d60d4611e4091bb2e5f699eeb79136c21ac2305ad609f3de569afc3471eecc", "PlainPoolDeployed(address[],uint256,uint256,address)", {"coins": p.array(p.address), "A": p.uint256, "fee": p.uint256, "deployer": p.address}),
    MetaPoolDeployed: event("0x01f31cd2abdeb4e5e10ba500f2db0f937d9e8c735ab04681925441b4ea37eda5", "MetaPoolDeployed(address,address,uint256,uint256,address)", {"coin": p.address, "base_pool": p.address, "A": p.uint256, "fee": p.uint256, "deployer": p.address}),
    LiquidityGaugeDeployed: event("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b", "LiquidityGaugeDeployed(address,address)", {"pool": p.address, "gauge": p.address}),
}

export const functions = {
    'find_pool_for_coins(address,address)': viewFun("0xa87df06c", "find_pool_for_coins(address,address)", {"_from": p.address, "_to": p.address}, p.address),
    'find_pool_for_coins(address,address,uint256)': viewFun("0x6982eb0b", "find_pool_for_coins(address,address,uint256)", {"_from": p.address, "_to": p.address, "i": p.uint256}, p.address),
    get_base_pool: viewFun("0x6f20d6dd", "get_base_pool(address)", {"_pool": p.address}, p.address),
    get_n_coins: viewFun("0x940494f1", "get_n_coins(address)", {"_pool": p.address}, p.uint256),
    get_meta_n_coins: viewFun("0xeb73f37d", "get_meta_n_coins(address)", {"_pool": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    get_coins: viewFun("0x9ac90d3d", "get_coins(address)", {"_pool": p.address}, p.array(p.address)),
    get_underlying_coins: viewFun("0xa77576ef", "get_underlying_coins(address)", {"_pool": p.address}, p.array(p.address)),
    get_decimals: viewFun("0x52b51555", "get_decimals(address)", {"_pool": p.address}, p.array(p.uint256)),
    get_underlying_decimals: viewFun("0x4cb088f1", "get_underlying_decimals(address)", {"_pool": p.address}, p.array(p.uint256)),
    get_metapool_rates: viewFun("0x06d8f160", "get_metapool_rates(address)", {"_pool": p.address}, p.array(p.uint256)),
    get_balances: viewFun("0x92e3cc2d", "get_balances(address)", {"_pool": p.address}, p.array(p.uint256)),
    get_underlying_balances: viewFun("0x59f4f351", "get_underlying_balances(address)", {"_pool": p.address}, p.array(p.uint256)),
    get_A: viewFun("0x55b30b19", "get_A(address)", {"_pool": p.address}, p.uint256),
    get_fees: viewFun("0x7cdb72b0", "get_fees(address)", {"_pool": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    get_admin_balances: viewFun("0xc11e45b8", "get_admin_balances(address)", {"_pool": p.address}, p.array(p.uint256)),
    get_coin_indices: viewFun("0xeb85226d", "get_coin_indices(address,address,address)", {"_pool": p.address, "_from": p.address, "_to": p.address}, {"_0": p.int128, "_1": p.int128, "_2": p.bool}),
    get_gauge: viewFun("0xdaf297b9", "get_gauge(address)", {"_pool": p.address}, p.address),
    get_implementation_address: viewFun("0x510d98a4", "get_implementation_address(address)", {"_pool": p.address}, p.address),
    is_meta: viewFun("0xe4d332a9", "is_meta(address)", {"_pool": p.address}, p.bool),
    get_pool_asset_types: viewFun("0xa80f2464", "get_pool_asset_types(address)", {"_pool": p.address}, p.array(p.uint8)),
    deploy_plain_pool: fun("0x5bcd3d83", "deploy_plain_pool(string,string,address[],uint256,uint256,uint256,uint256,uint256,uint8[],bytes4[],address[])", {"_name": p.string, "_symbol": p.string, "_coins": p.array(p.address), "_A": p.uint256, "_fee": p.uint256, "_offpeg_fee_multiplier": p.uint256, "_ma_exp_time": p.uint256, "_implementation_idx": p.uint256, "_asset_types": p.array(p.uint8), "_method_ids": p.array(p.bytes4), "_oracles": p.array(p.address)}, p.address),
    deploy_metapool: fun("0xdf8c5d73", "deploy_metapool(address,string,string,address,uint256,uint256,uint256,uint256,uint256,uint8,bytes4,address)", {"_base_pool": p.address, "_name": p.string, "_symbol": p.string, "_coin": p.address, "_A": p.uint256, "_fee": p.uint256, "_offpeg_fee_multiplier": p.uint256, "_ma_exp_time": p.uint256, "_implementation_idx": p.uint256, "_asset_type": p.uint8, "_method_id": p.bytes4, "_oracle": p.address}, p.address),
    deploy_gauge: fun("0x96bebb34", "deploy_gauge(address)", {"_pool": p.address}, p.address),
    add_base_pool: fun("0xa9a8ef44", "add_base_pool(address,address,uint8[],uint256)", {"_base_pool": p.address, "_base_lp_token": p.address, "_asset_types": p.array(p.uint8), "_n_coins": p.uint256}, ),
    set_pool_implementations: fun("0x4dc05cfb", "set_pool_implementations(uint256,address)", {"_implementation_index": p.uint256, "_implementation": p.address}, ),
    set_metapool_implementations: fun("0x1cb30399", "set_metapool_implementations(uint256,address)", {"_implementation_index": p.uint256, "_implementation": p.address}, ),
    set_math_implementation: fun("0xb07426f4", "set_math_implementation(address)", {"_math_implementation": p.address}, ),
    set_gauge_implementation: fun("0x8f03182c", "set_gauge_implementation(address)", {"_gauge_implementation": p.address}, ),
    set_views_implementation: fun("0xf6fa937f", "set_views_implementation(address)", {"_views_implementation": p.address}, ),
    commit_transfer_ownership: fun("0x6b441a40", "commit_transfer_ownership(address)", {"_addr": p.address}, ),
    accept_transfer_ownership: fun("0xe5ea47b8", "accept_transfer_ownership()", {}, ),
    set_fee_receiver: fun("0x36d2b77a", "set_fee_receiver(address,address)", {"_pool": p.address, "_fee_receiver": p.address}, ),
    add_asset_type: fun("0x4e988127", "add_asset_type(uint8,string)", {"_id": p.uint8, "_name": p.string}, ),
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    future_admin: viewFun("0x17f7182a", "future_admin()", {}, p.address),
    asset_types: viewFun("0xf1f10172", "asset_types(uint8)", {"arg0": p.uint8}, p.string),
    pool_list: viewFun("0x3a1d5d8e", "pool_list(uint256)", {"arg0": p.uint256}, p.address),
    pool_count: viewFun("0x956aae3a", "pool_count()", {}, p.uint256),
    base_pool_list: viewFun("0x22fe5671", "base_pool_list(uint256)", {"arg0": p.uint256}, p.address),
    base_pool_count: viewFun("0xde5e4a3b", "base_pool_count()", {}, p.uint256),
    base_pool_data: viewFun("0xed874940", "base_pool_data(address)", {"arg0": p.address}, p.struct({"lp_token": p.address, "coins": p.array(p.address), "decimals": p.uint256, "n_coins": p.uint256, "asset_types": p.array(p.uint8)})),
    base_pool_assets: viewFun("0x10a002df", "base_pool_assets(address)", {"arg0": p.address}, p.bool),
    pool_implementations: viewFun("0x3273ff47", "pool_implementations(uint256)", {"arg0": p.uint256}, p.address),
    metapool_implementations: viewFun("0xcfef1d6b", "metapool_implementations(uint256)", {"arg0": p.uint256}, p.address),
    math_implementation: viewFun("0xa13c8f81", "math_implementation()", {}, p.address),
    gauge_implementation: viewFun("0x8df24207", "gauge_implementation()", {}, p.address),
    views_implementation: viewFun("0xe31593d8", "views_implementation()", {}, p.address),
    fee_receiver: viewFun("0xcab4d3db", "fee_receiver()", {}, p.address),
}

export class Contract extends ContractBase {

    'find_pool_for_coins(address,address)'(_from: Find_pool_for_coinsParams_0["_from"], _to: Find_pool_for_coinsParams_0["_to"]) {
        return this.eth_call(functions['find_pool_for_coins(address,address)'], {_from, _to})
    }

    'find_pool_for_coins(address,address,uint256)'(_from: Find_pool_for_coinsParams_1["_from"], _to: Find_pool_for_coinsParams_1["_to"], i: Find_pool_for_coinsParams_1["i"]) {
        return this.eth_call(functions['find_pool_for_coins(address,address,uint256)'], {_from, _to, i})
    }

    get_base_pool(_pool: Get_base_poolParams["_pool"]) {
        return this.eth_call(functions.get_base_pool, {_pool})
    }

    get_n_coins(_pool: Get_n_coinsParams["_pool"]) {
        return this.eth_call(functions.get_n_coins, {_pool})
    }

    get_meta_n_coins(_pool: Get_meta_n_coinsParams["_pool"]) {
        return this.eth_call(functions.get_meta_n_coins, {_pool})
    }

    get_coins(_pool: Get_coinsParams["_pool"]) {
        return this.eth_call(functions.get_coins, {_pool})
    }

    get_underlying_coins(_pool: Get_underlying_coinsParams["_pool"]) {
        return this.eth_call(functions.get_underlying_coins, {_pool})
    }

    get_decimals(_pool: Get_decimalsParams["_pool"]) {
        return this.eth_call(functions.get_decimals, {_pool})
    }

    get_underlying_decimals(_pool: Get_underlying_decimalsParams["_pool"]) {
        return this.eth_call(functions.get_underlying_decimals, {_pool})
    }

    get_metapool_rates(_pool: Get_metapool_ratesParams["_pool"]) {
        return this.eth_call(functions.get_metapool_rates, {_pool})
    }

    get_balances(_pool: Get_balancesParams["_pool"]) {
        return this.eth_call(functions.get_balances, {_pool})
    }

    get_underlying_balances(_pool: Get_underlying_balancesParams["_pool"]) {
        return this.eth_call(functions.get_underlying_balances, {_pool})
    }

    get_A(_pool: Get_AParams["_pool"]) {
        return this.eth_call(functions.get_A, {_pool})
    }

    get_fees(_pool: Get_feesParams["_pool"]) {
        return this.eth_call(functions.get_fees, {_pool})
    }

    get_admin_balances(_pool: Get_admin_balancesParams["_pool"]) {
        return this.eth_call(functions.get_admin_balances, {_pool})
    }

    get_coin_indices(_pool: Get_coin_indicesParams["_pool"], _from: Get_coin_indicesParams["_from"], _to: Get_coin_indicesParams["_to"]) {
        return this.eth_call(functions.get_coin_indices, {_pool, _from, _to})
    }

    get_gauge(_pool: Get_gaugeParams["_pool"]) {
        return this.eth_call(functions.get_gauge, {_pool})
    }

    get_implementation_address(_pool: Get_implementation_addressParams["_pool"]) {
        return this.eth_call(functions.get_implementation_address, {_pool})
    }

    is_meta(_pool: Is_metaParams["_pool"]) {
        return this.eth_call(functions.is_meta, {_pool})
    }

    get_pool_asset_types(_pool: Get_pool_asset_typesParams["_pool"]) {
        return this.eth_call(functions.get_pool_asset_types, {_pool})
    }

    admin() {
        return this.eth_call(functions.admin, {})
    }

    future_admin() {
        return this.eth_call(functions.future_admin, {})
    }

    asset_types(arg0: Asset_typesParams["arg0"]) {
        return this.eth_call(functions.asset_types, {arg0})
    }

    pool_list(arg0: Pool_listParams["arg0"]) {
        return this.eth_call(functions.pool_list, {arg0})
    }

    pool_count() {
        return this.eth_call(functions.pool_count, {})
    }

    base_pool_list(arg0: Base_pool_listParams["arg0"]) {
        return this.eth_call(functions.base_pool_list, {arg0})
    }

    base_pool_count() {
        return this.eth_call(functions.base_pool_count, {})
    }

    base_pool_data(arg0: Base_pool_dataParams["arg0"]) {
        return this.eth_call(functions.base_pool_data, {arg0})
    }

    base_pool_assets(arg0: Base_pool_assetsParams["arg0"]) {
        return this.eth_call(functions.base_pool_assets, {arg0})
    }

    pool_implementations(arg0: Pool_implementationsParams["arg0"]) {
        return this.eth_call(functions.pool_implementations, {arg0})
    }

    metapool_implementations(arg0: Metapool_implementationsParams["arg0"]) {
        return this.eth_call(functions.metapool_implementations, {arg0})
    }

    math_implementation() {
        return this.eth_call(functions.math_implementation, {})
    }

    gauge_implementation() {
        return this.eth_call(functions.gauge_implementation, {})
    }

    views_implementation() {
        return this.eth_call(functions.views_implementation, {})
    }

    fee_receiver() {
        return this.eth_call(functions.fee_receiver, {})
    }
}

/// Event types
export type BasePoolAddedEventArgs = EParams<typeof events.BasePoolAdded>
export type PlainPoolDeployedEventArgs = EParams<typeof events.PlainPoolDeployed>
export type MetaPoolDeployedEventArgs = EParams<typeof events.MetaPoolDeployed>
export type LiquidityGaugeDeployedEventArgs = EParams<typeof events.LiquidityGaugeDeployed>

/// Function types
export type Find_pool_for_coinsParams_0 = FunctionArguments<typeof functions['find_pool_for_coins(address,address)']>
export type Find_pool_for_coinsReturn_0 = FunctionReturn<typeof functions['find_pool_for_coins(address,address)']>

export type Find_pool_for_coinsParams_1 = FunctionArguments<typeof functions['find_pool_for_coins(address,address,uint256)']>
export type Find_pool_for_coinsReturn_1 = FunctionReturn<typeof functions['find_pool_for_coins(address,address,uint256)']>

export type Get_base_poolParams = FunctionArguments<typeof functions.get_base_pool>
export type Get_base_poolReturn = FunctionReturn<typeof functions.get_base_pool>

export type Get_n_coinsParams = FunctionArguments<typeof functions.get_n_coins>
export type Get_n_coinsReturn = FunctionReturn<typeof functions.get_n_coins>

export type Get_meta_n_coinsParams = FunctionArguments<typeof functions.get_meta_n_coins>
export type Get_meta_n_coinsReturn = FunctionReturn<typeof functions.get_meta_n_coins>

export type Get_coinsParams = FunctionArguments<typeof functions.get_coins>
export type Get_coinsReturn = FunctionReturn<typeof functions.get_coins>

export type Get_underlying_coinsParams = FunctionArguments<typeof functions.get_underlying_coins>
export type Get_underlying_coinsReturn = FunctionReturn<typeof functions.get_underlying_coins>

export type Get_decimalsParams = FunctionArguments<typeof functions.get_decimals>
export type Get_decimalsReturn = FunctionReturn<typeof functions.get_decimals>

export type Get_underlying_decimalsParams = FunctionArguments<typeof functions.get_underlying_decimals>
export type Get_underlying_decimalsReturn = FunctionReturn<typeof functions.get_underlying_decimals>

export type Get_metapool_ratesParams = FunctionArguments<typeof functions.get_metapool_rates>
export type Get_metapool_ratesReturn = FunctionReturn<typeof functions.get_metapool_rates>

export type Get_balancesParams = FunctionArguments<typeof functions.get_balances>
export type Get_balancesReturn = FunctionReturn<typeof functions.get_balances>

export type Get_underlying_balancesParams = FunctionArguments<typeof functions.get_underlying_balances>
export type Get_underlying_balancesReturn = FunctionReturn<typeof functions.get_underlying_balances>

export type Get_AParams = FunctionArguments<typeof functions.get_A>
export type Get_AReturn = FunctionReturn<typeof functions.get_A>

export type Get_feesParams = FunctionArguments<typeof functions.get_fees>
export type Get_feesReturn = FunctionReturn<typeof functions.get_fees>

export type Get_admin_balancesParams = FunctionArguments<typeof functions.get_admin_balances>
export type Get_admin_balancesReturn = FunctionReturn<typeof functions.get_admin_balances>

export type Get_coin_indicesParams = FunctionArguments<typeof functions.get_coin_indices>
export type Get_coin_indicesReturn = FunctionReturn<typeof functions.get_coin_indices>

export type Get_gaugeParams = FunctionArguments<typeof functions.get_gauge>
export type Get_gaugeReturn = FunctionReturn<typeof functions.get_gauge>

export type Get_implementation_addressParams = FunctionArguments<typeof functions.get_implementation_address>
export type Get_implementation_addressReturn = FunctionReturn<typeof functions.get_implementation_address>

export type Is_metaParams = FunctionArguments<typeof functions.is_meta>
export type Is_metaReturn = FunctionReturn<typeof functions.is_meta>

export type Get_pool_asset_typesParams = FunctionArguments<typeof functions.get_pool_asset_types>
export type Get_pool_asset_typesReturn = FunctionReturn<typeof functions.get_pool_asset_types>

export type Deploy_plain_poolParams = FunctionArguments<typeof functions.deploy_plain_pool>
export type Deploy_plain_poolReturn = FunctionReturn<typeof functions.deploy_plain_pool>

export type Deploy_metapoolParams = FunctionArguments<typeof functions.deploy_metapool>
export type Deploy_metapoolReturn = FunctionReturn<typeof functions.deploy_metapool>

export type Deploy_gaugeParams = FunctionArguments<typeof functions.deploy_gauge>
export type Deploy_gaugeReturn = FunctionReturn<typeof functions.deploy_gauge>

export type Add_base_poolParams = FunctionArguments<typeof functions.add_base_pool>
export type Add_base_poolReturn = FunctionReturn<typeof functions.add_base_pool>

export type Set_pool_implementationsParams = FunctionArguments<typeof functions.set_pool_implementations>
export type Set_pool_implementationsReturn = FunctionReturn<typeof functions.set_pool_implementations>

export type Set_metapool_implementationsParams = FunctionArguments<typeof functions.set_metapool_implementations>
export type Set_metapool_implementationsReturn = FunctionReturn<typeof functions.set_metapool_implementations>

export type Set_math_implementationParams = FunctionArguments<typeof functions.set_math_implementation>
export type Set_math_implementationReturn = FunctionReturn<typeof functions.set_math_implementation>

export type Set_gauge_implementationParams = FunctionArguments<typeof functions.set_gauge_implementation>
export type Set_gauge_implementationReturn = FunctionReturn<typeof functions.set_gauge_implementation>

export type Set_views_implementationParams = FunctionArguments<typeof functions.set_views_implementation>
export type Set_views_implementationReturn = FunctionReturn<typeof functions.set_views_implementation>

export type Commit_transfer_ownershipParams = FunctionArguments<typeof functions.commit_transfer_ownership>
export type Commit_transfer_ownershipReturn = FunctionReturn<typeof functions.commit_transfer_ownership>

export type Accept_transfer_ownershipParams = FunctionArguments<typeof functions.accept_transfer_ownership>
export type Accept_transfer_ownershipReturn = FunctionReturn<typeof functions.accept_transfer_ownership>

export type Set_fee_receiverParams = FunctionArguments<typeof functions.set_fee_receiver>
export type Set_fee_receiverReturn = FunctionReturn<typeof functions.set_fee_receiver>

export type Add_asset_typeParams = FunctionArguments<typeof functions.add_asset_type>
export type Add_asset_typeReturn = FunctionReturn<typeof functions.add_asset_type>

export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type Future_adminParams = FunctionArguments<typeof functions.future_admin>
export type Future_adminReturn = FunctionReturn<typeof functions.future_admin>

export type Asset_typesParams = FunctionArguments<typeof functions.asset_types>
export type Asset_typesReturn = FunctionReturn<typeof functions.asset_types>

export type Pool_listParams = FunctionArguments<typeof functions.pool_list>
export type Pool_listReturn = FunctionReturn<typeof functions.pool_list>

export type Pool_countParams = FunctionArguments<typeof functions.pool_count>
export type Pool_countReturn = FunctionReturn<typeof functions.pool_count>

export type Base_pool_listParams = FunctionArguments<typeof functions.base_pool_list>
export type Base_pool_listReturn = FunctionReturn<typeof functions.base_pool_list>

export type Base_pool_countParams = FunctionArguments<typeof functions.base_pool_count>
export type Base_pool_countReturn = FunctionReturn<typeof functions.base_pool_count>

export type Base_pool_dataParams = FunctionArguments<typeof functions.base_pool_data>
export type Base_pool_dataReturn = FunctionReturn<typeof functions.base_pool_data>

export type Base_pool_assetsParams = FunctionArguments<typeof functions.base_pool_assets>
export type Base_pool_assetsReturn = FunctionReturn<typeof functions.base_pool_assets>

export type Pool_implementationsParams = FunctionArguments<typeof functions.pool_implementations>
export type Pool_implementationsReturn = FunctionReturn<typeof functions.pool_implementations>

export type Metapool_implementationsParams = FunctionArguments<typeof functions.metapool_implementations>
export type Metapool_implementationsReturn = FunctionReturn<typeof functions.metapool_implementations>

export type Math_implementationParams = FunctionArguments<typeof functions.math_implementation>
export type Math_implementationReturn = FunctionReturn<typeof functions.math_implementation>

export type Gauge_implementationParams = FunctionArguments<typeof functions.gauge_implementation>
export type Gauge_implementationReturn = FunctionReturn<typeof functions.gauge_implementation>

export type Views_implementationParams = FunctionArguments<typeof functions.views_implementation>
export type Views_implementationReturn = FunctionReturn<typeof functions.views_implementation>

export type Fee_receiverParams = FunctionArguments<typeof functions.fee_receiver>
export type Fee_receiverReturn = FunctionReturn<typeof functions.fee_receiver>

