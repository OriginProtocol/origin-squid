import { ContractBase } from '../abi.support.js'
import { admin, deploy_gauge, deploy_pool, fee_receiver, find_pool_for_coins, find_pool_for_coins_1, future_admin, gauge_implementation, get_balances, get_coin_indices, get_coins, get_decimals, get_gauge, get_market_counts, math_implementation, pool_count, pool_implementations, pool_list, views_implementation } from './functions.js'
import type { Deploy_gaugeParams, Deploy_poolParams, Find_pool_for_coinsParams, Find_pool_for_coinsParams_1, Get_balancesParams, Get_coin_indicesParams, Get_coinsParams, Get_decimalsParams, Get_gaugeParams, Get_market_countsParams, Pool_implementationsParams, Pool_listParams } from './functions.js'

export class Contract extends ContractBase {
    deploy_pool(_name: Deploy_poolParams["_name"], _symbol: Deploy_poolParams["_symbol"], _coins: Deploy_poolParams["_coins"], _weth: Deploy_poolParams["_weth"], implementation_id: Deploy_poolParams["implementation_id"], A: Deploy_poolParams["A"], gamma: Deploy_poolParams["gamma"], mid_fee: Deploy_poolParams["mid_fee"], out_fee: Deploy_poolParams["out_fee"], fee_gamma: Deploy_poolParams["fee_gamma"], allowed_extra_profit: Deploy_poolParams["allowed_extra_profit"], adjustment_step: Deploy_poolParams["adjustment_step"], ma_exp_time: Deploy_poolParams["ma_exp_time"], initial_prices: Deploy_poolParams["initial_prices"]) {
        return this.eth_call(deploy_pool, {_name, _symbol, _coins, _weth, implementation_id, A, gamma, mid_fee, out_fee, fee_gamma, allowed_extra_profit, adjustment_step, ma_exp_time, initial_prices})
    }

    deploy_gauge(_pool: Deploy_gaugeParams["_pool"]) {
        return this.eth_call(deploy_gauge, {_pool})
    }

    find_pool_for_coins(_from: Find_pool_for_coinsParams["_from"], _to: Find_pool_for_coinsParams["_to"]) {
        return this.eth_call(find_pool_for_coins, {_from, _to})
    }

    find_pool_for_coins_1(_from: Find_pool_for_coinsParams_1["_from"], _to: Find_pool_for_coinsParams_1["_to"], i: Find_pool_for_coinsParams_1["i"]) {
        return this.eth_call(find_pool_for_coins_1, {_from, _to, i})
    }

    get_coins(_pool: Get_coinsParams["_pool"]) {
        return this.eth_call(get_coins, {_pool})
    }

    get_decimals(_pool: Get_decimalsParams["_pool"]) {
        return this.eth_call(get_decimals, {_pool})
    }

    get_balances(_pool: Get_balancesParams["_pool"]) {
        return this.eth_call(get_balances, {_pool})
    }

    get_coin_indices(_pool: Get_coin_indicesParams["_pool"], _from: Get_coin_indicesParams["_from"], _to: Get_coin_indicesParams["_to"]) {
        return this.eth_call(get_coin_indices, {_pool, _from, _to})
    }

    get_gauge(_pool: Get_gaugeParams["_pool"]) {
        return this.eth_call(get_gauge, {_pool})
    }

    get_market_counts(coin_a: Get_market_countsParams["coin_a"], coin_b: Get_market_countsParams["coin_b"]) {
        return this.eth_call(get_market_counts, {coin_a, coin_b})
    }

    admin() {
        return this.eth_call(admin, {})
    }

    future_admin() {
        return this.eth_call(future_admin, {})
    }

    fee_receiver() {
        return this.eth_call(fee_receiver, {})
    }

    pool_implementations(arg0: Pool_implementationsParams["arg0"]) {
        return this.eth_call(pool_implementations, {arg0})
    }

    gauge_implementation() {
        return this.eth_call(gauge_implementation, {})
    }

    views_implementation() {
        return this.eth_call(views_implementation, {})
    }

    math_implementation() {
        return this.eth_call(math_implementation, {})
    }

    pool_count() {
        return this.eth_call(pool_count, {})
    }

    pool_list(arg0: Pool_listParams["arg0"]) {
        return this.eth_call(pool_list, {arg0})
    }
}
