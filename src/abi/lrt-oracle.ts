import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './lrt-oracle.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AssetPriceOracleUpdate: new LogEvent<([asset: string, priceOracle: string] & {asset: string, priceOracle: string})>(
        abi, '0x72ac677bb38d8bb6988cfebe29d6caef19753725c2dc2c54edc2c22ed79dcaa6'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    UpdatedLRTConfig: new LogEvent<([lrtConfig: string] & {lrtConfig: string})>(
        abi, '0x9cf19cefd9aab739c33b95716ee3f3f921f219dc6d7aae25e1f9497b37889150'
    ),
}

export const functions = {
    assetPriceOracle: new Func<[asset: string], {asset: string}, string>(
        abi, '0x903e8c61'
    ),
    getAssetPrice: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0xb3596f07'
    ),
    initialize: new Func<[lrtConfigAddr: string], {lrtConfigAddr: string}, []>(
        abi, '0xc4d66de8'
    ),
    lrtConfig: new Func<[], {}, string>(
        abi, '0xf1650a46'
    ),
    primeETHPrice: new Func<[], {}, bigint>(
        abi, '0xea90a6e1'
    ),
    updateLRTConfig: new Func<[lrtConfigAddr: string], {lrtConfigAddr: string}, []>(
        abi, '0x15864e0a'
    ),
    updatePriceOracleFor: new Func<[asset: string, priceOracle: string], {asset: string, priceOracle: string}, []>(
        abi, '0x10e50dfa'
    ),
    updatePrimeETHPrice: new Func<[], {}, bigint>(
        abi, '0xf94f5a32'
    ),
}

export class Contract extends ContractBase {

    assetPriceOracle(asset: string): Promise<string> {
        return this.eth_call(functions.assetPriceOracle, [asset])
    }

    getAssetPrice(asset: string): Promise<bigint> {
        return this.eth_call(functions.getAssetPrice, [asset])
    }

    lrtConfig(): Promise<string> {
        return this.eth_call(functions.lrtConfig, [])
    }

    primeETHPrice(): Promise<bigint> {
        return this.eth_call(functions.primeETHPrice, [])
    }
}
