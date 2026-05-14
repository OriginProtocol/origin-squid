import { address, fixedSizeArray, string, struct, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** initialise_ownership(address,address) */
export const initialise_ownership = func('0x45e62f85', {
    _fee_receiver: address,
    _admin: address,
})
export type Initialise_ownershipParams = FunctionArguments<typeof initialise_ownership>
export type Initialise_ownershipReturn = FunctionReturn<typeof initialise_ownership>

/** deploy_pool(string,string,address[2],uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256) */
export const deploy_pool = func('0xc955fa04', {
    _name: string,
    _symbol: string,
    _coins: fixedSizeArray(address, 2),
    implementation_id: uint256,
    A: uint256,
    gamma: uint256,
    mid_fee: uint256,
    out_fee: uint256,
    fee_gamma: uint256,
    allowed_extra_profit: uint256,
    adjustment_step: uint256,
    ma_exp_time: uint256,
    initial_price: uint256,
}, address)
export type Deploy_poolParams = FunctionArguments<typeof deploy_pool>
export type Deploy_poolReturn = FunctionReturn<typeof deploy_pool>

/** deploy_gauge(address) */
export const deploy_gauge = func('0x96bebb34', {
    _pool: address,
}, address)
export type Deploy_gaugeParams = FunctionArguments<typeof deploy_gauge>
export type Deploy_gaugeReturn = FunctionReturn<typeof deploy_gauge>

/** set_fee_receiver(address) */
export const set_fee_receiver = func('0xe41ab771', {
    _fee_receiver: address,
})
export type Set_fee_receiverParams = FunctionArguments<typeof set_fee_receiver>
export type Set_fee_receiverReturn = FunctionReturn<typeof set_fee_receiver>

/** set_pool_implementation(address,uint256) */
export const set_pool_implementation = func('0x6f385ff6', {
    _pool_implementation: address,
    _implementation_index: uint256,
})
export type Set_pool_implementationParams = FunctionArguments<typeof set_pool_implementation>
export type Set_pool_implementationReturn = FunctionReturn<typeof set_pool_implementation>

/** set_gauge_implementation(address) */
export const set_gauge_implementation = func('0x8f03182c', {
    _gauge_implementation: address,
})
export type Set_gauge_implementationParams = FunctionArguments<typeof set_gauge_implementation>
export type Set_gauge_implementationReturn = FunctionReturn<typeof set_gauge_implementation>

/** set_views_implementation(address) */
export const set_views_implementation = func('0xf6fa937f', {
    _views_implementation: address,
})
export type Set_views_implementationParams = FunctionArguments<typeof set_views_implementation>
export type Set_views_implementationReturn = FunctionReturn<typeof set_views_implementation>

/** set_math_implementation(address) */
export const set_math_implementation = func('0xb07426f4', {
    _math_implementation: address,
})
export type Set_math_implementationParams = FunctionArguments<typeof set_math_implementation>
export type Set_math_implementationReturn = FunctionReturn<typeof set_math_implementation>

/** commit_transfer_ownership(address) */
export const commit_transfer_ownership = func('0x6b441a40', {
    _addr: address,
})
export type Commit_transfer_ownershipParams = FunctionArguments<typeof commit_transfer_ownership>
export type Commit_transfer_ownershipReturn = FunctionReturn<typeof commit_transfer_ownership>

/** accept_transfer_ownership() */
export const accept_transfer_ownership = func('0xe5ea47b8', {})
export type Accept_transfer_ownershipParams = FunctionArguments<typeof accept_transfer_ownership>
export type Accept_transfer_ownershipReturn = FunctionReturn<typeof accept_transfer_ownership>

/** find_pool_for_coins(address,address) */
export const find_pool_for_coins = func('0xa87df06c', {
    _from: address,
    _to: address,
}, address)
export type Find_pool_for_coinsParams = FunctionArguments<typeof find_pool_for_coins>
export type Find_pool_for_coinsReturn = FunctionReturn<typeof find_pool_for_coins>

/** find_pool_for_coins(address,address,uint256) */
export const find_pool_for_coins_1 = func('0x6982eb0b', {
    _from: address,
    _to: address,
    i: uint256,
}, address)
export type Find_pool_for_coinsParams_1 = FunctionArguments<typeof find_pool_for_coins_1>
export type Find_pool_for_coinsReturn_1 = FunctionReturn<typeof find_pool_for_coins_1>

/** pool_count() */
export const pool_count = func('0x956aae3a', {}, uint256)
export type Pool_countParams = FunctionArguments<typeof pool_count>
export type Pool_countReturn = FunctionReturn<typeof pool_count>

/** get_coins(address) */
export const get_coins = func('0x9ac90d3d', {
    _pool: address,
}, fixedSizeArray(address, 2))
export type Get_coinsParams = FunctionArguments<typeof get_coins>
export type Get_coinsReturn = FunctionReturn<typeof get_coins>

/** get_decimals(address) */
export const get_decimals = func('0x52b51555', {
    _pool: address,
}, fixedSizeArray(uint256, 2))
export type Get_decimalsParams = FunctionArguments<typeof get_decimals>
export type Get_decimalsReturn = FunctionReturn<typeof get_decimals>

/** get_balances(address) */
export const get_balances = func('0x92e3cc2d', {
    _pool: address,
}, fixedSizeArray(uint256, 2))
export type Get_balancesParams = FunctionArguments<typeof get_balances>
export type Get_balancesReturn = FunctionReturn<typeof get_balances>

/** get_coin_indices(address,address,address) */
export const get_coin_indices = func('0xeb85226d', {
    _pool: address,
    _from: address,
    _to: address,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type Get_coin_indicesParams = FunctionArguments<typeof get_coin_indices>
export type Get_coin_indicesReturn = FunctionReturn<typeof get_coin_indices>

/** get_gauge(address) */
export const get_gauge = func('0xdaf297b9', {
    _pool: address,
}, address)
export type Get_gaugeParams = FunctionArguments<typeof get_gauge>
export type Get_gaugeReturn = FunctionReturn<typeof get_gauge>

/** get_market_counts(address,address) */
export const get_market_counts = func('0xc1856b52', {
    coin_a: address,
    coin_b: address,
}, uint256)
export type Get_market_countsParams = FunctionArguments<typeof get_market_counts>
export type Get_market_countsReturn = FunctionReturn<typeof get_market_counts>

/** admin() */
export const admin = func('0xf851a440', {}, address)
export type AdminParams = FunctionArguments<typeof admin>
export type AdminReturn = FunctionReturn<typeof admin>

/** future_admin() */
export const future_admin = func('0x17f7182a', {}, address)
export type Future_adminParams = FunctionArguments<typeof future_admin>
export type Future_adminReturn = FunctionReturn<typeof future_admin>

/** fee_receiver() */
export const fee_receiver = func('0xcab4d3db', {}, address)
export type Fee_receiverParams = FunctionArguments<typeof fee_receiver>
export type Fee_receiverReturn = FunctionReturn<typeof fee_receiver>

/** pool_implementations(uint256) */
export const pool_implementations = func('0x3273ff47', {
    arg0: uint256,
}, address)
export type Pool_implementationsParams = FunctionArguments<typeof pool_implementations>
export type Pool_implementationsReturn = FunctionReturn<typeof pool_implementations>

/** gauge_implementation() */
export const gauge_implementation = func('0x8df24207', {}, address)
export type Gauge_implementationParams = FunctionArguments<typeof gauge_implementation>
export type Gauge_implementationReturn = FunctionReturn<typeof gauge_implementation>

/** views_implementation() */
export const views_implementation = func('0xe31593d8', {}, address)
export type Views_implementationParams = FunctionArguments<typeof views_implementation>
export type Views_implementationReturn = FunctionReturn<typeof views_implementation>

/** math_implementation() */
export const math_implementation = func('0xa13c8f81', {}, address)
export type Math_implementationParams = FunctionArguments<typeof math_implementation>
export type Math_implementationReturn = FunctionReturn<typeof math_implementation>

/** pool_list(uint256) */
export const pool_list = func('0x3a1d5d8e', {
    arg0: uint256,
}, address)
export type Pool_listParams = FunctionArguments<typeof pool_list>
export type Pool_listReturn = FunctionReturn<typeof pool_list>
