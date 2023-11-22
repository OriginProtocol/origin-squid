import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './aave-token.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    BalanceTransfer: new LogEvent<([from: string, to: string, value: bigint, index: bigint] & {from: string, to: string, value: bigint, index: bigint})>(
        abi, '0x4beccb90f994c31aced7a23b5611020728a23d8ec5cddd1a3e9d97b96fda8666'
    ),
    Burn: new LogEvent<([from: string, target: string, value: bigint, index: bigint] & {from: string, target: string, value: bigint, index: bigint})>(
        abi, '0x5d624aa9c148153ab3446c1b154f660ee7701e549fe9b62dab7171b1c80e6fa2'
    ),
    Initialized: new LogEvent<([underlyingAsset: string, pool: string, treasury: string, incentivesController: string, aTokenDecimals: number, aTokenName: string, aTokenSymbol: string, params: string] & {underlyingAsset: string, pool: string, treasury: string, incentivesController: string, aTokenDecimals: number, aTokenName: string, aTokenSymbol: string, params: string})>(
        abi, '0xb19e051f8af41150ccccb3fc2c2d8d15f4a4cf434f32a559ba75fe73d6eea20b'
    ),
    Mint: new LogEvent<([from: string, value: bigint, index: bigint] & {from: string, value: bigint, index: bigint})>(
        abi, '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f'
    ),
    TokensRescued: new LogEvent<([tokenRescued: string, receiver: string, amountRescued: bigint] & {tokenRescued: string, receiver: string, amountRescued: bigint})>(
        abi, '0x77023e19c7343ad491fd706c36335ca0e738340a91f29b1fd81e2673d44896c4'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    ATOKEN_REVISION: new Func<[], {}, bigint>(
        abi, '0x0bd7ad3b'
    ),
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    EIP712_REVISION: new Func<[], {}, string>(
        abi, '0x78160376'
    ),
    PERMIT_TYPEHASH: new Func<[], {}, string>(
        abi, '0x30adf81f'
    ),
    POOL: new Func<[], {}, string>(
        abi, '0x7535d246'
    ),
    RESERVE_TREASURY_ADDRESS: new Func<[], {}, string>(
        abi, '0xae167335'
    ),
    UINT_MAX_VALUE: new Func<[], {}, bigint>(
        abi, '0xd0fc81d2'
    ),
    UNDERLYING_ASSET_ADDRESS: new Func<[], {}, string>(
        abi, '0xb16a19de'
    ),
    _nonces: new Func<[_: string], {}, bigint>(
        abi, '0xb9844d8d'
    ),
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[user: string], {user: string}, bigint>(
        abi, '0x70a08231'
    ),
    burn: new Func<[user: string, receiverOfUnderlying: string, amount: bigint, index: bigint], {user: string, receiverOfUnderlying: string, amount: bigint, index: bigint}, []>(
        abi, '0xd7020d0a'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    decreaseAllowance: new Func<[spender: string, subtractedValue: bigint], {spender: string, subtractedValue: bigint}, boolean>(
        abi, '0xa457c2d7'
    ),
    getIncentivesController: new Func<[], {}, string>(
        abi, '0x75d26413'
    ),
    getScaledUserBalanceAndSupply: new Func<[user: string], {user: string}, [_: bigint, _: bigint]>(
        abi, '0x0afbcdc9'
    ),
    increaseAllowance: new Func<[spender: string, addedValue: bigint], {spender: string, addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    initialize: new Func<[underlyingAssetDecimals: number, tokenName: string, tokenSymbol: string], {underlyingAssetDecimals: number, tokenName: string, tokenSymbol: string}, []>(
        abi, '0x3118724e'
    ),
    mint: new Func<[user: string, amount: bigint, index: bigint], {user: string, amount: bigint, index: bigint}, boolean>(
        abi, '0x156e29f6'
    ),
    mintToTreasury: new Func<[amount: bigint, index: bigint], {amount: bigint, index: bigint}, []>(
        abi, '0x7df5bd3b'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    permit: new Func<[owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string], {owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0xd505accf'
    ),
    rescueTokens: new Func<[token: string, to: string, amount: bigint], {token: string, to: string, amount: bigint}, []>(
        abi, '0xcea9d26f'
    ),
    scaledBalanceOf: new Func<[user: string], {user: string}, bigint>(
        abi, '0x1da24f3e'
    ),
    scaledTotalSupply: new Func<[], {}, bigint>(
        abi, '0xb1bf962d'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[recipient: string, amount: bigint], {recipient: string, amount: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[sender: string, recipient: string, amount: bigint], {sender: string, recipient: string, amount: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
    transferOnLiquidation: new Func<[from: string, to: string, value: bigint], {from: string, to: string, value: bigint}, []>(
        abi, '0xf866c319'
    ),
    transferUnderlyingTo: new Func<[target: string, amount: bigint], {target: string, amount: bigint}, bigint>(
        abi, '0x4efecaa5'
    ),
}

export class Contract extends ContractBase {

    ATOKEN_REVISION(): Promise<bigint> {
        return this.eth_call(functions.ATOKEN_REVISION, [])
    }

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    EIP712_REVISION(): Promise<string> {
        return this.eth_call(functions.EIP712_REVISION, [])
    }

    PERMIT_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.PERMIT_TYPEHASH, [])
    }

    POOL(): Promise<string> {
        return this.eth_call(functions.POOL, [])
    }

    RESERVE_TREASURY_ADDRESS(): Promise<string> {
        return this.eth_call(functions.RESERVE_TREASURY_ADDRESS, [])
    }

    UINT_MAX_VALUE(): Promise<bigint> {
        return this.eth_call(functions.UINT_MAX_VALUE, [])
    }

    UNDERLYING_ASSET_ADDRESS(): Promise<string> {
        return this.eth_call(functions.UNDERLYING_ASSET_ADDRESS, [])
    }

    _nonces(arg0: string): Promise<bigint> {
        return this.eth_call(functions._nonces, [arg0])
    }

    allowance(owner: string, spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    balanceOf(user: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [user])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    getIncentivesController(): Promise<string> {
        return this.eth_call(functions.getIncentivesController, [])
    }

    getScaledUserBalanceAndSupply(user: string): Promise<[_: bigint, _: bigint]> {
        return this.eth_call(functions.getScaledUserBalanceAndSupply, [user])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    scaledBalanceOf(user: string): Promise<bigint> {
        return this.eth_call(functions.scaledBalanceOf, [user])
    }

    scaledTotalSupply(): Promise<bigint> {
        return this.eth_call(functions.scaledTotalSupply, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
