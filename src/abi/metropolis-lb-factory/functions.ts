import { address, array, bool, bytes, bytes32, bytes4, struct, uint16, uint24, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DEFAULT_ADMIN_ROLE() */
export const DEFAULT_ADMIN_ROLE = func('0xa217fddf', {}, bytes32)
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof DEFAULT_ADMIN_ROLE>

/** LB_HOOKS_MANAGER_ROLE() */
export const LB_HOOKS_MANAGER_ROLE = func('0x1af5bacc', {}, bytes32)
export type LB_HOOKS_MANAGER_ROLEParams = FunctionArguments<typeof LB_HOOKS_MANAGER_ROLE>
export type LB_HOOKS_MANAGER_ROLEReturn = FunctionReturn<typeof LB_HOOKS_MANAGER_ROLE>

/** acceptOwnership() */
export const acceptOwnership = func('0x79ba5097', {})
export type AcceptOwnershipParams = FunctionArguments<typeof acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof acceptOwnership>

/** addQuoteAsset(address) */
export const addQuoteAsset = func('0x5a440923', {
    quoteAsset: address,
})
export type AddQuoteAssetParams = FunctionArguments<typeof addQuoteAsset>
export type AddQuoteAssetReturn = FunctionReturn<typeof addQuoteAsset>

/** createLBPair(address,address,uint24,uint16) */
export const createLBPair = func('0x659ac74b', {
    tokenX: address,
    tokenY: address,
    activeId: uint24,
    binStep: uint16,
}, address)
export type CreateLBPairParams = FunctionArguments<typeof createLBPair>
export type CreateLBPairReturn = FunctionReturn<typeof createLBPair>

/** forceDecay(address) */
export const forceDecay = func('0x3c78a941', {
    pair: address,
})
export type ForceDecayParams = FunctionArguments<typeof forceDecay>
export type ForceDecayReturn = FunctionReturn<typeof forceDecay>

/** getAllBinSteps() */
export const getAllBinSteps = func('0x5b35875c', {}, array(uint256))
export type GetAllBinStepsParams = FunctionArguments<typeof getAllBinSteps>
export type GetAllBinStepsReturn = FunctionReturn<typeof getAllBinSteps>

/** getAllLBPairs(address,address) */
export const getAllLBPairs = func('0x6622e0d7', {
    tokenX: address,
    tokenY: address,
}, array(struct({
    binStep: uint16,
    LBPair: address,
    createdByOwner: bool,
    ignoredForRouting: bool,
})))
export type GetAllLBPairsParams = FunctionArguments<typeof getAllLBPairs>
export type GetAllLBPairsReturn = FunctionReturn<typeof getAllLBPairs>

/** getFeeRecipient() */
export const getFeeRecipient = func('0x4ccb20c0', {}, address)
export type GetFeeRecipientParams = FunctionArguments<typeof getFeeRecipient>
export type GetFeeRecipientReturn = FunctionReturn<typeof getFeeRecipient>

/** getFlashLoanFee() */
export const getFlashLoanFee = func('0xfd90c2be', {}, uint256)
export type GetFlashLoanFeeParams = FunctionArguments<typeof getFlashLoanFee>
export type GetFlashLoanFeeReturn = FunctionReturn<typeof getFlashLoanFee>

/** getLBPairAtIndex(uint256) */
export const getLBPairAtIndex = func('0x7daf5d66', {
    index: uint256,
}, address)
export type GetLBPairAtIndexParams = FunctionArguments<typeof getLBPairAtIndex>
export type GetLBPairAtIndexReturn = FunctionReturn<typeof getLBPairAtIndex>

/** getLBPairImplementation() */
export const getLBPairImplementation = func('0xaf371065', {}, address)
export type GetLBPairImplementationParams = FunctionArguments<typeof getLBPairImplementation>
export type GetLBPairImplementationReturn = FunctionReturn<typeof getLBPairImplementation>

/** getLBPairInformation(address,address,uint256) */
export const getLBPairInformation = func('0x704037bd', {
    tokenA: address,
    tokenB: address,
    binStep: uint256,
}, struct({
    binStep: uint16,
    LBPair: address,
    createdByOwner: bool,
    ignoredForRouting: bool,
}))
export type GetLBPairInformationParams = FunctionArguments<typeof getLBPairInformation>
export type GetLBPairInformationReturn = FunctionReturn<typeof getLBPairInformation>

/** getMaxFlashLoanFee() */
export const getMaxFlashLoanFee = func('0x8ce9aa1c', {}, uint256)
export type GetMaxFlashLoanFeeParams = FunctionArguments<typeof getMaxFlashLoanFee>
export type GetMaxFlashLoanFeeReturn = FunctionReturn<typeof getMaxFlashLoanFee>

/** getMinBinStep() */
export const getMinBinStep = func('0x701ab8c1', {}, uint256)
export type GetMinBinStepParams = FunctionArguments<typeof getMinBinStep>
export type GetMinBinStepReturn = FunctionReturn<typeof getMinBinStep>

/** getNumberOfLBPairs() */
export const getNumberOfLBPairs = func('0x4e937c3a', {}, uint256)
export type GetNumberOfLBPairsParams = FunctionArguments<typeof getNumberOfLBPairs>
export type GetNumberOfLBPairsReturn = FunctionReturn<typeof getNumberOfLBPairs>

/** getNumberOfQuoteAssets() */
export const getNumberOfQuoteAssets = func('0x80c5061e', {}, uint256)
export type GetNumberOfQuoteAssetsParams = FunctionArguments<typeof getNumberOfQuoteAssets>
export type GetNumberOfQuoteAssetsReturn = FunctionReturn<typeof getNumberOfQuoteAssets>

/** getOpenBinSteps() */
export const getOpenBinSteps = func('0x0282c9c1', {}, array(uint256))
export type GetOpenBinStepsParams = FunctionArguments<typeof getOpenBinSteps>
export type GetOpenBinStepsReturn = FunctionReturn<typeof getOpenBinSteps>

/** getPreset(uint256) */
export const getPreset = func('0xaabc4b3c', {
    binStep: uint256,
}, struct({
    baseFactor: uint256,
    filterPeriod: uint256,
    decayPeriod: uint256,
    reductionFactor: uint256,
    variableFeeControl: uint256,
    protocolShare: uint256,
    maxVolatilityAccumulator: uint256,
    isOpen: bool,
}))
export type GetPresetParams = FunctionArguments<typeof getPreset>
export type GetPresetReturn = FunctionReturn<typeof getPreset>

/** getQuoteAssetAtIndex(uint256) */
export const getQuoteAssetAtIndex = func('0x0752092b', {
    index: uint256,
}, address)
export type GetQuoteAssetAtIndexParams = FunctionArguments<typeof getQuoteAssetAtIndex>
export type GetQuoteAssetAtIndexReturn = FunctionReturn<typeof getQuoteAssetAtIndex>

/** getRoleAdmin(bytes32) */
export const getRoleAdmin = func('0x248a9ca3', {
    role: bytes32,
}, bytes32)
export type GetRoleAdminParams = FunctionArguments<typeof getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof getRoleAdmin>

/** grantRole(bytes32,address) */
export const grantRole = func('0x2f2ff15d', {
    role: bytes32,
    account: address,
})
export type GrantRoleParams = FunctionArguments<typeof grantRole>
export type GrantRoleReturn = FunctionReturn<typeof grantRole>

/** hasRole(bytes32,address) */
export const hasRole = func('0x91d14854', {
    role: bytes32,
    account: address,
}, bool)
export type HasRoleParams = FunctionArguments<typeof hasRole>
export type HasRoleReturn = FunctionReturn<typeof hasRole>

/** isQuoteAsset(address) */
export const isQuoteAsset = func('0x27721842', {
    token: address,
}, bool)
export type IsQuoteAssetParams = FunctionArguments<typeof isQuoteAsset>
export type IsQuoteAssetReturn = FunctionReturn<typeof isQuoteAsset>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** pendingOwner() */
export const pendingOwner = func('0xe30c3978', {}, address)
export type PendingOwnerParams = FunctionArguments<typeof pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof pendingOwner>

/** removeLBHooksOnPair(address,address,uint16) */
export const removeLBHooksOnPair = func('0x2cc06b8c', {
    tokenX: address,
    tokenY: address,
    binStep: uint16,
})
export type RemoveLBHooksOnPairParams = FunctionArguments<typeof removeLBHooksOnPair>
export type RemoveLBHooksOnPairReturn = FunctionReturn<typeof removeLBHooksOnPair>

/** removePreset(uint16) */
export const removePreset = func('0xe203a31f', {
    binStep: uint16,
})
export type RemovePresetParams = FunctionArguments<typeof removePreset>
export type RemovePresetReturn = FunctionReturn<typeof removePreset>

/** removeQuoteAsset(address) */
export const removeQuoteAsset = func('0xddbfd941', {
    quoteAsset: address,
})
export type RemoveQuoteAssetParams = FunctionArguments<typeof removeQuoteAsset>
export type RemoveQuoteAssetReturn = FunctionReturn<typeof removeQuoteAsset>

/** renounceOwnership() */
export const renounceOwnership = func('0x715018a6', {})
export type RenounceOwnershipParams = FunctionArguments<typeof renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof renounceOwnership>

/** renounceRole(bytes32,address) */
export const renounceRole = func('0x36568abe', {
    role: bytes32,
    callerConfirmation: address,
})
export type RenounceRoleParams = FunctionArguments<typeof renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof renounceRole>

/** revokeRole(bytes32,address) */
export const revokeRole = func('0xd547741f', {
    role: bytes32,
    account: address,
})
export type RevokeRoleParams = FunctionArguments<typeof revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof revokeRole>

/** setFeeRecipient(address) */
export const setFeeRecipient = func('0xe74b981b', {
    feeRecipient: address,
})
export type SetFeeRecipientParams = FunctionArguments<typeof setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof setFeeRecipient>

/** setFeesParametersOnPair(address,address,uint16,uint16,uint16,uint16,uint16,uint24,uint16,uint24) */
export const setFeesParametersOnPair = func('0x093ff769', {
    tokenX: address,
    tokenY: address,
    binStep: uint16,
    baseFactor: uint16,
    filterPeriod: uint16,
    decayPeriod: uint16,
    reductionFactor: uint16,
    variableFeeControl: uint24,
    protocolShare: uint16,
    maxVolatilityAccumulator: uint24,
})
export type SetFeesParametersOnPairParams = FunctionArguments<typeof setFeesParametersOnPair>
export type SetFeesParametersOnPairReturn = FunctionReturn<typeof setFeesParametersOnPair>

/** setFlashLoanFee(uint256) */
export const setFlashLoanFee = func('0xe92d0d5d', {
    flashLoanFee: uint256,
})
export type SetFlashLoanFeeParams = FunctionArguments<typeof setFlashLoanFee>
export type SetFlashLoanFeeReturn = FunctionReturn<typeof setFlashLoanFee>

/** setLBHooksParametersOnPair(address,address,uint16,bytes32,bytes) */
export const setLBHooksParametersOnPair = func('0x3a2f1a91', {
    tokenX: address,
    tokenY: address,
    binStep: uint16,
    hooksParameters: bytes32,
    onHooksSetData: bytes,
})
export type SetLBHooksParametersOnPairParams = FunctionArguments<typeof setLBHooksParametersOnPair>
export type SetLBHooksParametersOnPairReturn = FunctionReturn<typeof setLBHooksParametersOnPair>

/** setLBPairIgnored(address,address,uint16,bool) */
export const setLBPairIgnored = func('0x69d56ea3', {
    tokenX: address,
    tokenY: address,
    binStep: uint16,
    ignored: bool,
})
export type SetLBPairIgnoredParams = FunctionArguments<typeof setLBPairIgnored>
export type SetLBPairIgnoredReturn = FunctionReturn<typeof setLBPairIgnored>

/** setLBPairImplementation(address) */
export const setLBPairImplementation = func('0xb0384781', {
    newLBPairImplementation: address,
})
export type SetLBPairImplementationParams = FunctionArguments<typeof setLBPairImplementation>
export type SetLBPairImplementationReturn = FunctionReturn<typeof setLBPairImplementation>

/** setPreset(uint16,uint16,uint16,uint16,uint16,uint24,uint16,uint24,bool) */
export const setPreset = func('0x379ee803', {
    binStep: uint16,
    baseFactor: uint16,
    filterPeriod: uint16,
    decayPeriod: uint16,
    reductionFactor: uint16,
    variableFeeControl: uint24,
    protocolShare: uint16,
    maxVolatilityAccumulator: uint24,
    isOpen: bool,
})
export type SetPresetParams = FunctionArguments<typeof setPreset>
export type SetPresetReturn = FunctionReturn<typeof setPreset>

/** setPresetOpenState(uint16,bool) */
export const setPresetOpenState = func('0x4cd161d3', {
    binStep: uint16,
    isOpen: bool,
})
export type SetPresetOpenStateParams = FunctionArguments<typeof setPresetOpenState>
export type SetPresetOpenStateReturn = FunctionReturn<typeof setPresetOpenState>

/** supportsInterface(bytes4) */
export const supportsInterface = func('0x01ffc9a7', {
    interfaceId: bytes4,
}, bool)
export type SupportsInterfaceParams = FunctionArguments<typeof supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof supportsInterface>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    newOwner: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>
