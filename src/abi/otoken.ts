import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './otoken.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AccountRebasingDisabled: new LogEvent<([account: string] & {account: string})>(
        abi, '0x201ace89ad3f5ab7428b91989f6a50d1998791c7b94a0fa812fd64a57687165e'
    ),
    AccountRebasingEnabled: new LogEvent<([account: string] & {account: string})>(
        abi, '0x19a249fa2050bac8314ac10e3ad420bd9825574bf750f58810c3c7adfc7b1c6f'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    GovernorshipTransferred: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a'
    ),
    PendingGovernorshipTransfer: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d'
    ),
    TotalSupplyUpdatedHighres: new LogEvent<([totalSupply: bigint, rebasingCredits: bigint, rebasingCreditsPerToken: bigint] & {totalSupply: bigint, rebasingCredits: bigint, rebasingCreditsPerToken: bigint})>(
        abi, '0x41645eb819d3011b13f97696a8109d14bfcddfaca7d063ec0564d62a3e257235'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    _totalSupply: new Func<[], {}, bigint>(
        abi, '0x3eaaf86b'
    ),
    allowance: new Func<[_owner: string, _spender: string], {_owner: string, _spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[_spender: string, _value: bigint], {_spender: string, _value: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[_account: string], {_account: string}, bigint>(
        abi, '0x70a08231'
    ),
    burn: new Func<[account: string, amount: bigint], {account: string, amount: bigint}, []>(
        abi, '0x9dc29fac'
    ),
    changeSupply: new Func<[_newTotalSupply: bigint], {_newTotalSupply: bigint}, []>(
        abi, '0x39a7919f'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
    ),
    creditsBalanceOf: new Func<[_account: string], {_account: string}, [_: bigint, _: bigint]>(
        abi, '0xf9854bfc'
    ),
    creditsBalanceOfHighres: new Func<[_account: string], {_account: string}, [_: bigint, _: bigint, _: boolean]>(
        abi, '0xe5c4fffe'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    decreaseAllowance: new Func<[_spender: string, _subtractedValue: bigint], {_spender: string, _subtractedValue: bigint}, boolean>(
        abi, '0xa457c2d7'
    ),
    governanceRebaseOptIn: new Func<[_account: string], {_account: string}, []>(
        abi, '0xbaa9c9db'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    increaseAllowance: new Func<[_spender: string, _addedValue: bigint], {_spender: string, _addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    initialize: new Func<[_nameArg: string, _symbolArg: string, _vaultAddress: string, _initialCreditsPerToken: bigint], {_nameArg: string, _symbolArg: string, _vaultAddress: string, _initialCreditsPerToken: bigint}, []>(
        abi, '0xf542033f'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
    ),
    isUpgraded: new Func<[_: string], {}, bigint>(
        abi, '0x95ef84b9'
    ),
    mint: new Func<[_account: string, _amount: bigint], {_account: string, _amount: bigint}, []>(
        abi, '0x40c10f19'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonRebasingCreditsPerToken: new Func<[_: string], {}, bigint>(
        abi, '0x609350cd'
    ),
    nonRebasingSupply: new Func<[], {}, bigint>(
        abi, '0xe696393a'
    ),
    rebaseOptIn: new Func<[], {}, []>(
        abi, '0xf51b0fd4'
    ),
    rebaseOptOut: new Func<[], {}, []>(
        abi, '0xc2376dff'
    ),
    rebaseState: new Func<[_: string], {}, number>(
        abi, '0x456ee286'
    ),
    rebasingCredits: new Func<[], {}, bigint>(
        abi, '0x077f22b7'
    ),
    rebasingCreditsHighres: new Func<[], {}, bigint>(
        abi, '0x7d0d66ff'
    ),
    rebasingCreditsPerToken: new Func<[], {}, bigint>(
        abi, '0x6691cb3d'
    ),
    rebasingCreditsPerTokenHighres: new Func<[], {}, bigint>(
        abi, '0x7a46a9c5'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[_to: string, _value: bigint], {_to: string, _value: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[_from: string, _to: string, _value: bigint], {_from: string, _to: string, _value: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    vaultAddress: new Func<[], {}, string>(
        abi, '0x430bf08a'
    ),
}

export class Contract extends ContractBase {

    _totalSupply(): Promise<bigint> {
        return this.eth_call(functions._totalSupply, [])
    }

    allowance(_owner: string, _spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [_owner, _spender])
    }

    balanceOf(_account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [_account])
    }

    creditsBalanceOf(_account: string): Promise<[_: bigint, _: bigint]> {
        return this.eth_call(functions.creditsBalanceOf, [_account])
    }

    creditsBalanceOfHighres(_account: string): Promise<[_: bigint, _: bigint, _: boolean]> {
        return this.eth_call(functions.creditsBalanceOfHighres, [_account])
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

    isUpgraded(arg0: string): Promise<bigint> {
        return this.eth_call(functions.isUpgraded, [arg0])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    nonRebasingCreditsPerToken(arg0: string): Promise<bigint> {
        return this.eth_call(functions.nonRebasingCreditsPerToken, [arg0])
    }

    nonRebasingSupply(): Promise<bigint> {
        return this.eth_call(functions.nonRebasingSupply, [])
    }

    rebaseState(arg0: string): Promise<number> {
        return this.eth_call(functions.rebaseState, [arg0])
    }

    rebasingCredits(): Promise<bigint> {
        return this.eth_call(functions.rebasingCredits, [])
    }

    rebasingCreditsHighres(): Promise<bigint> {
        return this.eth_call(functions.rebasingCreditsHighres, [])
    }

    rebasingCreditsPerToken(): Promise<bigint> {
        return this.eth_call(functions.rebasingCreditsPerToken, [])
    }

    rebasingCreditsPerTokenHighres(): Promise<bigint> {
        return this.eth_call(functions.rebasingCreditsPerTokenHighres, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    vaultAddress(): Promise<string> {
        return this.eth_call(functions.vaultAddress, [])
    }
}
