import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"caller": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    RewardAdded: event("0xde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d", "RewardAdded(uint256)", {"reward": p.uint256}),
    RewardPaid: event("0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486", "RewardPaid(address,uint256)", {"user": indexed(p.address), "reward": p.uint256}),
    Staked: event("0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d", "Staked(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", "Withdraw(address,address,address,uint256,uint256)", {"caller": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    Withdrawn: event("0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5", "Withdrawn(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    addExtraReward: fun("0x5e43c47b", "addExtraReward(address)", {"_reward": p.address}, p.bool),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    asset: viewFun("0x38d52e0f", "asset()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    clearExtraRewards: fun("0x0569d388", "clearExtraRewards()", {}, ),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets": p.uint256}, p.uint256),
    currentRewards: viewFun("0x901a7d53", "currentRewards()", {}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    deposit: fun("0x6e553f65", "deposit(uint256,address)", {"assets": p.uint256, "receiver": p.address}, p.uint256),
    duration: viewFun("0x0fb5a6b4", "duration()", {}, p.uint256),
    earned: viewFun("0x008cc262", "earned(address)", {"account": p.address}, p.uint256),
    extraRewards: viewFun("0x40c35446", "extraRewards(uint256)", {"_0": p.uint256}, p.address),
    extraRewardsLength: viewFun("0xd55a23f4", "extraRewardsLength()", {}, p.uint256),
    "getReward()": fun("0x3d18b912", "getReward()", {}, p.bool),
    "getReward(address,bool)": fun("0x7050ccd9", "getReward(address,bool)", {"_account": p.address, "_claimExtras": p.bool}, p.bool),
    historicalRewards: viewFun("0x262d3d6d", "historicalRewards()", {}, p.uint256),
    lastTimeRewardApplicable: viewFun("0x80faa57d", "lastTimeRewardApplicable()", {}, p.uint256),
    lastUpdateTime: viewFun("0xc8f33c91", "lastUpdateTime()", {}, p.uint256),
    maxDeposit: viewFun("0x402d267d", "maxDeposit(address)", {"_0": p.address}, p.uint256),
    maxMint: viewFun("0xc63d75b6", "maxMint(address)", {"owner": p.address}, p.uint256),
    maxRedeem: viewFun("0xd905777e", "maxRedeem(address)", {"owner": p.address}, p.uint256),
    maxWithdraw: viewFun("0xce96cb77", "maxWithdraw(address)", {"owner": p.address}, p.uint256),
    mint: fun("0x94bf804d", "mint(uint256,address)", {"shares": p.uint256, "receiver": p.address}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    newRewardRatio: viewFun("0x6c8bcee8", "newRewardRatio()", {}, p.uint256),
    operator: viewFun("0x570ca735", "operator()", {}, p.address),
    periodFinish: viewFun("0xebe2b12b", "periodFinish()", {}, p.uint256),
    pid: viewFun("0xf1068454", "pid()", {}, p.uint256),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"assets": p.uint256}, p.uint256),
    previewMint: viewFun("0xb3d7f6b9", "previewMint(uint256)", {"shares": p.uint256}, p.uint256),
    previewRedeem: viewFun("0x4cdad506", "previewRedeem(uint256)", {"shares": p.uint256}, p.uint256),
    previewWithdraw: viewFun("0x0a28a477", "previewWithdraw(uint256)", {"assets": p.uint256}, p.uint256),
    processIdleRewards: fun("0x3e8b83e3", "processIdleRewards()", {}, ),
    queueNewRewards: fun("0x590a41f5", "queueNewRewards(uint256)", {"_rewards": p.uint256}, p.bool),
    queuedRewards: viewFun("0x63d38c3b", "queuedRewards()", {}, p.uint256),
    redeem: fun("0xba087652", "redeem(uint256,address,address)", {"shares": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
    rewardManager: viewFun("0x0f4ef8a6", "rewardManager()", {}, p.address),
    rewardPerToken: viewFun("0xcd3daf9d", "rewardPerToken()", {}, p.uint256),
    rewardPerTokenStored: viewFun("0xdf136d65", "rewardPerTokenStored()", {}, p.uint256),
    rewardRate: viewFun("0x7b0a47ee", "rewardRate()", {}, p.uint256),
    rewardToken: viewFun("0xf7c618c1", "rewardToken()", {}, p.address),
    rewards: viewFun("0x0700037d", "rewards(address)", {"_0": p.address}, p.uint256),
    stake: fun("0xa694fc3a", "stake(uint256)", {"_amount": p.uint256}, p.bool),
    stakeAll: fun("0x8dcb4061", "stakeAll()", {}, p.bool),
    stakeFor: fun("0x2ee40908", "stakeFor(address,uint256)", {"_for": p.address, "_amount": p.uint256}, p.bool),
    stakingToken: viewFun("0x72f702f3", "stakingToken()", {}, p.address),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_0": p.address, "_1": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_0": p.address, "_1": p.address, "_2": p.uint256}, p.bool),
    userRewardPerTokenPaid: viewFun("0x8b876347", "userRewardPerTokenPaid(address)", {"_0": p.address}, p.uint256),
    "withdraw(uint256,bool)": fun("0x38d07436", "withdraw(uint256,bool)", {"amount": p.uint256, "claim": p.bool}, p.bool),
    "withdraw(uint256,address,address)": fun("0xb460af94", "withdraw(uint256,address,address)", {"assets": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
    withdrawAll: fun("0x1c1c6fe5", "withdrawAll(bool)", {"claim": p.bool}, ),
    withdrawAllAndUnwrap: fun("0x49f039a2", "withdrawAllAndUnwrap(bool)", {"claim": p.bool}, ),
    withdrawAndUnwrap: fun("0xc32e7202", "withdrawAndUnwrap(uint256,bool)", {"amount": p.uint256, "claim": p.bool}, p.bool),
}

export class Contract extends ContractBase {

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    currentRewards() {
        return this.eth_call(functions.currentRewards, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    duration() {
        return this.eth_call(functions.duration, {})
    }

    earned(account: EarnedParams["account"]) {
        return this.eth_call(functions.earned, {account})
    }

    extraRewards(_0: ExtraRewardsParams["_0"]) {
        return this.eth_call(functions.extraRewards, {_0})
    }

    extraRewardsLength() {
        return this.eth_call(functions.extraRewardsLength, {})
    }

    historicalRewards() {
        return this.eth_call(functions.historicalRewards, {})
    }

    lastTimeRewardApplicable() {
        return this.eth_call(functions.lastTimeRewardApplicable, {})
    }

    lastUpdateTime() {
        return this.eth_call(functions.lastUpdateTime, {})
    }

    maxDeposit(_0: MaxDepositParams["_0"]) {
        return this.eth_call(functions.maxDeposit, {_0})
    }

    maxMint(owner: MaxMintParams["owner"]) {
        return this.eth_call(functions.maxMint, {owner})
    }

    maxRedeem(owner: MaxRedeemParams["owner"]) {
        return this.eth_call(functions.maxRedeem, {owner})
    }

    maxWithdraw(owner: MaxWithdrawParams["owner"]) {
        return this.eth_call(functions.maxWithdraw, {owner})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    newRewardRatio() {
        return this.eth_call(functions.newRewardRatio, {})
    }

    operator() {
        return this.eth_call(functions.operator, {})
    }

    periodFinish() {
        return this.eth_call(functions.periodFinish, {})
    }

    pid() {
        return this.eth_call(functions.pid, {})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(functions.previewDeposit, {assets})
    }

    previewMint(shares: PreviewMintParams["shares"]) {
        return this.eth_call(functions.previewMint, {shares})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(functions.previewRedeem, {shares})
    }

    previewWithdraw(assets: PreviewWithdrawParams["assets"]) {
        return this.eth_call(functions.previewWithdraw, {assets})
    }

    queuedRewards() {
        return this.eth_call(functions.queuedRewards, {})
    }

    rewardManager() {
        return this.eth_call(functions.rewardManager, {})
    }

    rewardPerToken() {
        return this.eth_call(functions.rewardPerToken, {})
    }

    rewardPerTokenStored() {
        return this.eth_call(functions.rewardPerTokenStored, {})
    }

    rewardRate() {
        return this.eth_call(functions.rewardRate, {})
    }

    rewardToken() {
        return this.eth_call(functions.rewardToken, {})
    }

    rewards(_0: RewardsParams["_0"]) {
        return this.eth_call(functions.rewards, {_0})
    }

    stakingToken() {
        return this.eth_call(functions.stakingToken, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    userRewardPerTokenPaid(_0: UserRewardPerTokenPaidParams["_0"]) {
        return this.eth_call(functions.userRewardPerTokenPaid, {_0})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type RewardAddedEventArgs = EParams<typeof events.RewardAdded>
export type RewardPaidEventArgs = EParams<typeof events.RewardPaid>
export type StakedEventArgs = EParams<typeof events.Staked>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type AddExtraRewardParams = FunctionArguments<typeof functions.addExtraReward>
export type AddExtraRewardReturn = FunctionReturn<typeof functions.addExtraReward>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssetParams = FunctionArguments<typeof functions.asset>
export type AssetReturn = FunctionReturn<typeof functions.asset>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ClearExtraRewardsParams = FunctionArguments<typeof functions.clearExtraRewards>
export type ClearExtraRewardsReturn = FunctionReturn<typeof functions.clearExtraRewards>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type CurrentRewardsParams = FunctionArguments<typeof functions.currentRewards>
export type CurrentRewardsReturn = FunctionReturn<typeof functions.currentRewards>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DurationParams = FunctionArguments<typeof functions.duration>
export type DurationReturn = FunctionReturn<typeof functions.duration>

export type EarnedParams = FunctionArguments<typeof functions.earned>
export type EarnedReturn = FunctionReturn<typeof functions.earned>

export type ExtraRewardsParams = FunctionArguments<typeof functions.extraRewards>
export type ExtraRewardsReturn = FunctionReturn<typeof functions.extraRewards>

export type ExtraRewardsLengthParams = FunctionArguments<typeof functions.extraRewardsLength>
export type ExtraRewardsLengthReturn = FunctionReturn<typeof functions.extraRewardsLength>

export type GetRewardParams_0 = FunctionArguments<typeof functions["getReward()"]>
export type GetRewardReturn_0 = FunctionReturn<typeof functions["getReward()"]>

export type GetRewardParams_1 = FunctionArguments<typeof functions["getReward(address,bool)"]>
export type GetRewardReturn_1 = FunctionReturn<typeof functions["getReward(address,bool)"]>

export type HistoricalRewardsParams = FunctionArguments<typeof functions.historicalRewards>
export type HistoricalRewardsReturn = FunctionReturn<typeof functions.historicalRewards>

export type LastTimeRewardApplicableParams = FunctionArguments<typeof functions.lastTimeRewardApplicable>
export type LastTimeRewardApplicableReturn = FunctionReturn<typeof functions.lastTimeRewardApplicable>

export type LastUpdateTimeParams = FunctionArguments<typeof functions.lastUpdateTime>
export type LastUpdateTimeReturn = FunctionReturn<typeof functions.lastUpdateTime>

export type MaxDepositParams = FunctionArguments<typeof functions.maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof functions.maxDeposit>

export type MaxMintParams = FunctionArguments<typeof functions.maxMint>
export type MaxMintReturn = FunctionReturn<typeof functions.maxMint>

export type MaxRedeemParams = FunctionArguments<typeof functions.maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof functions.maxRedeem>

export type MaxWithdrawParams = FunctionArguments<typeof functions.maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof functions.maxWithdraw>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NewRewardRatioParams = FunctionArguments<typeof functions.newRewardRatio>
export type NewRewardRatioReturn = FunctionReturn<typeof functions.newRewardRatio>

export type OperatorParams = FunctionArguments<typeof functions.operator>
export type OperatorReturn = FunctionReturn<typeof functions.operator>

export type PeriodFinishParams = FunctionArguments<typeof functions.periodFinish>
export type PeriodFinishReturn = FunctionReturn<typeof functions.periodFinish>

export type PidParams = FunctionArguments<typeof functions.pid>
export type PidReturn = FunctionReturn<typeof functions.pid>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewMintParams = FunctionArguments<typeof functions.previewMint>
export type PreviewMintReturn = FunctionReturn<typeof functions.previewMint>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type ProcessIdleRewardsParams = FunctionArguments<typeof functions.processIdleRewards>
export type ProcessIdleRewardsReturn = FunctionReturn<typeof functions.processIdleRewards>

export type QueueNewRewardsParams = FunctionArguments<typeof functions.queueNewRewards>
export type QueueNewRewardsReturn = FunctionReturn<typeof functions.queueNewRewards>

export type QueuedRewardsParams = FunctionArguments<typeof functions.queuedRewards>
export type QueuedRewardsReturn = FunctionReturn<typeof functions.queuedRewards>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RewardManagerParams = FunctionArguments<typeof functions.rewardManager>
export type RewardManagerReturn = FunctionReturn<typeof functions.rewardManager>

export type RewardPerTokenParams = FunctionArguments<typeof functions.rewardPerToken>
export type RewardPerTokenReturn = FunctionReturn<typeof functions.rewardPerToken>

export type RewardPerTokenStoredParams = FunctionArguments<typeof functions.rewardPerTokenStored>
export type RewardPerTokenStoredReturn = FunctionReturn<typeof functions.rewardPerTokenStored>

export type RewardRateParams = FunctionArguments<typeof functions.rewardRate>
export type RewardRateReturn = FunctionReturn<typeof functions.rewardRate>

export type RewardTokenParams = FunctionArguments<typeof functions.rewardToken>
export type RewardTokenReturn = FunctionReturn<typeof functions.rewardToken>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type StakeParams = FunctionArguments<typeof functions.stake>
export type StakeReturn = FunctionReturn<typeof functions.stake>

export type StakeAllParams = FunctionArguments<typeof functions.stakeAll>
export type StakeAllReturn = FunctionReturn<typeof functions.stakeAll>

export type StakeForParams = FunctionArguments<typeof functions.stakeFor>
export type StakeForReturn = FunctionReturn<typeof functions.stakeFor>

export type StakingTokenParams = FunctionArguments<typeof functions.stakingToken>
export type StakingTokenReturn = FunctionReturn<typeof functions.stakingToken>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UserRewardPerTokenPaidParams = FunctionArguments<typeof functions.userRewardPerTokenPaid>
export type UserRewardPerTokenPaidReturn = FunctionReturn<typeof functions.userRewardPerTokenPaid>

export type WithdrawParams_0 = FunctionArguments<typeof functions["withdraw(uint256,bool)"]>
export type WithdrawReturn_0 = FunctionReturn<typeof functions["withdraw(uint256,bool)"]>

export type WithdrawParams_1 = FunctionArguments<typeof functions["withdraw(uint256,address,address)"]>
export type WithdrawReturn_1 = FunctionReturn<typeof functions["withdraw(uint256,address,address)"]>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

export type WithdrawAllAndUnwrapParams = FunctionArguments<typeof functions.withdrawAllAndUnwrap>
export type WithdrawAllAndUnwrapReturn = FunctionReturn<typeof functions.withdrawAllAndUnwrap>

export type WithdrawAndUnwrapParams = FunctionArguments<typeof functions.withdrawAndUnwrap>
export type WithdrawAndUnwrapReturn = FunctionReturn<typeof functions.withdrawAndUnwrap>

