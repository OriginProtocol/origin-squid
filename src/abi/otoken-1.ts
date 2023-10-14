import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './otoken-1.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const functions = {
    _totalSupply: new Func<[], {}, bigint>(
        abi, '0x3eaaf86b'
    ),
    creditsBalanceOfHighres: new Func<[_account: string], {_account: string}, [_: bigint, _: bigint, _: boolean]>(
        abi, '0xe5c4fffe'
    ),
    isUpgraded: new Func<[_: string], {}, bigint>(
        abi, '0x95ef84b9'
    ),
    nonRebasingCreditsPerToken: new Func<[_: string], {}, bigint>(
        abi, '0x609350cd'
    ),
    nonRebasingSupply: new Func<[], {}, bigint>(
        abi, '0xe696393a'
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
    upgradeAccounts: new Func<[accounts: Array<string>], {accounts: Array<string>}, []>(
        abi, '0xeec037f6'
    ),
    upgradeGlobals: new Func<[], {}, []>(
        abi, '0x51cfd6fe'
    ),
    vaultAddress: new Func<[], {}, string>(
        abi, '0x430bf08a'
    ),
}

export class Contract extends ContractBase {

    _totalSupply(): Promise<bigint> {
        return this.eth_call(functions._totalSupply, [])
    }

    creditsBalanceOfHighres(_account: string): Promise<[_: bigint, _: bigint, _: boolean]> {
        return this.eth_call(functions.creditsBalanceOfHighres, [_account])
    }

    isUpgraded(arg0: string): Promise<bigint> {
        return this.eth_call(functions.isUpgraded, [arg0])
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

    vaultAddress(): Promise<string> {
        return this.eth_call(functions.vaultAddress, [])
    }
}
