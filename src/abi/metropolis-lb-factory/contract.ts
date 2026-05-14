import { ContractBase } from '../abi.support.js'
import { DEFAULT_ADMIN_ROLE, LB_HOOKS_MANAGER_ROLE, createLBPair, getAllBinSteps, getAllLBPairs, getFeeRecipient, getFlashLoanFee, getLBPairAtIndex, getLBPairImplementation, getLBPairInformation, getMaxFlashLoanFee, getMinBinStep, getNumberOfLBPairs, getNumberOfQuoteAssets, getOpenBinSteps, getPreset, getQuoteAssetAtIndex, getRoleAdmin, hasRole, isQuoteAsset, owner, pendingOwner, supportsInterface } from './functions.js'
import type { CreateLBPairParams, GetAllLBPairsParams, GetLBPairAtIndexParams, GetLBPairInformationParams, GetPresetParams, GetQuoteAssetAtIndexParams, GetRoleAdminParams, HasRoleParams, IsQuoteAssetParams, SupportsInterfaceParams } from './functions.js'

export class Contract extends ContractBase {
    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(DEFAULT_ADMIN_ROLE, {})
    }

    LB_HOOKS_MANAGER_ROLE() {
        return this.eth_call(LB_HOOKS_MANAGER_ROLE, {})
    }

    createLBPair(tokenX: CreateLBPairParams["tokenX"], tokenY: CreateLBPairParams["tokenY"], activeId: CreateLBPairParams["activeId"], binStep: CreateLBPairParams["binStep"]) {
        return this.eth_call(createLBPair, {tokenX, tokenY, activeId, binStep})
    }

    getAllBinSteps() {
        return this.eth_call(getAllBinSteps, {})
    }

    getAllLBPairs(tokenX: GetAllLBPairsParams["tokenX"], tokenY: GetAllLBPairsParams["tokenY"]) {
        return this.eth_call(getAllLBPairs, {tokenX, tokenY})
    }

    getFeeRecipient() {
        return this.eth_call(getFeeRecipient, {})
    }

    getFlashLoanFee() {
        return this.eth_call(getFlashLoanFee, {})
    }

    getLBPairAtIndex(index: GetLBPairAtIndexParams["index"]) {
        return this.eth_call(getLBPairAtIndex, {index})
    }

    getLBPairImplementation() {
        return this.eth_call(getLBPairImplementation, {})
    }

    getLBPairInformation(tokenA: GetLBPairInformationParams["tokenA"], tokenB: GetLBPairInformationParams["tokenB"], binStep: GetLBPairInformationParams["binStep"]) {
        return this.eth_call(getLBPairInformation, {tokenA, tokenB, binStep})
    }

    getMaxFlashLoanFee() {
        return this.eth_call(getMaxFlashLoanFee, {})
    }

    getMinBinStep() {
        return this.eth_call(getMinBinStep, {})
    }

    getNumberOfLBPairs() {
        return this.eth_call(getNumberOfLBPairs, {})
    }

    getNumberOfQuoteAssets() {
        return this.eth_call(getNumberOfQuoteAssets, {})
    }

    getOpenBinSteps() {
        return this.eth_call(getOpenBinSteps, {})
    }

    getPreset(binStep: GetPresetParams["binStep"]) {
        return this.eth_call(getPreset, {binStep})
    }

    getQuoteAssetAtIndex(index: GetQuoteAssetAtIndexParams["index"]) {
        return this.eth_call(getQuoteAssetAtIndex, {index})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(hasRole, {role, account})
    }

    isQuoteAsset(token: IsQuoteAssetParams["token"]) {
        return this.eth_call(isQuoteAsset, {token})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    pendingOwner() {
        return this.eth_call(pendingOwner, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(supportsInterface, {interfaceId})
    }
}
