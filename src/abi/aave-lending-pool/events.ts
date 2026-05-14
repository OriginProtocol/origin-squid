import { address, bool, uint16, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** Borrow(address,address,address,uint256,uint256,uint256,uint16) */
export const Borrow = event('0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b', {
    reserve: indexed(address),
    user: address,
    onBehalfOf: indexed(address),
    amount: uint256,
    borrowRateMode: uint256,
    borrowRate: uint256,
    referral: indexed(uint16),
})
export type BorrowEventArgs = EParams<typeof Borrow>

/** Deposit(address,address,address,uint256,uint16) */
export const Deposit = event('0xde6857219544bb5b7746f48ed30be6386fefc61b2f864cacf559893bf50fd951', {
    reserve: indexed(address),
    user: address,
    onBehalfOf: indexed(address),
    amount: uint256,
    referral: indexed(uint16),
})
export type DepositEventArgs = EParams<typeof Deposit>

/** FlashLoan(address,address,address,uint256,uint256,uint16) */
export const FlashLoan = event('0x631042c832b07452973831137f2d73e395028b44b250dedc5abb0ee766e168ac', {
    target: indexed(address),
    initiator: indexed(address),
    asset: indexed(address),
    amount: uint256,
    premium: uint256,
    referralCode: uint16,
})
export type FlashLoanEventArgs = EParams<typeof FlashLoan>

/** LiquidationCall(address,address,address,uint256,uint256,address,bool) */
export const LiquidationCall = event('0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286', {
    collateralAsset: indexed(address),
    debtAsset: indexed(address),
    user: indexed(address),
    debtToCover: uint256,
    liquidatedCollateralAmount: uint256,
    liquidator: address,
    receiveAToken: bool,
})
export type LiquidationCallEventArgs = EParams<typeof LiquidationCall>

/** Paused() */
export const Paused = event('0x9e87fac88ff661f02d44f95383c817fece4bce600a3dab7a54406878b965e752', {})
export type PausedEventArgs = EParams<typeof Paused>

/** RebalanceStableBorrowRate(address,address) */
export const RebalanceStableBorrowRate = event('0x9f439ae0c81e41a04d3fdfe07aed54e6a179fb0db15be7702eb66fa8ef6f5300', {
    reserve: indexed(address),
    user: indexed(address),
})
export type RebalanceStableBorrowRateEventArgs = EParams<typeof RebalanceStableBorrowRate>

/** Repay(address,address,address,uint256) */
export const Repay = event('0x4cdde6e09bb755c9a5589ebaec640bbfedff1362d4b255ebf8339782b9942faa', {
    reserve: indexed(address),
    user: indexed(address),
    repayer: indexed(address),
    amount: uint256,
})
export type RepayEventArgs = EParams<typeof Repay>

/** ReserveDataUpdated(address,uint256,uint256,uint256,uint256,uint256) */
export const ReserveDataUpdated = event('0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a', {
    reserve: indexed(address),
    liquidityRate: uint256,
    stableBorrowRate: uint256,
    variableBorrowRate: uint256,
    liquidityIndex: uint256,
    variableBorrowIndex: uint256,
})
export type ReserveDataUpdatedEventArgs = EParams<typeof ReserveDataUpdated>

/** ReserveUsedAsCollateralDisabled(address,address) */
export const ReserveUsedAsCollateralDisabled = event('0x44c58d81365b66dd4b1a7f36c25aa97b8c71c361ee4937adc1a00000227db5dd', {
    reserve: indexed(address),
    user: indexed(address),
})
export type ReserveUsedAsCollateralDisabledEventArgs = EParams<typeof ReserveUsedAsCollateralDisabled>

/** ReserveUsedAsCollateralEnabled(address,address) */
export const ReserveUsedAsCollateralEnabled = event('0x00058a56ea94653cdf4f152d227ace22d4c00ad99e2a43f58cb7d9e3feb295f2', {
    reserve: indexed(address),
    user: indexed(address),
})
export type ReserveUsedAsCollateralEnabledEventArgs = EParams<typeof ReserveUsedAsCollateralEnabled>

/** Swap(address,address,uint256) */
export const Swap = event('0xea368a40e9570069bb8e6511d668293ad2e1f03b0d982431fd223de9f3b70ca6', {
    reserve: indexed(address),
    user: indexed(address),
    rateMode: uint256,
})
export type SwapEventArgs = EParams<typeof Swap>

/** TokensRescued(address,address,uint256) */
export const TokensRescued = event('0x77023e19c7343ad491fd706c36335ca0e738340a91f29b1fd81e2673d44896c4', {
    tokenRescued: indexed(address),
    receiver: indexed(address),
    amountRescued: uint256,
})
export type TokensRescuedEventArgs = EParams<typeof TokensRescued>

/** Unpaused() */
export const Unpaused = event('0xa45f47fdea8a1efdd9029a5691c7f759c32b7c698632b563573e155625d16933', {})
export type UnpausedEventArgs = EParams<typeof Unpaused>

/** Withdraw(address,address,address,uint256) */
export const Withdraw = event('0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7', {
    reserve: indexed(address),
    user: indexed(address),
    to: indexed(address),
    amount: uint256,
})
export type WithdrawEventArgs = EParams<typeof Withdraw>
