import { address, array, bool, bytes, struct, uint128, uint16, uint256, uint40, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** FLASHLOAN_PREMIUM_TOTAL() */
export const FLASHLOAN_PREMIUM_TOTAL = func('0x074b2e43', {}, uint256)
export type FLASHLOAN_PREMIUM_TOTALParams = FunctionArguments<typeof FLASHLOAN_PREMIUM_TOTAL>
export type FLASHLOAN_PREMIUM_TOTALReturn = FunctionReturn<typeof FLASHLOAN_PREMIUM_TOTAL>

/** LENDINGPOOL_REVISION() */
export const LENDINGPOOL_REVISION = func('0x8afaff02', {}, uint256)
export type LENDINGPOOL_REVISIONParams = FunctionArguments<typeof LENDINGPOOL_REVISION>
export type LENDINGPOOL_REVISIONReturn = FunctionReturn<typeof LENDINGPOOL_REVISION>

/** MAX_NUMBER_RESERVES() */
export const MAX_NUMBER_RESERVES = func('0xf8119d51', {}, uint256)
export type MAX_NUMBER_RESERVESParams = FunctionArguments<typeof MAX_NUMBER_RESERVES>
export type MAX_NUMBER_RESERVESReturn = FunctionReturn<typeof MAX_NUMBER_RESERVES>

/** MAX_STABLE_RATE_BORROW_SIZE_PERCENT() */
export const MAX_STABLE_RATE_BORROW_SIZE_PERCENT = func('0xe82fec2f', {}, uint256)
export type MAX_STABLE_RATE_BORROW_SIZE_PERCENTParams = FunctionArguments<typeof MAX_STABLE_RATE_BORROW_SIZE_PERCENT>
export type MAX_STABLE_RATE_BORROW_SIZE_PERCENTReturn = FunctionReturn<typeof MAX_STABLE_RATE_BORROW_SIZE_PERCENT>

/** borrow(address,uint256,uint256,uint16,address) */
export const borrow = func('0xa415bcad', {
    asset: address,
    amount: uint256,
    interestRateMode: uint256,
    referralCode: uint16,
    onBehalfOf: address,
})
export type BorrowParams = FunctionArguments<typeof borrow>
export type BorrowReturn = FunctionReturn<typeof borrow>

/** deposit(address,uint256,address,uint16) */
export const deposit = func('0xe8eda9df', {
    asset: address,
    amount: uint256,
    onBehalfOf: address,
    referralCode: uint16,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** finalizeTransfer(address,address,address,uint256,uint256,uint256) */
export const finalizeTransfer = func('0xd5ed3933', {
    asset: address,
    from: address,
    to: address,
    amount: uint256,
    balanceFromBefore: uint256,
    balanceToBefore: uint256,
})
export type FinalizeTransferParams = FunctionArguments<typeof finalizeTransfer>
export type FinalizeTransferReturn = FunctionReturn<typeof finalizeTransfer>

/** flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16) */
export const flashLoan = func('0xab9c4b5d', {
    receiverAddress: address,
    assets: array(address),
    amounts: array(uint256),
    modes: array(uint256),
    onBehalfOf: address,
    params: bytes,
    referralCode: uint16,
})
export type FlashLoanParams = FunctionArguments<typeof flashLoan>
export type FlashLoanReturn = FunctionReturn<typeof flashLoan>

/** getAddressesProvider() */
export const getAddressesProvider = func('0xfe65acfe', {}, address)
export type GetAddressesProviderParams = FunctionArguments<typeof getAddressesProvider>
export type GetAddressesProviderReturn = FunctionReturn<typeof getAddressesProvider>

/** getConfiguration(address) */
export const getConfiguration = func('0xc44b11f7', {
    asset: address,
}, struct({
    data: uint256,
}))
export type GetConfigurationParams = FunctionArguments<typeof getConfiguration>
export type GetConfigurationReturn = FunctionReturn<typeof getConfiguration>

/** getReserveData(address) */
export const getReserveData = func('0x35ea6a75', {
    asset: address,
}, struct({
    configuration: struct({
        data: uint256,
    }),
    liquidityIndex: uint128,
    variableBorrowIndex: uint128,
    currentLiquidityRate: uint128,
    currentVariableBorrowRate: uint128,
    currentStableBorrowRate: uint128,
    lastUpdateTimestamp: uint40,
    aTokenAddress: address,
    stableDebtTokenAddress: address,
    variableDebtTokenAddress: address,
    interestRateStrategyAddress: address,
    id: uint8,
}))
export type GetReserveDataParams = FunctionArguments<typeof getReserveData>
export type GetReserveDataReturn = FunctionReturn<typeof getReserveData>

/** getReserveNormalizedIncome(address) */
export const getReserveNormalizedIncome = func('0xd15e0053', {
    asset: address,
}, uint256)
export type GetReserveNormalizedIncomeParams = FunctionArguments<typeof getReserveNormalizedIncome>
export type GetReserveNormalizedIncomeReturn = FunctionReturn<typeof getReserveNormalizedIncome>

/** getReserveNormalizedVariableDebt(address) */
export const getReserveNormalizedVariableDebt = func('0x386497fd', {
    asset: address,
}, uint256)
export type GetReserveNormalizedVariableDebtParams = FunctionArguments<typeof getReserveNormalizedVariableDebt>
export type GetReserveNormalizedVariableDebtReturn = FunctionReturn<typeof getReserveNormalizedVariableDebt>

/** getReservesList() */
export const getReservesList = func('0xd1946dbc', {}, array(address))
export type GetReservesListParams = FunctionArguments<typeof getReservesList>
export type GetReservesListReturn = FunctionReturn<typeof getReservesList>

/** getUserAccountData(address) */
export const getUserAccountData = func('0xbf92857c', {
    user: address,
}, struct({
    totalCollateralETH: uint256,
    totalDebtETH: uint256,
    availableBorrowsETH: uint256,
    currentLiquidationThreshold: uint256,
    ltv: uint256,
    healthFactor: uint256,
}))
export type GetUserAccountDataParams = FunctionArguments<typeof getUserAccountData>
export type GetUserAccountDataReturn = FunctionReturn<typeof getUserAccountData>

/** getUserConfiguration(address) */
export const getUserConfiguration = func('0x4417a583', {
    user: address,
}, struct({
    data: uint256,
}))
export type GetUserConfigurationParams = FunctionArguments<typeof getUserConfiguration>
export type GetUserConfigurationReturn = FunctionReturn<typeof getUserConfiguration>

/** initReserve(address,address,address,address,address) */
export const initReserve = func('0x7a708e92', {
    asset: address,
    aTokenAddress: address,
    stableDebtAddress: address,
    variableDebtAddress: address,
    interestRateStrategyAddress: address,
})
export type InitReserveParams = FunctionArguments<typeof initReserve>
export type InitReserveReturn = FunctionReturn<typeof initReserve>

/** initialize(address) */
export const initialize = func('0xc4d66de8', {
    provider: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** liquidationCall(address,address,address,uint256,bool) */
export const liquidationCall = func('0x00a718a9', {
    collateralAsset: address,
    debtAsset: address,
    user: address,
    debtToCover: uint256,
    receiveAToken: bool,
})
export type LiquidationCallParams = FunctionArguments<typeof liquidationCall>
export type LiquidationCallReturn = FunctionReturn<typeof liquidationCall>

/** paused() */
export const paused = func('0x5c975abb', {}, bool)
export type PausedParams = FunctionArguments<typeof paused>
export type PausedReturn = FunctionReturn<typeof paused>

/** rebalanceStableBorrowRate(address,address) */
export const rebalanceStableBorrowRate = func('0xcd112382', {
    asset: address,
    user: address,
})
export type RebalanceStableBorrowRateParams = FunctionArguments<typeof rebalanceStableBorrowRate>
export type RebalanceStableBorrowRateReturn = FunctionReturn<typeof rebalanceStableBorrowRate>

/** repay(address,uint256,uint256,address) */
export const repay = func('0x573ade81', {
    asset: address,
    amount: uint256,
    rateMode: uint256,
    onBehalfOf: address,
}, uint256)
export type RepayParams = FunctionArguments<typeof repay>
export type RepayReturn = FunctionReturn<typeof repay>

/** rescueTokens(address,address,uint256) */
export const rescueTokens = func('0xcea9d26f', {
    token: address,
    to: address,
    amount: uint256,
})
export type RescueTokensParams = FunctionArguments<typeof rescueTokens>
export type RescueTokensReturn = FunctionReturn<typeof rescueTokens>

/** setConfiguration(address,uint256) */
export const setConfiguration = func('0xb8d29276', {
    asset: address,
    configuration: uint256,
})
export type SetConfigurationParams = FunctionArguments<typeof setConfiguration>
export type SetConfigurationReturn = FunctionReturn<typeof setConfiguration>

/** setPause(bool) */
export const setPause = func('0xbedb86fb', {
    val: bool,
})
export type SetPauseParams = FunctionArguments<typeof setPause>
export type SetPauseReturn = FunctionReturn<typeof setPause>

/** setReserveInterestRateStrategyAddress(address,address) */
export const setReserveInterestRateStrategyAddress = func('0x1d2118f9', {
    asset: address,
    rateStrategyAddress: address,
})
export type SetReserveInterestRateStrategyAddressParams = FunctionArguments<typeof setReserveInterestRateStrategyAddress>
export type SetReserveInterestRateStrategyAddressReturn = FunctionReturn<typeof setReserveInterestRateStrategyAddress>

/** setUserUseReserveAsCollateral(address,bool) */
export const setUserUseReserveAsCollateral = func('0x5a3b74b9', {
    asset: address,
    useAsCollateral: bool,
})
export type SetUserUseReserveAsCollateralParams = FunctionArguments<typeof setUserUseReserveAsCollateral>
export type SetUserUseReserveAsCollateralReturn = FunctionReturn<typeof setUserUseReserveAsCollateral>

/** swapBorrowRateMode(address,uint256) */
export const swapBorrowRateMode = func('0x94ba89a2', {
    asset: address,
    rateMode: uint256,
})
export type SwapBorrowRateModeParams = FunctionArguments<typeof swapBorrowRateMode>
export type SwapBorrowRateModeReturn = FunctionReturn<typeof swapBorrowRateMode>

/** withdraw(address,uint256,address) */
export const withdraw = func('0x69328dec', {
    asset: address,
    amount: uint256,
    to: address,
}, uint256)
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>
