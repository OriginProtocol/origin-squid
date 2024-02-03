import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './lrt-deposit-pool.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AssetDeposit: new LogEvent<([depositor: string, asset: string, depositAmount: bigint, primeEthMintAmount: bigint, referralId: string] & {depositor: string, asset: string, depositAmount: bigint, primeEthMintAmount: bigint, referralId: string})>(
        abi, '0x07c31fccf51996f0f4ea01c3a55191786b3a8cd89f696db4d42adaa99b0e15f1'
    ),
    AssetSwapped: new LogEvent<([fromAsset: string, toAsset: string, fromAssetAmount: bigint, toAssetAmount: bigint] & {fromAsset: string, toAsset: string, fromAssetAmount: bigint, toAssetAmount: bigint})>(
        abi, '0x4ac5df40d910feab74f02c4430568f99e711257906dd0df11643df22f2ee3cf6'
    ),
    ETHDeposit: new LogEvent<([depositor: string, depositAmount: bigint, primeEthMintAmount: bigint, referralId: string] & {depositor: string, depositAmount: bigint, primeEthMintAmount: bigint, referralId: string})>(
        abi, '0x8b0422d41caf5eb583695377e98b5041a1d241a7c80483cf182b1311c48c93b7'
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
    NodeDelegatorAddedInQueue: new LogEvent<([nodeDelegatorContracts: Array<string>] & {nodeDelegatorContracts: Array<string>})>(
        abi, '0xd402f64df01ef62b7343cb5309018377088f22dc1b81a5378ce7f2575114afe4'
    ),
    NodeDelegatorRemovedFromQueue: new LogEvent<([nodeDelegatorContracts: string] & {nodeDelegatorContracts: string})>(
        abi, '0xb17adb7f863ad4dced68bd4045e81e087cb8c5b536bf2dbda6c8176e5fc593b9'
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
    depositAsset: new Func<[asset: string, depositAmount: bigint, minPrimeETH: bigint, referralId: string], {asset: string, depositAmount: bigint, minPrimeETH: bigint, referralId: string}, []>(
        abi, '0xc3ae1766'
    ),
    depositETH: new Func<[minPrimeETHAmountExpected: bigint, referralId: string], {minPrimeETHAmountExpected: bigint, referralId: string}, []>(
        abi, '0x72c51c0b'
    ),
    getAssetCurrentLimit: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x884c1056'
    ),
    getAssetDistributionData: new Func<[asset: string], {asset: string}, ([assetLyingInDepositPool: bigint, assetLyingInNDCs: bigint, assetStakedInEigenLayer: bigint] & {assetLyingInDepositPool: bigint, assetLyingInNDCs: bigint, assetStakedInEigenLayer: bigint})>(
        abi, '0xb2628fdf'
    ),
    getETHDistributionData: new Func<[], {}, ([ethLyingInDepositPool: bigint, ethLyingInNDCs: bigint, ethStakedInEigenLayer: bigint] & {ethLyingInDepositPool: bigint, ethLyingInNDCs: bigint, ethStakedInEigenLayer: bigint})>(
        abi, '0xfe6e13e6'
    ),
    getMintAmount: new Func<[asset: string, amount: bigint], {asset: string, amount: bigint}, bigint>(
        abi, '0x195d0e28'
    ),
    getNodeDelegatorQueue: new Func<[], {}, Array<string>>(
        abi, '0xce895a2f'
    ),
    getSwapAssetReturnAmount: new Func<[fromAsset: string, toAsset: string, fromAssetAmount: bigint], {fromAsset: string, toAsset: string, fromAssetAmount: bigint}, bigint>(
        abi, '0x80fcc592'
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
    removeManyNodeDelegatorContractsFromQueue: new Func<[nodeDelegatorContracts: Array<string>], {nodeDelegatorContracts: Array<string>}, []>(
        abi, '0x1d572d55'
    ),
    removeNodeDelegatorContractFromQueue: new Func<[nodeDelegatorAddress: string], {nodeDelegatorAddress: string}, []>(
        abi, '0x6bf8b475'
    ),
    setMinAmountToDeposit: new Func<[minAmountToDeposit_: bigint], {minAmountToDeposit_: bigint}, []>(
        abi, '0x8cb20e6f'
    ),
    swapAssetWithinDepositPool: new Func<[fromAsset: string, toAsset: string, fromAssetAmount: bigint, minToAssetAmount: bigint], {fromAsset: string, toAsset: string, fromAssetAmount: bigint, minToAssetAmount: bigint}, []>(
        abi, '0x2f138eea'
    ),
    transferAssetToNodeDelegator: new Func<[ndcIndex: bigint, asset: string, amount: bigint], {ndcIndex: bigint, asset: string, amount: bigint}, []>(
        abi, '0xb4a92e47'
    ),
    transferETHToNodeDelegator: new Func<[ndcIndex: bigint, amount: bigint], {ndcIndex: bigint, amount: bigint}, []>(
        abi, '0x7969afa0'
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

    getETHDistributionData(): Promise<([ethLyingInDepositPool: bigint, ethLyingInNDCs: bigint, ethStakedInEigenLayer: bigint] & {ethLyingInDepositPool: bigint, ethLyingInNDCs: bigint, ethStakedInEigenLayer: bigint})> {
        return this.eth_call(functions.getETHDistributionData, [])
    }

    getMintAmount(asset: string, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getMintAmount, [asset, amount])
    }

    getNodeDelegatorQueue(): Promise<Array<string>> {
        return this.eth_call(functions.getNodeDelegatorQueue, [])
    }

    getSwapAssetReturnAmount(fromAsset: string, toAsset: string, fromAssetAmount: bigint): Promise<bigint> {
        return this.eth_call(functions.getSwapAssetReturnAmount, [fromAsset, toAsset, fromAssetAmount])
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
