import { address, array, bool, bytes, bytes32, int256, struct, uint256, uint32, uint64, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** BEACON_CHAIN_DEPOSIT_CONTRACT() */
export const BEACON_CHAIN_DEPOSIT_CONTRACT = func('0xcceab750', {}, address)
export type BEACON_CHAIN_DEPOSIT_CONTRACTParams = FunctionArguments<typeof BEACON_CHAIN_DEPOSIT_CONTRACT>
export type BEACON_CHAIN_DEPOSIT_CONTRACTReturn = FunctionReturn<typeof BEACON_CHAIN_DEPOSIT_CONTRACT>

/** FEE_ACCUMULATOR_ADDRESS() */
export const FEE_ACCUMULATOR_ADDRESS = func('0xdd505df6', {}, address)
export type FEE_ACCUMULATOR_ADDRESSParams = FunctionArguments<typeof FEE_ACCUMULATOR_ADDRESS>
export type FEE_ACCUMULATOR_ADDRESSReturn = FunctionReturn<typeof FEE_ACCUMULATOR_ADDRESS>

/** FULL_STAKE() */
export const FULL_STAKE = func('0xb16b7d0b', {}, uint256)
export type FULL_STAKEParams = FunctionArguments<typeof FULL_STAKE>
export type FULL_STAKEReturn = FunctionReturn<typeof FULL_STAKE>

/** MAX_VALIDATORS() */
export const MAX_VALIDATORS = func('0x714897df', {}, uint256)
export type MAX_VALIDATORSParams = FunctionArguments<typeof MAX_VALIDATORS>
export type MAX_VALIDATORSReturn = FunctionReturn<typeof MAX_VALIDATORS>

/** MIN_FIX_ACCOUNTING_CADENCE() */
export const MIN_FIX_ACCOUNTING_CADENCE = func('0x63092383', {}, uint256)
export type MIN_FIX_ACCOUNTING_CADENCEParams = FunctionArguments<typeof MIN_FIX_ACCOUNTING_CADENCE>
export type MIN_FIX_ACCOUNTING_CADENCEReturn = FunctionReturn<typeof MIN_FIX_ACCOUNTING_CADENCE>

/** SSV_NETWORK() */
export const SSV_NETWORK = func('0x91649751', {}, address)
export type SSV_NETWORKParams = FunctionArguments<typeof SSV_NETWORK>
export type SSV_NETWORKReturn = FunctionReturn<typeof SSV_NETWORK>

/** SSV_TOKEN() */
export const SSV_TOKEN = func('0x0df1ecfd', {}, address)
export type SSV_TOKENParams = FunctionArguments<typeof SSV_TOKEN>
export type SSV_TOKENReturn = FunctionReturn<typeof SSV_TOKEN>

/** VAULT_ADDRESS() */
export const VAULT_ADDRESS = func('0x9092c31c', {}, address)
export type VAULT_ADDRESSParams = FunctionArguments<typeof VAULT_ADDRESS>
export type VAULT_ADDRESSReturn = FunctionReturn<typeof VAULT_ADDRESS>

/** WETH() */
export const WETH = func('0xad5c4648', {}, address)
export type WETHParams = FunctionArguments<typeof WETH>
export type WETHReturn = FunctionReturn<typeof WETH>

/** activeDepositedValidators() */
export const activeDepositedValidators = func('0x66e3667e', {}, uint256)
export type ActiveDepositedValidatorsParams = FunctionArguments<typeof activeDepositedValidators>
export type ActiveDepositedValidatorsReturn = FunctionReturn<typeof activeDepositedValidators>

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

/** confirmConsolidation(uint256) */
export const confirmConsolidation = func('0x75c20dd1', {
    consolidationCount: uint256,
})
export type ConfirmConsolidationParams = FunctionArguments<typeof confirmConsolidation>
export type ConfirmConsolidationReturn = FunctionReturn<typeof confirmConsolidation>

/** consensusRewards() */
export const consensusRewards = func('0x842f5c46', {}, uint256)
export type ConsensusRewardsParams = FunctionArguments<typeof consensusRewards>
export type ConsensusRewardsReturn = FunctionReturn<typeof consensusRewards>

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

/** depositedWethAccountedFor() */
export const depositedWethAccountedFor = func('0xd059f6ef', {}, uint256)
export type DepositedWethAccountedForParams = FunctionArguments<typeof depositedWethAccountedFor>
export type DepositedWethAccountedForReturn = FunctionReturn<typeof depositedWethAccountedFor>

/** doAccounting() */
export const doAccounting = func('0xa4f98af4', {}, bool)
export type DoAccountingParams = FunctionArguments<typeof doAccounting>
export type DoAccountingReturn = FunctionReturn<typeof doAccounting>

/** exitSsvValidator(bytes,uint64[]) */
export const exitSsvValidator = func('0xd9f00ec7', {
    publicKey: bytes,
    operatorIds: array(uint64),
})
export type ExitSsvValidatorParams = FunctionArguments<typeof exitSsvValidator>
export type ExitSsvValidatorReturn = FunctionReturn<typeof exitSsvValidator>

/** failConsolidation(bytes[]) */
export const failConsolidation = func('0x1d622328', {
    sourcePubKeys: array(bytes),
})
export type FailConsolidationParams = FunctionArguments<typeof failConsolidation>
export type FailConsolidationReturn = FunctionReturn<typeof failConsolidation>

/** fuseIntervalEnd() */
export const fuseIntervalEnd = func('0x484be812', {}, uint256)
export type FuseIntervalEndParams = FunctionArguments<typeof fuseIntervalEnd>
export type FuseIntervalEndReturn = FunctionReturn<typeof fuseIntervalEnd>

/** fuseIntervalStart() */
export const fuseIntervalStart = func('0x3c864959', {}, uint256)
export type FuseIntervalStartParams = FunctionArguments<typeof fuseIntervalStart>
export type FuseIntervalStartReturn = FunctionReturn<typeof fuseIntervalStart>

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

/** lastFixAccountingBlockNumber() */
export const lastFixAccountingBlockNumber = func('0xe7529239', {}, uint256)
export type LastFixAccountingBlockNumberParams = FunctionArguments<typeof lastFixAccountingBlockNumber>
export type LastFixAccountingBlockNumberReturn = FunctionReturn<typeof lastFixAccountingBlockNumber>

/** manuallyFixAccounting(int256,int256,uint256) */
export const manuallyFixAccounting = func('0x8d7c0e46', {
    _validatorsDelta: int256,
    _consensusRewardsDelta: int256,
    _ethToVaultAmount: uint256,
})
export type ManuallyFixAccountingParams = FunctionArguments<typeof manuallyFixAccounting>
export type ManuallyFixAccountingReturn = FunctionReturn<typeof manuallyFixAccounting>

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

/** registerSsvValidators(bytes[],uint64[],bytes[],(uint32,uint64,uint64,bool,uint256)) */
export const registerSsvValidators = func('0x31856682', {
    publicKeys: array(bytes),
    operatorIds: array(uint64),
    sharesData: array(bytes),
    cluster: struct({
        validatorCount: uint32,
        networkFeeIndex: uint64,
        index: uint64,
        active: bool,
        balance: uint256,
    }),
})
export type RegisterSsvValidatorsParams = FunctionArguments<typeof registerSsvValidators>
export type RegisterSsvValidatorsReturn = FunctionReturn<typeof registerSsvValidators>

/** removePToken(uint256) */
export const removePToken = func('0x9136616a', {
    _assetIndex: uint256,
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

/** requestConsolidation(bytes[],bytes) */
export const requestConsolidation = func('0x22be1ffd', {
    sourcePubKeys: array(bytes),
    targetPubKey: bytes,
})
export type RequestConsolidationParams = FunctionArguments<typeof requestConsolidation>
export type RequestConsolidationReturn = FunctionReturn<typeof requestConsolidation>

/** resetStakeETHTally() */
export const resetStakeETHTally = func('0xee7afe2d', {})
export type ResetStakeETHTallyParams = FunctionArguments<typeof resetStakeETHTally>
export type ResetStakeETHTallyReturn = FunctionReturn<typeof resetStakeETHTally>

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

/** setFeeRecipient() */
export const setFeeRecipient = func('0x13cf69dd', {})
export type SetFeeRecipientParams = FunctionArguments<typeof setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof setFeeRecipient>

/** setFuseInterval(uint256,uint256) */
export const setFuseInterval = func('0xab12edf5', {
    _fuseIntervalStart: uint256,
    _fuseIntervalEnd: uint256,
})
export type SetFuseIntervalParams = FunctionArguments<typeof setFuseInterval>
export type SetFuseIntervalReturn = FunctionReturn<typeof setFuseInterval>

/** setHarvesterAddress(address) */
export const setHarvesterAddress = func('0xc2e1e3f4', {
    _harvesterAddress: address,
})
export type SetHarvesterAddressParams = FunctionArguments<typeof setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof setHarvesterAddress>

/** setPTokenAddress(address,address) */
export const setPTokenAddress = func('0x0ed57b3a', {
    _asset: address,
    _pToken: address,
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

/** setStakeETHThreshold(uint256) */
export const setStakeETHThreshold = func('0x5205c380', {
    _amount: uint256,
})
export type SetStakeETHThresholdParams = FunctionArguments<typeof setStakeETHThreshold>
export type SetStakeETHThresholdReturn = FunctionReturn<typeof setStakeETHThreshold>

/** setStakingMonitor(address) */
export const setStakingMonitor = func('0xa3b81e73', {
    _address: address,
})
export type SetStakingMonitorParams = FunctionArguments<typeof setStakingMonitor>
export type SetStakingMonitorReturn = FunctionReturn<typeof setStakingMonitor>

/** stakeETHTally() */
export const stakeETHTally = func('0xde34d713', {}, uint256)
export type StakeETHTallyParams = FunctionArguments<typeof stakeETHTally>
export type StakeETHTallyReturn = FunctionReturn<typeof stakeETHTally>

/** stakeETHThreshold() */
export const stakeETHThreshold = func('0x7b8962f7', {}, uint256)
export type StakeETHThresholdParams = FunctionArguments<typeof stakeETHThreshold>
export type StakeETHThresholdReturn = FunctionReturn<typeof stakeETHThreshold>

/** stakeEth((bytes,bytes,bytes32)[]) */
export const stakeEth = func('0x6ef38795', {
    validators: array(struct({
        pubkey: bytes,
        signature: bytes,
        depositDataRoot: bytes32,
    })),
})
export type StakeEthParams = FunctionArguments<typeof stakeEth>
export type StakeEthReturn = FunctionReturn<typeof stakeEth>

/** stakingMonitor() */
export const stakingMonitor = func('0x7260f826', {}, address)
export type StakingMonitorParams = FunctionArguments<typeof stakingMonitor>
export type StakingMonitorReturn = FunctionReturn<typeof stakingMonitor>

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

/** validatorRegistrator() */
export const validatorRegistrator = func('0x87bae867', {}, address)
export type ValidatorRegistratorParams = FunctionArguments<typeof validatorRegistrator>
export type ValidatorRegistratorReturn = FunctionReturn<typeof validatorRegistrator>

/** validatorsStates(bytes32) */
export const validatorsStates = func('0x9da0e462', {
    _0: bytes32,
}, uint8)
export type ValidatorsStatesParams = FunctionArguments<typeof validatorsStates>
export type ValidatorsStatesReturn = FunctionReturn<typeof validatorsStates>

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
