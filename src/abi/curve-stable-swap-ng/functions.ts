import { address, array, bool, bytes32, int128, string, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** exchange(int128,int128,uint256,uint256) */
export const exchange = func('0x3df02124', {
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
}, uint256)
export type ExchangeParams = FunctionArguments<typeof exchange>
export type ExchangeReturn = FunctionReturn<typeof exchange>

/** exchange(int128,int128,uint256,uint256,address) */
export const exchange_1 = func('0xddc1f59d', {
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
    _receiver: address,
}, uint256)
export type ExchangeParams_1 = FunctionArguments<typeof exchange_1>
export type ExchangeReturn_1 = FunctionReturn<typeof exchange_1>

/** exchange_received(int128,int128,uint256,uint256) */
export const exchange_received = func('0x7e3db030', {
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
}, uint256)
export type Exchange_receivedParams = FunctionArguments<typeof exchange_received>
export type Exchange_receivedReturn = FunctionReturn<typeof exchange_received>

/** exchange_received(int128,int128,uint256,uint256,address) */
export const exchange_received_1 = func('0xafb43012', {
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
    _receiver: address,
}, uint256)
export type Exchange_receivedParams_1 = FunctionArguments<typeof exchange_received_1>
export type Exchange_receivedReturn_1 = FunctionReturn<typeof exchange_received_1>

/** add_liquidity(uint256[],uint256) */
export const add_liquidity = func('0xb72df5de', {
    _amounts: array(uint256),
    _min_mint_amount: uint256,
}, uint256)
export type Add_liquidityParams = FunctionArguments<typeof add_liquidity>
export type Add_liquidityReturn = FunctionReturn<typeof add_liquidity>

/** add_liquidity(uint256[],uint256,address) */
export const add_liquidity_1 = func('0xa7256d09', {
    _amounts: array(uint256),
    _min_mint_amount: uint256,
    _receiver: address,
}, uint256)
export type Add_liquidityParams_1 = FunctionArguments<typeof add_liquidity_1>
export type Add_liquidityReturn_1 = FunctionReturn<typeof add_liquidity_1>

/** remove_liquidity_one_coin(uint256,int128,uint256) */
export const remove_liquidity_one_coin = func('0x1a4d01d2', {
    _burn_amount: uint256,
    i: int128,
    _min_received: uint256,
}, uint256)
export type Remove_liquidity_one_coinParams = FunctionArguments<typeof remove_liquidity_one_coin>
export type Remove_liquidity_one_coinReturn = FunctionReturn<typeof remove_liquidity_one_coin>

/** remove_liquidity_one_coin(uint256,int128,uint256,address) */
export const remove_liquidity_one_coin_1 = func('0x081579a5', {
    _burn_amount: uint256,
    i: int128,
    _min_received: uint256,
    _receiver: address,
}, uint256)
export type Remove_liquidity_one_coinParams_1 = FunctionArguments<typeof remove_liquidity_one_coin_1>
export type Remove_liquidity_one_coinReturn_1 = FunctionReturn<typeof remove_liquidity_one_coin_1>

/** remove_liquidity_imbalance(uint256[],uint256) */
export const remove_liquidity_imbalance = func('0x7706db75', {
    _amounts: array(uint256),
    _max_burn_amount: uint256,
}, uint256)
export type Remove_liquidity_imbalanceParams = FunctionArguments<typeof remove_liquidity_imbalance>
export type Remove_liquidity_imbalanceReturn = FunctionReturn<typeof remove_liquidity_imbalance>

/** remove_liquidity_imbalance(uint256[],uint256,address) */
export const remove_liquidity_imbalance_1 = func('0x4a6e32c6', {
    _amounts: array(uint256),
    _max_burn_amount: uint256,
    _receiver: address,
}, uint256)
export type Remove_liquidity_imbalanceParams_1 = FunctionArguments<typeof remove_liquidity_imbalance_1>
export type Remove_liquidity_imbalanceReturn_1 = FunctionReturn<typeof remove_liquidity_imbalance_1>

/** remove_liquidity(uint256,uint256[]) */
export const remove_liquidity = func('0xd40ddb8c', {
    _burn_amount: uint256,
    _min_amounts: array(uint256),
}, array(uint256))
export type Remove_liquidityParams = FunctionArguments<typeof remove_liquidity>
export type Remove_liquidityReturn = FunctionReturn<typeof remove_liquidity>

/** remove_liquidity(uint256,uint256[],address) */
export const remove_liquidity_1 = func('0x5e604cd2', {
    _burn_amount: uint256,
    _min_amounts: array(uint256),
    _receiver: address,
}, array(uint256))
export type Remove_liquidityParams_1 = FunctionArguments<typeof remove_liquidity_1>
export type Remove_liquidityReturn_1 = FunctionReturn<typeof remove_liquidity_1>

/** remove_liquidity(uint256,uint256[],address,bool) */
export const remove_liquidity_2 = func('0x2969e04a', {
    _burn_amount: uint256,
    _min_amounts: array(uint256),
    _receiver: address,
    _claim_admin_fees: bool,
}, array(uint256))
export type Remove_liquidityParams_2 = FunctionArguments<typeof remove_liquidity_2>
export type Remove_liquidityReturn_2 = FunctionReturn<typeof remove_liquidity_2>

/** withdraw_admin_fees() */
export const withdraw_admin_fees = func('0x30c54085', {})
export type Withdraw_admin_feesParams = FunctionArguments<typeof withdraw_admin_fees>
export type Withdraw_admin_feesReturn = FunctionReturn<typeof withdraw_admin_fees>

/** last_price(uint256) */
export const last_price = func('0x3931ab52', {
    i: uint256,
}, uint256)
export type Last_priceParams = FunctionArguments<typeof last_price>
export type Last_priceReturn = FunctionReturn<typeof last_price>

/** ema_price(uint256) */
export const ema_price = func('0x90d20837', {
    i: uint256,
}, uint256)
export type Ema_priceParams = FunctionArguments<typeof ema_price>
export type Ema_priceReturn = FunctionReturn<typeof ema_price>

/** get_p(uint256) */
export const get_p = func('0xec023862', {
    i: uint256,
}, uint256)
export type Get_pParams = FunctionArguments<typeof get_p>
export type Get_pReturn = FunctionReturn<typeof get_p>

/** price_oracle(uint256) */
export const price_oracle = func('0x68727653', {
    i: uint256,
}, uint256)
export type Price_oracleParams = FunctionArguments<typeof price_oracle>
export type Price_oracleReturn = FunctionReturn<typeof price_oracle>

/** D_oracle() */
export const D_oracle = func('0x907a016b', {}, uint256)
export type D_oracleParams = FunctionArguments<typeof D_oracle>
export type D_oracleReturn = FunctionReturn<typeof D_oracle>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    _to: address,
    _value: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    _from: address,
    _to: address,
    _value: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    _spender: address,
    _value: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** permit(address,address,uint256,uint256,uint8,bytes32,bytes32) */
export const permit = func('0xd505accf', {
    _owner: address,
    _spender: address,
    _value: uint256,
    _deadline: uint256,
    _v: uint8,
    _r: bytes32,
    _s: bytes32,
}, bool)
export type PermitParams = FunctionArguments<typeof permit>
export type PermitReturn = FunctionReturn<typeof permit>

/** DOMAIN_SEPARATOR() */
export const DOMAIN_SEPARATOR = func('0x3644e515', {}, bytes32)
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof DOMAIN_SEPARATOR>

/** get_dx(int128,int128,uint256) */
export const get_dx = func('0x67df02ca', {
    i: int128,
    j: int128,
    dy: uint256,
}, uint256)
export type Get_dxParams = FunctionArguments<typeof get_dx>
export type Get_dxReturn = FunctionReturn<typeof get_dx>

/** get_dy(int128,int128,uint256) */
export const get_dy = func('0x5e0d443f', {
    i: int128,
    j: int128,
    dx: uint256,
}, uint256)
export type Get_dyParams = FunctionArguments<typeof get_dy>
export type Get_dyReturn = FunctionReturn<typeof get_dy>

/** calc_withdraw_one_coin(uint256,int128) */
export const calc_withdraw_one_coin = func('0xcc2b27d7', {
    _burn_amount: uint256,
    i: int128,
}, uint256)
export type Calc_withdraw_one_coinParams = FunctionArguments<typeof calc_withdraw_one_coin>
export type Calc_withdraw_one_coinReturn = FunctionReturn<typeof calc_withdraw_one_coin>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** get_virtual_price() */
export const get_virtual_price = func('0xbb7b8b80', {}, uint256)
export type Get_virtual_priceParams = FunctionArguments<typeof get_virtual_price>
export type Get_virtual_priceReturn = FunctionReturn<typeof get_virtual_price>

/** calc_token_amount(uint256[],bool) */
export const calc_token_amount = func('0x3db06dd8', {
    _amounts: array(uint256),
    _is_deposit: bool,
}, uint256)
export type Calc_token_amountParams = FunctionArguments<typeof calc_token_amount>
export type Calc_token_amountReturn = FunctionReturn<typeof calc_token_amount>

/** A() */
export const A = func('0xf446c1d0', {}, uint256)
export type AParams = FunctionArguments<typeof A>
export type AReturn = FunctionReturn<typeof A>

/** A_precise() */
export const A_precise = func('0x76a2f0f0', {}, uint256)
export type A_preciseParams = FunctionArguments<typeof A_precise>
export type A_preciseReturn = FunctionReturn<typeof A_precise>

/** balances(uint256) */
export const balances = func('0x4903b0d1', {
    i: uint256,
}, uint256)
export type BalancesParams = FunctionArguments<typeof balances>
export type BalancesReturn = FunctionReturn<typeof balances>

/** get_balances() */
export const get_balances = func('0x14f05979', {}, array(uint256))
export type Get_balancesParams = FunctionArguments<typeof get_balances>
export type Get_balancesReturn = FunctionReturn<typeof get_balances>

/** stored_rates() */
export const stored_rates = func('0xfd0684b1', {}, array(uint256))
export type Stored_ratesParams = FunctionArguments<typeof stored_rates>
export type Stored_ratesReturn = FunctionReturn<typeof stored_rates>

/** dynamic_fee(int128,int128) */
export const dynamic_fee = func('0x76a9cd3e', {
    i: int128,
    j: int128,
}, uint256)
export type Dynamic_feeParams = FunctionArguments<typeof dynamic_fee>
export type Dynamic_feeReturn = FunctionReturn<typeof dynamic_fee>

/** ramp_A(uint256,uint256) */
export const ramp_A = func('0x3c157e64', {
    _future_A: uint256,
    _future_time: uint256,
})
export type Ramp_AParams = FunctionArguments<typeof ramp_A>
export type Ramp_AReturn = FunctionReturn<typeof ramp_A>

/** stop_ramp_A() */
export const stop_ramp_A = func('0x551a6588', {})
export type Stop_ramp_AParams = FunctionArguments<typeof stop_ramp_A>
export type Stop_ramp_AReturn = FunctionReturn<typeof stop_ramp_A>

/** set_new_fee(uint256,uint256) */
export const set_new_fee = func('0x015c2838', {
    _new_fee: uint256,
    _new_offpeg_fee_multiplier: uint256,
})
export type Set_new_feeParams = FunctionArguments<typeof set_new_fee>
export type Set_new_feeReturn = FunctionReturn<typeof set_new_fee>

/** set_ma_exp_time(uint256,uint256) */
export const set_ma_exp_time = func('0x65bbea6b', {
    _ma_exp_time: uint256,
    _D_ma_time: uint256,
})
export type Set_ma_exp_timeParams = FunctionArguments<typeof set_ma_exp_time>
export type Set_ma_exp_timeReturn = FunctionReturn<typeof set_ma_exp_time>

/** N_COINS() */
export const N_COINS = func('0x29357750', {}, uint256)
export type N_COINSParams = FunctionArguments<typeof N_COINS>
export type N_COINSReturn = FunctionReturn<typeof N_COINS>

/** coins(uint256) */
export const coins = func('0xc6610657', {
    arg0: uint256,
}, address)
export type CoinsParams = FunctionArguments<typeof coins>
export type CoinsReturn = FunctionReturn<typeof coins>

/** fee() */
export const fee = func('0xddca3f43', {}, uint256)
export type FeeParams = FunctionArguments<typeof fee>
export type FeeReturn = FunctionReturn<typeof fee>

/** offpeg_fee_multiplier() */
export const offpeg_fee_multiplier = func('0x8edfdd5f', {}, uint256)
export type Offpeg_fee_multiplierParams = FunctionArguments<typeof offpeg_fee_multiplier>
export type Offpeg_fee_multiplierReturn = FunctionReturn<typeof offpeg_fee_multiplier>

/** admin_fee() */
export const admin_fee = func('0xfee3f7f9', {}, uint256)
export type Admin_feeParams = FunctionArguments<typeof admin_fee>
export type Admin_feeReturn = FunctionReturn<typeof admin_fee>

/** initial_A() */
export const initial_A = func('0x5409491a', {}, uint256)
export type Initial_AParams = FunctionArguments<typeof initial_A>
export type Initial_AReturn = FunctionReturn<typeof initial_A>

/** future_A() */
export const future_A = func('0xb4b577ad', {}, uint256)
export type Future_AParams = FunctionArguments<typeof future_A>
export type Future_AReturn = FunctionReturn<typeof future_A>

/** initial_A_time() */
export const initial_A_time = func('0x2081066c', {}, uint256)
export type Initial_A_timeParams = FunctionArguments<typeof initial_A_time>
export type Initial_A_timeReturn = FunctionReturn<typeof initial_A_time>

/** future_A_time() */
export const future_A_time = func('0x14052288', {}, uint256)
export type Future_A_timeParams = FunctionArguments<typeof future_A_time>
export type Future_A_timeReturn = FunctionReturn<typeof future_A_time>

/** admin_balances(uint256) */
export const admin_balances = func('0xe2e7d264', {
    arg0: uint256,
}, uint256)
export type Admin_balancesParams = FunctionArguments<typeof admin_balances>
export type Admin_balancesReturn = FunctionReturn<typeof admin_balances>

/** ma_exp_time() */
export const ma_exp_time = func('0x1be913a5', {}, uint256)
export type Ma_exp_timeParams = FunctionArguments<typeof ma_exp_time>
export type Ma_exp_timeReturn = FunctionReturn<typeof ma_exp_time>

/** D_ma_time() */
export const D_ma_time = func('0x9c4258c4', {}, uint256)
export type D_ma_timeParams = FunctionArguments<typeof D_ma_time>
export type D_ma_timeReturn = FunctionReturn<typeof D_ma_time>

/** ma_last_time() */
export const ma_last_time = func('0x1ddc3b01', {}, uint256)
export type Ma_last_timeParams = FunctionArguments<typeof ma_last_time>
export type Ma_last_timeReturn = FunctionReturn<typeof ma_last_time>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** version() */
export const version = func('0x54fd4d50', {}, string)
export type VersionParams = FunctionArguments<typeof version>
export type VersionReturn = FunctionReturn<typeof version>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    arg0: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    arg0: address,
    arg1: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** nonces(address) */
export const nonces = func('0x7ecebe00', {
    arg0: address,
}, uint256)
export type NoncesParams = FunctionArguments<typeof nonces>
export type NoncesReturn = FunctionReturn<typeof nonces>

/** salt() */
export const salt = func('0xbfa0b133', {}, bytes32)
export type SaltParams = FunctionArguments<typeof salt>
export type SaltReturn = FunctionReturn<typeof salt>
