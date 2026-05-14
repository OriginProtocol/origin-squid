import { ContractBase } from '../abi.support.js'
import { BEACON_CHAIN_DEPOSIT_CONTRACT, FEE_ACCUMULATOR_ADDRESS, FULL_STAKE, MAX_VALIDATORS, MIN_FIX_ACCOUNTING_CADENCE, SSV_NETWORK, SSV_TOKEN, VAULT_ADDRESS, WETH, activeDepositedValidators, assetToPToken, checkBalance, consensusRewards, depositedWethAccountedFor, doAccounting, fuseIntervalEnd, fuseIntervalStart, getRewardTokenAddresses, governor, harvesterAddress, isGovernor, lastFixAccountingBlockNumber, paused, platformAddress, rewardTokenAddresses, stakeETHTally, stakeETHThreshold, stakingMonitor, supportsAsset, validatorRegistrator, validatorsStates, vaultAddress } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, RewardTokenAddressesParams, SupportsAssetParams, ValidatorsStatesParams } from './functions.js'

export class Contract extends ContractBase {
    BEACON_CHAIN_DEPOSIT_CONTRACT() {
        return this.eth_call(BEACON_CHAIN_DEPOSIT_CONTRACT, {})
    }

    FEE_ACCUMULATOR_ADDRESS() {
        return this.eth_call(FEE_ACCUMULATOR_ADDRESS, {})
    }

    FULL_STAKE() {
        return this.eth_call(FULL_STAKE, {})
    }

    MAX_VALIDATORS() {
        return this.eth_call(MAX_VALIDATORS, {})
    }

    MIN_FIX_ACCOUNTING_CADENCE() {
        return this.eth_call(MIN_FIX_ACCOUNTING_CADENCE, {})
    }

    SSV_NETWORK() {
        return this.eth_call(SSV_NETWORK, {})
    }

    SSV_TOKEN() {
        return this.eth_call(SSV_TOKEN, {})
    }

    VAULT_ADDRESS() {
        return this.eth_call(VAULT_ADDRESS, {})
    }

    WETH() {
        return this.eth_call(WETH, {})
    }

    activeDepositedValidators() {
        return this.eth_call(activeDepositedValidators, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
    }

    consensusRewards() {
        return this.eth_call(consensusRewards, {})
    }

    depositedWethAccountedFor() {
        return this.eth_call(depositedWethAccountedFor, {})
    }

    doAccounting() {
        return this.eth_call(doAccounting, {})
    }

    fuseIntervalEnd() {
        return this.eth_call(fuseIntervalEnd, {})
    }

    fuseIntervalStart() {
        return this.eth_call(fuseIntervalStart, {})
    }

    getRewardTokenAddresses() {
        return this.eth_call(getRewardTokenAddresses, {})
    }

    governor() {
        return this.eth_call(governor, {})
    }

    harvesterAddress() {
        return this.eth_call(harvesterAddress, {})
    }

    isGovernor() {
        return this.eth_call(isGovernor, {})
    }

    lastFixAccountingBlockNumber() {
        return this.eth_call(lastFixAccountingBlockNumber, {})
    }

    paused() {
        return this.eth_call(paused, {})
    }

    platformAddress() {
        return this.eth_call(platformAddress, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(rewardTokenAddresses, {_0})
    }

    stakeETHTally() {
        return this.eth_call(stakeETHTally, {})
    }

    stakeETHThreshold() {
        return this.eth_call(stakeETHThreshold, {})
    }

    stakingMonitor() {
        return this.eth_call(stakingMonitor, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(supportsAsset, {_asset})
    }

    validatorRegistrator() {
        return this.eth_call(validatorRegistrator, {})
    }

    validatorsStates(_0: ValidatorsStatesParams["_0"]) {
        return this.eth_call(validatorsStates, {_0})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }
}
