import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './initializable-abstract-strategy.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Deposit: new LogEvent<([_asset: string, _pToken: string, _amount: bigint] & {_asset: string, _pToken: string, _amount: bigint})>(
        abi, '0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62'
    ),
    GovernorshipTransferred: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a'
    ),
    HarvesterAddressesUpdated: new LogEvent<([_oldHarvesterAddress: string, _newHarvesterAddress: string] & {_oldHarvesterAddress: string, _newHarvesterAddress: string})>(
        abi, '0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796'
    ),
    PTokenAdded: new LogEvent<([_asset: string, _pToken: string] & {_asset: string, _pToken: string})>(
        abi, '0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765'
    ),
    PTokenRemoved: new LogEvent<([_asset: string, _pToken: string] & {_asset: string, _pToken: string})>(
        abi, '0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c'
    ),
    PendingGovernorshipTransfer: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d'
    ),
    RewardTokenAddressesUpdated: new LogEvent<([_oldAddresses: Array<string>, _newAddresses: Array<string>] & {_oldAddresses: Array<string>, _newAddresses: Array<string>})>(
        abi, '0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc'
    ),
    RewardTokenCollected: new LogEvent<([recipient: string, rewardToken: string, amount: bigint] & {recipient: string, rewardToken: string, amount: bigint})>(
        abi, '0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353'
    ),
    Withdrawal: new LogEvent<([_asset: string, _pToken: string, _amount: bigint] & {_asset: string, _pToken: string, _amount: bigint})>(
        abi, '0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398'
    ),
}

export const functions = {
    assetToPToken: new Func<[_: string], {}, string>(
        abi, '0x0fc3b4c4'
    ),
    checkBalance: new Func<[_asset: string], {_asset: string}, bigint>(
        abi, '0x5f515226'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
    ),
    collectRewardTokens: new Func<[], {}, []>(
        abi, '0x5a063f63'
    ),
    deposit: new Func<[_asset: string, _amount: bigint], {_asset: string, _amount: bigint}, []>(
        abi, '0x47e7ef24'
    ),
    depositAll: new Func<[], {}, []>(
        abi, '0xde5f6268'
    ),
    getRewardTokenAddresses: new Func<[], {}, Array<string>>(
        abi, '0xf6ca71b0'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    harvesterAddress: new Func<[], {}, string>(
        abi, '0x67c7066c'
    ),
    initialize: new Func<[_rewardTokenAddresses: Array<string>, _assets: Array<string>, _pTokens: Array<string>], {_rewardTokenAddresses: Array<string>, _assets: Array<string>, _pTokens: Array<string>}, []>(
        abi, '0x435356d1'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
    ),
    platformAddress: new Func<[], {}, string>(
        abi, '0xdbe55e56'
    ),
    removePToken: new Func<[_assetIndex: bigint], {_assetIndex: bigint}, []>(
        abi, '0x9136616a'
    ),
    rewardTokenAddresses: new Func<[_: bigint], {}, string>(
        abi, '0x7b2d9b2c'
    ),
    safeApproveAllTokens: new Func<[], {}, []>(
        abi, '0xad1728cb'
    ),
    setHarvesterAddress: new Func<[_harvesterAddress: string], {_harvesterAddress: string}, []>(
        abi, '0xc2e1e3f4'
    ),
    setPTokenAddress: new Func<[_asset: string, _pToken: string], {_asset: string, _pToken: string}, []>(
        abi, '0x0ed57b3a'
    ),
    setRewardTokenAddresses: new Func<[_rewardTokenAddresses: Array<string>], {_rewardTokenAddresses: Array<string>}, []>(
        abi, '0x96d538bb'
    ),
    supportsAsset: new Func<[_asset: string], {_asset: string}, boolean>(
        abi, '0xaa388af6'
    ),
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    transferToken: new Func<[_asset: string, _amount: bigint], {_asset: string, _amount: bigint}, []>(
        abi, '0x1072cbea'
    ),
    vaultAddress: new Func<[], {}, string>(
        abi, '0x430bf08a'
    ),
    withdraw: new Func<[_recipient: string, _asset: string, _amount: bigint], {_recipient: string, _asset: string, _amount: bigint}, []>(
        abi, '0xd9caed12'
    ),
    withdrawAll: new Func<[], {}, []>(
        abi, '0x853828b6'
    ),
}

export class Contract extends ContractBase {

    assetToPToken(arg0: string): Promise<string> {
        return this.eth_call(functions.assetToPToken, [arg0])
    }

    checkBalance(_asset: string): Promise<bigint> {
        return this.eth_call(functions.checkBalance, [_asset])
    }

    getRewardTokenAddresses(): Promise<Array<string>> {
        return this.eth_call(functions.getRewardTokenAddresses, [])
    }

    governor(): Promise<string> {
        return this.eth_call(functions.governor, [])
    }

    harvesterAddress(): Promise<string> {
        return this.eth_call(functions.harvesterAddress, [])
    }

    isGovernor(): Promise<boolean> {
        return this.eth_call(functions.isGovernor, [])
    }

    platformAddress(): Promise<string> {
        return this.eth_call(functions.platformAddress, [])
    }

    rewardTokenAddresses(arg0: bigint): Promise<string> {
        return this.eth_call(functions.rewardTokenAddresses, [arg0])
    }

    supportsAsset(_asset: string): Promise<boolean> {
        return this.eth_call(functions.supportsAsset, [_asset])
    }

    vaultAddress(): Promise<string> {
        return this.eth_call(functions.vaultAddress, [])
    }
}
