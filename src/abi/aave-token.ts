import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    BalanceTransfer: event("0x4beccb90f994c31aced7a23b5611020728a23d8ec5cddd1a3e9d97b96fda8666", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256, "index": p.uint256}),
    Burn: event("0x5d624aa9c148153ab3446c1b154f660ee7701e549fe9b62dab7171b1c80e6fa2", {"from": indexed(p.address), "target": indexed(p.address), "value": p.uint256, "index": p.uint256}),
    Initialized: event("0xb19e051f8af41150ccccb3fc2c2d8d15f4a4cf434f32a559ba75fe73d6eea20b", {"underlyingAsset": indexed(p.address), "pool": indexed(p.address), "treasury": p.address, "incentivesController": p.address, "aTokenDecimals": p.uint8, "aTokenName": p.string, "aTokenSymbol": p.string, "params": p.bytes}),
    Mint: event("0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f", {"from": indexed(p.address), "value": p.uint256, "index": p.uint256}),
    TokensRescued: event("0x77023e19c7343ad491fd706c36335ca0e738340a91f29b1fd81e2673d44896c4", {"tokenRescued": indexed(p.address), "receiver": indexed(p.address), "amountRescued": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    ATOKEN_REVISION: fun("0x0bd7ad3b", {}, p.uint256),
    DOMAIN_SEPARATOR: fun("0x3644e515", {}, p.bytes32),
    EIP712_REVISION: fun("0x78160376", {}, p.bytes),
    PERMIT_TYPEHASH: fun("0x30adf81f", {}, p.bytes32),
    POOL: fun("0x7535d246", {}, p.address),
    RESERVE_TREASURY_ADDRESS: fun("0xae167335", {}, p.address),
    UINT_MAX_VALUE: fun("0xd0fc81d2", {}, p.uint256),
    UNDERLYING_ASSET_ADDRESS: fun("0xb16a19de", {}, p.address),
    _nonces: fun("0xb9844d8d", {"_0": p.address}, p.uint256),
    allowance: fun("0xdd62ed3e", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", {"spender": p.address, "amount": p.uint256}, p.bool),
    balanceOf: fun("0x70a08231", {"user": p.address}, p.uint256),
    burn: fun("0xd7020d0a", {"user": p.address, "receiverOfUnderlying": p.address, "amount": p.uint256, "index": p.uint256}, ),
    decimals: fun("0x313ce567", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", {"spender": p.address, "subtractedValue": p.uint256}, p.bool),
    getIncentivesController: fun("0x75d26413", {}, p.address),
    getScaledUserBalanceAndSupply: fun("0x0afbcdc9", {"user": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    increaseAllowance: fun("0x39509351", {"spender": p.address, "addedValue": p.uint256}, p.bool),
    initialize: fun("0x3118724e", {"underlyingAssetDecimals": p.uint8, "tokenName": p.string, "tokenSymbol": p.string}, ),
    mint: fun("0x156e29f6", {"user": p.address, "amount": p.uint256, "index": p.uint256}, p.bool),
    mintToTreasury: fun("0x7df5bd3b", {"amount": p.uint256, "index": p.uint256}, ),
    name: fun("0x06fdde03", {}, p.string),
    permit: fun("0xd505accf", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    rescueTokens: fun("0xcea9d26f", {"token": p.address, "to": p.address, "amount": p.uint256}, ),
    scaledBalanceOf: fun("0x1da24f3e", {"user": p.address}, p.uint256),
    scaledTotalSupply: fun("0xb1bf962d", {}, p.uint256),
    symbol: fun("0x95d89b41", {}, p.string),
    totalSupply: fun("0x18160ddd", {}, p.uint256),
    transfer: fun("0xa9059cbb", {"recipient": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", {"sender": p.address, "recipient": p.address, "amount": p.uint256}, p.bool),
    transferOnLiquidation: fun("0xf866c319", {"from": p.address, "to": p.address, "value": p.uint256}, ),
    transferUnderlyingTo: fun("0x4efecaa5", {"target": p.address, "amount": p.uint256}, p.uint256),
}

export class Contract extends ContractBase {

    ATOKEN_REVISION() {
        return this.eth_call(functions.ATOKEN_REVISION, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    EIP712_REVISION() {
        return this.eth_call(functions.EIP712_REVISION, {})
    }

    PERMIT_TYPEHASH() {
        return this.eth_call(functions.PERMIT_TYPEHASH, {})
    }

    POOL() {
        return this.eth_call(functions.POOL, {})
    }

    RESERVE_TREASURY_ADDRESS() {
        return this.eth_call(functions.RESERVE_TREASURY_ADDRESS, {})
    }

    UINT_MAX_VALUE() {
        return this.eth_call(functions.UINT_MAX_VALUE, {})
    }

    UNDERLYING_ASSET_ADDRESS() {
        return this.eth_call(functions.UNDERLYING_ASSET_ADDRESS, {})
    }

    _nonces(_0: _noncesParams["_0"]) {
        return this.eth_call(functions._nonces, {_0})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    balanceOf(user: BalanceOfParams["user"]) {
        return this.eth_call(functions.balanceOf, {user})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getIncentivesController() {
        return this.eth_call(functions.getIncentivesController, {})
    }

    getScaledUserBalanceAndSupply(user: GetScaledUserBalanceAndSupplyParams["user"]) {
        return this.eth_call(functions.getScaledUserBalanceAndSupply, {user})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    scaledBalanceOf(user: ScaledBalanceOfParams["user"]) {
        return this.eth_call(functions.scaledBalanceOf, {user})
    }

    scaledTotalSupply() {
        return this.eth_call(functions.scaledTotalSupply, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type BalanceTransferEventArgs = EParams<typeof events.BalanceTransfer>
export type BurnEventArgs = EParams<typeof events.Burn>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type MintEventArgs = EParams<typeof events.Mint>
export type TokensRescuedEventArgs = EParams<typeof events.TokensRescued>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type ATOKEN_REVISIONParams = FunctionArguments<typeof functions.ATOKEN_REVISION>
export type ATOKEN_REVISIONReturn = FunctionReturn<typeof functions.ATOKEN_REVISION>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type EIP712_REVISIONParams = FunctionArguments<typeof functions.EIP712_REVISION>
export type EIP712_REVISIONReturn = FunctionReturn<typeof functions.EIP712_REVISION>

export type PERMIT_TYPEHASHParams = FunctionArguments<typeof functions.PERMIT_TYPEHASH>
export type PERMIT_TYPEHASHReturn = FunctionReturn<typeof functions.PERMIT_TYPEHASH>

export type POOLParams = FunctionArguments<typeof functions.POOL>
export type POOLReturn = FunctionReturn<typeof functions.POOL>

export type RESERVE_TREASURY_ADDRESSParams = FunctionArguments<typeof functions.RESERVE_TREASURY_ADDRESS>
export type RESERVE_TREASURY_ADDRESSReturn = FunctionReturn<typeof functions.RESERVE_TREASURY_ADDRESS>

export type UINT_MAX_VALUEParams = FunctionArguments<typeof functions.UINT_MAX_VALUE>
export type UINT_MAX_VALUEReturn = FunctionReturn<typeof functions.UINT_MAX_VALUE>

export type UNDERLYING_ASSET_ADDRESSParams = FunctionArguments<typeof functions.UNDERLYING_ASSET_ADDRESS>
export type UNDERLYING_ASSET_ADDRESSReturn = FunctionReturn<typeof functions.UNDERLYING_ASSET_ADDRESS>

export type _noncesParams = FunctionArguments<typeof functions._nonces>
export type _noncesReturn = FunctionReturn<typeof functions._nonces>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BurnParams = FunctionArguments<typeof functions.burn>
export type BurnReturn = FunctionReturn<typeof functions.burn>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type GetIncentivesControllerParams = FunctionArguments<typeof functions.getIncentivesController>
export type GetIncentivesControllerReturn = FunctionReturn<typeof functions.getIncentivesController>

export type GetScaledUserBalanceAndSupplyParams = FunctionArguments<typeof functions.getScaledUserBalanceAndSupply>
export type GetScaledUserBalanceAndSupplyReturn = FunctionReturn<typeof functions.getScaledUserBalanceAndSupply>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type MintToTreasuryParams = FunctionArguments<typeof functions.mintToTreasury>
export type MintToTreasuryReturn = FunctionReturn<typeof functions.mintToTreasury>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type RescueTokensParams = FunctionArguments<typeof functions.rescueTokens>
export type RescueTokensReturn = FunctionReturn<typeof functions.rescueTokens>

export type ScaledBalanceOfParams = FunctionArguments<typeof functions.scaledBalanceOf>
export type ScaledBalanceOfReturn = FunctionReturn<typeof functions.scaledBalanceOf>

export type ScaledTotalSupplyParams = FunctionArguments<typeof functions.scaledTotalSupply>
export type ScaledTotalSupplyReturn = FunctionReturn<typeof functions.scaledTotalSupply>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferOnLiquidationParams = FunctionArguments<typeof functions.transferOnLiquidation>
export type TransferOnLiquidationReturn = FunctionReturn<typeof functions.transferOnLiquidation>

export type TransferUnderlyingToParams = FunctionArguments<typeof functions.transferUnderlyingTo>
export type TransferUnderlyingToReturn = FunctionReturn<typeof functions.transferUnderlyingTo>

