import { address, array, bool, bytes, bytes32, struct, uint128, uint256, uint32, uint40, uint64, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** BEACON_PROOFS() */
export const BEACON_PROOFS = func('0x7da9982a', {}, address)
export type BEACON_PROOFSParams = FunctionArguments<typeof BEACON_PROOFS>
export type BEACON_PROOFSReturn = FunctionReturn<typeof BEACON_PROOFS>

/** SNAP_BALANCES_DELAY() */
export const SNAP_BALANCES_DELAY = func('0x9fb7247d', {}, uint64)
export type SNAP_BALANCES_DELAYParams = FunctionArguments<typeof SNAP_BALANCES_DELAY>
export type SNAP_BALANCES_DELAYReturn = FunctionReturn<typeof SNAP_BALANCES_DELAY>

/** assetToPToken(address) */
export const assetToPToken = func('0x0fc3b4c4', {
    _0: address,
}, address)
export type AssetToPTokenParams = FunctionArguments<typeof assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof assetToPToken>

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

/** depositList(uint256) */
export const depositList = func('0xb8ec6678', {
    _0: uint256,
}, bytes32)
export type DepositListParams = FunctionArguments<typeof depositList>
export type DepositListReturn = FunctionReturn<typeof depositList>

/** depositListLength() */
export const depositListLength = func('0x4896b31a', {}, uint256)
export type DepositListLengthParams = FunctionArguments<typeof depositListLength>
export type DepositListLengthReturn = FunctionReturn<typeof depositListLength>

/** depositedWethAccountedFor() */
export const depositedWethAccountedFor = func('0xd059f6ef', {}, uint256)
export type DepositedWethAccountedForParams = FunctionArguments<typeof depositedWethAccountedFor>
export type DepositedWethAccountedForReturn = FunctionReturn<typeof depositedWethAccountedFor>

/** deposits(bytes32) */
export const deposits = func('0x3d4dff7b', {
    _0: bytes32,
}, struct({
    pubKeyHash: bytes32,
    amountGwei: uint64,
    slot: uint64,
    depositIndex: uint32,
    status: uint8,
}))
export type DepositsParams = FunctionArguments<typeof deposits>
export type DepositsReturn = FunctionReturn<typeof deposits>

/** firstDeposit() */
export const firstDeposit = func('0xa5f5be54', {}, bool)
export type FirstDepositParams = FunctionArguments<typeof firstDeposit>
export type FirstDepositReturn = FunctionReturn<typeof firstDeposit>

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

/** lastVerifiedEthBalance() */
export const lastVerifiedEthBalance = func('0x59ff4158', {}, uint256)
export type LastVerifiedEthBalanceParams = FunctionArguments<typeof lastVerifiedEthBalance>
export type LastVerifiedEthBalanceReturn = FunctionReturn<typeof lastVerifiedEthBalance>

/** migrateClusterToETH(uint64[],(uint32,uint64,uint64,bool,uint256)) */
export const migrateClusterToETH = func('0x36e87b12', {
    operatorIds: array(uint64),
    cluster: struct({
        validatorCount: uint32,
        networkFeeIndex: uint64,
        index: uint64,
        active: bool,
        balance: uint256,
    }),
})
export type MigrateClusterToETHParams = FunctionArguments<typeof migrateClusterToETH>
export type MigrateClusterToETHReturn = FunctionReturn<typeof migrateClusterToETH>

/** pause() */
export const pause = func('0x8456cb59', {})
export type PauseParams = FunctionArguments<typeof pause>
export type PauseReturn = FunctionReturn<typeof pause>

/** paused() */
export const paused = func('0x5c975abb', {}, bool)
export type PausedParams = FunctionArguments<typeof paused>
export type PausedReturn = FunctionReturn<typeof paused>

/** platformAddress() */
export const platformAddress = func('0xdbe55e56', {}, address)
export type PlatformAddressParams = FunctionArguments<typeof platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof platformAddress>

/** registerSsvValidator(bytes,uint64[],bytes,(uint32,uint64,uint64,bool,uint256)) */
export const registerSsvValidator = func('0xdaa1e253', {
    publicKey: bytes,
    operatorIds: array(uint64),
    sharesData: bytes,
    cluster: struct({
        validatorCount: uint32,
        networkFeeIndex: uint64,
        index: uint64,
        active: bool,
        balance: uint256,
    }),
})
export type RegisterSsvValidatorParams = FunctionArguments<typeof registerSsvValidator>
export type RegisterSsvValidatorReturn = FunctionReturn<typeof registerSsvValidator>

/** removePToken(uint256) */
export const removePToken = func('0x9136616a', {
    _0: uint256,
})
export type RemovePTokenParams = FunctionArguments<typeof removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof removePToken>

/** removeSsvValidator(bytes,uint64[],(uint32,uint64,uint64,bool,uint256)) */
export const removeSsvValidator = func('0x71a735f3', {
    publicKey: bytes,
    operatorIds: array(uint64),
    cluster: struct({
        validatorCount: uint32,
        networkFeeIndex: uint64,
        index: uint64,
        active: bool,
        balance: uint256,
    }),
})
export type RemoveSsvValidatorParams = FunctionArguments<typeof removeSsvValidator>
export type RemoveSsvValidatorReturn = FunctionReturn<typeof removeSsvValidator>

/** resetFirstDeposit() */
export const resetFirstDeposit = func('0x4c84e6f8', {})
export type ResetFirstDepositParams = FunctionArguments<typeof resetFirstDeposit>
export type ResetFirstDepositReturn = FunctionReturn<typeof resetFirstDeposit>

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

/** setPTokenAddress(address,address) */
export const setPTokenAddress = func('0x0ed57b3a', {
    _0: address,
    _1: address,
})
export type SetPTokenAddressParams = FunctionArguments<typeof setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof setPTokenAddress>

/** setRegistrator(address) */
export const setRegistrator = func('0x6e811d38', {
    _address: address,
})
export type SetRegistratorParams = FunctionArguments<typeof setRegistrator>
export type SetRegistratorReturn = FunctionReturn<typeof setRegistrator>

/** setRewardTokenAddresses(address[]) */
export const setRewardTokenAddresses = func('0x96d538bb', {
    _rewardTokenAddresses: array(address),
})
export type SetRewardTokenAddressesParams = FunctionArguments<typeof setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof setRewardTokenAddresses>

/** snapBalances() */
export const snapBalances = func('0x6874469d', {})
export type SnapBalancesParams = FunctionArguments<typeof snapBalances>
export type SnapBalancesReturn = FunctionReturn<typeof snapBalances>

/** snappedBalance() */
export const snappedBalance = func('0x25e2e9f3', {}, struct({
    blockRoot: bytes32,
    timestamp: uint64,
    ethBalance: uint128,
}))
export type SnappedBalanceParams = FunctionArguments<typeof snappedBalance>
export type SnappedBalanceReturn = FunctionReturn<typeof snappedBalance>

/** stakeEth((bytes,bytes,bytes32),uint64) */
export const stakeEth = func('0x4583ef10', {
    validatorStakeData: struct({
        pubkey: bytes,
        signature: bytes,
        depositDataRoot: bytes32,
    }),
    depositAmountGwei: uint64,
})
export type StakeEthParams = FunctionArguments<typeof stakeEth>
export type StakeEthReturn = FunctionReturn<typeof stakeEth>

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

/** unPause() */
export const unPause = func('0xf7b188a5', {})
export type UnPauseParams = FunctionArguments<typeof unPause>
export type UnPauseReturn = FunctionReturn<typeof unPause>

/** validator(bytes32) */
export const validator = func('0x98245f1b', {
    _0: bytes32,
}, struct({
    state: uint8,
    index: uint40,
}))
export type ValidatorParams = FunctionArguments<typeof validator>
export type ValidatorReturn = FunctionReturn<typeof validator>

/** validatorRegistrator() */
export const validatorRegistrator = func('0x87bae867', {}, address)
export type ValidatorRegistratorParams = FunctionArguments<typeof validatorRegistrator>
export type ValidatorRegistratorReturn = FunctionReturn<typeof validatorRegistrator>

/** validatorWithdrawal(bytes,uint64) */
export const validatorWithdrawal = func('0x522e4245', {
    publicKey: bytes,
    amountGwei: uint64,
})
export type ValidatorWithdrawalParams = FunctionArguments<typeof validatorWithdrawal>
export type ValidatorWithdrawalReturn = FunctionReturn<typeof validatorWithdrawal>

/** vaultAddress() */
export const vaultAddress = func('0x430bf08a', {}, address)
export type VaultAddressParams = FunctionArguments<typeof vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof vaultAddress>

/** verifiedValidators(uint256) */
export const verifiedValidators = func('0x0ef99855', {
    _0: uint256,
}, bytes32)
export type VerifiedValidatorsParams = FunctionArguments<typeof verifiedValidators>
export type VerifiedValidatorsReturn = FunctionReturn<typeof verifiedValidators>

/** verifiedValidatorsLength() */
export const verifiedValidatorsLength = func('0xd79e4032', {}, uint256)
export type VerifiedValidatorsLengthParams = FunctionArguments<typeof verifiedValidatorsLength>
export type VerifiedValidatorsLengthReturn = FunctionReturn<typeof verifiedValidatorsLength>

/** verifyBalances((bytes32,bytes,bytes32[],bytes[]),(bytes32,bytes,uint32[],bytes[])) */
export const verifyBalances = func('0x1a1a1571', {
    balanceProofs: struct({
        balancesContainerRoot: bytes32,
        balancesContainerProof: bytes,
        validatorBalanceLeaves: array(bytes32),
        validatorBalanceProofs: array(bytes),
    }),
    pendingDepositProofs: struct({
        pendingDepositContainerRoot: bytes32,
        pendingDepositContainerProof: bytes,
        pendingDepositIndexes: array(uint32),
        pendingDepositProofs: array(bytes),
    }),
})
export type VerifyBalancesParams = FunctionArguments<typeof verifyBalances>
export type VerifyBalancesReturn = FunctionReturn<typeof verifyBalances>

/** verifyDeposit(bytes32,uint64,(uint64,bytes),(uint64,bytes)) */
export const verifyDeposit = func('0x0d304174', {
    pendingDepositRoot: bytes32,
    depositProcessedSlot: uint64,
    firstPendingDeposit: struct({
        slot: uint64,
        proof: bytes,
    }),
    strategyValidatorData: struct({
        withdrawableEpoch: uint64,
        withdrawableEpochProof: bytes,
    }),
})
export type VerifyDepositParams = FunctionArguments<typeof verifyDeposit>
export type VerifyDepositReturn = FunctionReturn<typeof verifyDeposit>

/** verifyValidator(uint64,uint40,bytes32,bytes32,bytes) */
export const verifyValidator = func('0x6c341d1a', {
    nextBlockTimestamp: uint64,
    validatorIndex: uint40,
    pubKeyHash: bytes32,
    withdrawalCredentials: bytes32,
    validatorPubKeyProof: bytes,
})
export type VerifyValidatorParams = FunctionArguments<typeof verifyValidator>
export type VerifyValidatorReturn = FunctionReturn<typeof verifyValidator>

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
