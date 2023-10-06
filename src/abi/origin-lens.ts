import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './origin-lens.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    GovernorshipTransferred: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a'
    ),
    PendingGovernorshipTransfer: new LogEvent<([previousGovernor: string, newGovernor: string] & {previousGovernor: string, newGovernor: string})>(
        abi, '0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d'
    ),
    StrategistUpdated: new LogEvent<([_address: string] & {_address: string})>(
        abi, '0x869e0abd13cc3a975de7b93be3df1cb2255c802b1cead85963cc79d99f131bee'
    ),
    StrategyTypeChanged: new LogEvent<([strategyAddr: string, kind: number] & {strategyAddr: string, kind: number})>(
        abi, '0x7fab7e3127613cf3a72eafc4bfcb3e179d35d1c69e1d0217c1dd029dc23690bd'
    ),
}

export const functions = {
    ETH_ADDR: new Func<[], {}, string>(
        abi, '0x7753f47b'
    ),
    WETH_ADDR: new Func<[], {}, string>(
        abi, '0x82dfc5f7'
    ),
    assetCount: new Func<[], {}, bigint>(
        abi, '0xeafe7a74'
    ),
    assets: new Func<[_: bigint], {}, string>(
        abi, '0xcf35bdd0'
    ),
    cacheStrategies: new Func<[], {}, []>(
        abi, '0x44f98829'
    ),
    claimGovernance: new Func<[], {}, []>(
        abi, '0x5d36b190'
    ),
    curvePoolCoinCount: new Func<[_: string], {}, bigint>(
        abi, '0xdd6640c3'
    ),
    getStrategyAssetBalance: new Func<[strategyAddr: string, asset: string], {strategyAddr: string, asset: string}, bigint>(
        abi, '0x3a1d532b'
    ),
    getStrategyBalances: new Func<[strategyAddr: string], {strategyAddr: string}, ([supportedAssets: Array<string>, assetBalances: Array<bigint>] & {supportedAssets: Array<string>, assetBalances: Array<bigint>})>(
        abi, '0xe50bf68f'
    ),
    governor: new Func<[], {}, string>(
        abi, '0x0c340a24'
    ),
    initialize: new Func<[_strategistAddr: string, _strategies: Array<string>, strategyKinds: Array<number>], {_strategistAddr: string, _strategies: Array<string>, strategyKinds: Array<number>}, []>(
        abi, '0xe336f8c5'
    ),
    isGovernor: new Func<[], {}, boolean>(
        abi, '0xc7af3352'
    ),
    oToken: new Func<[], {}, string>(
        abi, '0x1a32aad6'
    ),
    oracleRouter: new Func<[], {}, string>(
        abi, '0x55a29e91'
    ),
    setStrategistAddr: new Func<[_address: string], {_address: string}, []>(
        abi, '0x773540b3'
    ),
    setStrategyKind: new Func<[strategy: string, kind: number], {strategy: string, kind: number}, []>(
        abi, '0xaefc61e0'
    ),
    strategies: new Func<[_: bigint], {}, string>(
        abi, '0xd574ea3d'
    ),
    strategistAddr: new Func<[], {}, string>(
        abi, '0x570d8e1d'
    ),
    strategyConfig: new Func<[_: string], {}, ([supported: boolean, kind: number] & {supported: boolean, kind: number})>(
        abi, '0x91450e63'
    ),
    transferGovernance: new Func<[_newGovernor: string], {_newGovernor: string}, []>(
        abi, '0xd38bfff4'
    ),
    vault: new Func<[], {}, string>(
        abi, '0xfbfa77cf'
    ),
}

export class Contract extends ContractBase {

    ETH_ADDR(): Promise<string> {
        return this.eth_call(functions.ETH_ADDR, [])
    }

    WETH_ADDR(): Promise<string> {
        return this.eth_call(functions.WETH_ADDR, [])
    }

    assetCount(): Promise<bigint> {
        return this.eth_call(functions.assetCount, [])
    }

    assets(arg0: bigint): Promise<string> {
        return this.eth_call(functions.assets, [arg0])
    }

    curvePoolCoinCount(arg0: string): Promise<bigint> {
        return this.eth_call(functions.curvePoolCoinCount, [arg0])
    }

    getStrategyAssetBalance(strategyAddr: string, asset: string): Promise<bigint> {
        return this.eth_call(functions.getStrategyAssetBalance, [strategyAddr, asset])
    }

    getStrategyBalances(strategyAddr: string): Promise<([supportedAssets: Array<string>, assetBalances: Array<bigint>] & {supportedAssets: Array<string>, assetBalances: Array<bigint>})> {
        return this.eth_call(functions.getStrategyBalances, [strategyAddr])
    }

    governor(): Promise<string> {
        return this.eth_call(functions.governor, [])
    }

    isGovernor(): Promise<boolean> {
        return this.eth_call(functions.isGovernor, [])
    }

    oToken(): Promise<string> {
        return this.eth_call(functions.oToken, [])
    }

    oracleRouter(): Promise<string> {
        return this.eth_call(functions.oracleRouter, [])
    }

    strategies(arg0: bigint): Promise<string> {
        return this.eth_call(functions.strategies, [arg0])
    }

    strategistAddr(): Promise<string> {
        return this.eth_call(functions.strategistAddr, [])
    }

    strategyConfig(arg0: string): Promise<([supported: boolean, kind: number] & {supported: boolean, kind: number})> {
        return this.eth_call(functions.strategyConfig, [arg0])
    }

    vault(): Promise<string> {
        return this.eth_call(functions.vault, [])
    }
}
