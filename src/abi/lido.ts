import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './lido.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    StakingPaused: new LogEvent<[]>(
        abi, '0x26d1807b479eaba249c1214b82e4b65bbb0cc73ee8a17901324b1ef1b5904e49'
    ),
    StakingResumed: new LogEvent<[]>(
        abi, '0xedaeeae9aed70c4545d3ab0065713261c9cee8d6cf5c8b07f52f0a65fd91efda'
    ),
    StakingLimitSet: new LogEvent<([maxStakeLimit: bigint, stakeLimitIncreasePerBlock: bigint] & {maxStakeLimit: bigint, stakeLimitIncreasePerBlock: bigint})>(
        abi, '0xce9fddf6179affa1ea7bf36d80a6bf0284e0f3b91f4b2fa6eea2af923e7fac2d'
    ),
    StakingLimitRemoved: new LogEvent<[]>(
        abi, '0x9b2a687c198898fcc32a33bbc610d478f177a73ab7352023e6cc1de5bf12a3df'
    ),
    CLValidatorsUpdated: new LogEvent<([reportTimestamp: bigint, preCLValidators: bigint, postCLValidators: bigint] & {reportTimestamp: bigint, preCLValidators: bigint, postCLValidators: bigint})>(
        abi, '0x1252331d4f3ee8a9f0a3484c4c2fb059c70a047b5dc5482a3ee6415f742d9f2e'
    ),
    DepositedValidatorsChanged: new LogEvent<([depositedValidators: bigint] & {depositedValidators: bigint})>(
        abi, '0xe0aacfc334457703148118055ec794ac17654c6f918d29638ba3b18003cee5ff'
    ),
    ETHDistributed: new LogEvent<([reportTimestamp: bigint, preCLBalance: bigint, postCLBalance: bigint, withdrawalsWithdrawn: bigint, executionLayerRewardsWithdrawn: bigint, postBufferedEther: bigint] & {reportTimestamp: bigint, preCLBalance: bigint, postCLBalance: bigint, withdrawalsWithdrawn: bigint, executionLayerRewardsWithdrawn: bigint, postBufferedEther: bigint})>(
        abi, '0x92dd3cb149a1eebd51fd8c2a3653fd96f30c4ac01d4f850fc16d46abd6c3e92f'
    ),
    TokenRebased: new LogEvent<([reportTimestamp: bigint, timeElapsed: bigint, preTotalShares: bigint, preTotalEther: bigint, postTotalShares: bigint, postTotalEther: bigint, sharesMintedAsFees: bigint] & {reportTimestamp: bigint, timeElapsed: bigint, preTotalShares: bigint, preTotalEther: bigint, postTotalShares: bigint, postTotalEther: bigint, sharesMintedAsFees: bigint})>(
        abi, '0xff08c3ef606d198e316ef5b822193c489965899eb4e3c248cea1a4626c3eda50'
    ),
    LidoLocatorSet: new LogEvent<([lidoLocator: string] & {lidoLocator: string})>(
        abi, '0x61f9416d3c29deb4e424342445a2b132738430becd9fa275e11297c90668b22e'
    ),
    ELRewardsReceived: new LogEvent<([amount: bigint] & {amount: bigint})>(
        abi, '0xd27f9b0c98bdee27044afa149eadcd2047d6399cb6613a45c5b87e6aca76e6b5'
    ),
    WithdrawalsReceived: new LogEvent<([amount: bigint] & {amount: bigint})>(
        abi, '0x6e5086f7e1ab04bd826e77faae35b1bcfe31bd144623361a40ea4af51670b1c3'
    ),
    Submitted: new LogEvent<([sender: string, amount: bigint, referral: string] & {sender: string, amount: bigint, referral: string})>(
        abi, '0x96a25c8ce0baabc1fdefd93e9ed25d8e092a3332f3aa9a41722b5697231d1d1a'
    ),
    Unbuffered: new LogEvent<([amount: bigint] & {amount: bigint})>(
        abi, '0x76a397bea5768d4fca97ef47792796e35f98dc81b16c1de84e28a818e1f97108'
    ),
    ScriptResult: new LogEvent<([executor: string, script: string, input: string, returnData: string] & {executor: string, script: string, input: string, returnData: string})>(
        abi, '0x5229a5dba83a54ae8cb5b51bdd6de9474cacbe9dd332f5185f3a4f4f2e3f4ad9'
    ),
    RecoverToVault: new LogEvent<([vault: string, token: string, amount: bigint] & {vault: string, token: string, amount: bigint})>(
        abi, '0x596caf56044b55fb8c4ca640089bbc2b63cae3e978b851f5745cbb7c5b288e02'
    ),
    EIP712StETHInitialized: new LogEvent<([eip712StETH: string] & {eip712StETH: string})>(
        abi, '0xb80a5409082a3729c9fc139f8b41192c40e85252752df2c07caebd613086ca83'
    ),
    TransferShares: new LogEvent<([from: string, to: string, sharesValue: bigint] & {from: string, to: string, sharesValue: bigint})>(
        abi, '0x9d9c909296d9c674451c0c24f02cb64981eb3b727f99865939192f880a755dcb'
    ),
    SharesBurnt: new LogEvent<([account: string, preRebaseTokenAmount: bigint, postRebaseTokenAmount: bigint, sharesAmount: bigint] & {account: string, preRebaseTokenAmount: bigint, postRebaseTokenAmount: bigint, sharesAmount: bigint})>(
        abi, '0x8b2a1e1ad5e0578c3dd82494156e985dade827a87c573b5c1c7716a32162ad64'
    ),
    Stopped: new LogEvent<[]>(
        abi, '0x7acc84e34091ae817647a4c49116f5cc07f319078ba80f8f5fde37ea7e25cbd6'
    ),
    Resumed: new LogEvent<[]>(
        abi, '0x62451d457bc659158be6e6247f56ec1df424a5c7597f71c20c2bc44e0965c8f9'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ContractVersionSet: new LogEvent<([version: bigint] & {version: bigint})>(
        abi, '0xfddcded6b4f4730c226821172046b48372d3cd963c159701ae1b7c3bcac541bb'
    ),
}

export const functions = {
    resume: new Func<[], {}, []>(
        abi, '0x046f7da2'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    stop: new Func<[], {}, []>(
        abi, '0x07da68f5'
    ),
    hasInitialized: new Func<[], {}, boolean>(
        abi, '0x0803fac0'
    ),
    approve: new Func<[_spender: string, _amount: bigint], {_spender: string, _amount: bigint}, boolean>(
        abi, '0x095ea7b3'
    ),
    STAKING_CONTROL_ROLE: new Func<[], {}, string>(
        abi, '0x136dd43c'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    getSharesByPooledEth: new Func<[_ethAmount: bigint], {_ethAmount: bigint}, bigint>(
        abi, '0x19208451'
    ),
    isStakingPaused: new Func<[], {}, boolean>(
        abi, '0x1ea7ca89'
    ),
    transferFrom: new Func<[_sender: string, _recipient: string, _amount: bigint], {_sender: string, _recipient: string, _amount: bigint}, boolean>(
        abi, '0x23b872dd'
    ),
    getEVMScriptExecutor: new Func<[_script: string], {_script: string}, string>(
        abi, '0x2914b9bd'
    ),
    setStakingLimit: new Func<[_maxStakeLimit: bigint, _stakeLimitIncreasePerBlock: bigint], {_maxStakeLimit: bigint, _stakeLimitIncreasePerBlock: bigint}, []>(
        abi, '0x2cb5f784'
    ),
    RESUME_ROLE: new Func<[], {}, string>(
        abi, '0x2de03aa1'
    ),
    finalizeUpgrade_v2: new Func<[_lidoLocator: string, _eip712StETH: string], {_lidoLocator: string, _eip712StETH: string}, []>(
        abi, '0x2f85e57c'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    getRecoveryVault: new Func<[], {}, string>(
        abi, '0x32f0a3b5'
    ),
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    getTotalPooledEther: new Func<[], {}, bigint>(
        abi, '0x37cfdaca'
    ),
    unsafeChangeDepositedValidators: new Func<[_newDepositedValidators: bigint], {_newDepositedValidators: bigint}, []>(
        abi, '0x38998624'
    ),
    PAUSE_ROLE: new Func<[], {}, string>(
        abi, '0x389ed267'
    ),
    increaseAllowance: new Func<[_spender: string, _addedValue: bigint], {_spender: string, _addedValue: bigint}, boolean>(
        abi, '0x39509351'
    ),
    getTreasury: new Func<[], {}, string>(
        abi, '0x3b19e84a'
    ),
    isStopped: new Func<[], {}, boolean>(
        abi, '0x3f683b6a'
    ),
    getBufferedEther: new Func<[], {}, bigint>(
        abi, '0x47b714e0'
    ),
    initialize: new Func<[_lidoLocator: string, _eip712StETH: string], {_lidoLocator: string, _eip712StETH: string}, []>(
        abi, '0x485cc955'
    ),
    receiveELRewards: new Func<[], {}, []>(
        abi, '0x4ad509b2'
    ),
    getWithdrawalCredentials: new Func<[], {}, string>(
        abi, '0x56396715'
    ),
    getCurrentStakeLimit: new Func<[], {}, bigint>(
        abi, '0x609c4c6c'
    ),
    getStakeLimitFullInfo: new Func<[], {}, ([isStakingPaused: boolean, isStakingLimitSet: boolean, currentStakeLimit: bigint, maxStakeLimit: bigint, maxStakeLimitGrowthBlocks: bigint, prevStakeLimit: bigint, prevStakeBlockNumber: bigint] & {isStakingPaused: boolean, isStakingLimitSet: boolean, currentStakeLimit: bigint, maxStakeLimit: bigint, maxStakeLimitGrowthBlocks: bigint, prevStakeLimit: bigint, prevStakeBlockNumber: bigint})>(
        abi, '0x665b4b0b'
    ),
    transferSharesFrom: new Func<[_sender: string, _recipient: string, _sharesAmount: bigint], {_sender: string, _recipient: string, _sharesAmount: bigint}, bigint>(
        abi, '0x6d780459'
    ),
    balanceOf: new Func<[_account: string], {_account: string}, bigint>(
        abi, '0x70a08231'
    ),
    resumeStaking: new Func<[], {}, []>(
        abi, '0x7475f913'
    ),
    getFeeDistribution: new Func<[], {}, ([treasuryFeeBasisPoints: number, insuranceFeeBasisPoints: number, operatorsFeeBasisPoints: number] & {treasuryFeeBasisPoints: number, insuranceFeeBasisPoints: number, operatorsFeeBasisPoints: number})>(
        abi, '0x752f77f1'
    ),
    receiveWithdrawals: new Func<[], {}, []>(
        abi, '0x78ffcfe2'
    ),
    getPooledEthByShares: new Func<[_sharesAmount: bigint], {_sharesAmount: bigint}, bigint>(
        abi, '0x7a28fb88'
    ),
    allowRecoverability: new Func<[token: string], {token: string}, boolean>(
        abi, '0x7e7db6e1'
    ),
    nonces: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x7ecebe00'
    ),
    appId: new Func<[], {}, string>(
        abi, '0x80afdea8'
    ),
    getOracle: new Func<[], {}, string>(
        abi, '0x833b1fce'
    ),
    eip712Domain: new Func<[], {}, ([name: string, version: string, chainId: bigint, verifyingContract: string] & {name: string, version: string, chainId: bigint, verifyingContract: string})>(
        abi, '0x84b0196e'
    ),
    getContractVersion: new Func<[], {}, bigint>(
        abi, '0x8aa10435'
    ),
    getInitializationBlock: new Func<[], {}, bigint>(
        abi, '0x8b3dd749'
    ),
    transferShares: new Func<[_recipient: string, _sharesAmount: bigint], {_recipient: string, _sharesAmount: bigint}, bigint>(
        abi, '0x8fcb4e5b'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    getEIP712StETH: new Func<[], {}, string>(
        abi, '0x9861f8e5'
    ),
    transferToVault: new Func<[_: string], {}, []>(
        abi, '0x9d4941d8'
    ),
    canPerform: new Func<[_sender: string, _role: string, _params: Array<bigint>], {_sender: string, _role: string, _params: Array<bigint>}, boolean>(
        abi, '0xa1658fad'
    ),
    submit: new Func<[_referral: string], {_referral: string}, bigint>(
        abi, '0xa1903eab'
    ),
    decreaseAllowance: new Func<[_spender: string, _subtractedValue: bigint], {_spender: string, _subtractedValue: bigint}, boolean>(
        abi, '0xa457c2d7'
    ),
    getEVMScriptRegistry: new Func<[], {}, string>(
        abi, '0xa479e508'
    ),
    transfer: new Func<[_recipient: string, _amount: bigint], {_recipient: string, _amount: bigint}, boolean>(
        abi, '0xa9059cbb'
    ),
    deposit: new Func<[_maxDepositsCount: bigint, _stakingModuleId: bigint, _depositCalldata: string], {_maxDepositsCount: bigint, _stakingModuleId: bigint, _depositCalldata: string}, []>(
        abi, '0xaa0b7db7'
    ),
    UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE: new Func<[], {}, string>(
        abi, '0xad1394e9'
    ),
    getBeaconStat: new Func<[], {}, ([depositedValidators: bigint, beaconValidators: bigint, beaconBalance: bigint] & {depositedValidators: bigint, beaconValidators: bigint, beaconBalance: bigint})>(
        abi, '0xae2e3538'
    ),
    removeStakingLimit: new Func<[], {}, []>(
        abi, '0xb3320d9a'
    ),
    handleOracleReport: new Func<[_reportTimestamp: bigint, _timeElapsed: bigint, _clValidators: bigint, _clBalance: bigint, _withdrawalVaultBalance: bigint, _elRewardsVaultBalance: bigint, _sharesRequestedToBurn: bigint, _withdrawalFinalizationBatches: Array<bigint>, _simulatedShareRate: bigint], {_reportTimestamp: bigint, _timeElapsed: bigint, _clValidators: bigint, _clBalance: bigint, _withdrawalVaultBalance: bigint, _elRewardsVaultBalance: bigint, _sharesRequestedToBurn: bigint, _withdrawalFinalizationBatches: Array<bigint>, _simulatedShareRate: bigint}, Array<bigint>>(
        abi, '0xbac3f3c5'
    ),
    getFee: new Func<[], {}, number>(
        abi, '0xced72f87'
    ),
    kernel: new Func<[], {}, string>(
        abi, '0xd4aae0c4'
    ),
    getTotalShares: new Func<[], {}, bigint>(
        abi, '0xd5002f2e'
    ),
    permit: new Func<[_owner: string, _spender: string, _value: bigint, _deadline: bigint, _v: number, _r: string, _s: string], {_owner: string, _spender: string, _value: bigint, _deadline: bigint, _v: number, _r: string, _s: string}, []>(
        abi, '0xd505accf'
    ),
    allowance: new Func<[_owner: string, _spender: string], {_owner: string, _spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    isPetrified: new Func<[], {}, boolean>(
        abi, '0xde4796ed'
    ),
    getLidoLocator: new Func<[], {}, string>(
        abi, '0xe654ff17'
    ),
    canDeposit: new Func<[], {}, boolean>(
        abi, '0xe78a5875'
    ),
    STAKING_PAUSE_ROLE: new Func<[], {}, string>(
        abi, '0xeb85262f'
    ),
    getDepositableEther: new Func<[], {}, bigint>(
        abi, '0xf2cfa87d'
    ),
    sharesOf: new Func<[_account: string], {_account: string}, bigint>(
        abi, '0xf5eb42dc'
    ),
    pauseStaking: new Func<[], {}, []>(
        abi, '0xf999c506'
    ),
    getTotalELRewardsCollected: new Func<[], {}, bigint>(
        abi, '0xfa64ebac'
    ),
}

export class Contract extends ContractBase {

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    hasInitialized(): Promise<boolean> {
        return this.eth_call(functions.hasInitialized, [])
    }

    STAKING_CONTROL_ROLE(): Promise<string> {
        return this.eth_call(functions.STAKING_CONTROL_ROLE, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    getSharesByPooledEth(_ethAmount: bigint): Promise<bigint> {
        return this.eth_call(functions.getSharesByPooledEth, [_ethAmount])
    }

    isStakingPaused(): Promise<boolean> {
        return this.eth_call(functions.isStakingPaused, [])
    }

    getEVMScriptExecutor(_script: string): Promise<string> {
        return this.eth_call(functions.getEVMScriptExecutor, [_script])
    }

    RESUME_ROLE(): Promise<string> {
        return this.eth_call(functions.RESUME_ROLE, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    getRecoveryVault(): Promise<string> {
        return this.eth_call(functions.getRecoveryVault, [])
    }

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    getTotalPooledEther(): Promise<bigint> {
        return this.eth_call(functions.getTotalPooledEther, [])
    }

    PAUSE_ROLE(): Promise<string> {
        return this.eth_call(functions.PAUSE_ROLE, [])
    }

    getTreasury(): Promise<string> {
        return this.eth_call(functions.getTreasury, [])
    }

    isStopped(): Promise<boolean> {
        return this.eth_call(functions.isStopped, [])
    }

    getBufferedEther(): Promise<bigint> {
        return this.eth_call(functions.getBufferedEther, [])
    }

    getWithdrawalCredentials(): Promise<string> {
        return this.eth_call(functions.getWithdrawalCredentials, [])
    }

    getCurrentStakeLimit(): Promise<bigint> {
        return this.eth_call(functions.getCurrentStakeLimit, [])
    }

    getStakeLimitFullInfo(): Promise<([isStakingPaused: boolean, isStakingLimitSet: boolean, currentStakeLimit: bigint, maxStakeLimit: bigint, maxStakeLimitGrowthBlocks: bigint, prevStakeLimit: bigint, prevStakeBlockNumber: bigint] & {isStakingPaused: boolean, isStakingLimitSet: boolean, currentStakeLimit: bigint, maxStakeLimit: bigint, maxStakeLimitGrowthBlocks: bigint, prevStakeLimit: bigint, prevStakeBlockNumber: bigint})> {
        return this.eth_call(functions.getStakeLimitFullInfo, [])
    }

    balanceOf(_account: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [_account])
    }

    getFeeDistribution(): Promise<([treasuryFeeBasisPoints: number, insuranceFeeBasisPoints: number, operatorsFeeBasisPoints: number] & {treasuryFeeBasisPoints: number, insuranceFeeBasisPoints: number, operatorsFeeBasisPoints: number})> {
        return this.eth_call(functions.getFeeDistribution, [])
    }

    getPooledEthByShares(_sharesAmount: bigint): Promise<bigint> {
        return this.eth_call(functions.getPooledEthByShares, [_sharesAmount])
    }

    allowRecoverability(token: string): Promise<boolean> {
        return this.eth_call(functions.allowRecoverability, [token])
    }

    nonces(owner: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [owner])
    }

    appId(): Promise<string> {
        return this.eth_call(functions.appId, [])
    }

    getOracle(): Promise<string> {
        return this.eth_call(functions.getOracle, [])
    }

    eip712Domain(): Promise<([name: string, version: string, chainId: bigint, verifyingContract: string] & {name: string, version: string, chainId: bigint, verifyingContract: string})> {
        return this.eth_call(functions.eip712Domain, [])
    }

    getContractVersion(): Promise<bigint> {
        return this.eth_call(functions.getContractVersion, [])
    }

    getInitializationBlock(): Promise<bigint> {
        return this.eth_call(functions.getInitializationBlock, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    getEIP712StETH(): Promise<string> {
        return this.eth_call(functions.getEIP712StETH, [])
    }

    canPerform(_sender: string, _role: string, _params: Array<bigint>): Promise<boolean> {
        return this.eth_call(functions.canPerform, [_sender, _role, _params])
    }

    getEVMScriptRegistry(): Promise<string> {
        return this.eth_call(functions.getEVMScriptRegistry, [])
    }

    UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE(): Promise<string> {
        return this.eth_call(functions.UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE, [])
    }

    getBeaconStat(): Promise<([depositedValidators: bigint, beaconValidators: bigint, beaconBalance: bigint] & {depositedValidators: bigint, beaconValidators: bigint, beaconBalance: bigint})> {
        return this.eth_call(functions.getBeaconStat, [])
    }

    getFee(): Promise<number> {
        return this.eth_call(functions.getFee, [])
    }

    kernel(): Promise<string> {
        return this.eth_call(functions.kernel, [])
    }

    getTotalShares(): Promise<bigint> {
        return this.eth_call(functions.getTotalShares, [])
    }

    allowance(_owner: string, _spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [_owner, _spender])
    }

    isPetrified(): Promise<boolean> {
        return this.eth_call(functions.isPetrified, [])
    }

    getLidoLocator(): Promise<string> {
        return this.eth_call(functions.getLidoLocator, [])
    }

    canDeposit(): Promise<boolean> {
        return this.eth_call(functions.canDeposit, [])
    }

    STAKING_PAUSE_ROLE(): Promise<string> {
        return this.eth_call(functions.STAKING_PAUSE_ROLE, [])
    }

    getDepositableEther(): Promise<bigint> {
        return this.eth_call(functions.getDepositableEther, [])
    }

    sharesOf(_account: string): Promise<bigint> {
        return this.eth_call(functions.sharesOf, [_account])
    }

    getTotalELRewardsCollected(): Promise<bigint> {
        return this.eth_call(functions.getTotalELRewardsCollected, [])
    }
}
