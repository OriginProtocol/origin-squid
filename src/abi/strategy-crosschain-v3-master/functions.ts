import { address, array, bool, bytes, uint256, uint64 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** assetToPToken(address) */
export const assetToPToken = func('0x0fc3b4c4', {
    _0: address,
}, address)
export type AssetToPTokenParams = FunctionArguments<typeof assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof assetToPToken>

/** bridgeAsset() */
export const bridgeAsset = func('0x4d877550', {}, address)
export type BridgeAssetParams = FunctionArguments<typeof bridgeAsset>
export type BridgeAssetReturn = FunctionReturn<typeof bridgeAsset>

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
    _asset: address,
    _amount: uint256,
})
export type DepositParams = FunctionArguments<typeof deposit>
export type DepositReturn = FunctionReturn<typeof deposit>

/** depositAll() */
export const depositAll = func('0xde5f6268', {})
export type DepositAllParams = FunctionArguments<typeof depositAll>
export type DepositAllReturn = FunctionReturn<typeof depositAll>

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

/** inboundAdapter() */
export const inboundAdapter = func('0x4ce5dbf6', {}, address)
export type InboundAdapterParams = FunctionArguments<typeof inboundAdapter>
export type InboundAdapterReturn = FunctionReturn<typeof inboundAdapter>

/** initialize(address) */
export const initialize = func('0xc4d66de8', {
    _operator: address,
})
export type InitializeParams = FunctionArguments<typeof initialize>
export type InitializeReturn = FunctionReturn<typeof initialize>

/** isGovernor() */
export const isGovernor = func('0xc7af3352', {}, bool)
export type IsGovernorParams = FunctionArguments<typeof isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof isGovernor>

/** isYieldOpInFlight() */
export const isYieldOpInFlight = func('0xd19fdadd', {}, bool)
export type IsYieldOpInFlightParams = FunctionArguments<typeof isYieldOpInFlight>
export type IsYieldOpInFlightReturn = FunctionReturn<typeof isYieldOpInFlight>

/** lastBalanceCheckTimestamp() */
export const lastBalanceCheckTimestamp = func('0x19cd7792', {}, uint256)
export type LastBalanceCheckTimestampParams = FunctionArguments<typeof lastBalanceCheckTimestamp>
export type LastBalanceCheckTimestampReturn = FunctionReturn<typeof lastBalanceCheckTimestamp>

/** lastYieldNonce() */
export const lastYieldNonce = func('0x453bd1da', {}, uint64)
export type LastYieldNonceParams = FunctionArguments<typeof lastYieldNonce>
export type LastYieldNonceReturn = FunctionReturn<typeof lastYieldNonce>

/** nonceProcessed(uint64) */
export const nonceProcessed = func('0x171006a7', {
    _0: uint64,
}, bool)
export type NonceProcessedParams = FunctionArguments<typeof nonceProcessed>
export type NonceProcessedReturn = FunctionReturn<typeof nonceProcessed>

/** operator() */
export const operator = func('0x570ca735', {}, address)
export type OperatorParams = FunctionArguments<typeof operator>
export type OperatorReturn = FunctionReturn<typeof operator>

/** outboundAdapter() */
export const outboundAdapter = func('0x55129999', {}, address)
export type OutboundAdapterParams = FunctionArguments<typeof outboundAdapter>
export type OutboundAdapterReturn = FunctionReturn<typeof outboundAdapter>

/** pendingDepositAmount() */
export const pendingDepositAmount = func('0xeda6d6be', {}, uint256)
export type PendingDepositAmountParams = FunctionArguments<typeof pendingDepositAmount>
export type PendingDepositAmountReturn = FunctionReturn<typeof pendingDepositAmount>

/** pendingWithdrawalAmount() */
export const pendingWithdrawalAmount = func('0x2c5b1066', {}, uint256)
export type PendingWithdrawalAmountParams = FunctionArguments<typeof pendingWithdrawalAmount>
export type PendingWithdrawalAmountReturn = FunctionReturn<typeof pendingWithdrawalAmount>

/** platformAddress() */
export const platformAddress = func('0xdbe55e56', {}, address)
export type PlatformAddressParams = FunctionArguments<typeof platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof platformAddress>

/** receiveMessage(address,address,uint256,bytes) */
export const receiveMessage = func('0x06c2239e', {
    _0: address,
    _1: address,
    amountReceived: uint256,
    payload: bytes,
})
export type ReceiveMessageParams = FunctionArguments<typeof receiveMessage>
export type ReceiveMessageReturn = FunctionReturn<typeof receiveMessage>

/** remoteStrategyBalance() */
export const remoteStrategyBalance = func('0xed42412b', {}, uint256)
export type RemoteStrategyBalanceParams = FunctionArguments<typeof remoteStrategyBalance>
export type RemoteStrategyBalanceReturn = FunctionReturn<typeof remoteStrategyBalance>

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

/** setInboundAdapter(address) */
export const setInboundAdapter = func('0xd5240ed0', {
    _inboundAdapter: address,
})
export type SetInboundAdapterParams = FunctionArguments<typeof setInboundAdapter>
export type SetInboundAdapterReturn = FunctionReturn<typeof setInboundAdapter>

/** setOperator(address) */
export const setOperator = func('0xb3ab15fb', {
    _operator: address,
})
export type SetOperatorParams = FunctionArguments<typeof setOperator>
export type SetOperatorReturn = FunctionReturn<typeof setOperator>

/** setOutboundAdapter(address) */
export const setOutboundAdapter = func('0xcdf6353c', {
    _outboundAdapter: address,
})
export type SetOutboundAdapterParams = FunctionArguments<typeof setOutboundAdapter>
export type SetOutboundAdapterReturn = FunctionReturn<typeof setOutboundAdapter>

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

/** transferNative(uint256) */
export const transferNative = func('0x68c0b18b', {
    amount: uint256,
})
export type TransferNativeParams = FunctionArguments<typeof transferNative>
export type TransferNativeReturn = FunctionReturn<typeof transferNative>

/** transferToken(address,uint256) */
export const transferToken = func('0x1072cbea', {
    _asset: address,
    _amount: uint256,
})
export type TransferTokenParams = FunctionArguments<typeof transferToken>
export type TransferTokenReturn = FunctionReturn<typeof transferToken>

/** triggerClaim() */
export const triggerClaim = func('0xef21fe5a', {})
export type TriggerClaimParams = FunctionArguments<typeof triggerClaim>
export type TriggerClaimReturn = FunctionReturn<typeof triggerClaim>

/** vaultAddress() */
export const vaultAddress = func('0x430bf08a', {}, address)
export type VaultAddressParams = FunctionArguments<typeof vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof vaultAddress>

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
