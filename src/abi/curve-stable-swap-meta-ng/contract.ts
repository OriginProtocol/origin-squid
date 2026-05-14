import { ContractBase } from '../abi.support.js'
import { A, A_precise, BASE_COINS, BASE_N_COINS, BASE_POOL, DOMAIN_SEPARATOR, D_ma_time, D_oracle, N_COINS, add_liquidity, add_liquidity_1, admin_balances, admin_fee, allowance, approve, balanceOf, balances, calc_token_amount, calc_withdraw_one_coin, coins, decimals, dynamic_fee, ema_price, exchange, exchange_1, exchange_received, exchange_received_1, exchange_underlying, exchange_underlying_1, fee, future_A, future_A_time, get_balances, get_dx, get_dx_underlying, get_dy, get_dy_underlying, get_p, get_virtual_price, initial_A, initial_A_time, last_price, ma_exp_time, ma_last_time, name, nonces, offpeg_fee_multiplier, permit, price_oracle, remove_liquidity, remove_liquidity_1, remove_liquidity_2, remove_liquidity_imbalance, remove_liquidity_imbalance_1, remove_liquidity_one_coin, remove_liquidity_one_coin_1, salt, stored_rates, symbol, totalSupply, transfer, transferFrom, version } from './functions.js'
import type { Add_liquidityParams, Add_liquidityParams_1, Admin_balancesParams, AllowanceParams, ApproveParams, BASE_COINSParams, BalanceOfParams, BalancesParams, Calc_token_amountParams, Calc_withdraw_one_coinParams, CoinsParams, Dynamic_feeParams, Ema_priceParams, ExchangeParams, ExchangeParams_1, Exchange_receivedParams, Exchange_receivedParams_1, Exchange_underlyingParams, Exchange_underlyingParams_1, Get_dxParams, Get_dx_underlyingParams, Get_dyParams, Get_dy_underlyingParams, Get_pParams, Last_priceParams, NoncesParams, PermitParams, Price_oracleParams, Remove_liquidityParams, Remove_liquidityParams_1, Remove_liquidityParams_2, Remove_liquidity_imbalanceParams, Remove_liquidity_imbalanceParams_1, Remove_liquidity_one_coinParams, Remove_liquidity_one_coinParams_1, TransferFromParams, TransferParams } from './functions.js'

export class Contract extends ContractBase {
    exchange(i: ExchangeParams["i"], j: ExchangeParams["j"], _dx: ExchangeParams["_dx"], _min_dy: ExchangeParams["_min_dy"]) {
        return this.eth_call(exchange, {i, j, _dx, _min_dy})
    }

    exchange_1(i: ExchangeParams_1["i"], j: ExchangeParams_1["j"], _dx: ExchangeParams_1["_dx"], _min_dy: ExchangeParams_1["_min_dy"], _receiver: ExchangeParams_1["_receiver"]) {
        return this.eth_call(exchange_1, {i, j, _dx, _min_dy, _receiver})
    }

    exchange_received(i: Exchange_receivedParams["i"], j: Exchange_receivedParams["j"], _dx: Exchange_receivedParams["_dx"], _min_dy: Exchange_receivedParams["_min_dy"]) {
        return this.eth_call(exchange_received, {i, j, _dx, _min_dy})
    }

    exchange_received_1(i: Exchange_receivedParams_1["i"], j: Exchange_receivedParams_1["j"], _dx: Exchange_receivedParams_1["_dx"], _min_dy: Exchange_receivedParams_1["_min_dy"], _receiver: Exchange_receivedParams_1["_receiver"]) {
        return this.eth_call(exchange_received_1, {i, j, _dx, _min_dy, _receiver})
    }

    exchange_underlying(i: Exchange_underlyingParams["i"], j: Exchange_underlyingParams["j"], _dx: Exchange_underlyingParams["_dx"], _min_dy: Exchange_underlyingParams["_min_dy"]) {
        return this.eth_call(exchange_underlying, {i, j, _dx, _min_dy})
    }

    exchange_underlying_1(i: Exchange_underlyingParams_1["i"], j: Exchange_underlyingParams_1["j"], _dx: Exchange_underlyingParams_1["_dx"], _min_dy: Exchange_underlyingParams_1["_min_dy"], _receiver: Exchange_underlyingParams_1["_receiver"]) {
        return this.eth_call(exchange_underlying_1, {i, j, _dx, _min_dy, _receiver})
    }

    add_liquidity(_amounts: Add_liquidityParams["_amounts"], _min_mint_amount: Add_liquidityParams["_min_mint_amount"]) {
        return this.eth_call(add_liquidity, {_amounts, _min_mint_amount})
    }

    add_liquidity_1(_amounts: Add_liquidityParams_1["_amounts"], _min_mint_amount: Add_liquidityParams_1["_min_mint_amount"], _receiver: Add_liquidityParams_1["_receiver"]) {
        return this.eth_call(add_liquidity_1, {_amounts, _min_mint_amount, _receiver})
    }

    remove_liquidity_one_coin(_burn_amount: Remove_liquidity_one_coinParams["_burn_amount"], i: Remove_liquidity_one_coinParams["i"], _min_received: Remove_liquidity_one_coinParams["_min_received"]) {
        return this.eth_call(remove_liquidity_one_coin, {_burn_amount, i, _min_received})
    }

    remove_liquidity_one_coin_1(_burn_amount: Remove_liquidity_one_coinParams_1["_burn_amount"], i: Remove_liquidity_one_coinParams_1["i"], _min_received: Remove_liquidity_one_coinParams_1["_min_received"], _receiver: Remove_liquidity_one_coinParams_1["_receiver"]) {
        return this.eth_call(remove_liquidity_one_coin_1, {_burn_amount, i, _min_received, _receiver})
    }

    remove_liquidity_imbalance(_amounts: Remove_liquidity_imbalanceParams["_amounts"], _max_burn_amount: Remove_liquidity_imbalanceParams["_max_burn_amount"]) {
        return this.eth_call(remove_liquidity_imbalance, {_amounts, _max_burn_amount})
    }

    remove_liquidity_imbalance_1(_amounts: Remove_liquidity_imbalanceParams_1["_amounts"], _max_burn_amount: Remove_liquidity_imbalanceParams_1["_max_burn_amount"], _receiver: Remove_liquidity_imbalanceParams_1["_receiver"]) {
        return this.eth_call(remove_liquidity_imbalance_1, {_amounts, _max_burn_amount, _receiver})
    }

    remove_liquidity(_burn_amount: Remove_liquidityParams["_burn_amount"], _min_amounts: Remove_liquidityParams["_min_amounts"]) {
        return this.eth_call(remove_liquidity, {_burn_amount, _min_amounts})
    }

    remove_liquidity_1(_burn_amount: Remove_liquidityParams_1["_burn_amount"], _min_amounts: Remove_liquidityParams_1["_min_amounts"], _receiver: Remove_liquidityParams_1["_receiver"]) {
        return this.eth_call(remove_liquidity_1, {_burn_amount, _min_amounts, _receiver})
    }

    remove_liquidity_2(_burn_amount: Remove_liquidityParams_2["_burn_amount"], _min_amounts: Remove_liquidityParams_2["_min_amounts"], _receiver: Remove_liquidityParams_2["_receiver"], _claim_admin_fees: Remove_liquidityParams_2["_claim_admin_fees"]) {
        return this.eth_call(remove_liquidity_2, {_burn_amount, _min_amounts, _receiver, _claim_admin_fees})
    }

    last_price(i: Last_priceParams["i"]) {
        return this.eth_call(last_price, {i})
    }

    ema_price(i: Ema_priceParams["i"]) {
        return this.eth_call(ema_price, {i})
    }

    get_p(i: Get_pParams["i"]) {
        return this.eth_call(get_p, {i})
    }

    price_oracle(i: Price_oracleParams["i"]) {
        return this.eth_call(price_oracle, {i})
    }

    D_oracle() {
        return this.eth_call(D_oracle, {})
    }

    transfer(_to: TransferParams["_to"], _value: TransferParams["_value"]) {
        return this.eth_call(transfer, {_to, _value})
    }

    transferFrom(_from: TransferFromParams["_from"], _to: TransferFromParams["_to"], _value: TransferFromParams["_value"]) {
        return this.eth_call(transferFrom, {_from, _to, _value})
    }

    approve(_spender: ApproveParams["_spender"], _value: ApproveParams["_value"]) {
        return this.eth_call(approve, {_spender, _value})
    }

    permit(_owner: PermitParams["_owner"], _spender: PermitParams["_spender"], _value: PermitParams["_value"], _deadline: PermitParams["_deadline"], _v: PermitParams["_v"], _r: PermitParams["_r"], _s: PermitParams["_s"]) {
        return this.eth_call(permit, {_owner, _spender, _value, _deadline, _v, _r, _s})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    get_dx(i: Get_dxParams["i"], j: Get_dxParams["j"], dy: Get_dxParams["dy"]) {
        return this.eth_call(get_dx, {i, j, dy})
    }

    get_dx_underlying(i: Get_dx_underlyingParams["i"], j: Get_dx_underlyingParams["j"], dy: Get_dx_underlyingParams["dy"]) {
        return this.eth_call(get_dx_underlying, {i, j, dy})
    }

    get_dy(i: Get_dyParams["i"], j: Get_dyParams["j"], dx: Get_dyParams["dx"]) {
        return this.eth_call(get_dy, {i, j, dx})
    }

    get_dy_underlying(i: Get_dy_underlyingParams["i"], j: Get_dy_underlyingParams["j"], dx: Get_dy_underlyingParams["dx"]) {
        return this.eth_call(get_dy_underlying, {i, j, dx})
    }

    calc_withdraw_one_coin(_burn_amount: Calc_withdraw_one_coinParams["_burn_amount"], i: Calc_withdraw_one_coinParams["i"]) {
        return this.eth_call(calc_withdraw_one_coin, {_burn_amount, i})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    get_virtual_price() {
        return this.eth_call(get_virtual_price, {})
    }

    calc_token_amount(_amounts: Calc_token_amountParams["_amounts"], _is_deposit: Calc_token_amountParams["_is_deposit"]) {
        return this.eth_call(calc_token_amount, {_amounts, _is_deposit})
    }

    A() {
        return this.eth_call(A, {})
    }

    A_precise() {
        return this.eth_call(A_precise, {})
    }

    balances(i: BalancesParams["i"]) {
        return this.eth_call(balances, {i})
    }

    get_balances() {
        return this.eth_call(get_balances, {})
    }

    stored_rates() {
        return this.eth_call(stored_rates, {})
    }

    dynamic_fee(i: Dynamic_feeParams["i"], j: Dynamic_feeParams["j"]) {
        return this.eth_call(dynamic_fee, {i, j})
    }

    N_COINS() {
        return this.eth_call(N_COINS, {})
    }

    BASE_POOL() {
        return this.eth_call(BASE_POOL, {})
    }

    BASE_N_COINS() {
        return this.eth_call(BASE_N_COINS, {})
    }

    BASE_COINS(arg0: BASE_COINSParams["arg0"]) {
        return this.eth_call(BASE_COINS, {arg0})
    }

    coins(arg0: CoinsParams["arg0"]) {
        return this.eth_call(coins, {arg0})
    }

    fee() {
        return this.eth_call(fee, {})
    }

    offpeg_fee_multiplier() {
        return this.eth_call(offpeg_fee_multiplier, {})
    }

    admin_fee() {
        return this.eth_call(admin_fee, {})
    }

    initial_A() {
        return this.eth_call(initial_A, {})
    }

    future_A() {
        return this.eth_call(future_A, {})
    }

    initial_A_time() {
        return this.eth_call(initial_A_time, {})
    }

    future_A_time() {
        return this.eth_call(future_A_time, {})
    }

    admin_balances(arg0: Admin_balancesParams["arg0"]) {
        return this.eth_call(admin_balances, {arg0})
    }

    ma_exp_time() {
        return this.eth_call(ma_exp_time, {})
    }

    D_ma_time() {
        return this.eth_call(D_ma_time, {})
    }

    ma_last_time() {
        return this.eth_call(ma_last_time, {})
    }

    name() {
        return this.eth_call(name, {})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    version() {
        return this.eth_call(version, {})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(balanceOf, {arg0})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(allowance, {arg0, arg1})
    }

    nonces(arg0: NoncesParams["arg0"]) {
        return this.eth_call(nonces, {arg0})
    }

    salt() {
        return this.eth_call(salt, {})
    }
}
