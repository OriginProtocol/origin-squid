import { address, array, bool, uint128, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** MAX_PRICE_STALENESS() */
export const MAX_PRICE_STALENESS = func('0xd6913b32', {}, uint256)
export type MAX_PRICE_STALENESSParams = FunctionArguments<typeof MAX_PRICE_STALENESS>
export type MAX_PRICE_STALENESSReturn = FunctionReturn<typeof MAX_PRICE_STALENESS>

/** assetToPToken(address) */
export const assetToPToken = func('0x0fc3b4c4', {
    _0: address,
}, address)
export type AssetToPTokenParams = FunctionArguments<typeof assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof assetToPToken>

/** bridgedWOETH() */
export const bridgedWOETH = func('0xaeaf191b', {}, address)
export type BridgedWOETHParams = FunctionArguments<typeof bridgedWOETH>
export type BridgedWOETHReturn = FunctionReturn<typeof bridgedWOETH>

/** checkBalance(address) */
export const checkBalance = func('0x5f515226', {
    _asset: address,
}, uint256)
export type CheckBalanceParams = FunctionArguments<typeof checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof checkBalance>

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

/** depositAll() */
export const depositAll = func('0xde5f6268', {})
export type DepositAllParams = FunctionArguments<typeof depositAll>
export type DepositAllReturn = FunctionReturn<typeof depositAll>

/** depositBridgedWOETH(uint256) */
export const depositBridgedWOETH = func('0xd6e772a4', {
    woethAmount: uint256,
})
export type DepositBridgedWOETHParams = FunctionArguments<typeof depositBridgedWOETH>
export type DepositBridgedWOETHReturn = FunctionReturn<typeof depositBridgedWOETH>

/** getBridgedWOETHValue(uint256) */
export const getBridgedWOETHValue = func('0x7e50ac3f', {
    woethAmount: uint256,
}, uint256)
export type GetBridgedWOETHValueParams = FunctionArguments<typeof getBridgedWOETHValue>
export type GetBridgedWOETHValueReturn = FunctionReturn<typeof getBridgedWOETHValue>

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

/** initialize(uint128) */
export const initialize = func('0x56db9ef1', {
    _maxPriceDiffBps: uint128,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** lastOraclePrice() */
export const lastOraclePrice = func('0x349f7173', {}, uint128)
export type LastOraclePriceParams = FunctionArguments<typeof lastOraclePrice>
export type LastOraclePriceReturn = FunctionReturn<typeof lastOraclePrice>

/** maxPriceDiffBps() */
export const maxPriceDiffBps = func('0x951ba637', {}, uint128)
export type MaxPriceDiffBpsParams = FunctionArguments<typeof maxPriceDiffBps>
export type MaxPriceDiffBpsReturn = FunctionReturn<typeof maxPriceDiffBps>

/** oethb() */
export const oethb = func('0x6dea9b19', {}, address)
export type OethbParams = FunctionArguments<typeof oethb>
export type OethbReturn = FunctionReturn<typeof oethb>

/** platformAddress() */
export const platformAddress = func('0xdbe55e56', {}, address)
export type PlatformAddressParams = FunctionArguments<typeof platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof platformAddress>

/** removePToken(uint256) */
export const removePToken = func('0x9136616a', {
    _0: uint256,
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

/** setMaxPriceDiffBps(uint128) */
export const setMaxPriceDiffBps = func('0x3ad12229', {
    _maxPriceDiffBps: uint128,
})
export type SetMaxPriceDiffBpsParams = FunctionArguments<typeof setMaxPriceDiffBps>
export type SetMaxPriceDiffBpsReturn = FunctionReturn<typeof setMaxPriceDiffBps>

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

/** updateWOETHOraclePrice() */
export const updateWOETHOraclePrice = func('0x6c713833', {}, uint256)
export type UpdateWOETHOraclePriceParams = FunctionArguments<typeof updateWOETHOraclePrice>
export type UpdateWOETHOraclePriceReturn = FunctionReturn<typeof updateWOETHOraclePrice>

/** vaultAddress() */
export const vaultAddress = func('0x430bf08a', {}, address)
export type VaultAddressParams = FunctionArguments<typeof vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof vaultAddress>

/** weth() */
export const weth = func('0x3fc8cef3', {}, address)
export type WethParams = FunctionArguments<typeof weth>
export type WethReturn = FunctionReturn<typeof weth>

/** withdraw(address,address,uint256) */
export const withdraw = func('0xd9caed12', {
    _recipient: address,
    _asset: address,
    _amount: uint256,
})
export type WithdrawParams = FunctionArguments<typeof withdraw>
export type WithdrawReturn = FunctionReturn<typeof withdraw>

/** withdrawAll() */
export const withdrawAll = func('0x853828b6', {})
export type WithdrawAllParams = FunctionArguments<typeof withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof withdrawAll>

/** withdrawBridgedWOETH(uint256) */
export const withdrawBridgedWOETH = func('0x2579fe8a', {
    oethToBurn: uint256,
})
export type WithdrawBridgedWOETHParams = FunctionArguments<typeof withdrawBridgedWOETH>
export type WithdrawBridgedWOETHReturn = FunctionReturn<typeof withdrawBridgedWOETH>
