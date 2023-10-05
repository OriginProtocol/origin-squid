import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './curve-lp-token.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Transfer: new LogEvent<([sender: string, receiver: string, value: bigint] & {sender: string, receiver: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    TokenExchange: new LogEvent<([buyer: string, sold_id: bigint, tokens_sold: bigint, bought_id: bigint, tokens_bought: bigint] & {buyer: string, sold_id: bigint, tokens_sold: bigint, bought_id: bigint, tokens_bought: bigint})>(
        abi, '0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140'
    ),
    AddLiquidity: new LogEvent<([provider: string, token_amounts: Array<bigint>, fees: Array<bigint>, invariant: bigint, token_supply: bigint] & {provider: string, token_amounts: Array<bigint>, fees: Array<bigint>, invariant: bigint, token_supply: bigint})>(
        abi, '0x26f55a85081d24974e85c6c00045d0f0453991e95873f52bff0d21af4079a768'
    ),
    RemoveLiquidity: new LogEvent<([provider: string, token_amounts: Array<bigint>, fees: Array<bigint>, token_supply: bigint] & {provider: string, token_amounts: Array<bigint>, fees: Array<bigint>, token_supply: bigint})>(
        abi, '0x7c363854ccf79623411f8995b362bce5eddff18c927edc6f5dbbb5e05819a82c'
    ),
    RemoveLiquidityOne: new LogEvent<([provider: string, token_amount: bigint, coin_amount: bigint, token_supply: bigint] & {provider: string, token_amount: bigint, coin_amount: bigint, token_supply: bigint})>(
        abi, '0x5ad056f2e28a8cec232015406b843668c1e36cda598127ec3b8c59b8c72773a0'
    ),
    RemoveLiquidityImbalance: new LogEvent<([provider: string, token_amounts: Array<bigint>, fees: Array<bigint>, invariant: bigint, token_supply: bigint] & {provider: string, token_amounts: Array<bigint>, fees: Array<bigint>, invariant: bigint, token_supply: bigint})>(
        abi, '0x2b5508378d7e19e0d5fa338419034731416c4f5b219a10379956f764317fd47e'
    ),
    RampA: new LogEvent<([old_A: bigint, new_A: bigint, initial_time: bigint, future_time: bigint] & {old_A: bigint, new_A: bigint, initial_time: bigint, future_time: bigint})>(
        abi, '0xa2b71ec6df949300b59aab36b55e189697b750119dd349fcfa8c0f779e83c254'
    ),
    StopRampA: new LogEvent<([A: bigint, t: bigint] & {A: bigint, t: bigint})>(
        abi, '0x46e22fb3709ad289f62ce63d469248536dbc78d82b84a3d7e74ad606dc201938'
    ),
    CommitNewFee: new LogEvent<([new_fee: bigint] & {new_fee: bigint})>(
        abi, '0x878eb36b3f197f05821c06953d9bc8f14b332a227b1e26df06a4215bbfe5d73f'
    ),
    ApplyNewFee: new LogEvent<([fee: bigint] & {fee: bigint})>(
        abi, '0xa8715770654f54603947addf38c689adbd7182e21673b28bcf306a957aaba215'
    ),
}

export const functions = {
    initialize: new Func<[_name: string, _symbol: string, _coins: Array<string>, _rate_multipliers: Array<bigint>, _A: bigint, _fee: bigint], {_name: string, _symbol: string, _coins: Array<string>, _rate_multipliers: Array<bigint>, _A: bigint, _fee: bigint}, []>(
        abi, '0xa461b3c8'
    ),
    decimals: new Func<[], {}, bigint>(
        abi, '0x313ce567'
    ),
    transfer: new Func<[_to: string, _value: bigint], {_to: string, _value: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[_from: string, _to: string, _value: bigint], {_from: string, _to: string, _value: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
    approve: new Func<[_spender: string, _value: bigint], {_spender: string, _value: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    permit: new Func<[_owner: string, _spender: string, _value: bigint, _deadline: bigint, _v: number, _r: string, _s: string], {_owner: string, _spender: string, _value: bigint, _deadline: bigint, _v: number, _r: string, _s: string}, boolean>(
        abi, '0xd505accf'
    ),
    last_price: new Func<[], {}, bigint>(
        abi, '0xfde625e6'
    ),
    ema_price: new Func<[], {}, bigint>(
        abi, '0xc24c7c29'
    ),
    get_balances: new Func<[], {}, Array<bigint>>(
        abi, '0x14f05979'
    ),
    admin_fee: new Func<[], {}, bigint>(
        abi, '0xfee3f7f9'
    ),
    A: new Func<[], {}, bigint>(
        abi, '0xf446c1d0'
    ),
    A_precise: new Func<[], {}, bigint>(
        abi, '0x76a2f0f0'
    ),
    get_p: new Func<[], {}, bigint>(
        abi, '0xf2388acb'
    ),
    price_oracle: new Func<[], {}, bigint>(
        abi, '0x86fc88d3'
    ),
    get_virtual_price: new Func<[], {}, bigint>(
        abi, '0xbb7b8b80'
    ),
    calc_token_amount: new Func<[_amounts: Array<bigint>, _is_deposit: boolean], {_amounts: Array<bigint>, _is_deposit: boolean}, bigint>(
        abi, '0xed8e84f3'
    ),
    'add_liquidity(uint256[2],uint256)': new Func<[_amounts: Array<bigint>, _min_mint_amount: bigint], {_amounts: Array<bigint>, _min_mint_amount: bigint}, bigint>(
        abi, '0x0b4c7e4d'
    ),
    'add_liquidity(uint256[2],uint256,address)': new Func<[_amounts: Array<bigint>, _min_mint_amount: bigint, _receiver: string], {_amounts: Array<bigint>, _min_mint_amount: bigint, _receiver: string}, bigint>(
        abi, '0x0c3e4b54'
    ),
    get_dy: new Func<[i: bigint, j: bigint, dx: bigint], {i: bigint, j: bigint, dx: bigint}, bigint>(
        abi, '0x5e0d443f'
    ),
    'exchange(int128,int128,uint256,uint256)': new Func<[i: bigint, j: bigint, _dx: bigint, _min_dy: bigint], {i: bigint, j: bigint, _dx: bigint, _min_dy: bigint}, bigint>(
        abi, '0x3df02124'
    ),
    'exchange(int128,int128,uint256,uint256,address)': new Func<[i: bigint, j: bigint, _dx: bigint, _min_dy: bigint, _receiver: string], {i: bigint, j: bigint, _dx: bigint, _min_dy: bigint, _receiver: string}, bigint>(
        abi, '0xddc1f59d'
    ),
    'remove_liquidity(uint256,uint256[2])': new Func<[_burn_amount: bigint, _min_amounts: Array<bigint>], {_burn_amount: bigint, _min_amounts: Array<bigint>}, Array<bigint>>(
        abi, '0x5b36389c'
    ),
    'remove_liquidity(uint256,uint256[2],address)': new Func<[_burn_amount: bigint, _min_amounts: Array<bigint>, _receiver: string], {_burn_amount: bigint, _min_amounts: Array<bigint>, _receiver: string}, Array<bigint>>(
        abi, '0x3eb1719f'
    ),
    'remove_liquidity_imbalance(uint256[2],uint256)': new Func<[_amounts: Array<bigint>, _max_burn_amount: bigint], {_amounts: Array<bigint>, _max_burn_amount: bigint}, bigint>(
        abi, '0xe3103273'
    ),
    'remove_liquidity_imbalance(uint256[2],uint256,address)': new Func<[_amounts: Array<bigint>, _max_burn_amount: bigint, _receiver: string], {_amounts: Array<bigint>, _max_burn_amount: bigint, _receiver: string}, bigint>(
        abi, '0x52d2cfdd'
    ),
    calc_withdraw_one_coin: new Func<[_burn_amount: bigint, i: bigint], {_burn_amount: bigint, i: bigint}, bigint>(
        abi, '0xcc2b27d7'
    ),
    'remove_liquidity_one_coin(uint256,int128,uint256)': new Func<[_burn_amount: bigint, i: bigint, _min_received: bigint], {_burn_amount: bigint, i: bigint, _min_received: bigint}, bigint>(
        abi, '0x1a4d01d2'
    ),
    'remove_liquidity_one_coin(uint256,int128,uint256,address)': new Func<[_burn_amount: bigint, i: bigint, _min_received: bigint, _receiver: string], {_burn_amount: bigint, i: bigint, _min_received: bigint, _receiver: string}, bigint>(
        abi, '0x081579a5'
    ),
    ramp_A: new Func<[_future_A: bigint, _future_time: bigint], {_future_A: bigint, _future_time: bigint}, []>(
        abi, '0x3c157e64'
    ),
    stop_ramp_A: new Func<[], {}, []>(
        abi, '0x551a6588'
    ),
    admin_balances: new Func<[i: bigint], {i: bigint}, bigint>(
        abi, '0xe2e7d264'
    ),
    withdraw_admin_fees: new Func<[], {}, []>(
        abi, '0x30c54085'
    ),
    commit_new_fee: new Func<[_new_fee: bigint], {_new_fee: bigint}, []>(
        abi, '0xa48eac9d'
    ),
    apply_new_fee: new Func<[], {}, []>(
        abi, '0x4f12fe97'
    ),
    set_ma_exp_time: new Func<[_ma_exp_time: bigint], {_ma_exp_time: bigint}, []>(
        abi, '0x7f3e17cb'
    ),
    version: new Func<[], {}, string>(
        abi, '0x54fd4d50'
    ),
    coins: new Func<[arg0: bigint], {arg0: bigint}, string>(
        abi, '0xc6610657'
    ),
    balances: new Func<[arg0: bigint], {arg0: bigint}, bigint>(
        abi, '0x4903b0d1'
    ),
    fee: new Func<[], {}, bigint>(
        abi, '0xddca3f43'
    ),
    future_fee: new Func<[], {}, bigint>(
        abi, '0x58680d0b'
    ),
    admin_action_deadline: new Func<[], {}, bigint>(
        abi, '0xe66f43f5'
    ),
    initial_A: new Func<[], {}, bigint>(
        abi, '0x5409491a'
    ),
    future_A: new Func<[], {}, bigint>(
        abi, '0xb4b577ad'
    ),
    initial_A_time: new Func<[], {}, bigint>(
        abi, '0x2081066c'
    ),
    future_A_time: new Func<[], {}, bigint>(
        abi, '0x14052288'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    balanceOf: new Func<[arg0: string], {arg0: string}, bigint>(
        abi, '0x70a08231'
    ),
    allowance: new Func<[arg0: string, arg1: string], {arg0: string, arg1: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    nonces: new Func<[arg0: string], {arg0: string}, bigint>(
        abi, '0x7ecebe00'
    ),
    ma_exp_time: new Func<[], {}, bigint>(
        abi, '0x1be913a5'
    ),
    ma_last_time: new Func<[], {}, bigint>(
        abi, '0x1ddc3b01'
    ),
}

export class Contract extends ContractBase {

    decimals(): Promise<bigint> {
        return this.eth_call(functions.decimals, [])
    }

    last_price(): Promise<bigint> {
        return this.eth_call(functions.last_price, [])
    }

    ema_price(): Promise<bigint> {
        return this.eth_call(functions.ema_price, [])
    }

    get_balances(): Promise<Array<bigint>> {
        return this.eth_call(functions.get_balances, [])
    }

    admin_fee(): Promise<bigint> {
        return this.eth_call(functions.admin_fee, [])
    }

    A(): Promise<bigint> {
        return this.eth_call(functions.A, [])
    }

    A_precise(): Promise<bigint> {
        return this.eth_call(functions.A_precise, [])
    }

    get_p(): Promise<bigint> {
        return this.eth_call(functions.get_p, [])
    }

    price_oracle(): Promise<bigint> {
        return this.eth_call(functions.price_oracle, [])
    }

    get_virtual_price(): Promise<bigint> {
        return this.eth_call(functions.get_virtual_price, [])
    }

    calc_token_amount(_amounts: Array<bigint>, _is_deposit: boolean): Promise<bigint> {
        return this.eth_call(functions.calc_token_amount, [_amounts, _is_deposit])
    }

    get_dy(i: bigint, j: bigint, dx: bigint): Promise<bigint> {
        return this.eth_call(functions.get_dy, [i, j, dx])
    }

    calc_withdraw_one_coin(_burn_amount: bigint, i: bigint): Promise<bigint> {
        return this.eth_call(functions.calc_withdraw_one_coin, [_burn_amount, i])
    }

    admin_balances(i: bigint): Promise<bigint> {
        return this.eth_call(functions.admin_balances, [i])
    }

    version(): Promise<string> {
        return this.eth_call(functions.version, [])
    }

    coins(arg0: bigint): Promise<string> {
        return this.eth_call(functions.coins, [arg0])
    }

    balances(arg0: bigint): Promise<bigint> {
        return this.eth_call(functions.balances, [arg0])
    }

    fee(): Promise<bigint> {
        return this.eth_call(functions.fee, [])
    }

    future_fee(): Promise<bigint> {
        return this.eth_call(functions.future_fee, [])
    }

    admin_action_deadline(): Promise<bigint> {
        return this.eth_call(functions.admin_action_deadline, [])
    }

    initial_A(): Promise<bigint> {
        return this.eth_call(functions.initial_A, [])
    }

    future_A(): Promise<bigint> {
        return this.eth_call(functions.future_A, [])
    }

    initial_A_time(): Promise<bigint> {
        return this.eth_call(functions.initial_A_time, [])
    }

    future_A_time(): Promise<bigint> {
        return this.eth_call(functions.future_A_time, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    balanceOf(arg0: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [arg0])
    }

    allowance(arg0: string, arg1: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [arg0, arg1])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    nonces(arg0: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [arg0])
    }

    ma_exp_time(): Promise<bigint> {
        return this.eth_call(functions.ma_exp_time, [])
    }

    ma_last_time(): Promise<bigint> {
        return this.eth_call(functions.ma_last_time, [])
    }
}
