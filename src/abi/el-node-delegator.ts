import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './el-node-delegator.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AssetDepositIntoStrategy: new LogEvent<([asset: string, strategy: string, depositAmount: bigint] & {asset: string, strategy: string, depositAmount: bigint})>(
        abi, '0x921663a414f798537c348d06b72aad477fa6e6837598798abdcbf700efdbb185'
    ),
    ETHDepositFromDepositPool: new LogEvent<([depositAmount: bigint] & {depositAmount: bigint})>(
        abi, '0x502f9a26014993a0661817f75b56d6298d587c7005e59a07cdf7a1c056010d6b'
    ),
    ETHRewardsReceived: new LogEvent<([amount: bigint] & {amount: bigint})>(
        abi, '0x8b78e0ef145517514989a7f25ed22aec3a9942c6cd71d6c37a53268bbc52a1fa'
    ),
    ETHStaked: new LogEvent<([valPubKey: string, amount: bigint] & {valPubKey: string, amount: bigint})>(
        abi, '0xa16ad5049bc6092f455ad47c45f18d9e3436db84fa5f1da8dcde4cb12296c03d'
    ),
    EigenPodCreated: new LogEvent<([eigenPod: string, podOwner: string] & {eigenPod: string, podOwner: string})>(
        abi, '0xcdc82cfed67d9b46d3a15dd3b48745fb894a354d554cb5da5fb8c440f85c108e'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
    UpdatedLRTConfig: new LogEvent<([lrtConfig: string] & {lrtConfig: string})>(
        abi, '0x9cf19cefd9aab739c33b95716ee3f3f921f219dc6d7aae25e1f9497b37889150'
    ),
}

export const functions = {
    createEigenPod: new Func<[], {}, []>(
        abi, '0x0b10b201'
    ),
    depositAssetIntoStrategy: new Func<[asset: string], {asset: string}, []>(
        abi, '0x4798c72b'
    ),
    eigenPod: new Func<[], {}, string>(
        abi, '0xa3aae136'
    ),
    getAssetBalance: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x5373433f'
    ),
    getAssetBalances: new Func<[], {}, ([assets: Array<string>, assetBalances: Array<bigint>] & {assets: Array<string>, assetBalances: Array<bigint>})>(
        abi, '0x308dade1'
    ),
    getETHEigenPodBalance: new Func<[], {}, bigint>(
        abi, '0x497edda0'
    ),
    initialize: new Func<[lrtConfigAddr: string], {lrtConfigAddr: string}, []>(
        abi, '0xc4d66de8'
    ),
    lrtConfig: new Func<[], {}, string>(
        abi, '0xf1650a46'
    ),
    maxApproveToEigenStrategyManager: new Func<[asset: string], {asset: string}, []>(
        abi, '0x6ffb1ba4'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    sendETHFromDepositPoolToNDC: new Func<[], {}, []>(
        abi, '0x5e683007'
    ),
    stakeEth: new Func<[pubkey: string, signature: string, depositDataRoot: string], {pubkey: string, signature: string, depositDataRoot: string}, []>(
        abi, '0x9ebf4ab1'
    ),
    stakedButNotVerifiedEth: new Func<[], {}, bigint>(
        abi, '0x397bfbac'
    ),
    transferBackToLRTDepositPool: new Func<[asset: string, amount: bigint], {asset: string, amount: bigint}, []>(
        abi, '0xa33cf7ea'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    updateLRTConfig: new Func<[lrtConfigAddr: string], {lrtConfigAddr: string}, []>(
        abi, '0x15864e0a'
    ),
    verifyWithdrawalCredentials: new Func<[oracleBlockNumber: bigint, validatorIndex: number, proofs: ([validatorFieldsProof: string, validatorBalanceProof: string, balanceRoot: string] & {validatorFieldsProof: string, validatorBalanceProof: string, balanceRoot: string}), validatorFields: Array<string>], {oracleBlockNumber: bigint, validatorIndex: number, proofs: ([validatorFieldsProof: string, validatorBalanceProof: string, balanceRoot: string] & {validatorFieldsProof: string, validatorBalanceProof: string, balanceRoot: string}), validatorFields: Array<string>}, []>(
        abi, '0x483f3453'
    ),
}

export class Contract extends ContractBase {

    eigenPod(): Promise<string> {
        return this.eth_call(functions.eigenPod, [])
    }

    getAssetBalance(asset: string): Promise<bigint> {
        return this.eth_call(functions.getAssetBalance, [asset])
    }

    getAssetBalances(): Promise<([assets: Array<string>, assetBalances: Array<bigint>] & {assets: Array<string>, assetBalances: Array<bigint>})> {
        return this.eth_call(functions.getAssetBalances, [])
    }

    getETHEigenPodBalance(): Promise<bigint> {
        return this.eth_call(functions.getETHEigenPodBalance, [])
    }

    lrtConfig(): Promise<string> {
        return this.eth_call(functions.lrtConfig, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    stakedButNotVerifiedEth(): Promise<bigint> {
        return this.eth_call(functions.stakedButNotVerifiedEth, [])
    }
}
