import { ContractBase } from '../abi.support.js'
import { A, A_precise, DOMAIN_SEPARATOR, add_liquidity, add_liquidity_1, admin_action_deadline, admin_balances, admin_fee, allowance, approve, balanceOf, balances, calc_token_amount, calc_withdraw_one_coin, coins, decimals, ema_price, exchange, exchange_1, fee, future_A, future_A_time, future_fee, get_balances, get_dy, get_p, get_virtual_price, initial_A, initial_A_time, last_price, ma_exp_time, ma_last_time, name, nonces, permit, price_oracle, remove_liquidity, remove_liquidity_1, remove_liquidity_imbalance, remove_liquidity_imbalance_1, remove_liquidity_one_coin, remove_liquidity_one_coin_1, symbol, totalSupply, transfer, transferFrom, version } from './functions.js'
import type { Add_liquidityParams, Add_liquidityParams_1, Admin_balancesParams, AllowanceParams, ApproveParams, BalanceOfParams, BalancesParams, Calc_token_amountParams, Calc_withdraw_one_coinParams, CoinsParams, ExchangeParams, ExchangeParams_1, Get_dyParams, NoncesParams, PermitParams, Remove_liquidityParams, Remove_liquidityParams_1, Remove_liquidity_imbalanceParams, Remove_liquidity_imbalanceParams_1, Remove_liquidity_one_coinParams, Remove_liquidity_one_coinParams_1, TransferFromParams, TransferParams } from './functions.js'

export class Contract extends ContractBase {
    decimals() {
        return this.eth_call(decimals, {})
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

    last_price() {
        return this.eth_call(last_price, {})
    }

    ema_price() {
        return this.eth_call(ema_price, {})
    }

    get_balances() {
        return this.eth_call(get_balances, {})
    }

    admin_fee() {
        return this.eth_call(admin_fee, {})
    }

    A() {
        return this.eth_call(A, {})
    }

    A_precise() {
        return this.eth_call(A_precise, {})
    }

    get_p() {
        return this.eth_call(get_p, {})
    }

    price_oracle() {
        return this.eth_call(price_oracle, {})
    }

    get_virtual_price() {
        return this.eth_call(get_virtual_price, {})
    }

    calc_token_amount(_amounts: Calc_token_amountParams["_amounts"], _is_deposit: Calc_token_amountParams["_is_deposit"]) {
        return this.eth_call(calc_token_amount, {_amounts, _is_deposit})
    }

    add_liquidity(_amounts: Add_liquidityParams["_amounts"], _min_mint_amount: Add_liquidityParams["_min_mint_amount"]) {
        return this.eth_call(add_liquidity, {_amounts, _min_mint_amount})
    }

    add_liquidity_1(_amounts: Add_liquidityParams_1["_amounts"], _min_mint_amount: Add_liquidityParams_1["_min_mint_amount"], _receiver: Add_liquidityParams_1["_receiver"]) {
        return this.eth_call(add_liquidity_1, {_amounts, _min_mint_amount, _receiver})
    }

    get_dy(i: Get_dyParams["i"], j: Get_dyParams["j"], dx: Get_dyParams["dx"]) {
        return this.eth_call(get_dy, {i, j, dx})
    }

    exchange(i: ExchangeParams["i"], j: ExchangeParams["j"], _dx: ExchangeParams["_dx"], _min_dy: ExchangeParams["_min_dy"]) {
        return this.eth_call(exchange, {i, j, _dx, _min_dy})
    }

    exchange_1(i: ExchangeParams_1["i"], j: ExchangeParams_1["j"], _dx: ExchangeParams_1["_dx"], _min_dy: ExchangeParams_1["_min_dy"], _receiver: ExchangeParams_1["_receiver"]) {
        return this.eth_call(exchange_1, {i, j, _dx, _min_dy, _receiver})
    }

    remove_liquidity(_burn_amount: Remove_liquidityParams["_burn_amount"], _min_amounts: Remove_liquidityParams["_min_amounts"]) {
        return this.eth_call(remove_liquidity, {_burn_amount, _min_amounts})
    }

    remove_liquidity_1(_burn_amount: Remove_liquidityParams_1["_burn_amount"], _min_amounts: Remove_liquidityParams_1["_min_amounts"], _receiver: Remove_liquidityParams_1["_receiver"]) {
        return this.eth_call(remove_liquidity_1, {_burn_amount, _min_amounts, _receiver})
    }

    remove_liquidity_imbalance(_amounts: Remove_liquidity_imbalanceParams["_amounts"], _max_burn_amount: Remove_liquidity_imbalanceParams["_max_burn_amount"]) {
        return this.eth_call(remove_liquidity_imbalance, {_amounts, _max_burn_amount})
    }

    remove_liquidity_imbalance_1(_amounts: Remove_liquidity_imbalanceParams_1["_amounts"], _max_burn_amount: Remove_liquidity_imbalanceParams_1["_max_burn_amount"], _receiver: Remove_liquidity_imbalanceParams_1["_receiver"]) {
        return this.eth_call(remove_liquidity_imbalance_1, {_amounts, _max_burn_amount, _receiver})
    }

    calc_withdraw_one_coin(_burn_amount: Calc_withdraw_one_coinParams["_burn_amount"], i: Calc_withdraw_one_coinParams["i"]) {
        return this.eth_call(calc_withdraw_one_coin, {_burn_amount, i})
    }

    remove_liquidity_one_coin(_burn_amount: Remove_liquidity_one_coinParams["_burn_amount"], i: Remove_liquidity_one_coinParams["i"], _min_received: Remove_liquidity_one_coinParams["_min_received"]) {
        return this.eth_call(remove_liquidity_one_coin, {_burn_amount, i, _min_received})
    }

    remove_liquidity_one_coin_1(_burn_amount: Remove_liquidity_one_coinParams_1["_burn_amount"], i: Remove_liquidity_one_coinParams_1["i"], _min_received: Remove_liquidity_one_coinParams_1["_min_received"], _receiver: Remove_liquidity_one_coinParams_1["_receiver"]) {
        return this.eth_call(remove_liquidity_one_coin_1, {_burn_amount, i, _min_received, _receiver})
    }

    admin_balances(i: Admin_balancesParams["i"]) {
        return this.eth_call(admin_balances, {i})
    }

    version() {
        return this.eth_call(version, {})
    }

    coins(arg0: CoinsParams["arg0"]) {
        return this.eth_call(coins, {arg0})
    }

    balances(arg0: BalancesParams["arg0"]) {
        return this.eth_call(balances, {arg0})
    }

    fee() {
        return this.eth_call(fee, {})
    }

    future_fee() {
        return this.eth_call(future_fee, {})
    }

    admin_action_deadline() {
        return this.eth_call(admin_action_deadline, {})
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

    name() {
        return this.eth_call(name, {})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(balanceOf, {arg0})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(allowance, {arg0, arg1})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    nonces(arg0: NoncesParams["arg0"]) {
        return this.eth_call(nonces, {arg0})
    }

    ma_exp_time() {
        return this.eth_call(ma_exp_time, {})
    }

    ma_last_time() {
        return this.eth_call(ma_last_time, {})
    }
}
