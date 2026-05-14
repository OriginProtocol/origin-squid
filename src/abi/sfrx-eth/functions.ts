import { address, bool, bytes32, string, uint192, uint256, uint32, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DOMAIN_SEPARATOR() */
export const DOMAIN_SEPARATOR = func('0x3644e515', {}, bytes32)
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof DOMAIN_SEPARATOR>

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    _0: address,
    _1: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    spender: address,
    amount: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** asset() */
export const asset = func('0x38d52e0f', {}, address)
export type AssetParams = FunctionArguments<typeof asset>
export type AssetReturn = FunctionReturn<typeof asset>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    _0: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** convertToAssets(uint256) */
export const convertToAssets = func('0x07a2d13a', {
    shares: uint256,
}, uint256)
export type ConvertToAssetsParams = FunctionArguments<typeof convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof convertToAssets>

/** convertToShares(uint256) */
export const convertToShares = func('0xc6e6f592', {
    assets: uint256,
}, uint256)
export type ConvertToSharesParams = FunctionArguments<typeof convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof convertToShares>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** deposit(uint256,address) */
export const deposit = func('0x6e553f65', {
    assets: uint256,
    receiver: address,
}, uint256)
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** depositWithSignature(uint256,address,uint256,bool,uint8,bytes32,bytes32) */
export const depositWithSignature = func('0x75e077c3', {
    assets: uint256,
    receiver: address,
    deadline: uint256,
    approveMax: bool,
    v: uint8,
    r: bytes32,
    s: bytes32,
}, uint256)
export type DepositWithSignatureParams = FunctionArguments<typeof depositWithSignature>
export type DepositWithSignatureReturn = FunctionReturn<typeof depositWithSignature>

/** lastRewardAmount() */
export const lastRewardAmount = func('0xbafedcaa', {}, uint192)
export type LastRewardAmountParams = FunctionArguments<typeof lastRewardAmount>
export type LastRewardAmountReturn = FunctionReturn<typeof lastRewardAmount>

/** lastSync() */
export const lastSync = func('0x6917516b', {}, uint32)
export type LastSyncParams = FunctionArguments<typeof lastSync>
export type LastSyncReturn = FunctionReturn<typeof lastSync>

/** maxDeposit(address) */
export const maxDeposit = func('0x402d267d', {
    _0: address,
}, uint256)
export type MaxDepositParams = FunctionArguments<typeof maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof maxDeposit>

/** maxMint(address) */
export const maxMint = func('0xc63d75b6', {
    _0: address,
}, uint256)
export type MaxMintParams = FunctionArguments<typeof maxMint>
export type MaxMintReturn = FunctionReturn<typeof maxMint>

/** maxRedeem(address) */
export const maxRedeem = func('0xd905777e', {
    owner: address,
}, uint256)
export type MaxRedeemParams = FunctionArguments<typeof maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof maxRedeem>

/** maxWithdraw(address) */
export const maxWithdraw = func('0xce96cb77', {
    owner: address,
}, uint256)
export type MaxWithdrawParams = FunctionArguments<typeof maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof maxWithdraw>

/** mint(uint256,address) */
export const mint = func('0x94bf804d', {
    shares: uint256,
    receiver: address,
}, uint256)
export type MintParams = FunctionArguments<typeof mint>
export type MintReturn = FunctionReturn<typeof mint>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** nonces(address) */
export const nonces = func('0x7ecebe00', {
    _0: address,
}, uint256)
export type NoncesParams = FunctionArguments<typeof nonces>
export type NoncesReturn = FunctionReturn<typeof nonces>

/** permit(address,address,uint256,uint256,uint8,bytes32,bytes32) */
export const permit = func('0xd505accf', {
    owner: address,
    spender: address,
    value: uint256,
    deadline: uint256,
    v: uint8,
    r: bytes32,
    s: bytes32,
})
export type PermitParams = FunctionArguments<typeof permit>
export type PermitReturn = FunctionReturn<typeof permit>

/** previewDeposit(uint256) */
export const previewDeposit = func('0xef8b30f7', {
    assets: uint256,
}, uint256)
export type PreviewDepositParams = FunctionArguments<typeof previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof previewDeposit>

/** previewMint(uint256) */
export const previewMint = func('0xb3d7f6b9', {
    shares: uint256,
}, uint256)
export type PreviewMintParams = FunctionArguments<typeof previewMint>
export type PreviewMintReturn = FunctionReturn<typeof previewMint>

/** previewRedeem(uint256) */
export const previewRedeem = func('0x4cdad506', {
    shares: uint256,
}, uint256)
export type PreviewRedeemParams = FunctionArguments<typeof previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof previewRedeem>

/** previewWithdraw(uint256) */
export const previewWithdraw = func('0x0a28a477', {
    assets: uint256,
}, uint256)
export type PreviewWithdrawParams = FunctionArguments<typeof previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof previewWithdraw>

/** pricePerShare() */
export const pricePerShare = func('0x99530b06', {}, uint256)
export type PricePerShareParams = FunctionArguments<typeof pricePerShare>
export type PricePerShareReturn = FunctionReturn<typeof pricePerShare>

/** redeem(uint256,address,address) */
export const redeem = func('0xba087652', {
    shares: uint256,
    receiver: address,
    owner: address,
}, uint256)
export type RedeemParams = FunctionArguments<typeof redeem>
export type RedeemReturn = FunctionReturn<typeof redeem>

/** rewardsCycleEnd() */
export const rewardsCycleEnd = func('0xe7ff69f1', {}, uint32)
export type RewardsCycleEndParams = FunctionArguments<typeof rewardsCycleEnd>
export type RewardsCycleEndReturn = FunctionReturn<typeof rewardsCycleEnd>

/** rewardsCycleLength() */
export const rewardsCycleLength = func('0x6fcf5e5f', {}, uint32)
export type RewardsCycleLengthParams = FunctionArguments<typeof rewardsCycleLength>
export type RewardsCycleLengthReturn = FunctionReturn<typeof rewardsCycleLength>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** syncRewards() */
export const syncRewards = func('0x72c0c211', {})
export type SyncRewardsParams = FunctionArguments<typeof syncRewards>
export type SyncRewardsReturn = FunctionReturn<typeof syncRewards>

/** totalAssets() */
export const totalAssets = func('0x01e1d114', {}, uint256)
export type TotalAssetsParams = FunctionArguments<typeof totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof totalAssets>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    to: address,
    amount: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    from: address,
    to: address,
    amount: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** withdraw(uint256,address,address) */
export const withdraw = func('0xb460af94', {
    assets: uint256,
    receiver: address,
    owner: address,
}, uint256)
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>
