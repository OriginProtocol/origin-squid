import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    TokenExchange: event("0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140", "TokenExchange(address,int128,uint256,int128,uint256)", {"buyer": indexed(p.address), "sold_id": p.int128, "tokens_sold": p.uint256, "bought_id": p.int128, "tokens_bought": p.uint256}),
    AddLiquidity: event("0x26f55a85081d24974e85c6c00045d0f0453991e95873f52bff0d21af4079a768", "AddLiquidity(address,uint256[2],uint256[2],uint256,uint256)", {"provider": indexed(p.address), "token_amounts": p.fixedSizeArray(p.uint256, 2), "fees": p.fixedSizeArray(p.uint256, 2), "invariant": p.uint256, "token_supply": p.uint256}),
    RemoveLiquidity: event("0x7c363854ccf79623411f8995b362bce5eddff18c927edc6f5dbbb5e05819a82c", "RemoveLiquidity(address,uint256[2],uint256[2],uint256)", {"provider": indexed(p.address), "token_amounts": p.fixedSizeArray(p.uint256, 2), "fees": p.fixedSizeArray(p.uint256, 2), "token_supply": p.uint256}),
    RemoveLiquidityOne: event("0x5ad056f2e28a8cec232015406b843668c1e36cda598127ec3b8c59b8c72773a0", "RemoveLiquidityOne(address,uint256,uint256,uint256)", {"provider": indexed(p.address), "token_amount": p.uint256, "coin_amount": p.uint256, "token_supply": p.uint256}),
    RemoveLiquidityImbalance: event("0x2b5508378d7e19e0d5fa338419034731416c4f5b219a10379956f764317fd47e", "RemoveLiquidityImbalance(address,uint256[2],uint256[2],uint256,uint256)", {"provider": indexed(p.address), "token_amounts": p.fixedSizeArray(p.uint256, 2), "fees": p.fixedSizeArray(p.uint256, 2), "invariant": p.uint256, "token_supply": p.uint256}),
    RampA: event("0xa2b71ec6df949300b59aab36b55e189697b750119dd349fcfa8c0f779e83c254", "RampA(uint256,uint256,uint256,uint256)", {"old_A": p.uint256, "new_A": p.uint256, "initial_time": p.uint256, "future_time": p.uint256}),
    StopRampA: event("0x46e22fb3709ad289f62ce63d469248536dbc78d82b84a3d7e74ad606dc201938", "StopRampA(uint256,uint256)", {"A": p.uint256, "t": p.uint256}),
    CommitNewFee: event("0x878eb36b3f197f05821c06953d9bc8f14b332a227b1e26df06a4215bbfe5d73f", "CommitNewFee(uint256)", {"new_fee": p.uint256}),
    ApplyNewFee: event("0xa8715770654f54603947addf38c689adbd7182e21673b28bcf306a957aaba215", "ApplyNewFee(uint256)", {"fee": p.uint256}),
}

export const functions = {
    initialize: fun("0xa461b3c8", "initialize(string,string,address[4],uint256[4],uint256,uint256)", {"_name": p.string, "_symbol": p.string, "_coins": p.fixedSizeArray(p.address, 4), "_rate_multipliers": p.fixedSizeArray(p.uint256, 4), "_A": p.uint256, "_fee": p.uint256}, ),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_to": p.address, "_value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_value": p.uint256}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_spender": p.address, "_value": p.uint256}, p.bool),
    permit: fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"_owner": p.address, "_spender": p.address, "_value": p.uint256, "_deadline": p.uint256, "_v": p.uint8, "_r": p.bytes32, "_s": p.bytes32}, p.bool),
    last_price: viewFun("0xfde625e6", "last_price()", {}, p.uint256),
    ema_price: viewFun("0xc24c7c29", "ema_price()", {}, p.uint256),
    get_balances: viewFun("0x14f05979", "get_balances()", {}, p.fixedSizeArray(p.uint256, 2)),
    admin_fee: viewFun("0xfee3f7f9", "admin_fee()", {}, p.uint256),
    A: viewFun("0xf446c1d0", "A()", {}, p.uint256),
    A_precise: viewFun("0x76a2f0f0", "A_precise()", {}, p.uint256),
    get_p: viewFun("0xf2388acb", "get_p()", {}, p.uint256),
    price_oracle: viewFun("0x86fc88d3", "price_oracle()", {}, p.uint256),
    get_virtual_price: viewFun("0xbb7b8b80", "get_virtual_price()", {}, p.uint256),
    calc_token_amount: viewFun("0xed8e84f3", "calc_token_amount(uint256[2],bool)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_is_deposit": p.bool}, p.uint256),
    'add_liquidity(uint256[2],uint256)': fun("0x0b4c7e4d", "add_liquidity(uint256[2],uint256)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_min_mint_amount": p.uint256}, p.uint256),
    'add_liquidity(uint256[2],uint256,address)': fun("0x0c3e4b54", "add_liquidity(uint256[2],uint256,address)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_min_mint_amount": p.uint256, "_receiver": p.address}, p.uint256),
    get_dy: viewFun("0x5e0d443f", "get_dy(int128,int128,uint256)", {"i": p.int128, "j": p.int128, "dx": p.uint256}, p.uint256),
    'exchange(int128,int128,uint256,uint256)': fun("0x3df02124", "exchange(int128,int128,uint256,uint256)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256}, p.uint256),
    'exchange(int128,int128,uint256,uint256,address)': fun("0xddc1f59d", "exchange(int128,int128,uint256,uint256,address)", {"i": p.int128, "j": p.int128, "_dx": p.uint256, "_min_dy": p.uint256, "_receiver": p.address}, p.uint256),
    'remove_liquidity(uint256,uint256[2])': fun("0x5b36389c", "remove_liquidity(uint256,uint256[2])", {"_burn_amount": p.uint256, "_min_amounts": p.fixedSizeArray(p.uint256, 2)}, p.fixedSizeArray(p.uint256, 2)),
    'remove_liquidity(uint256,uint256[2],address)': fun("0x3eb1719f", "remove_liquidity(uint256,uint256[2],address)", {"_burn_amount": p.uint256, "_min_amounts": p.fixedSizeArray(p.uint256, 2), "_receiver": p.address}, p.fixedSizeArray(p.uint256, 2)),
    'remove_liquidity_imbalance(uint256[2],uint256)': fun("0xe3103273", "remove_liquidity_imbalance(uint256[2],uint256)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_max_burn_amount": p.uint256}, p.uint256),
    'remove_liquidity_imbalance(uint256[2],uint256,address)': fun("0x52d2cfdd", "remove_liquidity_imbalance(uint256[2],uint256,address)", {"_amounts": p.fixedSizeArray(p.uint256, 2), "_max_burn_amount": p.uint256, "_receiver": p.address}, p.uint256),
    calc_withdraw_one_coin: viewFun("0xcc2b27d7", "calc_withdraw_one_coin(uint256,int128)", {"_burn_amount": p.uint256, "i": p.int128}, p.uint256),
    'remove_liquidity_one_coin(uint256,int128,uint256)': fun("0x1a4d01d2", "remove_liquidity_one_coin(uint256,int128,uint256)", {"_burn_amount": p.uint256, "i": p.int128, "_min_received": p.uint256}, p.uint256),
    'remove_liquidity_one_coin(uint256,int128,uint256,address)': fun("0x081579a5", "remove_liquidity_one_coin(uint256,int128,uint256,address)", {"_burn_amount": p.uint256, "i": p.int128, "_min_received": p.uint256, "_receiver": p.address}, p.uint256),
    ramp_A: fun("0x3c157e64", "ramp_A(uint256,uint256)", {"_future_A": p.uint256, "_future_time": p.uint256}, ),
    stop_ramp_A: fun("0x551a6588", "stop_ramp_A()", {}, ),
    admin_balances: viewFun("0xe2e7d264", "admin_balances(uint256)", {"i": p.uint256}, p.uint256),
    withdraw_admin_fees: fun("0x30c54085", "withdraw_admin_fees()", {}, ),
    commit_new_fee: fun("0xa48eac9d", "commit_new_fee(uint256)", {"_new_fee": p.uint256}, ),
    apply_new_fee: fun("0x4f12fe97", "apply_new_fee()", {}, ),
    set_ma_exp_time: fun("0x7f3e17cb", "set_ma_exp_time(uint256)", {"_ma_exp_time": p.uint256}, ),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
    coins: viewFun("0xc6610657", "coins(uint256)", {"arg0": p.uint256}, p.address),
    balances: viewFun("0x4903b0d1", "balances(uint256)", {"arg0": p.uint256}, p.uint256),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint256),
    future_fee: viewFun("0x58680d0b", "future_fee()", {}, p.uint256),
    admin_action_deadline: viewFun("0xe66f43f5", "admin_action_deadline()", {}, p.uint256),
    initial_A: viewFun("0x5409491a", "initial_A()", {}, p.uint256),
    future_A: viewFun("0xb4b577ad", "future_A()", {}, p.uint256),
    initial_A_time: viewFun("0x2081066c", "initial_A_time()", {}, p.uint256),
    future_A_time: viewFun("0x14052288", "future_A_time()", {}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"arg0": p.address}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"arg0": p.address, "arg1": p.address}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"arg0": p.address}, p.uint256),
    ma_exp_time: viewFun("0x1be913a5", "ma_exp_time()", {}, p.uint256),
    ma_last_time: viewFun("0x1ddc3b01", "ma_last_time()", {}, p.uint256),
}

export class Contract extends ContractBase {

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    last_price() {
        return this.eth_call(functions.last_price, {})
    }

    ema_price() {
        return this.eth_call(functions.ema_price, {})
    }

    get_balances() {
        return this.eth_call(functions.get_balances, {})
    }

    admin_fee() {
        return this.eth_call(functions.admin_fee, {})
    }

    A() {
        return this.eth_call(functions.A, {})
    }

    A_precise() {
        return this.eth_call(functions.A_precise, {})
    }

    get_p() {
        return this.eth_call(functions.get_p, {})
    }

    price_oracle() {
        return this.eth_call(functions.price_oracle, {})
    }

    get_virtual_price() {
        return this.eth_call(functions.get_virtual_price, {})
    }

    calc_token_amount(_amounts: Calc_token_amountParams["_amounts"], _is_deposit: Calc_token_amountParams["_is_deposit"]) {
        return this.eth_call(functions.calc_token_amount, {_amounts, _is_deposit})
    }

    get_dy(i: Get_dyParams["i"], j: Get_dyParams["j"], dx: Get_dyParams["dx"]) {
        return this.eth_call(functions.get_dy, {i, j, dx})
    }

    calc_withdraw_one_coin(_burn_amount: Calc_withdraw_one_coinParams["_burn_amount"], i: Calc_withdraw_one_coinParams["i"]) {
        return this.eth_call(functions.calc_withdraw_one_coin, {_burn_amount, i})
    }

    admin_balances(i: Admin_balancesParams["i"]) {
        return this.eth_call(functions.admin_balances, {i})
    }

    version() {
        return this.eth_call(functions.version, {})
    }

    coins(arg0: CoinsParams["arg0"]) {
        return this.eth_call(functions.coins, {arg0})
    }

    balances(arg0: BalancesParams["arg0"]) {
        return this.eth_call(functions.balances, {arg0})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    future_fee() {
        return this.eth_call(functions.future_fee, {})
    }

    admin_action_deadline() {
        return this.eth_call(functions.admin_action_deadline, {})
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

    name() {
        return this.eth_call(functions.name, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(functions.balanceOf, {arg0})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(functions.allowance, {arg0, arg1})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    nonces(arg0: NoncesParams["arg0"]) {
        return this.eth_call(functions.nonces, {arg0})
    }

    ma_exp_time() {
        return this.eth_call(functions.ma_exp_time, {})
    }

    ma_last_time() {
        return this.eth_call(functions.ma_last_time, {})
    }
}

/// Event types
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type TokenExchangeEventArgs = EParams<typeof events.TokenExchange>
export type AddLiquidityEventArgs = EParams<typeof events.AddLiquidity>
export type RemoveLiquidityEventArgs = EParams<typeof events.RemoveLiquidity>
export type RemoveLiquidityOneEventArgs = EParams<typeof events.RemoveLiquidityOne>
export type RemoveLiquidityImbalanceEventArgs = EParams<typeof events.RemoveLiquidityImbalance>
export type RampAEventArgs = EParams<typeof events.RampA>
export type StopRampAEventArgs = EParams<typeof events.StopRampA>
export type CommitNewFeeEventArgs = EParams<typeof events.CommitNewFee>
export type ApplyNewFeeEventArgs = EParams<typeof events.ApplyNewFee>

/// Function types
export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type Last_priceParams = FunctionArguments<typeof functions.last_price>
export type Last_priceReturn = FunctionReturn<typeof functions.last_price>

export type Ema_priceParams = FunctionArguments<typeof functions.ema_price>
export type Ema_priceReturn = FunctionReturn<typeof functions.ema_price>

export type Get_balancesParams = FunctionArguments<typeof functions.get_balances>
export type Get_balancesReturn = FunctionReturn<typeof functions.get_balances>

export type Admin_feeParams = FunctionArguments<typeof functions.admin_fee>
export type Admin_feeReturn = FunctionReturn<typeof functions.admin_fee>

export type AParams = FunctionArguments<typeof functions.A>
export type AReturn = FunctionReturn<typeof functions.A>

export type A_preciseParams = FunctionArguments<typeof functions.A_precise>
export type A_preciseReturn = FunctionReturn<typeof functions.A_precise>

export type Get_pParams = FunctionArguments<typeof functions.get_p>
export type Get_pReturn = FunctionReturn<typeof functions.get_p>

export type Price_oracleParams = FunctionArguments<typeof functions.price_oracle>
export type Price_oracleReturn = FunctionReturn<typeof functions.price_oracle>

export type Get_virtual_priceParams = FunctionArguments<typeof functions.get_virtual_price>
export type Get_virtual_priceReturn = FunctionReturn<typeof functions.get_virtual_price>

export type Calc_token_amountParams = FunctionArguments<typeof functions.calc_token_amount>
export type Calc_token_amountReturn = FunctionReturn<typeof functions.calc_token_amount>

export type Add_liquidityParams_0 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256)']>
export type Add_liquidityReturn_0 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256)']>

export type Add_liquidityParams_1 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256,address)']>
export type Add_liquidityReturn_1 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256,address)']>

export type Get_dyParams = FunctionArguments<typeof functions.get_dy>
export type Get_dyReturn = FunctionReturn<typeof functions.get_dy>

export type ExchangeParams_0 = FunctionArguments<typeof functions['exchange(int128,int128,uint256,uint256)']>
export type ExchangeReturn_0 = FunctionReturn<typeof functions['exchange(int128,int128,uint256,uint256)']>

export type ExchangeParams_1 = FunctionArguments<typeof functions['exchange(int128,int128,uint256,uint256,address)']>
export type ExchangeReturn_1 = FunctionReturn<typeof functions['exchange(int128,int128,uint256,uint256,address)']>

export type Remove_liquidityParams_0 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2])']>
export type Remove_liquidityReturn_0 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2])']>

export type Remove_liquidityParams_1 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2],address)']>
export type Remove_liquidityReturn_1 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2],address)']>

export type Remove_liquidity_imbalanceParams_0 = FunctionArguments<typeof functions['remove_liquidity_imbalance(uint256[2],uint256)']>
export type Remove_liquidity_imbalanceReturn_0 = FunctionReturn<typeof functions['remove_liquidity_imbalance(uint256[2],uint256)']>

export type Remove_liquidity_imbalanceParams_1 = FunctionArguments<typeof functions['remove_liquidity_imbalance(uint256[2],uint256,address)']>
export type Remove_liquidity_imbalanceReturn_1 = FunctionReturn<typeof functions['remove_liquidity_imbalance(uint256[2],uint256,address)']>

export type Calc_withdraw_one_coinParams = FunctionArguments<typeof functions.calc_withdraw_one_coin>
export type Calc_withdraw_one_coinReturn = FunctionReturn<typeof functions.calc_withdraw_one_coin>

export type Remove_liquidity_one_coinParams_0 = FunctionArguments<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256)']>
export type Remove_liquidity_one_coinReturn_0 = FunctionReturn<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256)']>

export type Remove_liquidity_one_coinParams_1 = FunctionArguments<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256,address)']>
export type Remove_liquidity_one_coinReturn_1 = FunctionReturn<typeof functions['remove_liquidity_one_coin(uint256,int128,uint256,address)']>

export type Ramp_AParams = FunctionArguments<typeof functions.ramp_A>
export type Ramp_AReturn = FunctionReturn<typeof functions.ramp_A>

export type Stop_ramp_AParams = FunctionArguments<typeof functions.stop_ramp_A>
export type Stop_ramp_AReturn = FunctionReturn<typeof functions.stop_ramp_A>

export type Admin_balancesParams = FunctionArguments<typeof functions.admin_balances>
export type Admin_balancesReturn = FunctionReturn<typeof functions.admin_balances>

export type Withdraw_admin_feesParams = FunctionArguments<typeof functions.withdraw_admin_fees>
export type Withdraw_admin_feesReturn = FunctionReturn<typeof functions.withdraw_admin_fees>

export type Commit_new_feeParams = FunctionArguments<typeof functions.commit_new_fee>
export type Commit_new_feeReturn = FunctionReturn<typeof functions.commit_new_fee>

export type Apply_new_feeParams = FunctionArguments<typeof functions.apply_new_fee>
export type Apply_new_feeReturn = FunctionReturn<typeof functions.apply_new_fee>

export type Set_ma_exp_timeParams = FunctionArguments<typeof functions.set_ma_exp_time>
export type Set_ma_exp_timeReturn = FunctionReturn<typeof functions.set_ma_exp_time>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type CoinsParams = FunctionArguments<typeof functions.coins>
export type CoinsReturn = FunctionReturn<typeof functions.coins>

export type BalancesParams = FunctionArguments<typeof functions.balances>
export type BalancesReturn = FunctionReturn<typeof functions.balances>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type Future_feeParams = FunctionArguments<typeof functions.future_fee>
export type Future_feeReturn = FunctionReturn<typeof functions.future_fee>

export type Admin_action_deadlineParams = FunctionArguments<typeof functions.admin_action_deadline>
export type Admin_action_deadlineReturn = FunctionReturn<typeof functions.admin_action_deadline>

export type Initial_AParams = FunctionArguments<typeof functions.initial_A>
export type Initial_AReturn = FunctionReturn<typeof functions.initial_A>

export type Future_AParams = FunctionArguments<typeof functions.future_A>
export type Future_AReturn = FunctionReturn<typeof functions.future_A>

export type Initial_A_timeParams = FunctionArguments<typeof functions.initial_A_time>
export type Initial_A_timeReturn = FunctionReturn<typeof functions.initial_A_time>

export type Future_A_timeParams = FunctionArguments<typeof functions.future_A_time>
export type Future_A_timeReturn = FunctionReturn<typeof functions.future_A_time>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type Ma_exp_timeParams = FunctionArguments<typeof functions.ma_exp_time>
export type Ma_exp_timeReturn = FunctionReturn<typeof functions.ma_exp_time>

export type Ma_last_timeParams = FunctionArguments<typeof functions.ma_last_time>
export type Ma_last_timeReturn = FunctionReturn<typeof functions.ma_last_time>

