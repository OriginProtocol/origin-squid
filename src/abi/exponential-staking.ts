import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    DelegateChanged: event("0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f", "DelegateChanged(address,address,address)", {"delegator": indexed(p.address), "fromDelegate": indexed(p.address), "toDelegate": indexed(p.address)}),
    DelegateVotesChanged: event("0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724", "DelegateVotesChanged(address,uint256,uint256)", {"delegate": indexed(p.address), "previousBalance": p.uint256, "newBalance": p.uint256}),
    Penalty: event("0x322e5021ddf51920f7602154a6c845b34ef1b32704a1fa2c66927b56be280762", "Penalty(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
    Reward: event("0x619caafabdd75649b302ba8419e48cccf64f37f1983ac4727cfb38b57703ffc9", "Reward(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
    Stake: event("0x2720efa4b2dd4f3f8a347da3cbd290a522e9432da9072c5b8e6300496fdde282", "Stake(address,uint256,uint256,uint256,uint256)", {"user": indexed(p.address), "lockupId": p.uint256, "amount": p.uint256, "end": p.uint256, "points": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Unstake: event("0x05b744e3e9358bc00ba3cc0c6606a4d6536134dba00b2d2ee4b5de169acd6427", "Unstake(address,uint256,uint256,uint256,uint256)", {"user": indexed(p.address), "lockupId": p.uint256, "amount": p.uint256, "end": p.uint256, "points": p.uint256}),
}

export const functions = {
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    accRewardPerShare: viewFun("0x939d6237", "accRewardPerShare()", {}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    asset: viewFun("0x38d52e0f", "asset()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    checkpoints: viewFun("0xf1127ed8", "checkpoints(address,uint32)", {"account": p.address, "pos": p.uint32}, p.struct({"fromBlock": p.uint32, "votes": p.uint224})),
    collectRewards: fun("0x70bb45b3", "collectRewards()", {}, ),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"spender": p.address, "subtractedValue": p.uint256}, p.bool),
    delegate: fun("0x5c19a95c", "delegate(address)", {"delegatee": p.address}, ),
    delegateBySig: fun("0xc3cda520", "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)", {"delegatee": p.address, "nonce": p.uint256, "expiry": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    delegates: viewFun("0x587cde1e", "delegates(address)", {"account": p.address}, p.address),
    epoch: viewFun("0x900cf0cf", "epoch()", {}, p.uint256),
    getPastTotalSupply: viewFun("0x8e539e8c", "getPastTotalSupply(uint256)", {"blockNumber": p.uint256}, p.uint256),
    getPastVotes: viewFun("0x3a46b1a8", "getPastVotes(address,uint256)", {"account": p.address, "blockNumber": p.uint256}, p.uint256),
    getVotes: viewFun("0x9ab24eb0", "getVotes(address)", {"account": p.address}, p.uint256),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"spender": p.address, "addedValue": p.uint256}, p.bool),
    lockups: viewFun("0xc93d0b1e", "lockups(address,uint256)", {"_0": p.address, "_1": p.uint256}, {"amount": p.uint128, "end": p.uint128, "points": p.uint256}),
    lockupsCount: viewFun("0xd1a1ad81", "lockupsCount(address)", {"user": p.address}, p.uint256),
    maxStakeDuration: viewFun("0x76f70003", "maxStakeDuration()", {}, p.uint256),
    minStakeDuration: viewFun("0x5fec5c64", "minStakeDuration()", {}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"owner": p.address}, p.uint256),
    numCheckpoints: viewFun("0x6fcfff45", "numCheckpoints(address)", {"account": p.address}, p.uint32),
    permit: fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    previewPoints: viewFun("0x4fd0e648", "previewPoints(uint256,uint256)", {"amount": p.uint256, "duration": p.uint256}, {"_0": p.uint256, "_1": p.uint256}),
    previewRewards: viewFun("0xf166e920", "previewRewards(address)", {"user": p.address}, p.uint256),
    previewWithdraw: viewFun("0x488bd7b0", "previewWithdraw(uint256,uint256)", {"amount": p.uint256, "end": p.uint256}, p.uint256),
    rewardDebtPerShare: viewFun("0x4423bf57", "rewardDebtPerShare(address)", {"_0": p.address}, p.uint256),
    rewardsSource: viewFun("0xf7240d2f", "rewardsSource()", {}, p.address),
    stake: fun("0x5cd42a92", "stake(uint256,uint256,address,bool,int256)", {"amountIn": p.uint256, "duration": p.uint256, "to": p.address, "stakeRewards": p.bool, "lockupId": p.int256}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_0": p.address, "_1": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_0": p.address, "_1": p.address, "_2": p.uint256}, p.bool),
    unstake: fun("0x2e17de78", "unstake(uint256)", {"lockupId": p.uint256}, ),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    accRewardPerShare() {
        return this.eth_call(functions.accRewardPerShare, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    checkpoints(account: CheckpointsParams["account"], pos: CheckpointsParams["pos"]) {
        return this.eth_call(functions.checkpoints, {account, pos})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    delegates(account: DelegatesParams["account"]) {
        return this.eth_call(functions.delegates, {account})
    }

    epoch() {
        return this.eth_call(functions.epoch, {})
    }

    getPastTotalSupply(blockNumber: GetPastTotalSupplyParams["blockNumber"]) {
        return this.eth_call(functions.getPastTotalSupply, {blockNumber})
    }

    getPastVotes(account: GetPastVotesParams["account"], blockNumber: GetPastVotesParams["blockNumber"]) {
        return this.eth_call(functions.getPastVotes, {account, blockNumber})
    }

    getVotes(account: GetVotesParams["account"]) {
        return this.eth_call(functions.getVotes, {account})
    }

    lockups(_0: LockupsParams["_0"], _1: LockupsParams["_1"]) {
        return this.eth_call(functions.lockups, {_0, _1})
    }

    lockupsCount(user: LockupsCountParams["user"]) {
        return this.eth_call(functions.lockupsCount, {user})
    }

    maxStakeDuration() {
        return this.eth_call(functions.maxStakeDuration, {})
    }

    minStakeDuration() {
        return this.eth_call(functions.minStakeDuration, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(functions.nonces, {owner})
    }

    numCheckpoints(account: NumCheckpointsParams["account"]) {
        return this.eth_call(functions.numCheckpoints, {account})
    }

    previewPoints(amount: PreviewPointsParams["amount"], duration: PreviewPointsParams["duration"]) {
        return this.eth_call(functions.previewPoints, {amount, duration})
    }

    previewRewards(user: PreviewRewardsParams["user"]) {
        return this.eth_call(functions.previewRewards, {user})
    }

    previewWithdraw(amount: PreviewWithdrawParams["amount"], end: PreviewWithdrawParams["end"]) {
        return this.eth_call(functions.previewWithdraw, {amount, end})
    }

    rewardDebtPerShare(_0: RewardDebtPerShareParams["_0"]) {
        return this.eth_call(functions.rewardDebtPerShare, {_0})
    }

    rewardsSource() {
        return this.eth_call(functions.rewardsSource, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DelegateChangedEventArgs = EParams<typeof events.DelegateChanged>
export type DelegateVotesChangedEventArgs = EParams<typeof events.DelegateVotesChanged>
export type PenaltyEventArgs = EParams<typeof events.Penalty>
export type RewardEventArgs = EParams<typeof events.Reward>
export type StakeEventArgs = EParams<typeof events.Stake>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UnstakeEventArgs = EParams<typeof events.Unstake>

/// Function types
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type AccRewardPerShareParams = FunctionArguments<typeof functions.accRewardPerShare>
export type AccRewardPerShareReturn = FunctionReturn<typeof functions.accRewardPerShare>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssetParams = FunctionArguments<typeof functions.asset>
export type AssetReturn = FunctionReturn<typeof functions.asset>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type CheckpointsParams = FunctionArguments<typeof functions.checkpoints>
export type CheckpointsReturn = FunctionReturn<typeof functions.checkpoints>

export type CollectRewardsParams = FunctionArguments<typeof functions.collectRewards>
export type CollectRewardsReturn = FunctionReturn<typeof functions.collectRewards>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type DelegateParams = FunctionArguments<typeof functions.delegate>
export type DelegateReturn = FunctionReturn<typeof functions.delegate>

export type DelegateBySigParams = FunctionArguments<typeof functions.delegateBySig>
export type DelegateBySigReturn = FunctionReturn<typeof functions.delegateBySig>

export type DelegatesParams = FunctionArguments<typeof functions.delegates>
export type DelegatesReturn = FunctionReturn<typeof functions.delegates>

export type EpochParams = FunctionArguments<typeof functions.epoch>
export type EpochReturn = FunctionReturn<typeof functions.epoch>

export type GetPastTotalSupplyParams = FunctionArguments<typeof functions.getPastTotalSupply>
export type GetPastTotalSupplyReturn = FunctionReturn<typeof functions.getPastTotalSupply>

export type GetPastVotesParams = FunctionArguments<typeof functions.getPastVotes>
export type GetPastVotesReturn = FunctionReturn<typeof functions.getPastVotes>

export type GetVotesParams = FunctionArguments<typeof functions.getVotes>
export type GetVotesReturn = FunctionReturn<typeof functions.getVotes>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type LockupsParams = FunctionArguments<typeof functions.lockups>
export type LockupsReturn = FunctionReturn<typeof functions.lockups>

export type LockupsCountParams = FunctionArguments<typeof functions.lockupsCount>
export type LockupsCountReturn = FunctionReturn<typeof functions.lockupsCount>

export type MaxStakeDurationParams = FunctionArguments<typeof functions.maxStakeDuration>
export type MaxStakeDurationReturn = FunctionReturn<typeof functions.maxStakeDuration>

export type MinStakeDurationParams = FunctionArguments<typeof functions.minStakeDuration>
export type MinStakeDurationReturn = FunctionReturn<typeof functions.minStakeDuration>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type NumCheckpointsParams = FunctionArguments<typeof functions.numCheckpoints>
export type NumCheckpointsReturn = FunctionReturn<typeof functions.numCheckpoints>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type PreviewPointsParams = FunctionArguments<typeof functions.previewPoints>
export type PreviewPointsReturn = FunctionReturn<typeof functions.previewPoints>

export type PreviewRewardsParams = FunctionArguments<typeof functions.previewRewards>
export type PreviewRewardsReturn = FunctionReturn<typeof functions.previewRewards>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type RewardDebtPerShareParams = FunctionArguments<typeof functions.rewardDebtPerShare>
export type RewardDebtPerShareReturn = FunctionReturn<typeof functions.rewardDebtPerShare>

export type RewardsSourceParams = FunctionArguments<typeof functions.rewardsSource>
export type RewardsSourceReturn = FunctionReturn<typeof functions.rewardsSource>

export type StakeParams = FunctionArguments<typeof functions.stake>
export type StakeReturn = FunctionReturn<typeof functions.stake>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UnstakeParams = FunctionArguments<typeof functions.unstake>
export type UnstakeReturn = FunctionReturn<typeof functions.unstake>

