import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccountingConsensusRewards: event("0x7a745a2c63a535068f52ceca27debd5297bbad5f7f37ec53d044a59d0362445d", "AccountingConsensusRewards(uint256)", {"amount": p.uint256}),
    AccountingFullyWithdrawnValidator: event("0xbe7040030ff7b347853214bf49820c6d455fedf58f3815f85c7bc5216993682b", "AccountingFullyWithdrawnValidator(uint256,uint256,uint256)", {"noOfValidators": p.uint256, "remainingValidators": p.uint256, "wethSentToVault": p.uint256}),
    AccountingManuallyFixed: event("0x80d022717ea022455c5886b8dd8a29c037570aae58aeb4d7b136d7a10ec2e431", "AccountingManuallyFixed(int256,int256,uint256)", {"validatorsDelta": p.int256, "consensusRewardsDelta": p.int256, "wethToVault": p.uint256}),
    AccountingValidatorSlashed: event("0x6aa7e30787b26429ced603a7aba8b19c4b5d5bcf29a3257da953c8d53bcaa3a6", "AccountingValidatorSlashed(uint256,uint256)", {"remainingValidators": p.uint256, "wethSentToVault": p.uint256}),
    Deposit: event("0x5548c837ab068cf56a2c2479df0882a4922fd203edb7517321831d95078c5f62", "Deposit(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
    ETHStaked: event("0x958934bb53d6b4dc911b6173e586864efbc8076684a31f752c53d5778340b37f", "ETHStaked(bytes32,bytes,uint256)", {"pubKeyHash": indexed(p.bytes32), "pubKey": p.bytes, "amount": p.uint256}),
    FuseIntervalUpdated: event("0xcb8d24e46eb3c402bf344ee60a6576cba9ef2f59ea1af3b311520704924e901a", "FuseIntervalUpdated(uint256,uint256)", {"start": p.uint256, "end": p.uint256}),
    GovernorshipTransferred: event("0xc7c0c772add429241571afb3805861fb3cfa2af374534088b76cdb4325a87e9a", "GovernorshipTransferred(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    HarvesterAddressesUpdated: event("0xe48386b84419f4d36e0f96c10cc3510b6fb1a33795620c5098b22472bbe90796", "HarvesterAddressesUpdated(address,address)", {"_oldHarvesterAddress": p.address, "_newHarvesterAddress": p.address}),
    PTokenAdded: event("0xef6485b84315f9b1483beffa32aae9a0596890395e3d7521f1c5fbb51790e765", "PTokenAdded(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    PTokenRemoved: event("0x16b7600acff27e39a8a96056b3d533045298de927507f5c1d97e4accde60488c", "PTokenRemoved(address,address)", {"_asset": indexed(p.address), "_pToken": p.address}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    PendingGovernorshipTransfer: event("0xa39cc5eb22d0f34d8beaefee8a3f17cc229c1a1d1ef87a5ad47313487b1c4f0d", "PendingGovernorshipTransfer(address,address)", {"previousGovernor": indexed(p.address), "newGovernor": indexed(p.address)}),
    RegistratorChanged: event("0x83f29c79feb71f8fba9d0fbc4ba5f0982a28b6b1e868b3fc50e6400d100bca0f", "RegistratorChanged(address)", {"newAddress": indexed(p.address)}),
    RewardTokenAddressesUpdated: event("0x04c0b9649497d316554306e53678d5f5f5dbc3a06f97dec13ff4cfe98b986bbc", "RewardTokenAddressesUpdated(address[],address[])", {"_oldAddresses": p.array(p.address), "_newAddresses": p.array(p.address)}),
    RewardTokenCollected: event("0xf6c07a063ed4e63808eb8da7112d46dbcd38de2b40a73dbcc9353c5a94c72353", "RewardTokenCollected(address,address,uint256)", {"recipient": p.address, "rewardToken": p.address, "amount": p.uint256}),
    SSVValidatorExitCompleted: event("0x6aecca20726a17c1b81989b2fd09dfdf636bae9e564d4066ca18df62dc1f3dc2", "SSVValidatorExitCompleted(bytes32,bytes,uint64[])", {"pubKeyHash": indexed(p.bytes32), "pubKey": p.bytes, "operatorIds": p.array(p.uint64)}),
    SSVValidatorExitInitiated: event("0x8c2e15303eb94e531acc988c2a01d1193bdaaa15eda7f16dda85316ed463578d", "SSVValidatorExitInitiated(bytes32,bytes,uint64[])", {"pubKeyHash": indexed(p.bytes32), "pubKey": p.bytes, "operatorIds": p.array(p.uint64)}),
    SSVValidatorRegistered: event("0xacd38e900350661e325d592c959664c0000a306efb2004e7dc283f44e0ea0423", "SSVValidatorRegistered(bytes32,bytes,uint64[])", {"pubKeyHash": indexed(p.bytes32), "pubKey": p.bytes, "operatorIds": p.array(p.uint64)}),
    StakeETHTallyReset: event("0xe765a88a37047c5d793dce22b9ceb5a0f5039d276da139b4c7d29613f341f110", "StakeETHTallyReset()", {}),
    StakeETHThresholdChanged: event("0xe26b067424903962f951f568e52ec9a3bbe1589526ea54a4e69ca6eaae1a4c77", "StakeETHThresholdChanged(uint256)", {"amount": p.uint256}),
    StakingMonitorChanged: event("0x3329861a0008b3348767567d2405492b997abd79a088d0f2cef6b1a09a8e7ff7", "StakingMonitorChanged(address)", {"newAddress": indexed(p.address)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    Withdrawal: event("0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "Withdrawal(address,address,uint256)", {"_asset": indexed(p.address), "_pToken": p.address, "_amount": p.uint256}),
}

export const functions = {
    BEACON_CHAIN_DEPOSIT_CONTRACT: viewFun("0xcceab750", "BEACON_CHAIN_DEPOSIT_CONTRACT()", {}, p.address),
    FEE_ACCUMULATOR_ADDRESS: viewFun("0xdd505df6", "FEE_ACCUMULATOR_ADDRESS()", {}, p.address),
    FULL_STAKE: viewFun("0xb16b7d0b", "FULL_STAKE()", {}, p.uint256),
    MAX_VALIDATORS: viewFun("0x714897df", "MAX_VALIDATORS()", {}, p.uint256),
    MIN_FIX_ACCOUNTING_CADENCE: viewFun("0x63092383", "MIN_FIX_ACCOUNTING_CADENCE()", {}, p.uint256),
    SSV_NETWORK: viewFun("0x91649751", "SSV_NETWORK()", {}, p.address),
    SSV_TOKEN: viewFun("0x0df1ecfd", "SSV_TOKEN()", {}, p.address),
    VAULT_ADDRESS: viewFun("0x9092c31c", "VAULT_ADDRESS()", {}, p.address),
    WETH: viewFun("0xad5c4648", "WETH()", {}, p.address),
    activeDepositedValidators: viewFun("0x66e3667e", "activeDepositedValidators()", {}, p.uint256),
    assetToPToken: viewFun("0x0fc3b4c4", "assetToPToken(address)", {"_0": p.address}, p.address),
    checkBalance: viewFun("0x5f515226", "checkBalance(address)", {"_asset": p.address}, p.uint256),
    claimGovernance: fun("0x5d36b190", "claimGovernance()", {}, ),
    collectRewardTokens: fun("0x5a063f63", "collectRewardTokens()", {}, ),
    consensusRewards: viewFun("0x842f5c46", "consensusRewards()", {}, p.uint256),
    deposit: fun("0x47e7ef24", "deposit(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    depositAll: fun("0xde5f6268", "depositAll()", {}, ),
    depositSSV: fun("0x22495dc8", "depositSSV(uint64[],uint256,(uint32,uint64,uint64,bool,uint256))", {"operatorIds": p.array(p.uint64), "ssvAmount": p.uint256, "cluster": p.struct({"validatorCount": p.uint32, "networkFeeIndex": p.uint64, "index": p.uint64, "active": p.bool, "balance": p.uint256})}, ),
    depositedWethAccountedFor: viewFun("0xd059f6ef", "depositedWethAccountedFor()", {}, p.uint256),
    doAccounting: fun("0xa4f98af4", "doAccounting()", {}, p.bool),
    exitSsvValidator: fun("0xd9f00ec7", "exitSsvValidator(bytes,uint64[])", {"publicKey": p.bytes, "operatorIds": p.array(p.uint64)}, ),
    fuseIntervalEnd: viewFun("0x484be812", "fuseIntervalEnd()", {}, p.uint256),
    fuseIntervalStart: viewFun("0x3c864959", "fuseIntervalStart()", {}, p.uint256),
    getRewardTokenAddresses: viewFun("0xf6ca71b0", "getRewardTokenAddresses()", {}, p.array(p.address)),
    governor: viewFun("0x0c340a24", "governor()", {}, p.address),
    harvesterAddress: viewFun("0x67c7066c", "harvesterAddress()", {}, p.address),
    initialize: fun("0x435356d1", "initialize(address[],address[],address[])", {"_rewardTokenAddresses": p.array(p.address), "_assets": p.array(p.address), "_pTokens": p.array(p.address)}, ),
    isGovernor: viewFun("0xc7af3352", "isGovernor()", {}, p.bool),
    lastFixAccountingBlockNumber: viewFun("0xe7529239", "lastFixAccountingBlockNumber()", {}, p.uint256),
    manuallyFixAccounting: fun("0x8d7c0e46", "manuallyFixAccounting(int256,int256,uint256)", {"_validatorsDelta": p.int256, "_consensusRewardsDelta": p.int256, "_ethToVaultAmount": p.uint256}, ),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    platformAddress: viewFun("0xdbe55e56", "platformAddress()", {}, p.address),
    registerSsvValidators: fun("0x59b80c0a", "registerSsvValidators(bytes[],uint64[],bytes[],uint256,(uint32,uint64,uint64,bool,uint256))", {"publicKeys": p.array(p.bytes), "operatorIds": p.array(p.uint64), "sharesData": p.array(p.bytes), "ssvAmount": p.uint256, "cluster": p.struct({"validatorCount": p.uint32, "networkFeeIndex": p.uint64, "index": p.uint64, "active": p.bool, "balance": p.uint256})}, ),
    removePToken: fun("0x9136616a", "removePToken(uint256)", {"_assetIndex": p.uint256}, ),
    removeSsvValidator: fun("0x71a735f3", "removeSsvValidator(bytes,uint64[],(uint32,uint64,uint64,bool,uint256))", {"publicKey": p.bytes, "operatorIds": p.array(p.uint64), "cluster": p.struct({"validatorCount": p.uint32, "networkFeeIndex": p.uint64, "index": p.uint64, "active": p.bool, "balance": p.uint256})}, ),
    resetStakeETHTally: fun("0xee7afe2d", "resetStakeETHTally()", {}, ),
    rewardTokenAddresses: viewFun("0x7b2d9b2c", "rewardTokenAddresses(uint256)", {"_0": p.uint256}, p.address),
    safeApproveAllTokens: fun("0xad1728cb", "safeApproveAllTokens()", {}, ),
    setFuseInterval: fun("0xab12edf5", "setFuseInterval(uint256,uint256)", {"_fuseIntervalStart": p.uint256, "_fuseIntervalEnd": p.uint256}, ),
    setHarvesterAddress: fun("0xc2e1e3f4", "setHarvesterAddress(address)", {"_harvesterAddress": p.address}, ),
    setPTokenAddress: fun("0x0ed57b3a", "setPTokenAddress(address,address)", {"_asset": p.address, "_pToken": p.address}, ),
    setRegistrator: fun("0x6e811d38", "setRegistrator(address)", {"_address": p.address}, ),
    setRewardTokenAddresses: fun("0x96d538bb", "setRewardTokenAddresses(address[])", {"_rewardTokenAddresses": p.array(p.address)}, ),
    setStakeETHThreshold: fun("0x5205c380", "setStakeETHThreshold(uint256)", {"_amount": p.uint256}, ),
    setStakingMonitor: fun("0xa3b81e73", "setStakingMonitor(address)", {"_address": p.address}, ),
    stakeETHTally: viewFun("0xde34d713", "stakeETHTally()", {}, p.uint256),
    stakeETHThreshold: viewFun("0x7b8962f7", "stakeETHThreshold()", {}, p.uint256),
    stakeEth: fun("0x6ef38795", "stakeEth((bytes,bytes,bytes32)[])", {"validators": p.array(p.struct({"pubkey": p.bytes, "signature": p.bytes, "depositDataRoot": p.bytes32}))}, ),
    stakingMonitor: viewFun("0x7260f826", "stakingMonitor()", {}, p.address),
    supportsAsset: viewFun("0xaa388af6", "supportsAsset(address)", {"_asset": p.address}, p.bool),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"_newGovernor": p.address}, ),
    transferToken: fun("0x1072cbea", "transferToken(address,uint256)", {"_asset": p.address, "_amount": p.uint256}, ),
    validatorRegistrator: viewFun("0x87bae867", "validatorRegistrator()", {}, p.address),
    validatorsStates: viewFun("0x9da0e462", "validatorsStates(bytes32)", {"_0": p.bytes32}, p.uint8),
    vaultAddress: viewFun("0x430bf08a", "vaultAddress()", {}, p.address),
    withdraw: fun("0xd9caed12", "withdraw(address,address,uint256)", {"_recipient": p.address, "_asset": p.address, "_amount": p.uint256}, ),
    withdrawAll: fun("0x853828b6", "withdrawAll()", {}, ),
}

export class Contract extends ContractBase {

    BEACON_CHAIN_DEPOSIT_CONTRACT() {
        return this.eth_call(functions.BEACON_CHAIN_DEPOSIT_CONTRACT, {})
    }

    FEE_ACCUMULATOR_ADDRESS() {
        return this.eth_call(functions.FEE_ACCUMULATOR_ADDRESS, {})
    }

    FULL_STAKE() {
        return this.eth_call(functions.FULL_STAKE, {})
    }

    MAX_VALIDATORS() {
        return this.eth_call(functions.MAX_VALIDATORS, {})
    }

    MIN_FIX_ACCOUNTING_CADENCE() {
        return this.eth_call(functions.MIN_FIX_ACCOUNTING_CADENCE, {})
    }

    SSV_NETWORK() {
        return this.eth_call(functions.SSV_NETWORK, {})
    }

    SSV_TOKEN() {
        return this.eth_call(functions.SSV_TOKEN, {})
    }

    VAULT_ADDRESS() {
        return this.eth_call(functions.VAULT_ADDRESS, {})
    }

    WETH() {
        return this.eth_call(functions.WETH, {})
    }

    activeDepositedValidators() {
        return this.eth_call(functions.activeDepositedValidators, {})
    }

    assetToPToken(_0: AssetToPTokenParams["_0"]) {
        return this.eth_call(functions.assetToPToken, {_0})
    }

    checkBalance(_asset: CheckBalanceParams["_asset"]) {
        return this.eth_call(functions.checkBalance, {_asset})
    }

    consensusRewards() {
        return this.eth_call(functions.consensusRewards, {})
    }

    depositedWethAccountedFor() {
        return this.eth_call(functions.depositedWethAccountedFor, {})
    }

    fuseIntervalEnd() {
        return this.eth_call(functions.fuseIntervalEnd, {})
    }

    fuseIntervalStart() {
        return this.eth_call(functions.fuseIntervalStart, {})
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

    lastFixAccountingBlockNumber() {
        return this.eth_call(functions.lastFixAccountingBlockNumber, {})
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

    stakeETHTally() {
        return this.eth_call(functions.stakeETHTally, {})
    }

    stakeETHThreshold() {
        return this.eth_call(functions.stakeETHThreshold, {})
    }

    stakingMonitor() {
        return this.eth_call(functions.stakingMonitor, {})
    }

    supportsAsset(_asset: SupportsAssetParams["_asset"]) {
        return this.eth_call(functions.supportsAsset, {_asset})
    }

    validatorRegistrator() {
        return this.eth_call(functions.validatorRegistrator, {})
    }

    validatorsStates(_0: ValidatorsStatesParams["_0"]) {
        return this.eth_call(functions.validatorsStates, {_0})
    }

    vaultAddress() {
        return this.eth_call(functions.vaultAddress, {})
    }
}

/// Event types
export type AccountingConsensusRewardsEventArgs = EParams<typeof events.AccountingConsensusRewards>
export type AccountingFullyWithdrawnValidatorEventArgs = EParams<typeof events.AccountingFullyWithdrawnValidator>
export type AccountingManuallyFixedEventArgs = EParams<typeof events.AccountingManuallyFixed>
export type AccountingValidatorSlashedEventArgs = EParams<typeof events.AccountingValidatorSlashed>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type ETHStakedEventArgs = EParams<typeof events.ETHStaked>
export type FuseIntervalUpdatedEventArgs = EParams<typeof events.FuseIntervalUpdated>
export type GovernorshipTransferredEventArgs = EParams<typeof events.GovernorshipTransferred>
export type HarvesterAddressesUpdatedEventArgs = EParams<typeof events.HarvesterAddressesUpdated>
export type PTokenAddedEventArgs = EParams<typeof events.PTokenAdded>
export type PTokenRemovedEventArgs = EParams<typeof events.PTokenRemoved>
export type PausedEventArgs = EParams<typeof events.Paused>
export type PendingGovernorshipTransferEventArgs = EParams<typeof events.PendingGovernorshipTransfer>
export type RegistratorChangedEventArgs = EParams<typeof events.RegistratorChanged>
export type RewardTokenAddressesUpdatedEventArgs = EParams<typeof events.RewardTokenAddressesUpdated>
export type RewardTokenCollectedEventArgs = EParams<typeof events.RewardTokenCollected>
export type SSVValidatorExitCompletedEventArgs = EParams<typeof events.SSVValidatorExitCompleted>
export type SSVValidatorExitInitiatedEventArgs = EParams<typeof events.SSVValidatorExitInitiated>
export type SSVValidatorRegisteredEventArgs = EParams<typeof events.SSVValidatorRegistered>
export type StakeETHTallyResetEventArgs = EParams<typeof events.StakeETHTallyReset>
export type StakeETHThresholdChangedEventArgs = EParams<typeof events.StakeETHThresholdChanged>
export type StakingMonitorChangedEventArgs = EParams<typeof events.StakingMonitorChanged>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WithdrawalEventArgs = EParams<typeof events.Withdrawal>

/// Function types
export type BEACON_CHAIN_DEPOSIT_CONTRACTParams = FunctionArguments<typeof functions.BEACON_CHAIN_DEPOSIT_CONTRACT>
export type BEACON_CHAIN_DEPOSIT_CONTRACTReturn = FunctionReturn<typeof functions.BEACON_CHAIN_DEPOSIT_CONTRACT>

export type FEE_ACCUMULATOR_ADDRESSParams = FunctionArguments<typeof functions.FEE_ACCUMULATOR_ADDRESS>
export type FEE_ACCUMULATOR_ADDRESSReturn = FunctionReturn<typeof functions.FEE_ACCUMULATOR_ADDRESS>

export type FULL_STAKEParams = FunctionArguments<typeof functions.FULL_STAKE>
export type FULL_STAKEReturn = FunctionReturn<typeof functions.FULL_STAKE>

export type MAX_VALIDATORSParams = FunctionArguments<typeof functions.MAX_VALIDATORS>
export type MAX_VALIDATORSReturn = FunctionReturn<typeof functions.MAX_VALIDATORS>

export type MIN_FIX_ACCOUNTING_CADENCEParams = FunctionArguments<typeof functions.MIN_FIX_ACCOUNTING_CADENCE>
export type MIN_FIX_ACCOUNTING_CADENCEReturn = FunctionReturn<typeof functions.MIN_FIX_ACCOUNTING_CADENCE>

export type SSV_NETWORKParams = FunctionArguments<typeof functions.SSV_NETWORK>
export type SSV_NETWORKReturn = FunctionReturn<typeof functions.SSV_NETWORK>

export type SSV_TOKENParams = FunctionArguments<typeof functions.SSV_TOKEN>
export type SSV_TOKENReturn = FunctionReturn<typeof functions.SSV_TOKEN>

export type VAULT_ADDRESSParams = FunctionArguments<typeof functions.VAULT_ADDRESS>
export type VAULT_ADDRESSReturn = FunctionReturn<typeof functions.VAULT_ADDRESS>

export type WETHParams = FunctionArguments<typeof functions.WETH>
export type WETHReturn = FunctionReturn<typeof functions.WETH>

export type ActiveDepositedValidatorsParams = FunctionArguments<typeof functions.activeDepositedValidators>
export type ActiveDepositedValidatorsReturn = FunctionReturn<typeof functions.activeDepositedValidators>

export type AssetToPTokenParams = FunctionArguments<typeof functions.assetToPToken>
export type AssetToPTokenReturn = FunctionReturn<typeof functions.assetToPToken>

export type CheckBalanceParams = FunctionArguments<typeof functions.checkBalance>
export type CheckBalanceReturn = FunctionReturn<typeof functions.checkBalance>

export type ClaimGovernanceParams = FunctionArguments<typeof functions.claimGovernance>
export type ClaimGovernanceReturn = FunctionReturn<typeof functions.claimGovernance>

export type CollectRewardTokensParams = FunctionArguments<typeof functions.collectRewardTokens>
export type CollectRewardTokensReturn = FunctionReturn<typeof functions.collectRewardTokens>

export type ConsensusRewardsParams = FunctionArguments<typeof functions.consensusRewards>
export type ConsensusRewardsReturn = FunctionReturn<typeof functions.consensusRewards>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type DepositSSVParams = FunctionArguments<typeof functions.depositSSV>
export type DepositSSVReturn = FunctionReturn<typeof functions.depositSSV>

export type DepositedWethAccountedForParams = FunctionArguments<typeof functions.depositedWethAccountedFor>
export type DepositedWethAccountedForReturn = FunctionReturn<typeof functions.depositedWethAccountedFor>

export type DoAccountingParams = FunctionArguments<typeof functions.doAccounting>
export type DoAccountingReturn = FunctionReturn<typeof functions.doAccounting>

export type ExitSsvValidatorParams = FunctionArguments<typeof functions.exitSsvValidator>
export type ExitSsvValidatorReturn = FunctionReturn<typeof functions.exitSsvValidator>

export type FuseIntervalEndParams = FunctionArguments<typeof functions.fuseIntervalEnd>
export type FuseIntervalEndReturn = FunctionReturn<typeof functions.fuseIntervalEnd>

export type FuseIntervalStartParams = FunctionArguments<typeof functions.fuseIntervalStart>
export type FuseIntervalStartReturn = FunctionReturn<typeof functions.fuseIntervalStart>

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

export type LastFixAccountingBlockNumberParams = FunctionArguments<typeof functions.lastFixAccountingBlockNumber>
export type LastFixAccountingBlockNumberReturn = FunctionReturn<typeof functions.lastFixAccountingBlockNumber>

export type ManuallyFixAccountingParams = FunctionArguments<typeof functions.manuallyFixAccounting>
export type ManuallyFixAccountingReturn = FunctionReturn<typeof functions.manuallyFixAccounting>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PlatformAddressParams = FunctionArguments<typeof functions.platformAddress>
export type PlatformAddressReturn = FunctionReturn<typeof functions.platformAddress>

export type RegisterSsvValidatorsParams = FunctionArguments<typeof functions.registerSsvValidators>
export type RegisterSsvValidatorsReturn = FunctionReturn<typeof functions.registerSsvValidators>

export type RemovePTokenParams = FunctionArguments<typeof functions.removePToken>
export type RemovePTokenReturn = FunctionReturn<typeof functions.removePToken>

export type RemoveSsvValidatorParams = FunctionArguments<typeof functions.removeSsvValidator>
export type RemoveSsvValidatorReturn = FunctionReturn<typeof functions.removeSsvValidator>

export type ResetStakeETHTallyParams = FunctionArguments<typeof functions.resetStakeETHTally>
export type ResetStakeETHTallyReturn = FunctionReturn<typeof functions.resetStakeETHTally>

export type RewardTokenAddressesParams = FunctionArguments<typeof functions.rewardTokenAddresses>
export type RewardTokenAddressesReturn = FunctionReturn<typeof functions.rewardTokenAddresses>

export type SafeApproveAllTokensParams = FunctionArguments<typeof functions.safeApproveAllTokens>
export type SafeApproveAllTokensReturn = FunctionReturn<typeof functions.safeApproveAllTokens>

export type SetFuseIntervalParams = FunctionArguments<typeof functions.setFuseInterval>
export type SetFuseIntervalReturn = FunctionReturn<typeof functions.setFuseInterval>

export type SetHarvesterAddressParams = FunctionArguments<typeof functions.setHarvesterAddress>
export type SetHarvesterAddressReturn = FunctionReturn<typeof functions.setHarvesterAddress>

export type SetPTokenAddressParams = FunctionArguments<typeof functions.setPTokenAddress>
export type SetPTokenAddressReturn = FunctionReturn<typeof functions.setPTokenAddress>

export type SetRegistratorParams = FunctionArguments<typeof functions.setRegistrator>
export type SetRegistratorReturn = FunctionReturn<typeof functions.setRegistrator>

export type SetRewardTokenAddressesParams = FunctionArguments<typeof functions.setRewardTokenAddresses>
export type SetRewardTokenAddressesReturn = FunctionReturn<typeof functions.setRewardTokenAddresses>

export type SetStakeETHThresholdParams = FunctionArguments<typeof functions.setStakeETHThreshold>
export type SetStakeETHThresholdReturn = FunctionReturn<typeof functions.setStakeETHThreshold>

export type SetStakingMonitorParams = FunctionArguments<typeof functions.setStakingMonitor>
export type SetStakingMonitorReturn = FunctionReturn<typeof functions.setStakingMonitor>

export type StakeETHTallyParams = FunctionArguments<typeof functions.stakeETHTally>
export type StakeETHTallyReturn = FunctionReturn<typeof functions.stakeETHTally>

export type StakeETHThresholdParams = FunctionArguments<typeof functions.stakeETHThreshold>
export type StakeETHThresholdReturn = FunctionReturn<typeof functions.stakeETHThreshold>

export type StakeEthParams = FunctionArguments<typeof functions.stakeEth>
export type StakeEthReturn = FunctionReturn<typeof functions.stakeEth>

export type StakingMonitorParams = FunctionArguments<typeof functions.stakingMonitor>
export type StakingMonitorReturn = FunctionReturn<typeof functions.stakingMonitor>

export type SupportsAssetParams = FunctionArguments<typeof functions.supportsAsset>
export type SupportsAssetReturn = FunctionReturn<typeof functions.supportsAsset>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type TransferTokenParams = FunctionArguments<typeof functions.transferToken>
export type TransferTokenReturn = FunctionReturn<typeof functions.transferToken>

export type ValidatorRegistratorParams = FunctionArguments<typeof functions.validatorRegistrator>
export type ValidatorRegistratorReturn = FunctionReturn<typeof functions.validatorRegistrator>

export type ValidatorsStatesParams = FunctionArguments<typeof functions.validatorsStates>
export type ValidatorsStatesReturn = FunctionReturn<typeof functions.validatorsStates>

export type VaultAddressParams = FunctionArguments<typeof functions.vaultAddress>
export type VaultAddressReturn = FunctionReturn<typeof functions.vaultAddress>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

