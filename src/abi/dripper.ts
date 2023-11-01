import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './dripper.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    GovernorshipTransferred: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a'
    ),
    PendingGovernorshipTransfer: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d'
    ),
}

export const functions = {
    availableFunds: new Func<[], {}, bigint>(
        abi, '0x46fcff4c'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
    ),
    collect: new Func<[], {}, []>(
        abi, '0xe5225381'
    ),
    collectAndRebase: new Func<[], {}, []>(
        abi, '0x73796297'
    ),
    drip: new Func<[], {}, ([lastCollect: bigint, perBlock: bigint] & {lastCollect: bigint, perBlock: bigint})>(
        abi, '0x9f678cca'
    ),
    dripDuration: new Func<[], {}, bigint>(
        abi, '0xbb7a632e'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
    ),
    setDripDuration: new Func<[_durationSeconds: bigint], {_durationSeconds: bigint}, []>(
        abi, '0x0493a0fa'
    ),
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    transferToken: new Func<[_asset: string, _amount: bigint], {_asset: string, _amount: bigint}, []>(
        abi, '0x1072cbea'
    ),
}

export class Contract extends ContractBase {

    availableFunds(): Promise<bigint> {
        return this.eth_call(functions.availableFunds, [])
    }

    drip(): Promise<([lastCollect: bigint, perBlock: bigint] & {lastCollect: bigint, perBlock: bigint})> {
        return this.eth_call(functions.drip, [])
    }

    dripDuration(): Promise<bigint> {
        return this.eth_call(functions.dripDuration, [])
    }

    governor(): Promise<string> {
        return this.eth_call(functions.governor, [])
    }

    isGovernor(): Promise<boolean> {
        return this.eth_call(functions.isGovernor, [])
    }
}
