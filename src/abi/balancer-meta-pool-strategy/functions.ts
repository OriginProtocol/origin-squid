import { address, array, bool, bytes32, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** assetToPToken(address) */
export const assetToPToken = func('0x0fc3b4c4', {
    _0: address,
}, address)
export type AssetToPTokenParams = FunctionArguments<typeof assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof assetToPToken>

/** auraRewardPoolAddress() */
export const auraRewardPoolAddress = func('0x3132a21d', {}, address)
export type AuraRewardPoolAddressParams = FunctionArguments<typeof auraRewardPoolAddress>
export type AuraRewardPoolAddressReturn = FunctionReturn<typeof auraRewardPoolAddress>

/** balancerPoolId() */
export const balancerPoolId = func('0xdbbb64b9', {}, bytes32)
export type BalancerPoolIdParams = FunctionArguments<typeof balancerPoolId>
export type BalancerPoolIdReturn = FunctionReturn<typeof balancerPoolId>

/** balancerVault() */
export const balancerVault = func('0x158274a5', {}, address)
export type BalancerVaultParams = FunctionArguments<typeof balancerVault>
export type BalancerVaultReturn = FunctionReturn<typeof balancerVault>

/** checkBalance(address) */
export const checkBalance = func('0x5f515226', {
    _asset: address,
}, uint256)
export type CheckBalanceParams = FunctionArguments<typeof checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof checkBalance>

/** checkBalance() */
export const checkBalance_1 = func('0xc71daccb', {}, uint256)
export type CheckBalanceParams_1 = FunctionArguments<typeof checkBalance_1>
export type CheckBalanceReturn_1 = FunctionReturn<typeof checkBalance_1>

/** claimGovernance() */
export const claimGovernance = func('0x5d36b190', {})
export type ClaimGovernanceParams = FunctionArguments<typeof claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof claimGovernance>

/** collectRewardTokens() */
export const collectRewardTokens = func('0x5a063f63', {})
export type CollectRewardTokensParams = FunctionArguments<typeof collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof collectRewardTokens>

/** deposit(address,uint256) */
export const deposit = func('0x47e7ef24', {
    _0: address,
    _1: uint256,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** deposit(address[],uint256[]) */
export const deposit_1 = func('0xefc908a1', {
    _0: array(address),
    _1: array(uint256),
})
export type DepositParams_1 = FunctionArguments<typeof deposit_1>
export type DepositReturn_1 = FunctionReturn<typeof deposit_1>

/** depositAll() */
export const depositAll = func('0xde5f6268', {})
export type DepositAllParams = FunctionArguments<typeof depositAll>
export type DepositAllReturn = FunctionReturn<typeof depositAll>

/** frxETH() */
export const frxETH = func('0x565d3e6e', {}, address)
export type FrxETHParams = FunctionArguments<typeof frxETH>
export type FrxETHReturn = FunctionReturn<typeof frxETH>

/** getRewardTokenAddresses() */
export const getRewardTokenAddresses = func('0xf6ca71b0', {}, array(address))
export type GetRewardTokenAddressesParams = FunctionArguments<typeof getRewardTokenAddresses>
export type GetRewardTokenAddressesReturn = FunctionReturn<typeof getRewardTokenAddresses>

/** governor() */
export const governor = func('0x0c340a24', {}, address)
export type GovernorParams = FunctionArguments<typeof governor>
export type GovernorReturn = FunctionReturn<typeof governor>

/** harvesterAddress() */
export const harvesterAddress = func('0x67c7066c', {}, address)
export type HarvesterAddressParams = FunctionArguments<typeof harvesterAddress>
export type HarvesterAddressReturn = FunctionReturn<typeof harvesterAddress>

/** initialize(address[],address[],address[]) */
export const initialize = func('0x435356d1', {
    _rewardTokenAddresses: array(address),
    _assets: array(address),
    _pTokens: array(address),
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** maxDepositDeviation() */
export const maxDepositDeviation = func('0x3f6f7a14', {}, uint256)
export type MaxDepositDeviationParams = FunctionArguments<typeof maxDepositDeviation>
export type MaxDepositDeviationReturn = FunctionReturn<typeof maxDepositDeviation>

/** maxWithdrawalDeviation() */
export const maxWithdrawalDeviation = func('0x14f0747e', {}, uint256)
export type MaxWithdrawalDeviationParams = FunctionArguments<typeof maxWithdrawalDeviation>
export type MaxWithdrawalDeviationReturn = FunctionReturn<typeof maxWithdrawalDeviation>

/** platformAddress() */
export const platformAddress = func('0xdbe55e56', {}, address)
export type PlatformAddressParams = FunctionArguments<typeof platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof platformAddress>

/** rETH() */
export const rETH = func('0xca8aa0e4', {}, address)
export type RETHParams = FunctionArguments<typeof rETH>
export type RETHReturn = FunctionReturn<typeof rETH>

/** removePToken(uint256) */
export const removePToken = func('0x9136616a', {
    _assetIndex: uint256,
})
export type RemovePTokenParams = FunctionArguments<typeof removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof removePToken>

/** rewardTokenAddresses(uint256) */
export const rewardTokenAddresses = func('0x7b2d9b2c', {
    _0: uint256,
}, address)
export type RewardTokenAddressesParams = FunctionArguments<typeof rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof rewardTokenAddresses>

/** safeApproveAllTokens() */
export const safeApproveAllTokens = func('0xad1728cb', {})
export type SafeApproveAllTokensParams = FunctionArguments<typeof safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof safeApproveAllTokens>

/** setHarvesterAddress(address) */
export const setHarvesterAddress = func('0xc2e1e3f4', {
    _harvesterAddress: address,
})
export type SetHarvesterAddressParams = FunctionArguments<typeof setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof setHarvesterAddress>

/** setMaxDepositDeviation(uint256) */
export const setMaxDepositDeviation = func('0x683c1ef9', {
    _maxDepositDeviation: uint256,
})
export type SetMaxDepositDeviationParams = FunctionArguments<typeof setMaxDepositDeviation>
export type SetMaxDepositDeviationReturn = FunctionReturn<typeof setMaxDepositDeviation>

/** setMaxWithdrawalDeviation(uint256) */
export const setMaxWithdrawalDeviation = func('0x79e66fcc', {
    _maxWithdrawalDeviation: uint256,
})
export type SetMaxWithdrawalDeviationParams = FunctionArguments<typeof setMaxWithdrawalDeviation>
export type SetMaxWithdrawalDeviationReturn = FunctionReturn<typeof setMaxWithdrawalDeviation>

/** setPTokenAddress(address,address) */
export const setPTokenAddress = func('0x0ed57b3a', {
    _asset: address,
    _pToken: address,
})
export type SetPTokenAddressParams = FunctionArguments<typeof setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof setPTokenAddress>

/** setRewardTokenAddresses(address[]) */
export const setRewardTokenAddresses = func('0x96d538bb', {
    _rewardTokenAddresses: array(address),
})
export type SetRewardTokenAddressesParams = FunctionArguments<typeof setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof setRewardTokenAddresses>

/** sfrxETH() */
export const sfrxETH = func('0xc9ac8c8e', {}, address)
export type SfrxETHParams = FunctionArguments<typeof sfrxETH>
export type SfrxETHReturn = FunctionReturn<typeof sfrxETH>

/** stETH() */
export const stETH = func('0xc1fe3e48', {}, address)
export type StETHParams = FunctionArguments<typeof stETH>
export type StETHReturn = FunctionReturn<typeof stETH>

/** supportsAsset(address) */
export const supportsAsset = func('0xaa388af6', {
    _asset: address,
}, bool)
export type SupportsAssetParams = FunctionArguments<typeof supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof supportsAsset>

/** transferGovernance(address) */
export const transferGovernance = func('0xd38bfff4', {
    _newGovernor: address,
})
export type TransferGovernanceParams = FunctionArguments<typeof transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof transferGovernance>

/** transferToken(address,uint256) */
export const transferToken = func('0x1072cbea', {
    _asset: address,
    _amount: uint256,
})
export type TransferTokenParams = FunctionArguments<typeof transferToken>
export type TransferTokenReturn = FunctionReturn<typeof transferToken>

/** vaultAddress() */
export const vaultAddress = func('0x430bf08a', {}, address)
export type VaultAddressParams = FunctionArguments<typeof vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof vaultAddress>

/** withdraw(address,address,uint256) */
export const withdraw = func('0xd9caed12', {
    _recipient: address,
    _strategyAsset: address,
    _strategyAmount: uint256,
})
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>

/** withdraw(address,address[],uint256[]) */
export const withdraw_1 = func('0xedbd7668', {
    _recipient: address,
    _strategyAssets: array(address),
    _strategyAmounts: array(uint256),
})
export type WithdrawParams_1 = FunctionArguments<typeof withdraw_1>
export type WithdrawReturn_1 = FunctionReturn<typeof withdraw_1>

/** withdrawAll() */
export const withdrawAll = func('0x853828b6', {})
export type WithdrawAllParams = FunctionArguments<typeof withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof withdrawAll>

/** wstETH() */
export const wstETH = func('0x4aa07e64', {}, address)
export type WstETHParams = FunctionArguments<typeof wstETH>
export type WstETHReturn = FunctionReturn<typeof wstETH>
