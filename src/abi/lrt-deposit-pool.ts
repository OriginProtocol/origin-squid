import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './lrt-deposit-pool.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AssetDeposit: new LogEvent<([depositor: string, asset: string, depositAmount: bigint, rsethMintAmount: bigint, referralId: string] & {depositor: string, asset: string, depositAmount: bigint, rsethMintAmount: bigint, referralId: string})>(
        abi, '0x07c31fccf51996f0f4ea01c3a55191786b3a8cd89f696db4d42adaa99b0e15f1'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    MaxNodeDelegatorLimitUpdated: new LogEvent<([maxNodeDelegatorLimit: bigint] & {maxNodeDelegatorLimit: bigint})>(
        abi, '0x44a9f72c31db7b99a131a49de95fe2420c60e9fe9bff0a1a13d47b4af14566b4'
    ),
    MinAmountToDepositUpdated: new LogEvent<([minAmountToDeposit: bigint] & {minAmountToDeposit: bigint})>(
        abi, '0x1bba2f1175afe384c3b2efde45f19740b744459c61a7700994196fe4d84af176'
    ),
    NodeDelegatorAddedinQueue: new LogEvent<([nodeDelegatorContracts: Array<string>] & {nodeDelegatorContracts: Array<string>})>(
        abi, '0x7c2453850055cd8625ebfc0116c7b3eec5d5e6b0b584e69a719089e22f461d63'
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
    addNodeDelegatorContractToQueue: new Func<[nodeDelegatorContracts: Array<string>], {nodeDelegatorContracts: Array<string>}, []>(
        abi, '0x19304ccf'
    ),
    depositAsset: new Func<[asset: string, depositAmount: bigint, minRSETHAmountToReceive: bigint, referralId: string], {asset: string, depositAmount: bigint, minRSETHAmountToReceive: bigint, referralId: string}, []>(
        abi, '0xc3ae1766'
    ),
    getAssetCurrentLimit: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x884c1056'
    ),
    getAssetDistributionData: new Func<[asset: string], {asset: string}, ([assetLyingInDepositPool: bigint, assetLyingInNDCs: bigint, assetStakedInEigenLayer: bigint] & {assetLyingInDepositPool: bigint, assetLyingInNDCs: bigint, assetStakedInEigenLayer: bigint})>(
        abi, '0xb2628fdf'
    ),
    getNodeDelegatorQueue: new Func<[], {}, Array<string>>(
        abi, '0xce895a2f'
    ),
    getRsETHAmountToMint: new Func<[asset: string, amount: bigint], {asset: string, amount: bigint}, bigint>(
        abi, '0xba5bb442'
    ),
    getTotalAssetDeposits: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x52c4889f'
    ),
    initialize: new Func<[lrtConfigAddr: string], {lrtConfigAddr: string}, []>(
        abi, '0xc4d66de8'
    ),
    isNodeDelegator: new Func<[_: string], {}, bigint>(
        abi, '0x4f444d25'
    ),
    lrtConfig: new Func<[], {}, string>(
        abi, '0xf1650a46'
    ),
    maxNodeDelegatorLimit: new Func<[], {}, bigint>(
        abi, '0xc14db927'
    ),
    minAmountToDeposit: new Func<[], {}, bigint>(
        abi, '0x778fbe60'
    ),
    nodeDelegatorQueue: new Func<[_: bigint], {}, string>(
        abi, '0x7a0dace2'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    setMinAmountToDeposit: new Func<[minAmountToDeposit_: bigint], {minAmountToDeposit_: bigint}, []>(
        abi, '0x8cb20e6f'
    ),
    transferAssetToNodeDelegator: new Func<[ndcIndex: bigint, asset: string, amount: bigint], {ndcIndex: bigint, asset: string, amount: bigint}, []>(
        abi, '0xb4a92e47'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    updateLRTConfig: new Func<[lrtConfigAddr: string], {lrtConfigAddr: string}, []>(
        abi, '0x15864e0a'
    ),
    updateMaxNodeDelegatorLimit: new Func<[maxNodeDelegatorLimit_: bigint], {maxNodeDelegatorLimit_: bigint}, []>(
        abi, '0x09bb0f57'
    ),
}

export class Contract extends ContractBase {

    getAssetCurrentLimit(asset: string): Promise<bigint> {
        return this.eth_call(functions.getAssetCurrentLimit, [asset])
    }

    getAssetDistributionData(asset: string): Promise<([assetLyingInDepositPool: bigint, assetLyingInNDCs: bigint, assetStakedInEigenLayer: bigint] & {assetLyingInDepositPool: bigint, assetLyingInNDCs: bigint, assetStakedInEigenLayer: bigint})> {
        return this.eth_call(functions.getAssetDistributionData, [asset])
    }

    getNodeDelegatorQueue(): Promise<Array<string>> {
        return this.eth_call(functions.getNodeDelegatorQueue, [])
    }

    getRsETHAmountToMint(asset: string, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getRsETHAmountToMint, [asset, amount])
    }

    getTotalAssetDeposits(asset: string): Promise<bigint> {
        return this.eth_call(functions.getTotalAssetDeposits, [asset])
    }

    isNodeDelegator(arg0: string): Promise<bigint> {
        return this.eth_call(functions.isNodeDelegator, [arg0])
    }

    lrtConfig(): Promise<string> {
        return this.eth_call(functions.lrtConfig, [])
    }

    maxNodeDelegatorLimit(): Promise<bigint> {
        return this.eth_call(functions.maxNodeDelegatorLimit, [])
    }

    minAmountToDeposit(): Promise<bigint> {
        return this.eth_call(functions.minAmountToDeposit, [])
    }

    nodeDelegatorQueue(arg0: bigint): Promise<string> {
        return this.eth_call(functions.nodeDelegatorQueue, [arg0])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }
}
