import { address, array, bool, bytes4, int128, string, struct, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

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

/** get_base_pool(address) */
export const get_base_pool = func('0x6f20d6dd', {
    _pool: address,
}, address)
export type Get_base_poolParams = FunctionArguments<typeof get_base_pool>
export type Get_base_poolReturn = FunctionReturn<typeof get_base_pool>

/** get_n_coins(address) */
export const get_n_coins = func('0x940494f1', {
    _pool: address,
}, uint256)
export type Get_n_coinsParams = FunctionArguments<typeof get_n_coins>
export type Get_n_coinsReturn = FunctionReturn<typeof get_n_coins>

/** get_meta_n_coins(address) */
export const get_meta_n_coins = func('0xeb73f37d', {
    _pool: address,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type Get_meta_n_coinsParams = FunctionArguments<typeof get_meta_n_coins>
export type Get_meta_n_coinsReturn = FunctionReturn<typeof get_meta_n_coins>

/** get_coins(address) */
export const get_coins = func('0x9ac90d3d', {
    _pool: address,
}, array(address))
export type Get_coinsParams = FunctionArguments<typeof get_coins>
export type Get_coinsReturn = FunctionReturn<typeof get_coins>

/** get_underlying_coins(address) */
export const get_underlying_coins = func('0xa77576ef', {
    _pool: address,
}, array(address))
export type Get_underlying_coinsParams = FunctionArguments<typeof get_underlying_coins>
export type Get_underlying_coinsReturn = FunctionReturn<typeof get_underlying_coins>

/** get_decimals(address) */
export const get_decimals = func('0x52b51555', {
    _pool: address,
}, array(uint256))
export type Get_decimalsParams = FunctionArguments<typeof get_decimals>
export type Get_decimalsReturn = FunctionReturn<typeof get_decimals>

/** get_underlying_decimals(address) */
export const get_underlying_decimals = func('0x4cb088f1', {
    _pool: address,
}, array(uint256))
export type Get_underlying_decimalsParams = FunctionArguments<typeof get_underlying_decimals>
export type Get_underlying_decimalsReturn = FunctionReturn<typeof get_underlying_decimals>

/** get_metapool_rates(address) */
export const get_metapool_rates = func('0x06d8f160', {
    _pool: address,
}, array(uint256))
export type Get_metapool_ratesParams = FunctionArguments<typeof get_metapool_rates>
export type Get_metapool_ratesReturn = FunctionReturn<typeof get_metapool_rates>

/** get_balances(address) */
export const get_balances = func('0x92e3cc2d', {
    _pool: address,
}, array(uint256))
export type Get_balancesParams = FunctionArguments<typeof get_balances>
export type Get_balancesReturn = FunctionReturn<typeof get_balances>

/** get_underlying_balances(address) */
export const get_underlying_balances = func('0x59f4f351', {
    _pool: address,
}, array(uint256))
export type Get_underlying_balancesParams = FunctionArguments<typeof get_underlying_balances>
export type Get_underlying_balancesReturn = FunctionReturn<typeof get_underlying_balances>

/** get_A(address) */
export const get_A = func('0x55b30b19', {
    _pool: address,
}, uint256)
export type Get_AParams = FunctionArguments<typeof get_A>
export type Get_AReturn = FunctionReturn<typeof get_A>

/** get_fees(address) */
export const get_fees = func('0x7cdb72b0', {
    _pool: address,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type Get_feesParams = FunctionArguments<typeof get_fees>
export type Get_feesReturn = FunctionReturn<typeof get_fees>

/** get_admin_balances(address) */
export const get_admin_balances = func('0xc11e45b8', {
    _pool: address,
}, array(uint256))
export type Get_admin_balancesParams = FunctionArguments<typeof get_admin_balances>
export type Get_admin_balancesReturn = FunctionReturn<typeof get_admin_balances>

/** get_coin_indices(address,address,address) */
export const get_coin_indices = func('0xeb85226d', {
    _pool: address,
    _from: address,
    _to: address,
}, struct({
    _0: int128,
    _1: int128,
    _2: bool,
}))
export type Get_coin_indicesParams = FunctionArguments<typeof get_coin_indices>
export type Get_coin_indicesReturn = FunctionReturn<typeof get_coin_indices>

/** get_gauge(address) */
export const get_gauge = func('0xdaf297b9', {
    _pool: address,
}, address)
export type Get_gaugeParams = FunctionArguments<typeof get_gauge>
export type Get_gaugeReturn = FunctionReturn<typeof get_gauge>

/** get_implementation_address(address) */
export const get_implementation_address = func('0x510d98a4', {
    _pool: address,
}, address)
export type Get_implementation_addressParams = FunctionArguments<typeof get_implementation_address>
export type Get_implementation_addressReturn = FunctionReturn<typeof get_implementation_address>

/** is_meta(address) */
export const is_meta = func('0xe4d332a9', {
    _pool: address,
}, bool)
export type Is_metaParams = FunctionArguments<typeof is_meta>
export type Is_metaReturn = FunctionReturn<typeof is_meta>

/** get_pool_asset_types(address) */
export const get_pool_asset_types = func('0xa80f2464', {
    _pool: address,
}, array(uint8))
export type Get_pool_asset_typesParams = FunctionArguments<typeof get_pool_asset_types>
export type Get_pool_asset_typesReturn = FunctionReturn<typeof get_pool_asset_types>

/** deploy_plain_pool(string,string,address[],uint256,uint256,uint256,uint256,uint256,uint8[],bytes4[],address[]) */
export const deploy_plain_pool = func('0x5bcd3d83', {
    _name: string,
    _symbol: string,
    _coins: array(address),
    _A: uint256,
    _fee: uint256,
    _offpeg_fee_multiplier: uint256,
    _ma_exp_time: uint256,
    _implementation_idx: uint256,
    _asset_types: array(uint8),
    _method_ids: array(bytes4),
    _oracles: array(address),
}, address)
export type Deploy_plain_poolParams = FunctionArguments<typeof deploy_plain_pool>
export type Deploy_plain_poolReturn = FunctionReturn<typeof deploy_plain_pool>

/** deploy_metapool(address,string,string,address,uint256,uint256,uint256,uint256,uint256,uint8,bytes4,address) */
export const deploy_metapool = func('0xdf8c5d73', {
    _base_pool: address,
    _name: string,
    _symbol: string,
    _coin: address,
    _A: uint256,
    _fee: uint256,
    _offpeg_fee_multiplier: uint256,
    _ma_exp_time: uint256,
    _implementation_idx: uint256,
    _asset_type: uint8,
    _method_id: bytes4,
    _oracle: address,
}, address)
export type Deploy_metapoolParams = FunctionArguments<typeof deploy_metapool>
export type Deploy_metapoolReturn = FunctionReturn<typeof deploy_metapool>

/** deploy_gauge(address) */
export const deploy_gauge = func('0x96bebb34', {
    _pool: address,
}, address)
export type Deploy_gaugeParams = FunctionArguments<typeof deploy_gauge>
export type Deploy_gaugeReturn = FunctionReturn<typeof deploy_gauge>

/** add_base_pool(address,address,uint8[],uint256) */
export const add_base_pool = func('0xa9a8ef44', {
    _base_pool: address,
    _base_lp_token: address,
    _asset_types: array(uint8),
    _n_coins: uint256,
})
export type Add_base_poolParams = FunctionArguments<typeof add_base_pool>
export type Add_base_poolReturn = FunctionReturn<typeof add_base_pool>

/** set_pool_implementations(uint256,address) */
export const set_pool_implementations = func('0x4dc05cfb', {
    _implementation_index: uint256,
    _implementation: address,
})
export type Set_pool_implementationsParams = FunctionArguments<typeof set_pool_implementations>
export type Set_pool_implementationsReturn = FunctionReturn<typeof set_pool_implementations>

/** set_metapool_implementations(uint256,address) */
export const set_metapool_implementations = func('0x1cb30399', {
    _implementation_index: uint256,
    _implementation: address,
})
export type Set_metapool_implementationsParams = FunctionArguments<typeof set_metapool_implementations>
export type Set_metapool_implementationsReturn = FunctionReturn<typeof set_metapool_implementations>

/** set_math_implementation(address) */
export const set_math_implementation = func('0xb07426f4', {
    _math_implementation: address,
})
export type Set_math_implementationParams = FunctionArguments<typeof set_math_implementation>
export type Set_math_implementationReturn = FunctionReturn<typeof set_math_implementation>

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

/** set_fee_receiver(address,address) */
export const set_fee_receiver = func('0x36d2b77a', {
    _pool: address,
    _fee_receiver: address,
})
export type Set_fee_receiverParams = FunctionArguments<typeof set_fee_receiver>
export type Set_fee_receiverReturn = FunctionReturn<typeof set_fee_receiver>

/** add_asset_type(uint8,string) */
export const add_asset_type = func('0x4e988127', {
    _id: uint8,
    _name: string,
})
export type Add_asset_typeParams = FunctionArguments<typeof add_asset_type>
export type Add_asset_typeReturn = FunctionReturn<typeof add_asset_type>

/** admin() */
export const admin = func('0xf851a440', {}, address)
export type AdminParams = FunctionArguments<typeof admin>
export type AdminReturn = FunctionReturn<typeof admin>

/** future_admin() */
export const future_admin = func('0x17f7182a', {}, address)
export type Future_adminParams = FunctionArguments<typeof future_admin>
export type Future_adminReturn = FunctionReturn<typeof future_admin>

/** asset_types(uint8) */
export const asset_types = func('0xf1f10172', {
    arg0: uint8,
}, string)
export type Asset_typesParams = FunctionArguments<typeof asset_types>
export type Asset_typesReturn = FunctionReturn<typeof asset_types>

/** pool_list(uint256) */
export const pool_list = func('0x3a1d5d8e', {
    arg0: uint256,
}, address)
export type Pool_listParams = FunctionArguments<typeof pool_list>
export type Pool_listReturn = FunctionReturn<typeof pool_list>

/** pool_count() */
export const pool_count = func('0x956aae3a', {}, uint256)
export type Pool_countParams = FunctionArguments<typeof pool_count>
export type Pool_countReturn = FunctionReturn<typeof pool_count>

/** base_pool_list(uint256) */
export const base_pool_list = func('0x22fe5671', {
    arg0: uint256,
}, address)
export type Base_pool_listParams = FunctionArguments<typeof base_pool_list>
export type Base_pool_listReturn = FunctionReturn<typeof base_pool_list>

/** base_pool_count() */
export const base_pool_count = func('0xde5e4a3b', {}, uint256)
export type Base_pool_countParams = FunctionArguments<typeof base_pool_count>
export type Base_pool_countReturn = FunctionReturn<typeof base_pool_count>

/** base_pool_data(address) */
export const base_pool_data = func('0xed874940', {
    arg0: address,
}, struct({
    lp_token: address,
    coins: array(address),
    decimals: uint256,
    n_coins: uint256,
    asset_types: array(uint8),
}))
export type Base_pool_dataParams = FunctionArguments<typeof base_pool_data>
export type Base_pool_dataReturn = FunctionReturn<typeof base_pool_data>

/** base_pool_assets(address) */
export const base_pool_assets = func('0x10a002df', {
    arg0: address,
}, bool)
export type Base_pool_assetsParams = FunctionArguments<typeof base_pool_assets>
export type Base_pool_assetsReturn = FunctionReturn<typeof base_pool_assets>

/** pool_implementations(uint256) */
export const pool_implementations = func('0x3273ff47', {
    arg0: uint256,
}, address)
export type Pool_implementationsParams = FunctionArguments<typeof pool_implementations>
export type Pool_implementationsReturn = FunctionReturn<typeof pool_implementations>

/** metapool_implementations(uint256) */
export const metapool_implementations = func('0xcfef1d6b', {
    arg0: uint256,
}, address)
export type Metapool_implementationsParams = FunctionArguments<typeof metapool_implementations>
export type Metapool_implementationsReturn = FunctionReturn<typeof metapool_implementations>

/** math_implementation() */
export const math_implementation = func('0xa13c8f81', {}, address)
export type Math_implementationParams = FunctionArguments<typeof math_implementation>
export type Math_implementationReturn = FunctionReturn<typeof math_implementation>

/** gauge_implementation() */
export const gauge_implementation = func('0x8df24207', {}, address)
export type Gauge_implementationParams = FunctionArguments<typeof gauge_implementation>
export type Gauge_implementationReturn = FunctionReturn<typeof gauge_implementation>

/** views_implementation() */
export const views_implementation = func('0xe31593d8', {}, address)
export type Views_implementationParams = FunctionArguments<typeof views_implementation>
export type Views_implementationReturn = FunctionReturn<typeof views_implementation>

/** fee_receiver() */
export const fee_receiver = func('0xcab4d3db', {}, address)
export type Fee_receiverParams = FunctionArguments<typeof fee_receiver>
export type Fee_receiverReturn = FunctionReturn<typeof fee_receiver>
