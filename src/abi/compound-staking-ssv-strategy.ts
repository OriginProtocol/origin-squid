import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    BalancesSnapped: event("0xb7523e03ed4a74718427c422a01fee1138835adb5bd592240f30bd8b5e1b929a", "BalancesSnapped(bytes32,uint256)", {"blockRoot": indexed(p.bytes32), "ethBalance": p.uint256}),
    BalancesVerified: event("0xed2528338eefb63fd1860078b91e35106bc25e3fd528634d180f662582fe5ec1", "BalancesVerified(uint64,uint256,uint256,uint256)", {"timestamp": indexed(p.uint64), "totalDepositsWei": p.uint256, "totalValidatorBalance": p.uint256, "ethBalance": p.uint256}),
    Deposit: event("0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62", "Deposit(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
    DepositVerified: event("0xae0e4f727389efd70d748d667436e0264f370ae498b339b713797dbab57b12ff", "DepositVerified(bytes32,uint256)", {"pendingDepositRoot": indexed(p.bytes32), "amountWei": p.uint256}),
    ETHStaked: event("0xaca97428a1d7f2b7c4cee2fbe4feda457e132b404b0c9c3ff73bf7a988d889a8", "ETHStaked(bytes32,bytes32,bytes,uint256)", {"pubKeyHash": indexed(p.bytes32), "pendingDepositRoot": indexed(p.bytes32), "pubKey": p.bytes, "amountWei": p.uint256}),
    FirstDepositReset: event("0xce77f85e30b0e6df0d12527ddf038f900fdeda0eeda4284c52be47b05de31a97", "FirstDepositReset()", {}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    HarvesterAddressesUpdated: event("0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796", "HarvesterAddressesUpdated(address,address)", {"_oldHarvesterAddress": p.address, "_newHarvesterAddress": p.address}),
    PTokenAdded: event("0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765", "PTokenAdded(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PTokenRemoved: event("0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c", "PTokenRemoved(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RegistratorChanged: event("0x83f29c79feb71f8fba9d0fbc4ba5f0982a28b6b1e868b3fc50e6400d100bca0f", "RegistratorChanged(address)", {"newAddress": indexed(p.address)}),
    RewardTokenAddressesUpdated: event("0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc", "RewardTokenAddressesUpdated(address[],address[])", {"_oldAddresses": p.array(p.address), "_newAddresses": p.array(p.address)}),
    RewardTokenCollected: event("0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353", "RewardTokenCollected(address,address,uint256)", {"recipient": p.address, "rewardToken": p.address, "amount": p.uint256}),
    SSVValidatorRegistered: event("0x50837f89f5e75ae0a7bcc858f53ea15fa398dc007fd52cbfe4683ae9a6c2d722", "SSVValidatorRegistered(bytes32,uint64[])", {"pubKeyHash": indexed(p.bytes32), "operatorIds": p.array(p.uint64)}),
    SSVValidatorRemoved: event("0x63d54ea43f163d6e28fc23abec67eb7c3294e7e6f0620955a73cd8d17c7367f4", "SSVValidatorRemoved(bytes32,uint64[])", {"pubKeyHash": indexed(p.bytes32), "operatorIds": p.array(p.uint64)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    ValidatorInvalid: event("0xb8318df57b70f6381fb18aaf762e33efa2cc92627aae83d417f6710e1415d8d8", "ValidatorInvalid(bytes32)", {"pubKeyHash": indexed(p.bytes32)}),
    ValidatorVerified: event("0x8142f1367675d1a37dc1aa31258c38b05f5348de55b799764472d94ccb4a71f4", "ValidatorVerified(bytes32,uint40)", {"pubKeyHash": indexed(p.bytes32), "validatorIndex": indexed(p.uint40)}),
    ValidatorWithdraw: event("0x8dd83105dbd4263d41c76e5d414905babdd3f035bd2031f6ce8895715595979c", "ValidatorWithdraw(bytes32,uint256)", {"pubKeyHash": indexed(p.bytes32), "amountWei": p.uint256}),
    Withdrawal: event("0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "Withdrawal(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
}

export const functions = {
    BEACON_PROOFS: viewFun("0x7da9982a", "BEACON_PROOFS()", {}, p.address),
    SSV_TOKEN: viewFun("0x0df1ecfd", "SSV_TOKEN()", {}, p.address),
    assetToPToken: viewFun("0x0fc3b4c4", "assetToPToken(address)", {"_0": p.address}, p.address),
    checkBalance: viewFun("0x5f515226", "checkBalance(address)", {"_asset": p.address}, p.uint256),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    collectRewardTokens: fun("0x5a063f63", "collectRewardTokens()", {}, ),
    deposit: fun("0x47e7ef24", "deposit(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    depositAll: fun("0xde5f6268", "depositAll()", {}, ),
    depositList: viewFun("0xb8ec6678", "depositList(uint256)", {"_0": p.uint256}, p.bytes32),
    depositListLength: viewFun("0x4896b31a", "depositListLength()", {}, p.uint256),
    depositedWethAccountedFor: viewFun("0xd059f6ef", "depositedWethAccountedFor()", {}, p.uint256),
    deposits: viewFun("0x3d4dff7b", "deposits(bytes32)", {"_0": p.bytes32}, {"pubKeyHash": p.bytes32, "amountGwei": p.uint64, "slot": p.uint64, "depositIndex": p.uint32, "status": p.uint8}),
    firstDeposit: viewFun("0xa5f5be54", "firstDeposit()", {}, p.bool),
    getRewardTokenAddresses: viewFun("0xf6ca71b0", "getRewardTokenAddresses()", {}, p.array(p.address)),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    harvesterAddress: viewFun("0x67c7066c", "harvesterAddress()", {}, p.address),
    initialize: fun("0x435356d1", "initialize(address[],address[],address[])", {"_rewardTokenAddresses": p.array(p.address), "_assets": p.array(p.address), "_pTokens": p.array(p.address)}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    lastVerifiedEthBalance: viewFun("0x59ff4158", "lastVerifiedEthBalance()", {}, p.uint256),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    platformAddress: viewFun("0xdbe55e56", "platformAddress()", {}, p.address),
    registerSsvValidator: fun("0xbb1b918d", "registerSsvValidator(bytes,uint64[],bytes,uint256,(uint32,uint64,uint64,bool,uint256))", {"publicKey": p.bytes, "operatorIds": p.array(p.uint64), "sharesData": p.bytes, "ssvAmount": p.uint256, "cluster": p.struct({"validatorCount": p.uint32, "networkFeeIndex": p.uint64, "index": p.uint64, "active": p.bool, "balance": p.uint256})}, ),
    removePToken: viewFun("0x9136616a", "removePToken(uint256)", {"_0": p.uint256}, ),
    removeSsvValidator: fun("0x71a735f3", "removeSsvValidator(bytes,uint64[],(uint32,uint64,uint64,bool,uint256))", {"publicKey": p.bytes, "operatorIds": p.array(p.uint64), "cluster": p.struct({"validatorCount": p.uint32, "networkFeeIndex": p.uint64, "index": p.uint64, "active": p.bool, "balance": p.uint256})}, ),
    resetFirstDeposit: fun("0x4c84e6f8", "resetFirstDeposit()", {}, ),
    rewardTokenAddresses: viewFun("0x7b2d9b2c", "rewardTokenAddresses(uint256)", {"_0": p.uint256}, p.address),
    safeApproveAllTokens: fun("0xad1728cb", "safeApproveAllTokens()", {}, ),
    setHarvesterAddress: fun("0xc2e1e3f4", "setHarvesterAddress(address)", {"_harvesterAddress": p.address}, ),
    setPTokenAddress: viewFun("0x0ed57b3a", "setPTokenAddress(address,address)", {"_0": p.address, "_1": p.address}, ),
    setRegistrator: fun("0x6e811d38", "setRegistrator(address)", {"_address": p.address}, ),
    setRewardTokenAddresses: fun("0x96d538bb", "setRewardTokenAddresses(address[])", {"_rewardTokenAddresses": p.array(p.address)}, ),
    snapBalances: fun("0x6874469d", "snapBalances()", {}, ),
    snappedBalance: viewFun("0x25e2e9f3", "snappedBalance()", {}, {"blockRoot": p.bytes32, "timestamp": p.uint64, "ethBalance": p.uint128}),
    stakeEth: fun("0x4583ef10", "stakeEth((bytes,bytes,bytes32),uint64)", {"validatorStakeData": p.struct({"pubkey": p.bytes, "signature": p.bytes, "depositDataRoot": p.bytes32}), "depositAmountGwei": p.uint64}, ),
    supportsAsset: viewFun("0xaa388af6", "supportsAsset(address)", {"_asset": p.address}, p.bool),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", "transferToken(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    unPause: fun("0xf7b188a5", "unPause()", {}, ),
    validator: viewFun("0x98245f1b", "validator(bytes32)", {"_0": p.bytes32}, {"state": p.uint8, "index": p.uint40}),
    validatorRegistrator: viewFun("0x87bae867", "validatorRegistrator()", {}, p.address),
    validatorWithdrawal: fun("0x522e4245", "validatorWithdrawal(bytes,uint64)", {"publicKey": p.bytes, "amountGwei": p.uint64}, ),
    vaultAddress: viewFun("0x430bf08a", "vaultAddress()", {}, p.address),
    verifiedValidators: viewFun("0x0ef99855", "verifiedValidators(uint256)", {"_0": p.uint256}, p.bytes32),
    verifiedValidatorsLength: viewFun("0xd79e4032", "verifiedValidatorsLength()", {}, p.uint256),
    verifyBalances: fun("0x1a1a1571", "verifyBalances((bytes32,bytes,bytes32[],bytes[]),(bytes32,bytes,uint32[],bytes[]))", {"balanceProofs": p.struct({"balancesContainerRoot": p.bytes32, "balancesContainerProof": p.bytes, "validatorBalanceLeaves": p.array(p.bytes32), "validatorBalanceProofs": p.array(p.bytes)}), "pendingDepositProofs": p.struct({"pendingDepositContainerRoot": p.bytes32, "pendingDepositContainerProof": p.bytes, "pendingDepositIndexes": p.array(p.uint32), "pendingDepositProofs": p.array(p.bytes)})}, ),
    verifyDeposit: fun("0x0d304174", "verifyDeposit(bytes32,uint64,(uint64,bytes),(uint64,bytes))", {"pendingDepositRoot": p.bytes32, "depositProcessedSlot": p.uint64, "firstPendingDeposit": p.struct({"slot": p.uint64, "proof": p.bytes}), "strategyValidatorData": p.struct({"withdrawableEpoch": p.uint64, "withdrawableEpochProof": p.bytes})}, ),
    verifyValidator: fun("0x6c341d1a", "verifyValidator(uint64,uint40,bytes32,bytes32,bytes)", {"nextBlockTimestamp": p.uint64, "validatorIndex": p.uint40, "pubKeyHash": p.bytes32, "withdrawalCredentials": p.bytes32, "validatorPubKeyProof": p.bytes}, ),
    withdraw: fun("0xd9caed12", "withdraw(address,address,uint256)", {"_recipient": p.address, "_asset": p.address, "_amount": p.uint256}, ),
    withdrawAll: fun("0x853828b6", "withdrawAll()", {}, ),
    withdrawSSV: fun("0xb6e2b520", "withdrawSSV(uint64[],uint256,(uint32,uint64,uint64,bool,uint256))", {"operatorIds": p.array(p.uint64), "ssvAmount": p.uint256, "cluster": p.struct({"validatorCount": p.uint32, "networkFeeIndex": p.uint64, "index": p.uint64, "active": p.bool, "balance": p.uint256})}, ),
}

export class Contract extends ContractBase {

    BEACON_PROOFS() {
        return this.eth_call(functions.BEACON_PROOFS, {})
    }

    SSV_TOKEN() {
        return this.eth_call(functions.SSV_TOKEN, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(functions.assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(functions.checkBalance, {_asset})
    }

    depositList(_0: DepositListParams["_0"]) {
        return this.eth_call(functions.depositList, {_0})
    }

    depositListLength() {
        return this.eth_call(functions.depositListLength, {})
    }

    depositedWethAccountedFor() {
        return this.eth_call(functions.depositedWethAccountedFor, {})
    }

    deposits(_0: DepositsParams["_0"]) {
        return this.eth_call(functions.deposits, {_0})
    }

    firstDeposit() {
        return this.eth_call(functions.firstDeposit, {})
    }

    getRewardTokenAddresses() {
        return this.eth_call(functions.getRewardTokenAddresses, {})
    }

    governor() {
        return this.eth_call(functions.governor, {})
    }

    harvesterAddress() {
        return this.eth_call(functions.harvesterAddress, {})
    }

    isGovernor() {
        return this.eth_call(functions.isGovernor, {})
    }

    lastVerifiedEthBalance() {
        return this.eth_call(functions.lastVerifiedEthBalance, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    platformAddress() {
        return this.eth_call(functions.platformAddress, {})
    }

    rewardTokenAddresses(_0: RewardTokenAddressesParams["_0"]) {
        return this.eth_call(functions.rewardTokenAddresses, {_0})
    }

    snappedBalance() {
        return this.eth_call(functions.snappedBalance, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(functions.supportsAsset, {_asset})
    }

    validator(_0: ValidatorParams["_0"]) {
        return this.eth_call(functions.validator, {_0})
    }

    validatorRegistrator() {
        return this.eth_call(functions.validatorRegistrator, {})
    }

    vaultAddress() {
        return this.eth_call(functions.vaultAddress, {})
    }

    verifiedValidators(_0: VerifiedValidatorsParams["_0"]) {
        return this.eth_call(functions.verifiedValidators, {_0})
    }

    verifiedValidatorsLength() {
        return this.eth_call(functions.verifiedValidatorsLength, {})
    }
}

/// Event types
export type BalancesSnappedEventArgs = EParams<typeof events.BalancesSnapped>
export type BalancesVerifiedEventArgs = EParams<typeof events.BalancesVerified>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type DepositVerifiedEventArgs = EParams<typeof events.DepositVerified>
export type ETHStakedEventArgs = EParams<typeof events.ETHStaked>
export type FirstDepositResetEventArgs = EParams<typeof events.FirstDepositReset>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type HarvesterAddressesUpdatedEventArgs = EParams<typeof events.HarvesterAddressesUpdated>
export type PTokenAddedEventArgs = EParams<typeof events.PTokenAdded>
export type PTokenRemovedEventArgs = EParams<typeof events.PTokenRemoved>
export type PausedEventArgs = EParams<typeof events.Paused>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RegistratorChangedEventArgs = EParams<typeof events.RegistratorChanged>
export type RewardTokenAddressesUpdatedEventArgs = EParams<typeof events.RewardTokenAddressesUpdated>
export type RewardTokenCollectedEventArgs = EParams<typeof events.RewardTokenCollected>
export type SSVValidatorRegisteredEventArgs = EParams<typeof events.SSVValidatorRegistered>
export type SSVValidatorRemovedEventArgs = EParams<typeof events.SSVValidatorRemoved>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type ValidatorInvalidEventArgs = EParams<typeof events.ValidatorInvalid>
export type ValidatorVerifiedEventArgs = EParams<typeof events.ValidatorVerified>
export type ValidatorWithdrawEventArgs = EParams<typeof events.ValidatorWithdraw>
export type WithdrawalEventArgs = EParams<typeof events.Withdrawal>

/// Function types
export type BEACON_PROOFSParams = FunctionArguments<typeof functions.BEACON_PROOFS>
export type BEACON_PROOFSReturn = FunctionReturn<typeof functions.BEACON_PROOFS>

export type SSV_TOKENParams = FunctionArguments<typeof functions.SSV_TOKEN>
export type SSV_TOKENReturn = FunctionReturn<typeof functions.SSV_TOKEN>

export type AssetToPTokenParams = FunctionArguments<typeof functions.assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof functions.assetToPToken>

export type CheckBalanceParams = FunctionArguments<typeof functions.checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof functions.checkBalance>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectRewardTokensParams = FunctionArguments<typeof functions.collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof functions.collectRewardTokens>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type DepositListParams = FunctionArguments<typeof functions.depositList>
export type DepositListReturn = FunctionReturn<typeof functions.depositList>

export type DepositListLengthParams = FunctionArguments<typeof functions.depositListLength>
export type DepositListLengthReturn = FunctionReturn<typeof functions.depositListLength>

export type DepositedWethAccountedForParams = FunctionArguments<typeof functions.depositedWethAccountedFor>
export type DepositedWethAccountedForReturn = FunctionReturn<typeof functions.depositedWethAccountedFor>

export type DepositsParams = FunctionArguments<typeof functions.deposits>
export type DepositsReturn = FunctionReturn<typeof functions.deposits>

export type FirstDepositParams = FunctionArguments<typeof functions.firstDeposit>
export type FirstDepositReturn = FunctionReturn<typeof functions.firstDeposit>

export type GetRewardTokenAddressesParams = FunctionArguments<typeof functions.getRewardTokenAddresses>
export type GetRewardTokenAddressesReturn = FunctionReturn<typeof functions.getRewardTokenAddresses>

export type GovernorParams = FunctionArguments<typeof functions.governor>
export type GovernorReturn = FunctionReturn<typeof functions.governor>

export type HarvesterAddressParams = FunctionArguments<typeof functions.harvesterAddress>
export type HarvesterAddressReturn = FunctionReturn<typeof functions.harvesterAddress>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsGovernorParams = FunctionArguments<typeof functions.isGovernor>
export type IsGovernorReturn = FunctionReturn<typeof functions.isGovernor>

export type LastVerifiedEthBalanceParams = FunctionArguments<typeof functions.lastVerifiedEthBalance>
export type LastVerifiedEthBalanceReturn = FunctionReturn<typeof functions.lastVerifiedEthBalance>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PlatformAddressParams = FunctionArguments<typeof functions.platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof functions.platformAddress>

export type RegisterSsvValidatorParams = FunctionArguments<typeof functions.registerSsvValidator>
export type RegisterSsvValidatorReturn = FunctionReturn<typeof functions.registerSsvValidator>

export type RemovePTokenParams = FunctionArguments<typeof functions.removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof functions.removePToken>

export type RemoveSsvValidatorParams = FunctionArguments<typeof functions.removeSsvValidator>
export type RemoveSsvValidatorReturn = FunctionReturn<typeof functions.removeSsvValidator>

export type ResetFirstDepositParams = FunctionArguments<typeof functions.resetFirstDeposit>
export type ResetFirstDepositReturn = FunctionReturn<typeof functions.resetFirstDeposit>

export type RewardTokenAddressesParams = FunctionArguments<typeof functions.rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof functions.rewardTokenAddresses>

export type SafeApproveAllTokensParams = FunctionArguments<typeof functions.safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof functions.safeApproveAllTokens>

export type SetHarvesterAddressParams = FunctionArguments<typeof functions.setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof functions.setHarvesterAddress>

export type SetPTokenAddressParams = FunctionArguments<typeof functions.setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof functions.setPTokenAddress>

export type SetRegistratorParams = FunctionArguments<typeof functions.setRegistrator>
export type SetRegistratorReturn = FunctionReturn<typeof functions.setRegistrator>

export type SetRewardTokenAddressesParams = FunctionArguments<typeof functions.setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof functions.setRewardTokenAddresses>

export type SnapBalancesParams = FunctionArguments<typeof functions.snapBalances>
export type SnapBalancesReturn = FunctionReturn<typeof functions.snapBalances>

export type SnappedBalanceParams = FunctionArguments<typeof functions.snappedBalance>
export type SnappedBalanceReturn = FunctionReturn<typeof functions.snappedBalance>

export type StakeEthParams = FunctionArguments<typeof functions.stakeEth>
export type StakeEthReturn = FunctionReturn<typeof functions.stakeEth>

export type SupportsAssetParams = FunctionArguments<typeof functions.supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof functions.supportsAsset>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

export type UnPauseParams = FunctionArguments<typeof functions.unPause>
export type UnPauseReturn = FunctionReturn<typeof functions.unPause>

export type ValidatorParams = FunctionArguments<typeof functions.validator>
export type ValidatorReturn = FunctionReturn<typeof functions.validator>

export type ValidatorRegistratorParams = FunctionArguments<typeof functions.validatorRegistrator>
export type ValidatorRegistratorReturn = FunctionReturn<typeof functions.validatorRegistrator>

export type ValidatorWithdrawalParams = FunctionArguments<typeof functions.validatorWithdrawal>
export type ValidatorWithdrawalReturn = FunctionReturn<typeof functions.validatorWithdrawal>

export type VaultAddressParams = FunctionArguments<typeof functions.vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof functions.vaultAddress>

export type VerifiedValidatorsParams = FunctionArguments<typeof functions.verifiedValidators>
export type VerifiedValidatorsReturn = FunctionReturn<typeof functions.verifiedValidators>

export type VerifiedValidatorsLengthParams = FunctionArguments<typeof functions.verifiedValidatorsLength>
export type VerifiedValidatorsLengthReturn = FunctionReturn<typeof functions.verifiedValidatorsLength>

export type VerifyBalancesParams = FunctionArguments<typeof functions.verifyBalances>
export type VerifyBalancesReturn = FunctionReturn<typeof functions.verifyBalances>

export type VerifyDepositParams = FunctionArguments<typeof functions.verifyDeposit>
export type VerifyDepositReturn = FunctionReturn<typeof functions.verifyDeposit>

export type VerifyValidatorParams = FunctionArguments<typeof functions.verifyValidator>
export type VerifyValidatorReturn = FunctionReturn<typeof functions.verifyValidator>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

export type WithdrawSSVParams = FunctionArguments<typeof functions.withdrawSSV>
export type WithdrawSSVReturn = FunctionReturn<typeof functions.withdrawSSV>

