import { ContractBase } from '../abi.support.js'
import { DOMAIN_SEPARATOR, accRewardPerShare, allowance, approve, balanceOf, checkpoints, decimals, decreaseAllowance, delegates, epoch, getPastTotalSupply, getPastVotes, getVotes, increaseAllowance, lockups, minStakeDuration, name, nonces, numCheckpoints, ogv, previewPoints, previewRewards, rewardDebtPerShare, rewardsSource, symbol, totalSupply, transfer, transferFrom } from './functions.js'
import type { AllowanceParams, ApproveParams, BalanceOfParams, CheckpointsParams, DecreaseAllowanceParams, DelegatesParams, GetPastTotalSupplyParams, GetPastVotesParams, GetVotesParams, IncreaseAllowanceParams, LockupsParams, NoncesParams, NumCheckpointsParams, PreviewPointsParams, PreviewRewardsParams, RewardDebtPerShareParams, TransferFromParams, TransferParams } from './functions.js'

export class Contract extends ContractBase {
    DOMAIN_SEPARATOR() {
        return this.eth_call(DOMAIN_SEPARATOR, {})
    }

    accRewardPerShare() {
        return this.eth_call(accRewardPerShare, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(allowance, {owner, spender})
    }

    approve(spender: ApproveParams["spender"], amount: ApproveParams["amount"]) {
        return this.eth_call(approve, {spender, amount})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(balanceOf, {account})
    }

    checkpoints(account: CheckpointsParams["account"], pos: CheckpointsParams["pos"]) {
        return this.eth_call(checkpoints, {account, pos})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    decreaseAllowance(spender: DecreaseAllowanceParams["spender"], subtractedValue: DecreaseAllowanceParams["subtractedValue"]) {
        return this.eth_call(decreaseAllowance, {spender, subtractedValue})
    }

    delegates(account: DelegatesParams["account"]) {
        return this.eth_call(delegates, {account})
    }

    epoch() {
        return this.eth_call(epoch, {})
    }

    getPastTotalSupply(blockNumber: GetPastTotalSupplyParams["blockNumber"]) {
        return this.eth_call(getPastTotalSupply, {blockNumber})
    }

    getPastVotes(account: GetPastVotesParams["account"], blockNumber: GetPastVotesParams["blockNumber"]) {
        return this.eth_call(getPastVotes, {account, blockNumber})
    }

    getVotes(account: GetVotesParams["account"]) {
        return this.eth_call(getVotes, {account})
    }

    increaseAllowance(spender: IncreaseAllowanceParams["spender"], addedValue: IncreaseAllowanceParams["addedValue"]) {
        return this.eth_call(increaseAllowance, {spender, addedValue})
    }

    lockups(_0: LockupsParams["_0"], _1: LockupsParams["_1"]) {
        return this.eth_call(lockups, {_0, _1})
    }

    minStakeDuration() {
        return this.eth_call(minStakeDuration, {})
    }

    name() {
        return this.eth_call(name, {})
    }

    nonces(owner: NoncesParams["owner"]) {
        return this.eth_call(nonces, {owner})
    }

    numCheckpoints(account: NumCheckpointsParams["account"]) {
        return this.eth_call(numCheckpoints, {account})
    }

    ogv() {
        return this.eth_call(ogv, {})
    }

    previewPoints(amount: PreviewPointsParams["amount"], duration: PreviewPointsParams["duration"]) {
        return this.eth_call(previewPoints, {amount, duration})
    }

    previewRewards(user: PreviewRewardsParams["user"]) {
        return this.eth_call(previewRewards, {user})
    }

    rewardDebtPerShare(_0: RewardDebtPerShareParams["_0"]) {
        return this.eth_call(rewardDebtPerShare, {_0})
    }

    rewardsSource() {
        return this.eth_call(rewardsSource, {})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    transfer(_0: TransferParams["_0"], _1: TransferParams["_1"]) {
        return this.eth_call(transfer, {_0, _1})
    }

    transferFrom(_0: TransferFromParams["_0"], _1: TransferFromParams["_1"], _2: TransferFromParams["_2"]) {
        return this.eth_call(transferFrom, {_0, _1, _2})
    }
}
