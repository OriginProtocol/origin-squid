import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    StakingPaused: event("0x26d1807b479eaba249c1214b82e4b65bbb0cc73ee8a17901324b1ef1b5904e49", "StakingPaused()", {}),
    StakingResumed: event("0xedaeeae9aed70c4545d3ab0065713261c9cee8d6cf5c8b07f52f0a65fd91efda", "StakingResumed()", {}),
    StakingLimitSet: event("0xce9fddf6179affa1ea7bf36d80a6bf0284e0f3b91f4b2fa6eea2af923e7fac2d", "StakingLimitSet(uint256,uint256)", {"maxStakeLimit": p.uint256, "stakeLimitIncreasePerBlock": p.uint256}),
    StakingLimitRemoved: event("0x9b2a687c198898fcc32a33bbc610d478f177a73ab7352023e6cc1de5bf12a3df", "StakingLimitRemoved()", {}),
    CLValidatorsUpdated: event("0x1252331d4f3ee8a9f0a3484c4c2fb059c70a047b5dc5482a3ee6415f742d9f2e", "CLValidatorsUpdated(uint256,uint256,uint256)", {"reportTimestamp": indexed(p.uint256), "preCLValidators": p.uint256, "postCLValidators": p.uint256}),
    DepositedValidatorsChanged: event("0xe0aacfc334457703148118055ec794ac17654c6f918d29638ba3b18003cee5ff", "DepositedValidatorsChanged(uint256)", {"depositedValidators": p.uint256}),
    ETHDistributed: event("0x92dd3cb149a1eebd51fd8c2a3653fd96f30c4ac01d4f850fc16d46abd6c3e92f", "ETHDistributed(uint256,uint256,uint256,uint256,uint256,uint256)", {"reportTimestamp": indexed(p.uint256), "preCLBalance": p.uint256, "postCLBalance": p.uint256, "withdrawalsWithdrawn": p.uint256, "executionLayerRewardsWithdrawn": p.uint256, "postBufferedEther": p.uint256}),
    TokenRebased: event("0xff08c3ef606d198e316ef5b822193c489965899eb4e3c248cea1a4626c3eda50", "TokenRebased(uint256,uint256,uint256,uint256,uint256,uint256,uint256)", {"reportTimestamp": indexed(p.uint256), "timeElapsed": p.uint256, "preTotalShares": p.uint256, "preTotalEther": p.uint256, "postTotalShares": p.uint256, "postTotalEther": p.uint256, "sharesMintedAsFees": p.uint256}),
    LidoLocatorSet: event("0x61f9416d3c29deb4e424342445a2b132738430becd9fa275e11297c90668b22e", "LidoLocatorSet(address)", {"lidoLocator": p.address}),
    ELRewardsReceived: event("0xd27f9b0c98bdee27044afa149eadcd2047d6399cb6613a45c5b87e6aca76e6b5", "ELRewardsReceived(uint256)", {"amount": p.uint256}),
    WithdrawalsReceived: event("0x6e5086f7e1ab04bd826e77faae35b1bcfe31bd144623361a40ea4af51670b1c3", "WithdrawalsReceived(uint256)", {"amount": p.uint256}),
    Submitted: event("0x96a25c8ce0baabc1fdefd93e9ed25d8e092a3332f3aa9a41722b5697231d1d1a", "Submitted(address,uint256,address)", {"sender": indexed(p.address), "amount": p.uint256, "referral": p.address}),
    Unbuffered: event("0x76a397bea5768d4fca97ef47792796e35f98dc81b16c1de84e28a818e1f97108", "Unbuffered(uint256)", {"amount": p.uint256}),
    ScriptResult: event("0x5229a5dba83a54ae8cb5b51bdd6de9474cacbe9dd332f5185f3a4f4f2e3f4ad9", "ScriptResult(address,bytes,bytes,bytes)", {"executor": indexed(p.address), "script": p.bytes, "input": p.bytes, "returnData": p.bytes}),
    RecoverToVault: event("0x596caf56044b55fb8c4ca640089bbc2b63cae3e978b851f5745cbb7c5b288e02", "RecoverToVault(address,address,uint256)", {"vault": indexed(p.address), "token": indexed(p.address), "amount": p.uint256}),
    EIP712StETHInitialized: event("0xb80a5409082a3729c9fc139f8b41192c40e85252752df2c07caebd613086ca83", "EIP712StETHInitialized(address)", {"eip712StETH": p.address}),
    TransferShares: event("0x9d9c909296d9c674451c0c24f02cb64981eb3b727f99865939192f880a755dcb", "TransferShares(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "sharesValue": p.uint256}),
    SharesBurnt: event("0x8b2a1e1ad5e0578c3dd82494156e985dade827a87c573b5c1c7716a32162ad64", "SharesBurnt(address,uint256,uint256,uint256)", {"account": indexed(p.address), "preRebaseTokenAmount": p.uint256, "postRebaseTokenAmount": p.uint256, "sharesAmount": p.uint256}),
    Stopped: event("0x7acc84e34091ae817647a4c49116f5cc07f319078ba80f8f5fde37ea7e25cbd6", "Stopped()", {}),
    Resumed: event("0x62451d457bc659158be6e6247f56ec1df424a5c7597f71c20c2bc44e0965c8f9", "Resumed()", {}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    ContractVersionSet: event("0xfddcded6b4f4730c226821172046b48372d3cd963c159701ae1b7c3bcac541bb", "ContractVersionSet(uint256)", {"version": p.uint256}),
}

export const functions = {
    resume: fun("0x046f7da2", "resume()", {}, ),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    stop: fun("0x07da68f5", "stop()", {}, ),
    hasInitialized: viewFun("0x0803fac0", "hasInitialized()", {}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_spender": p.address, "_amount": p.uint256}, p.bool),
    STAKING_CONTROL_ROLE: viewFun("0x136dd43c", "STAKING_CONTROL_ROLE()", {}, p.bytes32),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    getSharesByPooledEth: viewFun("0x19208451", "getSharesByPooledEth(uint256)", {"_ethAmount": p.uint256}, p.uint256),
    isStakingPaused: viewFun("0x1ea7ca89", "isStakingPaused()", {}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_sender": p.address, "_recipient": p.address, "_amount": p.uint256}, p.bool),
    getEVMScriptExecutor: viewFun("0x2914b9bd", "getEVMScriptExecutor(bytes)", {"_script": p.bytes}, p.address),
    setStakingLimit: fun("0x2cb5f784", "setStakingLimit(uint256,uint256)", {"_maxStakeLimit": p.uint256, "_stakeLimitIncreasePerBlock": p.uint256}, ),
    RESUME_ROLE: viewFun("0x2de03aa1", "RESUME_ROLE()", {}, p.bytes32),
    finalizeUpgrade_v2: fun("0x2f85e57c", "finalizeUpgrade_v2(address,address)", {"_lidoLocator": p.address, "_eip712StETH": p.address}, ),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    getRecoveryVault: viewFun("0x32f0a3b5", "getRecoveryVault()", {}, p.address),
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    getTotalPooledEther: viewFun("0x37cfdaca", "getTotalPooledEther()", {}, p.uint256),
    unsafeChangeDepositedValidators: fun("0x38998624", "unsafeChangeDepositedValidators(uint256)", {"_newDepositedValidators": p.uint256}, ),
    PAUSE_ROLE: viewFun("0x389ed267", "PAUSE_ROLE()", {}, p.bytes32),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"_spender": p.address, "_addedValue": p.uint256}, p.bool),
    getTreasury: viewFun("0x3b19e84a", "getTreasury()", {}, p.address),
    isStopped: viewFun("0x3f683b6a", "isStopped()", {}, p.bool),
    getBufferedEther: viewFun("0x47b714e0", "getBufferedEther()", {}, p.uint256),
    initialize: fun("0x485cc955", "initialize(address,address)", {"_lidoLocator": p.address, "_eip712StETH": p.address}, ),
    receiveELRewards: fun("0x4ad509b2", "receiveELRewards()", {}, ),
    getWithdrawalCredentials: viewFun("0x56396715", "getWithdrawalCredentials()", {}, p.bytes32),
    getCurrentStakeLimit: viewFun("0x609c4c6c", "getCurrentStakeLimit()", {}, p.uint256),
    getStakeLimitFullInfo: viewFun("0x665b4b0b", "getStakeLimitFullInfo()", {}, {"isStakingPaused": p.bool, "isStakingLimitSet": p.bool, "currentStakeLimit": p.uint256, "maxStakeLimit": p.uint256, "maxStakeLimitGrowthBlocks": p.uint256, "prevStakeLimit": p.uint256, "prevStakeBlockNumber": p.uint256}),
    transferSharesFrom: fun("0x6d780459", "transferSharesFrom(address,address,uint256)", {"_sender": p.address, "_recipient": p.address, "_sharesAmount": p.uint256}, p.uint256),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"_account": p.address}, p.uint256),
    resumeStaking: fun("0x7475f913", "resumeStaking()", {}, ),
    getFeeDistribution: viewFun("0x752f77f1", "getFeeDistribution()", {}, {"treasuryFeeBasisPoints": p.uint16, "insuranceFeeBasisPoints": p.uint16, "operatorsFeeBasisPoints": p.uint16}),
    receiveWithdrawals: fun("0x78ffcfe2", "receiveWithdrawals()", {}, ),
    getPooledEthByShares: viewFun("0x7a28fb88", "getPooledEthByShares(uint256)", {"_sharesAmount": p.uint256}, p.uint256),
    allowRecoverability: viewFun("0x7e7db6e1", "allowRecoverability(address)", {"token": p.address}, p.bool),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"owner": p.address}, p.uint256),
    appId: viewFun("0x80afdea8", "appId()", {}, p.bytes32),
    getOracle: viewFun("0x833b1fce", "getOracle()", {}, p.address),
    eip712Domain: viewFun("0x84b0196e", "eip712Domain()", {}, {"name": p.string, "version": p.string, "chainId": p.uint256, "verifyingContract": p.address}),
    getContractVersion: viewFun("0x8aa10435", "getContractVersion()", {}, p.uint256),
    getInitializationBlock: viewFun("0x8b3dd749", "getInitializationBlock()", {}, p.uint256),
    transferShares: fun("0x8fcb4e5b", "transferShares(address,uint256)", {"_recipient": p.address, "_sharesAmount": p.uint256}, p.uint256),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    getEIP712StETH: viewFun("0x9861f8e5", "getEIP712StETH()", {}, p.address),
    transferToVault: fun("0x9d4941d8", "transferToVault(address)", {"_0": p.address}, ),
    canPerform: viewFun("0xa1658fad", "canPerform(address,bytes32,uint256[])", {"_sender": p.address, "_role": p.bytes32, "_params": p.array(p.uint256)}, p.bool),
    submit: fun("0xa1903eab", "submit(address)", {"_referral": p.address}, p.uint256),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"_spender": p.address, "_subtractedValue": p.uint256}, p.bool),
    getEVMScriptRegistry: viewFun("0xa479e508", "getEVMScriptRegistry()", {}, p.address),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_recipient": p.address, "_amount": p.uint256}, p.bool),
    deposit: fun("0xaa0b7db7", "deposit(uint256,uint256,bytes)", {"_maxDepositsCount": p.uint256, "_stakingModuleId": p.uint256, "_depositCalldata": p.bytes}, ),
    UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE: viewFun("0xad1394e9", "UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE()", {}, p.bytes32),
    getBeaconStat: viewFun("0xae2e3538", "getBeaconStat()", {}, {"depositedValidators": p.uint256, "beaconValidators": p.uint256, "beaconBalance": p.uint256}),
    removeStakingLimit: fun("0xb3320d9a", "removeStakingLimit()", {}, ),
    handleOracleReport: fun("0xbac3f3c5", "handleOracleReport(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256[],uint256)", {"_reportTimestamp": p.uint256, "_timeElapsed": p.uint256, "_clValidators": p.uint256, "_clBalance": p.uint256, "_withdrawalVaultBalance": p.uint256, "_elRewardsVaultBalance": p.uint256, "_sharesRequestedToBurn": p.uint256, "_withdrawalFinalizationBatches": p.array(p.uint256), "_simulatedShareRate": p.uint256}, p.fixedSizeArray(p.uint256, 4)),
    getFee: viewFun("0xced72f87", "getFee()", {}, p.uint16),
    kernel: viewFun("0xd4aae0c4", "kernel()", {}, p.address),
    getTotalShares: viewFun("0xd5002f2e", "getTotalShares()", {}, p.uint256),
    permit: fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"_owner": p.address, "_spender": p.address, "_value": p.uint256, "_deadline": p.uint256, "_v": p.uint8, "_r": p.bytes32, "_s": p.bytes32}, ),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"_owner": p.address, "_spender": p.address}, p.uint256),
    isPetrified: viewFun("0xde4796ed", "isPetrified()", {}, p.bool),
    getLidoLocator: viewFun("0xe654ff17", "getLidoLocator()", {}, p.address),
    canDeposit: viewFun("0xe78a5875", "canDeposit()", {}, p.bool),
    STAKING_PAUSE_ROLE: viewFun("0xeb85262f", "STAKING_PAUSE_ROLE()", {}, p.bytes32),
    getDepositableEther: viewFun("0xf2cfa87d", "getDepositableEther()", {}, p.uint256),
    sharesOf: viewFun("0xf5eb42dc", "sharesOf(address)", {"_account": p.address}, p.uint256),
    pauseStaking: fun("0xf999c506", "pauseStaking()", {}, ),
    getTotalELRewardsCollected: viewFun("0xfa64ebac", "getTotalELRewardsCollected()", {}, p.uint256),
}

export class Contract extends ContractBase {

    name() {
        return this.eth_call(functions.name, {})
    }

    hasInitialized() {
        return this.eth_call(functions.hasInitialized, {})
    }

    STAKING_CONTROL_ROLE() {
        return this.eth_call(functions.STAKING_CONTROL_ROLE, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    getSharesByPooledEth(_ethAmount: GetSharesByPooledEthParams["_ethAmount"]) {
        return this.eth_call(functions.getSharesByPooledEth, {_ethAmount})
    }

    isStakingPaused() {
        return this.eth_call(functions.isStakingPaused, {})
    }

    getEVMScriptExecutor(_script: GetEVMScriptExecutorParams["_script"]) {
        return this.eth_call(functions.getEVMScriptExecutor, {_script})
    }

    RESUME_ROLE() {
        return this.eth_call(functions.RESUME_ROLE, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getRecoveryVault() {
        return this.eth_call(functions.getRecoveryVault, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    getTotalPooledEther() {
        return this.eth_call(functions.getTotalPooledEther, {})
    }

    PAUSE_ROLE() {
        return this.eth_call(functions.PAUSE_ROLE, {})
    }

    getTreasury() {
        return this.eth_call(functions.getTreasury, {})
    }

    isStopped() {
        return this.eth_call(functions.isStopped, {})
    }

    getBufferedEther() {
        return this.eth_call(functions.getBufferedEther, {})
    }

    getWithdrawalCredentials() {
        return this.eth_call(functions.getWithdrawalCredentials, {})
    }

    getCurrentStakeLimit() {
        return this.eth_call(functions.getCurrentStakeLimit, {})
    }

    getStakeLimitFullInfo() {
        return this.eth_call(functions.getStakeLimitFullInfo, {})
    }

    balanceOf(_account: BalanceOfParams["_account"]) {
        return this.eth_call(functions.balanceOf, {_account})
    }

    getFeeDistribution() {
        return this.eth_call(functions.getFeeDistribution, {})
    }

    getPooledEthByShares(_sharesAmount: GetPooledEthBySharesParams["_sharesAmount"]) {
        return this.eth_call(functions.getPooledEthByShares, {_sharesAmount})
    }

    allowRecoverability(token: AllowRecoverabilityParams["token"]) {
        return this.eth_call(functions.allowRecoverability, {token})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(functions.nonces, {owner})
    }

    appId() {
        return this.eth_call(functions.appId, {})
    }

    getOracle() {
        return this.eth_call(functions.getOracle, {})
    }

    eip712Domain() {
        return this.eth_call(functions.eip712Domain, {})
    }

    getContractVersion() {
        return this.eth_call(functions.getContractVersion, {})
    }

    getInitializationBlock() {
        return this.eth_call(functions.getInitializationBlock, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    getEIP712StETH() {
        return this.eth_call(functions.getEIP712StETH, {})
    }

    canPerform(_sender: CanPerformParams["_sender"], _role: CanPerformParams["_role"], _params: CanPerformParams["_params"]) {
        return this.eth_call(functions.canPerform, {_sender, _role, _params})
    }

    getEVMScriptRegistry() {
        return this.eth_call(functions.getEVMScriptRegistry, {})
    }

    UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE() {
        return this.eth_call(functions.UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE, {})
    }

    getBeaconStat() {
        return this.eth_call(functions.getBeaconStat, {})
    }

    getFee() {
        return this.eth_call(functions.getFee, {})
    }

    kernel() {
        return this.eth_call(functions.kernel, {})
    }

    getTotalShares() {
        return this.eth_call(functions.getTotalShares, {})
    }

    allowance(_owner: AllowanceParams["_owner"], _spender: AllowanceParams["_spender"]) {
        return this.eth_call(functions.allowance, {_owner, _spender})
    }

    isPetrified() {
        return this.eth_call(functions.isPetrified, {})
    }

    getLidoLocator() {
        return this.eth_call(functions.getLidoLocator, {})
    }

    canDeposit() {
        return this.eth_call(functions.canDeposit, {})
    }

    STAKING_PAUSE_ROLE() {
        return this.eth_call(functions.STAKING_PAUSE_ROLE, {})
    }

    getDepositableEther() {
        return this.eth_call(functions.getDepositableEther, {})
    }

    sharesOf(_account: SharesOfParams["_account"]) {
        return this.eth_call(functions.sharesOf, {_account})
    }

    getTotalELRewardsCollected() {
        return this.eth_call(functions.getTotalELRewardsCollected, {})
    }
}

/// Event types
export type StakingPausedEventArgs = EParams<typeof events.StakingPaused>
export type StakingResumedEventArgs = EParams<typeof events.StakingResumed>
export type StakingLimitSetEventArgs = EParams<typeof events.StakingLimitSet>
export type StakingLimitRemovedEventArgs = EParams<typeof events.StakingLimitRemoved>
export type CLValidatorsUpdatedEventArgs = EParams<typeof events.CLValidatorsUpdated>
export type DepositedValidatorsChangedEventArgs = EParams<typeof events.DepositedValidatorsChanged>
export type ETHDistributedEventArgs = EParams<typeof events.ETHDistributed>
export type TokenRebasedEventArgs = EParams<typeof events.TokenRebased>
export type LidoLocatorSetEventArgs = EParams<typeof events.LidoLocatorSet>
export type ELRewardsReceivedEventArgs = EParams<typeof events.ELRewardsReceived>
export type WithdrawalsReceivedEventArgs = EParams<typeof events.WithdrawalsReceived>
export type SubmittedEventArgs = EParams<typeof events.Submitted>
export type UnbufferedEventArgs = EParams<typeof events.Unbuffered>
export type ScriptResultEventArgs = EParams<typeof events.ScriptResult>
export type RecoverToVaultEventArgs = EParams<typeof events.RecoverToVault>
export type EIP712StETHInitializedEventArgs = EParams<typeof events.EIP712StETHInitialized>
export type TransferSharesEventArgs = EParams<typeof events.TransferShares>
export type SharesBurntEventArgs = EParams<typeof events.SharesBurnt>
export type StoppedEventArgs = EParams<typeof events.Stopped>
export type ResumedEventArgs = EParams<typeof events.Resumed>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ContractVersionSetEventArgs = EParams<typeof events.ContractVersionSet>

/// Function types
export type ResumeParams = FunctionArguments<typeof functions.resume>
export type ResumeReturn = FunctionReturn<typeof functions.resume>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type StopParams = FunctionArguments<typeof functions.stop>
export type StopReturn = FunctionReturn<typeof functions.stop>

export type HasInitializedParams = FunctionArguments<typeof functions.hasInitialized>
export type HasInitializedReturn = FunctionReturn<typeof functions.hasInitialized>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type STAKING_CONTROL_ROLEParams = FunctionArguments<typeof functions.STAKING_CONTROL_ROLE>
export type STAKING_CONTROL_ROLEReturn = FunctionReturn<typeof functions.STAKING_CONTROL_ROLE>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type GetSharesByPooledEthParams = FunctionArguments<typeof functions.getSharesByPooledEth>
export type GetSharesByPooledEthReturn = FunctionReturn<typeof functions.getSharesByPooledEth>

export type IsStakingPausedParams = FunctionArguments<typeof functions.isStakingPaused>
export type IsStakingPausedReturn = FunctionReturn<typeof functions.isStakingPaused>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type GetEVMScriptExecutorParams = FunctionArguments<typeof functions.getEVMScriptExecutor>
export type GetEVMScriptExecutorReturn = FunctionReturn<typeof functions.getEVMScriptExecutor>

export type SetStakingLimitParams = FunctionArguments<typeof functions.setStakingLimit>
export type SetStakingLimitReturn = FunctionReturn<typeof functions.setStakingLimit>

export type RESUME_ROLEParams = FunctionArguments<typeof functions.RESUME_ROLE>
export type RESUME_ROLEReturn = FunctionReturn<typeof functions.RESUME_ROLE>

export type FinalizeUpgrade_v2Params = FunctionArguments<typeof functions.finalizeUpgrade_v2>
export type FinalizeUpgrade_v2Return = FunctionReturn<typeof functions.finalizeUpgrade_v2>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type GetRecoveryVaultParams = FunctionArguments<typeof functions.getRecoveryVault>
export type GetRecoveryVaultReturn = FunctionReturn<typeof functions.getRecoveryVault>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type GetTotalPooledEtherParams = FunctionArguments<typeof functions.getTotalPooledEther>
export type GetTotalPooledEtherReturn = FunctionReturn<typeof functions.getTotalPooledEther>

export type UnsafeChangeDepositedValidatorsParams = FunctionArguments<typeof functions.unsafeChangeDepositedValidators>
export type UnsafeChangeDepositedValidatorsReturn = FunctionReturn<typeof functions.unsafeChangeDepositedValidators>

export type PAUSE_ROLEParams = FunctionArguments<typeof functions.PAUSE_ROLE>
export type PAUSE_ROLEReturn = FunctionReturn<typeof functions.PAUSE_ROLE>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type GetTreasuryParams = FunctionArguments<typeof functions.getTreasury>
export type GetTreasuryReturn = FunctionReturn<typeof functions.getTreasury>

export type IsStoppedParams = FunctionArguments<typeof functions.isStopped>
export type IsStoppedReturn = FunctionReturn<typeof functions.isStopped>

export type GetBufferedEtherParams = FunctionArguments<typeof functions.getBufferedEther>
export type GetBufferedEtherReturn = FunctionReturn<typeof functions.getBufferedEther>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type ReceiveELRewardsParams = FunctionArguments<typeof functions.receiveELRewards>
export type ReceiveELRewardsReturn = FunctionReturn<typeof functions.receiveELRewards>

export type GetWithdrawalCredentialsParams = FunctionArguments<typeof functions.getWithdrawalCredentials>
export type GetWithdrawalCredentialsReturn = FunctionReturn<typeof functions.getWithdrawalCredentials>

export type GetCurrentStakeLimitParams = FunctionArguments<typeof functions.getCurrentStakeLimit>
export type GetCurrentStakeLimitReturn = FunctionReturn<typeof functions.getCurrentStakeLimit>

export type GetStakeLimitFullInfoParams = FunctionArguments<typeof functions.getStakeLimitFullInfo>
export type GetStakeLimitFullInfoReturn = FunctionReturn<typeof functions.getStakeLimitFullInfo>

export type TransferSharesFromParams = FunctionArguments<typeof functions.transferSharesFrom>
export type TransferSharesFromReturn = FunctionReturn<typeof functions.transferSharesFrom>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ResumeStakingParams = FunctionArguments<typeof functions.resumeStaking>
export type ResumeStakingReturn = FunctionReturn<typeof functions.resumeStaking>

export type GetFeeDistributionParams = FunctionArguments<typeof functions.getFeeDistribution>
export type GetFeeDistributionReturn = FunctionReturn<typeof functions.getFeeDistribution>

export type ReceiveWithdrawalsParams = FunctionArguments<typeof functions.receiveWithdrawals>
export type ReceiveWithdrawalsReturn = FunctionReturn<typeof functions.receiveWithdrawals>

export type GetPooledEthBySharesParams = FunctionArguments<typeof functions.getPooledEthByShares>
export type GetPooledEthBySharesReturn = FunctionReturn<typeof functions.getPooledEthByShares>

export type AllowRecoverabilityParams = FunctionArguments<typeof functions.allowRecoverability>
export type AllowRecoverabilityReturn = FunctionReturn<typeof functions.allowRecoverability>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type AppIdParams = FunctionArguments<typeof functions.appId>
export type AppIdReturn = FunctionReturn<typeof functions.appId>

export type GetOracleParams = FunctionArguments<typeof functions.getOracle>
export type GetOracleReturn = FunctionReturn<typeof functions.getOracle>

export type Eip712DomainParams = FunctionArguments<typeof functions.eip712Domain>
export type Eip712DomainReturn = FunctionReturn<typeof functions.eip712Domain>

export type GetContractVersionParams = FunctionArguments<typeof functions.getContractVersion>
export type GetContractVersionReturn = FunctionReturn<typeof functions.getContractVersion>

export type GetInitializationBlockParams = FunctionArguments<typeof functions.getInitializationBlock>
export type GetInitializationBlockReturn = FunctionReturn<typeof functions.getInitializationBlock>

export type TransferSharesParams = FunctionArguments<typeof functions.transferShares>
export type TransferSharesReturn = FunctionReturn<typeof functions.transferShares>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type GetEIP712StETHParams = FunctionArguments<typeof functions.getEIP712StETH>
export type GetEIP712StETHReturn = FunctionReturn<typeof functions.getEIP712StETH>

export type TransferToVaultParams = FunctionArguments<typeof functions.transferToVault>
export type TransferToVaultReturn = FunctionReturn<typeof functions.transferToVault>

export type CanPerformParams = FunctionArguments<typeof functions.canPerform>
export type CanPerformReturn = FunctionReturn<typeof functions.canPerform>

export type SubmitParams = FunctionArguments<typeof functions.submit>
export type SubmitReturn = FunctionReturn<typeof functions.submit>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type GetEVMScriptRegistryParams = FunctionArguments<typeof functions.getEVMScriptRegistry>
export type GetEVMScriptRegistryReturn = FunctionReturn<typeof functions.getEVMScriptRegistry>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLEParams = FunctionArguments<typeof functions.UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE>
export type UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLEReturn = FunctionReturn<typeof functions.UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE>

export type GetBeaconStatParams = FunctionArguments<typeof functions.getBeaconStat>
export type GetBeaconStatReturn = FunctionReturn<typeof functions.getBeaconStat>

export type RemoveStakingLimitParams = FunctionArguments<typeof functions.removeStakingLimit>
export type RemoveStakingLimitReturn = FunctionReturn<typeof functions.removeStakingLimit>

export type HandleOracleReportParams = FunctionArguments<typeof functions.handleOracleReport>
export type HandleOracleReportReturn = FunctionReturn<typeof functions.handleOracleReport>

export type GetFeeParams = FunctionArguments<typeof functions.getFee>
export type GetFeeReturn = FunctionReturn<typeof functions.getFee>

export type KernelParams = FunctionArguments<typeof functions.kernel>
export type KernelReturn = FunctionReturn<typeof functions.kernel>

export type GetTotalSharesParams = FunctionArguments<typeof functions.getTotalShares>
export type GetTotalSharesReturn = FunctionReturn<typeof functions.getTotalShares>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type IsPetrifiedParams = FunctionArguments<typeof functions.isPetrified>
export type IsPetrifiedReturn = FunctionReturn<typeof functions.isPetrified>

export type GetLidoLocatorParams = FunctionArguments<typeof functions.getLidoLocator>
export type GetLidoLocatorReturn = FunctionReturn<typeof functions.getLidoLocator>

export type CanDepositParams = FunctionArguments<typeof functions.canDeposit>
export type CanDepositReturn = FunctionReturn<typeof functions.canDeposit>

export type STAKING_PAUSE_ROLEParams = FunctionArguments<typeof functions.STAKING_PAUSE_ROLE>
export type STAKING_PAUSE_ROLEReturn = FunctionReturn<typeof functions.STAKING_PAUSE_ROLE>

export type GetDepositableEtherParams = FunctionArguments<typeof functions.getDepositableEther>
export type GetDepositableEtherReturn = FunctionReturn<typeof functions.getDepositableEther>

export type SharesOfParams = FunctionArguments<typeof functions.sharesOf>
export type SharesOfReturn = FunctionReturn<typeof functions.sharesOf>

export type PauseStakingParams = FunctionArguments<typeof functions.pauseStaking>
export type PauseStakingReturn = FunctionReturn<typeof functions.pauseStaking>

export type GetTotalELRewardsCollectedParams = FunctionArguments<typeof functions.getTotalELRewardsCollected>
export type GetTotalELRewardsCollectedReturn = FunctionReturn<typeof functions.getTotalELRewardsCollected>

