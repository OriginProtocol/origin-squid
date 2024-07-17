import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AdminSet: event("0x8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c", "AdminSet(address)", {"newAdmin": p.address}),
    'ConfigSet((address,uint64,uint64,address,address,address),(uint32,address,address,uint16,uint32,uint32))': event("0xe668e1a4644c1a030b909bbfd837f5cfa914994ed5e0bb2e9c34a5c37753128a", "ConfigSet((address,uint64,uint64,address,address,address),(uint32,address,address,uint16,uint32,uint32))", {"staticConfig": p.struct({"commitStore": p.address, "chainSelector": p.uint64, "sourceChainSelector": p.uint64, "onRamp": p.address, "prevOffRamp": p.address, "armProxy": p.address}), "dynamicConfig": p.struct({"permissionLessExecutionThresholdSeconds": p.uint32, "router": p.address, "priceRegistry": p.address, "maxNumberOfTokensPerMsg": p.uint16, "maxDataBytes": p.uint32, "maxPoolReleaseOrMintGas": p.uint32})}),
    'ConfigSet(uint32,bytes32,uint64,address[],address[],uint8,bytes,uint64,bytes)': event("0x1591690b8638f5fb2dbec82ac741805ac5da8b45dc5263f4875b0496fdce4e05", "ConfigSet(uint32,bytes32,uint64,address[],address[],uint8,bytes,uint64,bytes)", {"previousConfigBlockNumber": p.uint32, "configDigest": p.bytes32, "configCount": p.uint64, "signers": p.array(p.address), "transmitters": p.array(p.address), "f": p.uint8, "onchainConfig": p.bytes, "offchainConfigVersion": p.uint64, "offchainConfig": p.bytes}),
    ExecutionStateChanged: event("0xd4f851956a5d67c3997d1c9205045fef79bae2947fdee7e9e2641abc7391ef65", "ExecutionStateChanged(uint64,bytes32,uint8,bytes)", {"sequenceNumber": indexed(p.uint64), "messageId": indexed(p.bytes32), "state": p.uint8, "returnData": p.bytes}),
    OwnershipTransferRequested: event("0xed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278", "OwnershipTransferRequested(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"from": indexed(p.address), "to": indexed(p.address)}),
    PoolAdded: event("0x95f865c2808f8b2a85eea2611db7843150ee7835ef1403f9755918a97d76933c", "PoolAdded(address,address)", {"token": p.address, "pool": p.address}),
    PoolRemoved: event("0x987eb3c2f78454541205f72f34839b434c306c9eaf4922efd7c0c3060fdb2e4c", "PoolRemoved(address,address)", {"token": p.address, "pool": p.address}),
    SkippedIncorrectNonce: event("0xd32ddb11d71e3d63411d37b09f9a8b28664f1cb1338bfd1413c173b0ebf41237", "SkippedIncorrectNonce(uint64,address)", {"nonce": indexed(p.uint64), "sender": indexed(p.address)}),
    SkippedSenderWithPreviousRampMessageInflight: event("0xe44a20935573a783dd0d5991c92d7b6a0eb3173566530364db3ec10e9a990b5d", "SkippedSenderWithPreviousRampMessageInflight(uint64,address)", {"nonce": indexed(p.uint64), "sender": indexed(p.address)}),
    Transmitted: event("0xb04e63db38c49950639fa09d29872f21f5d49d614f3a969d8adf3d4b52e41a62", "Transmitted(bytes32,uint32)", {"configDigest": p.bytes32, "epoch": p.uint32}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    applyPoolUpdates: fun("0x3a87ac53", "applyPoolUpdates((address,address)[],(address,address)[])", {"removes": p.array(p.struct({"token": p.address, "pool": p.address})), "adds": p.array(p.struct({"token": p.address, "pool": p.address}))}, ),
    ccipReceive: viewFun("0x85572ffb", "ccipReceive((bytes32,uint64,bytes,bytes,(address,uint256)[]))", {"_0": p.struct({"messageId": p.bytes32, "sourceChainSelector": p.uint64, "sender": p.bytes, "data": p.bytes, "destTokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256}))})}, ),
    currentRateLimiterState: viewFun("0x546719cd", "currentRateLimiterState()", {}, p.struct({"tokens": p.uint128, "lastUpdated": p.uint32, "isEnabled": p.bool, "capacity": p.uint128, "rate": p.uint128})),
    executeSingleMessage: fun("0xf52121a5", "executeSingleMessage((uint64,address,address,uint64,uint256,bool,uint64,address,uint256,bytes,(address,uint256)[],bytes[],bytes32),bytes[])", {"message": p.struct({"sourceChainSelector": p.uint64, "sender": p.address, "receiver": p.address, "sequenceNumber": p.uint64, "gasLimit": p.uint256, "strict": p.bool, "nonce": p.uint64, "feeToken": p.address, "feeTokenAmount": p.uint256, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "sourceTokenData": p.array(p.bytes), "messageId": p.bytes32}), "offchainTokenData": p.array(p.bytes)}, ),
    getDestinationToken: viewFun("0xb4069b31", "getDestinationToken(address)", {"sourceToken": p.address}, p.address),
    getDestinationTokens: viewFun("0x681fba16", "getDestinationTokens()", {}, p.array(p.address)),
    getDynamicConfig: viewFun("0x7437ff9f", "getDynamicConfig()", {}, p.struct({"permissionLessExecutionThresholdSeconds": p.uint32, "router": p.address, "priceRegistry": p.address, "maxNumberOfTokensPerMsg": p.uint16, "maxDataBytes": p.uint32, "maxPoolReleaseOrMintGas": p.uint32})),
    getExecutionState: viewFun("0x142a98fc", "getExecutionState(uint64)", {"sequenceNumber": p.uint64}, p.uint8),
    getPoolByDestToken: viewFun("0xd7e2bb50", "getPoolByDestToken(address)", {"destToken": p.address}, p.address),
    getPoolBySourceToken: viewFun("0x5d86f141", "getPoolBySourceToken(address)", {"sourceToken": p.address}, p.address),
    getSenderNonce: viewFun("0x856c8247", "getSenderNonce(address)", {"sender": p.address}, p.uint64),
    getStaticConfig: viewFun("0x06285c69", "getStaticConfig()", {}, p.struct({"commitStore": p.address, "chainSelector": p.uint64, "sourceChainSelector": p.uint64, "onRamp": p.address, "prevOffRamp": p.address, "armProxy": p.address})),
    getSupportedTokens: viewFun("0xd3c7c2c7", "getSupportedTokens()", {}, p.array(p.address)),
    getTokenLimitAdmin: viewFun("0x599f6431", "getTokenLimitAdmin()", {}, p.address),
    getTransmitters: viewFun("0x666cab8d", "getTransmitters()", {}, p.array(p.address)),
    latestConfigDetails: viewFun("0x81ff7048", "latestConfigDetails()", {}, {"configCount": p.uint32, "blockNumber": p.uint32, "configDigest": p.bytes32}),
    latestConfigDigestAndEpoch: viewFun("0xafcb95d7", "latestConfigDigestAndEpoch()", {}, {"scanLogs": p.bool, "configDigest": p.bytes32, "epoch": p.uint32}),
    manuallyExecute: fun("0x740f4150", "manuallyExecute(((uint64,address,address,uint64,uint256,bool,uint64,address,uint256,bytes,(address,uint256)[],bytes[],bytes32)[],bytes[][],bytes32[],uint256),uint256[])", {"report": p.struct({"messages": p.array(p.struct({"sourceChainSelector": p.uint64, "sender": p.address, "receiver": p.address, "sequenceNumber": p.uint64, "gasLimit": p.uint256, "strict": p.bool, "nonce": p.uint64, "feeToken": p.address, "feeTokenAmount": p.uint256, "data": p.bytes, "tokenAmounts": p.array(p.struct({"token": p.address, "amount": p.uint256})), "sourceTokenData": p.array(p.bytes), "messageId": p.bytes32})), "offchainTokenData": p.array(p.array(p.bytes)), "proofs": p.array(p.bytes32), "proofFlagBits": p.uint256}), "gasLimitOverrides": p.array(p.uint256)}, ),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    setAdmin: fun("0x704b6c02", "setAdmin(address)", {"newAdmin": p.address}, ),
    setOCR2Config: fun("0x1ef38174", "setOCR2Config(address[],address[],uint8,bytes,uint64,bytes)", {"signers": p.array(p.address), "transmitters": p.array(p.address), "f": p.uint8, "onchainConfig": p.bytes, "offchainConfigVersion": p.uint64, "offchainConfig": p.bytes}, ),
    setRateLimiterConfig: fun("0xc92b2832", "setRateLimiterConfig((bool,uint128,uint128))", {"config": p.struct({"isEnabled": p.bool, "capacity": p.uint128, "rate": p.uint128})}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"to": p.address}, ),
    transmit: fun("0xb1dc65a4", "transmit(bytes32[3],bytes,bytes32[],bytes32[],bytes32)", {"reportContext": p.fixedSizeArray(p.bytes32, 3), "report": p.bytes, "rs": p.array(p.bytes32), "ss": p.array(p.bytes32), "_4": p.bytes32}, ),
    typeAndVersion: viewFun("0x181f5a77", "typeAndVersion()", {}, p.string),
}

export class Contract extends ContractBase {

    currentRateLimiterState() {
        return this.eth_call(functions.currentRateLimiterState, {})
    }

    getDestinationToken(sourceToken: GetDestinationTokenParams["sourceToken"]) {
        return this.eth_call(functions.getDestinationToken, {sourceToken})
    }

    getDestinationTokens() {
        return this.eth_call(functions.getDestinationTokens, {})
    }

    getDynamicConfig() {
        return this.eth_call(functions.getDynamicConfig, {})
    }

    getExecutionState(sequenceNumber: GetExecutionStateParams["sequenceNumber"]) {
        return this.eth_call(functions.getExecutionState, {sequenceNumber})
    }

    getPoolByDestToken(destToken: GetPoolByDestTokenParams["destToken"]) {
        return this.eth_call(functions.getPoolByDestToken, {destToken})
    }

    getPoolBySourceToken(sourceToken: GetPoolBySourceTokenParams["sourceToken"]) {
        return this.eth_call(functions.getPoolBySourceToken, {sourceToken})
    }

    getSenderNonce(sender: GetSenderNonceParams["sender"]) {
        return this.eth_call(functions.getSenderNonce, {sender})
    }

    getStaticConfig() {
        return this.eth_call(functions.getStaticConfig, {})
    }

    getSupportedTokens() {
        return this.eth_call(functions.getSupportedTokens, {})
    }

    getTokenLimitAdmin() {
        return this.eth_call(functions.getTokenLimitAdmin, {})
    }

    getTransmitters() {
        return this.eth_call(functions.getTransmitters, {})
    }

    latestConfigDetails() {
        return this.eth_call(functions.latestConfigDetails, {})
    }

    latestConfigDigestAndEpoch() {
        return this.eth_call(functions.latestConfigDigestAndEpoch, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    typeAndVersion() {
        return this.eth_call(functions.typeAndVersion, {})
    }
}

/// Event types
export type AdminSetEventArgs = EParams<typeof events.AdminSet>
export type ConfigSetEventArgs_0 = EParams<typeof events['ConfigSet((address,uint64,uint64,address,address,address),(uint32,address,address,uint16,uint32,uint32))']>
export type ConfigSetEventArgs_1 = EParams<typeof events['ConfigSet(uint32,bytes32,uint64,address[],address[],uint8,bytes,uint64,bytes)']>
export type ExecutionStateChangedEventArgs = EParams<typeof events.ExecutionStateChanged>
export type OwnershipTransferRequestedEventArgs = EParams<typeof events.OwnershipTransferRequested>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PoolAddedEventArgs = EParams<typeof events.PoolAdded>
export type PoolRemovedEventArgs = EParams<typeof events.PoolRemoved>
export type SkippedIncorrectNonceEventArgs = EParams<typeof events.SkippedIncorrectNonce>
export type SkippedSenderWithPreviousRampMessageInflightEventArgs = EParams<typeof events.SkippedSenderWithPreviousRampMessageInflight>
export type TransmittedEventArgs = EParams<typeof events.Transmitted>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type ApplyPoolUpdatesParams = FunctionArguments<typeof functions.applyPoolUpdates>
export type ApplyPoolUpdatesReturn = FunctionReturn<typeof functions.applyPoolUpdates>

export type CcipReceiveParams = FunctionArguments<typeof functions.ccipReceive>
export type CcipReceiveReturn = FunctionReturn<typeof functions.ccipReceive>

export type CurrentRateLimiterStateParams = FunctionArguments<typeof functions.currentRateLimiterState>
export type CurrentRateLimiterStateReturn = FunctionReturn<typeof functions.currentRateLimiterState>

export type ExecuteSingleMessageParams = FunctionArguments<typeof functions.executeSingleMessage>
export type ExecuteSingleMessageReturn = FunctionReturn<typeof functions.executeSingleMessage>

export type GetDestinationTokenParams = FunctionArguments<typeof functions.getDestinationToken>
export type GetDestinationTokenReturn = FunctionReturn<typeof functions.getDestinationToken>

export type GetDestinationTokensParams = FunctionArguments<typeof functions.getDestinationTokens>
export type GetDestinationTokensReturn = FunctionReturn<typeof functions.getDestinationTokens>

export type GetDynamicConfigParams = FunctionArguments<typeof functions.getDynamicConfig>
export type GetDynamicConfigReturn = FunctionReturn<typeof functions.getDynamicConfig>

export type GetExecutionStateParams = FunctionArguments<typeof functions.getExecutionState>
export type GetExecutionStateReturn = FunctionReturn<typeof functions.getExecutionState>

export type GetPoolByDestTokenParams = FunctionArguments<typeof functions.getPoolByDestToken>
export type GetPoolByDestTokenReturn = FunctionReturn<typeof functions.getPoolByDestToken>

export type GetPoolBySourceTokenParams = FunctionArguments<typeof functions.getPoolBySourceToken>
export type GetPoolBySourceTokenReturn = FunctionReturn<typeof functions.getPoolBySourceToken>

export type GetSenderNonceParams = FunctionArguments<typeof functions.getSenderNonce>
export type GetSenderNonceReturn = FunctionReturn<typeof functions.getSenderNonce>

export type GetStaticConfigParams = FunctionArguments<typeof functions.getStaticConfig>
export type GetStaticConfigReturn = FunctionReturn<typeof functions.getStaticConfig>

export type GetSupportedTokensParams = FunctionArguments<typeof functions.getSupportedTokens>
export type GetSupportedTokensReturn = FunctionReturn<typeof functions.getSupportedTokens>

export type GetTokenLimitAdminParams = FunctionArguments<typeof functions.getTokenLimitAdmin>
export type GetTokenLimitAdminReturn = FunctionReturn<typeof functions.getTokenLimitAdmin>

export type GetTransmittersParams = FunctionArguments<typeof functions.getTransmitters>
export type GetTransmittersReturn = FunctionReturn<typeof functions.getTransmitters>

export type LatestConfigDetailsParams = FunctionArguments<typeof functions.latestConfigDetails>
export type LatestConfigDetailsReturn = FunctionReturn<typeof functions.latestConfigDetails>

export type LatestConfigDigestAndEpochParams = FunctionArguments<typeof functions.latestConfigDigestAndEpoch>
export type LatestConfigDigestAndEpochReturn = FunctionReturn<typeof functions.latestConfigDigestAndEpoch>

export type ManuallyExecuteParams = FunctionArguments<typeof functions.manuallyExecute>
export type ManuallyExecuteReturn = FunctionReturn<typeof functions.manuallyExecute>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type SetAdminParams = FunctionArguments<typeof functions.setAdmin>
export type SetAdminReturn = FunctionReturn<typeof functions.setAdmin>

export type SetOCR2ConfigParams = FunctionArguments<typeof functions.setOCR2Config>
export type SetOCR2ConfigReturn = FunctionReturn<typeof functions.setOCR2Config>

export type SetRateLimiterConfigParams = FunctionArguments<typeof functions.setRateLimiterConfig>
export type SetRateLimiterConfigReturn = FunctionReturn<typeof functions.setRateLimiterConfig>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TransmitParams = FunctionArguments<typeof functions.transmit>
export type TransmitReturn = FunctionReturn<typeof functions.transmit>

export type TypeAndVersionParams = FunctionArguments<typeof functions.typeAndVersion>
export type TypeAndVersionReturn = FunctionReturn<typeof functions.typeAndVersion>

