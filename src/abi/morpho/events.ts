import { address, bool, bytes32, struct, uint256 } from '@subsquid/evm-codec'
import { event, indexed } from '../abi.support.js'
import type { EventParams as EParams } from '../abi.support.js'

/** AccrueInterest(bytes32,uint256,uint256,uint256) */
export const AccrueInterest = event('0x9d9bd501d0657d7dfe415f779a620a62b78bc508ddc0891fbbd8b7ac0f8fce87', {
    id: indexed(bytes32),
    prevBorrowRate: uint256,
    interest: uint256,
    feeShares: uint256,
})
export type AccrueInterestEventArgs = EParams<typeof AccrueInterest>

/** Borrow(bytes32,address,address,address,uint256,uint256) */
export const Borrow = event('0x570954540bed6b1304a87dfe815a5eda4a648f7097a16240dcd85c9b5fd42a43', {
    id: indexed(bytes32),
    caller: address,
    onBehalf: indexed(address),
    receiver: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type BorrowEventArgs = EParams<typeof Borrow>

/** CreateMarket(bytes32,(address,address,address,address,uint256)) */
export const CreateMarket = event('0xac4b2400f169220b0c0afdde7a0b32e775ba727ea1cb30b35f935cdaab8683ac', {
    id: indexed(bytes32),
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
})
export type CreateMarketEventArgs = EParams<typeof CreateMarket>

/** EnableIrm(address) */
export const EnableIrm = event('0x590e04cdebeccba40f566186b9746ad295a4cd358ea4fefaaea6ce79630d96c0', {
    irm: indexed(address),
})
export type EnableIrmEventArgs = EParams<typeof EnableIrm>

/** EnableLltv(uint256) */
export const EnableLltv = event('0x297b80e7a896fad470c630f6575072d609bde997260ff3db851939405ec29139', {
    lltv: uint256,
})
export type EnableLltvEventArgs = EParams<typeof EnableLltv>

/** FlashLoan(address,address,uint256) */
export const FlashLoan = event('0xc76f1b4fe4396ac07a9fa55a415d4ca430e72651d37d3401f3bed7cb13fc4f12', {
    caller: indexed(address),
    token: indexed(address),
    assets: uint256,
})
export type FlashLoanEventArgs = EParams<typeof FlashLoan>

/** IncrementNonce(address,address,uint256) */
export const IncrementNonce = event('0xa58af1a0c70dba0c7aa60d1a1a147ebd61000d1690a968828ac718bca927f2c7', {
    caller: indexed(address),
    authorizer: indexed(address),
    usedNonce: uint256,
})
export type IncrementNonceEventArgs = EParams<typeof IncrementNonce>

/** Liquidate(bytes32,address,address,uint256,uint256,uint256,uint256,uint256) */
export const Liquidate = event('0xa4946ede45d0c6f06a0f5ce92c9ad3b4751452d2fe0e25010783bcab57a67e41', {
    id: indexed(bytes32),
    caller: indexed(address),
    borrower: indexed(address),
    repaidAssets: uint256,
    repaidShares: uint256,
    seizedAssets: uint256,
    badDebtAssets: uint256,
    badDebtShares: uint256,
})
export type LiquidateEventArgs = EParams<typeof Liquidate>

/** Repay(bytes32,address,address,uint256,uint256) */
export const Repay = event('0x52acb05cebbd3cd39715469f22afbf5a17496295ef3bc9bb5944056c63ccaa09', {
    id: indexed(bytes32),
    caller: indexed(address),
    onBehalf: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type RepayEventArgs = EParams<typeof Repay>

/** SetAuthorization(address,address,address,bool) */
export const SetAuthorization = event('0xd5e969f01efe921d3f766bdebad25f0a05e3f237311f56482bf132d0326309c0', {
    caller: indexed(address),
    authorizer: indexed(address),
    authorized: indexed(address),
    newIsAuthorized: bool,
})
export type SetAuthorizationEventArgs = EParams<typeof SetAuthorization>

/** SetFee(bytes32,uint256) */
export const SetFee = event('0x139d6f58e9a127229667c8e3b36e88890a66cfc8ab1024ddc513e189e125b75b', {
    id: indexed(bytes32),
    newFee: uint256,
})
export type SetFeeEventArgs = EParams<typeof SetFee>

/** SetFeeRecipient(address) */
export const SetFeeRecipient = event('0x2e979f80fe4d43055c584cf4a8467c55875ea36728fc37176c05acd784eb7a73', {
    newFeeRecipient: indexed(address),
})
export type SetFeeRecipientEventArgs = EParams<typeof SetFeeRecipient>

/** SetOwner(address) */
export const SetOwner = event('0x167d3e9c1016ab80e58802ca9da10ce5c6a0f4debc46a2e7a2cd9e56899a4fb5', {
    newOwner: indexed(address),
})
export type SetOwnerEventArgs = EParams<typeof SetOwner>

/** Supply(bytes32,address,address,uint256,uint256) */
export const Supply = event('0xedf8870433c83823eb071d3df1caa8d008f12f6440918c20d75a3602cda30fe0', {
    id: indexed(bytes32),
    caller: indexed(address),
    onBehalf: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type SupplyEventArgs = EParams<typeof Supply>

/** SupplyCollateral(bytes32,address,address,uint256) */
export const SupplyCollateral = event('0xa3b9472a1399e17e123f3c2e6586c23e504184d504de59cdaa2b375e880c6184', {
    id: indexed(bytes32),
    caller: indexed(address),
    onBehalf: indexed(address),
    assets: uint256,
})
export type SupplyCollateralEventArgs = EParams<typeof SupplyCollateral>

/** Withdraw(bytes32,address,address,address,uint256,uint256) */
export const Withdraw = event('0xa56fc0ad5702ec05ce63666221f796fb62437c32db1aa1aa075fc6484cf58fbf', {
    id: indexed(bytes32),
    caller: address,
    onBehalf: indexed(address),
    receiver: indexed(address),
    assets: uint256,
    shares: uint256,
})
export type WithdrawEventArgs = EParams<typeof Withdraw>

/** WithdrawCollateral(bytes32,address,address,address,uint256) */
export const WithdrawCollateral = event('0xe80ebd7cc9223d7382aab2e0d1d6155c65651f83d53c8b9b06901d167e321142', {
    id: indexed(bytes32),
    caller: address,
    onBehalf: indexed(address),
    receiver: indexed(address),
    assets: uint256,
})
export type WithdrawCollateralEventArgs = EParams<typeof WithdrawCollateral>
