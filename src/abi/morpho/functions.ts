import { address, array, bool, bytes, bytes32, struct, uint128, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DOMAIN_SEPARATOR() */
export const DOMAIN_SEPARATOR = func('0x3644e515', {}, bytes32)
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof DOMAIN_SEPARATOR>

/** accrueInterest((address,address,address,address,uint256)) */
export const accrueInterest = func('0x151c1ade', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
})
export type AccrueInterestParams = FunctionArguments<typeof accrueInterest>
export type AccrueInterestReturn = FunctionReturn<typeof accrueInterest>

/** borrow((address,address,address,address,uint256),uint256,uint256,address,address) */
export const borrow = func('0x50d8cd4b', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    assets: uint256,
    shares: uint256,
    onBehalf: address,
    receiver: address,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type BorrowParams = FunctionArguments<typeof borrow>
export type BorrowReturn = FunctionReturn<typeof borrow>

/** createMarket((address,address,address,address,uint256)) */
export const createMarket = func('0x8c1358a2', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
})
export type CreateMarketParams = FunctionArguments<typeof createMarket>
export type CreateMarketReturn = FunctionReturn<typeof createMarket>

/** enableIrm(address) */
export const enableIrm = func('0x5a64f51e', {
    irm: address,
})
export type EnableIrmParams = FunctionArguments<typeof enableIrm>
export type EnableIrmReturn = FunctionReturn<typeof enableIrm>

/** enableLltv(uint256) */
export const enableLltv = func('0x4d98a93b', {
    lltv: uint256,
})
export type EnableLltvParams = FunctionArguments<typeof enableLltv>
export type EnableLltvReturn = FunctionReturn<typeof enableLltv>

/** extSloads(bytes32[]) */
export const extSloads = func('0x7784c685', {
    slots: array(bytes32),
}, array(bytes32))
export type ExtSloadsParams = FunctionArguments<typeof extSloads>
export type ExtSloadsReturn = FunctionReturn<typeof extSloads>

/** feeRecipient() */
export const feeRecipient = func('0x46904840', {}, address)
export type FeeRecipientParams = FunctionArguments<typeof feeRecipient>
export type FeeRecipientReturn = FunctionReturn<typeof feeRecipient>

/** flashLoan(address,uint256,bytes) */
export const flashLoan = func('0xe0232b42', {
    token: address,
    assets: uint256,
    data: bytes,
})
export type FlashLoanParams = FunctionArguments<typeof flashLoan>
export type FlashLoanReturn = FunctionReturn<typeof flashLoan>

/** idToMarketParams(bytes32) */
export const idToMarketParams = func('0x2c3c9157', {
    _0: bytes32,
}, struct({
    loanToken: address,
    collateralToken: address,
    oracle: address,
    irm: address,
    lltv: uint256,
}))
export type IdToMarketParamsParams = FunctionArguments<typeof idToMarketParams>
export type IdToMarketParamsReturn = FunctionReturn<typeof idToMarketParams>

/** isAuthorized(address,address) */
export const isAuthorized = func('0x65e4ad9e', {
    _0: address,
    _1: address,
}, bool)
export type IsAuthorizedParams = FunctionArguments<typeof isAuthorized>
export type IsAuthorizedReturn = FunctionReturn<typeof isAuthorized>

/** isIrmEnabled(address) */
export const isIrmEnabled = func('0xf2b863ce', {
    _0: address,
}, bool)
export type IsIrmEnabledParams = FunctionArguments<typeof isIrmEnabled>
export type IsIrmEnabledReturn = FunctionReturn<typeof isIrmEnabled>

/** isLltvEnabled(uint256) */
export const isLltvEnabled = func('0xb485f3b8', {
    _0: uint256,
}, bool)
export type IsLltvEnabledParams = FunctionArguments<typeof isLltvEnabled>
export type IsLltvEnabledReturn = FunctionReturn<typeof isLltvEnabled>

/** liquidate((address,address,address,address,uint256),address,uint256,uint256,bytes) */
export const liquidate = func('0xd8eabcb8', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    borrower: address,
    seizedAssets: uint256,
    repaidShares: uint256,
    data: bytes,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type LiquidateParams = FunctionArguments<typeof liquidate>
export type LiquidateReturn = FunctionReturn<typeof liquidate>

/** market(bytes32) */
export const market = func('0x5c60e39a', {
    _0: bytes32,
}, struct({
    totalSupplyAssets: uint128,
    totalSupplyShares: uint128,
    totalBorrowAssets: uint128,
    totalBorrowShares: uint128,
    lastUpdate: uint128,
    fee: uint128,
}))
export type MarketParams = FunctionArguments<typeof market>
export type MarketReturn = FunctionReturn<typeof market>

/** nonce(address) */
export const nonce = func('0x70ae92d2', {
    _0: address,
}, uint256)
export type NonceParams = FunctionArguments<typeof nonce>
export type NonceReturn = FunctionReturn<typeof nonce>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** position(bytes32,address) */
export const position = func('0x93c52062', {
    _0: bytes32,
    _1: address,
}, struct({
    supplyShares: uint256,
    borrowShares: uint128,
    collateral: uint128,
}))
export type PositionParams = FunctionArguments<typeof position>
export type PositionReturn = FunctionReturn<typeof position>

/** repay((address,address,address,address,uint256),uint256,uint256,address,bytes) */
export const repay = func('0x20b76e81', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    assets: uint256,
    shares: uint256,
    onBehalf: address,
    data: bytes,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type RepayParams = FunctionArguments<typeof repay>
export type RepayReturn = FunctionReturn<typeof repay>

/** setAuthorization(address,bool) */
export const setAuthorization = func('0xeecea000', {
    authorized: address,
    newIsAuthorized: bool,
})
export type SetAuthorizationParams = FunctionArguments<typeof setAuthorization>
export type SetAuthorizationReturn = FunctionReturn<typeof setAuthorization>

/** setAuthorizationWithSig((address,address,bool,uint256,uint256),(uint8,bytes32,bytes32)) */
export const setAuthorizationWithSig = func('0x8069218f', {
    authorization: struct({
        authorizer: address,
        authorized: address,
        isAuthorized: bool,
        nonce: uint256,
        deadline: uint256,
    }),
    signature: struct({
        v: uint8,
        r: bytes32,
        s: bytes32,
    }),
})
export type SetAuthorizationWithSigParams = FunctionArguments<typeof setAuthorizationWithSig>
export type SetAuthorizationWithSigReturn = FunctionReturn<typeof setAuthorizationWithSig>

/** setFee((address,address,address,address,uint256),uint256) */
export const setFee = func('0x2b4f013c', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    newFee: uint256,
})
export type SetFeeParams = FunctionArguments<typeof setFee>
export type SetFeeReturn = FunctionReturn<typeof setFee>

/** setFeeRecipient(address) */
export const setFeeRecipient = func('0xe74b981b', {
    newFeeRecipient: address,
})
export type SetFeeRecipientParams = FunctionArguments<typeof setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof setFeeRecipient>

/** setOwner(address) */
export const setOwner = func('0x13af4035', {
    newOwner: address,
})
export type SetOwnerParams = FunctionArguments<typeof setOwner>
export type SetOwnerReturn = FunctionReturn<typeof setOwner>

/** supply((address,address,address,address,uint256),uint256,uint256,address,bytes) */
export const supply = func('0xa99aad89', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    assets: uint256,
    shares: uint256,
    onBehalf: address,
    data: bytes,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type SupplyParams = FunctionArguments<typeof supply>
export type SupplyReturn = FunctionReturn<typeof supply>

/** supplyCollateral((address,address,address,address,uint256),uint256,address,bytes) */
export const supplyCollateral = func('0x238d6579', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    assets: uint256,
    onBehalf: address,
    data: bytes,
})
export type SupplyCollateralParams = FunctionArguments<typeof supplyCollateral>
export type SupplyCollateralReturn = FunctionReturn<typeof supplyCollateral>

/** withdraw((address,address,address,address,uint256),uint256,uint256,address,address) */
export const withdraw = func('0x5c2bea49', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    assets: uint256,
    shares: uint256,
    onBehalf: address,
    receiver: address,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>

/** withdrawCollateral((address,address,address,address,uint256),uint256,address,address) */
export const withdrawCollateral = func('0x8720316d', {
    marketParams: struct({
        loanToken: address,
        collateralToken: address,
        oracle: address,
        irm: address,
        lltv: uint256,
    }),
    assets: uint256,
    onBehalf: address,
    receiver: address,
})
export type WithdrawCollateralParams = FunctionArguments<typeof withdrawCollateral>
export type WithdrawCollateralReturn = FunctionReturn<typeof withdrawCollateral>
