import { address, bool, bytes32, int256, string, struct, uint128, uint224, uint256, uint32, uint8 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** DOMAIN_SEPARATOR() */
export const DOMAIN_SEPARATOR = func('0x3644e515', {}, bytes32)
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof DOMAIN_SEPARATOR>

/** accRewardPerShare() */
export const accRewardPerShare = func('0x939d6237', {}, uint256)
export type AccRewardPerShareParams = FunctionArguments<typeof accRewardPerShare>
export type AccRewardPerShareReturn = FunctionReturn<typeof accRewardPerShare>

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    owner: address,
    spender: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    spender: address,
    amount: uint256,
}, bool)
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** asset() */
export const asset = func('0x38d52e0f', {}, address)
export type AssetParams = FunctionArguments<typeof asset>
export type AssetReturn = FunctionReturn<typeof asset>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    account: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** checkpoints(address,uint32) */
export const checkpoints = func('0xf1127ed8', {
    account: address,
    pos: uint32,
}, struct({
    fromBlock: uint32,
    votes: uint224,
}))
export type CheckpointsParams = FunctionArguments<typeof checkpoints>
export type CheckpointsReturn = FunctionReturn<typeof checkpoints>

/** collectRewards() */
export const collectRewards = func('0x70bb45b3', {})
export type CollectRewardsParams = FunctionArguments<typeof collectRewards>
export type CollectRewardsReturn = FunctionReturn<typeof collectRewards>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint8)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** decreaseAllowance(address,uint256) */
export const decreaseAllowance = func('0xa457c2d7', {
    spender: address,
    subtractedValue: uint256,
}, bool)
export type DecreaseAllowanceParams = FunctionArguments<typeof decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof decreaseAllowance>

/** delegate(address) */
export const delegate = func('0x5c19a95c', {
    delegatee: address,
})
export type DelegateParams = FunctionArguments<typeof delegate>
export type DelegateReturn = FunctionReturn<typeof delegate>

/** delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32) */
export const delegateBySig = func('0xc3cda520', {
    delegatee: address,
    nonce: uint256,
    expiry: uint256,
    v: uint8,
    r: bytes32,
    s: bytes32,
})
export type DelegateBySigParams = FunctionArguments<typeof delegateBySig>
export type DelegateBySigReturn = FunctionReturn<typeof delegateBySig>

/** delegates(address) */
export const delegates = func('0x587cde1e', {
    account: address,
}, address)
export type DelegatesParams = FunctionArguments<typeof delegates>
export type DelegatesReturn = FunctionReturn<typeof delegates>

/** epoch() */
export const epoch = func('0x900cf0cf', {}, uint256)
export type EpochParams = FunctionArguments<typeof epoch>
export type EpochReturn = FunctionReturn<typeof epoch>

/** getPastTotalSupply(uint256) */
export const getPastTotalSupply = func('0x8e539e8c', {
    blockNumber: uint256,
}, uint256)
export type GetPastTotalSupplyParams = FunctionArguments<typeof getPastTotalSupply>
export type GetPastTotalSupplyReturn = FunctionReturn<typeof getPastTotalSupply>

/** getPastVotes(address,uint256) */
export const getPastVotes = func('0x3a46b1a8', {
    account: address,
    blockNumber: uint256,
}, uint256)
export type GetPastVotesParams = FunctionArguments<typeof getPastVotes>
export type GetPastVotesReturn = FunctionReturn<typeof getPastVotes>

/** getVotes(address) */
export const getVotes = func('0x9ab24eb0', {
    account: address,
}, uint256)
export type GetVotesParams = FunctionArguments<typeof getVotes>
export type GetVotesReturn = FunctionReturn<typeof getVotes>

/** increaseAllowance(address,uint256) */
export const increaseAllowance = func('0x39509351', {
    spender: address,
    addedValue: uint256,
}, bool)
export type IncreaseAllowanceParams = FunctionArguments<typeof increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof increaseAllowance>

/** lockups(address,uint256) */
export const lockups = func('0xc93d0b1e', {
    _0: address,
    _1: uint256,
}, struct({
    amount: uint128,
    end: uint128,
    points: uint256,
}))
export type LockupsParams = FunctionArguments<typeof lockups>
export type LockupsReturn = FunctionReturn<typeof lockups>

/** lockupsCount(address) */
export const lockupsCount = func('0xd1a1ad81', {
    user: address,
}, uint256)
export type LockupsCountParams = FunctionArguments<typeof lockupsCount>
export type LockupsCountReturn = FunctionReturn<typeof lockupsCount>

/** maxStakeDuration() */
export const maxStakeDuration = func('0x76f70003', {}, uint256)
export type MaxStakeDurationParams = FunctionArguments<typeof maxStakeDuration>
export type MaxStakeDurationReturn = FunctionReturn<typeof maxStakeDuration>

/** minStakeDuration() */
export const minStakeDuration = func('0x5fec5c64', {}, uint256)
export type MinStakeDurationParams = FunctionArguments<typeof minStakeDuration>
export type MinStakeDurationReturn = FunctionReturn<typeof minStakeDuration>

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** nonces(address) */
export const nonces = func('0x7ecebe00', {
    owner: address,
}, uint256)
export type NoncesParams = FunctionArguments<typeof nonces>
export type NoncesReturn = FunctionReturn<typeof nonces>

/** numCheckpoints(address) */
export const numCheckpoints = func('0x6fcfff45', {
    account: address,
}, uint32)
export type NumCheckpointsParams = FunctionArguments<typeof numCheckpoints>
export type NumCheckpointsReturn = FunctionReturn<typeof numCheckpoints>

/** permit(address,address,uint256,uint256,uint8,bytes32,bytes32) */
export const permit = func('0xd505accf', {
    owner: address,
    spender: address,
    value: uint256,
    deadline: uint256,
    v: uint8,
    r: bytes32,
    s: bytes32,
})
export type PermitParams = FunctionArguments<typeof permit>
export type PermitReturn = FunctionReturn<typeof permit>

/** previewPoints(uint256,uint256) */
export const previewPoints = func('0x4fd0e648', {
    amount: uint256,
    duration: uint256,
}, struct({
    _0: uint256,
    _1: uint256,
}))
export type PreviewPointsParams = FunctionArguments<typeof previewPoints>
export type PreviewPointsReturn = FunctionReturn<typeof previewPoints>

/** previewRewards(address) */
export const previewRewards = func('0xf166e920', {
    user: address,
}, uint256)
export type PreviewRewardsParams = FunctionArguments<typeof previewRewards>
export type PreviewRewardsReturn = FunctionReturn<typeof previewRewards>

/** previewWithdraw(uint256,uint256) */
export const previewWithdraw = func('0x488bd7b0', {
    amount: uint256,
    end: uint256,
}, uint256)
export type PreviewWithdrawParams = FunctionArguments<typeof previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof previewWithdraw>

/** rewardDebtPerShare(address) */
export const rewardDebtPerShare = func('0x4423bf57', {
    _0: address,
}, uint256)
export type RewardDebtPerShareParams = FunctionArguments<typeof rewardDebtPerShare>
export type RewardDebtPerShareReturn = FunctionReturn<typeof rewardDebtPerShare>

/** rewardsSource() */
export const rewardsSource = func('0xf7240d2f', {}, address)
export type RewardsSourceParams = FunctionArguments<typeof rewardsSource>
export type RewardsSourceReturn = FunctionReturn<typeof rewardsSource>

/** stake(uint256,uint256,address,bool,int256) */
export const stake = func('0x5cd42a92', {
    amountIn: uint256,
    duration: uint256,
    to: address,
    stakeRewards: bool,
    lockupId: int256,
})
export type StakeParams = FunctionArguments<typeof stake>
export type StakeReturn = FunctionReturn<typeof stake>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    _0: address,
    _1: uint256,
}, bool)
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    _0: address,
    _1: address,
    _2: uint256,
}, bool)
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** unstake(uint256) */
export const unstake = func('0x2e17de78', {
    lockupId: uint256,
})
export type UnstakeParams = FunctionArguments<typeof unstake>
export type UnstakeReturn = FunctionReturn<typeof unstake>
