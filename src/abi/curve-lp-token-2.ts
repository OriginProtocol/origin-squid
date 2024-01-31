import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './curve-lp-token-2.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    TokenExchange: new LogEvent<([buyer: string, sold_id: bigint, tokens_sold: bigint, bought_id: bigint, tokens_bought: bigint] & {buyer: string, sold_id: bigint, tokens_sold: bigint, bought_id: bigint, tokens_bought: bigint})>(
        abi, '0xb2e76ae99761dc136e598d4a629bb347eccb9532a5f8bbd72e18467c3c34cc98'
    ),
    AddLiquidity: new LogEvent<([provider: string, token_amounts: Array<bigint>, fee: bigint, token_supply: bigint] & {provider: string, token_amounts: Array<bigint>, fee: bigint, token_supply: bigint})>(
        abi, '0x540ab385f9b5d450a27404172caade516b3ba3f4be88239ac56a2ad1de2a1f5a'
    ),
    RemoveLiquidity: new LogEvent<([provider: string, token_amounts: Array<bigint>, token_supply: bigint] & {provider: string, token_amounts: Array<bigint>, token_supply: bigint})>(
        abi, '0xdd3c0336a16f1b64f172b7bb0dad5b2b3c7c76f91e8c4aafd6aae60dce800153'
    ),
    RemoveLiquidityOne: new LogEvent<([provider: string, token_amount: bigint, coin_index: bigint, coin_amount: bigint] & {provider: string, token_amount: bigint, coin_index: bigint, coin_amount: bigint})>(
        abi, '0x5ad056f2e28a8cec232015406b843668c1e36cda598127ec3b8c59b8c72773a0'
    ),
    CommitNewParameters: new LogEvent<([deadline: bigint, admin_fee: bigint, mid_fee: bigint, out_fee: bigint, fee_gamma: bigint, allowed_extra_profit: bigint, adjustment_step: bigint, ma_half_time: bigint] & {deadline: bigint, admin_fee: bigint, mid_fee: bigint, out_fee: bigint, fee_gamma: bigint, allowed_extra_profit: bigint, adjustment_step: bigint, ma_half_time: bigint})>(
        abi, '0x913fde9a37e1f8ab67876a4d0ce80790d764fcfc5692f4529526df9c6bdde553'
    ),
    NewParameters: new LogEvent<([admin_fee: bigint, mid_fee: bigint, out_fee: bigint, fee_gamma: bigint, allowed_extra_profit: bigint, adjustment_step: bigint, ma_half_time: bigint] & {admin_fee: bigint, mid_fee: bigint, out_fee: bigint, fee_gamma: bigint, allowed_extra_profit: bigint, adjustment_step: bigint, ma_half_time: bigint})>(
        abi, '0x1c65bbdc939f346e5d6f0bde1f072819947438d4fc7b182cc59c2f6dc5504087'
    ),
    RampAgamma: new LogEvent<([initial_A: bigint, future_A: bigint, initial_gamma: bigint, future_gamma: bigint, initial_time: bigint, future_time: bigint] & {initial_A: bigint, future_A: bigint, initial_gamma: bigint, future_gamma: bigint, initial_time: bigint, future_time: bigint})>(
        abi, '0xe35f0559b0642164e286b30df2077ec3a05426617a25db7578fd20ba39a6cd05'
    ),
    StopRampA: new LogEvent<([current_A: bigint, current_gamma: bigint, time: bigint] & {current_A: bigint, current_gamma: bigint, time: bigint})>(
        abi, '0x5f0e7fba3d100c9e19446e1c92fe436f0a9a22fe99669360e4fdd6d3de2fc284'
    ),
    ClaimAdminFee: new LogEvent<([admin: string, tokens: bigint] & {admin: string, tokens: bigint})>(
        abi, '0x6059a38198b1dc42b3791087d1ff0fbd72b3179553c25f678cd246f52ffaaf59'
    ),
}

export const functions = {
    'exchange(uint256,uint256,uint256,uint256)': new Func<[i: bigint, j: bigint, dx: bigint, min_dy: bigint], {i: bigint, j: bigint, dx: bigint, min_dy: bigint}, bigint>(
        abi, '0x5b41b908'
    ),
    'exchange(uint256,uint256,uint256,uint256,bool)': new Func<[i: bigint, j: bigint, dx: bigint, min_dy: bigint, use_eth: boolean], {i: bigint, j: bigint, dx: bigint, min_dy: bigint, use_eth: boolean}, bigint>(
        abi, '0x394747c5'
    ),
    'exchange(uint256,uint256,uint256,uint256,bool,address)': new Func<[i: bigint, j: bigint, dx: bigint, min_dy: bigint, use_eth: boolean, receiver: string], {i: bigint, j: bigint, dx: bigint, min_dy: bigint, use_eth: boolean, receiver: string}, bigint>(
        abi, '0xce7d6503'
    ),
    'exchange_underlying(uint256,uint256,uint256,uint256)': new Func<[i: bigint, j: bigint, dx: bigint, min_dy: bigint], {i: bigint, j: bigint, dx: bigint, min_dy: bigint}, bigint>(
        abi, '0x65b2489b'
    ),
    'exchange_underlying(uint256,uint256,uint256,uint256,address)': new Func<[i: bigint, j: bigint, dx: bigint, min_dy: bigint, receiver: string], {i: bigint, j: bigint, dx: bigint, min_dy: bigint, receiver: string}, bigint>(
        abi, '0xe2ad025a'
    ),
    exchange_extended: new Func<[i: bigint, j: bigint, dx: bigint, min_dy: bigint, use_eth: boolean, sender: string, receiver: string, cb: string], {i: bigint, j: bigint, dx: bigint, min_dy: bigint, use_eth: boolean, sender: string, receiver: string, cb: string}, bigint>(
        abi, '0xdd96994f'
    ),
    'add_liquidity(uint256[2],uint256)': new Func<[amounts: Array<bigint>, min_mint_amount: bigint], {amounts: Array<bigint>, min_mint_amount: bigint}, bigint>(
        abi, '0x0b4c7e4d'
    ),
    'add_liquidity(uint256[2],uint256,bool)': new Func<[amounts: Array<bigint>, min_mint_amount: bigint, use_eth: boolean], {amounts: Array<bigint>, min_mint_amount: bigint, use_eth: boolean}, bigint>(
        abi, '0xee22be23'
    ),
    'add_liquidity(uint256[2],uint256,bool,address)': new Func<[amounts: Array<bigint>, min_mint_amount: bigint, use_eth: boolean, receiver: string], {amounts: Array<bigint>, min_mint_amount: bigint, use_eth: boolean, receiver: string}, bigint>(
        abi, '0x7328333b'
    ),
    'remove_liquidity(uint256,uint256[2])': new Func<[_amount: bigint, min_amounts: Array<bigint>], {_amount: bigint, min_amounts: Array<bigint>}, []>(
        abi, '0x5b36389c'
    ),
    'remove_liquidity(uint256,uint256[2],bool)': new Func<[_amount: bigint, min_amounts: Array<bigint>, use_eth: boolean], {_amount: bigint, min_amounts: Array<bigint>, use_eth: boolean}, []>(
        abi, '0x269b5581'
    ),
    'remove_liquidity(uint256,uint256[2],bool,address)': new Func<[_amount: bigint, min_amounts: Array<bigint>, use_eth: boolean, receiver: string], {_amount: bigint, min_amounts: Array<bigint>, use_eth: boolean, receiver: string}, []>(
        abi, '0x1808e84a'
    ),
    'remove_liquidity_one_coin(uint256,uint256,uint256)': new Func<[token_amount: bigint, i: bigint, min_amount: bigint], {token_amount: bigint, i: bigint, min_amount: bigint}, bigint>(
        abi, '0xf1dc3cc9'
    ),
    'remove_liquidity_one_coin(uint256,uint256,uint256,bool)': new Func<[token_amount: bigint, i: bigint, min_amount: bigint, use_eth: boolean], {token_amount: bigint, i: bigint, min_amount: bigint, use_eth: boolean}, bigint>(
        abi, '0x8f15b6b5'
    ),
    'remove_liquidity_one_coin(uint256,uint256,uint256,bool,address)': new Func<[token_amount: bigint, i: bigint, min_amount: bigint, use_eth: boolean, receiver: string], {token_amount: bigint, i: bigint, min_amount: bigint, use_eth: boolean, receiver: string}, bigint>(
        abi, '0x07329bcd'
    ),
    claim_admin_fees: new Func<[], {}, []>(
        abi, '0xc93f49e8'
    ),
    ramp_A_gamma: new Func<[future_A: bigint, future_gamma: bigint, future_time: bigint], {future_A: bigint, future_gamma: bigint, future_time: bigint}, []>(
        abi, '0x5e248072'
    ),
    stop_ramp_A_gamma: new Func<[], {}, []>(
        abi, '0x244c7c2e'
    ),
    commit_new_parameters: new Func<[_new_mid_fee: bigint, _new_out_fee: bigint, _new_admin_fee: bigint, _new_fee_gamma: bigint, _new_allowed_extra_profit: bigint, _new_adjustment_step: bigint, _new_ma_half_time: bigint], {_new_mid_fee: bigint, _new_out_fee: bigint, _new_admin_fee: bigint, _new_fee_gamma: bigint, _new_allowed_extra_profit: bigint, _new_adjustment_step: bigint, _new_ma_half_time: bigint}, []>(
        abi, '0xa43c3351'
    ),
    apply_new_parameters: new Func<[], {}, []>(
        abi, '0x2a7dd7cd'
    ),
    revert_new_parameters: new Func<[], {}, []>(
        abi, '0x226840fb'
    ),
    get_dy: new Func<[i: bigint, j: bigint, dx: bigint], {i: bigint, j: bigint, dx: bigint}, bigint>(
        abi, '0x556d6e9f'
    ),
    calc_token_amount: new Func<[amounts: Array<bigint>], {amounts: Array<bigint>}, bigint>(
        abi, '0x8d8ea727'
    ),
    calc_withdraw_one_coin: new Func<[token_amount: bigint, i: bigint], {token_amount: bigint, i: bigint}, bigint>(
        abi, '0x4fb08c5e'
    ),
    lp_price: new Func<[], {}, bigint>(
        abi, '0x54f0f7d5'
    ),
    A: new Func<[], {}, bigint>(
        abi, '0xf446c1d0'
    ),
    gamma: new Func<[], {}, bigint>(
        abi, '0xb1373929'
    ),
    fee: new Func<[], {}, bigint>(
        abi, '0xddca3f43'
    ),
    get_virtual_price: new Func<[], {}, bigint>(
        abi, '0xbb7b8b80'
    ),
    price_oracle: new Func<[], {}, bigint>(
        abi, '0x86fc88d3'
    ),
    initialize: new Func<[A: bigint, gamma: bigint, mid_fee: bigint, out_fee: bigint, allowed_extra_profit: bigint, fee_gamma: bigint, adjustment_step: bigint, admin_fee: bigint, ma_half_time: bigint, initial_price: bigint, _token: string, _coins: Array<string>, _precisions: bigint], {A: bigint, gamma: bigint, mid_fee: bigint, out_fee: bigint, allowed_extra_profit: bigint, fee_gamma: bigint, adjustment_step: bigint, admin_fee: bigint, ma_half_time: bigint, initial_price: bigint, _token: string, _coins: Array<string>, _precisions: bigint}, []>(
        abi, '0xa39e95c5'
    ),
    token: new Func<[], {}, string>(
        abi, '0xfc0c546a'
    ),
    coins: new Func<[arg0: bigint], {arg0: bigint}, string>(
        abi, '0xc6610657'
    ),
    price_scale: new Func<[], {}, bigint>(
        abi, '0xb9e8c9fd'
    ),
    last_prices: new Func<[], {}, bigint>(
        abi, '0xc146bf94'
    ),
    last_prices_timestamp: new Func<[], {}, bigint>(
        abi, '0x6112c747'
    ),
    initial_A_gamma: new Func<[], {}, bigint>(
        abi, '0x204fe3d5'
    ),
    future_A_gamma: new Func<[], {}, bigint>(
        abi, '0xf30cfad5'
    ),
    initial_A_gamma_time: new Func<[], {}, bigint>(
        abi, '0xe89876ff'
    ),
    future_A_gamma_time: new Func<[], {}, bigint>(
        abi, '0xf9ed9597'
    ),
    allowed_extra_profit: new Func<[], {}, bigint>(
        abi, '0x49fe9e77'
    ),
    future_allowed_extra_profit: new Func<[], {}, bigint>(
        abi, '0x727ced57'
    ),
    fee_gamma: new Func<[], {}, bigint>(
        abi, '0x72d4f0e2'
    ),
    future_fee_gamma: new Func<[], {}, bigint>(
        abi, '0xd7c3dcbe'
    ),
    adjustment_step: new Func<[], {}, bigint>(
        abi, '0x083812e5'
    ),
    future_adjustment_step: new Func<[], {}, bigint>(
        abi, '0x4ea12c7d'
    ),
    ma_half_time: new Func<[], {}, bigint>(
        abi, '0x662b6274'
    ),
    future_ma_half_time: new Func<[], {}, bigint>(
        abi, '0x0c5e23d4'
    ),
    mid_fee: new Func<[], {}, bigint>(
        abi, '0x92526c0c'
    ),
    out_fee: new Func<[], {}, bigint>(
        abi, '0xee8de675'
    ),
    admin_fee: new Func<[], {}, bigint>(
        abi, '0xfee3f7f9'
    ),
    future_mid_fee: new Func<[], {}, bigint>(
        abi, '0x7cf9aedc'
    ),
    future_out_fee: new Func<[], {}, bigint>(
        abi, '0x7d1b060c'
    ),
    future_admin_fee: new Func<[], {}, bigint>(
        abi, '0xe3824462'
    ),
    balances: new Func<[arg0: bigint], {arg0: bigint}, bigint>(
        abi, '0x4903b0d1'
    ),
    D: new Func<[], {}, bigint>(
        abi, '0x0f529ba2'
    ),
    factory: new Func<[], {}, string>(
        abi, '0xc45a0155'
    ),
    xcp_profit: new Func<[], {}, bigint>(
        abi, '0x7ba1a74d'
    ),
    xcp_profit_a: new Func<[], {}, bigint>(
        abi, '0x0b7b594b'
    ),
    virtual_price: new Func<[], {}, bigint>(
        abi, '0x0c46b72a'
    ),
    admin_actions_deadline: new Func<[], {}, bigint>(
        abi, '0x405e28f8'
    ),
}

export class Contract extends ContractBase {

    get_dy(i: bigint, j: bigint, dx: bigint): Promise<bigint> {
        return this.eth_call(functions.get_dy, [i, j, dx])
    }

    calc_token_amount(amounts: Array<bigint>): Promise<bigint> {
        return this.eth_call(functions.calc_token_amount, [amounts])
    }

    calc_withdraw_one_coin(token_amount: bigint, i: bigint): Promise<bigint> {
        return this.eth_call(functions.calc_withdraw_one_coin, [token_amount, i])
    }

    lp_price(): Promise<bigint> {
        return this.eth_call(functions.lp_price, [])
    }

    A(): Promise<bigint> {
        return this.eth_call(functions.A, [])
    }

    gamma(): Promise<bigint> {
        return this.eth_call(functions.gamma, [])
    }

    fee(): Promise<bigint> {
        return this.eth_call(functions.fee, [])
    }

    get_virtual_price(): Promise<bigint> {
        return this.eth_call(functions.get_virtual_price, [])
    }

    price_oracle(): Promise<bigint> {
        return this.eth_call(functions.price_oracle, [])
    }

    token(): Promise<string> {
        return this.eth_call(functions.token, [])
    }

    coins(arg0: bigint): Promise<string> {
        return this.eth_call(functions.coins, [arg0])
    }

    price_scale(): Promise<bigint> {
        return this.eth_call(functions.price_scale, [])
    }

    last_prices(): Promise<bigint> {
        return this.eth_call(functions.last_prices, [])
    }

    last_prices_timestamp(): Promise<bigint> {
        return this.eth_call(functions.last_prices_timestamp, [])
    }

    initial_A_gamma(): Promise<bigint> {
        return this.eth_call(functions.initial_A_gamma, [])
    }

    future_A_gamma(): Promise<bigint> {
        return this.eth_call(functions.future_A_gamma, [])
    }

    initial_A_gamma_time(): Promise<bigint> {
        return this.eth_call(functions.initial_A_gamma_time, [])
    }

    future_A_gamma_time(): Promise<bigint> {
        return this.eth_call(functions.future_A_gamma_time, [])
    }

    allowed_extra_profit(): Promise<bigint> {
        return this.eth_call(functions.allowed_extra_profit, [])
    }

    future_allowed_extra_profit(): Promise<bigint> {
        return this.eth_call(functions.future_allowed_extra_profit, [])
    }

    fee_gamma(): Promise<bigint> {
        return this.eth_call(functions.fee_gamma, [])
    }

    future_fee_gamma(): Promise<bigint> {
        return this.eth_call(functions.future_fee_gamma, [])
    }

    adjustment_step(): Promise<bigint> {
        return this.eth_call(functions.adjustment_step, [])
    }

    future_adjustment_step(): Promise<bigint> {
        return this.eth_call(functions.future_adjustment_step, [])
    }

    ma_half_time(): Promise<bigint> {
        return this.eth_call(functions.ma_half_time, [])
    }

    future_ma_half_time(): Promise<bigint> {
        return this.eth_call(functions.future_ma_half_time, [])
    }

    mid_fee(): Promise<bigint> {
        return this.eth_call(functions.mid_fee, [])
    }

    out_fee(): Promise<bigint> {
        return this.eth_call(functions.out_fee, [])
    }

    admin_fee(): Promise<bigint> {
        return this.eth_call(functions.admin_fee, [])
    }

    future_mid_fee(): Promise<bigint> {
        return this.eth_call(functions.future_mid_fee, [])
    }

    future_out_fee(): Promise<bigint> {
        return this.eth_call(functions.future_out_fee, [])
    }

    future_admin_fee(): Promise<bigint> {
        return this.eth_call(functions.future_admin_fee, [])
    }

    balances(arg0: bigint): Promise<bigint> {
        return this.eth_call(functions.balances, [arg0])
    }

    D(): Promise<bigint> {
        return this.eth_call(functions.D, [])
    }

    factory(): Promise<string> {
        return this.eth_call(functions.factory, [])
    }

    xcp_profit(): Promise<bigint> {
        return this.eth_call(functions.xcp_profit, [])
    }

    xcp_profit_a(): Promise<bigint> {
        return this.eth_call(functions.xcp_profit_a, [])
    }

    virtual_price(): Promise<bigint> {
        return this.eth_call(functions.virtual_price, [])
    }

    admin_actions_deadline(): Promise<bigint> {
        return this.eth_call(functions.admin_actions_deadline, [])
    }
}
