import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './sfrx-eth.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, amount: bigint] & {owner: string, spender: string, amount: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Deposit: new LogEvent<([caller: string, owner: string, assets: bigint, shares: bigint] & {caller: string, owner: string, assets: bigint, shares: bigint})>(
        abi, '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7'
    ),
    NewRewardsCycle: new LogEvent<([cycleEnd: number, rewardAmount: bigint] & {cycleEnd: number, rewardAmount: bigint})>(
        abi, '0x2fa39aac60d1c94cda4ab0e86ae9c0ffab5b926e5b827a4ccba1d9b5b2ef596e'
    ),
    Transfer: new LogEvent<([from: string, to: string, amount: bigint] & {from: string, to: string, amount: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Withdraw: new LogEvent<([caller: string, receiver: string, owner: string, assets: bigint, shares: bigint] & {caller: string, receiver: string, owner: string, assets: bigint, shares: bigint})>(
        abi, '0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db'
    ),
}

export const functions = {
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    allowance: new Func<[_: string, _: string], {}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    asset: new Func<[], {}, string>(
        abi, '0x38d52e0f'
    ),
    balanceOf: new Func<[_: string], {}, bigint>(
        abi, '0x70a08231'
    ),
    convertToAssets: new Func<[shares: bigint], {shares: bigint}, bigint>(
        abi, '0x07a2d13a'
    ),
    convertToShares: new Func<[assets: bigint], {assets: bigint}, bigint>(
        abi, '0xc6e6f592'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    deposit: new Func<[assets: bigint, receiver: string], {assets: bigint, receiver: string}, bigint>(
        abi, '0x6e553f65'
    ),
    depositWithSignature: new Func<[assets: bigint, receiver: string, deadline: bigint, approveMax: boolean, v: number, r: string, s: string], {assets: bigint, receiver: string, deadline: bigint, approveMax: boolean, v: number, r: string, s: string}, bigint>(
        abi, '0x75e077c3'
    ),
    lastRewardAmount: new Func<[], {}, bigint>(
        abi, '0xbafedcaa'
    ),
    lastSync: new Func<[], {}, number>(
        abi, '0x6917516b'
    ),
    maxDeposit: new Func<[_: string], {}, bigint>(
        abi, '0x402d267d'
    ),
    maxMint: new Func<[_: string], {}, bigint>(
        abi, '0xc63d75b6'
    ),
    maxRedeem: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0xd905777e'
    ),
    maxWithdraw: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0xce96cb77'
    ),
    mint: new Func<[shares: bigint, receiver: string], {shares: bigint, receiver: string}, bigint>(
        abi, '0x94bf804d'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonces: new Func<[_: string], {}, bigint>(
        abi, '0x7ecebe00'
    ),
    permit: new Func<[owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string], {owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0xd505accf'
    ),
    previewDeposit: new Func<[assets: bigint], {assets: bigint}, bigint>(
        abi, '0xef8b30f7'
    ),
    previewMint: new Func<[shares: bigint], {shares: bigint}, bigint>(
        abi, '0xb3d7f6b9'
    ),
    previewRedeem: new Func<[shares: bigint], {shares: bigint}, bigint>(
        abi, '0x4cdad506'
    ),
    previewWithdraw: new Func<[assets: bigint], {assets: bigint}, bigint>(
        abi, '0x0a28a477'
    ),
    pricePerShare: new Func<[], {}, bigint>(
        abi, '0x99530b06'
    ),
    redeem: new Func<[shares: bigint, receiver: string, owner: string], {shares: bigint, receiver: string, owner: string}, bigint>(
        abi, '0xba087652'
    ),
    rewardsCycleEnd: new Func<[], {}, number>(
        abi, '0xe7ff69f1'
    ),
    rewardsCycleLength: new Func<[], {}, number>(
        abi, '0x6fcf5e5f'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    syncRewards: new Func<[], {}, []>(
        abi, '0x72c0c211'
    ),
    totalAssets: new Func<[], {}, bigint>(
        abi, '0x01e1d114'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[to: string, amount: bigint], {to: string, amount: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[from: string, to: string, amount: bigint], {from: string, to: string, amount: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
    withdraw: new Func<[assets: bigint, receiver: string, owner: string], {assets: bigint, receiver: string, owner: string}, bigint>(
        abi, '0xb460af94'
    ),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    allowance(arg0: string, arg1: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [arg0, arg1])
    }

    asset(): Promise<string> {
        return this.eth_call(functions.asset, [])
    }

    balanceOf(arg0: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [arg0])
    }

    convertToAssets(shares: bigint): Promise<bigint> {
        return this.eth_call(functions.convertToAssets, [shares])
    }

    convertToShares(assets: bigint): Promise<bigint> {
        return this.eth_call(functions.convertToShares, [assets])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    lastRewardAmount(): Promise<bigint> {
        return this.eth_call(functions.lastRewardAmount, [])
    }

    lastSync(): Promise<number> {
        return this.eth_call(functions.lastSync, [])
    }

    maxDeposit(arg0: string): Promise<bigint> {
        return this.eth_call(functions.maxDeposit, [arg0])
    }

    maxMint(arg0: string): Promise<bigint> {
        return this.eth_call(functions.maxMint, [arg0])
    }

    maxRedeem(owner: string): Promise<bigint> {
        return this.eth_call(functions.maxRedeem, [owner])
    }

    maxWithdraw(owner: string): Promise<bigint> {
        return this.eth_call(functions.maxWithdraw, [owner])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    nonces(arg0: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [arg0])
    }

    previewDeposit(assets: bigint): Promise<bigint> {
        return this.eth_call(functions.previewDeposit, [assets])
    }

    previewMint(shares: bigint): Promise<bigint> {
        return this.eth_call(functions.previewMint, [shares])
    }

    previewRedeem(shares: bigint): Promise<bigint> {
        return this.eth_call(functions.previewRedeem, [shares])
    }

    previewWithdraw(assets: bigint): Promise<bigint> {
        return this.eth_call(functions.previewWithdraw, [assets])
    }

    pricePerShare(): Promise<bigint> {
        return this.eth_call(functions.pricePerShare, [])
    }

    rewardsCycleEnd(): Promise<number> {
        return this.eth_call(functions.rewardsCycleEnd, [])
    }

    rewardsCycleLength(): Promise<number> {
        return this.eth_call(functions.rewardsCycleLength, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalAssets(): Promise<bigint> {
        return this.eth_call(functions.totalAssets, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
