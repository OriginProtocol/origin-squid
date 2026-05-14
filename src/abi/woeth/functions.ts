import { address, bool, string, uint256, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    owner: address,
    spender: address,
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
    account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

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

/** decreaseAllowance(address,uint256) */
export const decreaseAllowance = func('0xa457c2d7', {
    spender: address,
    subtractedValue: uint256,
}, bool)
export type DecreaseAllowanceParams = FunctionArguments<typeof decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof decreaseAllowance>

/** deposit(uint256,address) */
export const deposit = func('0x6e553f65', {
    assets: uint256,
    receiver: address,
}, uint256)
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** increaseAllowance(address,uint256) */
export const increaseAllowance = func('0x39509351', {
    spender: address,
    addedValue: uint256,
}, bool)
export type IncreaseAllowanceParams = FunctionArguments<typeof increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof increaseAllowance>

/** initialize() */
export const initialize = func('0x8129fc1c', {})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

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

/** redeem(uint256,address,address) */
export const redeem = func('0xba087652', {
    shares: uint256,
    receiver: address,
    owner: address,
}, uint256)
export type RedeemParams = FunctionArguments<typeof redeem>
export type RedeemReturn = FunctionReturn<typeof redeem>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

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
    recipient: address,
    amount: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    sender: address,
    recipient: address,
    amount: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** transferToken(address,uint256) */
export const transferToken = func('0x1072cbea', {
    asset_: address,
    amount_: uint256,
})
export type TransferTokenParams = FunctionArguments<typeof transferToken>
export type TransferTokenReturn = FunctionReturn<typeof transferToken>

/** withdraw(uint256,address,address) */
export const withdraw = func('0xb460af94', {
    assets: uint256,
    receiver: address,
    owner: address,
}, uint256)
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>
