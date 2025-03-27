import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    FeeRecipientSet: event("0x15d80a013f22151bc7246e3bc132e12828cde19de98870475e3fa70840152721", "FeeRecipientSet(address,address)", {"oldRecipient": p.address, "newRecipient": p.address}),
    FlashLoanFeeSet: event("0x5c34e91c94c78b662a45d0bd4a25a4e32c584c54a45a76e4a4d43be27ba40e50", "FlashLoanFeeSet(uint256,uint256)", {"oldFlashLoanFee": p.uint256, "newFlashLoanFee": p.uint256}),
    LBPairCreated: event("0x2c8d104b27c6b7f4492017a6f5cf3803043688934ebcaa6a03540beeaf976aff", "LBPairCreated(address,address,uint256,address,uint256)", {"tokenX": indexed(p.address), "tokenY": indexed(p.address), "binStep": indexed(p.uint256), "LBPair": p.address, "pid": p.uint256}),
    LBPairIgnoredStateChanged: event("0x44cf35361c9ff3c8c1397ec6410d5495cc481feaef35c9af11da1a637107de4f", "LBPairIgnoredStateChanged(address,bool)", {"LBPair": indexed(p.address), "ignored": p.bool}),
    LBPairImplementationSet: event("0x900d0e3d359f50e4f923ecdc06b401e07dbb9f485e17b07bcfc91a13000b277e", "LBPairImplementationSet(address,address)", {"oldLBPairImplementation": p.address, "LBPairImplementation": p.address}),
    OwnershipTransferStarted: event("0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700", "OwnershipTransferStarted(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PresetOpenStateChanged: event("0x58a8b6a02b964cca2712e5a71d7b0d564a56b4a0f573b4c47f389341ade14cfd", "PresetOpenStateChanged(uint256,bool)", {"binStep": indexed(p.uint256), "isOpen": indexed(p.bool)}),
    PresetRemoved: event("0xdd86b848bb56ff540caa68683fa467d0e7eb5f8b2d44e4ee435742eeeae9be13", "PresetRemoved(uint256)", {"binStep": indexed(p.uint256)}),
    PresetSet: event("0x839844a256a87f87c9c835117d9a1c40be013954064c937072acb32d36db6a28", "PresetSet(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)", {"binStep": indexed(p.uint256), "baseFactor": p.uint256, "filterPeriod": p.uint256, "decayPeriod": p.uint256, "reductionFactor": p.uint256, "variableFeeControl": p.uint256, "protocolShare": p.uint256, "maxVolatilityAccumulator": p.uint256}),
    QuoteAssetAdded: event("0x84cc2115995684dcb0cd3d3a9565e3d32f075de81db70c8dc3a719b2a47af67e", "QuoteAssetAdded(address)", {"quoteAsset": indexed(p.address)}),
    QuoteAssetRemoved: event("0x0b767739217755d8af5a2ba75b181a19fa1750f8bb701f09311cb19a90140cb3", "QuoteAssetRemoved(address)", {"quoteAsset": indexed(p.address)}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    LB_HOOKS_MANAGER_ROLE: viewFun("0x1af5bacc", "LB_HOOKS_MANAGER_ROLE()", {}, p.bytes32),
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    addQuoteAsset: fun("0x5a440923", "addQuoteAsset(address)", {"quoteAsset": p.address}, ),
    createLBPair: fun("0x659ac74b", "createLBPair(address,address,uint24,uint16)", {"tokenX": p.address, "tokenY": p.address, "activeId": p.uint24, "binStep": p.uint16}, p.address),
    forceDecay: fun("0x3c78a941", "forceDecay(address)", {"pair": p.address}, ),
    getAllBinSteps: viewFun("0x5b35875c", "getAllBinSteps()", {}, p.array(p.uint256)),
    getAllLBPairs: viewFun("0x6622e0d7", "getAllLBPairs(address,address)", {"tokenX": p.address, "tokenY": p.address}, p.array(p.struct({"binStep": p.uint16, "LBPair": p.address, "createdByOwner": p.bool, "ignoredForRouting": p.bool}))),
    getFeeRecipient: viewFun("0x4ccb20c0", "getFeeRecipient()", {}, p.address),
    getFlashLoanFee: viewFun("0xfd90c2be", "getFlashLoanFee()", {}, p.uint256),
    getLBPairAtIndex: viewFun("0x7daf5d66", "getLBPairAtIndex(uint256)", {"index": p.uint256}, p.address),
    getLBPairImplementation: viewFun("0xaf371065", "getLBPairImplementation()", {}, p.address),
    getLBPairInformation: viewFun("0x704037bd", "getLBPairInformation(address,address,uint256)", {"tokenA": p.address, "tokenB": p.address, "binStep": p.uint256}, p.struct({"binStep": p.uint16, "LBPair": p.address, "createdByOwner": p.bool, "ignoredForRouting": p.bool})),
    getMaxFlashLoanFee: viewFun("0x8ce9aa1c", "getMaxFlashLoanFee()", {}, p.uint256),
    getMinBinStep: viewFun("0x701ab8c1", "getMinBinStep()", {}, p.uint256),
    getNumberOfLBPairs: viewFun("0x4e937c3a", "getNumberOfLBPairs()", {}, p.uint256),
    getNumberOfQuoteAssets: viewFun("0x80c5061e", "getNumberOfQuoteAssets()", {}, p.uint256),
    getOpenBinSteps: viewFun("0x0282c9c1", "getOpenBinSteps()", {}, p.array(p.uint256)),
    getPreset: viewFun("0xaabc4b3c", "getPreset(uint256)", {"binStep": p.uint256}, {"baseFactor": p.uint256, "filterPeriod": p.uint256, "decayPeriod": p.uint256, "reductionFactor": p.uint256, "variableFeeControl": p.uint256, "protocolShare": p.uint256, "maxVolatilityAccumulator": p.uint256, "isOpen": p.bool}),
    getQuoteAssetAtIndex: viewFun("0x0752092b", "getQuoteAssetAtIndex(uint256)", {"index": p.uint256}, p.address),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    isQuoteAsset: viewFun("0x27721842", "isQuoteAsset(address)", {"token": p.address}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pendingOwner: viewFun("0xe30c3978", "pendingOwner()", {}, p.address),
    removeLBHooksOnPair: fun("0x2cc06b8c", "removeLBHooksOnPair(address,address,uint16)", {"tokenX": p.address, "tokenY": p.address, "binStep": p.uint16}, ),
    removePreset: fun("0xe203a31f", "removePreset(uint16)", {"binStep": p.uint16}, ),
    removeQuoteAsset: fun("0xddbfd941", "removeQuoteAsset(address)", {"quoteAsset": p.address}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setFeeRecipient: fun("0xe74b981b", "setFeeRecipient(address)", {"feeRecipient": p.address}, ),
    setFeesParametersOnPair: fun("0x093ff769", "setFeesParametersOnPair(address,address,uint16,uint16,uint16,uint16,uint16,uint24,uint16,uint24)", {"tokenX": p.address, "tokenY": p.address, "binStep": p.uint16, "baseFactor": p.uint16, "filterPeriod": p.uint16, "decayPeriod": p.uint16, "reductionFactor": p.uint16, "variableFeeControl": p.uint24, "protocolShare": p.uint16, "maxVolatilityAccumulator": p.uint24}, ),
    setFlashLoanFee: fun("0xe92d0d5d", "setFlashLoanFee(uint256)", {"flashLoanFee": p.uint256}, ),
    setLBHooksParametersOnPair: fun("0x3a2f1a91", "setLBHooksParametersOnPair(address,address,uint16,bytes32,bytes)", {"tokenX": p.address, "tokenY": p.address, "binStep": p.uint16, "hooksParameters": p.bytes32, "onHooksSetData": p.bytes}, ),
    setLBPairIgnored: fun("0x69d56ea3", "setLBPairIgnored(address,address,uint16,bool)", {"tokenX": p.address, "tokenY": p.address, "binStep": p.uint16, "ignored": p.bool}, ),
    setLBPairImplementation: fun("0xb0384781", "setLBPairImplementation(address)", {"newLBPairImplementation": p.address}, ),
    setPreset: fun("0x379ee803", "setPreset(uint16,uint16,uint16,uint16,uint16,uint24,uint16,uint24,bool)", {"binStep": p.uint16, "baseFactor": p.uint16, "filterPeriod": p.uint16, "decayPeriod": p.uint16, "reductionFactor": p.uint16, "variableFeeControl": p.uint24, "protocolShare": p.uint16, "maxVolatilityAccumulator": p.uint24, "isOpen": p.bool}, ),
    setPresetOpenState: fun("0x4cd161d3", "setPresetOpenState(uint16,bool)", {"binStep": p.uint16, "isOpen": p.bool}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    LB_HOOKS_MANAGER_ROLE() {
        return this.eth_call(functions.LB_HOOKS_MANAGER_ROLE, {})
    }

    getAllBinSteps() {
        return this.eth_call(functions.getAllBinSteps, {})
    }

    getAllLBPairs(tokenX: GetAllLBPairsParams["tokenX"], tokenY: GetAllLBPairsParams["tokenY"]) {
        return this.eth_call(functions.getAllLBPairs, {tokenX, tokenY})
    }

    getFeeRecipient() {
        return this.eth_call(functions.getFeeRecipient, {})
    }

    getFlashLoanFee() {
        return this.eth_call(functions.getFlashLoanFee, {})
    }

    getLBPairAtIndex(index: GetLBPairAtIndexParams["index"]) {
        return this.eth_call(functions.getLBPairAtIndex, {index})
    }

    getLBPairImplementation() {
        return this.eth_call(functions.getLBPairImplementation, {})
    }

    getLBPairInformation(tokenA: GetLBPairInformationParams["tokenA"], tokenB: GetLBPairInformationParams["tokenB"], binStep: GetLBPairInformationParams["binStep"]) {
        return this.eth_call(functions.getLBPairInformation, {tokenA, tokenB, binStep})
    }

    getMaxFlashLoanFee() {
        return this.eth_call(functions.getMaxFlashLoanFee, {})
    }

    getMinBinStep() {
        return this.eth_call(functions.getMinBinStep, {})
    }

    getNumberOfLBPairs() {
        return this.eth_call(functions.getNumberOfLBPairs, {})
    }

    getNumberOfQuoteAssets() {
        return this.eth_call(functions.getNumberOfQuoteAssets, {})
    }

    getOpenBinSteps() {
        return this.eth_call(functions.getOpenBinSteps, {})
    }

    getPreset(binStep: GetPresetParams["binStep"]) {
        return this.eth_call(functions.getPreset, {binStep})
    }

    getQuoteAssetAtIndex(index: GetQuoteAssetAtIndexParams["index"]) {
        return this.eth_call(functions.getQuoteAssetAtIndex, {index})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isQuoteAsset(token: IsQuoteAssetParams["token"]) {
        return this.eth_call(functions.isQuoteAsset, {token})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingOwner() {
        return this.eth_call(functions.pendingOwner, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }
}

/// Event types
export type FeeRecipientSetEventArgs = EParams<typeof events.FeeRecipientSet>
export type FlashLoanFeeSetEventArgs = EParams<typeof events.FlashLoanFeeSet>
export type LBPairCreatedEventArgs = EParams<typeof events.LBPairCreated>
export type LBPairIgnoredStateChangedEventArgs = EParams<typeof events.LBPairIgnoredStateChanged>
export type LBPairImplementationSetEventArgs = EParams<typeof events.LBPairImplementationSet>
export type OwnershipTransferStartedEventArgs = EParams<typeof events.OwnershipTransferStarted>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PresetOpenStateChangedEventArgs = EParams<typeof events.PresetOpenStateChanged>
export type PresetRemovedEventArgs = EParams<typeof events.PresetRemoved>
export type PresetSetEventArgs = EParams<typeof events.PresetSet>
export type QuoteAssetAddedEventArgs = EParams<typeof events.QuoteAssetAdded>
export type QuoteAssetRemovedEventArgs = EParams<typeof events.QuoteAssetRemoved>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type LB_HOOKS_MANAGER_ROLEParams = FunctionArguments<typeof functions.LB_HOOKS_MANAGER_ROLE>
export type LB_HOOKS_MANAGER_ROLEReturn = FunctionReturn<typeof functions.LB_HOOKS_MANAGER_ROLE>

export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type AddQuoteAssetParams = FunctionArguments<typeof functions.addQuoteAsset>
export type AddQuoteAssetReturn = FunctionReturn<typeof functions.addQuoteAsset>

export type CreateLBPairParams = FunctionArguments<typeof functions.createLBPair>
export type CreateLBPairReturn = FunctionReturn<typeof functions.createLBPair>

export type ForceDecayParams = FunctionArguments<typeof functions.forceDecay>
export type ForceDecayReturn = FunctionReturn<typeof functions.forceDecay>

export type GetAllBinStepsParams = FunctionArguments<typeof functions.getAllBinSteps>
export type GetAllBinStepsReturn = FunctionReturn<typeof functions.getAllBinSteps>

export type GetAllLBPairsParams = FunctionArguments<typeof functions.getAllLBPairs>
export type GetAllLBPairsReturn = FunctionReturn<typeof functions.getAllLBPairs>

export type GetFeeRecipientParams = FunctionArguments<typeof functions.getFeeRecipient>
export type GetFeeRecipientReturn = FunctionReturn<typeof functions.getFeeRecipient>

export type GetFlashLoanFeeParams = FunctionArguments<typeof functions.getFlashLoanFee>
export type GetFlashLoanFeeReturn = FunctionReturn<typeof functions.getFlashLoanFee>

export type GetLBPairAtIndexParams = FunctionArguments<typeof functions.getLBPairAtIndex>
export type GetLBPairAtIndexReturn = FunctionReturn<typeof functions.getLBPairAtIndex>

export type GetLBPairImplementationParams = FunctionArguments<typeof functions.getLBPairImplementation>
export type GetLBPairImplementationReturn = FunctionReturn<typeof functions.getLBPairImplementation>

export type GetLBPairInformationParams = FunctionArguments<typeof functions.getLBPairInformation>
export type GetLBPairInformationReturn = FunctionReturn<typeof functions.getLBPairInformation>

export type GetMaxFlashLoanFeeParams = FunctionArguments<typeof functions.getMaxFlashLoanFee>
export type GetMaxFlashLoanFeeReturn = FunctionReturn<typeof functions.getMaxFlashLoanFee>

export type GetMinBinStepParams = FunctionArguments<typeof functions.getMinBinStep>
export type GetMinBinStepReturn = FunctionReturn<typeof functions.getMinBinStep>

export type GetNumberOfLBPairsParams = FunctionArguments<typeof functions.getNumberOfLBPairs>
export type GetNumberOfLBPairsReturn = FunctionReturn<typeof functions.getNumberOfLBPairs>

export type GetNumberOfQuoteAssetsParams = FunctionArguments<typeof functions.getNumberOfQuoteAssets>
export type GetNumberOfQuoteAssetsReturn = FunctionReturn<typeof functions.getNumberOfQuoteAssets>

export type GetOpenBinStepsParams = FunctionArguments<typeof functions.getOpenBinSteps>
export type GetOpenBinStepsReturn = FunctionReturn<typeof functions.getOpenBinSteps>

export type GetPresetParams = FunctionArguments<typeof functions.getPreset>
export type GetPresetReturn = FunctionReturn<typeof functions.getPreset>

export type GetQuoteAssetAtIndexParams = FunctionArguments<typeof functions.getQuoteAssetAtIndex>
export type GetQuoteAssetAtIndexReturn = FunctionReturn<typeof functions.getQuoteAssetAtIndex>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type IsQuoteAssetParams = FunctionArguments<typeof functions.isQuoteAsset>
export type IsQuoteAssetReturn = FunctionReturn<typeof functions.isQuoteAsset>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingOwnerParams = FunctionArguments<typeof functions.pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof functions.pendingOwner>

export type RemoveLBHooksOnPairParams = FunctionArguments<typeof functions.removeLBHooksOnPair>
export type RemoveLBHooksOnPairReturn = FunctionReturn<typeof functions.removeLBHooksOnPair>

export type RemovePresetParams = FunctionArguments<typeof functions.removePreset>
export type RemovePresetReturn = FunctionReturn<typeof functions.removePreset>

export type RemoveQuoteAssetParams = FunctionArguments<typeof functions.removeQuoteAsset>
export type RemoveQuoteAssetReturn = FunctionReturn<typeof functions.removeQuoteAsset>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetFeeRecipientParams = FunctionArguments<typeof functions.setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof functions.setFeeRecipient>

export type SetFeesParametersOnPairParams = FunctionArguments<typeof functions.setFeesParametersOnPair>
export type SetFeesParametersOnPairReturn = FunctionReturn<typeof functions.setFeesParametersOnPair>

export type SetFlashLoanFeeParams = FunctionArguments<typeof functions.setFlashLoanFee>
export type SetFlashLoanFeeReturn = FunctionReturn<typeof functions.setFlashLoanFee>

export type SetLBHooksParametersOnPairParams = FunctionArguments<typeof functions.setLBHooksParametersOnPair>
export type SetLBHooksParametersOnPairReturn = FunctionReturn<typeof functions.setLBHooksParametersOnPair>

export type SetLBPairIgnoredParams = FunctionArguments<typeof functions.setLBPairIgnored>
export type SetLBPairIgnoredReturn = FunctionReturn<typeof functions.setLBPairIgnored>

export type SetLBPairImplementationParams = FunctionArguments<typeof functions.setLBPairImplementation>
export type SetLBPairImplementationReturn = FunctionReturn<typeof functions.setLBPairImplementation>

export type SetPresetParams = FunctionArguments<typeof functions.setPreset>
export type SetPresetReturn = FunctionReturn<typeof functions.setPreset>

export type SetPresetOpenStateParams = FunctionArguments<typeof functions.setPresetOpenState>
export type SetPresetOpenStateReturn = FunctionReturn<typeof functions.setPresetOpenState>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

