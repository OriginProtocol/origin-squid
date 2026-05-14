import { ContractBase } from '../abi.support.js'
import { authenticator, domainSeparator, filledAmount, getStorageAt, preSignature, simulateDelegatecall, simulateDelegatecallInternal, vault, vaultRelayer } from './functions.js'
import type { FilledAmountParams, GetStorageAtParams, PreSignatureParams, SimulateDelegatecallInternalParams, SimulateDelegatecallParams } from './functions.js'

export class Contract extends ContractBase {
    authenticator() {
        return this.eth_call(authenticator, {})
    }

    domainSeparator() {
        return this.eth_call(domainSeparator, {})
    }

    filledAmount(_0: FilledAmountParams["_0"]) {
        return this.eth_call(filledAmount, {_0})
    }

    getStorageAt(offset: GetStorageAtParams["offset"], length: GetStorageAtParams["length"]) {
        return this.eth_call(getStorageAt, {offset, length})
    }

    preSignature(_0: PreSignatureParams["_0"]) {
        return this.eth_call(preSignature, {_0})
    }

    simulateDelegatecall(targetContract: SimulateDelegatecallParams["targetContract"], calldataPayload: SimulateDelegatecallParams["calldataPayload"]) {
        return this.eth_call(simulateDelegatecall, {targetContract, calldataPayload})
    }

    simulateDelegatecallInternal(targetContract: SimulateDelegatecallInternalParams["targetContract"], calldataPayload: SimulateDelegatecallInternalParams["calldataPayload"]) {
        return this.eth_call(simulateDelegatecallInternal, {targetContract, calldataPayload})
    }

    vault() {
        return this.eth_call(vault, {})
    }

    vaultRelayer() {
        return this.eth_call(vaultRelayer, {})
    }
}
