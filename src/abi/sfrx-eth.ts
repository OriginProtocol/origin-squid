import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", {"owner": indexed(p.address), "spender": indexed(p.address), "amount": p.uint256}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", {"caller": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    NewRewardsCycle: event("0x2fa39aac60d1c94cda4ab0e86ae9c0ffab5b926e5b827a4ccba1d9b5b2ef596e", {"cycleEnd": indexed(p.uint32), "rewardAmount": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", {"from": indexed(p.address), "to": indexed(p.address), "amount": p.uint256}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", {"caller": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
}

export const functions = {
    DOMAIN_SEPARATOR: fun("0x3644e515", {}, p.bytes32),
    allowance: fun("0xdd62ed3e", {"_0": p.address, "_1": p.address}, p.uint256),
    approve: fun("0x095ea7b3", {"spender": p.address, "amount": p.uint256}, p.bool),
    asset: fun("0x38d52e0f", {}, p.address),
    balanceOf: fun("0x70a08231", {"_0": p.address}, p.uint256),
    convertToAssets: fun("0x07a2d13a", {"shares": p.uint256}, p.uint256),
    convertToShares: fun("0xc6e6f592", {"assets": p.uint256}, p.uint256),
    decimals: fun("0x313ce567", {}, p.uint8),
    deposit: fun("0x6e553f65", {"assets": p.uint256, "receiver": p.address}, p.uint256),
    depositWithSignature: fun("0x75e077c3", {"assets": p.uint256, "receiver": p.address, "deadline": p.uint256, "approveMax": p.bool, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, p.uint256),
    lastRewardAmount: fun("0xbafedcaa", {}, p.uint192),
    lastSync: fun("0x6917516b", {}, p.uint32),
    maxDeposit: fun("0x402d267d", {"_0": p.address}, p.uint256),
    maxMint: fun("0xc63d75b6", {"_0": p.address}, p.uint256),
    maxRedeem: fun("0xd905777e", {"owner": p.address}, p.uint256),
    maxWithdraw: fun("0xce96cb77", {"owner": p.address}, p.uint256),
    mint: fun("0x94bf804d", {"shares": p.uint256, "receiver": p.address}, p.uint256),
    name: fun("0x06fdde03", {}, p.string),
    nonces: fun("0x7ecebe00", {"_0": p.address}, p.uint256),
    permit: fun("0xd505accf", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    previewDeposit: fun("0xef8b30f7", {"assets": p.uint256}, p.uint256),
    previewMint: fun("0xb3d7f6b9", {"shares": p.uint256}, p.uint256),
    previewRedeem: fun("0x4cdad506", {"shares": p.uint256}, p.uint256),
    previewWithdraw: fun("0x0a28a477", {"assets": p.uint256}, p.uint256),
    pricePerShare: fun("0x99530b06", {}, p.uint256),
    redeem: fun("0xba087652", {"shares": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
    rewardsCycleEnd: fun("0xe7ff69f1", {}, p.uint32),
    rewardsCycleLength: fun("0x6fcf5e5f", {}, p.uint32),
    symbol: fun("0x95d89b41", {}, p.string),
    syncRewards: fun("0x72c0c211", {}, ),
    totalAssets: fun("0x01e1d114", {}, p.uint256),
    totalSupply: fun("0x18160ddd", {}, p.uint256),
    transfer: fun("0xa9059cbb", {"to": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", {"from": p.address, "to": p.address, "amount": p.uint256}, p.bool),
    withdraw: fun("0xb460af94", {"assets": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    allowance(_0: AllowanceParams["_0"], _1: AllowanceParams["_1"]) {
        return this.eth_call(functions.allowance, {_0, _1})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(_0: BalanceOfParams["_0"]) {
        return this.eth_call(functions.balanceOf, {_0})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    lastRewardAmount() {
        return this.eth_call(functions.lastRewardAmount, {})
    }

    lastSync() {
        return this.eth_call(functions.lastSync, {})
    }

    maxDeposit(_0: MaxDepositParams["_0"]) {
        return this.eth_call(functions.maxDeposit, {_0})
    }

    maxMint(_0: MaxMintParams["_0"]) {
        return this.eth_call(functions.maxMint, {_0})
    }

    maxRedeem(owner: MaxRedeemParams["owner"]) {
        return this.eth_call(functions.maxRedeem, {owner})
    }

    maxWithdraw(owner: MaxWithdrawParams["owner"]) {
        return this.eth_call(functions.maxWithdraw, {owner})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonces(_0: NoncesParams["_0"]) {
        return this.eth_call(functions.nonces, {_0})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(functions.previewDeposit, {assets})
    }

    previewMint(shares: PreviewMintParams["shares"]) {
        return this.eth_call(functions.previewMint, {shares})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(functions.previewRedeem, {shares})
    }

    previewWithdraw(assets: PreviewWithdrawParams["assets"]) {
        return this.eth_call(functions.previewWithdraw, {assets})
    }

    pricePerShare() {
        return this.eth_call(functions.pricePerShare, {})
    }

    rewardsCycleEnd() {
        return this.eth_call(functions.rewardsCycleEnd, {})
    }

    rewardsCycleLength() {
        return this.eth_call(functions.rewardsCycleLength, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type NewRewardsCycleEventArgs = EParams<typeof events.NewRewardsCycle>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssetParams = FunctionArguments<typeof functions.asset>
export type AssetReturn = FunctionReturn<typeof functions.asset>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositWithSignatureParams = FunctionArguments<typeof functions.depositWithSignature>
export type DepositWithSignatureReturn = FunctionReturn<typeof functions.depositWithSignature>

export type LastRewardAmountParams = FunctionArguments<typeof functions.lastRewardAmount>
export type LastRewardAmountReturn = FunctionReturn<typeof functions.lastRewardAmount>

export type LastSyncParams = FunctionArguments<typeof functions.lastSync>
export type LastSyncReturn = FunctionReturn<typeof functions.lastSync>

export type MaxDepositParams = FunctionArguments<typeof functions.maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof functions.maxDeposit>

export type MaxMintParams = FunctionArguments<typeof functions.maxMint>
export type MaxMintReturn = FunctionReturn<typeof functions.maxMint>

export type MaxRedeemParams = FunctionArguments<typeof functions.maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof functions.maxRedeem>

export type MaxWithdrawParams = FunctionArguments<typeof functions.maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof functions.maxWithdraw>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewMintParams = FunctionArguments<typeof functions.previewMint>
export type PreviewMintReturn = FunctionReturn<typeof functions.previewMint>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type PricePerShareParams = FunctionArguments<typeof functions.pricePerShare>
export type PricePerShareReturn = FunctionReturn<typeof functions.pricePerShare>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RewardsCycleEndParams = FunctionArguments<typeof functions.rewardsCycleEnd>
export type RewardsCycleEndReturn = FunctionReturn<typeof functions.rewardsCycleEnd>

export type RewardsCycleLengthParams = FunctionArguments<typeof functions.rewardsCycleLength>
export type RewardsCycleLengthReturn = FunctionReturn<typeof functions.rewardsCycleLength>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type SyncRewardsParams = FunctionArguments<typeof functions.syncRewards>
export type SyncRewardsReturn = FunctionReturn<typeof functions.syncRewards>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

