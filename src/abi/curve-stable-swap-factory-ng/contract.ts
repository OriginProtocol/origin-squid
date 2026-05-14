import { ContractBase } from '../abi.support.js'
import { admin, asset_types, base_pool_assets, base_pool_count, base_pool_data, base_pool_list, deploy_gauge, deploy_metapool, deploy_plain_pool, fee_receiver, find_pool_for_coins, find_pool_for_coins_1, future_admin, gauge_implementation, get_A, get_admin_balances, get_balances, get_base_pool, get_coin_indices, get_coins, get_decimals, get_fees, get_gauge, get_implementation_address, get_meta_n_coins, get_metapool_rates, get_n_coins, get_pool_asset_types, get_underlying_balances, get_underlying_coins, get_underlying_decimals, is_meta, math_implementation, metapool_implementations, pool_count, pool_implementations, pool_list, views_implementation } from './functions.js'
import type { Asset_typesParams, Base_pool_assetsParams, Base_pool_dataParams, Base_pool_listParams, Deploy_gaugeParams, Deploy_metapoolParams, Deploy_plain_poolParams, Find_pool_for_coinsParams, Find_pool_for_coinsParams_1, Get_AParams, Get_admin_balancesParams, Get_balancesParams, Get_base_poolParams, Get_coin_indicesParams, Get_coinsParams, Get_decimalsParams, Get_feesParams, Get_gaugeParams, Get_implementation_addressParams, Get_meta_n_coinsParams, Get_metapool_ratesParams, Get_n_coinsParams, Get_pool_asset_typesParams, Get_underlying_balancesParams, Get_underlying_coinsParams, Get_underlying_decimalsParams, Is_metaParams, Metapool_implementationsParams, Pool_implementationsParams, Pool_listParams } from './functions.js'

export class Contract extends ContractBase {
    find_pool_for_coins(_from: Find_pool_for_coinsParams["_from"], _to: Find_pool_for_coinsParams["_to"]) {
        return this.eth_call(find_pool_for_coins, {_from, _to})
    }

    find_pool_for_coins_1(_from: Find_pool_for_coinsParams_1["_from"], _to: Find_pool_for_coinsParams_1["_to"], i: Find_pool_for_coinsParams_1["i"]) {
        return this.eth_call(find_pool_for_coins_1, {_from, _to, i})
    }

    get_base_pool(_pool: Get_base_poolParams["_pool"]) {
        return this.eth_call(get_base_pool, {_pool})
    }

    get_n_coins(_pool: Get_n_coinsParams["_pool"]) {
        return this.eth_call(get_n_coins, {_pool})
    }

    get_meta_n_coins(_pool: Get_meta_n_coinsParams["_pool"]) {
        return this.eth_call(get_meta_n_coins, {_pool})
    }

    get_coins(_pool: Get_coinsParams["_pool"]) {
        return this.eth_call(get_coins, {_pool})
    }

    get_underlying_coins(_pool: Get_underlying_coinsParams["_pool"]) {
        return this.eth_call(get_underlying_coins, {_pool})
    }

    get_decimals(_pool: Get_decimalsParams["_pool"]) {
        return this.eth_call(get_decimals, {_pool})
    }

    get_underlying_decimals(_pool: Get_underlying_decimalsParams["_pool"]) {
        return this.eth_call(get_underlying_decimals, {_pool})
    }

    get_metapool_rates(_pool: Get_metapool_ratesParams["_pool"]) {
        return this.eth_call(get_metapool_rates, {_pool})
    }

    get_balances(_pool: Get_balancesParams["_pool"]) {
        return this.eth_call(get_balances, {_pool})
    }

    get_underlying_balances(_pool: Get_underlying_balancesParams["_pool"]) {
        return this.eth_call(get_underlying_balances, {_pool})
    }

    get_A(_pool: Get_AParams["_pool"]) {
        return this.eth_call(get_A, {_pool})
    }

    get_fees(_pool: Get_feesParams["_pool"]) {
        return this.eth_call(get_fees, {_pool})
    }

    get_admin_balances(_pool: Get_admin_balancesParams["_pool"]) {
        return this.eth_call(get_admin_balances, {_pool})
    }

    get_coin_indices(_pool: Get_coin_indicesParams["_pool"], _from: Get_coin_indicesParams["_from"], _to: Get_coin_indicesParams["_to"]) {
        return this.eth_call(get_coin_indices, {_pool, _from, _to})
    }

    get_gauge(_pool: Get_gaugeParams["_pool"]) {
        return this.eth_call(get_gauge, {_pool})
    }

    get_implementation_address(_pool: Get_implementation_addressParams["_pool"]) {
        return this.eth_call(get_implementation_address, {_pool})
    }

    is_meta(_pool: Is_metaParams["_pool"]) {
        return this.eth_call(is_meta, {_pool})
    }

    get_pool_asset_types(_pool: Get_pool_asset_typesParams["_pool"]) {
        return this.eth_call(get_pool_asset_types, {_pool})
    }

    deploy_plain_pool(_name: Deploy_plain_poolParams["_name"], _symbol: Deploy_plain_poolParams["_symbol"], _coins: Deploy_plain_poolParams["_coins"], _A: Deploy_plain_poolParams["_A"], _fee: Deploy_plain_poolParams["_fee"], _offpeg_fee_multiplier: Deploy_plain_poolParams["_offpeg_fee_multiplier"], _ma_exp_time: Deploy_plain_poolParams["_ma_exp_time"], _implementation_idx: Deploy_plain_poolParams["_implementation_idx"], _asset_types: Deploy_plain_poolParams["_asset_types"], _method_ids: Deploy_plain_poolParams["_method_ids"], _oracles: Deploy_plain_poolParams["_oracles"]) {
        return this.eth_call(deploy_plain_pool, {_name, _symbol, _coins, _A, _fee, _offpeg_fee_multiplier, _ma_exp_time, _implementation_idx, _asset_types, _method_ids, _oracles})
    }

    deploy_metapool(_base_pool: Deploy_metapoolParams["_base_pool"], _name: Deploy_metapoolParams["_name"], _symbol: Deploy_metapoolParams["_symbol"], _coin: Deploy_metapoolParams["_coin"], _A: Deploy_metapoolParams["_A"], _fee: Deploy_metapoolParams["_fee"], _offpeg_fee_multiplier: Deploy_metapoolParams["_offpeg_fee_multiplier"], _ma_exp_time: Deploy_metapoolParams["_ma_exp_time"], _implementation_idx: Deploy_metapoolParams["_implementation_idx"], _asset_type: Deploy_metapoolParams["_asset_type"], _method_id: Deploy_metapoolParams["_method_id"], _oracle: Deploy_metapoolParams["_oracle"]) {
        return this.eth_call(deploy_metapool, {_base_pool, _name, _symbol, _coin, _A, _fee, _offpeg_fee_multiplier, _ma_exp_time, _implementation_idx, _asset_type, _method_id, _oracle})
    }

    deploy_gauge(_pool: Deploy_gaugeParams["_pool"]) {
        return this.eth_call(deploy_gauge, {_pool})
    }

    admin() {
        return this.eth_call(admin, {})
    }

    future_admin() {
        return this.eth_call(future_admin, {})
    }

    asset_types(arg0: Asset_typesParams["arg0"]) {
        return this.eth_call(asset_types, {arg0})
    }

    pool_list(arg0: Pool_listParams["arg0"]) {
        return this.eth_call(pool_list, {arg0})
    }

    pool_count() {
        return this.eth_call(pool_count, {})
    }

    base_pool_list(arg0: Base_pool_listParams["arg0"]) {
        return this.eth_call(base_pool_list, {arg0})
    }

    base_pool_count() {
        return this.eth_call(base_pool_count, {})
    }

    base_pool_data(arg0: Base_pool_dataParams["arg0"]) {
        return this.eth_call(base_pool_data, {arg0})
    }

    base_pool_assets(arg0: Base_pool_assetsParams["arg0"]) {
        return this.eth_call(base_pool_assets, {arg0})
    }

    pool_implementations(arg0: Pool_implementationsParams["arg0"]) {
        return this.eth_call(pool_implementations, {arg0})
    }

    metapool_implementations(arg0: Metapool_implementationsParams["arg0"]) {
        return this.eth_call(metapool_implementations, {arg0})
    }

    math_implementation() {
        return this.eth_call(math_implementation, {})
    }

    gauge_implementation() {
        return this.eth_call(gauge_implementation, {})
    }

    views_implementation() {
        return this.eth_call(views_implementation, {})
    }

    fee_receiver() {
        return this.eth_call(fee_receiver, {})
    }
}
