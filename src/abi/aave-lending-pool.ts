import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './aave-lending-pool.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Borrow: new LogEvent<([reserve: string, user: string, onBehalfOf: string, amount: bigint, borrowRateMode: bigint, borrowRate: bigint, referral: number] & {reserve: string, user: string, onBehalfOf: string, amount: bigint, borrowRateMode: bigint, borrowRate: bigint, referral: number})>(
        abi, '0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b'
    ),
    Deposit: new LogEvent<([reserve: string, user: string, onBehalfOf: string, amount: bigint, referral: number] & {reserve: string, user: string, onBehalfOf: string, amount: bigint, referral: number})>(
        abi, '0xde6857219544bb5b7746f48ed30be6386fefc61b2f864cacf559893bf50fd951'
    ),
    FlashLoan: new LogEvent<([target: string, initiator: string, asset: string, amount: bigint, premium: bigint, referralCode: number] & {target: string, initiator: string, asset: string, amount: bigint, premium: bigint, referralCode: number})>(
        abi, '0x631042c832b07452973831137f2d73e395028b44b250dedc5abb0ee766e168ac'
    ),
    LiquidationCall: new LogEvent<([collateralAsset: string, debtAsset: string, user: string, debtToCover: bigint, liquidatedCollateralAmount: bigint, liquidator: string, receiveAToken: boolean] & {collateralAsset: string, debtAsset: string, user: string, debtToCover: bigint, liquidatedCollateralAmount: bigint, liquidator: string, receiveAToken: boolean})>(
        abi, '0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286'
    ),
    Paused: new LogEvent<[]>(
        abi, '0x9e87fac88ff661f02d44f95383c817fece4bce600a3dab7a54406878b965e752'
    ),
    RebalanceStableBorrowRate: new LogEvent<([reserve: string, user: string] & {reserve: string, user: string})>(
        abi, '0x9f439ae0c81e41a04d3fdfe07aed54e6a179fb0db15be7702eb66fa8ef6f5300'
    ),
    Repay: new LogEvent<([reserve: string, user: string, repayer: string, amount: bigint] & {reserve: string, user: string, repayer: string, amount: bigint})>(
        abi, '0x4cdde6e09bb755c9a5589ebaec640bbfedff1362d4b255ebf8339782b9942faa'
    ),
    ReserveDataUpdated: new LogEvent<([reserve: string, liquidityRate: bigint, stableBorrowRate: bigint, variableBorrowRate: bigint, liquidityIndex: bigint, variableBorrowIndex: bigint] & {reserve: string, liquidityRate: bigint, stableBorrowRate: bigint, variableBorrowRate: bigint, liquidityIndex: bigint, variableBorrowIndex: bigint})>(
        abi, '0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a'
    ),
    ReserveUsedAsCollateralDisabled: new LogEvent<([reserve: string, user: string] & {reserve: string, user: string})>(
        abi, '0x44c58d81365b66dd4b1a7f36c25aa97b8c71c361ee4937adc1a00000227db5dd'
    ),
    ReserveUsedAsCollateralEnabled: new LogEvent<([reserve: string, user: string] & {reserve: string, user: string})>(
        abi, '0x00058a56ea94653cdf4f152d227ace22d4c00ad99e2a43f58cb7d9e3feb295f2'
    ),
    Swap: new LogEvent<([reserve: string, user: string, rateMode: bigint] & {reserve: string, user: string, rateMode: bigint})>(
        abi, '0xea368a40e9570069bb8e6511d668293ad2e1f03b0d982431fd223de9f3b70ca6'
    ),
    TokensRescued: new LogEvent<([tokenRescued: string, receiver: string, amountRescued: bigint] & {tokenRescued: string, receiver: string, amountRescued: bigint})>(
        abi, '0x77023e19c7343ad491fd706c36335ca0e738340a91f29b1fd81e2673d44896c4'
    ),
    Unpaused: new LogEvent<[]>(
        abi, '0xa45f47fdea8a1efdd9029a5691c7f759c32b7c698632b563573e155625d16933'
    ),
    Withdraw: new LogEvent<([reserve: string, user: string, to: string, amount: bigint] & {reserve: string, user: string, to: string, amount: bigint})>(
        abi, '0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7'
    ),
}

export const functions = {
    FLASHLOAN_PREMIUM_TOTAL: new Func<[], {}, bigint>(
        abi, '0x074b2e43'
    ),
    LENDINGPOOL_REVISION: new Func<[], {}, bigint>(
        abi, '0x8afaff02'
    ),
    MAX_NUMBER_RESERVES: new Func<[], {}, bigint>(
        abi, '0xf8119d51'
    ),
    MAX_STABLE_RATE_BORROW_SIZE_PERCENT: new Func<[], {}, bigint>(
        abi, '0xe82fec2f'
    ),
    borrow: new Func<[asset: string, amount: bigint, interestRateMode: bigint, referralCode: number, onBehalfOf: string], {asset: string, amount: bigint, interestRateMode: bigint, referralCode: number, onBehalfOf: string}, []>(
        abi, '0xa415bcad'
    ),
    deposit: new Func<[asset: string, amount: bigint, onBehalfOf: string, referralCode: number], {asset: string, amount: bigint, onBehalfOf: string, referralCode: number}, []>(
        abi, '0xe8eda9df'
    ),
    finalizeTransfer: new Func<[asset: string, from: string, to: string, amount: bigint, balanceFromBefore: bigint, balanceToBefore: bigint], {asset: string, from: string, to: string, amount: bigint, balanceFromBefore: bigint, balanceToBefore: bigint}, []>(
        abi, '0xd5ed3933'
    ),
    flashLoan: new Func<[receiverAddress: string, assets: Array<string>, amounts: Array<bigint>, modes: Array<bigint>, onBehalfOf: string, params: string, referralCode: number], {receiverAddress: string, assets: Array<string>, amounts: Array<bigint>, modes: Array<bigint>, onBehalfOf: string, params: string, referralCode: number}, []>(
        abi, '0xab9c4b5d'
    ),
    getAddressesProvider: new Func<[], {}, string>(
        abi, '0xfe65acfe'
    ),
    getConfiguration: new Func<[asset: string], {asset: string}, ([data: bigint] & {data: bigint})>(
        abi, '0xc44b11f7'
    ),
    getReserveData: new Func<[asset: string], {asset: string}, ([configuration: ([data: bigint] & {data: bigint}), liquidityIndex: bigint, variableBorrowIndex: bigint, currentLiquidityRate: bigint, currentVariableBorrowRate: bigint, currentStableBorrowRate: bigint, lastUpdateTimestamp: number, aTokenAddress: string, stableDebtTokenAddress: string, variableDebtTokenAddress: string, interestRateStrategyAddress: string, id: number] & {configuration: ([data: bigint] & {data: bigint}), liquidityIndex: bigint, variableBorrowIndex: bigint, currentLiquidityRate: bigint, currentVariableBorrowRate: bigint, currentStableBorrowRate: bigint, lastUpdateTimestamp: number, aTokenAddress: string, stableDebtTokenAddress: string, variableDebtTokenAddress: string, interestRateStrategyAddress: string, id: number})>(
        abi, '0x35ea6a75'
    ),
    getReserveNormalizedIncome: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0xd15e0053'
    ),
    getReserveNormalizedVariableDebt: new Func<[asset: string], {asset: string}, bigint>(
        abi, '0x386497fd'
    ),
    getReservesList: new Func<[], {}, Array<string>>(
        abi, '0xd1946dbc'
    ),
    getUserAccountData: new Func<[user: string], {user: string}, ([totalCollateralETH: bigint, totalDebtETH: bigint, availableBorrowsETH: bigint, currentLiquidationThreshold: bigint, ltv: bigint, healthFactor: bigint] & {totalCollateralETH: bigint, totalDebtETH: bigint, availableBorrowsETH: bigint, currentLiquidationThreshold: bigint, ltv: bigint, healthFactor: bigint})>(
        abi, '0xbf92857c'
    ),
    getUserConfiguration: new Func<[user: string], {user: string}, ([data: bigint] & {data: bigint})>(
        abi, '0x4417a583'
    ),
    initReserve: new Func<[asset: string, aTokenAddress: string, stableDebtAddress: string, variableDebtAddress: string, interestRateStrategyAddress: string], {asset: string, aTokenAddress: string, stableDebtAddress: string, variableDebtAddress: string, interestRateStrategyAddress: string}, []>(
        abi, '0x7a708e92'
    ),
    initialize: new Func<[provider: string], {provider: string}, []>(
        abi, '0xc4d66de8'
    ),
    liquidationCall: new Func<[collateralAsset: string, debtAsset: string, user: string, debtToCover: bigint, receiveAToken: boolean], {collateralAsset: string, debtAsset: string, user: string, debtToCover: bigint, receiveAToken: boolean}, []>(
        abi, '0x00a718a9'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    rebalanceStableBorrowRate: new Func<[asset: string, user: string], {asset: string, user: string}, []>(
        abi, '0xcd112382'
    ),
    repay: new Func<[asset: string, amount: bigint, rateMode: bigint, onBehalfOf: string], {asset: string, amount: bigint, rateMode: bigint, onBehalfOf: string}, bigint>(
        abi, '0x573ade81'
    ),
    rescueTokens: new Func<[token: string, to: string, amount: bigint], {token: string, to: string, amount: bigint}, []>(
        abi, '0xcea9d26f'
    ),
    setConfiguration: new Func<[asset: string, configuration: bigint], {asset: string, configuration: bigint}, []>(
        abi, '0xb8d29276'
    ),
    setPause: new Func<[val: boolean], {val: boolean}, []>(
        abi, '0xbedb86fb'
    ),
    setReserveInterestRateStrategyAddress: new Func<[asset: string, rateStrategyAddress: string], {asset: string, rateStrategyAddress: string}, []>(
        abi, '0x1d2118f9'
    ),
    setUserUseReserveAsCollateral: new Func<[asset: string, useAsCollateral: boolean], {asset: string, useAsCollateral: boolean}, []>(
        abi, '0x5a3b74b9'
    ),
    swapBorrowRateMode: new Func<[asset: string, rateMode: bigint], {asset: string, rateMode: bigint}, []>(
        abi, '0x94ba89a2'
    ),
    withdraw: new Func<[asset: string, amount: bigint, to: string], {asset: string, amount: bigint, to: string}, bigint>(
        abi, '0x69328dec'
    ),
}

export class Contract extends ContractBase {

    FLASHLOAN_PREMIUM_TOTAL(): Promise<bigint> {
        return this.eth_call(functions.FLASHLOAN_PREMIUM_TOTAL, [])
    }

    LENDINGPOOL_REVISION(): Promise<bigint> {
        return this.eth_call(functions.LENDINGPOOL_REVISION, [])
    }

    MAX_NUMBER_RESERVES(): Promise<bigint> {
        return this.eth_call(functions.MAX_NUMBER_RESERVES, [])
    }

    MAX_STABLE_RATE_BORROW_SIZE_PERCENT(): Promise<bigint> {
        return this.eth_call(functions.MAX_STABLE_RATE_BORROW_SIZE_PERCENT, [])
    }

    getAddressesProvider(): Promise<string> {
        return this.eth_call(functions.getAddressesProvider, [])
    }

    getConfiguration(asset: string): Promise<([data: bigint] & {data: bigint})> {
        return this.eth_call(functions.getConfiguration, [asset])
    }

    getReserveData(asset: string): Promise<([configuration: ([data: bigint] & {data: bigint}), liquidityIndex: bigint, variableBorrowIndex: bigint, currentLiquidityRate: bigint, currentVariableBorrowRate: bigint, currentStableBorrowRate: bigint, lastUpdateTimestamp: number, aTokenAddress: string, stableDebtTokenAddress: string, variableDebtTokenAddress: string, interestRateStrategyAddress: string, id: number] & {configuration: ([data: bigint] & {data: bigint}), liquidityIndex: bigint, variableBorrowIndex: bigint, currentLiquidityRate: bigint, currentVariableBorrowRate: bigint, currentStableBorrowRate: bigint, lastUpdateTimestamp: number, aTokenAddress: string, stableDebtTokenAddress: string, variableDebtTokenAddress: string, interestRateStrategyAddress: string, id: number})> {
        return this.eth_call(functions.getReserveData, [asset])
    }

    getReserveNormalizedIncome(asset: string): Promise<bigint> {
        return this.eth_call(functions.getReserveNormalizedIncome, [asset])
    }

    getReserveNormalizedVariableDebt(asset: string): Promise<bigint> {
        return this.eth_call(functions.getReserveNormalizedVariableDebt, [asset])
    }

    getReservesList(): Promise<Array<string>> {
        return this.eth_call(functions.getReservesList, [])
    }

    getUserAccountData(user: string): Promise<([totalCollateralETH: bigint, totalDebtETH: bigint, availableBorrowsETH: bigint, currentLiquidationThreshold: bigint, ltv: bigint, healthFactor: bigint] & {totalCollateralETH: bigint, totalDebtETH: bigint, availableBorrowsETH: bigint, currentLiquidationThreshold: bigint, ltv: bigint, healthFactor: bigint})> {
        return this.eth_call(functions.getUserAccountData, [user])
    }

    getUserConfiguration(user: string): Promise<([data: bigint] & {data: bigint})> {
        return this.eth_call(functions.getUserConfiguration, [user])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }
}
