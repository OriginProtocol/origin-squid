import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    TokenExchange: event("0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140", "TokenExchange(address,int128,uint256,int128,uint256)", {"buyer": indexed(p.address), "sold_id": p.int128, "tokens_sold": p.uint256, "bought_id": p.int128, "tokens_bought": p.uint256}),
    TokenExchangeUnderlying: event("0xd013ca23e77a65003c2c659c5442c00c805371b7fc1ebd4c206c41d1536bd90b", "TokenExchangeUnderlying(address,int128,uint256,int128,uint256)", {"buyer": indexed(p.address), "sold_id": p.int128, "tokens_sold": p.uint256, "bought_id": p.int128, "tokens_bought": p.uint256}),
    AddLiquidity: event("0x189c623b666b1b45b83d7178f39b8c087cb09774317ca2f53c2d3c3726f222a2", "AddLiquidity(address,uint256[],uint256[],uint256,uint256)", {"provider": indexed(p.address), "token_amounts": p.array(p.uint256), "fees": p.array(p.uint256), "invariant": p.uint256, "token_supply": p.uint256}),
    RemoveLiquidity: event("0x347ad828e58cbe534d8f6b67985d791360756b18f0d95fd9f197a66cc46480ea", "RemoveLiquidity(address,uint256[],uint256[],uint256)", {"provider": indexed(p.address), "token_amounts": p.array(p.uint256), "fees": p.array(p.uint256), "token_supply": p.uint256}),
    RemoveLiquidityOne: event("0x6f48129db1f37ccb9cc5dd7e119cb32750cabdf75b48375d730d26ce3659bbe1", "RemoveLiquidityOne(address,int128,uint256,uint256,uint256)", {"provider": indexed(p.address), "token_id": p.int128, "token_amount": p.uint256, "coin_amount": p.uint256, "token_supply": p.uint256}),
    RemoveLiquidityImbalance: event("0x3631c28b1f9dd213e0319fb167b554d76b6c283a41143eb400a0d1adb1af1755", "RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)", {"provider": indexed(p.address), "token_amounts": p.array(p.uint256), "fees": p.array(p.uint256), "invariant": p.uint256, "token_supply": p.uint256}),
    RampA: event("0xa2b71ec6df949300b59aab36b55e189697b750119dd349fcfa8c0f779e83c254", "RampA(uint256,uint256,uint256,uint256)", {"old_A": p.uint256, "new_A": p.uint256, "initial_time": p.uint256, "future_time": p.uint256}),
    StopRampA: event("0x46e22fb3709ad289f62ce63d469248536dbc78d82b84a3d7e74ad606dc201938", "StopRampA(uint256,uint256)", {"A": p.uint256, "t": p.uint256}),
    ApplyNewFee: event("0x750d10a7f37466ce785ee6bcb604aac543358db42afbcc332a3c12a49c80bf6d", "ApplyNewFee(uint256,uint256)", {"fee": p.uint256, "offpeg_fee_multiplier": p.uint256}),
    SetNewMATime: event("0x68dc4e067dff1862b896b7a0faf55f97df1a60d0aaa79481b69d675f2026a28c", "SetNewMATime(uint256,uint256)", {"ma_exp_time": p.uint256, "D_ma_time": p.uint256}),
}

export const functions = {
    'exchange(int128,int128,uint256,uint256)': fun("0x3df02124", "exchange(int128,int128,uint256,uint256)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256}, p.uint256),
    'exchange(int128,int128,uint256,uint256,address)': fun("0xddc1f59d", "exchange(int128,int128,uint256,uint256,address)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256, "_receiver": p.address}, p.uint256),
    'exchange_received(int128,int128,uint256,uint256)': fun("0x7e3db030", "exchange_received(int128,int128,uint256,uint256)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256}, p.uint256),
    'exchange_received(int128,int128,uint256,uint256,address)': fun("0xafb43012", "exchange_received(int128,int128,uint256,uint256,address)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256, "_receiver": p.address}, p.uint256),
    'exchange_underlying(int128,int128,uint256,uint256)': fun("0xa6417ed6", "exchange_underlying(int128,int128,uint256,uint256)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256}, p.uint256),
    'exchange_underlying(int128,int128,uint256,uint256,address)': fun("0x44ee1986", "exchange_underlying(int128,int128,uint256,uint256,address)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256, "_receiver": p.address}, p.uint256),
    'add_liquidity(uint256[2],uint256)': fun("0x0b4c7e4d", "add_liquidity(uint256[2],uint256)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_min_mint_amount": p.uint256}, p.uint256),
    'add_liquidity(uint256[2],uint256,address)': fun("0x0c3e4b54", "add_liquidity(uint256[2],uint256,address)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_min_mint_amount": p.uint256, "_receiver": p.address}, p.uint256),
    'remove_liquidity_one_coin(uint256,int128,uint256)': fun("0x1a4d01d2", "remove_liquidity_one_coin(uint256,int128,uint256)", {"_burn_amount": p.uint256, "i": p.int128, "_min_received": p.uint256}, p.uint256),
    'remove_liquidity_one_coin(uint256,int128,uint256,address)': fun("0x081579a5", "remove_liquidity_one_coin(uint256,int128,uint256,address)", {"_burn_amount": p.uint256, "i": p.int128, "_min_received": p.uint256, "_receiver": p.address}, p.uint256),
    'remove_liquidity_imbalance(uint256[2],uint256)': fun("0xe3103273", "remove_liquidity_imbalance(uint256[2],uint256)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_max_burn_amount": p.uint256}, p.uint256),
    'remove_liquidity_imbalance(uint256[2],uint256,address)': fun("0x52d2cfdd", "remove_liquidity_imbalance(uint256[2],uint256,address)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_max_burn_amount": p.uint256, "_receiver": p.address}, p.uint256),
    'remove_liquidity(uint256,uint256[2])': fun("0x5b36389c", "remove_liquidity(uint256,uint256[2])", {"_burn_amount": p.uint256, "_min_amounts": p.fixedSizeArray(p.uint256, 2)}, p.fixedSizeArray(p.uint256, 2)),
    'remove_liquidity(uint256,uint256[2],address)': fun("0x3eb1719f", "remove_liquidity(uint256,uint256[2],address)", {"_burn_amount": p.uint256, "_min_amounts": p.fixedSizeArray(p.uint256, 2), "_receiver": p.address}, p.fixedSizeArray(p.uint256, 2)),
    'remove_liquidity(uint256,uint256[2],address,bool)': fun("0xdb1bb01b", "remove_liquidity(uint256,uint256[2],address,bool)", {"_burn_amount": p.uint256, "_min_amounts": p.fixedSizeArray(p.uint256, 2), "_receiver": p.address, "_claim_admin_fees": p.bool}, p.fixedSizeArray(p.uint256, 2)),
    withdraw_admin_fees: fun("0x30c54085", "withdraw_admin_fees()", {}, ),
    last_price: viewFun("0x3931ab52", "last_price(uint256)", {"i": p.uint256}, p.uint256),
    ema_price: viewFun("0x90d20837", "ema_price(uint256)", {"i": p.uint256}, p.uint256),
    get_p: viewFun("0xec023862", "get_p(uint256)", {"i": p.uint256}, p.uint256),
    price_oracle: viewFun("0x68727653", "price_oracle(uint256)", {"i": p.uint256}, p.uint256),
    D_oracle: viewFun("0x907a016b", "D_oracle()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_to": p.address, "_value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_value": p.uint256}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_spender": p.address, "_value": p.uint256}, p.bool),
    permit: fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"_owner": p.address, "_spender": p.address, "_value": p.uint256, "_deadline": p.uint256, "_v": p.uint8, "_r": p.bytes32, "_s": p.bytes32}, p.bool),
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    get_dx: viewFun("0x67df02ca", "get_dx(int128,int128,uint256)", {"i": p.int128, "j": p.int128, "dy": p.uint256}, p.uint256),
    get_dx_underlying: viewFun("0x0e71d1b9", "get_dx_underlying(int128,int128,uint256)", {"i": p.int128, "j": p.int128, "dy": p.uint256}, p.uint256),
    get_dy: viewFun("0x5e0d443f", "get_dy(int128,int128,uint256)", {"i": p.int128, "j": p.int128, "dx": p.uint256}, p.uint256),
    get_dy_underlying: viewFun("0x07211ef7", "get_dy_underlying(int128,int128,uint256)", {"i": p.int128, "j": p.int128, "dx": p.uint256}, p.uint256),
    calc_withdraw_one_coin: viewFun("0xcc2b27d7", "calc_withdraw_one_coin(uint256,int128)", {"_burn_amount": p.uint256, "i": p.int128}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    get_virtual_price: viewFun("0xbb7b8b80", "get_virtual_price()", {}, p.uint256),
    calc_token_amount: viewFun("0xed8e84f3", "calc_token_amount(uint256[2],bool)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_is_deposit": p.bool}, p.uint256),
    A: viewFun("0xf446c1d0", "A()", {}, p.uint256),
    A_precise: viewFun("0x76a2f0f0", "A_precise()", {}, p.uint256),
    balances: viewFun("0x4903b0d1", "balances(uint256)", {"i": p.uint256}, p.uint256),
    get_balances: viewFun("0x14f05979", "get_balances()", {}, p.array(p.uint256)),
    stored_rates: viewFun("0xfd0684b1", "stored_rates()", {}, p.array(p.uint256)),
    dynamic_fee: viewFun("0x76a9cd3e", "dynamic_fee(int128,int128)", {"i": p.int128, "j": p.int128}, p.uint256),
    ramp_A: fun("0x3c157e64", "ramp_A(uint256,uint256)", {"_future_A": p.uint256, "_future_time": p.uint256}, ),
    stop_ramp_A: fun("0x551a6588", "stop_ramp_A()", {}, ),
    set_new_fee: fun("0x015c2838", "set_new_fee(uint256,uint256)", {"_new_fee": p.uint256, "_new_offpeg_fee_multiplier": p.uint256}, ),
    set_ma_exp_time: fun("0x65bbea6b", "set_ma_exp_time(uint256,uint256)", {"_ma_exp_time": p.uint256, "_D_ma_time": p.uint256}, ),
    N_COINS: viewFun("0x29357750", "N_COINS()", {}, p.uint256),
    BASE_POOL: viewFun("0x71511a5e", "BASE_POOL()", {}, p.address),
    BASE_N_COINS: viewFun("0x3da575a1", "BASE_N_COINS()", {}, p.uint256),
    BASE_COINS: viewFun("0xd52d5b86", "BASE_COINS(uint256)", {"arg0": p.uint256}, p.address),
    coins: viewFun("0xc6610657", "coins(uint256)", {"arg0": p.uint256}, p.address),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint256),
    offpeg_fee_multiplier: viewFun("0x8edfdd5f", "offpeg_fee_multiplier()", {}, p.uint256),
    admin_fee: viewFun("0xfee3f7f9", "admin_fee()", {}, p.uint256),
    initial_A: viewFun("0x5409491a", "initial_A()", {}, p.uint256),
    future_A: viewFun("0xb4b577ad", "future_A()", {}, p.uint256),
    initial_A_time: viewFun("0x2081066c", "initial_A_time()", {}, p.uint256),
    future_A_time: viewFun("0x14052288", "future_A_time()", {}, p.uint256),
    admin_balances: viewFun("0xe2e7d264", "admin_balances(uint256)", {"arg0": p.uint256}, p.uint256),
    ma_exp_time: viewFun("0x1be913a5", "ma_exp_time()", {}, p.uint256),
    D_ma_time: viewFun("0x9c4258c4", "D_ma_time()", {}, p.uint256),
    ma_last_time: viewFun("0x1ddc3b01", "ma_last_time()", {}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"arg0": p.address}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"arg0": p.address, "arg1": p.address}, p.uint256),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"arg0": p.address}, p.uint256),
    salt: viewFun("0xbfa0b133", "salt()", {}, p.bytes32),
}

export class Contract extends ContractBase {

    last_price(i: Last_priceParams["i"]) {
        return this.eth_call(functions.last_price, {i})
    }

    ema_price(i: Ema_priceParams["i"]) {
        return this.eth_call(functions.ema_price, {i})
    }

    get_p(i: Get_pParams["i"]) {
        return this.eth_call(functions.get_p, {i})
    }

    price_oracle(i: Price_oracleParams["i"]) {
        return this.eth_call(functions.price_oracle, {i})
    }

    D_oracle() {
        return this.eth_call(functions.D_oracle, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    get_dx(i: Get_dxParams["i"], j: Get_dxParams["j"], dy: Get_dxParams["dy"]) {
        return this.eth_call(functions.get_dx, {i, j, dy})
    }

    get_dx_underlying(i: Get_dx_underlyingParams["i"], j: Get_dx_underlyingParams["j"], dy: Get_dx_underlyingParams["dy"]) {
        return this.eth_call(functions.get_dx_underlying, {i, j, dy})
    }

    get_dy(i: Get_dyParams["i"], j: Get_dyParams["j"], dx: Get_dyParams["dx"]) {
        return this.eth_call(functions.get_dy, {i, j, dx})
    }

    get_dy_underlying(i: Get_dy_underlyingParams["i"], j: Get_dy_underlyingParams["j"], dx: Get_dy_underlyingParams["dx"]) {
        return this.eth_call(functions.get_dy_underlying, {i, j, dx})
    }

    calc_withdraw_one_coin(_burn_amount: Calc_withdraw_one_coinParams["_burn_amount"], i: Calc_withdraw_one_coinParams["i"]) {
        return this.eth_call(functions.calc_withdraw_one_coin, {_burn_amount, i})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    get_virtual_price() {
        return this.eth_call(functions.get_virtual_price, {})
    }

    calc_token_amount(_amounts: Calc_token_amountParams["_amounts"], _is_deposit: Calc_token_amountParams["_is_deposit"]) {
        return this.eth_call(functions.calc_token_amount, {_amounts, _is_deposit})
    }

    A() {
        return this.eth_call(functions.A, {})
    }

    A_precise() {
        return this.eth_call(functions.A_precise, {})
    }

    balances(i: BalancesParams["i"]) {
        return this.eth_call(functions.balances, {i})
    }

    get_balances() {
        return this.eth_call(functions.get_balances, {})
    }

    stored_rates() {
        return this.eth_call(functions.stored_rates, {})
    }

    dynamic_fee(i: Dynamic_feeParams["i"], j: Dynamic_feeParams["j"]) {
        return this.eth_call(functions.dynamic_fee, {i, j})
    }

    N_COINS() {
        return this.eth_call(functions.N_COINS, {})
    }

    BASE_POOL() {
        return this.eth_call(functions.BASE_POOL, {})
    }

    BASE_N_COINS() {
        return this.eth_call(functions.BASE_N_COINS, {})
    }

    BASE_COINS(arg0: BASE_COINSParams["arg0"]) {
        return this.eth_call(functions.BASE_COINS, {arg0})
    }

    coins(arg0: CoinsParams["arg0"]) {
        return this.eth_call(functions.coins, {arg0})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    offpeg_fee_multiplier() {
        return this.eth_call(functions.offpeg_fee_multiplier, {})
    }

    admin_fee() {
        return this.eth_call(functions.admin_fee, {})
    }

    initial_A() {
        return this.eth_call(functions.initial_A, {})
    }

    future_A() {
        return this.eth_call(functions.future_A, {})
    }

    initial_A_time() {
        return this.eth_call(functions.initial_A_time, {})
    }

    future_A_time() {
        return this.eth_call(functions.future_A_time, {})
    }

    admin_balances(arg0: Admin_balancesParams["arg0"]) {
        return this.eth_call(functions.admin_balances, {arg0})
    }

    ma_exp_time() {
        return this.eth_call(functions.ma_exp_time, {})
    }

    D_ma_time() {
        return this.eth_call(functions.D_ma_time, {})
    }

    ma_last_time() {
        return this.eth_call(functions.ma_last_time, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(functions.balanceOf, {arg0})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(functions.allowance, {arg0, arg1})
    }

    nonces(arg0: NoncesParams["arg0"]) {
        return this.eth_call(functions.nonces, {arg0})
    }

    salt() {
        return this.eth_call(functions.salt, {})
    }
}

/// Event types
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type TokenExchangeEventArgs = EParams<typeof events.TokenExchange>
export type TokenExchangeUnderlyingEventArgs = EParams<typeof events.TokenExchangeUnderlying>
export type AddLiquidityEventArgs = EParams<typeof events.AddLiquidity>
export type RemoveLiquidityEventArgs = EParams<typeof events.RemoveLiquidity>
export type RemoveLiquidityOneEventArgs = EParams<typeof events.RemoveLiquidityOne>
export type RemoveLiquidityImbalanceEventArgs = EParams<typeof events.RemoveLiquidityImbalance>
export type RampAEventArgs = EParams<typeof events.RampA>
export type StopRampAEventArgs = EParams<typeof events.StopRampA>
export type ApplyNewFeeEventArgs = EParams<typeof events.ApplyNewFee>
export type SetNewMATimeEventArgs = EParams<typeof events.SetNewMATime>

/// Function types
export type ExchangeParams_0 = FunctionArguments<typeof functions['exchange(int128,int128,uint256,uint256)']>
export type ExchangeReturn_0 = FunctionReturn<typeof functions['exchange(int128,int128,uint256,uint256)']>

export type ExchangeParams_1 = FunctionArguments<typeof functions['exchange(int128,int128,uint256,uint256,address)']>
export type ExchangeReturn_1 = FunctionReturn<typeof functions['exchange(int128,int128,uint256,uint256,address)']>

export type Exchange_receivedParams_0 = FunctionArguments<typeof functions['exchange_received(int128,int128,uint256,uint256)']>
export type Exchange_receivedReturn_0 = FunctionReturn<typeof functions['exchange_received(int128,int128,uint256,uint256)']>

export type Exchange_receivedParams_1 = FunctionArguments<typeof functions['exchange_received(int128,int128,uint256,uint256,address)']>
export type Exchange_receivedReturn_1 = FunctionReturn<typeof functions['exchange_received(int128,int128,uint256,uint256,address)']>

export type Exchange_underlyingParams_0 = FunctionArguments<typeof functions['exchange_underlying(int128,int128,uint256,uint256)']>
export type Exchange_underlyingReturn_0 = FunctionReturn<typeof functions['exchange_underlying(int128,int128,uint256,uint256)']>

export type Exchange_underlyingParams_1 = FunctionArguments<typeof functions['exchange_underlying(int128,int128,uint256,uint256,address)']>
export type Exchange_underlyingReturn_1 = FunctionReturn<typeof functions['exchange_underlying(int128,int128,uint256,uint256,address)']>

export type Add_liquidityParams_0 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256)']>
export type Add_liquidityReturn_0 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256)']>

export type Add_liquidityParams_1 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256,address)']>
export type Add_liquidityReturn_1 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256,address)']>

export type Remove_liquidity_one_coinParams_0 = FunctionArguments<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256)']>
export type Remove_liquidity_one_coinReturn_0 = FunctionReturn<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256)']>

export type Remove_liquidity_one_coinParams_1 = FunctionArguments<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256,address)']>
export type Remove_liquidity_one_coinReturn_1 = FunctionReturn<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256,address)']>

export type Remove_liquidity_imbalanceParams_0 = FunctionArguments<typeof functions['remove_liquidity_imbalance(uint256[2],uint256)']>
export type Remove_liquidity_imbalanceReturn_0 = FunctionReturn<typeof functions['remove_liquidity_imbalance(uint256[2],uint256)']>

export type Remove_liquidity_imbalanceParams_1 = FunctionArguments<typeof functions['remove_liquidity_imbalance(uint256[2],uint256,address)']>
export type Remove_liquidity_imbalanceReturn_1 = FunctionReturn<typeof functions['remove_liquidity_imbalance(uint256[2],uint256,address)']>

export type Remove_liquidityParams_0 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2])']>
export type Remove_liquidityReturn_0 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2])']>

export type Remove_liquidityParams_1 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2],address)']>
export type Remove_liquidityReturn_1 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2],address)']>

export type Remove_liquidityParams_2 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2],address,bool)']>
export type Remove_liquidityReturn_2 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2],address,bool)']>

export type Withdraw_admin_feesParams = FunctionArguments<typeof functions.withdraw_admin_fees>
export type Withdraw_admin_feesReturn = FunctionReturn<typeof functions.withdraw_admin_fees>

export type Last_priceParams = FunctionArguments<typeof functions.last_price>
export type Last_priceReturn = FunctionReturn<typeof functions.last_price>

export type Ema_priceParams = FunctionArguments<typeof functions.ema_price>
export type Ema_priceReturn = FunctionReturn<typeof functions.ema_price>

export type Get_pParams = FunctionArguments<typeof functions.get_p>
export type Get_pReturn = FunctionReturn<typeof functions.get_p>

export type Price_oracleParams = FunctionArguments<typeof functions.price_oracle>
export type Price_oracleReturn = FunctionReturn<typeof functions.price_oracle>

export type D_oracleParams = FunctionArguments<typeof functions.D_oracle>
export type D_oracleReturn = FunctionReturn<typeof functions.D_oracle>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type Get_dxParams = FunctionArguments<typeof functions.get_dx>
export type Get_dxReturn = FunctionReturn<typeof functions.get_dx>

export type Get_dx_underlyingParams = FunctionArguments<typeof functions.get_dx_underlying>
export type Get_dx_underlyingReturn = FunctionReturn<typeof functions.get_dx_underlying>

export type Get_dyParams = FunctionArguments<typeof functions.get_dy>
export type Get_dyReturn = FunctionReturn<typeof functions.get_dy>

export type Get_dy_underlyingParams = FunctionArguments<typeof functions.get_dy_underlying>
export type Get_dy_underlyingReturn = FunctionReturn<typeof functions.get_dy_underlying>

export type Calc_withdraw_one_coinParams = FunctionArguments<typeof functions.calc_withdraw_one_coin>
export type Calc_withdraw_one_coinReturn = FunctionReturn<typeof functions.calc_withdraw_one_coin>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type Get_virtual_priceParams = FunctionArguments<typeof functions.get_virtual_price>
export type Get_virtual_priceReturn = FunctionReturn<typeof functions.get_virtual_price>

export type Calc_token_amountParams = FunctionArguments<typeof functions.calc_token_amount>
export type Calc_token_amountReturn = FunctionReturn<typeof functions.calc_token_amount>

export type AParams = FunctionArguments<typeof functions.A>
export type AReturn = FunctionReturn<typeof functions.A>

export type A_preciseParams = FunctionArguments<typeof functions.A_precise>
export type A_preciseReturn = FunctionReturn<typeof functions.A_precise>

export type BalancesParams = FunctionArguments<typeof functions.balances>
export type BalancesReturn = FunctionReturn<typeof functions.balances>

export type Get_balancesParams = FunctionArguments<typeof functions.get_balances>
export type Get_balancesReturn = FunctionReturn<typeof functions.get_balances>

export type Stored_ratesParams = FunctionArguments<typeof functions.stored_rates>
export type Stored_ratesReturn = FunctionReturn<typeof functions.stored_rates>

export type Dynamic_feeParams = FunctionArguments<typeof functions.dynamic_fee>
export type Dynamic_feeReturn = FunctionReturn<typeof functions.dynamic_fee>

export type Ramp_AParams = FunctionArguments<typeof functions.ramp_A>
export type Ramp_AReturn = FunctionReturn<typeof functions.ramp_A>

export type Stop_ramp_AParams = FunctionArguments<typeof functions.stop_ramp_A>
export type Stop_ramp_AReturn = FunctionReturn<typeof functions.stop_ramp_A>

export type Set_new_feeParams = FunctionArguments<typeof functions.set_new_fee>
export type Set_new_feeReturn = FunctionReturn<typeof functions.set_new_fee>

export type Set_ma_exp_timeParams = FunctionArguments<typeof functions.set_ma_exp_time>
export type Set_ma_exp_timeReturn = FunctionReturn<typeof functions.set_ma_exp_time>

export type N_COINSParams = FunctionArguments<typeof functions.N_COINS>
export type N_COINSReturn = FunctionReturn<typeof functions.N_COINS>

export type BASE_POOLParams = FunctionArguments<typeof functions.BASE_POOL>
export type BASE_POOLReturn = FunctionReturn<typeof functions.BASE_POOL>

export type BASE_N_COINSParams = FunctionArguments<typeof functions.BASE_N_COINS>
export type BASE_N_COINSReturn = FunctionReturn<typeof functions.BASE_N_COINS>

export type BASE_COINSParams = FunctionArguments<typeof functions.BASE_COINS>
export type BASE_COINSReturn = FunctionReturn<typeof functions.BASE_COINS>

export type CoinsParams = FunctionArguments<typeof functions.coins>
export type CoinsReturn = FunctionReturn<typeof functions.coins>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type Offpeg_fee_multiplierParams = FunctionArguments<typeof functions.offpeg_fee_multiplier>
export type Offpeg_fee_multiplierReturn = FunctionReturn<typeof functions.offpeg_fee_multiplier>

export type Admin_feeParams = FunctionArguments<typeof functions.admin_fee>
export type Admin_feeReturn = FunctionReturn<typeof functions.admin_fee>

export type Initial_AParams = FunctionArguments<typeof functions.initial_A>
export type Initial_AReturn = FunctionReturn<typeof functions.initial_A>

export type Future_AParams = FunctionArguments<typeof functions.future_A>
export type Future_AReturn = FunctionReturn<typeof functions.future_A>

export type Initial_A_timeParams = FunctionArguments<typeof functions.initial_A_time>
export type Initial_A_timeReturn = FunctionReturn<typeof functions.initial_A_time>

export type Future_A_timeParams = FunctionArguments<typeof functions.future_A_time>
export type Future_A_timeReturn = FunctionReturn<typeof functions.future_A_time>

export type Admin_balancesParams = FunctionArguments<typeof functions.admin_balances>
export type Admin_balancesReturn = FunctionReturn<typeof functions.admin_balances>

export type Ma_exp_timeParams = FunctionArguments<typeof functions.ma_exp_time>
export type Ma_exp_timeReturn = FunctionReturn<typeof functions.ma_exp_time>

export type D_ma_timeParams = FunctionArguments<typeof functions.D_ma_time>
export type D_ma_timeReturn = FunctionReturn<typeof functions.D_ma_time>

export type Ma_last_timeParams = FunctionArguments<typeof functions.ma_last_time>
export type Ma_last_timeReturn = FunctionReturn<typeof functions.ma_last_time>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type SaltParams = FunctionArguments<typeof functions.salt>
export type SaltReturn = FunctionReturn<typeof functions.salt>

