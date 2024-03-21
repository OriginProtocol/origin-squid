import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './ccip-router.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    MessageExecuted: new LogEvent<([messageId: string, sourceChainSelector: bigint, offRamp: string, calldataHash: string] & {messageId: string, sourceChainSelector: bigint, offRamp: string, calldataHash: string})>(
        abi, '0x9b877de93ea9895756e337442c657f95a34fc68e7eb988bdfa693d5be83016b6'
    ),
    OffRampAdded: new LogEvent<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>(
        abi, '0xa4bdf64ebdf3316320601a081916a75aa144bcef6c4beeb0e9fb1982cacc6b94'
    ),
    OffRampRemoved: new LogEvent<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>(
        abi, '0xa823809efda3ba66c873364eec120fa0923d9fabda73bc97dd5663341e2d9bcb'
    ),
    OnRampSet: new LogEvent<([destChainSelector: bigint, onRamp: string] & {destChainSelector: bigint, onRamp: string})>(
        abi, '0x1f7d0ec248b80e5c0dde0ee531c4fc8fdb6ce9a2b3d90f560c74acd6a7202f23'
    ),
    OwnershipTransferRequested: new LogEvent<([from: string, to: string] & {from: string, to: string})>(
        abi, '0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278'
    ),
    OwnershipTransferred: new LogEvent<([from: string, to: string] & {from: string, to: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
}

export const functions = {
    MAX_RET_BYTES: new Func<[], {}, number>(
        abi, '0x787350e3'
    ),
    acceptOwnership: new Func<[], {}, []>(
        abi, '0x79ba5097'
    ),
    applyRampUpdates: new Func<[onRampUpdates: Array<([destChainSelector: bigint, onRamp: string] & {destChainSelector: bigint, onRamp: string})>, offRampRemoves: Array<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>, offRampAdds: Array<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>], {onRampUpdates: Array<([destChainSelector: bigint, onRamp: string] & {destChainSelector: bigint, onRamp: string})>, offRampRemoves: Array<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>, offRampAdds: Array<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>}, []>(
        abi, '0xda5fcac8'
    ),
    ccipSend: new Func<[destinationChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})], {destinationChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})}, string>(
        abi, '0x96f4e9f9'
    ),
    getArmProxy: new Func<[], {}, string>(
        abi, '0x5246492f'
    ),
    getFee: new Func<[destinationChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})], {destinationChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})}, bigint>(
        abi, '0x20487ded'
    ),
    getOffRamps: new Func<[], {}, Array<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>>(
        abi, '0xa40e69c7'
    ),
    getOnRamp: new Func<[destChainSelector: bigint], {destChainSelector: bigint}, string>(
        abi, '0xa8d87a3b'
    ),
    getSupportedTokens: new Func<[chainSelector: bigint], {chainSelector: bigint}, Array<string>>(
        abi, '0xfbca3b74'
    ),
    getWrappedNative: new Func<[], {}, string>(
        abi, '0xe861e907'
    ),
    isChainSupported: new Func<[chainSelector: bigint], {chainSelector: bigint}, boolean>(
        abi, '0xa48a9058'
    ),
    isOffRamp: new Func<[sourceChainSelector: bigint, offRamp: string], {sourceChainSelector: bigint, offRamp: string}, boolean>(
        abi, '0x83826b2b'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    recoverTokens: new Func<[tokenAddress: string, to: string, amount: bigint], {tokenAddress: string, to: string, amount: bigint}, []>(
        abi, '0x5f3e849f'
    ),
    routeMessage: new Func<[message: ([messageId: string, sourceChainSelector: bigint, sender: string, data: string, destTokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>] & {messageId: string, sourceChainSelector: bigint, sender: string, data: string, destTokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>}), gasForCallExactCheck: number, gasLimit: bigint, receiver: string], {message: ([messageId: string, sourceChainSelector: bigint, sender: string, data: string, destTokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>] & {messageId: string, sourceChainSelector: bigint, sender: string, data: string, destTokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>}), gasForCallExactCheck: number, gasLimit: bigint, receiver: string}, ([success: boolean, retData: string, gasUsed: bigint] & {success: boolean, retData: string, gasUsed: bigint})>(
        abi, '0x3cf97983'
    ),
    setWrappedNative: new Func<[wrappedNative: string], {wrappedNative: string}, []>(
        abi, '0x52cb60ca'
    ),
    transferOwnership: new Func<[to: string], {to: string}, []>(
        abi, '0xf2fde38b'
    ),
    typeAndVersion: new Func<[], {}, string>(
        abi, '0x181f5a77'
    ),
}

export class Contract extends ContractBase {

    MAX_RET_BYTES(): Promise<number> {
        return this.eth_call(functions.MAX_RET_BYTES, [])
    }

    getArmProxy(): Promise<string> {
        return this.eth_call(functions.getArmProxy, [])
    }

    getFee(destinationChainSelector: bigint, message: ([receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string] & {receiver: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>, feeToken: string, extraArgs: string})): Promise<bigint> {
        return this.eth_call(functions.getFee, [destinationChainSelector, message])
    }

    getOffRamps(): Promise<Array<([sourceChainSelector: bigint, offRamp: string] & {sourceChainSelector: bigint, offRamp: string})>> {
        return this.eth_call(functions.getOffRamps, [])
    }

    getOnRamp(destChainSelector: bigint): Promise<string> {
        return this.eth_call(functions.getOnRamp, [destChainSelector])
    }

    getSupportedTokens(chainSelector: bigint): Promise<Array<string>> {
        return this.eth_call(functions.getSupportedTokens, [chainSelector])
    }

    getWrappedNative(): Promise<string> {
        return this.eth_call(functions.getWrappedNative, [])
    }

    isChainSupported(chainSelector: bigint): Promise<boolean> {
        return this.eth_call(functions.isChainSupported, [chainSelector])
    }

    isOffRamp(sourceChainSelector: bigint, offRamp: string): Promise<boolean> {
        return this.eth_call(functions.isOffRamp, [sourceChainSelector, offRamp])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    typeAndVersion(): Promise<string> {
        return this.eth_call(functions.typeAndVersion, [])
    }
}
