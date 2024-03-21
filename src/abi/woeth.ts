import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './woeth.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Deposit: new LogEvent<([caller: string, owner: string, assets: bigint, shares: bigint] & {caller: string, owner: string, assets: bigint, shares: bigint})>(
        abi, '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7'
    ),
    GovernorshipTransferred: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a'
    ),
    PendingGovernorshipTransfer: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Withdraw: new LogEvent<([caller: string, receiver: string, owner: string, assets: bigint, shares: bigint] & {caller: string, receiver: string, owner: string, assets: bigint, shares: bigint})>(
        abi, '0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db'
    ),
}

export const functions = {
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: bigint], {spender: string, amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    asset: new Func<[], {}, string>(
        abi, '0x38d52e0f'
    ),
    balanceOf: new Func<[account: string], {account: string}, bigint>(
        abi, '0x70a08231'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
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
    decreaseAllowance: new Func<[spender: string, subtractedValue: bigint], {spender: string, subtractedValue: bigint}, boolean>(
        abi, '0xa457c2d7'
    ),
    deposit: new Func<[assets: bigint, receiver: string], {assets: bigint, receiver: string}, bigint>(
        abi, '0x6e553f65'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    increaseAllowance: new Func<[spender: string, addedValue: bigint], {spender: string, addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    initialize: new Func<[], {}, []>(
        abi, '0x8129fc1c'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
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
    redeem: new Func<[shares: bigint, receiver: string, owner: string], {shares: bigint, receiver: string, owner: string}, bigint>(
        abi, '0xba087652'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalAssets: new Func<[], {}, bigint>(
        abi, '0x01e1d114'
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
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    transferToken: new Func<[asset_: string, amount_: bigint], {asset_: string, amount_: bigint}, []>(
        abi, '0x1072cbea'
    ),
    withdraw: new Func<[assets: bigint, receiver: string, owner: string], {assets: bigint, receiver: string, owner: string}, bigint>(
        abi, '0xb460af94'
    ),
}

export class Contract extends ContractBase {

    allowance(owner: string, spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    asset(): Promise<string> {
        return this.eth_call(functions.asset, [])
    }

    balanceOf(account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [account])
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

    governor(): Promise<string> {
        return this.eth_call(functions.governor, [])
    }

    isGovernor(): Promise<boolean> {
        return this.eth_call(functions.isGovernor, [])
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
