import { ContractBase } from '../abi.support.js'
import { BEACON_PROOFS, SNAP_BALANCES_DELAY, assetToPToken, checkBalance, depositList, depositListLength, depositedWethAccountedFor, deposits, firstDeposit, getRewardTokenAddresses, governor, harvesterAddress, isGovernor, lastVerifiedEthBalance, paused, platformAddress, rewardTokenAddresses, snappedBalance, supportsAsset, validator, validatorRegistrator, vaultAddress, verifiedValidators, verifiedValidatorsLength } from './functions.js'
import type { AssetToPTokenParams, CheckBalanceParams, DepositListParams, DepositsParams, RewardTokenAddressesParams, SupportsAssetParams, ValidatorParams, VerifiedValidatorsParams } from './functions.js'

export class Contract extends ContractBase {
    BEACON_PROOFS() {
        return this.eth_call(BEACON_PROOFS, {})
    }

    SNAP_BALANCES_DELAY() {
        return this.eth_call(SNAP_BALANCES_DELAY, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(checkBalance, {_asset})
    }

    depositList(_0: DepositListParams["_0"]) {
        return this.eth_call(depositList, {_0})
    }

    depositListLength() {
        return this.eth_call(depositListLength, {})
    }

    depositedWethAccountedFor() {
        return this.eth_call(depositedWethAccountedFor, {})
    }

    deposits(_0: DepositsParams["_0"]) {
        return this.eth_call(deposits, {_0})
    }

    firstDeposit() {
        return this.eth_call(firstDeposit, {})
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

    lastVerifiedEthBalance() {
        return this.eth_call(lastVerifiedEthBalance, {})
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

    snappedBalance() {
        return this.eth_call(snappedBalance, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(supportsAsset, {_asset})
    }

    validator(_0: ValidatorParams["_0"]) {
        return this.eth_call(validator, {_0})
    }

    validatorRegistrator() {
        return this.eth_call(validatorRegistrator, {})
    }

    vaultAddress() {
        return this.eth_call(vaultAddress, {})
    }

    verifiedValidators(_0: VerifiedValidatorsParams["_0"]) {
        return this.eth_call(verifiedValidators, {_0})
    }

    verifiedValidatorsLength() {
        return this.eth_call(verifiedValidatorsLength, {})
    }
}
